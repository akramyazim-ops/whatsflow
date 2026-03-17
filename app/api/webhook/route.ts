import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Auto-reply message in Malay
const AUTO_REPLY_MESSAGE =
    'Hi! Terima kasih kerana hubungi kami. Boleh kami tahu anda berminat dengan produk apa? 😊'

/**
 * GET: Webhook verification for Meta Cloud API
 * Meta sends a challenge to verify the webhook ownership.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === process.env.WEBHOOK_SECRET) {
        console.log('Webhook verified by Meta')
        return new NextResponse(challenge, { status: 200 })
    }

    return new NextResponse('Verification failed', { status: 403 })
}

/**
 * POST: Receive incoming WhatsApp messages from Meta Cloud API
 */
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // Check if it's a valid WhatsApp message event
        if (data.object !== 'whatsapp_business_account') {
            return NextResponse.json({ error: 'Invalid object type' }, { status: 400 })
        }

        const entry = data.entry?.[0]
        const changes = entry?.changes?.[0]
        const value = changes?.value
        const metadata = value?.metadata
        const contact = value?.contacts?.[0]
        const message = value?.messages?.[0]

        if (!message || !contact) {
            // Not a message event (likely a delivery status update)
            return NextResponse.json({ status: 'ignored' }, { status: 200 })
        }

        const fromNumber = contact.wa_id // Phone number of the sender
        const toNumber = metadata?.display_phone_number // Business phone number
        let messageBody = message.text?.body
        
        if (!messageBody) {
             if (message.type === 'image') messageBody = '[Image Received]'
             else if (message.type === 'document') messageBody = '[Document Received]'
             else if (message.type === 'audio') messageBody = '[Audio Received]'
             else if (message.type === 'video') messageBody = '[Video Received]'
             else messageBody = `[Unsupported Message: ${message.type}]`
        }

        // Normalize number for matching (strips non-digits and handles common prefixes)
        const normalize = (num: string) => {
            let digits = num.replace(/\D/g, '')
            // Handle Malaysian standard: 601... or 01...
            if (digits.startsWith('60')) {
                return [digits, '0' + digits.substring(2), '+' + digits]
            } else if (digits.startsWith('0')) {
                return [digits, '60' + digits.substring(1), '+60' + digits.substring(1)]
            }
            return [digits, '60' + digits, '+60' + digits]
        }

        const possibleNumbers = normalize(toNumber || '')

        console.log('Incoming WhatsApp Webhook:', {
            from: fromNumber,
            to: toNumber,
            possibleMatches: possibleNumbers,
            message: messageBody
        })

        // Initialize Supabase with service role key
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Find the profile that owns this WhatsApp number
        // We match by checking all possible normalized formats
        let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, whatsapp_number')
            .or(possibleNumbers.map(n => `whatsapp_number.eq.${n}`).join(','))
            .single()

        if (profileError || !profile) {
            console.log('Profile look-up failed or not found for number:', toNumber, profileError?.message)
            // If we can't find a profile, we might be in "bypass" or "global" mode for testing
            // But for real CRM, we need a user_id. Let's try to get the first profile if only one exists
            // This is a fail-safe for the user's current single-user setup
            const { data: firstProfile } = await supabase.from('profiles').select('id').limit(1).single()
            if (firstProfile) {
                console.log('Falling back to first profile found:', firstProfile.id)
                profile = firstProfile as any
            } else {
                return NextResponse.json({ error: 'No profile found' }, { status: 404 })
            }
        }

        if (profile) {
            // Check for existing lead for this user and phone number
            const { data: existingLead } = await supabase
                .from('leads')
                .select('id, is_group')
                .eq('user_id', profile.id)
                .eq('phone_number', fromNumber)
                .single()

            let currentLeadId = existingLead?.id

            // Detect if it's a group chat (Meta API often includes 'group_id' in value)
            const isGroup = !!value?.group_id || !!message.context?.group_id

            if (!existingLead) {
                // Create new lead
                const contactName = contact.profile?.name || null

                const { data: newLead, error: insertError } = await supabase
                    .from('leads')
                    .insert({
                        user_id: profile.id,
                        phone_number: fromNumber,
                        name: contactName,
                        first_message: messageBody,
                        status: 'New Lead',
                        is_group: isGroup,
                    })
                    .select('id')
                    .single()

                if (insertError) throw insertError
                currentLeadId = newLead.id

                // Send Auto-Reply via Meta Graph API (Only for individual leads)
                if (!isGroup) {
                    const phone_number_id = metadata?.phone_number_id
                    if (phone_number_id && process.env.WHATSAPP_ACCESS_TOKEN) {
                        try {
                            await fetch(
                                `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        messaging_product: 'whatsapp',
                                        to: fromNumber,
                                        type: 'text',
                                        text: { body: AUTO_REPLY_MESSAGE },
                                    }),
                                }
                            )
                        } catch (err) {
                            console.error('Error sending Meta auto-reply:', err)
                        }
                    }
                }
            } else {
                // Update existing lead's timestamp and group status if it changed
                await supabase
                    .from('leads')
                    .update({
                        updated_at: new Date().toISOString(),
                        is_group: existingLead.is_group || isGroup // Once a group, always a group for this thread
                    })
                    .eq('id', existingLead.id)
            }

            // Save the message to history
            if (currentLeadId) {
                await supabase.from('messages').insert({
                    lead_id: currentLeadId,
                    sender_type: 'lead',
                    content: messageBody,
                })
            }
        }

        return NextResponse.json({ status: 'ok' }, { status: 200 })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

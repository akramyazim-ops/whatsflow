import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET: Fetch message history for a specific lead
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')

    if (!leadId) {
        return NextResponse.json({ error: 'leadId is required' }, { status: 400 })
    }

    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(messages)
}

/**
 * POST: Send a message to a lead via Meta Cloud API
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { leadId, content } = await request.json()

    if (!leadId || !content) {
        return NextResponse.json({ error: 'leadId and content are required' }, { status: 400 })
    }

    // Get lead details (phone number and user's profile info)
    const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*, profiles(whatsapp_number)')
        .eq('id', leadId)
        .single()

    if (leadError || !lead) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // 1. Save message to database as 'agent'
    const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
            lead_id: leadId,
            sender_type: 'agent',
            content: content
        })
        .select()
        .single()

    if (messageError) {
        return NextResponse.json({ error: messageError.message }, { status: 500 })
    }

    // 2. Update lead's updated_at
    await supabase.from('leads').update({ updated_at: new Date().toISOString() }).eq('id', leadId)

    // 3. Actual Meta API Call
    const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
    const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

    if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID) {
        try {
            const metaResponse = await fetch(
                `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messaging_product: 'whatsapp',
                        to: lead.phone_number,
                        type: 'text',
                        text: { body: content },
                    }),
                }
            )

            if (!metaResponse.ok) {
                const errData = await metaResponse.json()
                console.error('Meta API Error:', errData)
                // Optionally handle failure (e.g. mark message as failed in DB)
            }
        } catch (err) {
            console.error('Failed to send text to WhatsApp:', err)
        }
    }

    return NextResponse.json(message)
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/messages/bypass
 * Simulates a real incoming WhatsApp message from a specific customer number.
 * This bypasses the Meta Webhook requirements and allows users to link 
 * their "Linked Number" by just sending messages from it.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { customerPhone, message, customerName } = await request.json()

        if (!customerPhone || !message) {
            return NextResponse.json({ error: 'customerPhone and message are required' }, { status: 400 })
        }

        // 1. Ensure the lead exists for this user
        let { data: lead, error: leadError } = await supabase
            .from('leads')
            .select('id')
            .eq('user_id', user.id)
            .eq('phone_number', customerPhone)
            .single()

        if (!lead) {
            // Create new lead
            const { data: newLead, error: insertError } = await supabase
                .from('leads')
                .insert({
                    user_id: user.id,
                    phone_number: customerPhone,
                    name: customerName || 'Customer',
                    first_message: message,
                    status: 'New Lead',
                })
                .select('id')
                .single()

            if (insertError) throw insertError
            lead = newLead
        } else {
            // Update existing lead's timestamp
            await supabase
                .from('leads')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', lead.id)
        }

        // 2. Save the message to history
        const { data: savedMessage, error: messageError } = await supabase
            .from('messages')
            .insert({
                lead_id: lead.id,
                sender_type: 'lead',
                content: message,
            })
            .select()
            .single()

        if (messageError) throw messageError

        return NextResponse.json({
            success: true,
            leadId: lead.id,
            message: savedMessage
        })
    } catch (error: any) {
        console.error('Bypass API error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/messages/simulate
 * Simulates an incoming message from a LEAD (Customer)
 * This allows testing the real-time chat WITHOUT a real Meta Webhook setup.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { leadId, content } = await request.json()

        if (!leadId) {
            return NextResponse.json({ error: 'leadId is required' }, { status: 400 })
        }

        const messages = [
            'Berapa harganya?',
            'Boleh saya datang tengok esok?',
            'Terima kasih ya.',
            'Saya dah bank in.',
            'Alamat kat mana?',
            'Ok set.',
        ]

        const simulatedContent = content || messages[Math.floor(Math.random() * messages.length)]

        // 1. Insert simulated message as 'lead'
        const { data: message, error } = await supabase
            .from('messages')
            .insert({
                lead_id: leadId,
                sender_type: 'lead',
                content: simulatedContent
            })
            .select()
            .single()

        if (error) throw error

        // 2. Update lead's updated_at to trigger list refresh
        await supabase
            .from('leads')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', leadId)

        return NextResponse.json({ success: true, message })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

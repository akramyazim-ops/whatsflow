import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/leads/simulate
 * Simulates an incoming WhatsApp message by creating a lead record
 * for the authenticated user.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Generate random lead data
        const firstNames = ['Ahmad', 'Siti', 'Muthu', 'Lee', 'Tan', 'Nur', 'Zul', 'Rani']
        const lastNames = ['Bin Ismail', 'Ali', 'Krishnan', 'Wei', 'Kaur', 'Zainal', 'Abdullah']
        const messages = [
            'Hi, saya nak tanya tentang proton x50.',
            'Boleh saya tahu harga rumah di Subang?',
            'Ada stock lagi untuk iPhone 15?',
            'Nak booking appointment untuk esok.',
            'Harga service aircond berapa ya?',
            'Boleh hantar katalog?',
        ]

        const randomName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
        const randomPhone = `+601${Math.floor(10000000 + Math.random() * 90000000)}`
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]

        const { data: lead, error } = await supabase
            .from('leads')
            .insert({
                user_id: user.id,
                phone_number: randomPhone,
                name: randomName,
                first_message: randomMessage,
                status: 'New Lead',
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Also save the first message into the message history
        await supabase.from('messages').insert({
            lead_id: lead.id,
            sender_type: 'lead',
            content: randomMessage
        })

        return NextResponse.json({
            success: true,
            lead,
            message: `Simulated lead from ${randomName} created successfully!`
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

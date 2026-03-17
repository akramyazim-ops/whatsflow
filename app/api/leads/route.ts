import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/leads — fetch all leads for authenticated user
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''

        let query = supabase
            .from('leads')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (search) {
            query = query.or(`phone_number.ilike.%${search}%,name.ilike.%${search}%`)
        }

        const { data: leads, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(leads)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/leads — manually create a lead
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { phone_number, name, first_message } = body

        if (!phone_number) {
            return NextResponse.json({ error: 'phone_number is required' }, { status: 400 })
        }

        const { data: lead, error } = await supabase
            .from('leads')
            .insert({
                user_id: user.id,
                phone_number,
                name: name || null,
                first_message: first_message || null,
                status: 'New Lead',
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(lead, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { name, description, link } = await request.json()

        if (!name || !link) {
            return NextResponse.json({ error: 'Name and Link are required' }, { status: 400 })
        }

        const { data: product, error } = await supabase
            .from('products')
            .insert({
                user_id: user.id,
                name,
                description,
                link
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(product)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

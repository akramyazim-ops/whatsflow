import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    try {
        const { code, redirectUri } = await req.json()

        if (!code) {
            return NextResponse.json({ error: 'Sila berikan kod dari Meta.' }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Tidak dibenarkan.' }, { status: 401 })
        }

        const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
        const appSecret = process.env.FACEBOOK_APP_SECRET
        
        if (!appId || !appSecret) {
            console.error('Missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET in .env.local')
            return NextResponse.json({ error: 'Sistem belum dikonfigurasi sepenuhnya.' }, { status: 500 })
        }

        // 1. Exchange the code for an Access Token
        // When using the FB JS SDK with response_type: 'code', the redirect_uri should match the origin
        const metaUrl = new URL('https://graph.facebook.com/v22.0/oauth/access_token')
        metaUrl.searchParams.append('client_id', appId)
        metaUrl.searchParams.append('client_secret', appSecret)
        metaUrl.searchParams.append('code', code)
        metaUrl.searchParams.append('redirect_uri', redirectUri || '')

        const tokenRes = await fetch(metaUrl.toString(), { method: 'GET' })

        const tokenData = await tokenRes.json()
        console.log('Full Meta Token Response:', JSON.stringify(tokenData))

        if (tokenData.error) {
            console.error('Meta Token Error:', tokenData.error)
            // Surface the exact error for debugging
            const fbError = tokenData.error.message || 'Meta OAuth Error'
            const fbErrorType = tokenData.error.type || 'Unknown'
            const fbErrorCode = tokenData.error.code || 'No code'
            return NextResponse.json({ 
                error: `Meta Error: ${fbError} (${fbErrorType} - ${fbErrorCode})`,
                debug: tokenData.error
            }, { status: 400 })
        }

        const accessToken = tokenData.access_token

        // 2. We now have a System User Access Token.
        // In a real production environment, you would:
        // - Request the User's WABA ID and Phone Number ID using this token.
        // - Save the token, WABA ID, and Phone Number ID to the database securely.
        
        // Example profile update (assuming you fetched the actual phone ID):
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
                whatsapp_access_token: accessToken,
                // whatsapp_phone_number_id: fetchedNumberId,
                // whatsapp_waba_id: fetchedWabaId
            })
            .eq('id', user.id)

        if (updateError) {
            console.error('Failed to update profile with token:', updateError)
        }
       
       // Note for the user: To fully complete this, specific permissions and app review are required on Meta's side.

        return NextResponse.json({ 
            success: true, 
            message: 'Berjaya terhubung dengan Meta!',
            note: 'Token received. (Development Mode)' 
        })

    } catch (error: any) {
        console.error('Meta Auth Error:', error)
        return NextResponse.json(
            { error: 'Ralat dalaman pelayan.' },
            { status: 500 }
        )
    }
}

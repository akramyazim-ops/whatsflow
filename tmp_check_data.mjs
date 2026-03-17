import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

function loadEnv() {
    try {
        const envPath = join(process.cwd(), '.env.local')
        const content = readFileSync(envPath, 'utf8')
        const env = {}
        content.split('\n').forEach(line => {
            const [key, ...value] = line.split('=')
            if (key && value.length > 0) {
                env[key.trim()] = value.join('=').trim()
            }
        })
        return env
    } catch (e) {
        return process.env
    }
}

const env = loadEnv()
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function checkData() {
    const { data: leads } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5)
    console.log('Latest Leads:', JSON.stringify(leads, null, 2))

    const { data: messages } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(5)
    console.log('Latest Messages:', JSON.stringify(messages, null, 2))
}

checkData()

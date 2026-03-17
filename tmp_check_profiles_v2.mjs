import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Simple helper to load .env.local without external dependencies if possible
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
        console.error('Failed to load .env.local:', e.message)
        return process.env
    }
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkProfiles() {
    console.log('Checking profiles for URL:', supabaseUrl)
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) {
        console.error('Error fetching profiles:', error)
        return
    }
    console.log('Found profiles:', data.length)
    console.log(JSON.stringify(data, null, 2))
}

checkProfiles()

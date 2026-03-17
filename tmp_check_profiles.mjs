import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkProfiles() {
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) {
        console.error('Error fetching profiles:', error)
        return
    }
    console.log('Profiles in DB:', JSON.stringify(data, null, 2))
}

checkProfiles()

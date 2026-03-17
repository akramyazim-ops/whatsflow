import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Service Role Key")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function clearData() {
  console.log("Starting DB cleanup...")

  // Delete all messages
  const { error: msgErr } = await supabase
    .from('messages')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Deletes all rows roughly

  if (msgErr) console.error("Error deleting messages:", msgErr)
  else console.log("Messages deleted successfully.")

  // Delete all leads
  const { error: leadErr } = await supabase
    .from('leads')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (leadErr) console.error("Error deleting leads:", leadErr)
  else console.log("Leads deleted successfully.")

  console.log("DB cleanup finished!")
}

clearData()

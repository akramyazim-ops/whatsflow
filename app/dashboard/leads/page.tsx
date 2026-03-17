import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LeadsTable from '@/components/LeadsTable'
import { Lead } from '@/lib/types'
import { Users } from 'lucide-react'

export default async function LeadsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const allLeads: Lead[] = leads || []

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Leads</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Urus semua lead WhatsApp anda di sini
                    </p>
                </div>
                <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-slate-300">
                    <Users size={15} className="text-[#25d366]" />
                    <span className="font-semibold text-white">{allLeads.length}</span>
                    <span className="text-slate-400">lead jumlah</span>
                </div>
            </div>

            {/* Status summary pills */}
            {allLeads.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                    {(
                        [
                            { label: 'New Lead', color: 'bg-blue-500/15 text-blue-300 border-blue-500/25' },
                            { label: 'Contacted', color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25' },
                            { label: 'Closed', color: 'bg-green-500/15 text-green-300 border-green-500/25' },
                        ] as const
                    ).map(({ label, color }) => (
                        <div key={label} className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${color}`}>
                            {label}: {allLeads.filter((l) => l.status === label).length}
                        </div>
                    ))}
                </div>
            )}

            {/* Leads table */}
            <div className="card">
                <LeadsTable initialLeads={allLeads} userId={user.id} />
            </div>
        </div>
    )
}

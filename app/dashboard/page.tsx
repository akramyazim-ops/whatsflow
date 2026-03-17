import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StatsCard from '@/components/StatsCard'
import { Users, UserCheck, MessageSquare, TrendingUp, ArrowRight, Phone } from 'lucide-react'
import { format } from 'date-fns'
import { ms } from 'date-fns/locale'
import { Lead } from '@/lib/types'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const allLeads: Lead[] = leads || []
    const newLeads = allLeads.filter((l) => l.status === 'New Lead').length
    const contacted = allLeads.filter((l) => l.status === 'Contacted').length
    const closed = allLeads.filter((l) => l.status === 'Closed').length
    const recentLeads = allLeads.slice(0, 5)

    const STATUS_COLORS_SIMPLE: Record<string, string> = {
        'New Lead': 'text-blue-400 bg-blue-500/10',
        'Contacted': 'text-yellow-400 bg-yellow-500/10',
        'Closed': 'text-green-400 bg-green-500/10',
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 text-sm mt-1">
                    Selamat datang kembali! Berikut adalah ringkasan lead anda.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                <StatsCard
                    title="Jumlah Lead"
                    value={allLeads.length}
                    icon={Users}
                    color="green"
                    subtitle="Semua masa"
                />
                <StatsCard
                    title="Lead Baru"
                    value={newLeads}
                    icon={MessageSquare}
                    color="blue"
                    subtitle="Perlu ditindak"
                />
                <StatsCard
                    title="Dihubungi"
                    value={contacted}
                    icon={UserCheck}
                    color="yellow"
                    subtitle="Dalam proses"
                />
                <StatsCard
                    title="Ditutup"
                    value={closed}
                    icon={TrendingUp}
                    color="purple"
                    subtitle="Berjaya diproses"
                />
            </div>

            {/* Recent Leads */}
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-semibold text-white">Lead Terbaru</h2>
                    <Link
                        href="/dashboard/leads"
                        className="text-sm text-[#25d366] hover:underline flex items-center gap-1"
                    >
                        Lihat semua
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {recentLeads.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <MessageSquare size={24} className="text-slate-600" />
                        </div>
                        <p className="text-slate-400 font-medium">Belum ada lead lagi</p>
                        <p className="text-xs text-slate-600 mt-1">
                            Lead akan muncul di sini apabila pelanggan menghantar mesej WhatsApp
                        </p>
                        <Link
                            href="/dashboard/settings"
                            className="btn-primary text-sm mt-5 inline-flex"
                        >
                            Sambung WhatsApp
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentLeads.map((lead) => (
                            <div
                                key={lead.id}
                                className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors border border-white/5"
                            >
                                <div className="w-9 h-9 rounded-full bg-[#25d366]/10 border border-[#25d366]/20 flex items-center justify-center flex-shrink-0">
                                    <Phone size={14} className="text-[#25d366]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">{lead.phone_number}</p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {lead.first_message || 'Tiada mesej'}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span
                                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS_SIMPLE[lead.status]}`}
                                    >
                                        {lead.status}
                                    </span>
                                    <p className="text-[10px] text-slate-600 mt-1">
                                        {format(new Date(lead.created_at), 'dd MMM', { locale: ms })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

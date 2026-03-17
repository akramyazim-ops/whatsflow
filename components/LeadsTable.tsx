'use client'

import { useState, useTransition, useEffect } from 'react'
import { format } from 'date-fns'
import { ms } from 'date-fns/locale'
import { ChevronDown, Search, Phone, MessageSquare, Calendar, RefreshCw, Trash2, User, Users } from 'lucide-react'
import { Lead, LeadStatus, LEAD_STATUSES, STATUS_COLORS } from '@/lib/types'
import ChatWindow from './ChatWindow'
import { createClient } from '@/lib/supabase/client'

interface LeadsTableProps {
    initialLeads: Lead[]
    userId: string
}

async function deleteLead(id: string) {
    const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete lead')
    return res.json()
}

async function updateLeadStatus(id: string, status: LeadStatus) {
    const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error('Failed to update status')
    return res.json()
}

export default function LeadsTable({ initialLeads, userId }: LeadsTableProps) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads)
    const [search, setSearch] = useState('')
    const [updating, setUpdating] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'individual' | 'groups'>('individual')
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [isPending, startTransition] = useTransition()
    const [isMounted, setIsMounted] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        const channel = supabase
            .channel('public:leads')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'leads',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newLead = payload.new as Lead
                        setLeads((prev) => {
                            if (prev.find(l => l.id === newLead.id)) return prev
                            return [newLead, ...prev]
                        })
                    } else if (payload.eventType === 'UPDATE') {
                        const updatedLead = payload.new as Lead
                        setLeads((prev) =>
                            prev.map((l) => (l.id === updatedLead.id ? updatedLead : l))
                        )
                        // Also update selected lead if it's the one that changed
                        if (selectedLead?.id === updatedLead.id) {
                            setSelectedLead(updatedLead)
                        }
                    } else if (payload.eventType === 'DELETE') {
                        setLeads((prev) => prev.filter((l) => l.id !== payload.old.id))
                        if (selectedLead?.id === payload.old.id) setSelectedLead(null)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, supabase, selectedLead])

    const filtered = leads.filter((l) => {
        const matchesSearch = l.phone_number.toLowerCase().includes(search.toLowerCase()) ||
            (l.name && l.name.toLowerCase().includes(search.toLowerCase()))

        const matchesTab = activeTab === 'individual' ? !l.is_group : l.is_group

        return matchesSearch && matchesTab
    })

    async function handleStatusChange(id: string, status: LeadStatus) {
        setUpdating(id)
        try {
            await updateLeadStatus(id, status)
            setLeads((prev) =>
                prev.map((l) => (l.id === id ? { ...l, status } : l))
            )
        } catch (e) {
            console.error(e)
        } finally {
            setUpdating(null)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Adakah anda pasti mahu memadam lead ini?')) return
        setIsDeleting(id)
        try {
            await deleteLead(id)
            setLeads((prev) => prev.filter((l) => l.id !== id))
            if (selectedLead?.id === id) setSelectedLead(null)
        } catch (e) {
            console.error(e)
            alert('Gagal memadam lead.')
        } finally {
            setIsDeleting(null)
        }
    }

    return (
        <div className="relative">
            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
                <div className="flex bg-[#0d1530] p-1 rounded-xl border border-white/8 w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('individual')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'individual'
                            ? 'bg-[#25d366]/10 text-[#25d366] ring-1 ring-[#25d366]/20'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <User size={14} />
                        Individu
                    </button>
                    <button
                        onClick={() => setActiveTab('groups')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'groups'
                            ? 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Users size={14} />
                        Kumpulan
                    </button>
                </div>

                <div className="relative w-full md:max-w-xs">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama atau nombor..."
                        className="input-field pl-10 h-10 py-0"
                    />
                </div>
            </div>

            <div className="flex gap-6 min-h-[500px]">
                {/* Table */}
                <div className={`flex-1 overflow-x-auto rounded-xl border border-white/8 bg-[#0d1530]/30 transition-all ${selectedLead ? 'hidden xl:block' : ''}`}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-[#0d1530] border-b border-white/8">
                                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Lead
                                </th>
                                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Mesej Terakhir
                                </th>
                                <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Tindakan
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-40">
                                            <MessageSquare size={32} />
                                            <p className="text-sm font-medium">Tiada lead dijumpai</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        onClick={() => setSelectedLead(lead)}
                                        className={`cursor-pointer transition-colors ${selectedLead?.id === lead.id
                                            ? 'bg-[#25d366]/5 border-l-2 border-l-[#25d366]'
                                            : 'hover:bg-white/[0.02]'
                                            }`}
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${lead.is_group ? 'bg-purple-500/10 text-purple-400' : 'bg-[#25d366]/10 text-[#25d366]'
                                                    }`}>
                                                    {lead.is_group ? <Users size={16} /> : <User size={16} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{lead.name || lead.phone_number}</span>
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                                                        {isMounted ? format(new Date(lead.updated_at || lead.created_at), 'dd/MM HH:mm') : '...'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 max-w-[200px]">
                                            <p className="text-slate-400 truncate text-xs">
                                                {lead.first_message}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <select
                                                value={lead.status}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) =>
                                                    handleStatusChange(lead.id, e.target.value as LeadStatus)
                                                }
                                                disabled={updating === lead.id}
                                                className={`appearance-none rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${STATUS_COLORS[lead.status as LeadStatus]} bg-transparent disabled:opacity-50`}
                                            >
                                                {LEAD_STATUSES.map((s) => (
                                                    <option key={s} value={s} className="bg-[#111827] text-white">
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setSelectedLead(lead)}
                                                    className="p-2 rounded-lg hover:bg-[#25d366]/10 text-slate-500 hover:text-[#25d366] transition-colors"
                                                    title="Sembang"
                                                >
                                                    <MessageSquare size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lead.id)}
                                                    disabled={isDeleting === lead.id}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                                                    title="Padam"
                                                >
                                                    {isDeleting === lead.id ? (
                                                        <RefreshCw size={14} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Chat Window */}
                {selectedLead && (
                    <div className="w-full xl:w-[450px] flex-shrink-0 animate-in slide-in-from-right-4 duration-300">
                        <ChatWindow
                            lead={selectedLead}
                            onClose={() => setSelectedLead(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

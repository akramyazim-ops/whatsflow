'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Message, Lead } from '@/lib/types'
import { Send, User, MessageSquare, X, Shield, Clock, Package } from 'lucide-react'
import { format } from 'date-fns'

interface ChatWindowProps {
    lead: Lead
    onClose: () => void
}

export default function ChatWindow({ lead, onClose }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [showProducts, setShowProducts] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Load message history
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/messages?leadId=${lead.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setMessages(data)
                }
            } catch (error) {
                console.error('Error fetching messages:', error)
            } finally {
                setLoading(false)
            }
        }

        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products')
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data)
                }
            } catch (error) {
                console.error('Error fetching products:', error)
            }
        }

        fetchMessages()
        fetchProducts()

        // Subscribe to real-time messages
        const channel = supabase
            .channel(`chat:${lead.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `lead_id=eq.${lead.id}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message
                    setMessages((prev) => {
                        // Avoid duplicates
                        if (prev.find(m => m.id === newMessage.id)) return prev
                        return [...prev, newMessage]
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [lead.id, supabase])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || sending) return

        setSending(true)
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId: lead.id,
                    content: newMessage,
                }),
            })

            if (response.ok) {
                setNewMessage('')
            }
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-[#0b141a] rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative z-50">
            {/* Header */}
            <div className="bg-[#202c33] p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white ring-2 ring-[#25d366]/20">
                        {lead.name ? lead.name[0].toUpperCase() : <User size={20} />}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white leading-tight">
                            {lead.name || lead.phone_number}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] animate-pulse" />
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">WhatsApp Online</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a]">
                <div className="flex justify-center mb-6">
                    <div className="bg-[#182229] px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
                        <Shield size={12} className="text-[#25d366]" />
                        <span className="text-[11px] text-slate-400">Pesan disulitkan hujung-ke-hujung</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-[#25d366]/30 border-t-[#25d366] rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-10 opacity-40">
                        <MessageSquare size={48} className="mx-auto mb-3" />
                        <p className="text-sm">Tiada mesej lagi</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm shadow-sm relative group ${msg.sender_type === 'agent'
                                    ? 'bg-[#005c4b] text-white rounded-tr-none'
                                    : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-white/5'
                                    }`}
                            >
                                <p className="leading-relaxed">{msg.content}</p>
                                <div className={`flex items-center gap-1 mt-1 justify-end opacity-50 text-[10px]`}>
                                    <Clock size={10} />
                                    {format(new Date(msg.created_at), 'hh:mm a')}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="bg-[#202c33] p-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={async () => {
                            if (sending) return
                            setSending(true)
                            await fetch('/api/messages/simulate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ leadId: lead.id }),
                            })
                            setSending(false)
                        }}
                        className="w-11 h-11 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center hover:bg-amber-500/20 transition-all border border-amber-500/20"
                        title="Simulasi Mesej Masuk (Testing)"
                    >
                        <MessageSquare size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowProducts(!showProducts)}
                        className="w-11 h-11 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center hover:bg-indigo-500/20 transition-all border border-indigo-500/20 relative"
                        title="Share Product"
                    >
                        <Package size={18} />
                        
                        {showProducts && (
                            <div className="absolute bottom-full left-0 mb-3 w-64 bg-[#1f2937] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in slide-in-from-bottom-2">
                                <div className="text-xs font-semibold text-slate-400 mb-2 px-2 pt-1 uppercase tracking-wider">Select Product to Share</div>
                                <div className="max-h-48 overflow-y-auto space-y-1">
                                    {products.length === 0 ? (
                                        <div className="text-xs text-slate-500 px-2 py-3 text-center">No products saved. Add them in dashboard.</div>
                                    ) : (
                                        products.map(p => (
                                            <div 
                                                key={p.id}
                                                onClick={() => {
                                                    setNewMessage(prev => prev + (prev ? '\n' : '') + `Check out ${p.name}:\n${p.link}`);
                                                    setShowProducts(false);
                                                }}
                                                className="text-left w-full px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group/item"
                                            >
                                                <div className="text-sm text-white font-medium truncate group-hover/item:text-indigo-400">{p.name}</div>
                                                <div className="text-[10px] text-slate-500 truncate">{p.link}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Mesej WhatsApp..."
                        className="flex-1 bg-[#2a3942] border-none text-white text-sm rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#25d366] transition-all placeholder:text-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="w-11 h-11 bg-[#25d366] text-white rounded-xl flex items-center justify-center hover:bg-[#1da851] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-500/10 active:scale-95"
                    >
                        <Send size={18} className={sending ? 'animate-pulse' : ''} />
                    </button>
                </div>
            </form>
        </div>
    )
}

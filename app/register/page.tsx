'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MessageSquare, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError('Kata laluan tidak sepadan. Sila cuba lagi.')
            return
        }

        if (password.length < 6) {
            setError('Kata laluan mestilah sekurang-kurangnya 6 aksara.')
            return
        }

        setLoading(true)

        // Check for placeholder values
        if (
            process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project-id') ||
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your-anon-key-here'
        ) {
            setError('Ralat Konfigurasi: Sila masukkan URL dan Anon Key Supabase yang sebenar di fail .env.local.')
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/dashboard`,
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setSuccess(true)
        setLoading(false)

        // Auto-redirect after sign-up if email confirmation disabled
        setTimeout(() => {
            router.push('/dashboard')
            router.refresh()
        }, 1500)
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 rounded-2xl bg-[#25d366]/10 border border-[#25d366]/20 flex items-center justify-center mx-auto mb-5">
                        <CheckCircle size={32} className="text-[#25d366]" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Pendaftaran Berjaya!</h2>
                    <p className="text-sm text-slate-400">
                        Akaun anda telah dibuat. Anda akan diarahkan ke dashboard...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#25d366]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#25d366] to-[#1da851] flex items-center justify-center shadow-lg shadow-green-500/20">
                            <MessageSquare size={20} className="text-white" />
                        </div>
                        <span className="font-bold text-xl text-white">
                            Whats<span className="text-[#25d366]">Flow</span> CRM
                        </span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white mt-6 mb-2">Buat Akaun Baharu</h1>
                    <p className="text-sm text-slate-400">Mula tangkap lead WhatsApp hari ini</p>
                </div>

                {/* Form Card */}
                <div className="glass-strong rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="input-label">E-mel</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="nama@syarikat.com"
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Kata Laluan</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Min. 6 aksara"
                                    className="input-field pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Sahkan Kata Laluan</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Ulang kata laluan"
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sedang mendaftar...
                                </>
                            ) : (
                                'Daftar Sekarang'
                            )}
                        </button>
                    </form>

                    <p className="text-xs text-slate-500 text-center mt-4">
                        Dengan mendaftar, anda bersetuju dengan terma dan syarat kami.
                    </p>

                    <p className="text-center text-sm text-slate-400 mt-5">
                        Sudah ada akaun?{' '}
                        <Link href="/login" className="text-[#25d366] font-medium hover:underline">
                            Log masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

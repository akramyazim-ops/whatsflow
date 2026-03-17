'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
    { href: '/#features', label: 'Ciri-ciri' },
    { href: '/pricing', label: 'Harga' },
]

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const pathname = usePathname()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#25d366] to-[#1da851] flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-500/30 transition-all">
                            <MessageSquare size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-lg text-white">
                            Whats<span className="text-gradient-green">Flow</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login" className="btn-secondary text-sm py-2">
                            Log Masuk
                        </Link>
                        <Link href="/register" className="btn-primary text-sm py-2">
                            Cuba Percuma
                        </Link>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block text-sm text-slate-400 hover:text-white py-2 transition-colors"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-2 space-y-2">
                        <Link href="/login" className="btn-secondary text-sm w-full justify-center">
                            Log Masuk
                        </Link>
                        <Link href="/register" className="btn-primary text-sm w-full justify-center">
                            Cuba Percuma
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

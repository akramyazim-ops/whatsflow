import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#070c1a] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#25d366] to-[#1da851] flex items-center justify-center">
                                <MessageSquare size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-lg text-white">
                                Whats<span className="text-gradient-green">Flow</span> CRM
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                            Automasi tangkapan lead WhatsApp untuk perniagaan kecil dan sederhana Malaysia.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Produk</h3>
                        <ul className="space-y-3">
                            {[
                                { href: '/#features', label: 'Ciri-ciri' },
                                { href: '/pricing', label: 'Harga' },
                                { href: '/dashboard', label: 'Dashboard' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Akaun</h3>
                        <ul className="space-y-3">
                            {[
                                { href: '/login', label: 'Log Masuk' },
                                { href: '/register', label: 'Daftar' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} WhatsFlow CRM. Hak cipta terpelihara.
                    </p>
                    <p className="text-xs text-slate-500">
                        Dibina untuk perniagaan Malaysia 🇲🇾
                    </p>
                </div>
            </div>
        </footer>
    )
}

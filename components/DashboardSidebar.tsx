'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Settings,
    MessageSquare,
    LogOut,
    ChevronRight,
    Package,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/leads', label: 'Leads', icon: Users },
    { href: '/dashboard/products', label: 'Products', icon: Package },
    { href: '/dashboard/settings', label: 'Tetapan', icon: Settings },
]

interface DashboardSidebarProps {
    userEmail?: string | null
}

export default function DashboardSidebar({ userEmail }: DashboardSidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-[#090e1d] border-r border-white/5 flex flex-col z-40">
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#25d366] to-[#1da851] flex items-center justify-center shadow-lg shadow-green-500/20">
                        <MessageSquare size={15} className="text-white" />
                    </div>
                    <div>
                        <div className="font-bold text-sm text-white">
                            Whats<span className="text-[#25d366]">Flow</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium tracking-wide">CRM DASHBOARD</div>
                    </div>
                </Link>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-3">
                    Menu
                </div>
                {navItems.map((item) => {
                    const isActive =
                        item.href === '/dashboard'
                            ? pathname === '/dashboard'
                            : pathname.startsWith(item.href)
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link group ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={17} className={isActive ? 'text-[#25d366]' : 'text-slate-500 group-hover:text-slate-300'} />
                            <span className="flex-1">{item.label}</span>
                            {isActive && <ChevronRight size={14} className="text-[#25d366]" />}
                        </Link>
                    )
                })}
            </nav>

            {/* User info + logout */}
            <div className="p-4 border-t border-white/5">
                {userEmail && (
                    <div className="px-2 mb-3">
                        <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="sidebar-link w-full text-left hover:text-red-400 group"
                >
                    <LogOut size={17} className="text-slate-500 group-hover:text-red-400" />
                    Log Keluar
                </button>
            </div>
        </aside>
    )
}

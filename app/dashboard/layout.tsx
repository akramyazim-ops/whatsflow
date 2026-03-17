import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from '@/components/DashboardSidebar'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen flex">
            <DashboardSidebar userEmail={user.email} />
            <main className="flex-1 ml-64 min-h-screen bg-[#090e1d]">
                <div className="p-8">{children}</div>
            </main>
        </div>
    )
}

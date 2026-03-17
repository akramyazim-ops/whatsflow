import { type LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: number | string
    icon: LucideIcon
    color?: 'green' | 'blue' | 'yellow' | 'purple'
    subtitle?: string
}

const colorMap = {
    green: {
        icon: 'text-[#25d366]',
        bg: 'bg-[#25d366]/10',
        border: 'border-[#25d366]/20',
    },
    blue: {
        icon: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
    },
    yellow: {
        icon: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
    },
    purple: {
        icon: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
    },
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    color = 'green',
    subtitle,
}: StatsCardProps) {
    const colors = colorMap[color]
    return (
        <div className="card group cursor-default">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-white">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                    <Icon size={20} className={colors.icon} />
                </div>
            </div>
        </div>
    )
}

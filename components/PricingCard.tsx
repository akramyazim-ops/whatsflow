import Link from 'next/link'
import { Check, Star } from 'lucide-react'

interface PricingFeature {
    text: string
    included: boolean
}

interface PricingCardProps {
    tier: string
    price: number
    description: string
    features: PricingFeature[]
    popular?: boolean
    ctaLabel?: string
}

export default function PricingCard({
    tier,
    price,
    description,
    features,
    popular = false,
    ctaLabel = 'Mulakan Sekarang',
}: PricingCardProps) {
    return (
        <div
            className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${popular
                    ? 'bg-gradient-to-b from-[#0d1f14] to-[#0a1a10] border-2 border-[#25d366]/50 shadow-2xl shadow-green-500/10 scale-105'
                    : 'bg-[#111827] border border-white/8 hover:border-white/15'
                }`}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#25d366] to-[#1da851] text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                        <Star size={11} fill="white" />
                        PALING POPULAR
                    </span>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    {tier}
                </h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-slate-400 text-sm">RM</span>
                    <span className="text-5xl font-black text-white">{price}</span>
                    <span className="text-slate-400 text-sm">/bulan</span>
                </div>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">{description}</p>
            </div>

            <ul className="space-y-3 flex-1 mb-8">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${feature.included
                                    ? 'bg-[#25d366]/20 text-[#25d366]'
                                    : 'bg-white/5 text-slate-600'
                                }`}
                        >
                            <Check size={11} strokeWidth={3} />
                        </div>
                        <span
                            className={`text-sm ${feature.included ? 'text-slate-300' : 'text-slate-600 line-through'
                                }`}
                        >
                            {feature.text}
                        </span>
                    </li>
                ))}
            </ul>

            <Link
                href="/register"
                className={`text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 block ${popular
                        ? 'btn-primary justify-center hover:shadow-lg hover:shadow-green-500/30'
                        : 'btn-outline justify-center'
                    }`}
            >
                {ctaLabel}
            </Link>
        </div>
    )
}

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PricingCard from '@/components/PricingCard'
import { Check, HelpCircle } from 'lucide-react'

const plans = [
    {
        tier: 'Starter',
        price: 29,
        description: 'Sesuai untuk perniagaan yang baru bermula dengan WhatsApp sebagai saluran utama.',
        features: [
            { text: '500 lead sebulan', included: true },
            { text: '1 nombor WhatsApp', included: true },
            { text: 'Dashboard CRM', included: true },
            { text: 'Auto-reply asas', included: true },
            { text: 'Automation lanjutan', included: false },
            { text: 'Lead tagging', included: false },
            { text: 'Multi-agent', included: false },
            { text: 'Sokongan keutamaan', included: false },
        ],
    },
    {
        tier: 'Growth',
        price: 79,
        description: 'Untuk perniagaan yang sedang berkembang dan memerlukan lebih kuasa automasi.',
        features: [
            { text: '3,000 lead sebulan', included: true },
            { text: '1 nombor WhatsApp', included: true },
            { text: 'Dashboard CRM', included: true },
            { text: 'Auto-reply lanjutan', included: true },
            { text: 'Automation penuh', included: true },
            { text: 'Lead tagging', included: true },
            { text: 'Multi-agent', included: false },
            { text: 'Sokongan keutamaan', included: false },
        ],
        popular: true,
    },
    {
        tier: 'Scale',
        price: 199,
        description: 'Untuk pasukan besar dengan keperluan yang kompleks dan volume tinggi.',
        features: [
            { text: 'Lead tanpa had', included: true },
            { text: 'Pelbagai nombor WhatsApp', included: true },
            { text: 'Dashboard CRM', included: true },
            { text: 'Auto-reply lanjutan', included: true },
            { text: 'Automation penuh', included: true },
            { text: 'Lead tagging', included: true },
            { text: 'Multi-agent', included: true },
            { text: 'Sokongan keutamaan', included: true },
        ],
    },
]

const faqs = [
    {
        q: 'Adakah saya perlu ada akaun WhatsApp Business rasmi?',
        a: 'Untuk MVP, anda boleh menggunakan Twilio Sandbox untuk ujian. Untuk pengeluaran, anda perlu mendaftar dengan Meta untuk WhatsApp Business API.',
    },
    {
        q: 'Bolehkah saya tukar plan bila-bila masa?',
        a: 'Ya, anda boleh naik taraf atau turun taraf plan pada bila-bila masa. Perubahan akan berkuat kuasa pada kitaran bil seterusnya.',
    },
    {
        q: 'Adakah data pelanggan saya selamat?',
        a: 'Ya. Semua data disimpan di Supabase dengan Row Level Security — hanya anda yang boleh akses data pelanggan anda.',
    },
    {
        q: 'Berapa lama untuk setup?',
        a: 'Setup hanya mengambil masa 5-10 minit. Daftar, sambung nombor WhatsApp anda, dan sistem sudah bersedia.',
    },
]

export default function PricingPage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-24 pb-24">
                {/* Header */}
                <div className="text-center mb-16 max-w-2xl mx-auto px-4">
                    <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
                        Harga Yang <span className="text-gradient">Berpatutan</span>
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Pilih plan yang sesuai dengan saiz dan keperluan perniagaan anda.
                        Tiada kos tersembunyi.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {plans.map((plan) => (
                            <PricingCard
                                key={plan.tier}
                                tier={plan.tier}
                                price={plan.price}
                                description={plan.description}
                                features={plan.features}
                                popular={plan.popular}
                            />
                        ))}
                    </div>
                </div>

                {/* All plans include */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                    <div className="glass rounded-2xl p-8 text-center">
                        <h3 className="text-lg font-semibold text-white mb-6">
                            Semua Plan Termasuk
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                'Auto-reply WhatsApp',
                                'CRM Dashboard',
                                'Sokongan Email',
                                'SSL & Keselamatan Data',
                                'Akses API Asas',
                                'Backup Harian',
                                'Notifikasi Real-time',
                                'Laporan Bulanan',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                                    <Check size={14} className="text-[#25d366] flex-shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                    <h2 className="text-2xl font-bold text-white text-center mb-10">
                        Soalan Lazim
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq.q} className="card">
                                <div className="flex gap-3">
                                    <HelpCircle size={18} className="text-[#25d366] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-white text-sm mb-2">{faq.q}</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

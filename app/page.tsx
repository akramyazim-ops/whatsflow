import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  MessageSquare,
  Zap,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle,
  Phone,
  Clock,
  Users,
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    color: 'green',
    title: 'Auto-Tangkap Lead',
    desc: 'Setiap mesej WhatsApp pertama terus dijadikan lead di dalam CRM anda secara automatik. Tanpa input manual.',
  },
  {
    icon: MessageSquare,
    color: 'blue',
    title: 'Auto-Reply Segera',
    desc: 'Balas pelanggan secara automatik dalam saat — walaupun anda sedang tidur. Jangan biarkan pelanggan tertunggu.',
  },
  {
    icon: BarChart3,
    color: 'purple',
    title: 'Dashboard CRM Mudah',
    desc: 'Lihat, urus, dan update status semua lead anda dalam satu papan kawalan yang bersih dan mudah difahami.',
  },
  {
    icon: Shield,
    color: 'yellow',
    title: 'Data Selamat & Peribadi',
    desc: 'Data pelanggan anda disimpan dengan selamat menggunakan Supabase dengan Row Level Security — hanya anda boleh akses.',
  },
]

const stats = [
  { label: 'Lead Ditangkap', value: '50K+' },
  { label: 'Perniagaan Malaysia', value: '200+' },
  { label: 'Masa Respons Purata', value: '<1s' },
]

const industries = [
  '🛒 Penjual Online', '🏠 Ejen Hartanah', '🚗 Pengedar Kereta',
  '🏥 Klinik & Doktor', '💇 Salun Kecantikan', '🍜 Restoran & F&B',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#25d366]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#25d366]/10 border border-[#25d366]/25 rounded-full px-4 py-2 text-sm font-medium text-[#25d366] mb-8 animate-fade-up">
              <div className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
              Platform CRM WhatsApp #1 untuk PKS Malaysia
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-fade-up delay-100">
              Tukar Setiap{' '}
              <span className="text-gradient">Mesej WhatsApp</span>
              <br />
              Jadi{' '}
              <span className="text-white">Lead Bisnes</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up delay-200">
              WhatsFlow CRM membantu perniagaan kecil Malaysia tangkap, urus, dan follow-up
              lead WhatsApp secara automatik. Jangan biarkan satu pun pelanggan terlepas.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
              <Link href="/register" className="btn-primary text-base px-8 py-3.5 glow-green animate-pulse-glow">
                Mulakan Percuma Sekarang
                <ArrowRight size={18} />
              </Link>
              <Link href="/pricing" className="btn-secondary text-base px-8 py-3.5">
                Lihat Harga
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-slate-500 animate-fade-up">
              {[
                { icon: CheckCircle, text: 'Tanpa kontrak' },
                { icon: CheckCircle, text: 'Setup dalam 5 minit' },
                { icon: CheckCircle, text: 'Sokongan Bahasa Malaysia' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <item.icon size={15} className="text-[#25d366]" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-500 uppercase tracking-widest font-semibold mb-6">
            Sesuai untuk semua jenis perniagaan
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {industries.map((industry) => (
              <span
                key={industry}
                className="glass px-4 py-2 rounded-full text-sm text-slate-300 font-medium"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Semua Yang Anda Perlukan
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Dari tangkap lead automatik hingga urus status follow-up — semua dalam satu platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              const colorStyles: Record<string, string> = {
                green: 'bg-[#25d366]/10 border-[#25d366]/20 text-[#25d366]',
                blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
                yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
              }
              return (
                <div key={feature.title} className="card hover:border-white/15 group">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${colorStyles[feature.color]}`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-[#070c1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Macam Mana Ia Berfungsi?
            </h2>
            <p className="text-slate-400">Simple. Automatik. Berkesan.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                icon: Phone,
                title: 'Pelanggan WhatsApp Anda',
                desc: 'Pelanggan hantar mesej ke nombor WhatsApp perniagaan anda.',
              },
              {
                step: '02',
                icon: Zap,
                title: 'Sistem Balas & Tangkap',
                desc: 'Sistem auto-reply dalam saat dan terus save nombor + mesej sebagai lead baru.',
              },
              {
                step: '03',
                icon: Users,
                title: 'Anda Urus di Dashboard',
                desc: 'Lihat lead, update status, dan follow-up dalam satu dashboard yang mudah.',
              },
            ].map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative text-center">
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-gradient-to-r from-[#25d366]/30 to-transparent" />
                  )}
                  <div className="inline-flex">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#25d366]/20 to-[#25d366]/5 border border-[#25d366]/20 flex items-center justify-center mx-auto mb-4">
                        <Icon size={24} className="text-[#25d366]" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#25d366] text-white text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d2b1a] to-[#0a1520] border border-[#25d366]/20 p-12 text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#25d366]/10 blur-3xl" />
            </div>
            <div className="relative z-10">
              <Clock size={40} className="text-[#25d366] mx-auto mb-6 animate-float" />
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Jangan Biarkan Lead Terlepas Lagi
              </h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Lebih 50,000 lead telah ditangkap oleh perniagaan Malaysia menggunakan WhatsFlow CRM.
              </p>
              <Link href="/register" className="btn-primary text-base px-10 py-4 glow-green">
                Daftar Sekarang — Percuma
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

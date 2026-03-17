'use client'

import { useState, useEffect } from 'react'
import { QrCode, Smartphone, Settings as SettingsIcon, ShieldCheck, RefreshCw, Facebook } from 'lucide-react'

// Declare FB globally
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [connecting, setConnecting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        // Load the Facebook SDK
        window.fbAsyncInit = function() {
            window.FB.init({
                appId      : process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '', // Needs to be configured
                cookie     : true,
                xfbml      : true,
                version    : 'v22.0'
            });
            setLoading(false);
        };

        (function(d, s, id){
            var js: HTMLScriptElement, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s) as HTMLScriptElement; js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode?.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, [])

    const launchWhatsAppSignup = () => {
        setConnecting(true)
        setErrorMessage('')
        setSuccessMessage('')
        
        // Launch Facebook login
        window.FB.login(function(response: any) {
            if (response.authResponse) {
                const code = response.authResponse.code;
                console.log('Got code:', code);
                
                // Exchange code for access token via backend API
                exchangeCodeForWhatsAppTokens(code)
            } else {
                setConnecting(false)
                setErrorMessage('User cancelled login or did not fully authorize.');
            }
        }, {
            config_id: process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID || '', // Requires an Embedded Signup config ID via App Dashboard
            response_type: 'code',
            override_default_response_type: true,
            extras: {
                setup: { },
                featureType: '',
                sessionInfoVersion: '2',
            }
        });
    }

    const exchangeCodeForWhatsAppTokens = async (code: string) => {
        try {
            const res = await fetch('/api/whatsapp/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            })
            
            if (res.ok) {
                setSuccessMessage('WhatsApp berjaya dihubungkan!')
            } else {
                const errorData = await res.json()
                setErrorMessage(errorData.error || 'Gagal untuk menghubungkan WhatsApp.')
            }
        } catch (error) {
            setErrorMessage('Ralat pada pelayan. Sila cuba lagi.')
        } finally {
            setConnecting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#25d366]/20 to-[#1da851]/20 flex items-center justify-center border border-[#25d366]/20 ring-1 ring-[#25d366]/10 shadow-lg shadow-[#25d366]/10">
                        <SettingsIcon className="text-[#25d366] w-5 h-5" />
                    </div>
                    Tetapan WhatsApp
                </h1>
                <p className="text-slate-400 mt-3 text-lg">
                    Hubungkan akaun WhatsApp anda untuk mula menggunakan CRM.
                </p>
            </div>

            <div className="bg-[#111827] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#25d366]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 items-center">
                    
                    {/* Instructions Side */}
                    <div className="space-y-8 order-2 md:order-1">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Cara untuk hubung:</h2>
                            <ol className="space-y-6 mb-8">
                                {[
                                    { icon: Facebook, text: 'Tekan butang "Log masuk dengan Facebook".' },
                                    { icon: ShieldCheck, text: 'Ikuti arahan di paparan popup Meta yang selamat.' },
                                    { icon: Smartphone, text: 'Pilih profil WhatsApp Business dan nombor telefon yang ingin dihubungkan.' },
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4 items-start group">
                                        <div className="w-10 h-10 rounded-2xl bg-[#1f2937] border border-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#25d366]/10 group-hover:text-[#25d366] group-hover:border-[#25d366]/20 transition-all shrink-0 shadow-sm">
                                            <step.icon size={18} />
                                        </div>
                                        <p className="text-slate-300 mt-2 font-medium leading-relaxed group-hover:text-white transition-colors">
                                            {step.text}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                            
                            {successMessage && (
                                <div className="bg-[#25d366]/10 border border-[#25d366]/20 p-4 rounded-xl text-[#25d366] font-medium mb-4">
                                    {successMessage}
                                </div>
                            )}

                            {errorMessage && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 font-medium mb-4">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* QR Code Side */}
                    <div className="flex flex-col items-center justify-center order-1 md:order-2">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-blue-500/10 border border-blue-500/20 w-full min-h-[300px] flex flex-col items-center justify-center text-center group">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center">
                                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                                    <p className="text-slate-500 font-medium text-sm">Menyedia SDK Meta...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-2xl bg-[#e7f3ff] flex items-center justify-center mb-6 border border-[#1877f2]/20 shadow-inner">
                                        <Facebook className="text-[#1877f2] w-10 h-10" />
                                    </div>
                                    <h3 className="text-slate-800 font-bold text-xl mb-2">Meta Embedded Signup</h3>
                                    <p className="text-slate-500 text-sm mb-8 px-4">
                                        Lengkapkan pendaftaran secara rasmi menggunakan integrasi WhatsApp yang sah dan selamat dari Meta.
                                    </p>
                                    <button 
                                        onClick={launchWhatsAppSignup}
                                        disabled={connecting}
                                        className="bg-[#1877f2] hover:bg-[#166fe5] text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-[#1877f2]/30 transition-all w-full flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                                    >
                                        {connecting ? (
                                            <>
                                                <RefreshCw size={20} className="animate-spin" />
                                                Menyambung...
                                            </>
                                        ) : (
                                            <>
                                                <Facebook size={20} className="fill-white" />
                                                Log Masuk dengan Facebook
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {!loading && (
                            <div className="mt-6 flex items-center gap-2 text-slate-500 text-xs text-center w-full justify-center">
                                <ShieldCheck size={14} className="text-[#25d366]" />
                                Dikuasakan oleh sokongan rasmi Aplikasi Meta.
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
            
            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(256px); opacity: 0; }
                }
            `}</style>
        </div>
    )
}

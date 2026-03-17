import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WhatsFlow CRM — Tangkap & Urus Lead WhatsApp Anda',
  description:
    'WhatsFlow CRM membantu perniagaan kecil Malaysia tangkap dan urus lead WhatsApp secara automatik. Auto-reply, CRM dashboard, dan lebih banyak lagi.',
  keywords: 'WhatsApp CRM, lead management, Malaysia SME, auto-reply, CRM dashboard',
  openGraph: {
    title: 'WhatsFlow CRM',
    description: 'Automasi tangkapan lead WhatsApp untuk perniagaan Malaysia',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-mesh antialiased" suppressHydrationWarning>{children}</body>
    </html>
  )
}

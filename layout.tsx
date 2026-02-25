import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Dream Library - The Enchanted Archive',
  description: 'Every story finds its soul here. A magical library management system.',
}

export const viewport: Viewport = {
  themeColor: '#c084b8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(192,132,184,0.3)',
              color: '#3b2751',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}

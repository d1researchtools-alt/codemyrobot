import type { Metadata } from 'next'
import { Antic_Slab, PT_Sans } from 'next/font/google'
import './globals.css'

const anticSlab = Antic_Slab({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-antic-slab',
  display: 'swap',
})

const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-pt-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'CodeMyRobot.ca', template: '%s - CodeMyRobot.ca' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anticSlab.variable} ${ptSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}

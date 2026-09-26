import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'MarketOne · Paneli i Operatorit',
  description: 'Prototip i panelit të operatorit MarketOne',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq">
      <body className={manrope.variable}>{children}</body>
    </html>
  )
}

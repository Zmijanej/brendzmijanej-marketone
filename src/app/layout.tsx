import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'MarketOne · Hapësira e biznesit',
  description: 'Paneli i biznesit dhe aplikimi për mikro-kredi — prototip demonstrues MarketOne',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sq">
      <body className={manrope.variable}>{children}</body>
    </html>
  )
}

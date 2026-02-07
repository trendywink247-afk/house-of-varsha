import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'House of Varsha | Handcrafted Indian Ethnic Wear',
  description: 'Discover authentic Indian ethnic wear at House of Varsha. Exquisite kurtis, kurti sets, anarkalis and more. Handcrafted with love.',
  keywords: 'Indian ethnic wear, kurtis, kurti sets, anarkali, traditional wear, handcrafted',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="bg-cream text-burgundy font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}

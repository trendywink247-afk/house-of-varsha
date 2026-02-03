import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'House of Varsha - Premium Handcrafted Products',
  description: 'Celebrating elegance and storytelling through premium handcrafted products. Discover our curated collection of artisanal treasures.',
  keywords: ['handcrafted', 'premium', 'boutique', 'artisan', 'House of Varsha'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

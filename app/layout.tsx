import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { deDE } from '@clerk/localizations'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Restaurant CMS',
  description: 'Premium Restaurant Bestellsystem',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={deDE}>
      <html lang="de-CH">
        <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

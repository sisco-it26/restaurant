import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { deDE } from '@clerk/localizations'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bistro — Frische Küche, ehrlich serviert',
  description: 'Internationales Bistro mit frischen Zutaten und modernen Interpretationen klassischer Gerichte.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={deDE}>
      <html lang="de-CH">
        <body className="font-sans antialiased grain">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

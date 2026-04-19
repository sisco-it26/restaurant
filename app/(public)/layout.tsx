import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ClosedOverlay } from '@/components/layout/ClosedOverlay'
import { FloatingCartBar } from '@/components/menu/FloatingCartBar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg)]">
        {children}
      </main>
      <Footer />
      <FloatingCartBar />
      <ClosedOverlay />
    </>
  )
}

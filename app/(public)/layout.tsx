import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { ClosedOverlay } from '@/components/layout/ClosedOverlay'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-50">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <ClosedOverlay />
    </>
  )
}

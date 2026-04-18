'use client'

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-stone-900">
      {children}
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PostalCodeCheck } from '@/components/home/PostalCodeCheck'
import { ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'

const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80',
]

async function getBestsellers() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isAvailable: true },
    include: { category: true },
    take: 6,
    orderBy: { sortOrder: 'asc' },
  })
  return products
}

export default async function HomePage() {
  const bestsellers = await getBestsellers()

  return (
    <div>
      {/* ═══ HERO — Fullscreen image + overlay ═══ */}
      <section className="relative h-[85vh] min-h-[520px] max-h-[720px] overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80"
          alt=""
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end px-4 md:container pb-12 md:pb-16">
          <div className="max-w-lg space-y-5">
            <h1 className="font-display text-[2.5rem] md:text-[3.25rem] font-extrabold text-white leading-[1.05] tracking-tight">
              Frisch bestellen. Schnell geniessen.
            </h1>
            <p className="text-[16px] text-white/75 leading-relaxed max-w-md">
              Internationale Küche direkt zu dir — in unter 45 Minuten.
            </p>

            {/* PLZ input + CTA */}
            <div className="space-y-3 pt-1">
              <PostalCodeCheck variant="hero" />
              <Link href="/menu">
                <Button size="lg" className="w-full sm:w-auto">
                  Essen finden
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BESTSELLERS — compact ═══ */}
      <section className="px-4 md:container py-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-[18px] font-extrabold text-[var(--text-primary)]">
            Beliebt bei unseren Gästen
          </h2>
          <Link href="/menu" className="text-[13px] font-semibold text-[var(--accent)]">
            Alle
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible">
          {bestsellers.map((product, i) => (
            <Link
              key={product.id}
              href="/menu"
              className="flex-shrink-0 w-[200px] md:w-auto bg-white border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-[var(--shadow-md)] transition-all"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={FOOD_IMAGES[i % FOOD_IMAGES.length]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-3">
                <h3 className="text-[13px] font-bold text-[var(--text-primary)] leading-tight line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[13px] font-bold text-[var(--text-primary)]">
                    {formatPrice(Number(product.basePrice))}
                  </span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">
                    {product.category.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="px-4 md:container pb-12">
        <div className="bg-[var(--accent)] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              Hungrig?
            </h2>
            <p className="text-white/70 text-[14px] mt-1">
              Bestell jetzt und geniess in unter einer Stunde.
            </p>
          </div>
          <Link href="/menu">
            <Button size="lg" className="bg-white text-[var(--accent)] hover:bg-gray-50 flex-shrink-0">
              Jetzt bestellen
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { HeroOrderEntry } from '@/components/home/HeroOrderEntry'
import { ArrowRight, Clock, Leaf, MapPin, Star, ChevronRight } from 'lucide-react'
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

const CATEGORY_ICONS = [
  { name: 'Salate', emoji: '🥗' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Pasta', emoji: '🍝' },
  { name: 'Burger', emoji: '🍔' },
  { name: 'Bowls', emoji: '🥙' },
  { name: 'Desserts', emoji: '🍰' },
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

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 6,
  })
}

export default async function HomePage() {
  const [bestsellers, categories] = await Promise.all([getBestsellers(), getCategories()])

  return (
    <div className="bg-[var(--bg)]">
      {/* ═══ HERO — 2 columns, compact ═══ */}
      <section className="bg-white">
        <div className="px-4 lg:max-w-[1280px] lg:mx-auto lg:px-6 py-8 md:py-12">
          <div className="grid md:grid-cols-[1fr_420px] gap-8 md:gap-10 items-center">
            {/* Left: Content */}
            <div className="space-y-5 max-w-[520px]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-bold text-[var(--accent)] bg-[var(--accent-light)] rounded-full">
                <Clock className="w-3 h-3" />
                Lieferung in 30 Min
              </div>

              <h1 className="font-display text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] font-extrabold text-[var(--text-primary)] leading-[1.1] tracking-tight">
                Frisch bestellen.<br />
                Schnell geniessen.
              </h1>

              <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-[380px]">
                Internationale Küche direkt zu dir — frisch zubereitet, schnell geliefert.
              </p>

              {/* Fulfillment switch + conditional PLZ */}
              <HeroOrderEntry />
            </div>

            {/* Right: Food image */}
            <div className="relative hidden md:block">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
                  alt="Frische Küche"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
              {/* Floating trust badge */}
              <div className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-[var(--shadow-md)] px-3.5 py-2.5 flex items-center gap-2.5">
                <div className="flex items-center gap-0.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-[14px] font-bold text-[var(--text-primary)]">4.8</span>
                </div>
                <span className="text-[12px] text-[var(--text-tertiary)]">200+ Bewertungen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ USP BAR — tight, no wasted space ═══ */}
      <section className="border-y border-[var(--border)] bg-white">
        <div className="px-4 lg:max-w-[1280px] lg:mx-auto lg:px-6 py-3.5">
          <div className="flex items-center justify-center gap-6 sm:gap-10 text-[13px]">
            {[
              { icon: Clock, text: '30 Min Lieferzeit' },
              { icon: MapPin, text: 'Zürich & Umgebung' },
              { icon: Leaf, text: 'Frische Zutaten' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Icon className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span className="font-medium whitespace-nowrap">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUICK CATEGORIES ═══ */}
      <section className="px-4 lg:max-w-[1280px] lg:mx-auto lg:px-6 py-8">
        <h2 className="text-[15px] font-extrabold text-[var(--text-primary)] mb-4">
          Was magst du?
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6">
          {(categories.length > 0 ? categories : CATEGORY_ICONS).map((cat, i) => {
            const name = 'name' in cat ? cat.name : ''
            const key = 'id' in cat ? cat.id : name
            return (
              <Link
                key={key}
                href="/menu"
                className="flex-shrink-0 flex flex-col items-center gap-2 w-[80px] lg:w-auto py-3 px-2 rounded-xl hover:bg-white hover:shadow-[var(--shadow-sm)] transition-all"
              >
                <span className="text-3xl">
                  {CATEGORY_ICONS[i % CATEGORY_ICONS.length].emoji}
                </span>
                <span className="text-[12px] font-semibold text-[var(--text-primary)] text-center leading-tight">
                  {name}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ═══ BESTSELLERS ═══ */}
      <section className="px-4 lg:max-w-[1280px] lg:mx-auto lg:px-6 pb-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[15px] font-extrabold text-[var(--text-primary)]">
            Beliebt bei unseren Gästen
          </h2>
          <Link href="/menu" className="flex items-center gap-0.5 text-[13px] font-semibold text-[var(--accent)]">
            Alle <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {bestsellers.map((product, i) => (
            <Link
              key={product.id}
              href="/menu"
              className="flex-shrink-0 w-[200px] lg:w-auto bg-white border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-[var(--shadow-md)] transition-all group"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={FOOD_IMAGES[i % FOOD_IMAGES.length]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
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

      {/* ═══ CTA BANNER — compact ═══ */}
      <section className="px-4 lg:max-w-[1280px] lg:mx-auto lg:px-6 pb-10">
        <div className="bg-[var(--text-primary)] rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-extrabold text-white">
              Hungrig? Bestell jetzt.
            </h2>
            <p className="text-white/50 text-[13px] mt-0.5">
              Frisch zubereitet, schnell geliefert.
            </p>
          </div>
          <Link href="/menu">
            <Button size="lg" className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white flex-shrink-0">
              Speisekarte öffnen
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

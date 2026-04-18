import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PostalCodeCheck } from '@/components/home/PostalCodeCheck'
import { ArrowRight, Clock, Truck, Leaf } from 'lucide-react'
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
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="container py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">
            {/* Left */}
            <div className="space-y-6 max-w-lg">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase bg-[var(--accent-light)] text-[var(--accent)] rounded-full">
                <Clock className="w-3 h-3" />
                Lieferung in 30 Min
              </span>

              <h1 className="font-display text-[2.75rem] md:text-[3.5rem] lg:text-6xl font-extrabold text-[var(--text-primary)] leading-[1.08] tracking-tight">
                Dein Lieblings&shy;essen, direkt zu dir.
              </h1>

              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                Frische, internationale Küche — bestell jetzt und geniess in unter einer Stunde.
              </p>

              <div className="max-w-sm">
                <PostalCodeCheck />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/menu">
                  <Button size="lg">
                    Jetzt bestellen
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button size="lg" variant="outline">
                    Speisekarte ansehen
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="relative hidden md:block">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[var(--shadow-xl)] rotate-1 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
                  alt="Frische Küche"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-[var(--shadow-lg)] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--success-light)] flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[var(--success)]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">100% Frisch</p>
                  <p className="text-xs text-[var(--text-secondary)]">Täglich frische Zutaten</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── USP BAR ── */}
      <section className="border-y border-[var(--border)] bg-white">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm">
            {[
              { icon: Clock, text: '30 Min Lieferzeit' },
              { icon: Truck, text: 'Ab CHF 0 Liefergebühr' },
              { icon: Leaf, text: 'Frische Zutaten täglich' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-[var(--text-secondary)]">
                <Icon className="w-4 h-4 text-[var(--accent)]" />
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      <section className="container py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Beliebt</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mt-1">
              Unsere Bestseller
            </h2>
          </div>
          <Link
            href="/menu"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline underline-offset-4"
          >
            Alle ansehen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Desktop grid / Mobile horizontal scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bestsellers.map((product, i) => (
            <Link
              key={product.id}
              href="/menu"
              className="group bg-white border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[3/2] relative overflow-hidden">
                <Image
                  src={FOOD_IMAGES[i % FOOD_IMAGES.length]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[11px] font-semibold text-[var(--text-secondary)]">
                  {product.category.name}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {product.name}
                  </h3>
                  <span className="font-display text-lg font-bold text-[var(--accent)] flex-shrink-0">
                    {formatPrice(Number(product.basePrice))}
                  </span>
                </div>
                {product.description && (
                  <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/menu">
            <Button variant="outline" size="lg">
              Alle Gerichte ansehen
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="container pb-20">
        <div className="bg-[var(--accent)] rounded-3xl p-10 md:p-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-4">
            Hungrig?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
            Bestell jetzt dein Lieblingsgericht und geniess es in unter einer Stunde.
          </p>
          <Link href="/menu">
            <Button size="lg" className="bg-white text-[var(--accent)] hover:bg-gray-50 shadow-[var(--shadow-lg)]">
              Jetzt bestellen
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

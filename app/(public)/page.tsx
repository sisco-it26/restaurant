import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PostalCodeCheck } from '@/components/home/PostalCodeCheck'
import { ArrowRight, Clock, Truck, Star } from 'lucide-react'
import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'

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
    <div className="pb-16">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(40,33%,97%)] via-[hsl(35,30%,94%)] to-[hsl(24,25%,90%)]" />
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[hsl(24,70%,45%)]/5 blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-[32rem] h-[32rem] rounded-full bg-[hsl(24,50%,60%)]/5 blur-3xl" />

        <div className="relative container py-24 md:py-36">
          <div className="max-w-3xl space-y-8">
            <div className="animate-fade-up">
              <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase text-[hsl(24,70%,45%)] bg-[hsl(24,70%,45%)]/10 rounded-full mb-6">
                Internationales Bistro &bull; Zürich
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[hsl(30,10%,12%)] leading-[0.95] animate-fade-up animate-fade-up-delay-1">
              Frische Küche,
              <br />
              <span className="italic text-[hsl(24,70%,45%)]">ehrlich serviert.</span>
            </h1>

            <p className="text-lg md:text-xl text-[hsl(30,8%,40%)] max-w-xl leading-relaxed animate-fade-up animate-fade-up-delay-2">
              Internationale Aromen, regionale Zutaten. Geniessen Sie unsere Gerichte vor Ort, zum Mitnehmen oder bequem geliefert.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-fade-up animate-fade-up-delay-3">
              <Link href="/menu">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-full bg-[hsl(30,10%,12%)] hover:bg-[hsl(30,10%,18%)] text-[hsl(40,33%,97%)]">
                  Speisekarte entdecken
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6 rounded-full border-[hsl(30,10%,12%)]/20 hover:bg-[hsl(30,10%,12%)]/5">
                  Unsere Geschichte
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[hsl(40,33%,97%)]" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
      </section>

      {/* ── Postal Code Check ── */}
      <section className="container -mt-4 relative z-10 animate-fade-up animate-fade-up-delay-4">
        <div className="max-w-md">
          <PostalCodeCheck />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="container mt-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Clock, title: 'Schnelle Lieferung', desc: 'Frisch & warm in 30–40 Minuten bei Ihnen.' },
            { icon: Truck, title: 'Lieferung & Abholung', desc: 'Flexibel bestellen — wie es Ihnen passt.' },
            { icon: Star, title: 'Frische Zutaten', desc: 'Täglich frisch, regional, mit Sorgfalt.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="group relative p-8 rounded-2xl bg-white/60 border border-[hsl(35,15%,87%)] card-lift"
            >
              <div className="w-12 h-12 rounded-xl bg-[hsl(24,70%,45%)]/10 flex items-center justify-center mb-5 transition-colors group-hover:bg-[hsl(24,70%,45%)]/15">
                <Icon className="w-6 h-6 text-[hsl(24,70%,45%)]" />
              </div>
              <h3 className="font-display text-xl text-[hsl(30,10%,12%)] mb-2">{title}</h3>
              <p className="text-[hsl(30,8%,40%)] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bestsellers ── */}
      <section className="container mt-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[hsl(24,70%,45%)]">
              Beliebt
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-[hsl(30,10%,12%)] mt-2 leading-tight">
              Unsere<br />Bestseller
            </h2>
          </div>
          <Link href="/menu" className="hidden md:flex items-center gap-2 text-sm font-medium text-[hsl(30,8%,40%)] hover:text-[hsl(24,70%,45%)] transition-colors line-reveal pb-1">
            Alle Gerichte
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestsellers.map((product, i) => (
            <div
              key={product.id}
              className="group relative rounded-2xl bg-white/60 border border-[hsl(35,15%,87%)] overflow-hidden card-lift"
            >
              {/* Image placeholder with gradient */}
              <div className="aspect-[4/3] bg-gradient-to-br from-[hsl(35,20%,90%)] to-[hsl(24,15%,85%)] relative">
                <div className="absolute inset-0 bg-[hsl(30,10%,12%)]/0 group-hover:bg-[hsl(30,10%,12%)]/5 transition-colors duration-500" />
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-[hsl(30,8%,40%)]">
                  {product.category.name}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl text-[hsl(30,10%,12%)] leading-tight">
                    {product.name}
                  </h3>
                  <span className="font-display text-xl text-[hsl(24,70%,45%)] flex-shrink-0">
                    {formatPrice(Number(product.basePrice))}
                  </span>
                </div>
                {product.description && (
                  <p className="text-sm text-[hsl(30,8%,40%)] mt-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link href="/menu">
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Alle Gerichte ansehen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

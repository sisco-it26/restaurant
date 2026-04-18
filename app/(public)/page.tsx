import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PostalCodeCheck } from '@/components/home/PostalCodeCheck'
import { ArrowRight, Clock, Truck, Star } from 'lucide-react'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-stone-100 to-stone-50 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-stone-900">
              Authentische Küche,
              <br />
              <span className="text-moss-600">frisch zu Ihnen</span>
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Geniessen Sie unsere hausgemachten Spezialitäten bequem zu Hause oder holen Sie Ihre Bestellung ab.
            </p>

            <PostalCodeCheck />

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/menu">
                <Button size="lg" className="w-full sm:w-auto">
                  Zur Speisekarte
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Über uns
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Clock className="w-10 h-10 text-moss-600 mb-2" />
              <CardTitle>Schnelle Lieferung</CardTitle>
              <CardDescription>
                Ihre Bestellung kommt frisch und warm in 30-40 Minuten bei Ihnen an.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Truck className="w-10 h-10 text-moss-600 mb-2" />
              <CardTitle>Lieferung & Abholung</CardTitle>
              <CardDescription>
                Wählen Sie zwischen bequemer Lieferung oder schneller Abholung vor Ort.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Star className="w-10 h-10 text-moss-600 mb-2" />
              <CardTitle>Frische Zutaten</CardTitle>
              <CardDescription>
                Wir verwenden nur hochwertige, frische Zutaten für unsere Gerichte.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            Unsere Bestseller
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Die beliebtesten Gerichte unserer Gäste
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestsellers.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-stone-200" />
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="text-xs text-stone-500 mt-1">
                      {product.category.name}
                    </CardDescription>
                  </div>
                  <span className="font-display text-lg font-semibold text-moss-600">
                    {formatPrice(Number(product.basePrice))}
                  </span>
                </div>
              </CardHeader>
              {product.description && (
                <CardContent>
                  <p className="text-sm text-stone-600 line-clamp-2">{product.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/menu">
            <Button size="lg" variant="outline">
              Alle Gerichte ansehen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

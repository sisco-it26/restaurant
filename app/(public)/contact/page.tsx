import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

async function getRestaurantInfo() {
  const settings = await prisma.restaurantSettings.findFirst()
  return settings
}

async function getTodayHours() {
  const dayOfWeek = new Date().getDay()
  const hours = await prisma.openingHours.findMany({
    where: { dayOfWeek, isOpen: true },
    orderBy: { openTime: 'asc' },
  })
  return hours
}

export default async function ContactPage() {
  const restaurant = await getRestaurantInfo()
  const todayHours = await getTodayHours()

  if (!restaurant) {
    return <div>Restaurant information not found</div>
  }

  return (
    <div className="container py-16">
      <h1 className="font-display text-4xl font-bold text-stone-900 mb-8 text-center">
        Kontakt
      </h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-moss-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{restaurant.name}</p>
                  <p className="text-sm text-stone-600">
                    {restaurant.address}<br />
                    {restaurant.postalCode} {restaurant.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-moss-600" />
                <a href={`tel:${restaurant.phone}`} className="text-stone-900 hover:text-moss-600">
                  {restaurant.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-moss-600" />
                <a href={`mailto:${restaurant.email}`} className="text-stone-900 hover:text-moss-600">
                  {restaurant.email}
                </a>
              </div>

              <div className="flex items-start gap-3 pt-4 border-t border-stone-200">
                <Clock className="w-5 h-5 text-moss-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-2">Öffnungszeiten heute</p>
                  {todayHours.length > 0 ? (
                    <div className="space-y-1">
                      {todayHours.map((slot, index) => (
                        <p key={index} className="text-sm text-stone-600">
                          {slot.openTime} - {slot.closeTime} Uhr
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-600">Heute geschlossen</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Nachricht senden</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Input placeholder="Name" />
                </div>
                <div>
                  <Input type="email" placeholder="E-Mail" />
                </div>
                <div>
                  <textarea
                    className="flex min-h-[120px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-500"
                    placeholder="Ihre Nachricht"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Nachricht senden
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div>
          <Card className="h-full">
            <CardContent className="p-0">
              <div className="aspect-square bg-stone-200 rounded-lg flex items-center justify-center">
                <p className="text-stone-500">Google Maps Integration</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

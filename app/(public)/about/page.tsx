export default function AboutPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="font-display text-4xl font-bold text-stone-900 mb-8 text-center">
        Über uns
      </h1>

      <div className="prose prose-stone max-w-none space-y-6">
        <div className="aspect-video bg-stone-200 rounded-xl mb-8" />

        <p className="text-lg text-stone-700 leading-relaxed">
          Willkommen in unserem Restaurant! Seit vielen Jahren servieren wir authentische Küche
          mit Leidenschaft und Hingabe. Unsere Philosophie ist einfach: frische Zutaten,
          traditionelle Rezepte und moderne Interpretation.
        </p>

        <h2 className="font-display text-2xl font-bold text-stone-900 mt-8">
          Unsere Geschichte
        </h2>
        <p className="text-stone-700 leading-relaxed">
          Was als kleine Familienküche begann, hat sich zu einem beliebten Restaurant entwickelt.
          Wir legen Wert auf Qualität, Frische und den persönlichen Kontakt zu unseren Gästen.
        </p>

        <h2 className="font-display text-2xl font-bold text-stone-900 mt-8">
          Unsere Werte
        </h2>
        <ul className="space-y-2 text-stone-700">
          <li>✓ Frische, hochwertige Zutaten</li>
          <li>✓ Traditionelle Zubereitungsmethoden</li>
          <li>✓ Nachhaltigkeit und Regionalität</li>
          <li>✓ Herzlicher Service</li>
        </ul>
      </div>
    </div>
  )
}

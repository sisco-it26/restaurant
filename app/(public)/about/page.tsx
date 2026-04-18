import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="container py-16 max-w-5xl">
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">Unsere Geschichte</span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mt-2 mb-6 leading-tight">
            Frische Küche mit Leidenschaft
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            Willkommen im Bistro! Seit vielen Jahren servieren wir internationale Küche
            mit Hingabe. Frische Zutaten, traditionelle Rezepte und moderne Interpretation —
            das ist unsere Philosophie.
          </p>
        </div>
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[var(--shadow-lg)]">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80"
            alt="Restaurant Atmosphäre"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {[
          { title: 'Qualität', desc: 'Nur die besten, frischesten Zutaten kommen in unsere Küche — täglich frisch vom Markt.' },
          { title: 'Tradition', desc: 'Klassische Zubereitungsmethoden treffen auf moderne Interpretationen internationaler Küche.' },
          { title: 'Nachhaltigkeit', desc: 'Regionale Lieferanten, saisonale Produkte und bewusster Umgang mit Ressourcen.' },
        ].map(({ title, desc }) => (
          <div key={title} className="p-6 bg-white border border-[var(--border)] rounded-2xl">
            <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-3">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

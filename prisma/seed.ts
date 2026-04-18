import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Restaurant Settings
  console.log('Creating restaurant settings...')
  await prisma.restaurantSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Restaurant Beispiel',
      description: 'Authentische Schweizer Küche mit modernem Touch',
      address: 'Bahnhofstrasse 1',
      city: 'Zürich',
      postalCode: '8001',
      phone: '+41 44 123 45 67',
      email: 'info@restaurant-beispiel.ch',
      latitude: 47.3769,
      longitude: 8.5417,
      currency: 'CHF',
      locale: 'de-CH',
      autoAcceptOrders: false,
      isOpen: true,
      isTakingOrders: true,
    },
  })

  // Opening Hours (10:00-14:00, 17:00-22:00)
  console.log('Creating opening hours...')
  const days = [0, 1, 2, 3, 4, 5, 6] // Sunday to Saturday
  for (const day of days) {
    await prisma.openingHours.createMany({
      data: [
        {
          dayOfWeek: day,
          openTime: '10:00',
          closeTime: '14:00',
          isOpen: true,
        },
        {
          dayOfWeek: day,
          openTime: '17:00',
          closeTime: '22:00',
          isOpen: true,
        },
      ],
      skipDuplicates: true,
    })
  }

  // Delivery Zones
  console.log('Creating delivery zones...')
  await prisma.deliveryZone.createMany({
    data: [
      {
        name: 'Zürich Zentrum',
        postalCodes: ['8001', '8002', '8003', '8004'],
        deliveryFee: 5.00,
        minOrderAmount: 20.00,
        estimatedTime: 30,
        isActive: true,
      },
      {
        name: 'Zürich Nord',
        postalCodes: ['8037', '8038', '8044', '8045'],
        deliveryFee: 7.00,
        minOrderAmount: 25.00,
        estimatedTime: 40,
        isActive: true,
      },
      {
        name: 'Zürich West',
        postalCodes: ['8005', '8048', '8049'],
        deliveryFee: 6.00,
        minOrderAmount: 22.00,
        estimatedTime: 35,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  })

  // Categories
  console.log('Creating categories...')
  const vorspeisen = await prisma.category.upsert({
    where: { slug: 'vorspeisen' },
    update: {},
    create: {
      name: 'Vorspeisen',
      slug: 'vorspeisen',
      description: 'Leckere Vorspeisen zum Start',
      sortOrder: 1,
      isActive: true,
    },
  })

  const hauptgerichte = await prisma.category.upsert({
    where: { slug: 'hauptgerichte' },
    update: {},
    create: {
      name: 'Hauptgerichte',
      slug: 'hauptgerichte',
      description: 'Unsere beliebten Hauptgerichte',
      sortOrder: 2,
      isActive: true,
    },
  })

  const pizza = await prisma.category.upsert({
    where: { slug: 'pizza' },
    update: {},
    create: {
      name: 'Pizza',
      slug: 'pizza',
      description: 'Frisch gebackene Pizza aus dem Steinofen',
      sortOrder: 3,
      isActive: true,
    },
  })

  const desserts = await prisma.category.upsert({
    where: { slug: 'desserts' },
    update: {},
    create: {
      name: 'Desserts',
      slug: 'desserts',
      description: 'Süsse Verführungen',
      sortOrder: 4,
      isActive: true,
    },
  })

  const getraenke = await prisma.category.upsert({
    where: { slug: 'getraenke' },
    update: {},
    create: {
      name: 'Getränke',
      slug: 'getraenke',
      description: 'Erfrischende Getränke',
      sortOrder: 5,
      isActive: true,
    },
  })

  // Products - Vorspeisen
  console.log('Creating products...')
  await prisma.product.upsert({
    where: { slug: 'bruschetta' },
    update: {},
    create: {
      name: 'Bruschetta',
      slug: 'bruschetta',
      description: 'Geröstetes Brot mit Tomaten, Basilikum und Knoblauch',
      basePrice: 12.50,
      categoryId: vorspeisen.id,
      sortOrder: 1,
      isActive: true,
      isAvailable: true,
      allergens: ['Gluten'],
      additives: [],
    },
  })

  await prisma.product.upsert({
    where: { slug: 'caprese-salat' },
    update: {},
    create: {
      name: 'Caprese Salat',
      slug: 'caprese-salat',
      description: 'Tomaten, Mozzarella und frisches Basilikum',
      basePrice: 14.00,
      categoryId: vorspeisen.id,
      sortOrder: 2,
      isActive: true,
      isAvailable: true,
      allergens: ['Milch'],
      additives: [],
    },
  })

  // Products - Pizza
  const margherita = await prisma.product.upsert({
    where: { slug: 'pizza-margherita' },
    update: {},
    create: {
      name: 'Pizza Margherita',
      slug: 'pizza-margherita',
      description: 'Tomatensauce, Mozzarella, Basilikum',
      basePrice: 16.00,
      categoryId: pizza.id,
      sortOrder: 1,
      isActive: true,
      isAvailable: true,
      allergens: ['Gluten', 'Milch'],
      additives: [],
    },
  })

  const prosciutto = await prisma.product.upsert({
    where: { slug: 'pizza-prosciutto' },
    update: {},
    create: {
      name: 'Pizza Prosciutto',
      slug: 'pizza-prosciutto',
      description: 'Tomatensauce, Mozzarella, Schinken',
      basePrice: 18.50,
      categoryId: pizza.id,
      sortOrder: 2,
      isActive: true,
      isAvailable: true,
      allergens: ['Gluten', 'Milch'],
      additives: [],
    },
  })

  // Pizza Variants
  console.log('Creating product variants...')
  await prisma.productVariant.createMany({
    data: [
      { productId: margherita.id, name: 'Klein (26cm)', priceModifier: -3.00, sortOrder: 1, isActive: true },
      { productId: margherita.id, name: 'Mittel (30cm)', priceModifier: 0.00, sortOrder: 2, isActive: true },
      { productId: margherita.id, name: 'Gross (36cm)', priceModifier: 4.00, sortOrder: 3, isActive: true },
      { productId: prosciutto.id, name: 'Klein (26cm)', priceModifier: -3.00, sortOrder: 1, isActive: true },
      { productId: prosciutto.id, name: 'Mittel (30cm)', priceModifier: 0.00, sortOrder: 2, isActive: true },
      { productId: prosciutto.id, name: 'Gross (36cm)', priceModifier: 4.00, sortOrder: 3, isActive: true },
    ],
    skipDuplicates: true,
  })

  // Pizza Addons
  console.log('Creating product addons...')
  await prisma.productAddon.createMany({
    data: [
      { productId: margherita.id, name: 'Extra Käse', price: 2.50, sortOrder: 1, isActive: true },
      { productId: margherita.id, name: 'Oliven', price: 2.00, sortOrder: 2, isActive: true },
      { productId: margherita.id, name: 'Pilze', price: 2.50, sortOrder: 3, isActive: true },
      { productId: prosciutto.id, name: 'Extra Käse', price: 2.50, sortOrder: 1, isActive: true },
      { productId: prosciutto.id, name: 'Oliven', price: 2.00, sortOrder: 2, isActive: true },
      { productId: prosciutto.id, name: 'Rucola', price: 2.50, sortOrder: 3, isActive: true },
    ],
    skipDuplicates: true,
  })

  // More products
  await prisma.product.createMany({
    data: [
      {
        name: 'Spaghetti Carbonara',
        slug: 'spaghetti-carbonara',
        description: 'Klassische Carbonara mit Speck und Ei',
        basePrice: 19.50,
        categoryId: hauptgerichte.id,
        sortOrder: 1,
        isActive: true,
        isAvailable: true,
        allergens: ['Gluten', 'Ei', 'Milch'],
        additives: [],
      },
      {
        name: 'Tiramisu',
        slug: 'tiramisu',
        description: 'Hausgemachtes italienisches Dessert',
        basePrice: 8.50,
        categoryId: desserts.id,
        sortOrder: 1,
        isActive: true,
        isAvailable: true,
        allergens: ['Gluten', 'Ei', 'Milch'],
        additives: [],
      },
      {
        name: 'Coca Cola',
        slug: 'coca-cola',
        description: '0.33l',
        basePrice: 4.50,
        categoryId: getraenke.id,
        sortOrder: 1,
        isActive: true,
        isAvailable: true,
        allergens: [],
        additives: ['Koffein'],
      },
    ],
    skipDuplicates: true,
  })

  // Static Pages
  console.log('Creating static pages...')
  await prisma.page.createMany({
    data: [
      {
        title: 'Allgemeine Geschäftsbedingungen',
        slug: 'agb',
        content: 'AGB Inhalt hier...',
        isPublished: true,
      },
      {
        title: 'Impressum',
        slug: 'impressum',
        content: 'Impressum Inhalt hier...',
        isPublished: true,
      },
      {
        title: 'Datenschutz',
        slug: 'datenschutz',
        content: 'Datenschutz Inhalt hier...',
        isPublished: true,
      },
    ],
    skipDuplicates: true,
  })

  // Blog Posts
  console.log('Creating blog posts...')
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Willkommen in unserem Restaurant',
        slug: 'willkommen',
        excerpt: 'Erfahren Sie mehr über unsere Geschichte',
        content: 'Blog Inhalt hier...',
        author: 'Restaurant Team',
        isPublished: true,
        publishedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  })

  // Admin User
  console.log('Creating admin user...')
  await prisma.user.upsert({
    where: { email: 'admin@restaurant.ch' },
    update: {},
    create: {
      email: 'admin@restaurant.ch',
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

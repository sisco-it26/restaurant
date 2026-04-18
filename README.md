# Restaurant CMS + Bestellsystem

Premium Restaurant Content Management System und Bestellsystem für den Schweizer Markt.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Real-time**: Socket.io
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/restaurantcms"
```

4. Generate Prisma client and run migrations:
```bash
npm run db:generate
npm run db:push
```

5. Seed the database with sample data:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Project Status

Phase 1 (Foundation) completed:
- ✅ Next.js 15 project setup
- ✅ Prisma schema with complete database models
- ✅ Tailwind CSS with custom design system
- ✅ Seed data for testing

Next phases:
- Phase 2: Core business logic (opening hours, delivery zones, cart)
- Phase 3: Public website (homepage, menu, checkout)
- Phase 4: Admin dashboard
- Phase 5: Kitchen dashboard
- Phase 6: API routes & real-time
- Phase 7: Receipts & QR codes

## Design System

Custom color palette:
- **Stone**: Neutral base colors
- **Moss**: Primary green tones
- **Mist**: Subtle grays
- **Clay**: Warm earth tones
- **Salmon**: Accent colors

Typography:
- **Display**: Montserrat (headings)
- **Sans**: Inter (body text)

## License

Private project

# Restaurant CMS - Technology Stack Research & Documentation

**Date:** April 18, 2026  
**Focus:** Production-ready patterns for multi-role restaurant management system

---

## 1. Prisma ORM + PostgreSQL Setup

### Current Versions & Requirements
- **Prisma:** v6.2.1+ (latest stable)
- **@prisma/client:** Latest version
- **@prisma/adapter-pg:** PostgreSQL adapter
- **Node.js:** v20.19+, v22.12+, or v24.0+
- **PostgreSQL:** 12+

### Official Documentation
- [Prisma + Next.js Guide](https://www.prisma.io/docs/guides/nextjs)
- [Vercel Fullstack Guide](https://vercel.com/guides/nextjs-prisma-postgres)
- [Prisma Postgres Setup](https://www.prisma.io/docs/v6/ai/prompts/nextjs)

### Setup Steps

1. **Initialize Project**
   ```bash
   npm create prisma@latest -- --template next
   # OR manually:
   npx create-next-app@latest
   npm install @prisma/client @prisma/adapter-pg pg dotenv
   npm install -D prisma tsx @types/pg
   ```

2. **Environment Configuration**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_cms"
   ```

3. **Prisma Schema Structure**
   - Set output to: `../app/generated/prisma`
   - Use `@prisma/adapter-pg` for PostgreSQL
   - Load env vars via `dotenv` in `prisma.config.ts`

4. **Key Commands**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   npx prisma studio  # Visual database explorer
   ```

### Production Best Practices

- **Singleton Pattern:** Attach Prisma Client to global object to prevent hot-reload issues
  ```typescript
  // lib/prisma.ts
  import { PrismaClient } from '@prisma/client'
  
  const globalForPrisma = global as unknown as { prisma: PrismaClient }
  
  export const prisma = globalForPrisma.prisma || new PrismaClient()
  
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  ```

- **Server Components:** Use async queries in Server Components
- **Cache Invalidation:** Use `revalidatePath()` after mutations
- **Deployment:** Add `postinstall` script: `prisma generate`
- **Type Safety:** Leverage auto-generated types from schema

### Multi-Role Schema Pattern

```typescript
// Example schema structure for restaurant roles
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      Role     @default(STAFF)
  createdAt DateTime @default(now())
}

enum Role {
  ADMIN
  KITCHEN
  STAFF
}
```

---

## 2. Authentication Solutions for Multi-Role Systems

### Comparison Matrix

| Feature | Clerk | NextAuth.js | Lucia | Better Auth |
|---------|-------|-------------|-------|------------|
| **Setup Complexity** | Low (managed) | Medium (custom) | Medium | Low |
| **RBAC Support** | Built-in | Manual | Manual | Built-in |
| **Multi-org** | Yes | No | No | Yes |
| **Type Safety** | Good | Good | Excellent | Excellent |
| **Cost** | Paid (free tier) | Free | Free | Free |
| **Best For** | SaaS, RBAC | Custom control | Lightweight | Modern apps |

### Clerk (Recommended for Multi-Role)

**Version:** @clerk/nextjs v6.36.7+  
**Documentation:** [Clerk Next.js Guide](https://clerk.com/docs/reference/nextjs/app-router/auth)

**Strengths:**
- Built-in RBAC with `auth().protect()`
- Organization management
- Multi-factor authentication
- Webhook-driven event handling
- Production-ready on day one

**Setup:**
```bash
npm install @clerk/nextjs
```

**Multi-Role Pattern:**
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const protectedRoutes = createRouteMatcher([
  '/admin(.*)',
  '/kitchen(.*)',
  '/staff(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (protectedRoutes(req)) {
    await auth.protect()
  }
})

// Route handler with role check
export async function GET(req: Request) {
  const { userId, sessionClaims } = await auth()
  const userRole = sessionClaims?.role
  
  if (userRole !== 'ADMIN') {
    return new Response('Unauthorized', { status: 403 })
  }
}
```

### NextAuth.js (Custom Control)

**Version:** NextAuth.js v5 (Auth.js)  
**Documentation:** [Auth.js Guide](https://gtc.noqta.tn/en/tutorials/nextjs-authjs-v5-authentication-guide-2026)

**Strengths:**
- Open-source, full control
- Flexible provider support
- No vendor lock-in

**Requires Manual Implementation:**
- Role management in database
- Permission middleware
- Session handling

**RBAC Pattern:**
```typescript
// Define ACL (Access Control List)
const ACL = {
  admin: ['dashboard', 'users', 'reports', 'settings'],
  kitchen: ['orders', 'inventory'],
  staff: ['orders', 'tables'],
}

// Middleware check
export async function middleware(request: NextRequest) {
  const session = await getSession()
  const userRole = session?.user?.role
  const path = request.nextUrl.pathname
  
  if (!ACL[userRole]?.includes(path)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
}
```

### Lucia Auth

**Documentation:** [Lucia Auth Guide](https://wasp-lang.dev/blog/2024/08/13/how-to-add-auth-with-lucia-to-your-react-nextjs-app)

**Strengths:**
- Lightweight, minimal overhead
- Full type safety
- Session-based authentication
- Middleware support for RBAC

**Use Case:** Lightweight apps with custom role logic

### Better Auth (Emerging Standard)

**Documentation:** [Better Auth 2026 Guide](https://noqta.tn/en/tutorials/better-auth-nextjs-authentication-tutorial-2026)

**Features:**
- Framework-agnostic
- TypeScript-first
- Zero lock-in
- Sessions, OAuth, 2FA, email verification

---

## 3. File Upload Solutions for Images

### Comparison Matrix

| Solution | Setup | Cost | Features | Best For |
|----------|-------|------|----------|----------|
| **UploadThing** | Very Easy | Free tier | Type-safe, managed | Quick setup |
| **Cloudinary** | Easy | Free tier | Transformations, CDN | Media-heavy apps |
| **AWS S3** | Complex | Pay-per-use | Full control, scalable | Enterprise |
| **EdgeStore** | Easy | Free tier | Edge storage | Global distribution |

### UploadThing (Recommended for Simplicity)

**Documentation:** [UploadThing Docs](https://supastarter.dev/docs/nextjs/storage/uploadthing)

**Advantages:**
- Type-safe file routes
- Built-in validation
- Managed infrastructure
- No S3 configuration needed

**Setup:**
```bash
npm install uploadthing @uploadthing/react
```

**Implementation:**
```typescript
// lib/uploadthing.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      // Auth check
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
```

### Cloudinary (Recommended for Transformations)

**Version:** next-cloudinary v6+  
**Documentation:** [Cloudinary Next.js Quick Start](https://cloudinary.com/documentation/nextjs_quick_start.md)

**Advantages:**
- Image transformations (resize, crop, optimize)
- CDN delivery
- AI-powered moderation
- Extensive API

**Setup:**
```bash
npm install next-cloudinary
```

**Upload Widget:**
```typescript
'use client'
import { CldUploadWidget } from 'next-cloudinary'

export function ImageUpload() {
  return (
    <CldUploadWidget uploadPreset="your_preset">
      {({ open }) => (
        <button onClick={() => open()}>Upload Image</button>
      )}
    </CldUploadWidget>
  )
}
```

**Signed Uploads (Secure):**
```typescript
<CldUploadWidget
  signatureEndpoint="/api/sign-cloudinary"
  onSuccess={(result) => {
    console.log('Uploaded:', result.event?.info?.secure_url)
  }}
>
  {({ open }) => <button onClick={() => open()}>Upload</button>}
</CldUploadWidget>
```

### AWS S3 (Enterprise Scale)

**Best For:** High-volume, enterprise deployments

**Considerations:**
- Requires AWS account setup
- More complex configuration
- Pay-per-use pricing
- Full control over storage

**Pattern:** Use with UploadThing or Cloudinary as abstraction layer

### Production File Upload Pattern

```typescript
// app/api/upload/route.ts
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File

  // Validate file
  if (!file.type.startsWith('image/')) {
    return new Response('Invalid file type', { status: 400 })
  }
  if (file.size > 4 * 1024 * 1024) {
    return new Response('File too large', { status: 400 })
  }

  // Upload to service (UploadThing, Cloudinary, etc.)
  const uploadedUrl = await uploadToService(file)

  // Store reference in database
  await prisma.image.create({
    data: {
      url: uploadedUrl,
      userId,
    },
  })

  return Response.json({ url: uploadedUrl })
}
```

---

## 4. QR Code Generation

### Recommended Library: qrcode

**Version:** v1.5.4+  
**NPM:** [qrcode package](https://www.npmjs.com/package/qrcode)  
**GitHub:** [soldair/node-qrcode](https://github.com/soldair/node-qrcode)

**Statistics:**
- 1M+ weekly downloads
- 3,615+ dependent projects
- Works on server and client
- Supports multiple output formats

**Installation:**
```bash
npm install qrcode
```

**Server-Side Generation (Receipts/Orders):**
```typescript
import QRCode from 'qrcode'

// Generate as data URL
const qrDataUrl = await QRCode.toDataURL('https://order.example.com/12345', {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  width: 300,
  margin: 1,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
})

// Generate as file
await QRCode.toFile('qr-code.png', 'https://order.example.com/12345', {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  width: 300,
})

// Generate as string (terminal)
const qrString = await QRCode.toString('https://order.example.com/12345', {
  type: 'terminal',
})
```

**Client-Side Generation:**
```typescript
'use client'
import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export function QRCodeDisplay({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        errorCorrectionLevel: 'H',
        width: 300,
      })
    }
  }, [value])

  return <canvas ref={canvasRef} />
}
```

**Use Cases for Restaurant:**
- Order tracking links
- Table QR codes
- Menu links
- Loyalty program codes
- Delivery tracking

---

## 5. Google Maps Integration

### Recommended Library: @vis.gl/react-google-maps

**Version:** v1.7.1+ (November 2025)  
**Status:** Google's officially sponsored library  
**Documentation:** [vis.gl React Google Maps](https://visgl.github.io/react-google-maps/)

**Alternative:** @react-google-maps/api v2.20.8 (community-driven)

### Setup

**Installation:**
```bash
npm install @vis.gl/react-google-maps
npm install -D @types/google.maps
```

**Get API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project
3. Enable "Maps JavaScript API"
4. Create API key (free tier: $200/month credit)

**Environment:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Implementation Pattern

```typescript
'use client'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'

export function RestaurantMap() {
  const restaurantLocation = {
    lat: 40.7128,
    lng: -74.0060,
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <Map
        zoom={15}
        center={restaurantLocation}
        mapId="restaurant-map"
      >
        <Marker position={restaurantLocation} />
      </Map>
    </APIProvider>
  )
}
```

### Features Available

- **Maps:** Standard, satellite, terrain views
- **Markers:** Custom markers with info windows
- **Places:** Location search, autocomplete
- **Directions:** Route planning
- **Geocoding:** Address to coordinates
- **3D Maps:** 3D building visualization
- **WebGL Overlays:** Custom rendering

### Restaurant-Specific Use Cases

- Delivery zone visualization
- Restaurant location display
- Driver tracking
- Delivery address validation
- Multi-location management

---

## 6. PDF/Receipt Generation

### Comparison of Approaches

| Library | Use Case | Complexity | Output Quality |
|---------|----------|-----------|-----------------|
| **PDFKit** | Programmatic creation | Medium | Excellent |
| **Puppeteer** | HTML to PDF | High | Perfect (browser-rendered) |
| **pdfmake** | Template-based | Low | Good |
| **jsPDF** | Lightweight | Low | Basic |

### Recommended: Puppeteer for Receipts

**Version:** v32.0+ (December 2025)  
**Documentation:** [Puppeteer Docs](https://pptr.dev/)

**Advantages:**
- Renders HTML exactly as browser
- Supports modern CSS (Flexbox, Grid)
- JavaScript execution
- Perfect for complex layouts

**Installation:**
```bash
npm install puppeteer
```

**Receipt Generation Pattern:**
```typescript
import puppeteer from 'puppeteer'

export async function generateReceipt(orderData: Order) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Create HTML receipt
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: monospace; width: 80mm; }
          .header { text-align: center; font-weight: bold; }
          .items { margin: 10px 0; }
          .total { border-top: 1px solid; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">RESTAURANT NAME</div>
        <div class="items">
          ${orderData.items.map(item => `
            <div>${item.name} x${item.qty} $${item.price}</div>
          `).join('')}
        </div>
        <div class="total">
          <strong>Total: $${orderData.total}</strong>
        </div>
      </body>
    </html>
  `

  await page.setContent(html)
  const pdf = await page.pdf({ format: 'A4' })

  await browser.close()
  return pdf
}
```

### Alternative: PDFKit (Lightweight)

**Version:** v0.13.0+  
**Use When:** Simple receipts, no complex HTML needed

```typescript
import PDFDocument from 'pdfkit'
import { createWriteStream } from 'fs'

export function generateReceiptPDFKit(orderData: Order) {
  const doc = new PDFDocument()
  const stream = createWriteStream('receipt.pdf')

  doc.pipe(stream)

  doc.fontSize(16).text('RESTAURANT NAME', { align: 'center' })
  doc.moveTo(50, 100).lineTo(550, 100).stroke()

  orderData.items.forEach((item, i) => {
    doc.fontSize(12).text(`${item.name} x${item.qty}`, 50, 120 + i * 20)
    doc.text(`$${item.price}`, 400, 120 + i * 20)
  })

  doc.moveTo(50, 300).lineTo(550, 300).stroke()
  doc.fontSize(14).text(`Total: $${orderData.total}`, 50, 320, {
    align: 'right',
  })

  doc.end()
}
```

### Production Receipt Pattern

```typescript
// app/api/receipts/[orderId]/route.ts
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateReceipt } from '@/lib/pdf'

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: true },
  })

  if (!order) return new Response('Not found', { status: 404 })

  const pdf = await generateReceipt(order)

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="receipt-${order.id}.pdf"`,
    },
  })
}
```

---

## Implementation Priority for Restaurant CMS

### Phase 1 (Core)
1. Prisma + PostgreSQL setup
2. Clerk authentication with multi-role support
3. UploadThing for image uploads

### Phase 2 (Features)
4. QR code generation for orders
5. Google Maps for delivery zones
6. PDF receipts

### Phase 3 (Enhancement)
7. Cloudinary for advanced image transformations
8. Advanced analytics and reporting

---

## Security Best Practices

### Authentication
- Always validate roles server-side
- Use middleware for route protection
- Implement rate limiting on auth endpoints
- Enable MFA for admin accounts

### File Uploads
- Validate file types server-side
- Implement file size limits
- Scan uploads for malware
- Use signed URLs for downloads

### Database
- Use environment variables for credentials
- Enable SSL for PostgreSQL connections
- Regular backups
- Implement row-level security (RLS)

### API Routes
- Validate all inputs
- Use CORS appropriately
- Implement request signing
- Log sensitive operations

---

## References & Documentation

**Prisma:**
- [Official Docs](https://www.prisma.io/docs)
- [Vercel Guide](https://vercel.com/guides/nextjs-prisma-postgres)

**Authentication:**
- [Clerk Docs](https://clerk.com/docs)
- [Auth.js Docs](https://authjs.dev)
- [Lucia Docs](https://lucia-auth.com)

**File Uploads:**
- [UploadThing Docs](https://docs.uploadthing.com)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3)

**QR Codes:**
- [qrcode NPM](https://www.npmjs.com/package/qrcode)

**Maps:**
- [Google Maps API](https://developers.google.com/maps)
- [vis.gl React Maps](https://visgl.github.io/react-google-maps)

**PDF Generation:**
- [Puppeteer Docs](https://pptr.dev)
- [PDFKit Docs](http://pdfkit.org)


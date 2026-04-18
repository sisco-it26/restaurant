import { prisma } from './db'
import { generateQRCode, generateGoogleMapsUrl } from './qr-code'
import { formatPrice } from './utils'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export async function generateReceipt(orderId: string): Promise<string> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  })

  if (!order) {
    throw new Error('Order not found')
  }

  const restaurant = await prisma.restaurantSettings.findFirst()
  if (!restaurant) {
    throw new Error('Restaurant settings not found')
  }

  const address = order.deliveryAddress || `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`
  const mapsUrl = generateGoogleMapsUrl(address)
  const qrCode = await generateQRCode(mapsUrl)

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Courier New', monospace;
      max-width: 80mm;
      margin: 0 auto;
      padding: 10mm;
      font-size: 12pt;
      line-height: 1.4;
    }
    .header {
      text-align: center;
      margin-bottom: 5mm;
      border-bottom: 2px solid #000;
      padding-bottom: 3mm;
    }
    .restaurant-name {
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 2mm;
    }
    .section {
      margin: 5mm 0;
    }
    .label {
      font-weight: bold;
    }
    .items {
      margin: 5mm 0;
      border-top: 1px dashed #000;
      border-bottom: 1px dashed #000;
      padding: 3mm 0;
    }
    .item {
      margin: 2mm 0;
    }
    .item-name {
      font-weight: bold;
    }
    .item-details {
      margin-left: 5mm;
      font-size: 10pt;
    }
    .totals {
      margin: 5mm 0;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 1mm 0;
    }
    .grand-total {
      font-size: 14pt;
      font-weight: bold;
      border-top: 2px solid #000;
      padding-top: 2mm;
      margin-top: 3mm;
    }
    .qr-code {
      text-align: center;
      margin: 5mm 0;
    }
    .qr-code img {
      width: 40mm;
      height: 40mm;
    }
    .footer {
      text-align: center;
      font-size: 10pt;
      margin-top: 5mm;
      border-top: 1px solid #000;
      padding-top: 3mm;
    }
    @media print {
      body { margin: 0; padding: 5mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="restaurant-name">${restaurant.name}</div>
    <div>${restaurant.address}</div>
    <div>${restaurant.postalCode} ${restaurant.city}</div>
    <div>${restaurant.phone}</div>
  </div>

  <div class="section">
    <div><span class="label">Bestellung:</span> #${order.orderNumber}</div>
    <div><span class="label">Datum:</span> ${format(order.createdAt, 'dd.MM.yyyy HH:mm', { locale: de })}</div>
    <div><span class="label">Typ:</span> ${order.type === 'DELIVERY' ? 'Lieferung' : 'Abholung'}</div>
  </div>

  <div class="section">
    <div><span class="label">Kunde:</span> ${order.customerName}</div>
    <div>${order.customerPhone}</div>
    ${order.deliveryAddress ? `<div>${order.deliveryAddress}</div>` : ''}
  </div>

  <div class="items">
    ${order.items.map(item => `
      <div class="item">
        <div class="item-name">${item.quantity}x ${item.productName}</div>
        ${item.variant ? `<div class="item-details">• ${item.variant}</div>` : ''}
        ${item.addons.length > 0 ? `<div class="item-details">+ ${item.addons.join(', ')}</div>` : ''}
        ${item.notes ? `<div class="item-details">Hinweis: ${item.notes}</div>` : ''}
        <div style="text-align: right;">${formatPrice(Number(item.totalPrice))}</div>
      </div>
    `).join('')}
  </div>

  <div class="totals">
    <div class="total-row">
      <span>Zwischensumme:</span>
      <span>${formatPrice(Number(order.subtotal))}</span>
    </div>
    ${Number(order.deliveryFee) > 0 ? `
      <div class="total-row">
        <span>Liefergebühr:</span>
        <span>${formatPrice(Number(order.deliveryFee))}</span>
      </div>
    ` : ''}
    <div class="total-row grand-total">
      <span>GESAMT:</span>
      <span>${formatPrice(Number(order.total))}</span>
    </div>
  </div>

  ${order.notes ? `
    <div class="section">
      <div class="label">Bestellnotiz:</div>
      <div>${order.notes}</div>
    </div>
  ` : ''}

  <div class="qr-code">
    <img src="${qrCode}" alt="QR Code" />
    <div style="font-size: 10pt; margin-top: 2mm;">Scan für Google Maps</div>
  </div>

  <div class="footer">
    Vielen Dank für Ihre Bestellung!<br>
    ${restaurant.email}
  </div>
</body>
</html>
  `

  return html
}

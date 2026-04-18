'use client'

import { useCartStore } from '@/stores/cart-store'

export function useCart() {
  const store = useCartStore()

  return {
    items: store.items,
    orderType: store.orderType,
    deliveryZone: store.deliveryZone,
    postalCode: store.postalCode,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    setOrderType: store.setOrderType,
    setDeliveryZone: store.setDeliveryZone,
    subtotal: store.getSubtotal(),
    deliveryFee: store.getDeliveryFee(),
    total: store.getTotal(),
    itemCount: store.getItemCount(),
  }
}

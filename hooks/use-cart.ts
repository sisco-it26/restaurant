'use client'

import { useCartStore } from '@/stores/cart-store'

export function useCart() {
  const store = useCartStore()

  // Before the persist middleware has rehydrated from localStorage the server
  // and the first client render must agree: treat the cart as empty.
  const hydrated = store._hasHydrated

  return {
    items: hydrated ? store.items : [],
    orderType: store.orderType,
    deliveryZone: store.deliveryZone,
    postalCode: store.postalCode,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    setOrderType: store.setOrderType,
    setDeliveryZone: store.setDeliveryZone,
    subtotal: hydrated ? store.getSubtotal() : 0,
    deliveryFee: hydrated ? store.getDeliveryFee() : 0,
    total: hydrated ? store.getTotal() : 0,
    itemCount: hydrated ? store.getItemCount() : 0,
  }
}

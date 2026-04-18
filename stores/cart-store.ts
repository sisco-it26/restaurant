import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type CartItem = {
  id: string
  productId: string
  productName: string
  productSlug: string
  basePrice: number
  quantity: number
  variant?: {
    id: string
    name: string
    priceModifier: number
  }
  addons: Array<{
    id: string
    name: string
    price: number
  }>
  notes?: string
  totalPrice: number
}

export type OrderType = 'DELIVERY' | 'PICKUP'

// Tracks whether the store has been rehydrated from localStorage.
// Used by components to avoid rendering client-only values (e.g. itemCount)
// before hydration is complete, which would cause a SSR/client mismatch.
type CartStore = {
  _hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  items: CartItem[]
  orderType: OrderType
  deliveryZone?: {
    id: string
    name: string
    deliveryFee: number
    minOrderAmount: number | null
    estimatedTime: number
  }
  postalCode?: string

  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setOrderType: (type: OrderType) => void
  setDeliveryZone: (zone: CartStore['deliveryZone'], postalCode: string) => void

  getSubtotal: () => number
  getDeliveryFee: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      items: [],
      orderType: 'DELIVERY',

      addItem: (item) => {
        const id = `${item.productId}-${item.variant?.id || 'no-variant'}-${item.addons.map(a => a.id).join(',')}`
        const totalPrice = item.basePrice +
          (item.variant?.priceModifier || 0) +
          item.addons.reduce((sum, addon) => sum + addon.price, 0)

        set((state) => {
          const existing = state.items.find(i => i.id === id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            }
          }
          return {
            items: [...state.items, { ...item, id, totalPrice }],
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => {
        set({ items: [], deliveryZone: undefined, postalCode: undefined })
      },

      setOrderType: (type) => {
        set({ orderType: type })
        if (type === 'PICKUP') {
          set({ deliveryZone: undefined, postalCode: undefined })
        }
      },

      setDeliveryZone: (zone, postalCode) => {
        set({ deliveryZone: zone, postalCode, orderType: 'DELIVERY' })
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0)
      },

      getDeliveryFee: () => {
        const { orderType, deliveryZone } = get()
        return orderType === 'DELIVERY' && deliveryZone ? deliveryZone.deliveryFee : 0
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryFee()
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'restaurant-cart',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { API_BASE_URL } from '../config/api'
import { authFetch } from '../util/authFetch'
import type { Product } from '../types/product'

export interface CartItem {
  id: number
  product: Product
  quantity: number
}

interface Cart {
  id: number
  items: CartItem[]
}

interface CartContextValue {
  cart: Cart | null
  cartCount: number
  refreshCart: () => Promise<void>
  addItem: (productId: number, quantity?: number) => Promise<void>
  updateItemQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  getCartItemForProduct: (productId: number) => CartItem | undefined
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)

  const refreshCart = useCallback(async () => {
    try {
      const response = await authFetch(`${API_BASE_URL}/cart`)
      if (!response.ok) return
      setCart((await response.json()) as Cart)
    } catch {
      // best-effort; leave cart as-is
    }
  }, [])

  const addItem = useCallback(async (productId: number, quantity = 1) => {
    const response = await authFetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    })

    if (response.ok) setCart((await response.json()) as Cart)
  }, [])

  const updateItemQuantity = useCallback(async (itemId: number, quantity: number) => {
    const response = await authFetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    })

    if (response.ok) setCart((await response.json()) as Cart)
  }, [])

  const removeItem = useCallback(async (itemId: number) => {
    const response = await authFetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
    })

    if (response.ok) setCart((await response.json()) as Cart)
  }, [])

  const getCartItemForProduct = useCallback(
    (productId: number) => cart?.items.find((item) => item.product.id === productId),
    [cart],
  )

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        refreshCart,
        addItem,
        updateItemQuantity,
        removeItem,
        getCartItemForProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'cart'

const CartContext = createContext(null)

function isValidItem(item) {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.productId === 'string' &&
    typeof item.variantId === 'string' &&
    typeof item.name === 'string' &&
    typeof item.image === 'string' &&
    typeof item.size === 'string' &&
    typeof item.color === 'string' &&
    Number.isFinite(item.price) &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    Number.isInteger(item.stock) &&
    item.stock >= item.quantity
  )
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isValidItem)) {
      return []
    }
    return parsed
  } catch (error) {
    console.error('تعذّر قراءة السلة من التخزين المحلي', error)
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('تعذّر حفظ السلة في التخزين المحلي', error)
    }
  }, [items])

  const addItem = useCallback((item) => {
    setItems((current) => {
      const existing = current.find(
        (entry) => entry.variantId === item.variantId,
      )

      if (existing) {
        return current.map((entry) =>
          entry.variantId === item.variantId
            ? {
                ...entry,
                quantity: Math.min(
                  entry.quantity + (item.quantity ?? 1),
                  entry.stock,
                ),
              }
            : entry,
        )
      }

      const quantity = Math.min(item.quantity ?? 1, item.stock)
      if (quantity < 1) {
        return current
      }
      return [...current, { ...item, quantity }]
    })
  }, [])

  const increaseQty = useCallback((variantId) => {
    setItems((current) =>
      current.map((entry) =>
        entry.variantId === variantId
          ? { ...entry, quantity: Math.min(entry.quantity + 1, entry.stock) }
          : entry,
      ),
    )
  }, [])

  const decreaseQty = useCallback((variantId) => {
    setItems((current) =>
      current.map((entry) =>
        entry.variantId === variantId
          ? { ...entry, quantity: Math.max(entry.quantity - 1, 1) }
          : entry,
      ),
    )
  }, [])

  const removeItem = useCallback((variantId) => {
    setItems((current) =>
      current.filter((entry) => entry.variantId !== variantId),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const value = useMemo(() => {
    const totalCount = items.reduce((sum, entry) => sum + entry.quantity, 0)
    const totalPrice = items.reduce(
      (sum, entry) => sum + entry.price * entry.quantity,
      0,
    )

    return {
      items,
      addItem,
      increaseQty,
      decreaseQty,
      removeItem,
      clearCart,
      totalCount,
      totalPrice,
    }
  }, [items, addItem, increaseQty, decreaseQty, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

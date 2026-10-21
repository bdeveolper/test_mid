import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getProductById } from '../services/productService'

const STORAGE_KEY = 'cart'
const CartContext = createContext(null)

function isValidItem(item) {
  return Boolean(
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
      (item.unavailable ? item.quantity >= 0 : item.quantity > 0) &&
      Number.isInteger(item.stock) &&
      item.stock >= 0 &&
      (item.unavailable || item.stock >= item.quantity),
  )
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isValidItem)) return []

    return parsed.reduce((unique, item) => {
      const existing = unique.find((entry) => entry.variantId === item.variantId)
      if (!existing) return [...unique, item]
      existing.quantity = item.unavailable
        ? 0
        : Math.min(existing.quantity + item.quantity, item.stock)
      existing.stock = item.stock
      existing.unavailable = existing.unavailable && item.unavailable
      return unique
    }, [])
  } catch (error) {
    console.error('تعذّر قراءة السلة من التخزين المحلي', error)
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [pricesChanged, setPricesChanged] = useState(false)
  const itemsRef = useRef(items)
  const refreshPromise = useRef(null)
  const lastRefresh = useRef({ key: '', at: 0 })

  useEffect(() => {
    itemsRef.current = items
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('تعذّر حفظ السلة في التخزين المحلي', error)
    }
  }, [items])

  const refreshCart = useCallback(() => {
    const currentItems = itemsRef.current
    const productIds = [...new Set(currentItems.map((item) => item.productId))]
    const refreshKey = productIds.join('|')
    if (refreshPromise.current) return refreshPromise.current
    if (
      lastRefresh.current.key === refreshKey &&
      Date.now() - lastRefresh.current.at < 1500
    ) {
      return Promise.resolve({ pricesChanged: false })
    }

    const refresh = (async () => {
      const products = await Promise.all(
        productIds.map(async (id) => [id, await getProductById(id)]),
      )
      const productsById = new Map(products)
      const refreshedItems = new Map()
      let priceChanged = false

      for (const item of currentItems) {
        const product = productsById.get(item.productId)
        const variant = product?.variants.find((entry) => entry.id === item.variantId)
        if (!product || !variant) {
          refreshedItems.set(item.variantId, {
            ...item,
            stock: 0,
            quantity: 0,
            unavailable: true,
          })
          continue
        }

        const price = Number(product.price)
        if (price !== item.price) priceChanged = true
        refreshedItems.set(item.variantId, {
          ...item,
          name: product.name,
          image: product.images?.[0] ?? '',
          price,
          stock: variant.stock,
          quantity: variant.stock > 0 ? Math.min(item.quantity || 1, variant.stock) : 0,
          unavailable: variant.stock <= 0,
        })
      }

      setItems((current) =>
        current.map((item) => refreshedItems.get(item.variantId) ?? item),
      )
      if (priceChanged) setPricesChanged(true)
      lastRefresh.current = { key: refreshKey, at: Date.now() }
      return { pricesChanged: priceChanged }
    })()

    refreshPromise.current = refresh.finally(() => {
      refreshPromise.current = null
    })
    return refreshPromise.current
  }, [])

  useEffect(() => {
    if (items.length) {
      refreshCart().catch((error) => {
        console.error('تعذّر تحديث منتجات السلة', error)
      })
    }
  }, [items.length, refreshCart])

  const addItem = useCallback((item) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.variantId === item.variantId)
      if (existing) {
        return current.map((entry) =>
          entry.variantId === item.variantId
            ? {
                ...entry,
                ...item,
                quantity: Math.min(
                  existing.quantity + (item.quantity ?? 1),
                  item.stock,
                ),
                unavailable: false,
              }
            : entry,
        )
      }
      const quantity = Math.min(item.quantity ?? 1, item.stock)
      return quantity > 0
        ? [...current, { ...item, quantity, unavailable: false }]
        : current
    })
  }, [])

  const increaseQty = useCallback((variantId) => {
    setItems((current) =>
      current.map((entry) =>
        entry.variantId === variantId && !entry.unavailable
          ? { ...entry, quantity: Math.min(entry.quantity + 1, entry.stock) }
          : entry,
      ),
    )
  }, [])

  const decreaseQty = useCallback((variantId) => {
    setItems((current) =>
      current.map((entry) =>
        entry.variantId === variantId && !entry.unavailable
          ? { ...entry, quantity: Math.max(entry.quantity - 1, 1) }
          : entry,
      ),
    )
  }, [])

  const removeItem = useCallback((variantId) => {
    setItems((current) => current.filter((entry) => entry.variantId !== variantId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const value = useMemo(() => {
    const availableItems = items.filter((item) => !item.unavailable)
    return {
      items,
      pricesChanged,
      refreshCart,
      addItem,
      increaseQty,
      decreaseQty,
      removeItem,
      clearCart,
      totalCount: availableItems.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: availableItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
    }
  }, [
    items,
    pricesChanged,
    refreshCart,
    addItem,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}

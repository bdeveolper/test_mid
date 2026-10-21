import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { getCategoryLabel } from '../../lib/categories'
import { isOneSizeProduct } from '../../lib/variants'
import SizePicker, { ColorPicker, PurchaseBar } from './SizePicker'
const EMPTY_VARIANTS = []
const createCartItem = (product, variant, quantity) => ({
  productId: product.id,
  variantId: variant.id,
  name: product.name,
  image: product.images?.[0] ?? '',
  size: variant.size,
  color: variant.color,
  price: product.price,
  quantity,
  stock: variant.stock,
})

function QuickViewModal({ product, onClose, returnFocusRef }) {
  const dialogRef = useRef(null)
  const { addItem } = useCart()
  const variants = product.variants ?? EMPTY_VARIANTS
  const oneSize = isOneSizeProduct(product)
  const sizes = useMemo(() => [...new Set(variants.map((variant) => variant.size))], [variants])
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [confirmation, setConfirmation] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const returnFocusElement = returnFocusRef.current
    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      returnFocusElement?.focus()
    }
  }, [onClose, returnFocusRef])

  useEffect(() => {
    if (!confirmation) return undefined
    const timer = setTimeout(onClose, 1000)
    return () => clearTimeout(timer)
  }, [confirmation, onClose])

  const selectedVariant = variants.find((variant) =>
    variant.color === selectedColor &&
    (oneSize ? variant.size.trim() === 'مقاس واحد' : variant.size === selectedSize),
  )
  const canAdd = Boolean(selectedVariant && selectedVariant.stock > 0)
  const handleColorSelect = (color) => {
    const currentSizeIsAvailable = variants.some(
      (variant) =>
        variant.color === color &&
        variant.size === selectedSize &&
        variant.stock > 0,
    )
    setSelectedColor(color)
    if (!currentSizeIsAvailable) setSelectedSize('')
    setQuantity(1)
  }
  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    setQuantity(1)
  }
  const handleAdd = () => {
    if (!canAdd) return
    addItem(createCartItem(product, selectedVariant, quantity))
    setConfirmation(true)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/60 md:items-center md:p-6"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`quick-view-title-${product.id}`}
        tabIndex={-1}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl focus:outline-none md:max-h-[85vh] md:rounded-2xl"
      >
        <div className="flex flex-none justify-end border-b border-neutral-100 bg-white p-2">
          <button type="button" aria-label="إغلاق" onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-xl font-bold text-neutral-900 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600">
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-square bg-neutral-100 md:aspect-auto">
              {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" /> : null}
            </div>
            <div className="flex flex-col gap-5 p-5 sm:p-7">
              <header className="flex flex-col gap-2">
                <h2 id={`quick-view-title-${product.id}`} className="text-xl font-bold text-neutral-900">
                  {product.name}
                </h2>
                <p className="text-sm text-neutral-600">{getCategoryLabel(product.category)}</p>
                <p className="text-xl font-bold text-accent-500">{product.price} ج.م</p>
              </header>
              <ColorPicker variants={variants} selectedColor={selectedColor} onSelect={handleColorSelect} />
              {oneSize ? (
                <p className="text-sm text-neutral-600">مقاس واحد</p>
              ) : (
                <SizePicker sizes={sizes} variants={variants} selectedColor={selectedColor} selectedSize={selectedSize} onSelect={handleSizeSelect} />
              )}
              <p aria-live="polite" className={`min-h-6 font-bold ${canAdd ? 'text-success-600' : 'text-danger-600'}`}>{selectedVariant ? (canAdd ? `متوفر: ${selectedVariant.stock} قطعة` : 'غير متوفر') : variants.every((variant) => variant.stock <= 0) ? 'غير متوفر' : '\u00a0'}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-none flex-col bg-white">
          <PurchaseBar canAdd={canAdd} quantity={quantity} stock={selectedVariant?.stock ?? 0} confirmation={confirmation} onQuantity={setQuantity} onAdd={handleAdd} />
          <Link
            to={`/product/${product.id}`}
            onClick={onClose}
            className="inline-flex min-h-11 w-full items-center justify-center text-center font-semibold text-brand-600 hover:underline"
          >
            عرض صفحة المنتج الكاملة
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default QuickViewModal

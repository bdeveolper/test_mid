import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductGallery from '../components/product/ProductGallery'
import VariantSelector from '../components/product/VariantSelector'
import BackButton from '../components/layout/BackButton'
import { useCart } from '../context/CartContext'
import { getCategoryLabel } from '../lib/categories'
import { getProductById } from '../services/productService'

const uniqueValues = (values) => Array.from(new Set(values))

function ProductDetails() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [result, setResult] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState(false)

  useEffect(() => {
    let active = true

    getProductById(id).then((data) => {
      if (active) {
        setResult({ id, product: data })
      }
    })

    return () => {
      active = false
    }
  }, [id])

  useEffect(() => {
    if (!feedback) {
      return undefined
    }

    const timer = setTimeout(() => setFeedback(false), 2500)
    return () => clearTimeout(timer)
  }, [feedback])

  const loading = result?.id !== id
  const product = loading ? null : result?.product
  const variants = product?.variants

  const sizes = useMemo(
    () => uniqueValues((variants ?? []).map((variant) => variant.size)),
    [variants],
  )
  const colors = useMemo(
    () => uniqueValues((variants ?? []).map((variant) => variant.color)),
    [variants],
  )

  if (loading) {
    return (
      <p className="py-16 text-center text-neutral-600">جارِ تحميل المنتج...</p>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col gap-6">
        <BackButton />
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-brand-50 p-8 text-center">
        <p className="text-lg font-bold text-neutral-900">المنتج غير موجود</p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-600 px-6 font-bold text-white transition-colors hover:bg-opacity-90"
        >
          العودة إلى الرئيسية
        </Link>
        </div>
      </div>
    )
  }

  const isAvailable = (key) => (value) =>
    variants.some((variant) => variant[key] === value && variant.stock > 0)

  const selectedVariant = variants.find(
    (variant) =>
      variant.size === selectedSize && variant.color === selectedColor,
  )
  const canAdd = Boolean(selectedVariant && selectedVariant.stock > 0)

  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    setQuantity(1)
  }

  const handleColorSelect = (color) => {
    setSelectedColor(color)
    setQuantity(1)
  }

  const handleAdd = () => {
    if (!canAdd || quantity < 1 || quantity > selectedVariant.stock) {
      return
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: product.images?.[0] ?? '',
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: product.price,
      quantity,
      stock: selectedVariant.stock,
    })
    setFeedback(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="relative">
        <BackButton className="absolute top-3 start-3 z-10" />
        <ProductGallery images={product.images} name={product.name} />
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold text-brand-600">
          {getCategoryLabel(product.category)}
        </span>
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
          {product.name}
        </h1>
        <p className="text-2xl font-bold text-accent-500">{product.price} ج.م</p>
        <p className="text-neutral-600">{product.description}</p>

        <VariantSelector
          title="المقاس"
          options={sizes}
          selected={selectedSize}
          isAvailable={isAvailable('size')}
          onSelect={handleSizeSelect}
        />

        <VariantSelector
          title="اللون"
          options={colors}
          selected={selectedColor}
          isAvailable={isAvailable('color')}
          onSelect={handleColorSelect}
        />

        {selectedSize && selectedColor ? (
          <p
            className={
              canAdd
                ? 'font-bold text-success-600'
                : 'font-bold text-danger-600'
            }
          >
            {canAdd ? `متوفر: ${selectedVariant.stock} قطعة` : 'غير متوفر'}
          </p>
        ) : null}

        {canAdd ? (
        <div className="flex items-center gap-3">
          <span className="font-semibold text-neutral-900">الكمية</span>
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1}
            aria-label="تقليل الكمية"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-100 text-lg font-bold text-neutral-900 transition-colors hover:border-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            -
          </button>
          <span aria-live="polite" className="w-8 text-center font-bold text-neutral-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.min(selectedVariant.stock, current + 1),
              )
            }
            disabled={quantity >= selectedVariant.stock}
            aria-label="زيادة الكمية"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-100 text-lg font-bold text-neutral-900 transition-colors hover:border-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
          <span className="text-sm text-neutral-600">
            (الحد الأقصى {selectedVariant.stock})
          </span>
        </div>
        ) : null}

        <button
        type="button"
        disabled={!canAdd || quantity > selectedVariant.stock}
          onClick={handleAdd}
          className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand-600 px-6 font-bold text-white transition-colors ${
            canAdd ? 'hover:bg-opacity-90' : 'cursor-not-allowed opacity-50'
          }`}
        >
          أضف للسلة
        </button>

        {feedback ? (
          <p className="font-bold text-success-600">
            تمت إضافة المنتج إلى السلة
          </p>
        ) : null}
      </div>
      </div>
    </div>
  )
}

export default ProductDetails

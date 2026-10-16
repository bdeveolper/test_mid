import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CheckoutForm from '../components/cart/CheckoutForm'
import CartItem from '../components/cart/CartItem'
import BackButton from '../components/layout/BackButton'
import { useCart } from '../context/CartContext'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import { buildInvoiceMessage } from '../lib/whatsappInvoice'

function Cart() {
  const { items, totalCount, totalPrice, clearCart } = useCart()
  const [error, setError] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const checkoutRef = useRef(null)

  const handleCheckout = () => {
    if (!checkoutOpen) {
      setCheckoutOpen(true)
      return
    }
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleOrder = (customer) => {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER

    if (!phone) {
      setError('رقم واتساب المتجر غير متوفر حالياً، يرجى المحاولة لاحقاً.')
      return
    }

    setError('')
    const message = buildInvoiceMessage(
      items,
      import.meta.env.VITE_STORE_NAME,
      customer,
    )
    window.open(
      buildWhatsAppUrl(phone, message),
      '_blank',
      'noopener,noreferrer',
    )
  }

  const handleClear = () => {
    if (window.confirm('هل أنت متأكد من تفريغ السلة بالكامل؟')) {
      clearCart()
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <BackButton />
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-brand-50 p-8 text-center">
        <p className="text-lg font-bold text-neutral-900">سلة الشراء فارغة</p>
        <p className="mt-2 text-neutral-600">لم تقم بإضافة أي منتجات بعد.</p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-600 px-6 font-bold text-white transition-colors hover:bg-opacity-90"
        >
          تصفح المنتجات
        </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <BackButton />
      <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
        سلة الشراء
      </h1>

      <div className="hidden rounded-2xl border border-neutral-100 bg-neutral-100 px-4 py-3 text-sm font-bold text-neutral-900 lg:grid lg:grid-cols-[minmax(0,2fr)_1fr_0.8fr_1fr_0.8fr] lg:gap-4">
        <span>المنتج</span>
        <span>المقاس واللون</span>
        <span>سعر الوحدة</span>
        <span>الكمية</span>
        <span className="text-end">الإجمالي</span>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <CartItem key={item.variantId} item={item} />
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-4">
        <span className="font-bold text-neutral-900">
          الإجمالي ({totalCount} قطعة)
        </span>
        <span className="text-xl font-bold text-accent-500">
          {totalPrice} ج.م
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleCheckout}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand-600 px-6 font-bold text-white transition-colors hover:bg-opacity-90 sm:w-auto"
        >
          إتمام الطلب
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-semibold text-neutral-600 transition-colors hover:text-danger-600"
        >
          تفريغ السلة
        </button>
      </div>

      {error ? (
        <p role="alert" className="text-sm font-bold text-danger-600">{error}</p>
      ) : null}
      {checkoutOpen ? (
        <div ref={checkoutRef} className="scroll-mt-24">
          <CheckoutForm onSubmit={handleOrder} />
        </div>
      ) : null}
    </div>
  )
}

export default Cart

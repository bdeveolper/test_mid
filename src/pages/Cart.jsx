import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CheckoutForm from '../components/cart/CheckoutForm'
import CartItem from '../components/cart/CartItem'
import BackButton from '../components/layout/BackButton'
import { useCart } from '../context/CartContext'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import { buildInvoiceMessage } from '../lib/whatsappInvoice'
import { createOrder } from '../services/orderService'
import { getArabicError } from '../services/productService'

function Cart() {
  const {
    items,
    totalCount,
    totalPrice,
    clearCart,
    removeItem,
    refreshCart,
    pricesChanged,
  } = useCart()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [refreshing, setRefreshing] = useState(true)
  const [refreshFailed, setRefreshFailed] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const checkoutRef = useRef(null)
  const submittingRef = useRef(false)
  const availableItems = items.filter((item) => !item.unavailable)

  useEffect(() => {
    let active = true
    refreshCart()
      .catch((refreshError) => {
        console.error('تعذّر تحديث منتجات السلة', refreshError)
        if (active) {
          setRefreshFailed(true)
          setError('تعذّر تحديث السلة من المخزون الحالي، يرجى المحاولة مرة أخرى.')
        }
      })
      .finally(() => {
        if (active) setRefreshing(false)
      })
    return () => {
      active = false
    }
  }, [refreshCart])

  const handleCheckout = () => {
    if (!checkoutOpen) {
      setCheckoutOpen(true)
      return
    }
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleOrder = async (customer) => {
    if (refreshing || refreshFailed) {
      setError('تعذّر تأكيد الأسعار والمخزون الحاليين. يرجى إعادة تحميل السلة.')
      return
    }
    if (!availableItems.length) {
      setError('لا توجد منتجات متاحة لإتمام الطلب.')
      return
    }
    if (submittingRef.current) return
    submittingRef.current = true
    setSubmitting(true)
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER

    if (!phone) {
      setError('رقم واتساب المتجر غير متوفر حالياً، يرجى المحاولة لاحقاً.')
      submittingRef.current = false
      setSubmitting(false)
      return
    }

    setError('')
    try {
      await createOrder(
        customer,
        availableItems.map(({ variantId, quantity }) => ({ variantId, quantity })),
      )
      openWhatsApp(phone, customer)
    } catch (orderError) {
      const rawError = orderError.cause ?? orderError
      const reason = `${rawError?.code ?? ''} ${rawError?.message ?? ''}`.toLowerCase()

      if (
        reason.includes('insufficient_stock') ||
        reason.includes('variant_not_available')
      ) {
        setError(getArabicError(rawError))
        return
      }

      openWhatsApp(phone, customer)
      setError(
        'تم فتح واتساب، لكن تعذّر تسجيل الطلب في النظام، يرجى إبلاغ المتجر',
      )
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const openWhatsApp = (phone, customer) => {
    const message = buildInvoiceMessage(
      availableItems,
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
      {pricesChanged ? (
        <p role="status" className="font-semibold text-brand-600">
          تم تحديث أسعار بعض المنتجات في سلتك
        </p>
      ) : null}

      <div className="hidden rounded-2xl border border-neutral-100 bg-neutral-100 px-4 py-3 text-sm font-bold text-neutral-900 lg:grid lg:grid-cols-[minmax(0,2fr)_1fr_0.8fr_1fr_0.8fr] lg:gap-4">
        <span>المنتج</span>
        <span>المقاس واللون</span>
        <span>سعر الوحدة</span>
        <span>الكمية</span>
        <span className="text-end">الإجمالي</span>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => item.unavailable ? (
          <article
            key={item.variantId}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded-xl bg-neutral-100 object-cover"
              />
              <div>
                <p className="font-bold text-neutral-900">{item.name}</p>
                <p className="text-sm text-neutral-600">
                  مقاس {item.size} - لون {item.color}
                </p>
                <p className="mt-1 font-semibold text-danger-600">
                  هذا المنتج غير متوفر حالياً
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.variantId)}
              className="min-h-11 rounded-xl px-3 font-semibold text-danger-600 hover:bg-neutral-100"
            >
              إزالة
            </button>
          </article>
        ) : <CartItem key={item.variantId} item={item} />)}
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
          disabled={!availableItems.length || refreshing || refreshFailed}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand-600 px-6 font-bold text-white transition-colors hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
      {checkoutOpen && availableItems.length > 0 ? (
        <div ref={checkoutRef} className="scroll-mt-24">
          <CheckoutForm onSubmit={handleOrder} submitting={submitting || refreshing || refreshFailed} />
        </div>
      ) : null}
    </div>
  )
}

export default Cart

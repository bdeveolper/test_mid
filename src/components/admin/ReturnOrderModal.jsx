import { useState } from 'react'

function ReturnOrderModal({ order, onClose, onSubmit, submitting }) {
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(order.order_items.map((item) => [item.id, item.quantity])),
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(
      order.order_items.map((item) => ({
        itemId: item.id,
        returnedQuantity: Number(quantities[item.id]),
      })),
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/50 p-3 sm:items-center">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-order-title"
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"
      >
        <h2 id="return-order-title" className="text-xl font-bold text-neutral-900">
          تسجيل مرتجعات الطلب
        </h2>
        <div className="my-5 flex max-h-[55vh] flex-col gap-3 overflow-y-auto">
          {order.order_items.map((item) => (
            <label key={item.id} className="flex items-center justify-between gap-4">
              <span className="font-semibold text-neutral-900">
                {item.product_name} — {item.size}، {item.color}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-sm text-neutral-600">
                المرتجع
                <input
                  type="number"
                  min="0"
                  max={item.quantity}
                  step="1"
                  required
                  value={quantities[item.id]}
                  onChange={(event) =>
                    setQuantities((current) => ({
                      ...current,
                      [item.id]: event.target.value,
                    }))
                  }
                  aria-label={`المرتجع من ${item.product_name}`}
                  className="min-h-11 w-20 rounded-xl border border-neutral-100 px-2 text-center text-neutral-900"
                />
                <span>من {item.quantity}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="min-h-11 rounded-xl border border-neutral-100 px-4 font-semibold text-neutral-600"
          >
            إغلاق
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="min-h-11 rounded-xl bg-brand-600 px-4 font-bold text-white disabled:opacity-60"
          >
            {submitting ? 'جارٍ الحفظ...' : 'تأكيد المرتجعات'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReturnOrderModal

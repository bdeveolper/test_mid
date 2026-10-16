import { useCart } from '../../context/CartContext'

function CartItem({ item }) {
  const { increaseQty, decreaseQty, removeItem } = useCart()
  const lineTotal = item.price * item.quantity

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 lg:grid lg:grid-cols-[minmax(0,2fr)_1fr_0.8fr_1fr_0.8fr] lg:items-center lg:gap-4">
      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-xl bg-neutral-100 object-cover"
        />
        <div className="min-w-0">
          <p className="truncate font-bold text-neutral-900">{item.name}</p>
          <p className="mt-1 text-sm text-neutral-600 lg:hidden">
            مقاس {item.size} - لون {item.color}
          </p>
        </div>
      </div>

      <p className="mt-3 hidden text-sm text-neutral-600 lg:mt-0 lg:block">
        مقاس {item.size} - لون {item.color}
      </p>

      <p className="mt-3 text-sm font-semibold text-neutral-900 lg:mt-0">
        {item.price} ج.م
      </p>

      <div className="mt-3 flex items-center gap-3 lg:mt-0">
        <button
          type="button"
          onClick={() => decreaseQty(item.variantId)}
          disabled={item.quantity <= 1}
          aria-label="تقليل الكمية"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-100 text-lg font-bold text-neutral-900 transition-colors hover:border-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          -
        </button>
        <span className="w-8 text-center font-bold text-neutral-900">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => increaseQty(item.variantId)}
          disabled={item.quantity >= item.stock}
          aria-label="زيادة الكمية"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-100 text-lg font-bold text-neutral-900 transition-colors hover:border-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between lg:mt-0 lg:justify-end lg:gap-4">
        <span className="font-bold text-accent-500">{lineTotal} ج.م</span>
        <button
          type="button"
          onClick={() => removeItem(item.variantId)}
          className="text-sm font-semibold text-danger-600 hover:underline"
        >
          إزالة
        </button>
      </div>
    </div>
  )
}

export default CartItem

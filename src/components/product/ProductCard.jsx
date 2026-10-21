import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategoryLabel } from '../../lib/categories'
import QuickViewModal from './QuickViewModal'

function ProductCard({ product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const quickViewButtonRef = useRef(null)
  const closeQuickView = useCallback(() => setQuickViewOpen(false), [])
  const image = product.images?.[0]

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-shadow hover:shadow-md">
      <Link
        to={`/product/${product.id}`}
        aria-label={`عرض ${product.name}`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600"
      >
      </Link>
      <div className="pointer-events-none aspect-square w-full overflow-hidden bg-neutral-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="pointer-events-none relative z-10 flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <span className="text-xs font-semibold text-brand-600">
          {getCategoryLabel(product.category)}
        </span>
        <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-neutral-900 sm:text-base">
          {product.name}
        </h3>
        <div className="mt-auto flex min-h-11 items-center gap-2 pt-1">
          <span className="text-base font-bold text-accent-500 sm:text-lg">
            {product.price} ج.م
          </span>
          <button
            ref={quickViewButtonRef}
            type="button"
            aria-label="اختيار المقاس واللون"
            onClick={() => setQuickViewOpen(true)}
            className="pointer-events-auto relative z-10 ms-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M14 5v6m-3-3h6" />
            </svg>
          </button>
        </div>
      </div>
      {quickViewOpen ? (
        <QuickViewModal
          product={product}
          onClose={closeQuickView}
          returnFocusRef={quickViewButtonRef}
        />
      ) : null}
    </article>
  )
}

export default ProductCard

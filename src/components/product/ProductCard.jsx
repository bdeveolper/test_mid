import { Link } from 'react-router-dom'
import { getCategoryLabel } from '../../lib/categories'
import VariantPicker from './VariantPicker'

function ProductCard({ product }) {
  const image = product.images?.[0]
  const variants = product.variants ?? []
  const isOutOfStock = !variants.some((variant) => variant.stock > 0)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-shadow hover:shadow-md">
      <Link
        to={`/product/${product.id}`}
        className="flex flex-col after:absolute after:inset-0 after:z-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-600 focus-visible:after:ring-inset"
      >
        <div className="aspect-square w-full overflow-hidden bg-neutral-100">
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
          {isOutOfStock ? (
            <span className="absolute top-2 end-2 rounded-full bg-danger-600 px-3 py-1 text-xs font-bold text-white">
              غير متوفر
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-1 p-3 sm:p-4">
          <span className="text-xs font-semibold text-brand-600">
            {getCategoryLabel(product.category)}
          </span>
          <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-neutral-900 sm:text-base">
            {product.name}
          </h3>
          <span className="pt-1 text-base font-bold text-accent-500 sm:text-lg">
            {product.price} ج.م
          </span>
        </div>
      </Link>
      <VariantPicker product={product} />
    </article>
  )
}

export default ProductCard

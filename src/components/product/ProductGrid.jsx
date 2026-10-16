import ProductCard from './ProductCard'

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
      <div className="aspect-square w-full animate-pulse bg-neutral-100" />
      <div className="space-y-2 p-3 sm:p-4">
        <div className="h-3 w-16 animate-pulse rounded-full bg-neutral-100" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-neutral-100" />
        <div className="h-4 w-20 animate-pulse rounded-full bg-neutral-100" />
      </div>
    </div>
  )
}

function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-brand-50 p-8 text-center">
        <p className="text-lg font-bold text-neutral-900">لا توجد منتجات مطابقة</p>
        <p className="mt-2 text-neutral-600">
          جرّب تغيير الفلاتر أو اختيار فئة أخرى.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid

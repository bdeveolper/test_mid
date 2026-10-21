import { CATEGORIES } from '../../lib/categories'

function ProductFilters({
  search,
  category,
  resultCount,
  onSearchChange,
  onCategoryChange,
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="ابحثي باسم المنتج"
          aria-label="ابحثي باسم المنتج"
          className="min-h-11 w-full rounded-xl border border-neutral-100 bg-white px-3 md:flex-1"
        />
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          aria-label="التصفية حسب التصنيف"
          className="min-h-11 w-full rounded-xl border border-neutral-100 bg-white px-3 md:w-auto md:min-w-56"
        >
          <option value="">كل التصنيفات</option>
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-neutral-600">عدد النتائج: {resultCount}</p>
    </div>
  )
}

export default ProductFilters

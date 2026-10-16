import { CATEGORIES } from '../../lib/categories'

function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex min-h-[44px] shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition-colors',
        selected
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-neutral-100 bg-neutral-100 text-neutral-600 hover:border-brand-600 hover:text-brand-600',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function ChipRow({ title, children }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="shrink-0 text-sm font-bold text-neutral-900 sm:w-16">
        {title}
      </span>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {children}
      </div>
    </div>
  )
}

function FilterBar({ filters, onChange }) {
  const setFilter = (key, value) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-4">
      <ChipRow title="الفئة">
        <Chip
          label="الكل"
          selected={!filters.category}
          onClick={() => setFilter('category', '')}
        />
        {CATEGORIES.map((category) => (
          <Chip
            key={category.value}
            label={category.filterLabel}
            selected={filters.category === category.value}
            onClick={() => setFilter('category', category.value)}
          />
        ))}
      </ChipRow>

    </div>
  )
}

export default FilterBar

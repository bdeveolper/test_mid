function VariantSelector({ title, options, selected, isAvailable, onSelect }) {
  if (options.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-bold text-neutral-900">{title}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const available = isAvailable(option)
          const isSelected = selected === option

          return (
            <button
              key={option}
              type="button"
              disabled={!available}
              onClick={() => onSelect(option)}
              className={[
                'inline-flex min-h-[44px] items-center rounded-full border px-4 text-sm font-semibold transition-colors',
                isSelected
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-neutral-100 bg-neutral-100 text-neutral-600',
                available ? '' : 'cursor-not-allowed opacity-40',
              ].join(' ')}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default VariantSelector

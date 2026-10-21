const swatchColors = {
  أبيض: '#ffffff',
  أسود: '#111827',
  كحلي: '#1e3a8a',
  'أخضر زيتي': '#556b2f',
  وردي: '#f9a8d4',
  رمادي: '#9ca3af',
  بيج: '#d6c2a1',
  'أزرق سماوي': '#7dd3fc',
}

export function ColorPicker({ variants, selectedColor, onSelect }) {
  const colors = [...new Set(variants.map((variant) => variant.color))]
  return (
    <section aria-label="اختيار اللون" className="flex flex-col gap-2">
      <p className="font-bold text-neutral-900">
        {selectedColor ? `اللون: ${selectedColor}` : 'اللون'}
      </p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const available = variants.some(
            (variant) => variant.color === color && variant.stock > 0,
          )
          const selected = selectedColor === color
          return (
            <button
              key={color}
              type="button"
              title={color}
              aria-label={color}
              aria-pressed={selected}
              disabled={!available}
              onClick={() => onSelect(color)}
              className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-neutral-600/40 ${
                selected ? 'ring-2 ring-brand-600 ring-offset-2' : ''
              } ${available ? '' : 'cursor-not-allowed opacity-45 grayscale'}`}
            >
              <span
                aria-hidden="true"
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: swatchColors[color] ?? '#9ca3af' }}
              />
              {!available ? (
                <span aria-hidden="true" className="absolute h-px w-10 rotate-45 bg-danger-600" />
              ) : null}
              {selected ? (
                <span aria-hidden="true" className="absolute text-sm font-bold text-brand-600">✓</span>
              ) : null}
              <span className="pointer-events-none absolute top-full z-10 mt-1 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {color}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function PurchaseBar({ canAdd, quantity, stock, confirmation, onQuantity, onAdd }) {
  return (
    <footer className="flex flex-none items-center gap-3 border-t border-neutral-100 bg-white p-4 sm:px-6">
      <div className="flex w-36 shrink-0 items-center justify-between">
        <button
          type="button"
          aria-label="تقليل الكمية"
          disabled={!canAdd || quantity <= 1}
          onClick={() => onQuantity((current) => Math.max(1, current - 1))}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-100 text-lg disabled:opacity-40"
        >
          -
        </button>
        <span aria-live="polite" className="w-8 text-center font-bold">{quantity}</span>
        <button
          type="button"
          aria-label="زيادة الكمية"
          disabled={!canAdd || quantity >= stock}
          onClick={() => onQuantity((current) => Math.min(stock, current + 1))}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-100 text-lg disabled:opacity-40"
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={!canAdd || confirmation}
        onClick={onAdd}
        className="inline-flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-xl bg-brand-600 px-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {confirmation ? 'تمت الإضافة للسلة' : 'أضف للسلة'}
      </button>
    </footer>
  )
}

function SizePicker({ sizes, variants, selectedColor, selectedSize, onSelect }) {
  return (
    <section aria-label="اختيار المقاس" className="flex flex-col gap-2">
      <p className="font-bold text-neutral-900">
        {selectedSize ? `المقاس: ${selectedSize}` : 'المقاس'}
      </p>
      {!selectedSize ? (
        <p className="text-sm text-neutral-600">اختر المقاس</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const matchingVariant = variants.find(
            (variant) =>
              variant.color === selectedColor && variant.size === size,
          )
          const available = matchingVariant?.stock > 0
          const disabled = !selectedColor || !available
          return (
            <button
              key={size}
              type="button"
              disabled={disabled}
              aria-pressed={selectedSize === size}
              onClick={() => onSelect(size)}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 font-semibold ${
                selectedSize === size
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-neutral-100 bg-white text-neutral-900'
              } ${
                disabled
                  ? `cursor-not-allowed opacity-40${selectedColor && matchingVariant ? ' text-neutral-600 line-through' : ''}`
                  : 'hover:border-brand-600'
              }`}
            >
              {size}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default SizePicker

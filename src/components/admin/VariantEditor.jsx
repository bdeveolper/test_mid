import { useState } from 'react'
import { COLORS, SIZES_BY_CATEGORY } from '../../data/options'

function VariantEditor({ category, variants, error, onChange }) {
  const [groupColors, setGroupColors] = useState(() => [
    ...new Set(variants.map((variant) => variant.color)),
  ])
  const sizes = SIZES_BY_CATEGORY[category] ?? []

  const updateColor = (groupIndex, color) => {
    const previousColor = groupColors[groupIndex]
    setGroupColors((current) =>
      current.map((item, index) => (index === groupIndex ? color : item)),
    )
    onChange(
      variants.map((variant) =>
        variant.color === previousColor ? { ...variant, color } : variant,
      ),
    )
  }

  const updateVariant = (size, color, checked, stock = 0) => {
    const next = variants.filter(
      (variant) => !(variant.size === size && variant.color === color),
    )
    if (checked) next.push({ size, color, stock })
    onChange(next)
  }

  const addColor = () => {
    const availableColor = COLORS.find((color) => !groupColors.includes(color))
    if (availableColor) setGroupColors((current) => [...current, availableColor])
  }

  const removeColor = (groupIndex) => {
    const color = groupColors[groupIndex]
    setGroupColors((current) => current.filter((_, index) => index !== groupIndex))
    onChange(variants.filter((variant) => variant.color !== color))
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold text-neutral-900">الألوان والمقاسات والمخزون</h2>
        <button
          type="button"
          onClick={addColor}
          disabled={!COLORS.some((color) => !groupColors.includes(color))}
          className="min-h-[44px] rounded-xl border border-brand-600 px-4 font-semibold text-brand-600 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          إضافة لون
        </button>
      </div>
      {!sizes.length ? (
        <p className="text-sm text-neutral-600">اختر تصنيف المنتج أولاً.</p>
      ) : null}
      {groupColors.map((color, groupIndex) => (
        <div
          key={`${groupIndex}-${color}`}
          className="flex flex-col gap-4 rounded-xl border border-neutral-100 bg-white p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex min-h-[44px] flex-1 flex-col gap-1 text-sm font-semibold text-neutral-900">
              اللون
              <select
                value={color}
                onChange={(event) => updateColor(groupIndex, event.target.value)}
                className="min-h-[44px] rounded-lg border border-neutral-100 bg-white px-3 font-normal"
              >
                {!COLORS.includes(color) ? (
                  <option value={color} disabled>{color}</option>
                ) : null}
                {COLORS.map((option) => (
                  <option
                    key={option}
                    value={option}
                    disabled={groupColors.includes(option) && option !== color}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => removeColor(groupIndex)}
              className="min-h-[44px] rounded-lg px-3 font-semibold text-danger-600 hover:bg-neutral-100"
            >
              حذف اللون
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => {
              const variant = variants.find(
                (item) => item.size === size && item.color === color,
              )
              const stockId = `stock-${groupIndex}-${size}`
              return (
                <div
                  key={size}
                  className="flex min-h-[44px] items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2"
                >
                  <label className="inline-flex min-h-[44px] items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(variant)}
                      onChange={(event) =>
                        updateVariant(size, color, event.target.checked)
                      }
                      className="h-5 w-5 accent-brand-600"
                    />
                    <span className="text-sm font-semibold text-neutral-900">مقاس {size}</span>
                  </label>
                  {variant ? (
                    <label className="flex flex-col gap-1 text-xs font-semibold text-neutral-600">
                      المخزون المتاح
                      <input
                        id={stockId}
                        type="number"
                        min="0"
                        step="1"
                        value={variant.stock}
                        aria-label={`المخزون المتاح لمقاس ${size} بلون ${color}`}
                        onChange={(event) =>
                          updateVariant(
                            size,
                            color,
                            true,
                            Math.max(0, Math.floor(Number(event.target.value) || 0)),
                          )
                        }
                        className="min-h-[44px] w-24 rounded-lg border border-neutral-100 bg-white px-2 text-sm font-normal"
                      />
                    </label>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ))}
      {error ? <p className="text-sm font-semibold text-danger-600">{error}</p> : null}
    </section>
  )
}

export default VariantEditor

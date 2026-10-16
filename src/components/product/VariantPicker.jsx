import { useEffect, useState } from 'react'
import { useCart } from '../../context/CartContext'

function SelectionGroup({ label, options, selected, isDisabled, onSelect }) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-1">
      <legend className="h-5 text-xs font-bold leading-5 text-neutral-900 sm:text-sm">
        {label}
      </legend>
      <div className="flex h-11 min-w-0 gap-1.5 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
        {options.map((option) => {
          const disabled = isDisabled(option)
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              aria-pressed={selected === option}
              onClick={() => onSelect(option)}
              className={`inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full border px-3 text-xs font-semibold transition-colors sm:text-sm ${
                disabled
                  ? 'cursor-not-allowed border-neutral-100 bg-neutral-100 text-neutral-600 line-through opacity-60'
                  : selected === option
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-neutral-100 bg-white text-neutral-600 hover:border-brand-600 hover:text-brand-600'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function VariantPicker({ product }) {
  const { addItem } = useCart()
  const variants = product.variants ?? []
  const sizes = Array.from(new Set(variants.map((variant) => variant.size)))
  const colors = Array.from(new Set(variants.map((variant) => variant.color)))
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [confirmation, setConfirmation] = useState(false)

  useEffect(() => {
    if (!confirmation) return undefined
    const timer = setTimeout(() => setConfirmation(false), 2500)
    return () => clearTimeout(timer)
  }, [confirmation])

  const selectedVariant =
    selectedSize && selectedColor
      ? variants.find(
          (variant) =>
            variant.size === selectedSize && variant.color === selectedColor,
        )
      : null
  const canAdd = Boolean(selectedVariant && selectedVariant.stock > 0)

  const handleAdd = () => {
    if (!canAdd) return
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      image: product.images?.[0] ?? '',
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: product.price,
      quantity: 1,
      stock: selectedVariant.stock,
    })
    setSelectedSize('')
    setSelectedColor('')
    setConfirmation(true)
  }

  return (
    <div className="relative z-10 mt-auto flex flex-1 flex-col gap-2 border-t border-neutral-100 p-3 pt-3 sm:p-4">
      <SelectionGroup
        label="المقاسات"
        options={sizes}
        selected={selectedSize}
        isDisabled={(size) =>
          !variants.some(
            (variant) =>
              variant.size === size &&
              variant.stock > 0 &&
              (!selectedColor || variant.color === selectedColor),
          )
        }
        onSelect={setSelectedSize}
      />
      <SelectionGroup
        label="الألوان"
        options={colors}
        selected={selectedColor}
        isDisabled={(color) =>
          !variants.some(
            (variant) =>
              variant.color === color &&
              variant.stock > 0 &&
              (!selectedSize || variant.size === selectedSize),
          )
        }
        onSelect={setSelectedColor}
      />

      <p className={`min-h-5 text-xs font-bold ${selectedSize && selectedColor ? (canAdd ? 'text-success-600' : 'text-danger-600') : 'invisible'}`}>
        {selectedSize && selectedColor
          ? canAdd
            ? `متوفر: ${selectedVariant.stock} قطعة`
            : 'غير متوفر'
          : '\u00a0'}
      </p>

      <button
        type="button"
        disabled={!canAdd}
        onClick={handleAdd}
        className={`mt-auto inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand-600 px-3 text-sm font-bold text-white transition-colors ${
          canAdd ? 'hover:bg-opacity-90' : 'cursor-not-allowed opacity-50'
        }`}
      >
        أضف للسلة
      </button>
      <p
        role="status"
        className={`min-h-4 text-center text-xs font-bold text-success-600 ${
          confirmation ? '' : 'invisible'
        }`}
      >
        {confirmation ? 'تمت الإضافة إلى السلة' : '\u00a0'}
      </p>
    </div>
  )
}

export default VariantPicker

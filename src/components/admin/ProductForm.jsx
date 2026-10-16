import { useEffect, useRef, useState } from 'react'
import { CATEGORIES } from '../../lib/categories'
import { saveProduct } from '../../services/productService'
import ImagePicker from './ImagePicker'
import VariantEditor from './VariantEditor'

const emptyVariant = (id) => ({ id, size: '', color: '', stock: '0' })

function ProductForm({ product, submitLabel }) {
  const [fields, setFields] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    category: product?.category ?? '',
    price: product?.price ?? '',
    isActive: product?.isActive ?? true,
  })
  const [images, setImages] = useState(() =>
    (product?.images ?? []).map((src, index) => ({
      id: `existing-${index}`,
      src,
    })),
  )
  const [variants, setVariants] = useState(() =>
    (product?.variants ?? []).map((variant) => ({
      ...variant,
      stock: String(variant.stock),
    })),
  )
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [saving, setSaving] = useState(false)
  const objectUrls = useRef(new Set())
  const nextVariantId = useRef(0)

  useEffect(
    () => () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url))
    },
    [],
  )

  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    setFields((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const addImages = (files) => {
    const selected = files
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => {
        const src = URL.createObjectURL(file)
        objectUrls.current.add(src)
        return { id: src, src }
      })
    setImages((current) => [...current, ...selected])
  }

  const removeImage = (id) => {
    const image = images.find((entry) => entry.id === id)
    if (image && objectUrls.current.delete(image.src)) {
      URL.revokeObjectURL(image.src)
    }
    setImages((current) => current.filter((entry) => entry.id !== id))
  }

  const updateVariant = (index, field, value) => {
    setVariants((current) =>
      current.map((variant, row) =>
        row === index ? { ...variant, [field]: value } : variant,
      ),
    )
    setErrors((current) => ({ ...current, variants: '' }))
  }

  const validate = () => {
    const nextErrors = {}
    const price = Number(fields.price)
    if (!fields.name.trim()) nextErrors.name = 'يرجى إدخال اسم المنتج.'
    if (!fields.category) nextErrors.category = 'يرجى اختيار التصنيف.'
    if (!Number.isFinite(price) || price <= 0) {
      nextErrors.price = 'يجب أن يكون السعر أكبر من صفر.'
    }

    const seen = new Set()
    const duplicate = variants.some((variant) => {
      const key = JSON.stringify([
        variant.size.trim().toLocaleLowerCase(),
        variant.color.trim().toLocaleLowerCase(),
      ])
      if (seen.has(key)) return true
      seen.add(key)
      return false
    })
    if (duplicate) nextErrors.variants = 'يوجد مقاس ولون مكرران.'
    if (
      variants.some(
        (variant) =>
          !variant.size.trim() ||
          !variant.color.trim() ||
          !Number.isInteger(Number(variant.stock)) ||
          Number(variant.stock) < 0,
      )
    ) {
      nextErrors.variants = 'يرجى إدخال المقاس واللون ومخزون صحيح لكل صف.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    if (!validate()) return

    setSaving(true)
    try {
      await saveProduct(
        {
          ...fields,
          id: product?.id,
          name: fields.name.trim(),
          price: Number(fields.price),
          images: images.map((image) => image.src),
        },
        variants.map((variant) => ({
          ...variant,
          stock: Number(variant.stock),
        })),
      )
      setStatus({ type: 'success', message: 'تم حفظ المنتج بنجاح.' })
    } catch (error) {
      console.error('تعذّر حفظ المنتج', error)
      setStatus({
        type: 'error',
        message: 'تعذّر حفظ المنتج، يرجى المحاولة مرة أخرى.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-1 font-semibold text-neutral-900">
          اسم المنتج
          <input
            name="name"
            value={fields.name}
            onChange={updateField}
            className="min-h-[48px] rounded-xl border border-neutral-100 bg-white px-3 font-normal"
          />
          {errors.name ? <span className="text-sm text-danger-600">{errors.name}</span> : null}
        </label>
        <label className="flex flex-col gap-1 font-semibold text-neutral-900">
          التصنيف
          <select
            name="category"
            value={fields.category}
            onChange={updateField}
            className="min-h-[48px] rounded-xl border border-neutral-100 bg-white px-3 font-normal"
          >
            <option value="">اختر التصنيف</option>
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category ? <span className="text-sm text-danger-600">{errors.category}</span> : null}
        </label>
        <label className="flex flex-col gap-1 font-semibold text-neutral-900">
          السعر (ج.م)
          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={fields.price}
            onChange={updateField}
            className="min-h-[48px] rounded-xl border border-neutral-100 bg-white px-3 font-normal"
          />
          {errors.price ? <span className="text-sm text-danger-600">{errors.price}</span> : null}
        </label>
        <label className="flex flex-col gap-1 font-semibold text-neutral-900 lg:row-span-2">
          الوصف
          <textarea
            name="description"
            value={fields.description}
            onChange={updateField}
            rows="4"
            className="min-h-[120px] rounded-xl border border-neutral-100 bg-white px-3 py-2 font-normal"
          />
        </label>
        <label className="inline-flex min-h-[44px] items-center gap-3 font-semibold text-neutral-900">
          <input
            name="isActive"
            type="checkbox"
            checked={fields.isActive}
            onChange={updateField}
            className="h-5 w-5 accent-brand-600"
          />
          المنتج نشط
        </label>
      </div>

      <ImagePicker images={images} onAdd={addImages} onRemove={removeImage} />
      <VariantEditor
        variants={variants}
        error={errors.variants}
        onChange={updateVariant}
        onAdd={() =>
          setVariants((current) => [
            ...current,
            emptyVariant(`new-${nextVariantId.current++}`),
          ])
        }
        onRemove={(index) =>
          setVariants((current) => current.filter((_, row) => row !== index))
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={saving}
          className="min-h-[48px] rounded-xl bg-brand-600 px-6 font-bold text-white hover:bg-opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? 'جارٍ الحفظ...' : submitLabel}
        </button>
        {status.message ? (
          <p
            role="status"
            className={`font-semibold ${status.type === 'success' ? 'text-success-600' : 'text-danger-600'}`}
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  )
}

export default ProductForm

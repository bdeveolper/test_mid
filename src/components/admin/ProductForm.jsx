import { useEffect, useRef, useState } from 'react'
import { SIZES_BY_CATEGORY } from '../../data/options'
import { CATEGORIES } from '../../lib/categories'
import { saveProduct, uploadProductImage } from '../../services/productService'
import ImagePicker from './ImagePicker'
import VariantEditor from './VariantEditor'

function ProductForm({ product, submitLabel, onSuccess }) {
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
    (product?.variants ?? []).map(({ size, color, stock }) => ({
      size,
      color,
      stock,
    })),
  )
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [variantNotice, setVariantNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const objectUrls = useRef(new Set())

  useEffect(
    () => () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url))
    },
    [],
  )

  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    if (name === 'category' && value !== fields.category) {
      const validSizes = SIZES_BY_CATEGORY[value] ?? []
      const removed = variants.filter((variant) => !validSizes.includes(variant.size))
      setVariants((current) =>
        current.filter((variant) => validSizes.includes(variant.size)),
      )
      setVariantNotice(
        removed.length
          ? `تم حذف المقاسات غير المتاحة للتصنيف الجديد: ${[...new Set(removed.map((variant) => variant.size))].join('، ')}.`
          : '',
      )
    }
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
        return { id: src, src, file }
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

  const updateVariants = (nextVariants) => {
    setVariants(nextVariants)
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

    if (fields.isActive && variants.length === 0) {
      nextErrors.variants = 'يرجى إضافة مقاس واحد على الأقل للمنتج النشط.'
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
      const selectedImages = images.filter((image) => image.file)
      const invalidImageSource = images.some(
        (image) =>
          !image.file && /^(blob:|data:)/i.test(image.src),
      )
      const existingImageUrls = images
        .filter((image) => !image.file && /^https?:\/\//i.test(image.src))
        .map((image) => image.src)
      const uploadedImageUrls = []
      let uploadFailed = false

      if (selectedImages.length) {
        setUploading(true)
        const uploadResults = await Promise.allSettled(
          selectedImages.map((image) => uploadProductImage(image.file)),
        )
        uploadResults.forEach((result) => {
          if (result.status === 'fulfilled' && /^https?:\/\//i.test(result.value)) {
            uploadedImageUrls.push(result.value)
          } else {
            uploadFailed = true
            if (result.status === 'rejected') {
              console.error('تعذّر رفع صورة المنتج', result.reason)
            }
          }
        })
        setUploading(false)
      }

      await saveProduct(
        {
          ...fields,
          id: product?.id,
          name: fields.name.trim(),
          price: Number(fields.price),
          images: [...existingImageUrls, ...uploadedImageUrls],
        },
        variants.map((variant) => ({
          ...variant,
          stock: Number(variant.stock),
        })),
      )
      setStatus(
        invalidImageSource || uploadFailed
          ? {
              type: 'error',
              message: 'تعذّر رفع بعض الصور، أعيدي اختيارها',
            }
          : { type: 'success', message: 'تم حفظ المنتج بنجاح.' },
      )
      onSuccess?.()
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
        category={fields.category}
        variants={variants}
        error={errors.variants}
        onChange={updateVariants}
      />
      {variantNotice ? (
        <p role="status" className="text-sm font-semibold text-neutral-600">
          {variantNotice}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={saving || uploading}
          className="min-h-[48px] rounded-xl bg-brand-600 px-6 font-bold text-white hover:bg-opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {uploading ? 'جاري رفع الصور...' : saving ? 'جارٍ الحفظ...' : submitLabel}
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

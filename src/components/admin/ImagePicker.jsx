import { useRef } from 'react'

function ImagePicker({ images, onAdd, onRemove }) {
  const inputRef = useRef(null)

  const handleChange = (event) => {
    onAdd(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-bold text-neutral-900">صور المنتج</h2>
      <label className="flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-neutral-100 bg-white px-4 font-semibold text-brand-600 hover:bg-brand-50">
        اختيار صور
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="sr-only"
        />
      </label>
      {images.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative overflow-hidden rounded-xl border border-neutral-100 bg-white"
            >
              <img
                src={image.src}
                alt="معاينة صورة المنتج"
                className="aspect-square w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(image.id)}
                className="min-h-[44px] w-full px-3 text-sm font-semibold text-danger-600 hover:bg-neutral-100"
              >
                إزالة الصورة
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-600">لم تتم إضافة صور.</p>
      )}
    </section>
  )
}

export default ImagePicker

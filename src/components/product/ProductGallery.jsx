import { useState } from 'react'

function ProductGallery({ images, name }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasImages = images.length > 0
  const current = hasImages ? images[activeIndex] : null

  return (
    <div>
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto lg:hidden">
        {hasImages ? (
          images.map((src) => (
            <img
              key={src}
              src={src}
              alt={name}
              loading="lazy"
              className="aspect-square w-full shrink-0 snap-center rounded-2xl bg-neutral-100 object-cover"
            />
          ))
        ) : (
          <div className="aspect-square w-full shrink-0 rounded-2xl bg-neutral-100" />
        )}
      </div>

      <div className="hidden lg:flex lg:gap-3">
        <div className="flex-1">
          {current ? (
            <img
              src={current}
              alt={name}
              className="aspect-square w-full rounded-2xl bg-neutral-100 object-cover"
            />
          ) : (
            <div className="aspect-square w-full rounded-2xl bg-neutral-100" />
          )}
        </div>

        {images.length > 1 ? (
          <div className="flex w-20 flex-col gap-2">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`صورة ${index + 1}`}
                className={`overflow-hidden rounded-xl border-2 ${
                  index === activeIndex ? 'border-brand-600' : 'border-transparent'
                }`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProductGallery

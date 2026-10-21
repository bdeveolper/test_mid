import { useState } from 'react'

function GalleryImage({ src, alt, containerClass, imageClass }) {
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`${containerClass} bg-neutral-100`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={imageClass}
          onError={() => setHasError(true)}
        />
      ) : null}
    </div>
  )
}

function ProductGallery({ images, name }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasImages = images.length > 0
  const current = hasImages ? images[activeIndex] : null

  return (
    <div>
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto lg:hidden">
        {hasImages ? (
          images.map((src) => (
            <GalleryImage
              key={src}
              src={src}
              alt={name}
              containerClass="aspect-square w-full shrink-0 snap-center rounded-2xl"
              imageClass="h-full w-full object-cover"
            />
          ))
        ) : (
          <div className="aspect-square w-full shrink-0 rounded-2xl bg-neutral-100" />
        )}
      </div>

      <div className="hidden lg:flex lg:gap-3">
        <div className="flex-1">
          {current ? (
            <GalleryImage
              key={current}
              src={current}
              alt={name}
              containerClass="aspect-square w-full rounded-2xl"
              imageClass="h-full w-full rounded-2xl object-cover"
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
                <GalleryImage
                  key={src}
                  src={src}
                  alt=""
                  containerClass="aspect-square w-full"
                  imageClass="h-full w-full object-cover"
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

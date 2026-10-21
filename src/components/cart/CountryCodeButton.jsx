import { useEffect, useRef, useState } from 'react'

function CountryCodeButton({ countries, country, onSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setIsOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="اختيار رمز الدولة"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-11 shrink-0 items-center gap-1 border-e border-neutral-100 px-3 text-neutral-900"
      >
        <span>+{country.dialCode}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </button>
      {isOpen ? (
        <div
          role="listbox"
          aria-label="الدولة"
          className="absolute start-0 top-full z-20 mt-1 max-h-64 w-[min(18rem,90vw)] min-w-[220px] overflow-y-auto rounded-xl border border-neutral-100 bg-white p-1 shadow-lg"
        >
          {countries.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={country.code === item.code}
              onClick={() => {
                onSelect(item)
                setIsOpen(false)
              }}
              className={`min-h-11 w-full rounded-lg px-3 text-start text-sm ${
                country.code === item.code
                  ? 'bg-brand-50 font-semibold text-brand-600'
                  : 'text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {item.nameAr} (+{item.dialCode})
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default CountryCodeButton

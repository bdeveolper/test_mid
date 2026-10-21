import { useState } from 'react'

function FooterSection({ id, title, children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={id}
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-11 w-full items-center justify-between border-b border-white/20 bg-brand-600 text-start font-extrabold text-white md:hidden"
      >
        {title}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <h2 className="mb-2 hidden text-base font-extrabold leading-6 text-white md:block">
        {title}
      </h2>
      <div id={id} className={isOpen ? 'block md:block' : 'hidden md:block'}>
        {children}
      </div>
    </section>
  )
}

export default FooterSection

export function ContactIcon({ type }) {
  const paths = {
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    chat: <><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" /><path d="M9 8.5c.5 2 2 3.5 4.5 4.5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent-500">
      {paths[type]}
    </svg>
  )
}

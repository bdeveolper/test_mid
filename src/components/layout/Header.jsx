import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

const navigation = [
  { to: '/', label: 'الرئيسية' },
  { to: '/#products', label: 'المنتجات' },
  { to: '/about', label: 'عن المتجر' },
  { to: '/contact', label: 'تواصل معنا' },
]

function CartLink({ totalCount }) {
  return (
    <Link
      to="/cart"
      aria-label={`السلة${totalCount > 0 ? `، ${totalCount} قطعة` : ''}`}
      className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-brand-600 transition-colors hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2.5 2.5h2.2l2.1 12.2a1.6 1.6 0 0 0 1.6 1.3h8.8a1.6 1.6 0 0 0 1.6-1.3l1.4-7.7H6" />
      </svg>
      {totalCount > 0 ? (
        <span className="absolute -top-0.5 -end-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-xs font-bold text-white">
          {totalCount}
        </span>
      ) : null}
    </Link>
  )
}

function Header() {
  const storeName = import.meta.env.VITE_STORE_NAME
  const { totalCount } = useCart()
  const location = useLocation()
  const [menuState, setMenuState] = useState({ locationKey: '', open: false })
  const menuOpen =
    menuState.locationKey === location.key && menuState.open
  const setMenuOpen = (open) =>
    setMenuState({ locationKey: location.key, open })

  const navLinks = (
    <>
      {navigation.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setMenuOpen(false)}
          className="inline-flex min-h-[44px] items-center rounded-lg px-3 font-semibold text-neutral-600 transition-colors hover:bg-brand-50 hover:text-brand-600"
        >
          {label}
        </Link>
      ))}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white shadow-sm">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-16 items-center justify-between gap-2 py-2 md:gap-4 lg:min-h-[76px]">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              to="/"
              aria-label={`${storeName} - الرئيسية`}
              className="flex min-w-0 shrink items-center gap-2 text-brand-600"
            >
              <svg
                viewBox="0 0 40 40"
                fill="none"
                className="h-9 w-9 shrink-0"
                aria-hidden="true"
              >
                <rect width="40" height="40" rx="12" fill="currentColor" />
                <path
                  d="M18 9h4v8h8v4h-8v8h-4v-8h-8v-4h8V9Z"
                  fill="white"
                />
              </svg>
              <span className="truncate text-base font-extrabold text-neutral-900 sm:text-lg">
                {storeName}
              </span>
            </Link>
          </div>

          <nav
            aria-label="التنقل الرئيسي"
            className="hidden items-center gap-1 lg:flex"
          >
            {navLinks}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-brand-600 transition-colors hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 md:hidden"
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <CartLink totalCount={totalCount} />
          </div>
        </div>

        <nav
          aria-label="التنقل الرئيسي"
          className="hidden border-t border-neutral-100 py-2 md:flex md:items-center md:gap-1 lg:hidden"
        >
          {navLinks}
        </nav>

        {menuOpen ? (
          <nav
            id="mobile-navigation"
            aria-label="التنقل الرئيسي"
            className="flex flex-col border-t border-neutral-100 py-2 md:hidden"
          >
            {navLinks}
          </nav>
        ) : null}
      </div>
    </header>
  )
}

export default Header

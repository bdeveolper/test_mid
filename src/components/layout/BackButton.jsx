import { Link, useNavigate } from 'react-router-dom'

function BackButton({ className: classNameOverride = '' }) {
  const navigate = useNavigate()
  const canGoBack = window.history.state?.idx > 0
  const className =
    `inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-brand-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${classNameOverride}`

  if (!canGoBack) {
    return (
      <Link
        to="/"
        aria-label="العودة للرئيسية"
        title="العودة للرئيسية"
        className={className}
      >
        <BackIcon />
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="رجوع"
      title="رجوع"
      className={className}
    >
      <BackIcon />
    </button>
  )
}

function BackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export default BackButton

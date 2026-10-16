import { Link } from 'react-router-dom'
import BackButton from '../components/layout/BackButton'

function NotFound() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-brand-50 p-8 text-center">
      <div className="mb-4 self-start">
        <BackButton />
      </div>
      <p className="text-4xl font-bold text-brand-600">404</p>
      <h1 className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">
        الصفحة غير موجودة
      </h1>
      <p className="mt-3 max-w-md text-neutral-600">
        عذراً، الصفحة التي تبحث عنها غير متوفرة.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-600 px-6 font-bold text-white transition-colors hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
      >
        العودة إلى الرئيسية
      </Link>
    </section>
  )
}

export default NotFound

import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import FilterBar from '../components/product/FilterBar'
import ProductGrid from '../components/product/ProductGrid'
import siteContent from '../data/siteContent'
import { getProducts } from '../services/productService'

function Home() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [result, setResult] = useState(null)
  const [searchDraft, setSearchDraft] = useState(null)
  const [viewportWidth, setViewportWidth] = useState(
    () => document.documentElement.clientWidth,
  )

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const searchValue = searchDraft?.search === search ? searchDraft.value : search
  const requestKey = `${category}|${search}`

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(document.documentElement.clientWidth)
    }

    const observer = new ResizeObserver(updateViewportWidth)
    observer.observe(document.documentElement)
    updateViewportWidth()
    window.addEventListener('resize', updateViewportWidth)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateViewportWidth)
    }
  }, [])

  useEffect(() => {
    let active = true

    getProducts({ category, search }).then((data) => {
      if (active) {
        setResult({ key: requestKey, products: data })
      }
    })

    return () => {
      active = false
    }
  }, [category, search, requestKey])

  useEffect(() => {
    if (location.pathname === '/') {
      const frame = window.requestAnimationFrame(() => {
        if (location.hash === '#products') {
          document
            .getElementById('products')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      })

      return () => window.cancelAnimationFrame(frame)
    }

    return undefined
  }, [location.pathname, location.hash])

  const loading = result?.key !== requestKey
  const products = result?.products ?? []

  const handleFilterChange = (next) => {
    const params = {}
    if (next.category) params.category = next.category
    if (search) params.search = search
    setSearchParams(params)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const value = searchValue.trim()
    const params = {}
    if (category) params.category = category
    if (value) params.search = value
    setSearchParams(params)
  }

  return (
    <div className="flex flex-col gap-6">
      <section
        className="relative right-1/2 w-full translate-x-1/2"
        style={{ width: `${viewportWidth}px` }}
      >
        <div className="relative isolate mx-auto flex min-h-[580px] w-full max-w-[1600px] items-end overflow-hidden px-4 py-6 sm:min-h-[620px] sm:px-6 lg:min-h-[560px] lg:items-center lg:px-10">
          <img
            src={siteContent.heroImage}
            alt={siteContent.heroImageAlt}
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[40%_center] lg:object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-900/35 via-transparent to-white/10 lg:bg-gradient-to-l lg:from-white/20 lg:via-white/5 lg:to-transparent" />
          <div className="w-full rounded-3xl border border-white/60 bg-white/55 p-5 text-right shadow-2xl shadow-neutral-900/10 backdrop-blur-sm sm:p-8 lg:me-auto lg:max-w-[560px] lg:p-10">
            <p className="mb-4 inline-flex min-h-9 items-center rounded-full border border-brand-600/15 bg-brand-50/90 px-4 text-sm font-bold text-brand-600">
              راحتك تبدأ من اختيارك
            </p>
            <h1 className="text-right text-3xl font-extrabold leading-[1.35] text-neutral-900 sm:text-4xl lg:text-5xl">
              {siteContent.heroHeadline}
            </h1>
            <p className="mt-4 text-right text-base leading-8 text-neutral-600 sm:text-lg">
              {siteContent.heroSubtitle}
            </p>
            <a
              href="#products"
              onClick={(event) => {
                event.preventDefault()
                document
                  .getElementById('products')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="mt-6 inline-flex min-h-[52px] items-center justify-center gap-3 rounded-xl bg-brand-600 px-7 font-bold text-white shadow-lg shadow-brand-600/25 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              تسوق الآن
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section
        aria-label="البحث والتصفية عن المنتجات"
        className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-brand-50/70 p-4 sm:p-5"
      >
        <form
          role="search"
          onSubmit={handleSearch}
          className="mx-auto flex w-full max-w-3xl gap-2"
        >
          <label className="sr-only" htmlFor="product-search">
            ابحث عن منتج
          </label>
          <div className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-neutral-100 bg-white px-3 shadow-sm transition focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/15">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 shrink-0 text-neutral-600"
              aria-hidden="true"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
            <input
              id="product-search"
              type="search"
              value={searchValue}
              onChange={(event) =>
                setSearchDraft({ search, value: event.target.value })
              }
              placeholder="ابحث عن منتج..."
              className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-600"
            />
          </div>
          <button
            type="submit"
            className="min-h-12 shrink-0 rounded-xl bg-brand-600 px-5 font-bold text-white transition-colors hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            بحث
          </button>
        </form>
        <FilterBar
          filters={{ category }}
          onChange={handleFilterChange}
        />
      </section>

      <div>
        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
          منتجاتنا
        </h2>
        <p className="mt-1 text-neutral-600">
          تصفح الملابس الطبية والمستلزمات، واختر المقاس واللون المناسبين من بطاقة المنتج.
        </p>
      </div>

      <section id="products" className="flex scroll-mt-40 flex-col gap-6">
        <div className="[&>div]:grid-cols-2 [&>div]:gap-4 [&>div]:md:grid-cols-3 [&>div]:lg:grid-cols-4 [&>div]:lg:gap-6 [&>div]:xl:grid-cols-5">
          <ProductGrid products={products} loading={loading} />
        </div>
      </section>
    </div>
  )
}

export default Home

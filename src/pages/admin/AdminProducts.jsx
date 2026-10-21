import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ProductFilters from '../../components/admin/ProductFilters'
import { useAuth } from '../../context/AuthContext'
import { getCategoryLabel } from '../../lib/categories'
import { deleteProduct, getAdminProducts } from '../../services/productService'

function AdminProducts() {
  const { adminHomePath } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage] = useState(location.state?.message ?? '')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return products.filter(
      (product) =>
        (!query || product.name.toLocaleLowerCase().includes(query)) &&
        (!category || product.category === category),
    )
  }, [products, search, category])

  const loadProducts = useCallback(async () => {
    try {
      setProducts(await getAdminProducts())
      setError('')
    } catch (loadError) {
      console.error('تعذّر تحميل المنتجات', loadError)
      setError('تعذّر تحميل المنتجات، يرجى المحاولة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    let active = true
    getAdminProducts()
      .then((items) => {
        if (active) setProducts(items)
      })
      .catch((loadError) => {
        console.error('تعذّر تحميل المنتجات', loadError)
        if (active) setError('تعذّر تحميل المنتجات، يرجى المحاولة مرة أخرى.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [loadProducts])
  const handleDelete = async (product) => {
    if (!window.confirm(`هل أنت متأكد من حذف "${product.name}"؟`)) return
    setError('')
    try {
      const deleted = await deleteProduct(product.id)
      if (!deleted) {
        setError('لم يتم العثور على المنتج المطلوب حذفه.')
        return
      }
      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      )
    } catch (deleteError) {
      console.error('تعذّر حذف المنتج', deleteError)
      setError('تعذّر حذف المنتج، يرجى المحاولة مرة أخرى.')
    }
  }
  const stockTotal = (product) => (product.variants ?? []).reduce((sum, variant) => sum + variant.stock, 0)
  if (loading) return <p className="py-12 text-center text-neutral-600">جارٍ تحميل المنتجات...</p>

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-neutral-900">إدارة المنتجات</h1>
        <Link
          to={`${adminHomePath}/products/new`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-600 px-4 font-bold text-white hover:bg-opacity-90"
        >
          إضافة منتج
        </Link>
      </div>
      {error ? (
        <div className="flex flex-wrap items-center gap-3">
          <p role="alert" className="font-semibold text-danger-600">{error}</p>
          <button type="button" onClick={() => { setLoading(true); loadProducts() }} className="min-h-[44px] font-semibold text-brand-600 hover:underline">
            إعادة المحاولة
          </button>
        </div>
      ) : null}
      {successMessage ? (
        <p role="status" className="font-semibold text-success-600">
          {successMessage}
        </p>
      ) : null}
      <ProductFilters
        search={search}
        category={category}
        resultCount={filteredProducts.length}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />
      {products.length === 0 ? (
        <p className="rounded-2xl border border-neutral-100 bg-white p-6 text-center">
          لا توجد منتجات حالياً.
        </p>
      ) : filteredProducts.length === 0 ? (
        <p className="rounded-2xl border border-neutral-100 bg-white p-6 text-center">
          لا توجد منتجات مطابقة للبحث
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-neutral-100 bg-white lg:block">
            <table className="w-full text-start">
              <thead className="bg-neutral-100 text-sm font-bold text-neutral-900">
                <tr>{['المنتج', 'التصنيف', 'السعر', 'المخزون', 'الحالة', 'الإجراءات'].map((heading) => <th key={heading} className="p-4">{heading}</th>)}</tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-neutral-100">
                    <td className="p-4 font-bold text-neutral-900">{product.name}</td>
                    <td className="p-4">{getCategoryLabel(product.category)}</td><td className="p-4">{product.price} ج.م</td>
                    <td className="p-4">{stockTotal(product)}</td><td className="p-4">{product.isActive ? 'نشط' : 'غير نشط'}</td>
                    <td className="p-4"><ProductActions product={product} onDelete={handleDelete} adminHomePath={adminHomePath} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 lg:hidden">
            {filteredProducts.map((product) => (
              <article key={product.id} className="rounded-2xl border border-neutral-100 bg-white p-4">
                <h2 className="font-bold text-neutral-900">{product.name}</h2>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div><dt className="text-neutral-600">التصنيف</dt><dd>{getCategoryLabel(product.category)}</dd></div><div><dt className="text-neutral-600">السعر</dt><dd>{product.price} ج.م</dd></div>
                  <div><dt className="text-neutral-600">المخزون</dt><dd>{stockTotal(product)}</dd></div><div><dt className="text-neutral-600">الحالة</dt><dd>{product.isActive ? 'نشط' : 'غير نشط'}</dd></div>
                </dl>
                <div className="mt-4"><ProductActions product={product} onDelete={handleDelete} adminHomePath={adminHomePath} /></div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function ProductActions({ product, onDelete, adminHomePath }) {
  return <div className="flex flex-wrap gap-3"><Link to={`${adminHomePath}/products/${product.id}`} className="inline-flex min-h-[44px] items-center font-semibold text-brand-600 hover:underline">تعديل</Link><button type="button" onClick={() => onDelete(product)} className="min-h-[44px] font-semibold text-danger-600 hover:underline">حذف</button></div>
}

export default AdminProducts

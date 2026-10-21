import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../../components/admin/ProductForm'
import { useAuth } from '../../context/AuthContext'
import { getProductById } from '../../services/productService'

function EditProduct() {
  const { id } = useParams()
  const { adminHomePath } = useAuth()
  const navigate = useNavigate()
  const [state, setState] = useState({ id: '', product: null, loading: true, error: '' })

  useEffect(() => {
    let active = true
    getProductById(id)
      .then((product) => {
        if (active) setState({ id, product, loading: false, error: '' })
      })
      .catch((error) => {
        console.error('تعذّر تحميل المنتج للتعديل', error)
        if (active) {
          setState({
            id,
            product: null,
            loading: false,
            error: 'تعذّر تحميل المنتج، يرجى المحاولة مرة أخرى.',
          })
        }
      })
    return () => {
      active = false
    }
  }, [id])

  if (state.id !== id || state.loading) {
    return <p className="py-12 text-center text-neutral-600">جارٍ تحميل المنتج...</p>
  }

  if (state.error || !state.product) {
    return (
      <section className="flex flex-col items-center gap-4 py-12 text-center">
        <p role={state.error ? 'alert' : undefined} className="font-semibold text-danger-600">
          {state.error || 'المنتج غير موجود.'}
        </p>
        <Link to={adminHomePath} className="font-semibold text-brand-600 hover:underline">
          العودة للمنتجات
        </Link>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-neutral-900">تعديل المنتج</h1>
        <Link to={adminHomePath} className="font-semibold text-brand-600 hover:underline">
          العودة للمنتجات
        </Link>
      </div>
      <ProductForm
        key={state.product.id}
        product={state.product}
        submitLabel="حفظ التعديلات"
        onSuccess={() =>
          navigate(adminHomePath, {
            state: { message: 'تم حفظ المنتج بنجاح' },
          })
        }
      />
    </section>
  )
}

export default EditProduct

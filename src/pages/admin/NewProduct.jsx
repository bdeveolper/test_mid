import { Link, useNavigate } from 'react-router-dom'
import ProductForm from '../../components/admin/ProductForm'
import { useAuth } from '../../context/AuthContext'

function NewProduct() {
  const { adminHomePath } = useAuth()
  const navigate = useNavigate()

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-neutral-900">إضافة منتج جديد</h1>
        <Link to={adminHomePath} className="font-semibold text-brand-600 hover:underline">
          العودة للمنتجات
        </Link>
      </div>
      <ProductForm
        submitLabel="حفظ المنتج"
        onSuccess={() =>
          navigate(adminHomePath, {
            state: { message: 'تم حفظ المنتج بنجاح' },
          })
        }
      />
    </section>
  )
}

export default NewProduct

import { Link } from 'react-router-dom'
import ProductForm from '../../components/admin/ProductForm'

function NewProduct() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-neutral-900">إضافة منتج جديد</h1>
        <Link to="/admin" className="font-semibold text-brand-600 hover:underline">
          العودة للمنتجات
        </Link>
      </div>
      <ProductForm submitLabel="حفظ المنتج" />
    </section>
  )
}

export default NewProduct

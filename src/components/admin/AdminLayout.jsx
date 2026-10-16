import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'المنتجات', end: true },
  { to: '/admin/products/new', label: 'إضافة منتج' },
]

function AdminLayout() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b border-neutral-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-lg font-bold text-neutral-900">إدارة المتجر</div>
          <nav aria-label="التنقل الإداري" className="flex flex-wrap gap-2">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `inline-flex min-h-[44px] items-center rounded-xl px-4 font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'text-neutral-600 hover:bg-brand-50 hover:text-brand-600'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout

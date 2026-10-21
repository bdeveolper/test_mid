import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AdminLayout() {
  const { signOut, adminLoginPath, adminHomePath } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const links = [
    { to: adminHomePath, label: 'المنتجات', end: true },
    { to: `${adminHomePath}/products/new`, label: 'إضافة منتج' },
    { to: `${adminHomePath}/orders`, label: 'الطلبات' },
  ]

  const handleSignOut = async () => {
    setError('')
    try {
      await signOut()
      navigate(adminLoginPath, { replace: true })
    } catch (signOutError) {
      setError(signOutError.message)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b border-neutral-100 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-nowrap items-center justify-between gap-3">
            <div className="min-w-0 truncate text-lg font-bold text-neutral-900">إدارة المتجر</div>
            <button
              type="button"
              onClick={handleSignOut}
              className="min-h-[44px] shrink-0 rounded-xl border border-neutral-100 px-4 font-semibold text-danger-600 hover:bg-neutral-100"
            >
              تسجيل الخروج
            </button>
          </div>
          <div className="flex min-w-0 items-center">
            <nav
              aria-label="التنقل الإداري"
              className="flex flex-row items-center gap-2 overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              {links.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `inline-flex min-h-[44px] shrink-0 whitespace-nowrap items-center rounded-xl px-3 font-semibold transition-colors md:px-4 ${
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
          {error ? <p role="alert" className="text-sm text-danger-600">{error}</p> : null}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout

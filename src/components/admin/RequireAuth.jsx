import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function RequireAuth({ children }) {
  const { session, loading, adminLoginPath } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <p role="status" className="py-12 text-center text-neutral-600">
        جارٍ التحقق من تسجيل الدخول...
      </p>
    )
  }

  if (!session) {
    return <Navigate to={adminLoginPath} replace state={{ from: location }} />
  }

  return children
}

export default RequireAuth

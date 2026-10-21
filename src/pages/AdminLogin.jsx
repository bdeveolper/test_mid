import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/layout/BackButton'

function AdminLogin() {
  const { signIn, resetPassword, adminHomePath } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const emailRef = useRef(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      navigate(location.state?.from?.pathname || adminHomePath, { replace: true })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handlePasswordReset = async () => {
    setStatus({ type: '', message: '' })
    if (!email.trim()) {
      setStatus({
        type: 'error',
        message: 'أدخلي البريد الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.',
      })
      emailRef.current?.focus()
      return
    }

    setSubmitting(true)
    try {
      await resetPassword(email.trim())
      setStatus({
        type: 'success',
        message: 'إذا كان البريد مسجلاً، فسيصلك رابط إعادة تعيين كلمة المرور.',
      })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center gap-6 px-4 py-10">
      <BackButton />
      <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-8">
        <h1 className="text-2xl font-extrabold text-neutral-900">دخول إدارة المتجر</h1>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 font-semibold text-neutral-900">
            البريد الإلكتروني
            <input
              ref={emailRef}
              type="email"
              name="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-12 rounded-xl border border-neutral-100 px-3 font-normal"
            />
          </label>
          <label className="flex flex-col gap-2 font-semibold text-neutral-900">
            كلمة المرور
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-12 rounded-xl border border-neutral-100 px-3 font-normal"
            />
          </label>
          {status.message ? (
            <p
              role={status.type === 'error' ? 'alert' : 'status'}
              className={`text-sm leading-6 ${status.type === 'error' ? 'text-danger-600' : 'text-success-600'}`}
            >
              {status.message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="min-h-12 rounded-xl bg-brand-600 px-5 font-bold text-white hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? 'جارٍ المعالجة...' : 'تسجيل الدخول'}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handlePasswordReset}
            className="min-h-11 self-center px-3 font-semibold text-brand-600 hover:underline disabled:opacity-60"
          >
            نسيت كلمة المرور
          </button>
        </form>
      </section>
    </main>
  )
}

export default AdminLogin

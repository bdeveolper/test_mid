import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const configuredAdminPath = import.meta.env.VITE_ADMIN_PATH?.trim().replace(/^\/+|\/+$/g, '')

const adminBasePath = configuredAdminPath || null
const adminLoginPath = adminBasePath ? `/${adminBasePath}/login` : null
const adminHomePath = adminBasePath ? `/${adminBasePath}` : null

if (!configuredAdminPath && import.meta.env.DEV) {
  console.warn('VITE_ADMIN_PATH is missing; admin routes are disabled.')
}

function getArabicAuthError(error) {
  const message = String(error?.message ?? '').toLowerCase()
  const code = String(error?.code ?? '').toLowerCase()

  if (message.includes('invalid login credentials')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
  }
  if (message.includes('email not confirmed')) {
    return 'يرجى تأكيد البريد الإلكتروني قبل تسجيل الدخول.'
  }
  if (message.includes('user not found')) {
    return 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني.'
  }
  if (message.includes('rate limit') || code.includes('rate_limit')) {
    return 'تم إجراء محاولات كثيرة. يرجى الانتظار ثم المحاولة مرة أخرى.'
  }
  if (message.includes('password should be at least') || code.includes('weak_password')) {
    return 'كلمة المرور لا تستوفي متطلبات الأمان.'
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'تعذّر الاتصال بالخدمة. تحققي من الإنترنت وحاولي مرة أخرى.'
  }
  return 'تعذّرت عملية تسجيل الدخول. تحققي من البيانات وحاولي مرة أخرى.'
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (active) {
          setSession(nextSession)
          setLoading(false)
        }
      },
    )

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) {
        console.error('تعذّر التحقق من جلسة المدير', {
          message: error.message,
          code: error.code,
        })
        setSession(null)
      } else {
        setSession(data.session)
      }
      setLoading(false)
    }).catch((error) => {
      if (!active) return
      console.error('تعذّر التحقق من جلسة المدير', {
        message: error?.message,
        code: error?.code,
      })
      setSession(null)
      setLoading(false)
    })

    return () => {
      active = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(getArabicAuthError(error), { cause: error })
    setSession(data.session)
    return data.session
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(getArabicAuthError(error), { cause: error })
    setSession(null)
  }, [])

  const resetPassword = useCallback(async (email) => {
    if (!adminLoginPath) {
      throw new Error('مسار دخول المدير غير مضبوط في إعدادات الموقع.')
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${adminLoginPath}`,
    })
    if (error) throw new Error(getArabicAuthError(error), { cause: error })
  }, [])

  const value = useMemo(
    () => ({
      session,
      loading,
      signIn,
      signOut,
      resetPassword,
      adminBasePath,
      adminLoginPath,
      adminHomePath,
    }),
    [session, loading, signIn, signOut, resetPassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

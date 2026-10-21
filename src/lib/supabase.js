import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'إعداد Supabase غير مكتمل. أضف VITE_SUPABASE_URL وVITE_SUPABASE_ANON_KEY إلى ملف البيئة.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../utils/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session ? mapUser(session.user) : null)
      setLoading(false)
    }).catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? mapUser(session.user) : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const register = useCallback(async ({ name, email, password }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { name: name.trim() } },
      })
      if (error) return { ok: false, error: error.message }
      if (!data.user) return { ok: false, error: 'Pendaftaran gagal, coba lagi.' }
      return { ok: true, user: mapUser(data.user) }
    } catch (e) {
      return { ok: false, error: e.message || 'Terjadi kesalahan, coba lagi.' }
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) return { ok: false, error: 'Email atau password salah.' }
      return { ok: true, user: mapUser(data.user) }
    } catch (e) {
      return { ok: false, error: e.message || 'Terjadi kesalahan, coba lagi.' }
    }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

function mapUser(u) {
  if (!u) return null
  return {
    id:    u.id,
    email: u.email,
    name:  u.user_metadata?.name || u.email.split('@')[0],
  }
}

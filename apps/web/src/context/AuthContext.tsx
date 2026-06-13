import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AuthUser {
  email: string
  name: string
  role: 'admin'
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.ok ? r.json() : null)
      .then(session => {
        if (session?.user) {
          setUser({ email: session.user.email, name: session.user.name, role: 'admin' })
        }
      })
      .finally(() => setLoaded(true))
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await fetch('/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) return false
    const session = await res.json()
    setUser({ email: session.user.email, name: session.user.name, role: 'admin' })
    return true
  }

  const logout = async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    setUser(null)
  }

  if (!loaded) {
    return <div className="flex min-h-screen items-center justify-center text-brown-500">Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

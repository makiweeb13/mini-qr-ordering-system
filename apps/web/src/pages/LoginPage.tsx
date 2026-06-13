import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const success = login(username, password)
    if (success) {
      navigate('/admin', { replace: true })
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand to-brand-dark px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur-sm"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-2xl font-extrabold text-white shadow-lg">
            S
          </div>
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#D4380D' }}
          >
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-brown-500">Sign in to manage orders</p>
        </div>

        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-semibold text-brown-900">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full rounded-xl border border-brown-100 bg-white px-4 py-2.5 text-sm text-brown-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            placeholder="Enter username"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-semibold text-brown-900">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-xl border border-brown-100 bg-white px-4 py-2.5 text-sm text-brown-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            placeholder="Enter password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-brand py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-dark active:scale-[0.98]"
        >
          Sign In
        </button>

        <p className="mt-4 text-center text-xs text-brown-500">
          Demo: admin / admin123
        </p>
      </form>
    </div>
  )
}

import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BRAND_NAME } from '../config/brand'

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? 'text-white shadow-sm'
        : 'text-brown-500 hover:bg-brown-100 hover:text-brown-900'
    }`

  return (
    <div className="flex min-h-screen flex-col md:flex-row" style={{ fontFamily: 'Inter, sans-serif' }}>
      <aside className="flex w-full flex-col gap-1 border-b border-brown-100 bg-white p-4 md:w-64 md:border-b-0 md:border-r">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
            S
          </div>
          <div>
            <h1
              className="text-base font-bold tracking-tight"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--color-brand)' }}
            >
              {BRAND_NAME}
            </h1>
            <p className="text-xs text-brown-500">{user?.name}</p>
          </div>
        </div>

        <NavLink
          to="/admin"
          end
          className={linkClass}
          style={({ isActive }) => ({
            backgroundColor: isActive ? 'var(--color-brand)' : undefined,
          })}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={linkClass}
          style={({ isActive }) => ({
            backgroundColor: isActive ? 'var(--color-brand)' : undefined,
          })}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Orders
        </NavLink>
        <NavLink
          to="/menu-qr"
          className={linkClass}
          style={({ isActive }) => ({
            backgroundColor: isActive ? 'var(--color-brand)' : undefined,
          })}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          QR Code
        </NavLink>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </aside>
      <main className="flex-1 overflow-auto bg-cream p-6">
        <Outlet />
      </main>
    </div>
  )
}

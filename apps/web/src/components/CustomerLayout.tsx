import { Outlet, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CustomerLayout() {
  const { items } = useCart()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="min-h-screen bg-cream" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="sticky top-0 z-10 border-b border-brown-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#D4380D' }}
          >
            Restaurant<span className="text-accent">Menu</span>
          </Link>
          <div className="relative">
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="absolute -right-2 -top-2 flex h-5 w-5 animate-bounce-in items-center justify-center rounded-full text-xs text-white"
                style={{ backgroundColor: '#D4380D' }}
              >
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

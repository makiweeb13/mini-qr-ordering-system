import { useState } from 'react'
import { useCart } from '../context/CartContext'

const MOCK_MENU = [
  { id: '1', name: 'Chicken Adobo', price: 89, category: 'Rice Meals' },
  { id: '2', name: 'Pork Sinigang', price: 99, category: 'Rice Meals' },
  { id: '3', name: 'Beef Tapa', price: 109, category: 'Rice Meals' },
  { id: '4', name: 'Sisig', price: 95, category: 'Rice Meals' },
  { id: '5', name: 'Lechon Kawali', price: 115, category: 'Rice Meals' },
  { id: '6', name: 'Java Rice', price: 25, category: 'Sides' },
  { id: '7', name: 'Fried Lumpia', price: 35, category: 'Sides' },
  { id: '8', name: 'Atchara', price: 15, category: 'Sides' },
  { id: '9', name: 'Iced Tea', price: 35, category: 'Drinks' },
  { id: '10', name: 'Buko Juice', price: 45, category: 'Drinks' },
  { id: '11', name: "Sago't Gulaman", price: 35, category: 'Drinks' },
]

const categories = [...new Set(MOCK_MENU.map(item => item.category))]

export default function MenuPage() {
  const { items, addItem, updateQuantity, removeItem, totalAmount } = useCart()
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="flex flex-col gap-8 lg:flex-row" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex-1">

      {categories.map(category => (
          <section key={category} className="mb-8">
            <h2
              className="mb-4 text-lg font-bold text-brown-900"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {MOCK_MENU.filter(item => item.category === category).map((item, i) => {
                const cartItem = items.find(c => c.id === item.id)
                return (
                  <div
                    key={item.id}
                    className="animate-fade-in-up group flex flex-col overflow-hidden rounded-2xl border border-brown-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                    style={{ animationDelay: (i * 80) + 'ms' }}
                  >
                    <div className="h-1.5 shrink-0 bg-gradient-to-r from-brand to-accent" />
                    <div className="flex flex-1 flex-col p-4">
                      <h3
                        className="text-base font-bold text-brown-900"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                      >
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-brand">₱{item.price}
                      </p>
                      <div className="mt-auto pt-4">
                        {cartItem ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-brown-100 bg-white text-brown-900 transition hover:bg-brown-100 active:scale-95"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{cartItem.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-dark active:scale-95"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto text-xs font-medium text-red-400 transition hover:text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              addItem({ id: item.id, name: item.name, price: item.price })
                            }
                            className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-[0.97]"
                          >
                            + Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <aside className="lg:w-80">
        <div className="hidden lg:block">
          <CartSidebar
            items={items}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            totalAmount={totalAmount}
          />
        </div>

        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 right-5 z-20 flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-dark active:scale-95 lg:hidden"
        >
          Cart ({items.reduce((s, i) => s + i.quantity, 0)})
        </button>

        {cartOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              onClick={() => setCartOpen(false)}
            />
            <div className="fixed bottom-0 left-0 right-0 z-40 max-h-[70vh] overflow-y-auto rounded-t-3xl bg-white px-6 pb-8 pt-6 shadow-2xl lg:hidden">
              <div className="mb-4 flex items-center justify-between">
                <h2
                  className="text-lg font-bold text-brown-900"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Your Cart
                </h2>
                <button onClick={() => setCartOpen(false)} className="text-brown-500">
                  X
                </button>
              </div>
              <CartSidebar
                items={items}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                totalAmount={totalAmount}
              />
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

function CartSidebar({
  items,
  updateQuantity,
  removeItem,
  totalAmount,
}: {
  items: { id: string; name: string; price: number; quantity: number }[]
  updateQuantity: (id: string, qty: number) => void
  removeItem: (id: string) => void
  totalAmount: number
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-brown-100 bg-white p-8 text-center">
        <p className="text-3xl">🛒</p>
        <p className="mt-2 text-sm text-brown-500">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-brown-100 bg-white p-4 shadow-sm">
      <h2
        className="mb-4 text-lg font-bold text-brown-900"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Your Cart
      </h2>
      <ul className="divide-y divide-brown-100">
        {items.map(item => (
          <li key={item.id} className="flex items-center gap-3 py-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-brown-900">{item.name}</p>
              <p className="text-xs text-brown-500">
                ₱{item.price} each
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-brown-100 text-brown-900 transition hover:bg-brown-100"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-dark"
              >
                +
              </button>
            </div>
            <p className="w-16 text-right text-sm font-semibold text-brand">
              ₱{(item.price * item.quantity)}
            </p>
            <button
              onClick={() => removeItem(item.id)}
              className="text-xs text-red-400 hover:text-red-600 transition"
            >
              X
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-brown-100 pt-4">
        <div className="flex justify-between text-lg font-bold text-brown-900">
          <span>Total</span>
          <span>₱{totalAmount}</span>
        </div>
      </div>
    </div>
  )
}

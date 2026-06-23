import { useState, useEffect } from 'react'
import React from 'react'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: string
  items: OrderItem[]
  total: number
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  createdAt: string
}

const paymentColors: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(setOrders)
  }, [])

  const updatePayment = async (orderId: string, paymentStatus: Order['paymentStatus']) => {
    const id = orderId.replace('ORD-', '')
    await fetch(`/api/orders/${id}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus }),
    })
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, paymentStatus } : o))
    )
  }

  return (
    <div>
      <h1
        className="mb-6 text-2xl font-extrabold text-brown-900"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Orders
      </h1>

      <div className="hidden md:block overflow-x-auto rounded-2xl border border-brown-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brown-100 bg-cream">
              <th className="px-4 py-3.5 font-semibold text-brown-500">Order</th>
              <th className="px-4 py-3.5 font-semibold text-brown-500">Customer</th>
              <th className="px-4 py-3.5 font-semibold text-brown-500">Items</th>
              <th className="px-4 py-3.5 font-semibold text-brown-500">Total</th>
              <th className="px-4 py-3.5 font-semibold text-brown-500">Payment</th>
              <th className="px-4 py-3.5 font-semibold text-brown-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <React.Fragment key={order.id}>
                <tr
                  className={'border-b border-brown-100 transition hover:bg-cream ' + (idx % 2 === 1 ? 'bg-cream/50' : 'bg-white')}
                >
                  <td className="px-4 py-3.5 font-bold text-brown-900">{order.id}</td>
                  <td className="px-4 py-3.5 text-brown-500">{order.customer}</td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() =>
                        setExpanded(expanded === order.id ? null : order.id)
                      }
                      className="font-medium text-brand hover:underline"
                    >
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-brown-900">₱{order.total}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={'inline-block h-1.5 w-1.5 rounded-full ' + (order.paymentStatus === 'unpaid' ? 'bg-red-500' : order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-gray-500')} />
                      <select
                        value={order.paymentStatus}
                        onChange={e =>
                          updatePayment(
                            order.id,
                            e.target.value as Order['paymentStatus']
                          )
                        }
                        className={'rounded-lg border-0 px-2 py-1 text-xs font-semibold ' + paymentColors[order.paymentStatus]}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() =>
                        updatePayment(
                          order.id,
                          order.paymentStatus === 'paid' ? 'unpaid' : 'paid'
                        )
                      }
                      className="rounded-xl bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-95"
                    >
                      Toggle Payment
                    </button>
                  </td>
                </tr>
                {expanded === order.id && (
                  <tr>
                    <td colSpan={6} className="bg-cream px-4 py-3">
                      <div className="rounded-xl border border-brown-100 bg-white p-4 text-sm">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brown-500">Order Items</p>
                        {order.items.map(item => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-1.5"
                          >
                            <span className="text-brown-900">
                              {item.name} <span className="text-brown-500">x{item.quantity}</span>
                            </span>
                            <span className="font-semibold text-brown-900">
                              ₱{(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden space-y-3">
        {orders.map(order => (
          <div key={order.id} className="rounded-2xl border border-brown-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-bold text-brown-900">{order.id}</span>
                <span className="ml-2 text-sm text-brown-500">{order.customer}</span>
              </div>
              <span className="text-sm font-semibold text-brown-900">₱{order.total}</span>
            </div>

            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="text-sm font-medium text-brand hover:underline mb-2 block"
            >
              {order.items.length} item{order.items.length > 1 ? 's' : ''}
            </button>

            {expanded === order.id && (
              <div className="rounded-xl border border-brown-100 bg-cream p-3 text-sm mb-3">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-brown-500">Order Items</p>
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-1">
                    <span className="text-brown-900">
                      {item.name} <span className="text-brown-500">x{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-brown-900">₱{(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 border-t border-brown-100 pt-3">
              <span className={'inline-block h-1.5 w-1.5 rounded-full ' + (order.paymentStatus === 'unpaid' ? 'bg-red-500' : order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-gray-500')} />
              <select
                value={order.paymentStatus}
                onChange={e => updatePayment(order.id, e.target.value as Order['paymentStatus'])}
                className={'rounded-lg border-0 px-2 py-1 text-xs font-semibold ' + paymentColors[order.paymentStatus]}
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </select>
              <button
                onClick={() => updatePayment(order.id, order.paymentStatus === 'paid' ? 'unpaid' : 'paid')}
                className="rounded-xl bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-dark active:scale-95"
              >
                Toggle Payment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

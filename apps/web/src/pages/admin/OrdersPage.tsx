import { useState } from 'react'

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
  status: 'pending' | 'paid' | 'preparing' | 'completed'
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  createdAt: string
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Juan Dela Cruz',
    items: [
      { id: '1', name: 'Chicken Adobo', quantity: 2, price: 89 },
      { id: '9', name: 'Iced Tea', quantity: 1, price: 35 },
    ],
    total: 213,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: '2 min ago',
  },
  {
    id: 'ORD-002',
    customer: 'Maria Santos',
    items: [
      { id: '5', name: 'Lechon Kawali', quantity: 1, price: 115 },
      { id: '6', name: 'Java Rice', quantity: 2, price: 25 },
      { id: '10', name: 'Buko Juice', quantity: 1, price: 45 },
    ],
    total: 210,
    status: 'paid',
    paymentStatus: 'paid',
    createdAt: '15 min ago',
  },
  {
    id: 'ORD-003',
    customer: 'Pedro Reyes',
    items: [
      { id: '3', name: 'Beef Tapa', quantity: 1, price: 109 },
      { id: '7', name: 'Fried Lumpia', quantity: 1, price: 35 },
    ],
    total: 144,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '1 hour ago',
  },
]

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
}

const paymentColors: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const [expanded, setExpanded] = useState<string | null>(null)

  const updateStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    )
  }

  const updatePayment = (orderId: string, paymentStatus: Order['paymentStatus']) => {
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

      <div className="overflow-hidden rounded-2xl border border-brown-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brown-100 bg-cream">
              <th className="px-4 py-3.5 font-semibold text-brown-500">Order</th>
              <th className="px-4 py-3.5 font-semibold text-brown-500">Time</th>
              <th className="px-4 py-3.5 font-semibold text-brown-500">Items</th>
              <th className="px-4 py-3.5 font-semibold text-brown-500">Total</th>
              <th className="px-4 py-3.5 font-semibold text-brown-500">Status</th>
              <th className="px-4 py-3.5 font-semibold text-brown-500">Payment</th>
              <th className="px-4 py-3.5 font-semibold text-brown-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <>
                <tr
                  key={order.id}
                  className={'border-b border-brown-100 transition hover:bg-cream ' + (idx % 2 === 1 ? 'bg-cream/50' : 'bg-white')}
                >
                  <td className="px-4 py-3.5 font-bold text-brown-900">{order.id}</td>
                  <td className="px-4 py-3.5 text-brown-500">{order.createdAt}</td>
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
                    <span className="inline-flex items-center gap-1">
                      <span className={'inline-block h-1.5 w-1.5 rounded-full ' + (order.status === 'pending' ? 'bg-yellow-500' : order.status === 'paid' ? 'bg-blue-500' : order.status === 'preparing' ? 'bg-purple-500' : 'bg-green-500')} />
                      <select
                        value={order.status}
                        onChange={e =>
                          updateStatus(order.id, e.target.value as Order['status'])
                        }
                        className={'rounded-lg border-0 px-2 py-1 text-xs font-semibold ' + statusColors[order.status]}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="preparing">Preparing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </span>
                  </td>
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
                    <td colSpan={7} className="bg-cream px-4 py-3">
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
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

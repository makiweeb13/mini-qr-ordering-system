import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

const statTints: Record<string, string> = {
  'Total Orders': 'bg-blue-50 border-blue-200',
  Pending: 'bg-amber-50 border-amber-200',
  Completed: 'bg-green-50 border-green-200',
  'Revenue Today': 'bg-emerald-50 border-emerald-200',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [totals, setTotals] = useState({ total: 0, pending: 0, completed: 0, revenue: 0 })

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then((orders: Array<{ status: string; total: number }>) => {
        setTotals({
          total: orders.length,
          pending: orders.filter(o => o.status === 'pending' || o.status === 'paid' || o.status === 'preparing').length,
          completed: orders.filter(o => o.status === 'completed').length,
          revenue: orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0),
        })
      })
  }, [])

  const stats = [
    { label: 'Total Orders', value: String(totals.total) },
    { label: 'Pending', value: String(totals.pending) },
    { label: 'Completed', value: String(totals.completed) },
    { label: 'Revenue Today', value: `\u20B1${totals.revenue.toLocaleString()}` },
  ]

  return (
    <div>
      <h1
        className="mb-2 text-2xl font-extrabold text-brown-900"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        Dashboard
      </h1>
      <p className="mb-6 text-sm text-brown-500">
        Welcome back, {user?.name}
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className={'rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ' + (statTints[stat.label] || 'bg-white border-brown-100')}
          >
            <p className="mt-3 text-sm font-medium text-brown-500">{stat.label}</p>
            <p
              className="mt-1 text-2xl font-extrabold text-brown-900"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { QRCodeSVG } from 'qrcode.react'

const statTints: Record<string, string> = {
  'Total Orders': 'bg-blue-50 border-blue-200',
  Unpaid: 'bg-amber-50 border-amber-200',
  Paid: 'bg-green-50 border-green-200',
  'Revenue Today': 'bg-emerald-50 border-emerald-200',
}

const menuUrl = typeof window !== 'undefined' ? window.location.origin + '/' : ''

export default function DashboardPage() {
  const { user } = useAuth()
  const [totals, setTotals] = useState({ total: 0, unpaid: 0, paid: 0, revenue: 0 })

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then((orders: Array<{ paymentStatus: string; total: number; createdAt: string }>) => {
        const today = new Date()
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())

        setTotals({
          total: orders.length,
          unpaid: orders.filter(o => o.paymentStatus === 'unpaid').length,
          paid: orders.filter(o => o.paymentStatus === 'paid').length,
          revenue: orders
            .filter(o => o.paymentStatus === 'paid' && new Date(o.createdAt) >= todayStart)
            .reduce((s, o) => s + o.total, 0),
        })
      })
  }, [])

  const stats = [
    { label: 'Total Orders', value: String(totals.total) },
    { label: 'Unpaid', value: String(totals.unpaid) },
    { label: 'Paid', value: String(totals.paid) },
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

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-brown-100 bg-white p-5 shadow-sm">
        <div className="rounded-lg border border-brown-100 bg-white p-2">
          <QRCodeSVG value={menuUrl} size={80} level="M" />
        </div>
        <div>
          <p className="text-sm font-bold text-brown-900">Scan to Order</p>
          <p className="mt-0.5 text-xs text-brown-500">{menuUrl}</p>
        </div>
      </div>
    </div>
  )
}

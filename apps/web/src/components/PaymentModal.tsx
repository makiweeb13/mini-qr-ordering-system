import { useState } from 'react'

interface PaymentModalProps {
  orderId: string
  total: number
  onSuccess: () => void
  onClose: () => void
}

export default function PaymentModal({ orderId, total, onSuccess, onClose }: PaymentModalProps) {
  const [state, setState] = useState<'form' | 'processing' | 'success' | 'error'>('form')
  const [cvv, setCvv] = useState('')

  const handlePay = async () => {
    setState('processing')
    await new Promise(r => setTimeout(r, 1500))

    if (!cvv.trim()) {
      setState('error')
      return
    }

    const id = orderId.replace('ORD-', '')
    const res = await fetch(`/api/orders/${id}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus: 'paid' }),
    })

    if (res.ok) {
      setState('success')
    } else {
      setState('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {state === 'form' && (
          <>
            <h2 className="text-lg font-bold text-brown-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Complete Payment
            </h2>
            <p className="mt-1 text-sm text-brown-500">
              Order {orderId} &middot; Total <span className="font-semibold text-brown-900">₱{total}</span>
            </p>

            <div className="mt-5 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-brown-500">Card Number</label>
                <input
                  type="text"
                  value="**** **** **** 4242"
                  readOnly
                  className="w-full rounded-xl border border-brown-100 bg-cream px-4 py-2.5 text-sm text-brown-900"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-semibold text-brown-500">Expiry</label>
                  <input
                    type="text"
                    value="**/**"
                    readOnly
                    className="w-full rounded-xl border border-brown-100 bg-cream px-4 py-2.5 text-sm text-brown-900"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-semibold text-brown-500">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={e => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full rounded-xl border border-brown-100 bg-white px-4 py-2.5 text-sm text-brown-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handlePay}
              className="mt-5 w-full rounded-xl bg-brand py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark active:scale-[0.97]"
            >
              Pay ₱{total}
            </button>

            <p className="mt-3 text-center text-xs text-brown-400">
              * Demo: any card works. Leave CVV blank to simulate a failure.
            </p>
          </>
        )}

        {state === 'processing' && (
          <div className="flex flex-col items-center py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brown-100 border-t-brand" />
            <p className="mt-4 text-sm font-semibold text-brown-900">Processing payment...</p>
          </div>
        )}

        {state === 'success' && (
          <div className="flex flex-col items-center py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
              ✓
            </div>
            <p className="mt-4 text-lg font-bold text-brown-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Payment Successful!
            </p>
            <p className="mt-1 text-sm text-brown-500">{orderId}</p>
            <button
              onClick={onSuccess}
              className="mt-6 w-full rounded-xl bg-brand py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark active:scale-[0.97]"
            >
              Back to Menu
            </button>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-500">
              ✕
            </div>
            <p className="mt-4 text-lg font-bold text-brown-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Payment Failed
            </p>
            <p className="mt-1 text-center text-sm text-brown-500">
              Please check your card details and try again.
            </p>
            <button
              onClick={() => { setState('form'); setCvv('') }}
              className="mt-6 w-full rounded-xl bg-brand py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark active:scale-[0.97]"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-xl border border-brown-100 py-2.5 text-sm font-semibold text-brown-500 transition hover:bg-brown-50"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

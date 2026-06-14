import { QRCodeSVG } from 'qrcode.react'
import { BRAND_NAME, BRAND_DESCRIPTION } from '../config/brand'

const menuUrl = typeof window !== 'undefined' ? window.location.origin + '/' : ''

export default function QRPrintPage() {
  const handlePrint = () => window.print()

  return (
    <div className="print-page">
      <div className="print-content">
        <h1 className="brand-name">{BRAND_NAME}</h1>
        <p className="brand-desc">{BRAND_DESCRIPTION}</p>
        <div className="qr-wrapper">
          <QRCodeSVG value={menuUrl} size={220} level="M" />
        </div>
        <p className="menu-url">{menuUrl}</p>
      </div>
      <button className="print-btn" onClick={handlePrint}>
        Print QR Code
      </button>

      <style>{`
        .print-page {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #fff;
          font-family: 'Inter', sans-serif;
          padding: 2rem;
        }
        .print-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .brand-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #D4380D;
          margin: 0 0 0.25rem;
        }
        .brand-desc {
          font-size: 1rem;
          color: #8B6914;
          margin: 0 0 1.5rem;
        }
        .qr-wrapper {
          border: 2px solid #f0e6d3;
          border-radius: 1rem;
          padding: 0.75rem;
          background: #fff;
        }
        .menu-url {
          margin-top: 1rem;
          font-size: 0.75rem;
          color: #a09080;
        }
        .print-btn {
          margin-top: 2rem;
          padding: 0.75rem 2rem;
          border-radius: 0.75rem;
          border: none;
          background: #D4380D;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }
        .print-btn:hover {
          background: #b82e0a;
        }

        @media print {
          .print-btn { display: none; }
          .print-page {
            padding: 0;
            justify-content: center;
          }
          .brand-name { font-size: 3rem; }
          .menu-url { display: none; }
        }
      `}</style>
    </div>
  )
}

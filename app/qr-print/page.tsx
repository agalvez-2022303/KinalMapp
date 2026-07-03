'use client'

import { useEffect } from 'react'
import { TEST_CHECKPOINTS } from '@/lib/checkpoints-test'

const SECTION_COLORS: Record<string, string> = {
  'CP-BA': '#bc7b4e',
  'CP-INF': '#a6867a',
  'CP-MEC': '#584946',
  'CP-ELE': '#a16f4f',
  'CP-ELC': '#224076',
  'CP-DIB': '#c8923a',
  'CP-HIS': '#D4BA46',
}

function getColor(id: string): string {
  for (const [prefix, color] of Object.entries(SECTION_COLORS)) {
    if (id.startsWith(prefix)) return color
  }
  return '#2C3E73'
}

function qrImageUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(data)}`
}

export default function QRPrintPage() {
  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
  }, [])

  return (
    <main className="min-h-screen bg-white font-sans">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; background: white; }
          .no-print { display: none !important; }
          .qr-grid { gap: 12px !important; }
          .qr-card { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      {/* Header - no print */}
      <header className="no-print bg-[#2C3E73] text-white px-4 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#fee269] font-bold">
              KinalMapp · Expo 2026
            </p>
            <h1 className="font-bold text-lg">QRs de Prueba — Printable</h1>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#fee269] text-[#1a1400] px-4 py-2 rounded-xl font-bold text-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Imprimir / PDF
          </button>
        </div>
      </header>

      {/* Print title - only visible when printing */}
      <div className="hidden print:block text-center py-4 border-b-2 border-gray-200 mb-4">
        <h1 className="text-xl font-bold text-gray-800">KinalMapp — QRs de Prueba</h1>
        <p className="text-xs text-gray-500 mt-1">Expo Kinal 2026 — Escanea cada código para desbloquear estampas</p>
      </div>

      {/* QR Grid */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="qr-grid grid grid-cols-3 gap-4 print:grid-cols-3">
          {TEST_CHECKPOINTS.map((cp) => {
            const color = getColor(cp.id)
            return (
              <div
                key={cp.id}
                className="qr-card border-2 border-gray-200 rounded-xl overflow-hidden flex flex-col items-center p-3 bg-white"
              >
                <div
                  className="w-full text-center py-1.5 rounded-lg mb-2"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <p className="text-[8px] font-bold tracking-wider uppercase" style={{ color }}>
                    {cp.id}
                  </p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageUrl(cp.id)}
                  alt={`QR ${cp.id}`}
                  width={120}
                  height={120}
                  className="block"
                />
                <p className="text-[9px] font-bold text-gray-700 text-center mt-2 leading-tight">
                  {cp.label}
                </p>
              </div>
            )
          })}
        </div>

        <p className="no-print text-center text-xs text-gray-400 mt-6 pb-8">
          Tip: presiona Ctrl+P (o Cmd+P en Mac) y selecciona &quot;Guardar como PDF&quot; para descargar.
        </p>
      </div>
    </main>
  )
}

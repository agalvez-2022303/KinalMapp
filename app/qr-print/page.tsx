'use client'

import { useEffect, useState, useCallback } from 'react'
import { mapPOIs } from '@/lib/kinal-data'

const APP_URL = 'https://kinal-maa.vercel.app'

const SECTION_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  'CP-BA': { label: 'Básicos — CHIP', color: '#bc7b4e', emoji: '🐾' },
  'CP-INF': { label: 'Informática — KODY', color: '#a6867a', emoji: '🐾' },
  'CP-MEC': { label: 'Mecánica — KONG', color: '#584946', emoji: '🐾' },
  'CP-ELE': { label: 'Electrónica — Nova', color: '#a16f4f', emoji: '🐾' },
  'CP-ELC': { label: 'Electricidad — VOLT', color: '#224076', emoji: '🐾' },
  'CP-DIB': { label: 'Dibujo Técnico — NEO', color: '#c8923a', emoji: '🐾' },
  'CP-HIS': { label: 'Histórica — REXY', color: '#D4BA46', emoji: '🐾' },
}

function getSection(id: string) {
  for (const [prefix, cfg] of Object.entries(SECTION_CONFIG)) {
    if (id.startsWith(prefix)) return cfg
  }
  return { label: 'Otro', color: '#2C3E73', emoji: '📌' }
}

function qrUrl(data: string, size = 300) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=6&data=${encodeURIComponent(data)}`
}

async function downloadQR(id: string, label: string) {
  const url = qrUrl(id, 500)
  const res = await fetch(url)
  const blob = await res.blob()
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `QR-${id}-${label.replace(/\s+/g, '_')}.png`
  a.click()
  URL.revokeObjectURL(a.href)
}

async function downloadAll(checkpoints: { id: string; label: string }[]) {
  for (const cp of checkpoints) {
    await new Promise(r => setTimeout(r, 300))
    await downloadQR(cp.id, cp.label)
  }
}

export default function QRPrintPage() {
  const [checkpoints, setCheckpoints] = useState<{ id: string; label: string }[]>([])

  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    const cps = mapPOIs
      .filter(p => p.type === 'checkpoint' && p.checkpointId)
      .map(p => ({ id: p.checkpointId!, label: p.label }))
    setCheckpoints(cps)
  }, [])

  const grouped = checkpoints.reduce<Record<string, { id: string; label: string }[]>>((acc, cp) => {
    const prefix = cp.id.split('-').slice(0, 2).join('-')
    if (!acc[prefix]) acc[prefix] = []
    acc[prefix].push(cp)
    return acc
  }, {})

  const handleDownloadAll = useCallback(async () => {
    await downloadQR(APP_URL, 'KinalMapp_App')
    await new Promise(r => setTimeout(r, 300))
    for (const cp of checkpoints) {
      await new Promise(r => setTimeout(r, 300))
      await downloadQR(cp.id, cp.label)
    }
  }, [checkpoints])

  return (
    <main className="min-h-screen bg-[#f5f6fa] font-sans">
      <style>{`
        @media print {
          body { margin: 0 !important; padding: 0 !important; background: white !important; }
          .no-print { display: none !important; }
          .qr-card { break-inside: avoid; page-break-inside: avoid; }
          .section-group { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      {/* Header */}
      <header className="no-print bg-gradient-to-r from-[#1b2a4e] to-[#0f1830] text-white px-4 py-5 shadow-lg">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#fee269] font-bold">
              KinalMapp · Expo 2026
            </p>
            <h1 className="font-extrabold text-xl tracking-tight">
              QRs de Prueba
            </h1>
            <p className="text-[11px] text-gray-300 mt-1">
              Escanea cada código para desbloquear estampas del álbum
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-2 bg-[#fee269] text-[#1a1400] px-4 py-2.5 rounded-xl font-bold text-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Descargar todos
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white/10 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Imprimir
            </button>
          </div>
        </div>
      </header>

      {/* App QR */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="no-print bg-gradient-to-br from-[#1b2a4e] to-[#0f1830] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 border border-[#fee269]/20 shadow-lg">
          <div className="bg-white p-3 rounded-xl shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl(APP_URL, 160)} alt="QR KinalMapp" width={160} height={160} className="block" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <p className="text-[9px] font-extrabold tracking-widest text-[#fee269] uppercase mb-1">
              Acceso a la App
            </p>
            <h2 className="text-white font-extrabold text-lg mb-2">KinalMapp</h2>
            <p className="text-[11px] text-gray-300 leading-relaxed mb-3">
              Escanea este código para abrir la app en tu teléfono y explorar el campus, escanear checkpoints y coleccionar estampas.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <p className="text-[10px] font-mono text-[#fee269]/70 bg-white/5 px-3 py-1.5 rounded-lg">
                {APP_URL}
              </p>
              <button
                onClick={() => void downloadQR(APP_URL, 'KinalMapp_App')}
                className="no-print flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg bg-[#fee269]/15 text-[#fee269] border border-[#fee269]/30 hover:bg-[#fee269]/25 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                Descargar QR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Grid by section */}
      <div className="max-w-3xl mx-auto px-4 pb-12 space-y-6">
        {Object.entries(grouped).map(([prefix, cps]) => {
          const section = getSection(prefix)
          return (
            <div key={prefix} className="section-group">
              {/* Section header */}
              <div className="no-print flex items-center gap-3 mb-3">
                <div className="h-px flex-1" style={{ backgroundColor: `${section.color}30` }} />
                <span
                  className="text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full border"
                  style={{
                    color: section.color,
                    backgroundColor: `${section.color}10`,
                    borderColor: `${section.color}30`,
                  }}
                >
                  {section.emoji} {section.label}
                </span>
                <div className="h-px flex-1" style={{ backgroundColor: `${section.color}30` }} />
              </div>

              {/* QR cards */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {cps.map(cp => (
                  <div
                    key={cp.id}
                    className="qr-card bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col items-center p-3 hover:shadow-md transition-shadow group"
                  >
                    <div
                      className="w-full text-center py-1 rounded-lg mb-2"
                      style={{ backgroundColor: `${section.color}12` }}
                    >
                      <p className="text-[8px] font-bold tracking-wider uppercase" style={{ color: section.color }}>
                        {cp.id}
                      </p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrUrl(cp.id, 200)}
                      alt={`QR ${cp.id}`}
                      width={120}
                      height={120}
                      className="block"
                    />
                    <p className="text-[9px] font-bold text-gray-700 text-center mt-2 leading-tight">
                      {cp.label}
                    </p>
                    <button
                      onClick={() => void downloadQR(cp.id, cp.label)}
                      className="no-print mt-2 flex items-center gap-1 text-[8px] font-bold px-2 py-1 rounded-md border border-gray-200 text-gray-400 hover:text-[#2C3E73] hover:border-[#2C3E73]/30 hover:bg-[#2C3E73]/5 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined text-[10px]">download</span>
                      PNG
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <p className="no-print text-center text-[11px] text-gray-400 pt-4">
          Tip: pasa el mouse sobre un QR para ver el botón de descarga, o usá &quot;Descargar todos&quot; para obtener las imágenes.
        </p>
      </div>
    </main>
  )
}

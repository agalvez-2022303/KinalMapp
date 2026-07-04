'use client'

import { useEffect, useState, useCallback } from 'react'
import { getAllCheckpoints } from '@/lib/kinal-data'

const APP_URL = 'https://kinal-maa.vercel.app'

const SECTION_CONFIG: Record<string, { label: string; color: string; colorDark: string; mascot: string; tagline: string }> = {
  'CP-BA': { label: 'Básicos', color: '#bc7b4e', colorDark: '#773d1c', mascot: 'CHIP', tagline: 'La base de todo conocimiento' },
  'CP-INF': { label: 'Informática', color: '#a6867a', colorDark: '#6b4f42', mascot: 'KODY', tagline: 'El mundo digital te espera' },
  'CP-MEC': { label: 'Mecánica', color: '#a7a4a9', colorDark: '#584946', mascot: 'KONG', tagline: 'Más allá de las máquinas' },
  'CP-ELE': { label: 'Electrónica', color: '#d7bb96', colorDark: '#a16f4f', mascot: 'Nova', tagline: 'La energía del futuro' },
  'CP-ELC': { label: 'Electricidad', color: '#6692c1', colorDark: '#224076', mascot: 'VOLT', tagline: 'Ilumina tu camino' },
  'CP-DIB': { label: 'Dibujo Técnico', color: '#e1b35c', colorDark: '#c8923a', mascot: 'NEO', tagline: 'Diseña el mañana' },
  'CP-HIS': { label: 'Histórica', color: '#D4BA46', colorDark: '#b8860b', mascot: 'REXY', tagline: '65 años de legado' },
}

function getSection(id: string) {
  for (const [prefix, cfg] of Object.entries(SECTION_CONFIG)) {
    if (id.startsWith(prefix)) return cfg
  }
  return { label: 'KinalMapp', color: '#2C3E73', colorDark: '#1a2547', mascot: '', tagline: '' }
}

function qrUrl(data: string, size = 500) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=4&data=${encodeURIComponent(data)}`
}

async function printPoster(index: number) {
  const el = document.getElementById(`poster-${index}`)
  if (!el) return
  const win = window.open('', '_blank', 'width=816,height=1056')
  if (!win) return
  win.document.write(`<!DOCTYPE html><html><head><style>
    @page { size: letter; margin: 0; }
    body { margin: 0; padding: 0; }
    </style></head><body></body></html>`)
  win.document.body.innerHTML = el.outerHTML
  win.document.close()
  setTimeout(() => { win.print(); win.close() }, 800)
}

interface PosterData {
  id: string
  label: string
  isApp?: boolean
}

export default function PostersPage() {
  const [posters, setPosters] = useState<PosterData[]>([])

  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    const cps = getAllCheckpoints().map(c => ({ id: c.id, label: c.label }))
    setPosters([{ id: APP_URL, label: 'KinalMapp — App', isApp: true }, ...cps])
  }, [])

  const downloadAll = useCallback(async () => {
    for (let i = 0; i < posters.length; i++) {
      await new Promise(r => setTimeout(r, 500))
      await printPoster(i)
    }
  }, [posters])

  return (
    <main className="min-h-screen bg-[#1a1c22] font-sans">
      <style>{`
        @media print {
          body { margin: 0 !important; background: white !important; }
          .no-print { display: none !important; }
          .poster-page { break-after: page; page-break-after: always; margin: 0; }
        }
        .poster-page {
          width: 216mm;
          height: 279mm;
          overflow: hidden;
          position: relative;
        }
      `}</style>

      {/* Header */}
      <header className="no-print bg-gradient-to-r from-[#1b2a4e] to-[#0f1830] text-white px-4 py-5 shadow-lg sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#fee269] font-bold">
              KinalMapp · Expo 2026
            </p>
            <h1 className="font-extrabold text-xl tracking-tight">Pósters QR</h1>
            <p className="text-[11px] text-gray-300 mt-1">
              {posters.length} pósters tamaño carta listos para imprimir
            </p>
          </div>
          <button
            onClick={() => void downloadAll()}
            className="flex items-center gap-2 bg-[#fee269] text-[#1a1400] px-5 py-2.5 rounded-xl font-bold text-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Imprimir todos
          </button>
        </div>
      </header>

      {/* Posters */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {posters.map((poster, i) => {
          const section = poster.isApp
            ? { label: 'KinalMapp', color: '#2C3E73', colorDark: '#1a2547', mascot: '', tagline: 'Explora · Escanea · Colecciona' }
            : getSection(poster.id)

          return (
            <div key={i} className="no-print flex flex-col items-center gap-3">
              {/* Poster preview */}
              <div
                id={`poster-${i}`}
                className="poster-page bg-white shadow-2xl rounded-lg"
                style={{
                  background: poster.isApp
                    ? `linear-gradient(160deg, #1b2a4e 0%, #0f1830 60%, ${section.colorDark} 100%)`
                    : `linear-gradient(160deg, ${section.colorDark} 0%, ${section.color} 50%, ${section.colorDark} 100%)`,
                }}
              >
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: poster.isApp ? '#D4BA46' : 'white', transform: 'translate(30%, -30%)' }} />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: poster.isApp ? '#D4BA46' : 'white', transform: 'translate(-30%, 30%)' }} />

                <div className="relative z-10 flex flex-col items-center justify-between h-full p-10 text-center">
                  {/* Top: Branding */}
                  <div>
                    <p className="text-[10px] font-extrabold tracking-[0.3em] uppercase mb-2" style={{ color: poster.isApp ? '#fee269' : 'rgba(255,255,255,0.6)' }}>
                      Expo Kinal 2026
                    </p>
                    <h1 className="font-extrabold text-4xl tracking-tight text-white mb-1">
                      Kinal<span style={{ color: poster.isApp ? '#D4BA46' : '#fff' }}>Mapp</span>
                    </h1>
                    {!poster.isApp && (
                      <p className="text-sm font-bold text-white/70">{section.mascot}</p>
                    )}
                  </div>

                  {/* Middle: QR */}
                  <div className="flex flex-col items-center gap-5">
                    <div className="bg-white p-4 rounded-2xl shadow-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrUrl(poster.isApp ? APP_URL : poster.id, 400)}
                        alt={`QR ${poster.label}`}
                        width={220}
                        height={220}
                        className="block"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: poster.isApp ? '#fee269' : 'rgba(255,255,255,0.6)' }}>
                        {poster.isApp ? 'Abrir la App' : poster.id}
                      </p>
                      <h2 className="text-white font-extrabold text-2xl leading-tight">
                        {poster.label}
                      </h2>
                      {!poster.isApp && (
                        <p className="text-sm text-white/60 mt-1">{section.tagline}</p>
                      )}
                    </div>
                  </div>

                  {/* Bottom: CTA */}
                  <div>
                    <div
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-extrabold text-sm tracking-wide"
                      style={{
                        backgroundColor: poster.isApp ? '#D4BA46' : 'rgba(255,255,255,0.15)',
                        color: poster.isApp ? '#1a1400' : 'white',
                        border: poster.isApp ? 'none' : '2px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {poster.isApp ? 'phone_android' : 'qr_code_scanner'}
                      </span>
                      {poster.isApp ? 'Escanea para abrir' : 'Escanea para desbloquear'}
                    </div>
                    <p className="text-[9px] text-white/40 mt-4 tracking-wider">
                      kinal-maa.vercel.app
                    </p>
                  </div>
                </div>
              </div>

              {/* Print button */}
              <button
                onClick={() => void printPoster(i)}
                className="flex items-center gap-2 bg-white/10 text-white border border-white/20 px-4 py-2 rounded-xl font-bold text-xs hover:bg-white/15 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">print</span>
                Imprimir póster {i + 1}
              </button>
            </div>
          )
        })}
      </div>
    </main>
  )
}

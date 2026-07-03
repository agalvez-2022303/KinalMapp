'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { TEST_CHECKPOINTS } from '@/lib/checkpoints-test'

const CHECKPOINT_COLORS: Record<string, string> = {
  'CP-BA-1': '#bc7b4e', 'CP-BA-2': '#b07040', 'CP-BA-3': '#a46635', 'CP-BA-4': '#985c2a',
  'CP-BA-5': '#8c5220', 'CP-BA-6': '#804815', 'CP-BA-7': '#743e0a', 'CP-BA-8': '#683400',
  'CP-BA-9': '#5c2a00', 'CP-BA-10': '#502000', 'CP-BA-11': '#441600', 'CP-BA-12': '#380c00', 'CP-BA-13': '#2c0200',
  'CP-INF-1': '#bda69a', 'CP-INF-2': '#b09888', 'CP-INF-3': '#a38a76',
  'CP-MEC-1': '#a7a4a9', 'CP-MEC-2': '#9a969b', 'CP-MEC-3': '#8d898e',
  'CP-ELE-1': '#d7bb96', 'CP-ELE-2': '#caa884', 'CP-ELE-3': '#bd9572',
  'CP-ELC-1': '#6692c1', 'CP-ELC-2': '#5582b1', 'CP-ELC-3': '#4472a1',
  'CP-DIB-1': '#e1b35c', 'CP-DIB-2': '#d4a44a', 'CP-DIB-3': '#c79538',
  'CP-HIS-1': '#D4BA46', 'CP-HIS-2': '#c7ab34', 'CP-HIS-3': '#ba9c22',
}

function qrImageUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(data)}`
}

export default function QRPruebaPage() {
  useEffect(() => {
    document.body.style.overflow = 'auto'
    document.documentElement.style.overflow = 'auto'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#f0ebe0] font-sans">
      <header className="sticky top-0 z-20 bg-[#2C3E73] text-white px-4 py-4 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-bold text-white/90 hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Volver
          </Link>
          <div className="text-center flex-1">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#fee269] font-bold">
              KinalMapp · Expo 2026
            </p>
            <h1 className="font-bold text-lg">QR de Prueba</h1>
          </div>
          <span className="material-symbols-outlined text-[#fee269]">qr_code_2</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <section className="rounded-2xl p-4 border border-[#2C3E73]/15 bg-white/80 shadow-sm">
          <p className="text-sm text-[#2C3E73] leading-relaxed">
            Imprime esta pagina o muestrala en otra pantalla. Escanea cada codigo desde la pestana{' '}
            <strong>Scan</strong> de KinalMapp para desbloquear estampas del album.
          </p>
        </section>

        <div className="grid gap-5">
          {TEST_CHECKPOINTS.map((cp, i) => (
            <article
              key={cp.id}
              className="panini-qr-card rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgba(44,62,115,0.12)] border-2 border-white"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: CHECKPOINT_COLORS[cp.id] ?? '#2C3E73' }}
              >
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-white/80 uppercase">
                    Checkpoint
                  </p>
                  <h2 className="text-white font-extrabold text-lg">{cp.label}</h2>
                </div>
                <span className="bg-white/20 text-white font-mono font-bold text-sm px-3 py-1 rounded-lg">
                  {cp.id}
                </span>
              </div>

              <div className="p-6 flex flex-col items-center gap-4 bg-gradient-to-b from-white to-[#faf6ee]">
                <div className="panini-qr-frame p-3 rounded-xl bg-white border-2 border-dashed border-[#D4BA46]/60 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrImageUrl(cp.id)}
                    alt={`QR ${cp.id}`}
                    width={200}
                    height={200}
                    className="block"
                  />
                </div>
                <p className="text-xs text-center text-[#45464f] max-w-[240px] leading-relaxed">
                  {cp.description}
                </p>
                <p className="text-[10px] font-mono font-bold text-[#6f5d00] bg-[#fff0a0] px-3 py-1 rounded-full">
                  Contenido QR: {cp.id}
                </p>
              </div>
            </article>
          ))}
        </div>

        <section className="text-center pb-8 text-xs text-[#757575]">
          <p>Tip: manten el brillo al 100% y acerca el codigo al visor del escaner.</p>
        </section>
      </div>
    </main>
  )
}

'use client'

import { useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { mapPOIs, type AlbumSection, type Sticker } from '@/lib/kinal-data'

interface AlbumViewProps {
  sections: AlbumSection[]
  progressPercent: number
  unlockedStickers: number
  totalStickers: number
}

const DIVISION_LABELS: Record<string, string> = {
  JR: 'Básicos',
  SR: 'Diversificado',
  Histórica: 'Históricas',
}

const divisionOrder = ['JR', 'SR', 'Histórica'] as const
type Division = typeof divisionOrder[number]

const DIVISION_COLORS: Record<Division, { primary: string; accent: string; bg: string; border: string }> = {
  JR:        { primary: '#2C3E73', accent: '#D4BA46', bg: 'bg-[#eef0f8] text-[#2C3E73]', border: 'border-[#2C3E73]' },
  SR:        { primary: '#F7931E', accent: '#2C3E73', bg: 'bg-[#fff4e8] text-[#F7931E]', border: 'border-[#F7931E]' },
  Histórica: { primary: '#D4BA46', accent: '#2C3E73', bg: 'bg-[#fffbe8] text-[#D4BA46]', border: 'border-[#D4BA46]' },
}

const PAGE_BACKGROUND_ICONS: Record<string, string> = {
  'basicos-1': 'school',
  'basicos-2': 'auto_stories',
  'basicos-3': 'psychology',
  'computacion': 'code',
  'Mecánica': 'settings',
  'Electrónica': 'memory',
  'Electricidad': 'bolt',
  'Dibujo Técnico': 'draw',
  'historica': 'history_edu',
}

export default function AlbumView({
  sections,
  progressPercent,
  unlockedStickers,
  totalStickers,
}: AlbumViewProps) {
  const [activeDiv, setActiveDiv] = useState<Division>('JR')
  const [pageIndex, setPageIndex] = useState(0) // which section (page) we are on
  const [flipping, setFlipping] = useState(false)
  const [flipDir, setFlipDir] = useState<'next' | 'prev'>('next')
  const [tiltStyle, setTiltStyle] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)

  const grouped = divisionOrder.reduce<Record<Division, AlbumSection[]>>(
    (acc, div) => {
      acc[div] = sections.filter((s) => s.division === div)
      return acc
    },
    { JR: [], SR: [], Histórica: [] }
  )

  const pages = grouped[activeDiv]
  const currentPage = pages[pageIndex] ?? null
  const totalPages = pages.length
  const colors = DIVISION_COLORS[activeDiv]

  const goPage = useCallback(
    (dir: 'next' | 'prev') => {
      if (flipping) return
      const next = dir === 'next' ? pageIndex + 1 : pageIndex - 1
      if (next < 0 || next >= totalPages) return
      setFlipDir(dir)
      setFlipping(true)
      setTimeout(() => {
        setPageIndex(next)
        setFlipping(false)
      }, 650)
    },
    [flipping, pageIndex, totalPages]
  )

  const switchDiv = (div: Division) => {
    if (div === activeDiv) return
    setActiveDiv(div)
    setPageIndex(0)
  }

  // 3D Tilt Interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 25
    const rotateY = (centerX - x) / 25

    setTiltStyle(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
  }

  const handleMouseLeave = () => {
    setTiltStyle('rotateX(0deg) rotateY(0deg)')
  }

  // Get scan hint for locked stickers
  const getScanHint = (sticker: Sticker) => {
    const poi = mapPOIs.find((p) => p.checkpointId === sticker.checkpointId)
    return poi
      ? `Escanea el código QR en ${poi.label} para desbloquear.`
      : 'Visita el checkpoint correspondiente en la exposición.'
  }

  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden font-sans">
      {/* Header estilo album Panini */}
      <header className="flex-shrink-0 bg-primary px-container-margin pt-5 pb-0 z-10">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-[9px] font-bold tracking-[0.25em] text-[#fee269] uppercase">
              Album Oficial
            </p>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-white tracking-tight">
              Kinal 2026
            </h1>
          </div>
          <div className="panini-album-badge flex items-center gap-1.5 bg-secondary-container px-3 py-1.5 rounded-full text-on-secondary-container professional-shadow">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              emoji_events
            </span>
            <span className="font-label-bold text-label-bold">
              {unlockedStickers}/{totalStickers}
            </span>
          </div>
        </div>
        <p className="text-[10px] text-white/60 mb-2 font-medium">
          Coleccion de estampas
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/20 rounded-full my-3 overflow-hidden">
          <div
            className="h-full bg-secondary-fixed transition-all duration-700 progress-glow"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Division Tabs */}
        <div className="flex gap-1 overflow-x-auto hide-scrollbar">
          {divisionOrder.map((div) => (
            <button
              key={div}
              onClick={() => switchDiv(div)}
              className={`px-4 py-2 text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all rounded-t-xl cursor-pointer ${
                activeDiv === div
                  ? 'bg-background text-primary font-extrabold'
                  : 'bg-white/10 text-white/70 hover:bg-white/15'
              }`}
            >
              {div === 'JR' ? 'Básicos' : div === 'SR' ? 'Diversificado' : 'Histórica'}
            </button>
          ))}
        </div>
      </header>

      {/* Division Label Strip */}
      <div
        className={`px-container-margin py-2.5 text-xs font-bold flex-shrink-0 flex items-center justify-between border-b border-outline-variant/10 ${colors.bg}`}
      >
        <span>{DIVISION_LABELS[activeDiv]}</span>
        {totalPages > 0 && (
          <span className="text-[10px] opacity-75">
            Pág. {pageIndex + 1} de {totalPages}
          </span>
        )}
      </div>

      {/* Book Scroll Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-container-margin py-4 space-y-4 pb-24 panini-album-bg">
        {/* Book Container with perspective */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="book-scene w-full flex items-start justify-center cursor-default"
          style={{ height: '340px' }}
        >
          {currentPage ? (
            <div
              className={`book-page w-full h-full ${flipping ? 'flipping panini-page-turn' : ''} ${
                flipping && flipDir === 'next' ? 'flipped' : ''
              }`}
              style={{
                transform: tiltStyle || 'rotateX(0deg) rotateY(0deg)',
              }}
            >
              {/* Card Page Content */}
              <div className="book-page-front panini-page w-full h-full rounded-xl overflow-hidden flex flex-col border border-[#d4c4a8]/60 relative">
                <div className="panini-perforation-top" />
                {/* Decorative background icon */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none flex items-center justify-center">
                  <span className="material-symbols-outlined text-[100px]">
                    {PAGE_BACKGROUND_ICONS[currentPage.id] || 'menu_book'}
                  </span>
                </div>

                <div className="flex h-full">
                  {/* Page spine */}
                  <div className="w-3 flex-shrink-0 book-spine" style={{ backgroundColor: colors.primary }}></div>

                  <div className="flex-1 flex flex-col p-4 relative z-10 h-full">
                    {/* Header of the page */}
                    <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2 mb-3">
                      <div>
                        <h2 className="font-headline-md text-sm text-primary font-bold">
                          {currentPage.name}
                        </h2>
                        <p className="text-[10px] text-on-surface-variant font-medium">
                          Estampas: {currentPage.stickers.filter((s) => s.unlocked).length} de {currentPage.stickers.length}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-md bg-primary-container/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm font-bold">
                          {PAGE_BACKGROUND_ICONS[currentPage.id] || 'menu_book'}
                        </span>
                      </div>
                    </div>

                    {/* Stickers bento-style grid */}
                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                      <div className="grid grid-cols-2 gap-3">
                        {currentPage.stickers.map((sticker, idx) => {
                          const previousStickersCount = pages
                            .slice(0, pageIndex)
                            .reduce((acc, p) => acc + p.stickers.length, 0);
                          
                          const stickerNum = previousStickersCount + idx + 1;
                          return (
                            <div
                              key={sticker.id}
                              className="panini-slot panini-sticker-stagger relative group aspect-[4/5] rounded-lg overflow-hidden"
                              style={{ animationDelay: `${idx * 70}ms` }}
                            >
                              <span className="panini-slot-number">
                                #{String(stickerNum).padStart(2, '0')}
                              </span>
                              {sticker.unlocked ? (
                                <div className="panini-sticker-unlocked w-full h-full flex flex-col items-center justify-center space-y-1 p-1">
                                  <span className="text-3xl drop-shadow-md select-none relative z-[2]">
                                    {sticker.emoji}
                                  </span>
                                  <span className="font-label-bold text-[8px] text-primary tracking-wider text-center px-1 font-extrabold truncate max-w-full uppercase relative z-[2]">
                                    {sticker.name}
                                  </span>
                                  <div className="absolute top-1.5 right-1.5 z-[3] panini-foil-badge">
                                    <span
                                      className="material-symbols-outlined text-[#D4BA46] text-[16px]"
                                      style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                      stars
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="panini-sticker-locked w-full h-full flex flex-col items-center justify-center space-y-1 relative">
                                  <div className="w-9 h-9 rounded-full bg-white/40 flex items-center justify-center border border-white/60">
                                    <span className="material-symbols-outlined text-xl text-[#2C3E73]/35">
                                      lock
                                    </span>
                                  </div>
                                  <span className="font-label-bold text-[7px] text-[#2C3E73]/40 tracking-widest font-bold uppercase">
                                    Falta
                                  </span>
                                  <div className="absolute inset-0 bg-[#1A2340]/92 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity rounded-lg flex items-center justify-center p-2 text-center duration-200 select-none z-[4]">
                                    <p className="text-[8px] text-white leading-tight font-medium">
                                      {getScanHint(sticker)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Footer of the book page */}
                    <div className="mt-2 flex justify-between items-center border-t border-outline-variant/10 pt-2 flex-shrink-0">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#6f5d00] progress-glow"></div>
                        <span className="text-[8px] font-bold uppercase text-on-surface-variant/60 tracking-widest">
                          Kinal 2026
                        </span>
                      </div>
                      <span className="text-[8px] font-bold text-primary font-mono opacity-80">
                        PÁGINA {pageIndex + 1 < 10 ? `0${pageIndex + 1}` : pageIndex + 1}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="panini-perforation-bottom" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 h-48 opacity-45">
              <span className="material-symbols-outlined text-5xl text-primary">book</span>
              <p className="text-sm font-bold text-primary">Sin secciones disponibles</p>
            </div>
          )}
        </div>

        {/* Page turn controls */}
        <div className="flex items-center justify-between w-full flex-shrink-0 px-1">
          <button
            onClick={() => goPage('prev')}
            disabled={pageIndex === 0 || flipping}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold text-xs bg-primary text-white hover:bg-primary/95 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
            Anterior
          </button>

          {/* Page dots indicator */}
          <div className="flex items-center gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!flipping && i !== pageIndex) {
                    setFlipDir(i > pageIndex ? 'next' : 'prev')
                    setFlipping(true)
                    setTimeout(() => {
                      setPageIndex(i)
                      setFlipping(false)
                    }, 650)
                  }
                }}
                className="transition-all rounded-full cursor-pointer h-2"
                style={{
                  width: i === pageIndex ? '20px' : '8px',
                  background: i === pageIndex ? '#2C3E73' : 'rgba(44,62,115,0.25)',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => goPage('next')}
            disabled={pageIndex === totalPages - 1 || flipping}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl font-bold text-xs bg-primary text-white hover:bg-primary/95 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
          >
            Siguiente
            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </button>
        </div>

        {/* Bottom Collector Summary Card 
        <section className="glass-card rounded-xl p-stack-md border border-outline-variant/20 shadow-sm flex items-center space-x-3 select-none">
          <div className="bg-primary-container p-2.5 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-primary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-label-bold text-primary font-bold text-xs">ESTADO DE COLECTOR</h3>
            <p className="text-[10px] text-on-surface-variant">
              Escanea checkpoints para completar tu album y ganar medallas.
            </p>
            
            <Link
              href="/qr-prueba"
              className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-secondary hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
              Ver QR de prueba
            </Link>
            
          </div>
        </section>*/}
      </div>
    </div>
  )
}

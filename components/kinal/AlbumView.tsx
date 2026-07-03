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

type ViewMode = 'JR' | 'SR' | 'Histórica' | 'Mascotas'

const DIVISION_LABELS: Record<string, string> = {
  JR: 'Básicos',
  SR: 'Diversificado',
  Histórica: 'Históricas',
  Mascotas: 'Mascotas',
}

const DIVISION_COLORS: Record<string, { primary: string; accent: string }> = {
  JR:        { primary: '#bc7b4e', accent: '#773d1c' },
  SR:        { primary: '#6692c1', accent: '#224076' },
  Histórica: { primary: '#D4BA46', accent: '#b8860b' },
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

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0x00FF) - amount)
  const b = Math.max(0, (num & 0x0000FF) - amount)
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0x00FF) + amount)
  const b = Math.min(255, (num & 0x0000FF) + amount)
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

function getMedallionColors(baseColor: string, circleColor?: string) {
  const mc = circleColor || darkenColor(baseColor, 30)
  return {
    outerDark: darkenColor(mc, 40),
    dark: darkenColor(mc, 15),
    medium: mc,
    light: lightenColor(mc, 30),
    center: lightenColor(baseColor, 60),
    text: darkenColor(mc, 40),
  }
}

function getSectionProgress(section: AlbumSection): number {
  const total = section.stickers.length
  const unlocked = section.stickers.filter(s => s.unlocked).length
  return total > 0 ? Math.round((unlocked / total) * 100) : 0
}

export default function AlbumView({
  sections,
  progressPercent,
  unlockedStickers,
  totalStickers,
}: AlbumViewProps) {
  const [activeDiv, setActiveDiv] = useState<ViewMode>('JR')
  const [pageIndex, setPageIndex] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [flipDir, setFlipDir] = useState<'next' | 'prev'>('next')
  const [tiltStyle, setTiltStyle] = useState<string>('')
  const [dismissCelebration, setDismissCelebration] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isMascotasView = activeDiv === 'Mascotas'

  const grouped = ['JR', 'SR', 'Histórica'].reduce<Record<string, AlbumSection[]>>(
    (acc, div) => {
      acc[div] = sections.filter((s) => s.division === div)
      return acc
    },
    { JR: [], SR: [], Histórica: [] }
  )

  const pages = isMascotasView ? [] : (grouped[activeDiv] || [])
  const currentPage = pages[pageIndex] ?? null
  const totalPages = pages.length

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

  const switchDiv = (div: ViewMode) => {
    if (div === activeDiv) return
    setActiveDiv(div)
    setPageIndex(0)
  }

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

  const getScanHint = (sticker: Sticker) => {
    const poi = mapPOIs.find((p) => p.checkpointId === sticker.checkpointId)
    return poi
      ? `Escanea el código QR en ${poi.label} para desbloquear.`
      : 'Visita el checkpoint correspondiente en la exposición.'
  }

  // Calcular datos de mascotas
  const mascotData = sections
    .filter(s => s.mascotImage)
    .map(s => ({
      ...s,
      progress: getSectionProgress(s),
      unlockedCount: s.stickers.filter(st => st.unlocked).length,
    }))

  const divisionOrder: ViewMode[] = ['JR', 'SR', 'Histórica', 'Mascotas']

  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden font-sans">
      {/* Header */}
      <header className="flex-shrink-0 bg-white/70 dark:bg-dark-navy/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_2px_12px_rgba(44,62,115,0.03)] z-10">
        <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
          <h1 className="font-extrabold text-xl tracking-tight text-primary dark:text-inverse-primary">
            Kinal<span className="text-[#D4BA46]">Mapp</span>
          </h1>
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#fee269] to-[#D4BA46] px-3.5 py-1 rounded-full text-[#1a1400] shadow-[0_4px_12px_rgba(212,186,70,0.2)] font-bold text-xs select-none">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              emoji_events
            </span>
            <span>{unlockedStickers}/{totalStickers}</span>
          </div>
        </div>

        {/* Progress Banner */}
        <div className="px-container-margin pb-4 w-full max-w-md mx-auto">
          <div className="bg-gradient-to-br from-[#1b2a4e] to-[#0f1830] text-white p-4 rounded-2xl shadow-glow-navy relative overflow-hidden border border-white/5">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#fee269]/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#F7931E]/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="relative z-10 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] font-extrabold tracking-widest text-[#fee269] uppercase opacity-90">
                    ESTADO DE ÁLBUM
                  </p>
                  <h2 className="text-xl font-extrabold tracking-tight mt-0.5">
                    {progressPercent}% <span className="text-xs font-semibold text-gray-300">completado</span>
                  </h2>
                </div>
                <span className="material-symbols-outlined text-[#fee269] text-[24px] animate-pulse">
                  auto_awesome
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-[2px]">
                  <div
                    className="h-full rounded-full gold-shimmer relative transition-all duration-700 shadow-[0_0_8px_#fee269]"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 blur-sm"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-300 font-medium">
                  <span>Progreso de colección</span>
                  <span>{unlockedStickers} de {totalStickers} estampas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex overflow-x-auto no-scrollbar gap-2 px-container-margin pb-4 w-full max-w-md mx-auto select-none">
          {divisionOrder.map((div) => {
            const tabIcons: Record<string, string> = {
              JR: 'school',
              SR: 'engineering',
              Histórica: 'history_edu',
              Mascotas: 'pets',
            }
            return (
              <button
                key={div}
                onClick={() => switchDiv(div)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeDiv === div
                    ? 'bg-primary text-white shadow-md shadow-[#2C3E73]/20 scale-105'
                    : 'bg-white dark:bg-[#1a2340] text-gray-500 border border-outline-variant/10 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{tabIcons[div]}</span>
                {DIVISION_LABELS[div]}
              </button>
            )
          })}
        </nav>
      </header>

      {/* Label Strip */}
      <div className="px-container-margin py-3 text-xs font-bold flex-shrink-0 flex items-center justify-between border-b border-outline-variant/10 bg-white/50 dark:bg-[#1a2340]/50">
        <span className="text-[#2C3E73] dark:text-white font-extrabold">{DIVISION_LABELS[activeDiv]}</span>
        {!isMascotasView && totalPages > 0 && (
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            Pág. {pageIndex + 1} de {totalPages}
          </span>
        )}
        {isMascotasView && (
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            {mascotData.filter(m => m.progress === 100).length} de {mascotData.length} completas
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-container-margin py-5 space-y-4 pb-24">
        {isMascotasView ? (
          /* ═══ MASCOTAS GRID ═══ */
          <div className="grid grid-cols-2 gap-4">
            {mascotData.map((mascot, idx) => {
              const circleColor = mascot.mascotColor || '#D4BA46'
              const imgSrc = mascot.mascotImage || ''
              return (
                <div
                  key={mascot.id}
                  className="panini-sticker-stagger flex flex-col items-center bg-white dark:bg-[#1a2340] rounded-2xl p-4 border border-outline-variant/10 shadow-premium relative overflow-hidden"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Mascot shaped container */}
                  <div className="relative w-28 h-28 flex items-center justify-center mb-3">
                    {/* Drop shadow border effect */}
                    <div
                      className="absolute inset-0 transition-all duration-500"
                      style={{
                        filter: `drop-shadow(0 0 ${mascot.progress === 100 ? '8px' : '3px'} ${circleColor}${mascot.progress === 100 ? '80' : '30'})`,
                        maskImage: `url(${imgSrc})`,
                        WebkitMaskImage: `url(${imgSrc})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        backgroundColor: mascot.progress === 100 ? circleColor : '#d1d5db',
                      }}
                    />

                    {/* Grayscale base */}
                    <img
                      src={imgSrc}
                      alt={mascot.mascotName || ''}
                      className="w-full h-full object-contain relative z-[1]"
                      style={{
                        filter: 'grayscale(100%) opacity(0.25)',
                        maskImage: `url(${imgSrc})`,
                        WebkitMaskImage: `url(${imgSrc})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                      }}
                    />

                    {/* Colored fill */}
                    <img
                      src={imgSrc}
                      alt={mascot.mascotName || ''}
                      className="w-full h-full object-contain absolute z-[2] transition-all duration-700"
                      style={{
                        clipPath: `inset(${100 - mascot.progress}% 0 0 0)`,
                        maskImage: `url(${imgSrc})`,
                        WebkitMaskImage: `url(${imgSrc})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                      }}
                    />

                    {/* Percentage badge */}
                    {mascot.progress > 0 && mascot.progress < 100 && (
                      <div className="absolute bottom-0 right-0 z-[3] bg-white dark:bg-[#1a2340] rounded-full px-1.5 py-0.5 shadow-md border border-gray-100 dark:border-white/10">
                        <span className="text-[9px] font-extrabold" style={{ color: circleColor }}>
                          {mascot.progress}%
                        </span>
                      </div>
                    )}

                    {/* Glow when 100% */}
                    {mascot.progress === 100 && (
                      <div className="absolute inset-0 z-[3] pointer-events-none">
                        <div className="absolute inset-0 animate-pulse" style={{
                          maskImage: `url(${imgSrc})`,
                          WebkitMaskImage: `url(${imgSrc})`,
                          maskSize: 'contain',
                          WebkitMaskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          WebkitMaskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskPosition: 'center',
                          backgroundColor: `${circleColor}30`,
                          filter: 'blur(8px)',
                        }}></div>
                      </div>
                    )}
                  </div>

                  {/* Name & info */}
                  <span className="font-extrabold text-xs text-[#2C3E73] dark:text-white text-center mb-0.5">
                    {mascot.mascotName}
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium text-center mb-2.5 leading-tight">
                    {mascot.name}
                  </span>

                  {/* Progress bar */}
                  <div className="w-full space-y-1.5">
                    <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                        style={{
                          width: `${mascot.progress}%`,
                          backgroundColor: circleColor,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-bold text-gray-400">
                        {mascot.unlockedCount}/{mascot.stickers.length}
                      </span>
                      <span
                        className="text-[9px] font-extrabold"
                        style={{ color: circleColor }}
                      >
                        {mascot.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* ═══ BOOK VIEW ═══ */
          <>
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
                  style={{ transform: tiltStyle || 'rotateX(0deg) rotateY(0deg)' }}
                >
                  <div className="book-page-front w-full h-full rounded-2xl overflow-hidden flex flex-col border border-outline-variant/10 shadow-premium bg-white dark:bg-[#1a2340] relative">
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none flex items-center justify-center">
                      <span className="material-symbols-outlined text-[100px]">
                        {PAGE_BACKGROUND_ICONS[currentPage.id] || 'menu_book'}
                      </span>
                    </div>

                    <div className="flex h-full">
                      <div className="w-3 flex-shrink-0 book-spine" style={{ backgroundColor: DIVISION_COLORS[activeDiv]?.primary || '#2C3E73' }}></div>

                      <div className="flex-1 flex flex-col p-4 relative z-10 h-full">
                        <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3 mb-4">
                          <div>
                            <h2 className="font-extrabold text-sm text-[#2C3E73] dark:text-white font-bold">
                              {currentPage.name}
                            </h2>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                              Estampas: {currentPage.stickers.filter((s) => s.unlocked).length} de {currentPage.stickers.length}
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#fee269] to-[#D4BA46] flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-[#1a1400] text-sm font-bold">
                              {PAGE_BACKGROUND_ICONS[currentPage.id] || 'menu_book'}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto hide-scrollbar">
                          <div className="grid grid-cols-2 gap-3">
                            {currentPage.stickers.map((sticker, idx) => {
                              const previousStickersCount = pages
                                .slice(0, pageIndex)
                                .reduce((acc, p) => acc + p.stickers.length, 0)
                              const stickerNum = previousStickersCount + idx + 1
                              const baseColor = currentPage.mascotColor || '#fee269'
                              const mc = getMedallionColors(baseColor, currentPage.mascotCircleColor)

                              return (
                                <div
                                  key={sticker.id}
                                  className="panini-slot panini-sticker-stagger relative group aspect-[4/5] rounded-lg overflow-hidden"
                                  style={{ animationDelay: `${idx * 70}ms` }}
                                >
                                  {sticker.unlocked ? (
                                    <div
                                      className="w-full h-full flex flex-col items-center justify-center space-y-1.5 p-2 rounded-lg border relative overflow-hidden sticker-glow-ring"
                                      style={{
                                        backgroundColor: baseColor,
                                        borderColor: `${baseColor}40`,
                                      }}
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                                      <div className="relative z-[2] w-16 h-16 flex items-center justify-center medallion-waves">
                                        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg">
                                          <circle cx="32" cy="32" r="30" fill="none" stroke={mc.outerDark} strokeWidth="2.5"/>
                                          <circle cx="32" cy="32" r="27" fill="none" stroke={mc.dark} strokeWidth="2.5"/>
                                          <circle cx="32" cy="32" r="24" fill="none" stroke={mc.medium} strokeWidth="2.5"/>
                                          <circle cx="32" cy="32" r="21" fill="none" stroke={mc.light} strokeWidth="2"/>
                                          <circle cx="32" cy="32" r="18" fill="white" stroke={mc.light} strokeWidth="1.5"/>
                                          <text x="32" y="32" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill={mc.text}>
                                            {stickerNum}
                                          </text>
                                        </svg>
                                      </div>
                                      <span className="font-extrabold text-[8px] text-white tracking-wider text-center px-1 truncate max-w-full uppercase relative z-[2] drop-shadow-sm">
                                        {sticker.name}
                                      </span>
                                      <div className="absolute top-1.5 right-1.5 z-[3] flex items-center justify-center bg-white/95 rounded-full p-[1px] shadow-sm">
                                        <span className="material-symbols-outlined text-[#D4BA46] text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                          stars
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center relative bg-gray-200 dark:bg-gray-700/30 rounded-lg border border-gray-300 dark:border-gray-600/30">
                                      <span className="text-3xl select-none opacity-[0.15] saturate-0 scale-90 pointer-events-none">
                                        {sticker.emoji}
                                      </span>
                                      <div className="w-9 h-9 rounded-full bg-[#2C3E73]/15 flex items-center justify-center absolute z-10">
                                        <span className="material-symbols-outlined text-[18px] text-[#2C3E73]/40 dark:text-white/30">
                                          lock
                                        </span>
                                      </div>
                                      <div className="absolute inset-0 bg-[#0c1220]/95 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity rounded-lg flex items-center justify-center p-2 text-center duration-200 select-none z-[4] pointer-events-none">
                                        <p className="text-[7.5px] text-white/90 leading-tight font-bold">
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

                        <div className="mt-3 flex justify-between items-center border-t border-outline-variant/10 pt-3 flex-shrink-0">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#D4BA46]"></div>
                            <span className="text-[8px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                              Kinal · 2026
                            </span>
                          </div>
                          <span className="text-[8px] font-extrabold font-mono tracking-widest text-gray-400 dark:text-gray-500">
                            PÁG·{pageIndex + 1 < 10 ? `0${pageIndex + 1}` : pageIndex + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 h-48 opacity-45">
                  <span className="material-symbols-outlined text-5xl text-primary">book</span>
                  <p className="text-sm font-bold text-primary">Sin secciones disponibles</p>
                </div>
              )}
            </div>

            {/* Page controls */}
            <div className="flex items-center justify-between w-full flex-shrink-0 px-1">
              <button
                onClick={() => goPage('prev')}
                disabled={pageIndex === 0 || flipping}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#2C3E73] to-[#13275c] text-white hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
                Anterior
              </button>

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
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#2C3E73] to-[#13275c] text-white hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer shadow-md"
              >
                Siguiente
                <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* 100% Celebration Overlay */}
      {progressPercent === 100 && !dismissCelebration && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[999] p-6 animate-in fade-in duration-300 pointer-events-auto">
          <div className="bg-gradient-to-br from-[#1b2a4e] to-[#0f1830] border border-[#fee269]/40 p-6 rounded-3xl max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(212,186,70,0.3)] animate-in zoom-in-95 duration-300 flex flex-col items-center select-none">
            <div className="absolute top-0 inset-x-0 h-full w-full pointer-events-none opacity-40">
              <div className="absolute top-4 left-6 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
              <div className="absolute top-12 right-12 w-2 h-4 bg-yellow-400 rotate-12 animate-pulse"></div>
              <div className="absolute top-24 left-16 w-3.5 h-1.5 bg-blue-400 rotate-45 animate-pulse"></div>
              <div className="absolute bottom-16 right-8 w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="absolute bottom-28 left-8 w-2.5 h-2.5 bg-pink-400 rotate-12 animate-pulse"></div>
            </div>
            <div className="w-24 h-24 rounded-full bg-[#fee269]/10 absolute -top-4 blur-xl"></div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#fee269] to-[#D4BA46] flex items-center justify-center shadow-glow-gold relative z-10 mb-4 animate-bounce">
              <span className="material-symbols-outlined text-4xl text-[#1a1400] font-extrabold" style={{ fontVariationSettings: "'FILL' 1" }}>
                trophy
              </span>
            </div>
            <h2 className="text-[#fee269] font-extrabold text-xl tracking-tight leading-tight uppercase mb-1">
              ¡Álbum Completado!
            </h2>
            <p className="text-[10px] font-extrabold tracking-widest text-gray-300 uppercase mb-4">
              Coleccionista Experto Kinal
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full mb-6">
              <p className="text-xs text-gray-200 leading-relaxed">
                ¡Felicidades! Has escaneado todos los checkpoints del campus y recolectado las <strong>{totalStickers} estampas oficiales</strong> de la Expo Kinal 2026.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold text-[#fee269] bg-[#fee269]/10 py-1.5 px-3 rounded-full border border-[#fee269]/20 w-fit mx-auto">
                <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                Medalla Desbloqueada
              </div>
            </div>
            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={() => setDismissCelebration(true)}
                className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#fee269] to-[#D4BA46] text-[#1a1400] shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                Ver mi Álbum
              </button>
              <button
                onClick={() => alert("¡Logro compartido con éxito en tus redes de Kinal!")}
                className="w-full py-3 rounded-xl font-bold text-xs border border-white/20 text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">share</span>
                Compartir Logro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

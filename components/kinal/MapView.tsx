'use client'

import { useState } from 'react'
import { mapPOIs, todayEvents, type MapPOI } from '@/lib/kinal-data'
import dynamic from 'next/dynamic'

const KinalMap = dynamic(() => import('./KinalMap'), {
  ssr: false,
})

interface MapViewProps {
  unlockedCheckpoints: string[]
}

type FilterType = 'Todos' | 'Checkpoints' | 'Eventos' | 'Edificios'
const FILTERS: FilterType[] = ['Todos', 'Checkpoints', 'Eventos', 'Edificios']

export default function MapView({ unlockedCheckpoints }: MapViewProps) {
  const [filter, setFilter] = useState<FilterType>('Todos')
  const [selected, setSelected] = useState<MapPOI | null>(null)

  const getPoiColor = (poi: MapPOI) => {
    if (poi.type === 'checkpoint') {
      return unlockedCheckpoints.includes(poi.checkpointId || '') ? '#22C55E' : '#fee269'
    }
    if (poi.type === 'event') return '#f99520'
    return '#13275c'
  }

  const isPOIUnlocked = (poi: MapPOI) => {
    if (poi.type !== 'checkpoint') return true
    return unlockedCheckpoints.includes(poi.checkpointId || '')
  }

  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden font-sans">
      {/* Header */}
      <header className="flex-shrink-0 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm z-10">
        <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
            KinalMap
          </h1>
        </div>

        {/* Filter Chips */}
        <nav className="flex overflow-x-auto no-scrollbar gap-2 px-container-margin pb-3 w-full max-w-md mx-auto select-none">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f)
                setSelected(null) // clear selection on filter change
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {f}
            </button>
          ))}
        </nav>
      </header>

      {/* Map Canvas wrapper */}
      <div className="flex-1 relative w-full max-w-md mx-auto overflow-hidden bg-surface-dim">
        <KinalMap
          unlockedCheckpoints={unlockedCheckpoints}
          filter={filter}
          selectedPOI={selected}
          onSelectPOI={setSelected}
        />

        {/* Legend Overlay */}
        <div className="absolute top-4 right-4 z-10 w-36 glass-panel bg-white/80 dark:bg-dark-navy/80 rounded-xl p-3 border border-outline-variant/30 shadow-md select-none pointer-events-none">
          <h4 className="text-[11px] font-bold text-primary dark:text-inverse-primary mb-2 uppercase tracking-wide">
            Leyenda
          </h4>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2 text-[10px] font-semibold text-on-surface-variant dark:text-outline-variant">
              <span className="w-2.5 h-2.5 rounded-full bg-[#13275c] border border-white shadow-sm"></span> Edificios
            </li>
            <li className="flex items-center gap-2 text-[10px] font-semibold text-on-surface-variant dark:text-outline-variant">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f99520] border border-white shadow-sm"></span> Eventos
            </li>
            <li className="flex items-center gap-2 text-[10px] font-semibold text-on-surface-variant dark:text-outline-variant">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fee269] border border-white shadow-sm"></span> Bloqueado
            </li>
            <li className="flex items-center gap-2 text-[10px] font-semibold text-on-surface-variant dark:text-outline-variant">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] border border-white shadow-sm"></span> Visitado
            </li>
          </ul>
        </div>

        {/* Events horizontal strip (visible if Todos or Eventos is active, and no POI is selected) */}
        {!selected && (filter === 'Todos' || filter === 'Eventos') && (
          <div className="absolute bottom-20 left-4 right-4 flex gap-2 overflow-x-auto hide-scrollbar z-10">
            {todayEvents.slice(0, 3).map((ev, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/95 dark:bg-dark-navy/95 border border-outline-variant/20 shadow-md select-none backdrop-blur-md"
              >
                <span
                  className="w-1.5 h-6 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      ev.color === 'gold' ? '#fee269' : ev.color === 'orange' ? '#f99520' : '#13275c',
                  }}
                />
                <div className="max-w-[140px]">
                  <p className="font-bold text-[11px] text-primary dark:text-inverse-primary truncate leading-tight">
                    {ev.title}
                  </p>
                  <p className="text-[9px] text-gray-500 dark:text-outline-variant truncate mt-0.5">
                    {ev.time} · {ev.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Sheet Drawer (POI Details) */}
        {selected && (
          <div className="absolute bottom-0 left-0 right-0 z-[400] bg-white dark:bg-dark-navy rounded-t-[32px] shadow-[0px_-8px_24px_rgba(44,62,115,0.15)] border-t border-outline-variant/10 animate-in slide-in-from-bottom duration-300">
            {/* Drag Handle Bar */}
            <div
              className="w-full flex justify-center py-3 cursor-pointer"
              onClick={() => setSelected(null)}
            >
              <div className="w-10 h-1.5 rounded-full bg-outline-variant/60"></div>
            </div>

            {/* Content Body */}
            <div className="px-6 pb-24 text-on-surface dark:text-inverse-on-surface">
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0 flex-1">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1 ${
                      isPOIUnlocked(selected) ? 'text-[#22C55E]' : 'text-[#756300]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isPOIUnlocked(selected) ? 'verified' : 'help'}
                    </span>
                    {selected.type === 'checkpoint'
                      ? isPOIUnlocked(selected)
                        ? 'Completado'
                        : 'Pendiente'
                      : 'Disponible'}
                  </span>
                  <h2 className="font-headline-lg text-lg text-primary dark:text-inverse-primary leading-tight font-extrabold truncate">
                    {selected.label}
                  </h2>
                  <p className="text-xs text-on-surface-variant dark:text-outline-variant mt-0.5">
                    {selected.type === 'checkpoint'
                      ? `Checkpoint ${selected.checkpointId}`
                      : selected.type === 'event'
                      ? 'Punto de Evento'
                      : 'Edificio de Interés'}
                  </p>
                </div>

                {/* Shimmer badge */}
                <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container shadow-md flex items-center justify-center flex-shrink-0 border-2 border-white">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    token
                  </span>
                </div>
              </div>

              {/* Attributes grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-surface-container-low dark:bg-primary-container/20 p-3 rounded-xl border border-outline-variant/10">
                  <p className="text-[10px] font-medium text-on-surface-variant dark:text-outline-variant uppercase">
                    Recompensa
                  </p>
                  <p className="text-xs font-bold text-primary dark:text-inverse-primary flex items-center gap-1 mt-0.5">
                    {selected.type === 'checkpoint' ? '50 XP' : 'Visita'}
                    <span className="material-symbols-outlined text-[14px] text-on-tertiary-container">
                      bolt
                    </span>
                  </p>
                </div>
                <div className="bg-surface-container-low dark:bg-primary-container/20 p-3 rounded-xl border border-outline-variant/10">
                  <p className="text-[10px] font-medium text-on-surface-variant dark:text-outline-variant uppercase">
                    Estado
                  </p>
                  <p
                    className={`text-xs font-bold mt-0.5 ${
                      isPOIUnlocked(selected) ? 'text-[#22C55E]' : 'text-[#756300]'
                    }`}
                  >
                    {isPOIUnlocked(selected) ? 'Desbloqueado' : 'Bloqueado'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-on-surface-variant dark:text-outline-variant leading-relaxed mb-6">
                {selected.description}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => alert(`Cómo llegar a: ${selected.label}`)}
                  className="flex-1 bg-primary hover:bg-primary/95 text-white py-3 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">directions</span>
                  Cómo llegar
                </button>
                <button
                  onClick={() => alert(`Compartir: ${selected.label}`)}
                  className="w-12 h-12 flex items-center justify-center border-2 border-primary text-primary hover:bg-primary/5 rounded-xl active:scale-95 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">share</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

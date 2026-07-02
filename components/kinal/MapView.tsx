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
      <header className="flex-shrink-0 bg-white/70 dark:bg-dark-navy/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_2px_12px_rgba(44,62,115,0.03)] z-10">
        <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
          <h1 className="font-extrabold text-xl tracking-tight text-primary dark:text-inverse-primary">
            Kinal<span className="text-[#D4BA46]">Mapp</span>
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
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                filter === f
                  ? 'bg-primary text-white shadow-md shadow-[#2C3E73]/20 scale-105'
                  : 'bg-white dark:bg-[#1a2340] text-gray-500 border border-outline-variant/10 hover:bg-gray-50 dark:hover:bg-white/5'
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
        <div className="absolute top-4 right-4 z-10 w-36 glass-premium rounded-2xl p-3 border border-outline-variant/25 shadow-md select-none pointer-events-none text-on-surface">
          <h4 className="text-[10px] font-extrabold text-[#2C3E73] dark:text-[#fee269] mb-2 uppercase tracking-widest leading-none">
            Leyenda
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-[9px] font-bold text-gray-500 dark:text-gray-300 uppercase leading-none">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2C3E73] border border-white dark:border-[#0d1420] shadow-sm"></span> Edificios
            </li>
            <li className="flex items-center gap-2 text-[9px] font-bold text-gray-500 dark:text-gray-300 uppercase leading-none">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f99520] border border-white dark:border-[#0d1420] shadow-sm"></span> Eventos
            </li>
            <li className="flex items-center gap-2 text-[9px] font-bold text-gray-500 dark:text-gray-300 uppercase leading-none">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fee269] border border-white dark:border-[#0d1420] shadow-sm animate-pulse"></span> Bloqueado
            </li>
            <li className="flex items-center gap-2 text-[9px] font-bold text-gray-500 dark:text-gray-300 uppercase leading-none">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] border border-white dark:border-[#0d1420] shadow-sm"></span> Visitado
            </li>
          </ul>
        </div>

        {/* Events horizontal strip (visible if Todos or Eventos is active, and no POI is selected) */}
        {!selected && (filter === 'Todos' || filter === 'Eventos') && (
          <div className="absolute bottom-20 left-4 right-4 flex gap-2 overflow-x-auto hide-scrollbar z-10">
            {todayEvents.slice(0, 3).map((ev, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/95 dark:bg-[#1a2340]/95 border border-outline-variant/15 shadow-md select-none backdrop-blur-md hover-scale-bounce"
              >
                <span
                  className="w-1.5 h-6 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      ev.color === 'gold' ? '#fee269' : ev.color === 'orange' ? '#f99520' : '#2C3E73',
                  }}
                />
                <div className="max-w-[140px]">
                  <p className="font-extrabold text-[10px] text-primary dark:text-[#fee269] truncate leading-tight">
                    {ev.title}
                  </p>
                  <p className="text-[9px] text-gray-400 dark:text-gray-300 truncate mt-0.5 leading-none">
                    {ev.time} · {ev.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Sheet Drawer (POI Details) */}
        {selected && (
          <div className="absolute bottom-0 left-0 right-0 z-[400] bg-white/95 dark:bg-[#0d1420]/95 backdrop-blur-xl rounded-t-[28px] shadow-[0px_-8px_30px_rgba(44,62,115,0.15)] border-t border-outline-variant/20 animate-in slide-in-from-bottom duration-300 pointer-events-auto">
            {/* Drag Handle Bar */}
            <div
              className="w-full flex justify-center py-3.5 cursor-pointer"
              onClick={() => setSelected(null)}
            >
              <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-white/20"></div>
            </div>

            {/* Content Body */}
            <div className="px-6 pb-24 text-on-surface dark:text-inverse-on-surface select-none">
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0 flex-1">
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider mb-1 px-2.5 py-0.5 rounded-full ${
                      isPOIUnlocked(selected) 
                        ? 'bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400' 
                        : 'bg-[#fee269]/20 text-[#756300] dark:bg-[#fee269]/10 dark:text-[#fee269]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px] font-bold">
                      {isPOIUnlocked(selected) ? 'verified' : 'help'}
                    </span>
                    {selected.type === 'checkpoint'
                      ? isPOIUnlocked(selected)
                        ? 'Completado'
                        : 'Pendiente'
                      : 'Disponible'}
                  </span>
                  <h2 className="font-extrabold text-lg text-primary dark:text-inverse-primary leading-tight truncate">
                    {selected.label}
                  </h2>
                  <p className="text-[10px] text-gray-400 dark:text-gray-300 font-bold uppercase tracking-wider mt-0.5">
                    {selected.type === 'checkpoint'
                      ? `Checkpoint ${selected.checkpointId}`
                      : selected.type === 'event'
                      ? 'Punto de Evento'
                      : 'Edificio de Interés'}
                  </p>
                </div>

                {/* Shimmer badge */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#fee269] to-[#D4BA46] text-[#1a1400] shadow-md flex items-center justify-center flex-shrink-0 border-2 border-white dark:border-[#0d1420]">
                  <span className="material-symbols-outlined text-xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {selected.type === 'checkpoint' ? 'workspace_premium' : selected.type === 'event' ? 'stars' : 'corporate_fare'}
                  </span>
                </div>
              </div>

              {/* Attributes grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-outline-variant/10">
                  <p className="text-[9px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-wide">
                    Recompensa
                  </p>
                  <p className="text-xs font-extrabold text-primary dark:text-[#fee269] flex items-center gap-1 mt-0.5 leading-none">
                    {selected.type === 'checkpoint' ? '50 XP' : 'Visita'}
                    <span className="material-symbols-outlined text-[13px] text-[#F7931E]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      bolt
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-outline-variant/10">
                  <p className="text-[9px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-wide">
                    Estado
                  </p>
                  <p
                    className={`text-xs font-extrabold mt-0.5 leading-none ${
                      isPOIUnlocked(selected) ? 'text-green-600 dark:text-green-400' : 'text-[#756300] dark:text-[#fee269]'
                    }`}
                  >
                    {isPOIUnlocked(selected) ? 'Desbloqueado' : 'Bloqueado'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed mb-6">
                {selected.description}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => alert(`Cómo llegar a: ${selected.label}`)}
                  className="flex-1 bg-gradient-to-r from-[#2C3E73] to-[#13275c] hover:brightness-110 text-white py-3 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">directions</span>
                  Cómo llegar
                </button>
                <button
                  onClick={() => alert(`Compartir: ${selected.label}`)}
                  className="w-12 h-12 flex items-center justify-center border border-outline-variant/20 text-[#2C3E73] dark:text-[#fee269] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm hover-scale-bounce"
                >
                  <span className="material-symbols-outlined text-lg">share</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

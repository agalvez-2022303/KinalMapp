'use client'

import { useState, useEffect } from 'react'
import { todayEvents } from '@/lib/kinal-data'
import Link from 'next/link'

function getEventTimeValue(time: string): number {
  if (time === 'Todo el día') return 0
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m || 0)
}

function isEventPast(time: string, now: Date): boolean {
  if (time === 'Todo el día') return false
  const [h, m] = time.split(':').map(Number)
  const eventDate = new Date(now)
  eventDate.setHours(h, m || 0, 0, 0)
  return now >= eventDate
}

function isEventActive(time: string, now: Date): boolean {
  if (time === 'Todo el día') return true
  const [h, m] = time.split(':').map(Number)
  const eventDate = new Date(now)
  eventDate.setHours(h, m || 0, 0, 0)
  const endDate = new Date(eventDate)
  endDate.setHours(endDate.getHours() + 1)
  return now >= eventDate && now < endDate
}

const colorMap: Record<string, string> = {
  gold: '#D4BA46',
  orange: '#F7931E',
  navy: '#2C3E73',
}

export default function HorarioPage() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  const sorted = [...todayEvents].sort((a, b) => getEventTimeValue(a.time) - getEventTimeValue(b.time))

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF2FF] to-[#E0E7FF] font-sans">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-indigo-100">
        <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-50 text-[#3B82F6] hover:bg-indigo-100 transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </Link>
          <h1 className="font-extrabold text-sm text-[#1E40AF] tracking-tight">Horario de Hoy</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
          {now.toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>

        {sorted.map((ev, i) => {
          const past = isEventPast(ev.time, now)
          const active = isEventActive(ev.time, now)

          return (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                active
                  ? 'bg-white ring-2 ring-[#3B82F6]/20 shadow-sm'
                  : past
                  ? 'bg-white/50 opacity-60'
                  : 'bg-white shadow-sm'
              }`}
            >
              {/* Check indicator */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                past
                  ? 'bg-[#22C55E] text-white'
                  : active
                  ? 'bg-[#3B82F6] text-white animate-pulse'
                  : 'bg-gray-100 text-gray-300'
              }`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {past ? 'check' : active ? 'schedule' : 'radio_button_unchecked'}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold leading-tight ${
                  past ? 'text-gray-400 line-through' : 'text-[#1E40AF]'
                }`}>
                  {ev.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-bold text-gray-400">{ev.time}</span>
                  <span className="text-[9px] text-gray-300">·</span>
                  <span className="text-[9px] font-bold text-[#3B82F6]">{ev.location}</span>
                  {active && (
                    <span className="text-[8px] font-bold text-[#22C55E] uppercase tracking-wider ml-auto">En curso</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}

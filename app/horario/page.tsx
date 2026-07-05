'use client'

import { useState, useEffect } from 'react'
import { todayEvents } from '@/lib/kinal-data'
import Link from 'next/link'

const colorMap: Record<string, string> = {
  gold: '#D4BA46',
  orange: '#F7931E',
  navy: '#2C3E73',
}

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

export default function HorarioPage() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  const sorted = [...todayEvents].sort((a, b) => getEventTimeValue(a.time) - getEventTimeValue(b.time))

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 bg-white/70 dark:bg-dark-navy/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_2px_12px_rgba(44,62,115,0.03)] z-10">
        <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline cursor-pointer bg-transparent border-none"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Inicio
          </Link>
          <h1 className="font-extrabold text-sm text-primary tracking-tight">Horario de Hoy</h1>
          <div className="w-14" />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full max-w-md mx-auto">
        <main className="px-container-margin py-5 space-y-3 pb-24">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {now.toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>

          {sorted.map((ev, i) => {
            const past = isEventPast(ev.time, now)
            const active = isEventActive(ev.time, now)
            const accent = colorMap[ev.color] || '#2c3e73'

            return (
              <div
                key={i}
                className={`bg-white p-4 rounded-2xl shadow-premium border border-outline-variant/10 border-l-4 hover-scale-bounce transition-all ${past ? 'opacity-55' : ''}`}
                style={{ borderLeftColor: accent }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 uppercase"
                    style={{ color: accent }}
                  >
                    {ev.time}
                  </span>
                  {active && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">En curso</span>
                    </span>
                  )}
                  {past && (
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Completado</span>
                  )}
                </div>
                <h4 className={`font-bold text-xs truncate ${past ? 'text-gray-400' : 'text-[#2c3e73]'}`}>
                  {ev.title}
                </h4>
                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-1 leading-none">
                  <span className="material-symbols-outlined text-[12px] text-gray-400">location_on</span>
                  {ev.location}
                </p>
              </div>
            )
          })}
        </main>
      </div>
    </div>
  )
}

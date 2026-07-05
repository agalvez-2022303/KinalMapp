'use client'

import { todayEvents, rewards } from '@/lib/kinal-data'
import type { View } from '@/lib/store'
import Link from 'next/link'

interface HomeViewProps {
  progressPercent: number
  unlockedStickers: number
  totalStickers: number
  onNavigate: (v: View) => void
  onReset: () => void
}

const colorMap: Record<string, string> = {
  gold: '#D4BA46',
  orange: '#F7931E',
  navy: '#2C3E73',
}

const borderClassMap: Record<string, string> = {
  gold: 'border-l-4 border-[#D4BA46]',
  orange: 'border-l-4 border-[#F7931E]',
  navy: 'border-l-4 border-[#2C3E73]',
}

export default function HomeView({
  progressPercent,
  unlockedStickers,
  totalStickers,
  onNavigate,
  onReset,
}: HomeViewProps) {
  const nextReward = rewards.find((r) => r.threshold > progressPercent)

  const handleReset = () => {
    if (window.confirm('¿Estás seguro que querés reiniciar el álbum? Se borrarán todas las estampas desbloqueadas.')) {
      onReset()
    }
  }

  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden font-sans">
      {/* TopAppBar - Glassmorphism style */}
      <header className="flex-shrink-0 bg-white/70 dark:bg-dark-navy/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_2px_12px_rgba(44,62,115,0.03)] z-10">
        <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
          <h1 className="font-extrabold text-xl tracking-tight text-primary dark:text-inverse-primary">
            Kinal<span className="text-[#D4BA46]">Mapp</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors cursor-pointer"
              title="Reiniciar álbum"
            >
              <span className="material-symbols-outlined text-gray-400 text-[18px]">refresh</span>
            </button>
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#fee269] to-[#D4BA46] px-3.5 py-1 rounded-full text-[#1a1400] shadow-[0_4px_12px_rgba(212,186,70,0.2)] font-bold text-xs select-none">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                emoji_events
              </span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Body */}
      <main className="flex-1 overflow-y-auto hide-scrollbar px-container-margin py-5 space-y-5 pb-24">
        {/* Progress Banner Card - Deep premium gradient */}
        <section className="bg-gradient-to-br from-[#1b2a4e] to-[#0f1830] text-white p-5 rounded-2xl shadow-glow-navy relative overflow-hidden animate-in fade-in slide-in-from-bottom duration-500 border border-white/5">
          {/* Decorative blur spotlights */}
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#fee269]/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#F7931E]/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] font-extrabold tracking-widest text-[#fee269] uppercase opacity-90">
                  ESTADO DE COLECCIÓN
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight mt-0.5">
                  {unlockedStickers}/{totalStickers} <span className="text-xs font-semibold text-gray-300">estampas</span>
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
                <span>Progreso del Álbum</span>
                <span>{progressPercent}%</span>
              </div>
            </div>

            <p className="font-medium text-[11px] text-gray-200 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-sm">
              {nextReward ? (
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#fee269] text-[14px]">stars</span>
                  ¡Sigue explorando para desbloquear más premios!
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[#fee269] font-bold">
                  <span className="material-symbols-outlined text-[14px]">emoji_events</span>
                  🏆 ¡Álbum Completado! Has recolectado todas las estampas.
                </span>
              )}
            </p>
          </div>
        </section>

        {/* Quick Actions 2x2 Bento Grid */}
        <section className="grid grid-cols-2 gap-3.5 animate-in fade-in slide-in-from-bottom duration-500 delay-100">
          {/* Map */}
          <button
            onClick={() => onNavigate('map')}
            className="flex flex-col items-start p-4 bg-white dark:bg-[#1a2340] rounded-2xl shadow-premium border border-outline-variant/10 hover-scale-bounce cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center mb-3 text-primary dark:text-[#b2beff] group-hover:bg-[#2C3E73] group-hover:text-white transition-colors duration-300">
              <span className="material-symbols-outlined text-[24px]">map</span>
            </div>
            <span className="font-extrabold text-xs text-[#2C3E73] dark:text-[#b2beff]">MAPA</span>
            <span className="text-[10px] text-gray-400 mt-0.5 font-medium leading-none">Ver campus y POIs</span>
          </button>

          {/* Scan */}
          <button
            onClick={() => onNavigate('scanner')}
            className="flex flex-col items-start p-4 bg-white dark:bg-[#1a2340] rounded-2xl shadow-premium border border-outline-variant/10 hover-scale-bounce cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center mb-3 text-[#F7931E] group-hover:bg-[#F7931E] group-hover:text-white transition-colors duration-300">
              <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
            </div>
            <span className="font-extrabold text-xs text-[#F7931E]">ESCANEAR</span>
            <span className="text-[10px] text-gray-400 mt-0.5 font-medium leading-none">Escanear código QR</span>
          </button>

          {/* Album */}
          <button
            onClick={() => onNavigate('album')}
            className="flex flex-col items-start p-4 bg-white dark:bg-[#1a2340] rounded-2xl shadow-premium border border-outline-variant/10 hover-scale-bounce cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 flex items-center justify-center mb-3 text-[#D4BA46] group-hover:bg-[#D4BA46] group-hover:text-white transition-colors duration-300">
              <span className="material-symbols-outlined text-[24px]">auto_awesome_motion</span>
            </div>
            <span className="font-extrabold text-xs text-[#D4BA46] dark:text-[#fee269]">ÁLBUM</span>
            <span className="text-[10px] text-gray-400 mt-0.5 font-medium leading-none">Colección de estampas</span>
          </button>

          {/* History */}
          <button
            onClick={() => onNavigate('historia')}
            className="flex flex-col items-start p-4 bg-white dark:bg-[#1a2340] rounded-2xl shadow-premium border border-outline-variant/10 hover-scale-bounce cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mb-3 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
              <span className="material-symbols-outlined text-[24px]">timeline</span>
            </div>
            <span className="font-extrabold text-xs text-emerald-500">HISTORIA</span>
            <span className="text-[10px] text-gray-400 mt-0.5 font-medium leading-none">Línea del tiempo</span>
          </button>
        </section>

        {/* Today's Events */}
        <section className="space-y-3 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-[#2C3E73] dark:text-white tracking-tight">Eventos de Hoy</h3>
            <Link 
              href="/horario"
              className="text-[10px] font-bold text-[#D4BA46] hover:underline cursor-pointer flex items-center gap-0.5"
            >
              Ver horario <span className="material-symbols-outlined text-[10px] font-bold">arrow_forward</span>
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 select-none">
            {todayEvents.map((ev, i) => (
              <div
                key={i}
                className={`min-w-[210px] bg-white dark:bg-[#1a2340] p-4 rounded-2xl shadow-premium border border-outline-variant/10 border-l-4 hover-scale-bounce transition-all`}
                style={{ borderLeftColor: colorMap[ev.color] || '#2c3e73' }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 dark:bg-white/5 uppercase" style={{ color: colorMap[ev.color] || '#2c3e73' }}>
                    {ev.time}
                  </span>
                  {/* Live Indicator Mock */}
                  {i === 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">En Curso</span>
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-xs text-[#2c3e73] dark:text-white truncate">
                  {ev.title}
                </h4>
                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-1 leading-none">
                  <span className="material-symbols-outlined text-[12px] text-gray-400">location_on</span>
                  {ev.location}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Reward Card */}
        {nextReward && (
          <section className="bg-white dark:bg-[#1a2340]/60 rounded-2xl p-4 border border-outline-variant/10 shadow-premium flex items-center gap-4 animate-in fade-in slide-in-from-bottom duration-500 delay-300 hover-scale-bounce">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gray-100 to-gray-50 dark:from-white/5 dark:to-white/10 flex items-center justify-center border border-dashed border-gray-300 dark:border-white/20 relative flex-shrink-0">
              <span className="material-symbols-outlined text-gray-400 text-[20px]">lock</span>
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#fee269] to-[#D4BA46] text-[#1a1400] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm">
                {nextReward.threshold}%
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-extrabold tracking-widest text-[#D4BA46] uppercase">
                Próximo Logro
              </span>
              <h4 className="font-bold text-xs text-[#2C3E73] dark:text-white truncate leading-tight mt-0.5">
                {nextReward.label}
              </h4>
              <div className="mt-2.5 space-y-1">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4BA46] to-[#F7931E] transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.round((progressPercent / nextReward.threshold) * 100))}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[8px] text-gray-400 font-medium">
                  <span>Objetivo: {nextReward.threshold}%</span>
                  <span>{Math.min(100, Math.round((progressPercent / nextReward.threshold) * 100))}%</span>
                </div>
              </div>
            </div>
            <span 
              onClick={() => onNavigate('album')}
              className="material-symbols-outlined text-gray-300 dark:text-white/20 hover:text-primary dark:hover:text-[#fee269] transition-colors cursor-pointer text-xl p-1 flex items-center justify-center"
            >
              chevron_right
            </span>
          </section>
        )}
      </main>
    </div>
  )
}

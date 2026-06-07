'use client'

import { todayEvents, rewards } from '@/lib/kinal-data'
import type { View } from '@/lib/store'

interface HomeViewProps {
  progressPercent: number
  unlockedStickers: number
  totalStickers: number
  onNavigate: (v: View) => void
}

const colorMap: Record<string, string> = {
  gold: '#6f5d00',
  orange: '#f99520',
  navy: '#13275c',
}

const borderClassMap: Record<string, string> = {
  gold: 'border-l-4 border-secondary-container',
  orange: 'border-l-4 border-on-tertiary-container',
  navy: 'border-l-4 border-primary',
}

export default function HomeView({
  progressPercent,
  unlockedStickers,
  totalStickers,
  onNavigate,
}: HomeViewProps) {
  const nextReward = rewards.find((r) => r.threshold > progressPercent)

  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden font-sans">
      {/* TopAppBar */}
      <header className="flex-shrink-0 bg-surface/70 dark:bg-dark-navy/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm">
        <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
          <h1 className="font-headline-lg text-headline-lg text-primary dark:text-inverse-primary tracking-tight">
            KinalMapp
          </h1>
          <div className="flex items-center gap-1 bg-secondary-container px-3 py-1 rounded-full text-on-secondary-container professional-shadow">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              military_tech
            </span>
            <span className="font-label-bold text-label-bold">{progressPercent}%</span>
          </div>
        </div>
      </header>

      {/* Scrollable Body */}
      <main className="flex-1 overflow-y-auto hide-scrollbar px-container-margin py-5 space-y-stack-lg pb-24">
        {/* Progress Banner Card */}
        <section className="bg-primary text-white p-stack-md rounded-xl floating-shadow relative overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
          {/* Decorative circle */}
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary-container rounded-full opacity-35"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-stack-sm">
              <div>
                <p className="font-label-bold text-[10px] tracking-widest text-on-primary-container opacity-80">
                  ESTADO DE COLECCIÓN
                </p>
                <h2 className="font-headline-md text-headline-md">
                  {unlockedStickers}/{totalStickers} stickers
                </h2>
              </div>
              <span className="material-symbols-outlined text-secondary-fixed text-[24px]">
                auto_awesome
              </span>
            </div>
            <div className="w-full h-2.5 bg-primary-container rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary-fixed gold-shimmer rounded-full relative transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-0 h-full w-2 bg-white/40 blur-sm"></div>
              </div>
            </div>
            <p className="mt-stack-sm font-label-sm text-[11px] text-on-primary-container opacity-90">
              {nextReward ? (
                '¡Sigue explorando para desbloquear más premios!'
              ) : (
                '🏆 ¡Álbum Completado! Has recolectado todas las estampas.'
              )}
            </p>
          </div>
        </section>

        {/* Quick Actions 2x2 Bento Grid */}
        <section className="grid grid-cols-2 gap-stack-md animate-in fade-in slide-in-from-bottom duration-500 delay-100">
          {/* Map */}
          <button
            onClick={() => onNavigate('map')}
            className="flex flex-col items-center justify-center p-stack-md bg-white dark:bg-dark-navy rounded-xl professional-shadow active:scale-95 transition-transform group cursor-pointer border border-outline-variant/10"
          >
            <div className="w-12 h-12 rounded-lg bg-surface-container dark:bg-primary-container/40 flex items-center justify-center mb-stack-sm text-primary dark:text-inverse-primary group-hover:bg-primary group-hover:text-white dark:group-hover:bg-inverse-primary dark:group-hover:text-dark-navy transition-colors">
              <span className="material-symbols-outlined text-[28px]">map</span>
            </div>
            <span className="font-label-bold text-label-bold text-on-surface dark:text-inverse-on-surface">MAPA</span>
          </button>

          {/* Scan */}
          <button
            onClick={() => onNavigate('scanner')}
            className="flex flex-col items-center justify-center p-stack-md bg-white dark:bg-dark-navy rounded-xl professional-shadow active:scale-95 transition-transform group cursor-pointer border border-outline-variant/10"
          >
            <div className="w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center mb-stack-sm text-on-secondary-container">
              <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
            </div>
            <span className="font-label-bold text-label-bold text-on-surface dark:text-inverse-on-surface">ESCANEAR</span>
          </button>

          {/* Album */}
          <button
            onClick={() => onNavigate('album')}
            className="flex flex-col items-center justify-center p-stack-md bg-white dark:bg-dark-navy rounded-xl professional-shadow active:scale-95 transition-transform group cursor-pointer border border-outline-variant/10"
          >
            <div className="w-12 h-12 rounded-lg bg-surface-container dark:bg-primary-container/40 flex items-center justify-center mb-stack-sm text-primary dark:text-inverse-primary group-hover:bg-primary group-hover:text-white dark:group-hover:bg-inverse-primary dark:group-hover:text-dark-navy transition-colors">
              <span className="material-symbols-outlined text-[28px]">auto_awesome_motion</span>
            </div>
            <span className="font-label-bold text-label-bold text-on-surface dark:text-inverse-on-surface">ÁLBUM</span>
          </button>

          {/* History */}
          <button
            onClick={() => onNavigate('historia')}
            className="flex flex-col items-center justify-center p-stack-md bg-white dark:bg-dark-navy rounded-xl professional-shadow active:scale-95 transition-transform group cursor-pointer border border-outline-variant/10"
          >
            <div className="w-12 h-12 rounded-lg bg-surface-container dark:bg-primary-container/40 flex items-center justify-center mb-stack-sm text-primary dark:text-inverse-primary group-hover:bg-primary group-hover:text-white dark:group-hover:bg-inverse-primary dark:group-hover:text-dark-navy transition-colors">
              <span className="material-symbols-outlined text-[28px]">timeline</span>
            </div>
            <span className="font-label-bold text-label-bold text-on-surface dark:text-inverse-on-surface">HISTORIA</span>
          </button>
        </section>

        {/* Today's Events */}
        <section className="space-y-stack-sm animate-in fade-in slide-in-from-bottom duration-500 delay-200">
          <div className="flex justify-between items-center mb-stack-sm">
            <h3 className="font-headline-md text-headline-md text-primary dark:text-inverse-primary">Eventos de Hoy</h3>
            <span 
              onClick={() => onNavigate('map')}
              className="font-label-bold text-label-bold text-secondary dark:text-secondary-fixed hover:underline cursor-pointer"
            >
              VER MAPA
            </span>
          </div>
          <div className="flex gap-stack-md overflow-x-auto hide-scrollbar pb-2">
            {todayEvents.map((ev, i) => (
              <div
                key={i}
                className={`min-w-[200px] bg-white dark:bg-dark-navy p-stack-sm rounded-xl professional-shadow ${
                  borderClassMap[ev.color] || 'border-l-4 border-primary'
                }`}
              >
                <p className="font-label-bold text-[10px] uppercase mb-1" style={{ color: colorMap[ev.color] || '#6f5d00' }}>
                  {ev.time}
                </p>
                <h4 className="font-body-lg font-bold text-on-surface dark:text-inverse-on-surface truncate">
                  {ev.title}
                </h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">
                  {ev.location}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Reward Card */}
        {nextReward && (
          <section className="bg-surface-container-low dark:bg-dark-navy/40 rounded-xl p-stack-md border border-outline-variant/30 flex items-center gap-stack-md animate-in fade-in slide-in-from-bottom duration-500 delay-300">
            <div className="w-16 h-16 rounded-full bg-surface-container dark:bg-primary-container/30 flex items-center justify-center border-2 border-dashed border-outline relative flex-shrink-0">
              <span className="material-symbols-outlined text-outline text-[24px]">lock</span>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {nextReward.threshold}%
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-headline-md text-headline-md text-primary dark:text-inverse-primary truncate">
                Próximo Logro
              </h4>
              <p className="font-body-md text-on-surface-variant dark:text-outline-variant leading-tight truncate">
                {nextReward.label}
              </p>
              <div className="mt-2 h-1.5 w-full bg-surface-container-highest dark:bg-primary-container/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary dark:bg-inverse-primary transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((progressPercent / nextReward.threshold) * 100))}%` }}
                ></div>
              </div>
            </div>
            <span 
              onClick={() => onNavigate('album')}
              className="material-symbols-outlined text-outline-variant hover:text-primary transition-colors cursor-pointer"
            >
              chevron_right
            </span>
          </section>
        )}
      </main>
    </div>
  )
}

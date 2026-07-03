'use client'

import { useState } from 'react'
import { useAppStore, type View } from '@/lib/store'
import BottomNav from '@/components/kinal/BottomNav'
import HomeView from '@/components/kinal/HomeView'
import MapView from '@/components/kinal/MapView'
import ScannerView from '@/components/kinal/ScannerView'
import AlbumView from '@/components/kinal/AlbumView'
import HistoriaView from '@/components/kinal/HistoriaView'

export default function KinalMapApp() {
  const [view, setView] = useState<View>('home')
  const {
    sections,
    unlockedCheckpoints,
    totalStickers,
    unlockedStickers,
    progressPercent,
    unlockCheckpoint,
    resetAlbum,
  } = useAppStore()

  return (
    <div className="showcase-grid-bg min-h-dvh h-dvh w-full flex items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* Desktop showcase backdrop & side panel */}
      <div className="hidden lg:flex flex-col justify-center max-w-sm mr-12 text-white space-y-6 select-none animate-in fade-in slide-in-from-left duration-700">
        <div className="space-y-2">
          <span className="px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-[#fee269] bg-[#2C3E73] rounded-full border border-[#fee269]/30 uppercase">
            Expo Kinal 2026
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">KinalMapp</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Explora el campus de forma interactiva. Escanea códigos QR para desbloquear estampas del álbum oficial y conoce el legado histórico de Kinal.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-bold text-[#fee269] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">info</span> Guía de Uso
          </h3>
          <ul className="text-xs text-gray-300 space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="text-[#fee269] font-bold">•</span>
              <span>Usa la sección de <strong>Mapa</strong> para orientarte en la exposición.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#fee269] font-bold">•</span>
              <span>Abre <strong>Escaneo</strong> y apunta al QR de prueba para ver el álbum completo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#fee269] font-bold">•</span>
              <span>Completa las 23 estampas para coleccionar logros especiales.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Phone Simulator Frame */}
      <div className="w-full h-full md:max-w-[412px] md:h-[844px] md:smartphone-simulator md:rounded-[40px] flex flex-col bg-background relative animate-in zoom-in-95 duration-500">
        {/* Smartphone camera notch */}
        <div className="hidden md:flex smartphone-camera-notch">
          <div className="smartphone-speaker"></div>
        </div>

        <div className="flex flex-col w-full h-full overflow-hidden pt-0 md:pt-4">
          {/* Main view area */}
          <main className="flex-1 overflow-hidden relative" style={{ background: '#f5f6fa' }}>
            {view === 'home' && (
              <HomeView
                progressPercent={progressPercent}
                unlockedStickers={unlockedStickers}
                totalStickers={totalStickers}
                onNavigate={setView}
                onReset={resetAlbum}
              />
            )}
            {view === 'map' && (
              <MapView unlockedCheckpoints={unlockedCheckpoints} />
            )}
            {view === 'scanner' && (
              <ScannerView
                unlockedCheckpoints={unlockedCheckpoints}
                onScan={unlockCheckpoint}
              />
            )}
            {view === 'album' && (
              <AlbumView
                sections={sections}
                progressPercent={progressPercent}
                unlockedStickers={unlockedStickers}
                totalStickers={totalStickers}
              />
            )}
            {view === 'historia' && (
              <HistoriaView />
            )}
          </main>

          {/* Bottom navigation */}
          <BottomNav current={view} onChange={setView} />
        </div>
      </div>
    </div>
  )
}

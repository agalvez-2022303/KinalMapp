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
  } = useAppStore()

  return (
    <div
      className="flex flex-col w-full bg-background"
      style={{ height: '100dvh', minHeight: '100dvh', overflow: 'hidden' }}
    >
      {/* Main view area */}
      <main className="flex-1 overflow-hidden relative" style={{ background: '#f5f6fa' }}>
        {view === 'home' && (
          <HomeView
            progressPercent={progressPercent}
            unlockedStickers={unlockedStickers}
            totalStickers={totalStickers}
            onNavigate={setView}
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
  )
}

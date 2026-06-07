'use client'

import type { View } from '@/lib/store'

interface BottomNavProps {
  current: View
  onChange: (v: View) => void
}

const tabs: { id: View; label: string; icon: string }[] = [
  { id: 'home',     label: 'Home',     icon: 'home' },
  { id: 'map',      label: 'Map',      icon: 'map' },
  { id: 'scanner',  label: 'Scan',     icon: 'qr_code_scanner' },
  { id: 'album',    label: 'Album',    icon: 'auto_awesome_motion' },
  { id: 'historia', label: 'Timeline', icon: 'timeline' },
]

export default function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav
      className="flex-shrink-0 w-full z-50 rounded-t-xl bg-white/80 dark:bg-dark-navy/90 backdrop-blur-lg border-t border-outline-variant/20 shadow-[0px_-4px_12px_rgba(44,62,115,0.08)]"
      style={{ height: '72px' }}
    >
      <div className="flex justify-around items-end pb-3 px-2 h-full w-full max-w-md mx-auto">
        {tabs.map(({ id, label, icon }) => {
          const isScanner = id === 'scanner'
          const isActive = current === id

          if (isScanner) {
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                aria-label={label}
                className="-mt-8 w-16 h-16 rounded-full bg-[#6f5d00] text-white border-4 border-white shadow-[0px_8px_24px_rgba(44,62,115,0.15)] active:scale-90 duration-200 flex items-center justify-center flex-shrink-0 cursor-pointer"
              >
                <span 
                  className="material-symbols-outlined text-[32px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>
              </button>
            )
          }

          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-label={label}
              className={`flex flex-col items-center justify-center transition-colors px-3 py-1.5 rounded-lg cursor-pointer ${
                isActive 
                  ? 'text-[#6f5d00] font-bold' 
                  : 'text-[#45464f] dark:text-[#c5c6d1] hover:bg-[#edeef2]/50 dark:hover:bg-[#1A2340]/50'
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px] mb-0.5"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              <span className="text-[10px] tracking-wide leading-none">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

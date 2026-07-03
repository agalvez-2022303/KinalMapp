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
      className="flex-shrink-0 w-full z-50 rounded-t-2xl bg-white/80 dark:bg-[#0d1420]/90 backdrop-blur-xl border-t border-outline-variant/15 shadow-[0px_-4px_20px_rgba(44,62,115,0.05)]"
      style={{ height: '76px' }}
    >
      <div className="flex justify-around items-end pb-3.5 px-3 h-full w-full max-w-md mx-auto select-none">
        {tabs.map(({ id, label, icon }) => {
          const isScanner = id === 'scanner'
          const isActive = current === id

          if (isScanner) {
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                aria-label={label}
                className="-mt-7 w-15 h-15 rounded-full bg-gradient-to-tr from-[#F7931E] to-[#D4BA46] text-white border-4 border-white dark:border-[#0d1420] shadow-[0px_8px_24px_rgba(247,147,30,0.3)] active:scale-90 hover:scale-105 duration-200 flex items-center justify-center flex-shrink-0 cursor-pointer relative"
              >
                {/* Scanner pulse glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F7931E]/20 to-[#D4BA46]/20 animate-ping -z-10 pointer-events-none"></div>
                <span 
                  className="material-symbols-outlined text-[28px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
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
              className={`flex flex-col items-center justify-center transition-all duration-200 px-3 py-1.5 rounded-xl cursor-pointer relative ${
                isActive 
                  ? 'text-[#2C3E73] dark:text-[#fee269] font-extrabold bg-[#2C3E73]/10 dark:bg-[#fee269]/10 scale-105' 
                  : 'text-[#5c5d66] dark:text-[#c5c6d1] hover:bg-gray-100/50 dark:hover:bg-[#1a2340]/40'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px] transition-all duration-200"
                style={{ 
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  transform: isActive ? 'translateY(-1px)' : 'translateY(0)'
                }}
              >
                {icon}
              </span>
              <span className="text-[9px] font-bold tracking-wide mt-0.5 leading-none">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

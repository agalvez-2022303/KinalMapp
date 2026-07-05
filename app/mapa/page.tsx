"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { todayEvents, searchRoom, getAllLevelPOIs as getAllFloorPOIs, getAllBuildings, getLevelById, getBuildingById, type FloorPlanPOI } from "@/lib/kinal-data"
import { calculateRoute, type RouteStep } from "@/lib/routing"

const FloorPlanMap = dynamic(() => import("@/components/kinal/FloorPlanMap"), {
  ssr: false,
})

function mapLocationToPOI(location: string): { poi: FloorPlanPOI; levelId: string; buildingId: string } | null {
  const result = searchRoom(location)
  if (result) return { poi: result.poi, levelId: result.level.id, buildingId: result.building.id }
  return null
}

function buildingColor(location: string): string {
  if (location.startsWith('I') || location.startsWith('C')) return '#2C3E73'
  if (location.startsWith('G') || location.startsWith('H')) return '#8B5CF6'
  return '#6B7280'
}

export default function MapaPage() {
  const [unlockedCheckpoints, setUnlockedCheckpoints] = useState<string[]>([])
  const [selectedPOI, setSelectedPOI] = useState<FloorPlanPOI | null>(null)
  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([])
  const [routeFrom, setRouteFrom] = useState<FloorPlanPOI | null>(null)
  const [showRouteSelector, setShowRouteSelector] = useState(false)

  const [mapTarget, setMapTarget] = useState<{ poi: FloorPlanPOI; levelId: string; buildingId: string } | null>(null)

  const allPOIs = getAllFloorPOIs()
  const entrancePOI = allPOIs.find(p => p.type === "entrance")

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kinalmap-checkpoints-v2")
      if (raw) setUnlockedCheckpoints(JSON.parse(raw))
    } catch {}
  }, [])

  const activeRoute = routeSteps.length > 0 && routeFrom && selectedPOI
    ? { from: routeFrom, to: selectedPOI, steps: routeSteps }
    : null

  const handleVerEnMapa = useCallback((location: string) => {
    const result = mapLocationToPOI(location)
    if (result) {
      setMapTarget(result)
      setSelectedPOI(result.poi)
      setRouteSteps([])
      setRouteFrom(null)
      setShowRouteSelector(false)
    }
  }, [])

  const handleCerrarMapa = useCallback(() => {
    setMapTarget(null)
    setSelectedPOI(null)
    setRouteSteps([])
    setRouteFrom(null)
    setShowRouteSelector(false)
  }, [])

  const handleComoLlegar = () => {
    setRouteFrom(entrancePOI || null)
    setShowRouteSelector(true)
    setRouteSteps([])
  }

  const handleTrazarRuta = () => {
    if (!routeFrom || !selectedPOI) return
    const steps = calculateRoute(routeFrom, selectedPOI)
    if (steps.length > 0) {
      setRouteSteps(steps)
      setShowRouteSelector(false)
    }
  }

  const handleClearRoute = () => {
    setRouteSteps([])
    setRouteFrom(null)
    setShowRouteSelector(false)
  }

  const floorNames: Record<string, string> = {}
  for (const b of getAllBuildings()) {
    for (const l of b.levels) floorNames[l.id] = l.name
  }

  const sorted = useMemo(() => {
    return [...todayEvents].sort((a, b) => {
      const aBuilding = a.location.charAt(0)
      const bBuilding = b.location.charAt(0)
      if (aBuilding !== bBuilding) return aBuilding.localeCompare(bBuilding)
      const aNum = parseInt(a.location.replace(/\D/g, ''), 10) || 0
      const bNum = parseInt(b.location.replace(/\D/g, ''), 10) || 0
      return aNum - bNum
    })
  }, [])

  return (
    <div className="showcase-grid-bg min-h-dvh h-dvh w-full flex items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* Desktop side panel */}
      <div className="hidden lg:flex flex-col justify-center max-w-sm mr-12 text-white space-y-6 select-none animate-in fade-in slide-in-from-left duration-700">
        <div className="space-y-2">
          <span className="px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-[#fee269] bg-[#2C3E73] rounded-full border border-[#fee269]/30 uppercase">
            Expo Kinal 2026
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Proyectos</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Lista completa de proyectos por salón. Tocá cualquier salón para verlo en el plano interactivo.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-bold text-[#fee269] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">map</span> Navegación
          </h3>
          <ul className="text-xs text-gray-300 space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="text-[#fee269] font-bold">•</span>
              <span>Elegí un proyecto para ver su ubicación en el plano.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#fee269] font-bold">•</span>
              <span>Usá <strong>Cómo llegar</strong> para trazar rutas entre salones.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#fee269] font-bold">•</span>
              <span>Los puntos verdes son checkpoints del álbum desbloqueados.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Phone Simulator Frame */}
      <div className="w-full h-full md:max-w-[412px] md:h-[844px] md:smartphone-simulator flex flex-col bg-background relative animate-in zoom-in-95 duration-500">
        <div className="hidden md:flex smartphone-camera-notch">
          <div className="smartphone-speaker"></div>
        </div>

        <div className="flex flex-col w-full h-full overflow-hidden pt-0 md:pt-4">
          {/* Header */}
          <header className="flex-shrink-0 bg-white/70 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm z-10">
            <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline cursor-pointer bg-transparent border-none"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Inicio
              </Link>
              <h1 className="font-extrabold text-sm text-primary tracking-tight">Proyectos</h1>
              <div className="w-14" />
            </div>
          </header>

          {/* Content — always list */}
          <main className="flex-1 overflow-y-auto" style={{ background: '#f5f6fa' }}>
            <div className="px-container-margin py-5 space-y-3 pb-24 max-w-md mx-auto">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Expo Kinal 2026 — Proyectos
              </p>

              {sorted.map((ev, i) => {
                const locationInfo = mapLocationToPOI(ev.location)
                const accent = locationInfo ? buildingColor(ev.location) : '#9CA3AF'

                return (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-2xl shadow-premium border border-outline-variant/10 border-l-4 hover-scale-bounce transition-all flex items-center gap-3"
                    style={{ borderLeftColor: accent }}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-[#2c3e73] truncate">
                        {ev.title} <span className="text-gray-400 font-medium">— {ev.location}</span>
                      </h4>
                    </div>
                    <button
                      onClick={() => handleVerEnMapa(ev.location)}
                      disabled={!locationInfo}
                      className={`flex-shrink-0 px-3.5 py-2 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition-all border-none ${
                        locationInfo
                          ? 'bg-primary text-white cursor-pointer'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">map</span>
                      Ver mapa
                    </button>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>

      {/* Full-screen map overlay */}
      {mapTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full h-full md:max-w-[412px] md:h-[844px] md:rounded-[40px] md:smartphone-simulator relative">
            <div className="hidden md:flex smartphone-camera-notch">
              <div className="smartphone-speaker"></div>
            </div>

            {/* Map overlay header */}
            <div className="absolute top-0 left-0 right-0 z-[10000] flex items-center justify-between px-4 h-14 bg-white/80 backdrop-blur-md border-b border-outline-variant/20 md:pt-4 md:rounded-t-[40px]">
              <button
                onClick={handleCerrarMapa}
                className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline cursor-pointer bg-transparent border-none"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Volver
              </button>
              <span className="font-extrabold text-sm text-primary tracking-tight">
                {mapTarget.poi.label}
              </span>
              <div className="w-14" />
            </div>

            {/* Floor label badge */}
            <div className="absolute top-[60px] left-1/2 -translate-x-1/2 z-[10000] bg-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-[0.7rem] font-semibold text-primary whitespace-nowrap">
              <span className="material-symbols-outlined text-sm text-tertiary">location_on</span>
              {getBuildingById(mapTarget.buildingId)?.name} — {getLevelById(mapTarget.levelId)?.name}
            </div>

            {/* Route selector panel */}
            {showRouteSelector && selectedPOI && (
              <div className="absolute bottom-5 left-4 right-4 p-4 rounded-2xl bg-white shadow-xl border border-outline-variant/10 z-[10000]">
                <p className="font-extrabold text-sm text-[#1a2340] mb-3">Trazar ruta</p>
                <div className="mb-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Desde</label>
                  <select
                    value={routeFrom?.id || ""}
                    onChange={(e) => {
                      const poi = allPOIs.find(p => p.id === e.target.value)
                      setRouteFrom(poi || null)
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 text-xs font-bold text-[#1a2340] bg-gray-50 outline-none"
                  >
                    {allPOIs.filter(p => p.id !== selectedPOI.id).map(poi => (
                      <option key={poi.id} value={poi.id}>{poi.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Hasta</label>
                  <div className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/30 text-xs font-bold text-[#1a2340] bg-gray-100">
                    {selectedPOI.label}
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <button
                    onClick={handleTrazarRuta}
                    disabled={!routeFrom}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border-none ${
                      routeFrom ? 'bg-primary text-white cursor-pointer' : 'bg-gray-300 text-white cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">route</span>
                    Trazar ruta
                  </button>
                  <button
                    onClick={() => setShowRouteSelector(false)}
                    className="px-4 py-3 rounded-xl border border-outline-variant/30 bg-white text-gray-500 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Route steps panel */}
            {routeSteps.length > 0 && !showRouteSelector && (
              <div className="absolute bottom-5 left-4 right-4 p-3.5 rounded-2xl bg-white shadow-xl border border-outline-variant/10 z-[10000] max-h-[200px] overflow-y-auto">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="font-extrabold text-xs text-tertiary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">route</span>
                    Ruta activa
                  </span>
                  <button
                    onClick={handleClearRoute}
                    className="text-[10px] font-bold text-gray-400 hover:text-gray-600 cursor-pointer bg-none border-none"
                  >
                    Limpiar
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {routeSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <div
                        className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                        style={{
                          background: step.type === "stairs" ? "#9CA3AF" : step.type === "arrival" ? "#22C55E" : "#2C3E73",
                        }}
                      />
                      <span className="text-gray-600 leading-tight">
                        {step.label || floorNames[step.levelId] || step.levelId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* POI detail popup */}
            {selectedPOI && !showRouteSelector && routeSteps.length === 0 && (
              <div className="absolute bottom-5 left-4 right-4 p-4 rounded-2xl bg-white shadow-xl border border-outline-variant/10 z-[10000]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-base text-white flex-shrink-0">
                      {selectedPOI.type === "entrance" ? (
                        <span className="material-symbols-outlined text-lg">door_front</span>
                      ) : selectedPOI.type === "stairs" ? (
                        <span className="material-symbols-outlined text-lg">stairs</span>
                      ) : (
                        <span className="material-symbols-outlined text-lg">bolt</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#1a2340]">{selectedPOI.label}</p>
                      <p className="text-xs text-gray-500">{selectedPOI.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPOI(null)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer bg-none border-none text-lg"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleComoLlegar}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border-none"
                  >
                    <span className="material-symbols-outlined text-sm">near_me</span>
                    Cómo llegar
                  </button>
                </div>
              </div>
            )}

            <FloorPlanMap
              key={`${mapTarget.buildingId}-${mapTarget.levelId}`}
              unlockedCheckpoints={unlockedCheckpoints}
              selectedPOI={selectedPOI}
              onSelectPOI={(poi) => {
                setSelectedPOI(poi)
                if (poi && activeRoute) handleClearRoute()
              }}
              route={activeRoute}
              navBuildingId={mapTarget.buildingId}
              navFloorId={mapTarget.levelId}
            />
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { todayEvents, searchRoom, getAllLevelPOIs, getBuildingFromId, getAllBuildings, getLevelById, getBuildingById, type FloorPlanPOI } from "@/lib/kinal-data"
import { calculateRoute, type RouteStep } from "@/lib/routing"
import dynamic from "next/dynamic"
import NavigationGuide from "./NavigationGuide"

const FloorPlanMap = dynamic(() => import("./FloorPlanMap"), {
  ssr: false,
})

interface MapViewProps {
  unlockedCheckpoints: string[]
}

type RouteMode = "idle" | "selecting" | "active" | "navigating"

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

export default function MapView({ unlockedCheckpoints }: MapViewProps) {
  const [mapTarget, setMapTarget] = useState<{ poi: FloorPlanPOI; levelId: string; buildingId: string } | null>(null)
  const [selectedPOI, setSelectedPOI] = useState<FloorPlanPOI | null>(null)
  const [routeMode, setRouteMode] = useState<RouteMode>("idle")
  const [routeFrom, setRouteFrom] = useState<FloorPlanPOI | null>(null)
  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([])
  const [currentNavStep, setCurrentNavStep] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [navFloorId, setNavFloorId] = useState<string>("pb")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const routeStepsRef = useRef(routeSteps)
  routeStepsRef.current = routeSteps

  const allPOIs = useMemo(() => getAllLevelPOIs(), [])
  const entrancePOI = useMemo(() => allPOIs.find((p) => p.type === "entrance"), [allPOIs])

  const activeRoute = useMemo(() => {
    if (routeMode !== "active" && routeMode !== "navigating") return null
    if (!routeFrom || !selectedPOI || routeSteps.length === 0) return null
    return { from: routeFrom, to: selectedPOI, steps: routeSteps }
  }, [routeMode, routeFrom, selectedPOI, routeSteps])

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

  const handleVerEnMapa = useCallback((location: string) => {
    const result = mapLocationToPOI(location)
    if (result) {
      setMapTarget(result)
      setSelectedPOI(result.poi)
      setRouteSteps([])
      setRouteFrom(null)
      setRouteMode("idle")
    }
  }, [])

  const handleCerrarMapa = useCallback(() => {
    setMapTarget(null)
    setSelectedPOI(null)
    setRouteSteps([])
    setRouteFrom(null)
    setRouteMode("idle")
    setCurrentNavStep(0)
    setNavFloorId("")
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleComoLlegar = useCallback(() => {
    setRouteFrom(entrancePOI || null)
    setRouteMode("selecting")
    setRouteSteps([])
  }, [entrancePOI])

  const handleTrazarRuta = useCallback(() => {
    if (!routeFrom || !selectedPOI) return
    const steps = calculateRoute(routeFrom, selectedPOI)
    if (steps.length > 0) {
      setRouteSteps(steps)
      setRouteMode("active")
    }
  }, [routeFrom, selectedPOI])

  const handleClearRoute = useCallback(() => {
    setRouteSteps([])
    setRouteMode("idle")
    setRouteFrom(null)
    setCurrentNavStep(0)
    setNavFloorId("")
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleSelectPOI = useCallback((poi: FloorPlanPOI | null) => {
    if (routeMode !== "idle" && routeMode !== "selecting") {
      handleClearRoute()
    }
    setSelectedPOI(poi)
  }, [routeMode, handleClearRoute])

  const handleStartNavigation = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setRouteMode("navigating")
    setCurrentNavStep(0)
    const firstStep = routeStepsRef.current[0]
    if (firstStep) setNavFloorId(firstStep.levelId)
    const steps = routeStepsRef.current
    if (steps.length < 2) return
    timerRef.current = setInterval(() => {
      setCurrentNavStep((prev) => {
        const next = prev + 1
        if (next >= steps.length - 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          timerRef.current = null
        }
        const step = steps[next]
        if (step) setNavFloorId(step.levelId)
        return next
      })
    }, 3000)
  }, [])

  const handlePauseNavigation = useCallback(() => {
    setIsPaused((p) => {
      if (p) {
        timerRef.current = setInterval(() => {
          setCurrentNavStep((prev) => {
            const next = prev + 1
            if (next >= routeSteps.length - 1) {
              if (timerRef.current) clearInterval(timerRef.current)
              timerRef.current = null
            }
            const step = routeSteps[next]
            if (step) setNavFloorId(step.levelId)
            return next
          })
        }, 3000)
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
      return !p
    })
  }, [routeSteps])

  const handleStopNavigation = useCallback(() => {
    handleClearRoute()
  }, [handleClearRoute])

  const floorNames = useMemo(() => {
    const names: Record<string, string> = {}
    for (const b of getAllBuildings()) {
      for (const l of b.levels) names[l.id] = l.name
    }
    return names
  }, [])

  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden font-sans">
      <header className="flex-shrink-0 bg-white/70 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm z-10">
        <div className="flex items-center justify-between px-4 h-14 w-full max-w-md mx-auto">
          <h1 className="font-extrabold text-xl tracking-tight text-primary">
            Kinal<span className="text-[#D4BA46]">Mapp</span>
          </h1>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Proyectos
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto" style={{ background: '#f5f6fa' }}>
        <div className="px-4 py-5 space-y-3 pb-24 max-w-md mx-auto">
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

      {mapTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full h-full md:max-w-[412px] md:h-[844px] md:rounded-[40px] md:smartphone-simulator relative bg-white">
            <div className="absolute top-0 left-0 right-0 z-[10000] flex items-center justify-between px-4 h-14 bg-white/80 backdrop-blur-md border-b border-outline-variant/20 md:rounded-t-[40px]">
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

            <div className="absolute top-[60px] left-1/2 -translate-x-1/2 z-[10000] bg-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-[0.7rem] font-semibold text-primary whitespace-nowrap">
              <span className="material-symbols-outlined text-sm text-tertiary">location_on</span>
              {getBuildingById(mapTarget.buildingId)?.name} — {getLevelById(mapTarget.levelId)?.name}
            </div>

            {routeMode === "navigating" && routeSteps.length > 0 && (
              <NavigationGuide
                steps={routeSteps}
                from={routeFrom!}
                to={selectedPOI!}
                currentStepIndex={currentNavStep}
                onStop={handleStopNavigation}
                onPause={handlePauseNavigation}
                isPaused={isPaused}
              />
            )}

            {routeMode === "active" && routeSteps.length > 0 && (
              <div className="absolute top-28 left-4 right-4 z-[10000] flex justify-center">
                <button
                  onClick={handleStartNavigation}
                  className="bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:brightness-110 text-white py-3 px-6 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                  Iniciar navegación guiada
                </button>
              </div>
            )}

            {routeMode === "selecting" && selectedPOI && (
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
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-outline-variant/30 text-xs font-bold text-[#1a2340] outline-none"
                    size={4}
                  >
                    {(() => {
                      const grouped: Record<string, FloorPlanPOI[]> = {}
                      for (const p of allPOIs) {
                        if (p.id === selectedPOI.id) continue
                        const b = getBuildingFromId(p.id)
                        ;(grouped[b] ??= []).push(p)
                      }
                      return Object.entries(grouped).map(([building, pois]) => (
                        <optgroup key={building} label={building}>
                          {pois.map(poi => (
                            <option key={poi.id} value={poi.id}>{poi.label} – {poi.id}</option>
                          ))}
                        </optgroup>
                      ))
                    })()}
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
                    onClick={() => { setRouteMode("idle"); setRouteFrom(null) }}
                    className="px-4 py-3 rounded-xl border border-outline-variant/30 bg-white text-gray-500 font-bold text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {routeSteps.length > 0 && routeMode !== "navigating" && routeMode !== "selecting" && (
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

            {selectedPOI && routeMode === "idle" && routeSteps.length === 0 && mapTarget && (
              <div className="absolute bottom-5 left-4 right-4 p-4 rounded-2xl bg-white shadow-xl border border-outline-variant/10 z-[10000]">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-base text-white flex-shrink-0">
                      <span className="material-symbols-outlined text-lg">bolt</span>
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

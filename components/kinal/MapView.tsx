"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import { getAllFloorPOIs, floorPlans, getBuildingFromId, type FloorPlanPOI } from "@/lib/kinal-data"
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

export default function MapView({ unlockedCheckpoints }: MapViewProps) {
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

  const allPOIs = useMemo(() => getAllFloorPOIs(), [])

  const entrancePOI = useMemo(
    () => allPOIs.find((p) => p.type === "entrance"),
    [allPOIs]
  )

  const activeRoute = useMemo(() => {
    if (routeMode !== "active" && routeMode !== "navigating") return null
    if (!routeFrom || !selectedPOI || routeSteps.length === 0) return null
    return { from: routeFrom, to: selectedPOI, steps: routeSteps }
  }, [routeMode, routeFrom, selectedPOI, routeSteps])

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
    setNavFloorId("pb")
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
    setNavFloorId(firstStep?.floorPlanId || "pb")

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
        if (step) {
          setNavFloorId(step.floorPlanId)
        }
        return next
      })
    }, 3000)
  }, [])

  const handlePauseNavigation = useCallback(() => {
    setIsPaused((p) => {
      if (p) {
        // Resume
        timerRef.current = setInterval(() => {
          setCurrentNavStep((prev) => {
            const next = prev + 1
            if (next >= routeSteps.length - 1) {
              if (timerRef.current) clearInterval(timerRef.current)
              timerRef.current = null
            }
            const step = routeSteps[next]
            if (step) setNavFloorId(step.floorPlanId)
            return next
          })
        }, 3000)
      } else {
        // Pause
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

  const floorNames: Record<string, string> = {
    pb: "Planta Baja",
    p2: "Piso 2",
    p3: "Piso 3",
  }

  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden font-sans">
      <header className="flex-shrink-0 bg-white/70 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm z-10">
        <div className="flex items-center justify-between px-4 h-14 w-full max-w-md mx-auto">
          <h1 className="font-extrabold text-xl tracking-tight text-primary">
            Kinal<span className="text-[#D4BA46]">Mapp</span>
          </h1>
          {routeMode !== "idle" && routeMode !== "selecting" && (
            <button
              onClick={handleClearRoute}
              className="text-xs font-bold text-[#F7931E] flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-none"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Limpiar ruta
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 relative w-full max-w-md mx-auto overflow-hidden map-bg-gradient">
        <FloorPlanMap
          unlockedCheckpoints={unlockedCheckpoints}
          selectedPOI={selectedPOI}
          onSelectPOI={handleSelectPOI}
          route={activeRoute}
          navFloorId={routeMode === "navigating" ? navFloorId : undefined}
          onNavFloorChange={routeMode === "navigating" ? setNavFloorId : undefined}
        />

        {/* Navigation Guide */}
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

        {/* Route steps indicator (when route is calculated but not navigating) */}
        {routeMode === "active" && routeSteps.length > 0 && (
          <div className="absolute top-16 left-4 right-4 z-20 max-h-[160px] overflow-y-auto hide-scrollbar fade-in-up">
            <div className="bg-white/95 glass-panel rounded-xl p-3 shadow-md border border-outline-variant/15">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#F7931E] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">route</span>
                  Ruta lista
                </div>
                <span className="text-[8px] font-bold text-gray-400">
                  {routeFrom?.label} – {routeFrom?.id} → {selectedPOI?.label} – {selectedPOI?.id}
                </span>
              </div>
              <div className="space-y-1.5 max-h-[80px] overflow-y-auto hide-scrollbar">
                {routeSteps.map((step, i) => {
                  const isLast = i === routeSteps.length - 1
                  return (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="flex flex-col items-center gap-0.5 mt-0.5">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          step.type === "stairs" ? "bg-[#9CA3AF]" :
                          isLast ? "bg-[#22C55E]" :
                          "bg-[#F7931E]"
                        }`} />
                        {!isLast && <span className="w-0.5 h-3 bg-gray-200 rounded-full" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-gray-700 leading-tight block">
                          {step.label || floorNames[step.floorPlanId] || step.floorPlanId}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Start navigation button */}
              <button
                onClick={handleStartNavigation}
                className="mt-3 w-full bg-gradient-to-r from-[#F7931E] to-[#e07e0a] hover:brightness-110 text-white py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                Iniciar navegación
              </button>
            </div>
          </div>
        )}

        {/* POI Detail Bottom Sheet */}
        {selectedPOI && routeMode !== "navigating" && (
          <div className="absolute bottom-0 left-0 right-0 z-[400] bg-white/95 backdrop-blur-xl rounded-t-[28px] shadow-[0px_-8px_30px_rgba(44,62,115,0.15)] border-t border-outline-variant/20 animate-in slide-in-from-bottom duration-300 pointer-events-auto">
            <div
              className="w-full flex justify-center py-3.5 cursor-pointer"
              onClick={() => setSelectedPOI(null)}
            >
              <div className="w-12 h-1.5 rounded-full bg-gray-300" />
            </div>

            <div className="px-6 pb-8 text-on-surface select-none max-h-[60vh] overflow-y-auto">
              {routeMode === "selecting" ? (
                <>
                  <h3 className="font-extrabold text-sm text-primary mb-4">
                    Trazar ruta
                  </h3>
                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Desde
                      </label>
                      <select
                        value={routeFrom?.id || ""}
                        onChange={(e) => {
                          const poi = allPOIs.find((p) => p.id === e.target.value)
                          setRouteFrom(poi || null)
                        }}
                        className="w-full p-3 rounded-xl bg-gray-50 border border-outline-variant/15 text-xs font-bold text-primary outline-none"
                        size={6}
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
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Hasta
                      </label>
                      <div className="w-full p-3 rounded-xl bg-[#2C3E73]/5 border border-outline-variant/15 text-xs font-bold text-primary">
                        {selectedPOI.label} – {selectedPOI.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleTrazarRuta}
                      disabled={!routeFrom}
                      className="flex-1 bg-gradient-to-r from-[#2C3E73] to-[#13275c] hover:brightness-110 text-white py-3 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">route</span>
                      Trazar ruta
                    </button>
                    <button
                      onClick={() => { setRouteMode("idle"); setRouteFrom(null) }}
                      className="px-5 py-3 rounded-xl border border-outline-variant/20 text-xs font-bold text-gray-500 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer bg-transparent"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider mb-1 px-2.5 py-0.5 rounded-full bg-[#2C3E73]/10 text-[#2C3E73]">
                        <span className="material-symbols-outlined text-[12px] font-bold">
                          {selectedPOI.type === "entrance" ? "door_front" : selectedPOI.type === "stairs" ? "stairs" : "check_circle"}
                        </span>
                        {selectedPOI.type === "entrance" ? "Entrada" : selectedPOI.type === "stairs" ? "Escaleras" : "Checkpoint"}
                      </span>
                      <h2 className="font-extrabold text-lg text-primary leading-tight truncate">
                        {selectedPOI.label}
                      </h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                        {selectedPOI.id} · {getBuildingFromId(selectedPOI.id)}
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#fee269] to-[#D4BA46] text-[#1a1400] shadow-md flex items-center justify-center flex-shrink-0 border-2 border-white">
                      <span className="material-symbols-outlined text-xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {selectedPOI.type === "entrance" ? "door_front" : "workspace_premium"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-2xl border border-outline-variant/10">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                        Ubicación
                      </p>
                      <p className="text-xs font-extrabold text-primary mt-0.5 leading-none">
                        {floorPlans.find((fp) => fp.id === selectedPOI.floorPlanId)?.name || selectedPOI.floorPlanId}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl border border-outline-variant/10">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                        Tipo
                      </p>
                      <p className="text-xs font-extrabold text-primary mt-0.5 leading-none">
                        {selectedPOI.type === "checkpoint" ? "Proyecto" : selectedPOI.type === "entrance" ? "Acceso" : "Conexión"}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    {selectedPOI.description}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleComoLlegar}
                      className="flex-1 bg-gradient-to-r from-[#2C3E73] to-[#13275c] hover:brightness-110 text-white py-3 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">directions</span>
                      Cómo llegar
                    </button>
                    <button
                      onClick={() => setSelectedPOI(null)}
                      className="w-12 h-12 flex items-center justify-center border border-outline-variant/20 text-[#2C3E73] hover:bg-gray-50 rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        {routeMode !== "navigating" && (
          <div className="absolute top-20 right-4 z-10 w-32 glass-premium rounded-2xl p-3 border border-outline-variant/25 shadow-md select-none pointer-events-none">
            <h4 className="text-[10px] font-extrabold text-[#2C3E73] mb-2 uppercase tracking-widest leading-none">
              Leyenda
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase leading-none">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fee269] border border-white shadow-sm"></span> Proyecto
              </li>
              <li className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase leading-none">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] border border-white shadow-sm"></span> Completado
              </li>
              <li className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase leading-none">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2C3E73] border border-white shadow-sm"></span> Entrada
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

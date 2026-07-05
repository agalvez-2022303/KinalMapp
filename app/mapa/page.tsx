"use client"

import { useState, useEffect } from "react"
import MobileFrame from "@/components/kinal/MobileFrame"
import dynamic from "next/dynamic"
import { getAllLevelPOIs as getAllFloorPOIs, getAllBuildings, type FloorPlanPOI } from "@/lib/kinal-data"
import { calculateRoute, type RouteStep } from "@/lib/routing"

const FloorPlanMap = dynamic(() => import("@/components/kinal/FloorPlanMap"), {
  ssr: false,
})

export default function MapaPage() {
  const [unlockedCheckpoints, setUnlockedCheckpoints] = useState<string[]>([])
  const [selectedPOI, setSelectedPOI] = useState<FloorPlanPOI | null>(null)
  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([])
  const [routeFrom, setRouteFrom] = useState<FloorPlanPOI | null>(null)
  const [showRouteSelector, setShowRouteSelector] = useState(false)

  const allPOIs = getAllFloorPOIs()
  const entrancePOI = allPOIs.find(p => p.type === "entrance")

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kinalmap-checkpoints-v1")
      if (raw) {
        setUnlockedCheckpoints(JSON.parse(raw))
      }
    } catch {}
  }, [])

  const activeRoute = routeSteps.length > 0 && routeFrom && selectedPOI
    ? { from: routeFrom, to: selectedPOI, steps: routeSteps }
    : null

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
  // Build level name lookup from all buildings
  for (const b of getAllBuildings()) {
    for (const l of b.levels) floorNames[l.id] = l.name
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e0e0e0",
        padding: "20px 0",
      }}
    >
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <MobileFrame>
        <div
          style={{
            background: "#ffffff",
            zIndex: 10,
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            flexShrink: 0,
          }}
        >
          <header
            style={{
              padding: "20px 20px 10px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <i className="fa-solid fa-bars" style={{ color: "#2C3E73", fontSize: "1.2rem" }} />
            <span style={{ color: "#2C3E73", fontWeight: 800, fontSize: "1.1rem" }}>
              Mapa Kinal
            </span>
            <div
              style={{
                width: 35,
                height: 35,
                borderRadius: 10,
                background: "#2C3E73",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="fa-solid fa-location-dot" style={{ color: "#D4BA46", fontSize: "0.9rem" }} />
            </div>
          </header>

          <div style={{ padding: "10px 20px" }}>
            <div
              style={{
                background: "#eeeff1",
                padding: "12px 15px",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#757575",
              }}
            >
              <i className="fa-solid fa-magnifying-glass" />
              <input
                type="text"
                placeholder="Buscar aulas, talleres..."
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.9rem",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            flexGrow: 1,
            backgroundColor: "#dcdde1",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FloorPlanMap
            unlockedCheckpoints={unlockedCheckpoints}
            selectedPOI={selectedPOI}
            onSelectPOI={(poi) => {
              setSelectedPOI(poi)
              if (poi && activeRoute) handleClearRoute()
            }}
            route={activeRoute}
          />

          {/* Info tooltip */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#ffffff",
              padding: "8px 16px",
              borderRadius: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#2C3E73",
              whiteSpace: "nowrap",
              zIndex: 1000,
            }}
          >
            <i className="fa-solid fa-location-dot" style={{ color: "#F7931E" }} />
            Campus Kinal
          </div>

          {/* Route selector panel */}
          {showRouteSelector && selectedPOI && (
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 15,
                right: 15,
                padding: "16px",
                borderRadius: "16px",
                background: "#ffffff",
                boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                border: "1px solid rgba(0,0,0,0.07)",
                zIndex: 1000,
              }}
            >
              <p style={{ fontWeight: 800, fontSize: "0.85rem", color: "#1a2340", marginBottom: 12 }}>
                Trazar ruta
              </p>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: "0.65rem", fontWeight: 700, color: "#999", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                  Desde
                </label>
                <select
                  value={routeFrom?.id || ""}
                  onChange={(e) => {
                    const poi = allPOIs.find(p => p.id === e.target.value)
                    setRouteFrom(poi || null)
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #e0e0e0",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#1a2340",
                    background: "#f8f8f8",
                    outline: "none",
                  }}
                >
                  {allPOIs.filter(p => p.id !== selectedPOI.id).map(poi => (
                    <option key={poi.id} value={poi.id}>{poi.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: "0.65rem", fontWeight: 700, color: "#999", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                  Hasta
                </label>
                <div style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #e0e0e0",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#1a2340",
                  background: "#f0f2f8",
                }}>
                  {selectedPOI.label}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleTrazarRuta}
                  disabled={!routeFrom}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 10,
                    border: "none",
                    background: routeFrom ? "#2C3E73" : "#ccc",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    cursor: routeFrom ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <i className="fa-solid fa-route"></i>
                  Trazar ruta
                </button>
                <button
                  onClick={() => setShowRouteSelector(false)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "1px solid #e0e0e0",
                    background: "#fff",
                    color: "#666",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Route steps panel */}
          {routeSteps.length > 0 && !showRouteSelector && (
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 15,
                right: 15,
                padding: "14px",
                borderRadius: "16px",
                background: "#ffffff",
                boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                border: "1px solid rgba(0,0,0,0.07)",
                zIndex: 1000,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#F7931E", display: "flex", alignItems: "center", gap: 6 }}>
                  <i className="fa-solid fa-route"></i>
                  Ruta activa
                </span>
                <button
                  onClick={handleClearRoute}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#999",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  Limpiar
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {routeSteps.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: "0.72rem" }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", marginTop: 3, flexShrink: 0,
                      background: step.type === "stairs" ? "#9CA3AF" : step.type === "arrival" ? "#22C55E" : "#2C3E73",
                    }} />
                    <span style={{ color: "#555", lineHeight: 1.3 }}>
                      {step.label || floorNames[step.levelId] || step.levelId}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* POI detail popup */}
          {selectedPOI && !showRouteSelector && routeSteps.length === 0 && (
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 15,
                right: 15,
                padding: "16px",
                borderRadius: "16px",
                background: "#ffffff",
                boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
                border: "1px solid rgba(0,0,0,0.07)",
                zIndex: 1000,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "#2C3E73",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      color: "#fff",
                    }}
                  >
                    {selectedPOI.type === "entrance" ? "🚪" : selectedPOI.type === "stairs" ? "⬆" : "⚡"}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.9rem", color: "#1a2340" }}>{selectedPOI.label}</p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#666" }}>{selectedPOI.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPOI(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    color: "#999",
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button
                  onClick={handleComoLlegar}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "none",
                    background: "#2C3E73",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <i className="fa-solid fa-location-arrow"></i>
                  Cómo llegar
                </button>
              </div>
            </div>
          )}
        </div>
      </MobileFrame>
    </main>
  )
}

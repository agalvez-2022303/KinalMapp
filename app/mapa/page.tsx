"use client"

import { useState, useEffect } from "react"
import MobileFrame from "@/components/kinal/MobileFrame"
import dynamic from "next/dynamic"

const KinalMap = dynamic(() => import("@/components/kinal/KinalMap"), {
  ssr: false,
})

const CHIPS = ["Todos", "Checkpoints", "Eventos", "Edificios"] as const

type ChipType = typeof CHIPS[number]

export default function MapaPage() {
  const [activeChip, setActiveChip] = useState<ChipType>("Todos")
  const [unlockedCheckpoints, setUnlockedCheckpoints] = useState<string[]>([])
  const [selectedPOI, setSelectedPOI] = useState<any>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('kinalmap-checkpoints-v1')
      if (raw) {
        setUnlockedCheckpoints(JSON.parse(raw))
      }
    } catch {}
  }, [])

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
        {/* Top layer */}
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

          {/* Search */}
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

          {/* Filter chips */}
          <div
            className="hide-scrollbar"
            style={{
              display: "flex",
              gap: 10,
              padding: "10px 20px 15px 20px",
              overflowX: "auto",
            }}
          >
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: "none",
                  background: activeChip === chip ? "#2C3E73" : "#eeeff1",
                  color: activeChip === chip ? "#ffffff" : "#333",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Map Canvas */}
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
          <KinalMap
            unlockedCheckpoints={unlockedCheckpoints}
            filter={activeChip}
            selectedPOI={selectedPOI}
            onSelectPOI={setSelectedPOI}
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

          {/* POI detail popup */}
          {selectedPOI && (
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
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "rgba(44, 62, 115, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    {selectedPOI.type === 'checkpoint' ? '⚡' : selectedPOI.type === 'event' ? '★' : '🏢'}
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

              {selectedPOI.type === 'checkpoint' && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    background: unlockedCheckpoints.includes(selectedPOI.checkpointId || '')
                      ? "rgba(34, 197, 94, 0.12)"
                      : "rgba(212, 186, 70, 0.12)",
                    color: unlockedCheckpoints.includes(selectedPOI.checkpointId || '')
                      ? "#16a34a"
                      : "#92750a",
                  }}
                >
                  {unlockedCheckpoints.includes(selectedPOI.checkpointId || '')
                    ? '✓ Checkpoint escaneado — Estampas desbloqueadas'
                    : '⬡ Escanea el código QR de este checkpoint para obtener estampas'}
                </div>
              )}
            </div>
          )}
        </div>
      </MobileFrame>
    </main>
  )
}

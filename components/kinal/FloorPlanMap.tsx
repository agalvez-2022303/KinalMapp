"use client"

import { useEffect, useState, useMemo } from "react"
import { MapContainer, ImageOverlay, Marker, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import { floorPlans, getAllFloorPOIs, type FloorPlan, type FloorPlanPOI } from "@/lib/kinal-data"
import { type RouteStep } from "@/lib/routing"
import "leaflet/dist/leaflet.css"

interface FloorPlanMapProps {
  unlockedCheckpoints: string[]
  selectedPOI: FloorPlanPOI | null
  onSelectPOI: (poi: FloorPlanPOI | null) => void
  route: { from: FloorPlanPOI; to: FloorPlanPOI; steps: RouteStep[] } | null
}

function MapBoundsController({ floor }: { floor: FloorPlan }) {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds([0, 0], [floor.height, floor.width])
    map.fitBounds(bounds, { padding: [10, 10], animate: true })
  }, [floor, map])
  return null
}

interface MarkerData {
  id: string
  label: string
  pos: L.LatLngTuple
  type: string
  isSelected: boolean
  isUnlocked: boolean
}

function FloorMarkers({
  pois,
  selectedPOI,
  onSelectPOI,
  unlockedCheckpoints,
  imgWidth,
  imgHeight,
}: {
  pois: FloorPlanPOI[]
  selectedPOI: FloorPlanPOI | null
  onSelectPOI: (poi: FloorPlanPOI | null) => void
  unlockedCheckpoints: string[]
  imgWidth: number
  imgHeight: number
}) {
  const markers: MarkerData[] = useMemo(() => {
    return pois.map((poi) => ({
      id: poi.id,
      label: poi.label,
      pos: [(poi.y / 100) * imgHeight, (poi.x / 100) * imgWidth] as L.LatLngTuple,
      type: poi.type,
      isSelected: selectedPOI?.id === poi.id,
      isUnlocked: poi.type === 'entrance' || (poi.checkpointId ? unlockedCheckpoints.includes(poi.checkpointId) : false),
    }))
  }, [pois, selectedPOI, unlockedCheckpoints, imgWidth, imgHeight])

  return (
    <>
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={m.pos}
          icon={getPOIIcon(m)}
          eventHandlers={{
            click: () => {
              const poi = pois.find((p) => p.id === m.id)
              if (poi) onSelectPOI(selectedPOI?.id === poi.id ? null : poi)
            },
          }}
        />
      ))}
    </>
  )
}

function getPOIIcon(marker: MarkerData): L.DivIcon {
  let bgColor = "#2C3E73"
  let iconText = "📍"
  let pulseHtml = ""

  if (marker.type === "checkpoint") {
    if (marker.isUnlocked) {
      bgColor = "#22C55E"
      iconText = "✓"
      pulseHtml =
        '<div class="absolute w-10 h-10 rounded-full bg-[#22C55E]/20 marker-pulse pointer-events-none z-0"></div>'
    } else {
      bgColor = "#fee269"
      iconText = "⬡"
      pulseHtml =
        '<div class="absolute w-10 h-10 rounded-full bg-[#fee269]/25 animate-ping pointer-events-none z-0"></div>'
    }
  } else if (marker.type === "entrance") {
    bgColor = "#2C3E73"
    iconText = "🚪"
  } else if (marker.type === "stairs") {
    bgColor = "#9CA3AF"
    iconText = "⬆"
  }

  const borderStyle = marker.isSelected
    ? "border: 3.5px solid #ffffff; transform: scale(1.2); box-shadow: 0 0 16px #D4BA46; z-index: 100;"
    : "border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(44,62,115,0.15);"

  const iconColor =
    marker.type === "checkpoint" && !marker.isUnlocked ? "#756300" : "#ffffff"

  return new L.DivIcon({
    html: `
      <div class="relative flex items-center justify-center w-10 h-10">
        ${pulseHtml}
        <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 text-[11px] font-extrabold" style="background-color: ${bgColor}; ${borderStyle}; color: ${iconColor};">
          ${iconText}
        </div>
      </div>
    `,
    className: "custom-leaflet-marker-wrapper",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

function RouteOverlay({
  route,
  floorId,
  floor,
}: {
  route: { from: FloorPlanPOI; to: FloorPlanPOI; steps: RouteStep[] } | null
  floorId: string
  floor: FloorPlan
}) {
  const map = useMap()

  const floorSteps = useMemo(() => {
    if (!route) return []
    const steps: [number, number][] = []
    for (const step of route.steps) {
      if (step.floorPlanId === floorId) {
        const lat = (step.y / 100) * floor.height
        const lng = (step.x / 100) * floor.width
        if (steps.length === 0 || steps[steps.length - 1][0] !== lat || steps[steps.length - 1][1] !== lng) {
          steps.push([lat, lng])
        }
      }
    }
    return steps
  }, [route, floorId, floor])

  useEffect(() => {
    if (floorSteps.length > 0) {
      const bounds = L.latLngBounds(floorSteps.map(([y, x]) => [y, x]))
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], animate: true, maxZoom: 1 })
      }
    }
  }, [floorSteps, map])

  if (floorSteps.length < 2) return null

  return (
    <Polyline
      positions={floorSteps}
      pathOptions={{
        color: "#F7931E",
        weight: 4,
        opacity: 0.85,
        dashArray: "10, 8",
        lineCap: "round",
        lineJoin: "round",
      }}
    />
  )
}

function MapControls({ floor }: { floor: FloorPlan }) {
  const map = useMap()
  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        right: 16,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <button
        onClick={() => {
          const bounds = L.latLngBounds([0, 0], [floor.height, floor.width])
          map.fitBounds(bounds, { padding: [10, 10], animate: true })
        }}
        className="w-12 h-12 rounded-xl bg-white/90 glass-panel shadow-md flex items-center justify-center text-[#13275c] active:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
        title="Centrar"
      >
        <span className="material-symbols-outlined text-[22px]">my_location</span>
      </button>
      <button
        onClick={() => map.zoomIn()}
        className="w-12 h-12 rounded-xl bg-white/90 glass-panel shadow-md flex items-center justify-center text-[#13275c] active:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
        title="Acercar"
      >
        <span className="material-symbols-outlined text-[22px]">add</span>
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-12 h-12 rounded-xl bg-white/90 glass-panel shadow-md flex items-center justify-center text-[#13275c] active:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
        title="Alejar"
      >
        <span className="material-symbols-outlined text-[22px]">remove</span>
      </button>
    </div>
  )
}

const FLOOR_TABS = floorPlans.map((fp) => ({ id: fp.id, name: fp.name }))

export default function FloorPlanMap({
  unlockedCheckpoints,
  selectedPOI,
  onSelectPOI,
  route,
}: FloorPlanMapProps) {
  const [activeFloorId, setActiveFloorId] = useState(floorPlans[0].id)

  const activeFloor = useMemo(
    () => floorPlans.find((fp) => fp.id === activeFloorId) || floorPlans[0],
    [activeFloorId]
  )

  const floorPOIs = useMemo(
    () => activeFloor.pois,
    [activeFloor]
  )

  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        className="absolute top-4 left-4 right-4 z-[1000] flex justify-center pointer-events-none"
      >
        <div className="flex gap-1 bg-white/95 dark:bg-[#0d1420]/95 glass-panel rounded-xl p-1 shadow-md pointer-events-auto">
          {FLOOR_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFloorId(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                activeFloorId === tab.id
                  ? "bg-[#2C3E73] text-white shadow-sm scale-105"
                  : "bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <MapContainer
        center={[activeFloor.height / 2, activeFloor.width / 2]}
        zoom={-1}
        zoomControl={false}
        attributionControl={false}
        crs={L.CRS.Simple}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        zoomSnap={0}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={60}
      >
        <ImageOverlay
          url={activeFloor.image}
          bounds={[
            [0, 0],
            [activeFloor.height, activeFloor.width],
          ]}
        />

        <MapBoundsController floor={activeFloor} />

        <FloorMarkers
          pois={floorPOIs}
          selectedPOI={selectedPOI}
          onSelectPOI={onSelectPOI}
          unlockedCheckpoints={unlockedCheckpoints}
          imgWidth={activeFloor.width}
          imgHeight={activeFloor.height}
        />

        <RouteOverlay route={route} floorId={activeFloorId} floor={activeFloor} />

        <MapControls floor={activeFloor} />
      </MapContainer>
    </div>
  )
}

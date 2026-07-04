"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { MapContainer, ImageOverlay, Polyline, CircleMarker, useMap, ZoomControl, type PaneProps } from "react-leaflet"
import L from "leaflet"
import { floorPlans, type FloorPlan, type FloorPlanPOI } from "@/lib/kinal-data"
import { type RouteStep } from "@/lib/routing"
import "leaflet/dist/leaflet.css"

interface FloorPlanMapProps {
  unlockedCheckpoints: string[]
  selectedPOI: FloorPlanPOI | null
  onSelectPOI: (poi: FloorPlanPOI | null) => void
  route: { from: FloorPlanPOI; to: FloorPlanPOI; steps: RouteStep[] } | null
  navFloorId?: string
  onNavFloorChange?: (id: string) => void
}

// ─── Room Overlay (SVG rects in the overlayPane) ──────────────────────────

function RoomOverlay({ floor }: { floor: FloorPlan }) {
  const map = useMap()
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    svg.style.position = "absolute"
    svg.style.top = "0"
    svg.style.left = "0"
    svg.style.pointerEvents = "none"

    const overlayPane = map.getPanes().overlayPane
    overlayPane.appendChild(svg)

    return () => {
      if (svg.parentNode) svg.parentNode.removeChild(svg)
    }
  }, [map, floor])

  return (
    <svg
      ref={svgRef}
      width={floor.width}
      height={floor.height}
      viewBox={`0 0 ${floor.width} ${floor.height}`}
    >
      {floor.rooms.map((room) => (
        <rect
          key={room.id}
          x={(room.x / 100) * floor.width}
          y={(room.y / 100) * floor.height}
          width={(room.width / 100) * floor.width}
          height={(room.height / 100) * floor.height}
          fill={room.color}
          fillOpacity={0.12}
          stroke={room.color}
          strokeWidth={1.5}
          strokeOpacity={0.4}
          rx={3}
        />
      ))}
      {floor.rooms.map((room) => (
        <text
          key={`text-${room.id}`}
          x={((room.x + room.width / 2) / 100) * floor.width}
          y={((room.y + room.height / 2) / 100) * floor.height}
          textAnchor="middle"
          dominantBaseline="central"
          fill={room.color}
          fillOpacity={0.2}
          fontSize={Math.min(floor.width, floor.height) * 0.04}
          fontWeight={800}
          fontFamily="system-ui, sans-serif"
        >
          {room.label}
        </text>
      ))}
    </svg>
  )
}

// ─── Map Bounds Controller ───────────────────────────────────────────────

function MapBoundsController({ floor }: { floor: FloorPlan }) {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds([0, 0], [floor.height, floor.width])
    map.fitBounds(bounds, { padding: [10, 10], animate: true })
  }, [floor, map])
  return null
}

// ─── POI Marker Component ────────────────────────────────────────────────

function getPOIIcon(
  id: string,
  label: string,
  type: string,
  color: string,
  isSelected: boolean,
  isUnlocked: boolean,
  imgWidth: number,
  imgHeight: number
): L.DivIcon {
  const dotColor = type === "entrance" ? "#9CA3AF"
    : type === "stairs" ? "#6B7280"
    : isUnlocked ? "#22C55E"
    : color

  const pulseHtml = isSelected
    ? '<div class="poi-dot-pulse"></div>'
    : ""

  const selectedClass = isSelected ? "selected" : ""

  return new L.DivIcon({
    html: `
      <div class="poi-marker ${selectedClass}" style="--dot-color: ${dotColor}">
        <div class="poi-badge">${id}</div>
        ${pulseHtml}
        <div class="poi-dot" style="background: ${dotColor};"></div>
        <div class="poi-label">${label}</div>
      </div>
    `,
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

const POI_COLORS: Record<string, string> = {
  C11: "#F7931E", C12: "#D4BA46", C13: "#F7931E",
  C14: "#F7931E", C15: "#F7931E", I12: "#F7931E",
  C20: "#D4BA46", G21: "#8B5CF6",
  C31: "#2C3E73", C32: "#2C3E73", C33: "#2C3E73",
  C36: "#22C55E", C37: "#22C55E", C38: "#22C55E",
  G35: "#8B5CF6", G36: "#8B5CF6", H32: "#8B5CF6", H33: "#8B5CF6", H34: "#8B5CF6",
}

function FloorMarkers({
  pois,
  selectedPOI,
  onSelectPOI,
  unlockedCheckpoints,
  floor,
}: {
  pois: FloorPlanPOI[]
  selectedPOI: FloorPlanPOI | null
  onSelectPOI: (poi: FloorPlanPOI | null) => void
  unlockedCheckpoints: string[]
  floor: FloorPlan
}) {
  const markers = useMemo(() => {
    return pois.map((poi) => {
      const color = POI_COLORS[poi.id] || "#2C3E73"
      const isUnlocked = poi.type === "entrance" || (poi.checkpointId ? unlockedCheckpoints.includes(poi.checkpointId) : false)
      return {
        id: poi.id,
        label: poi.label,
        type: poi.type,
        color,
        pos: [(poi.y / 100) * floor.height, (poi.x / 100) * floor.width] as L.LatLngTuple,
        isSelected: selectedPOI?.id === poi.id,
        isUnlocked,
      }
    })
  }, [pois, selectedPOI, unlockedCheckpoints, floor])

  const handleClick = useCallback((poiId: string) => {
    const poi = pois.find((p) => p.id === poiId)
    if (poi) onSelectPOI(selectedPOI?.id === poi.id ? null : poi)
  }, [pois, onSelectPOI, selectedPOI])

  return (
    <>
      {markers.map((m) => {
        const icon = getPOIIcon(m.id, m.label, m.type, m.color, m.isSelected, m.isUnlocked, floor.width, floor.height)
        return (
          <Marker key={m.id} position={m.pos} icon={icon} eventHandlers={{ click: () => handleClick(m.id) }} />
        )
      })}
    </>
  )
}

function Marker({ position, icon, eventHandlers }: {
  position: L.LatLngTuple
  icon: L.DivIcon
  eventHandlers: { click: () => void }
}) {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    const marker = L.marker(position, { icon })
    marker.on("click", eventHandlers.click)
    marker.addTo(map)
    markerRef.current = marker

    return () => {
      marker.off("click", eventHandlers.click)
      marker.remove()
    }
  }, [map, position, icon, eventHandlers])

  return null
}

// ─── Animated Route Overlay ──────────────────────────────────────────────

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

  const stepsLen = floorSteps.length

  return (
    <>
      {/* Glow line (behind) */}
      <Polyline
        positions={floorSteps}
        pathOptions={{
          color: "#F7931E",
          weight: 12,
          opacity: 0.15,
          lineCap: "round",
          lineJoin: "round",
          className: "route-glow",
        }}
      />
      {/* Solid base line */}
      <Polyline
        positions={floorSteps}
        pathOptions={{
          color: "#F7931E",
          weight: 6,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }}
      />
      {/* Animated dashes */}
      <Polyline
        positions={floorSteps}
        pathOptions={{
          color: "#fee269",
          weight: 3,
          opacity: 0.9,
          dashArray: "12, 16",
          lineCap: "round",
          lineJoin: "round",
          className: "route-dash-animated",
        }}
      />
      {/* Start marker */}
      <CircleMarker
        center={floorSteps[0]}
        radius={10}
        pathOptions={{ color: "#22C55E", fillColor: "#22C55E", fillOpacity: 1, weight: 3 }}
      />
      <CircleMarker
        center={floorSteps[0]}
        radius={4}
        pathOptions={{ color: "#fff", fillColor: "#fff", fillOpacity: 1, weight: 0 }}
      />
      {/* End marker */}
      <CircleMarker
        center={floorSteps[stepsLen - 1]}
        radius={10}
        pathOptions={{ color: "#EF4444", fillColor: "#EF4444", fillOpacity: 1, weight: 3 }}
      />
      <CircleMarker
        center={floorSteps[stepsLen - 1]}
        radius={4}
        pathOptions={{ color: "#fff", fillColor: "#fff", fillOpacity: 1, weight: 0 }}
      />
    </>
  )
}

// ─── Floor Selector ──────────────────────────────────────────────────────

const FLOOR_TABS = floorPlans.map((fp) => ({ id: fp.id, name: fp.name }))

function FloorSelector({
  activeFloorId,
  onChange,
}: {
  activeFloorId: string
  onChange: (id: string) => void
}) {
  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-center pointer-events-none">
      <div className="flex gap-1 bg-white/95 glass-panel rounded-xl p-1 shadow-md pointer-events-auto border border-outline-variant/20">
        {FLOOR_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-[11px] font-bold transition-all duration-300 cursor-pointer ${
              activeFloorId === tab.id
                ? "floor-tab-active"
                : "bg-transparent text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Map Controls ────────────────────────────────────────────────────────

function MapControls({ floor }: { floor: FloorPlan }) {
  const map = useMap()

  return (
    <div className="absolute bottom-[140px] right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => {
          const bounds = L.latLngBounds([0, 0], [floor.height, floor.width])
          map.fitBounds(bounds, { padding: [10, 10], animate: true })
        }}
        className="w-11 h-11 rounded-xl bg-white/90 glass-panel shadow-md flex items-center justify-center text-[#13275c] hover:bg-white active:scale-95 transition-all cursor-pointer border border-outline-variant/20"
        title="Centrar"
      >
        <span className="material-symbols-outlined text-[20px]">my_location</span>
      </button>
    </div>
  )
}

// ─── Navigation Simulator (animated "you are here" dot) ──────────────────

interface NavSimulatorProps {
  active: boolean
  route: { from: FloorPlanPOI; to: FloorPlanPOI; steps: RouteStep[] } | null
  floorId: string
  floor: FloorPlan
}

function NavSimulator({ active, route, floorId, floor }: NavSimulatorProps) {
  const map = useMap()
  const markerRef = useRef<L.CircleMarker | null>(null)
  const rippleRef = useRef<L.CircleMarker | null>(null)
  const animRef = useRef<number>(0)
  const stepIndexRef = useRef(0)
  const progressRef = useRef(0)
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null)

  const floorPositions = useMemo(() => {
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
    if (!active || floorPositions.length < 2) return

    // Create the "you are here" marker
    const startPos = floorPositions[0]
    const marker = L.circleMarker(startPos, {
      radius: 10,
      color: "#3B82F6",
      fillColor: "#3B82F6",
      fillOpacity: 0.9,
      weight: 3,
    })
    marker.addTo(map)
    markerRef.current = marker

    const ripple = L.circleMarker(startPos, {
      radius: 20,
      color: "#3B82F6",
      fillColor: "#3B82F6",
      fillOpacity: 0.2,
      weight: 2,
      className: "nav-ripple",
    })
    ripple.addTo(map)
    rippleRef.current = ripple

    setCurrentPos(startPos)

    return () => {
      if (markerRef.current) { marker.remove(); markerRef.current = null }
      if (rippleRef.current) { ripple.remove(); rippleRef.current = null }
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [active, floorPositions, map])

  return null
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function FloorPlanMap({
  unlockedCheckpoints,
  selectedPOI,
  onSelectPOI,
  route,
  navFloorId,
  onNavFloorChange,
}: FloorPlanMapProps) {
  const [activeFloorId, setActiveFloorId] = useState(floorPlans[0].id)
  const [fadeKey, setFadeKey] = useState(0)

  const resolvedFloorId = navFloorId || activeFloorId

  const activeFloor = useMemo(
    () => floorPlans.find((fp) => fp.id === resolvedFloorId) || floorPlans[0],
    [resolvedFloorId]
  )

  const floorPOIs = useMemo(() => activeFloor.pois, [activeFloor])

  const handleFloorChange = useCallback((id: string) => {
    setFadeKey((k) => k + 1)
    setActiveFloorId(id)
    if (onNavFloorChange) onNavFloorChange(id)
  }, [onNavFloorChange])

  // Load Leaflet CSS
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  return (
    <div className="w-full h-full relative map-bg-gradient">
      <FloorSelector activeFloorId={resolvedFloorId} onChange={handleFloorChange} />

      <MapContainer
        center={[activeFloor.height / 2, activeFloor.width / 2]}
        zoom={-1}
        zoomControl={false}
        attributionControl={false}
        crs={L.CRS.Simple}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        zoomSnap={0.25}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={80}
        minZoom={-3}
        maxZoom={3}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        key={fadeKey}
      >
        <ZoomControl position="bottomright" />
        <ImageOverlay
          url={activeFloor.image}
          bounds={[[0, 0], [activeFloor.height, activeFloor.width]]}
        />

        <RoomOverlay floor={activeFloor} />
        <MapBoundsController floor={activeFloor} />

        <FloorMarkers
          pois={floorPOIs}
          selectedPOI={selectedPOI}
          onSelectPOI={onSelectPOI}
          unlockedCheckpoints={unlockedCheckpoints}
          floor={activeFloor}
        />

        <RouteOverlay route={route} floorId={resolvedFloorId} floor={activeFloor} />

        <NavSimulator
          active={route !== null && resolvedFloorId === activeFloor.id}
          route={route}
          floorId={resolvedFloorId}
          floor={activeFloor}
        />

        <MapControls floor={activeFloor} />
      </MapContainer>
    </div>
  )
}

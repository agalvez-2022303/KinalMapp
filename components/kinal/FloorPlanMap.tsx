"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { MapContainer, ImageOverlay, Polyline, CircleMarker, useMap, ZoomControl } from "react-leaflet"
import L from "leaflet"
import { buildings, getAllBuildings, getAllLevels, getLevelById, getBuildingById, searchRoom, BUILDING_BOUNDS, type BuildingLevel, type FloorPlanPOI, type Building } from "@/lib/kinal-data"
import { type RouteStep } from "@/lib/routing"
import "leaflet/dist/leaflet.css"

interface FloorPlanMapProps {
  unlockedCheckpoints: string[]
  selectedPOI: FloorPlanPOI | null
  onSelectPOI: (poi: FloorPlanPOI | null) => void
  route: { from: FloorPlanPOI; to: FloorPlanPOI; steps: RouteStep[] } | null
  navFloorId?: string
  onNavFloorChange?: (id: string) => void
  navBuildingId?: string
  onNavBuildingChange?: (id: string) => void
}

// ─── Soft blue & orange palette ──────────────────────────────────────────

const BLUE = "#3B82F6"
const BLUE_LIGHT = "#DBEAFE"
const BLUE_MEDIUM = "#93C5FD"
const ORANGE = "#FB923C"
const ORANGE_LIGHT = "#FFF7ED"
const ORANGE_MEDIUM = "#FDBA74"
const GREEN = "#22C55E"

const ROOM_COLORS: Record<string, string> = {
  "C-12": BLUE, "C-13": ORANGE, "C-14": ORANGE, "C-15": ORANGE, "I-12": ORANGE,
  "C-20": BLUE, "G-21": BLUE,
  "C-31": BLUE, "C-32": BLUE, "C-33": BLUE,
  "C-36": BLUE, "C-37": BLUE, "C-38": BLUE,
  "G-35": BLUE, "G-36": BLUE, "H-32": BLUE, "H-33": BLUE, "H-34": BLUE,
  default: BLUE,
}

function getRoomColor(id: string): string {
  return ROOM_COLORS[id] || ROOM_COLORS.default
}

// ─── Room Overlay ────────────────────────────────────────────────────────

function RoomOverlay({ level }: { level: BuildingLevel }) {
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
  }, [map, level])

  return (
    <svg ref={svgRef} width={level.width} height={level.height} viewBox={`0 0 ${level.width} ${level.height}`}>
      {level.rooms.map((room) => (
        <rect
          key={room.id}
          x={room.x}
          y={room.y}
          width={room.width}
          height={room.height}
          fill={BLUE}
          fillOpacity={0.08}
          stroke={BLUE}
          strokeWidth={1.2}
          strokeOpacity={0.25}
          rx={3}
        />
      ))}
      {level.rooms.map((room) => (
        <text
          key={`text-${room.id}`}
          x={room.x + room.width / 2}
          y={room.y + room.height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#1E40AF"
          fillOpacity={0.6}
          fontSize={Math.min(level.width, level.height) * 0.035}
          fontWeight={700}
          fontFamily="system-ui, sans-serif"
        >
          {room.label}
        </text>
      ))}
    </svg>
  )
}

// ─── Map Bounds Controller ───────────────────────────────────────────────

function MapBoundsController({ levelId, level }: { levelId: string; level: BuildingLevel }) {
  const map = useMap()
  useEffect(() => {
    const boundsRecord = BUILDING_BOUNDS[levelId]
    if (boundsRecord) {
      const bounds = L.latLngBounds(
        [boundsRecord.y, boundsRecord.x],
        [boundsRecord.y + boundsRecord.height, boundsRecord.x + boundsRecord.width]
      )
      map.fitBounds(bounds, { padding: [20, 20], animate: true })
    } else {
      const bounds = L.latLngBounds([0, 0], [level.height, level.width])
      map.fitBounds(bounds, { padding: [10, 10], animate: true })
    }
  }, [levelId, level, map])
  return null
}

// ─── POI Marker ──────────────────────────────────────────────────────────

function getPOIIcon(
  id: string,
  label: string,
  type: string,
  color: string,
  isSelected: boolean,
  isUnlocked: boolean,
): L.DivIcon {
  const dotColor = type === "entrance" ? "#9CA3AF"
    : type === "stairs" ? "#6B7280"
    : isUnlocked ? GREEN
    : color

  const pulseHtml = isSelected ? '<div class="poi-dot-pulse"></div>' : ""
  const selectedClass = isSelected ? "selected" : ""

  return new L.DivIcon({
    html: `
      <div class="poi-marker ${selectedClass}" style="--dot-color: ${dotColor}">
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

function FloorMarkers({
  pois,
  selectedPOI,
  onSelectPOI,
  unlockedCheckpoints,
}: {
  pois: FloorPlanPOI[]
  selectedPOI: FloorPlanPOI | null
  onSelectPOI: (poi: FloorPlanPOI | null) => void
  unlockedCheckpoints: string[]
  level: BuildingLevel
}) {
  const markers = useMemo(() => {
    return pois.map((poi) => {
      const color = getRoomColor(poi.id)
      const isUnlocked = poi.type === "entrance" || (poi.checkpointId ? unlockedCheckpoints.includes(poi.checkpointId) : false)
      return {
        id: poi.id,
        label: poi.label,
        type: poi.type,
        color,
        pos: [poi.y, poi.x] as L.LatLngTuple,
        isSelected: selectedPOI?.id === poi.id,
        isUnlocked,
      }
    })
  }, [pois, selectedPOI, unlockedCheckpoints])

  const handleClick = useCallback((poiId: string) => {
    const poi = pois.find((p) => p.id === poiId)
    if (poi) onSelectPOI(selectedPOI?.id === poi.id ? null : poi)
  }, [pois, onSelectPOI, selectedPOI])

  return (
    <>
      {markers.map((m) => {
        const icon = getPOIIcon(m.id, m.label, m.type, m.color, m.isSelected, m.isUnlocked)
        return <Marker key={m.id} position={m.pos} icon={icon} eventHandlers={{ click: () => handleClick(m.id) }} />
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

// ─── Route Overlay ───────────────────────────────────────────────────────

function RouteOverlay({
  route,
  levelId,
}: {
  route: { from: FloorPlanPOI; to: FloorPlanPOI; steps: RouteStep[] } | null
  levelId: string
}) {
  const map = useMap()

  const levelSteps = useMemo(() => {
    if (!route) return []
    const steps: [number, number][] = []
    for (const step of route.steps) {
      if (step.levelId === levelId) {
        const lat = step.y
        const lng = step.x
        if (steps.length === 0 || steps[steps.length - 1][0] !== lat || steps[steps.length - 1][1] !== lng) {
          steps.push([lat, lng])
        }
      }
    }
    return steps
  }, [route, levelId])

  useEffect(() => {
    if (levelSteps.length > 0) {
      const bounds = L.latLngBounds(levelSteps.map(([y, x]) => [y, x]))
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], animate: true, maxZoom: 1 })
      }
    }
  }, [levelSteps, map])

  if (levelSteps.length < 2) return null

  const stepsLen = levelSteps.length

  return (
    <>
      <Polyline
        positions={levelSteps}
        pathOptions={{ color: BLUE, weight: 12, opacity: 0.1, lineCap: "round", lineJoin: "round" }}
      />
      <Polyline
        positions={levelSteps}
        pathOptions={{ color: BLUE, weight: 5, opacity: 0.8, lineCap: "round", lineJoin: "round" }}
      />
      <Polyline
        positions={levelSteps}
        pathOptions={{ color: BLUE_LIGHT, weight: 2.5, opacity: 0.9, dashArray: "10, 14", lineCap: "round", lineJoin: "round", className: "route-dash-animated" }}
      />
      <CircleMarker center={levelSteps[0]} radius={8} pathOptions={{ color: ORANGE, fillColor: ORANGE, fillOpacity: 1, weight: 3 }} />
      <CircleMarker center={levelSteps[0]} radius={3} pathOptions={{ color: "#fff", fillColor: "#fff", fillOpacity: 1, weight: 0 }} />
      <CircleMarker center={levelSteps[stepsLen - 1]} radius={8} pathOptions={{ color: "#EF4444", fillColor: "#EF4444", fillOpacity: 1, weight: 3 }} />
      <CircleMarker center={levelSteps[stepsLen - 1]} radius={3} pathOptions={{ color: "#fff", fillColor: "#fff", fillOpacity: 1, weight: 0 }} />
    </>
  )
}

// ─── Nav Simulator ───────────────────────────────────────────────────────

function NavSimulator({ active, route, levelId }: {
  active: boolean
  route: { from: FloorPlanPOI; to: FloorPlanPOI; steps: RouteStep[] } | null
  levelId: string
}) {
  const map = useMap()
  const markerRef = useRef<L.CircleMarker | null>(null)
  const rippleRef = useRef<L.CircleMarker | null>(null)
  const animRef = useRef<number>(0)

  const levelPositions = useMemo(() => {
    if (!route) return []
    const steps: [number, number][] = []
    for (const step of route.steps) {
      if (step.levelId === levelId) {
        const lat = step.y
        const lng = step.x
        if (steps.length === 0 || steps[steps.length - 1][0] !== lat || steps[steps.length - 1][1] !== lng) {
          steps.push([lat, lng])
        }
      }
    }
    return steps
  }, [route, levelId])

  useEffect(() => {
    if (!active || levelPositions.length < 2) return
    const startPos = levelPositions[0]
    const marker = L.circleMarker(startPos, { radius: 10, color: BLUE, fillColor: BLUE, fillOpacity: 0.9, weight: 3 })
    marker.addTo(map)
    markerRef.current = marker
    const ripple = L.circleMarker(startPos, { radius: 20, color: BLUE, fillColor: BLUE, fillOpacity: 0.2, weight: 2, className: "nav-ripple" })
    ripple.addTo(map)
    rippleRef.current = ripple
    return () => {
      if (markerRef.current) { marker.remove(); markerRef.current = null }
      if (rippleRef.current) { ripple.remove(); rippleRef.current = null }
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [active, levelPositions, map])

  return null
}

// ─── Map Controls ────────────────────────────────────────────────────────

function MapControls({ level }: { level: BuildingLevel }) {
  const map = useMap()
  return (
    <div className="absolute bottom-[140px] right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => {
          const bounds = L.latLngBounds([0, 0], [level.height, level.width])
          map.fitBounds(bounds, { padding: [10, 10], animate: true })
        }}
        className="w-11 h-11 rounded-xl bg-white/90 glass-panel shadow-md flex items-center justify-center text-[#1E40AF] hover:bg-white active:scale-95 transition-all cursor-pointer border border-outline-variant/20"
        title="Centrar"
      >
        <span className="material-symbols-outlined text-[20px]">my_location</span>
      </button>
    </div>
  )
}

// ─── Building Selector ───────────────────────────────────────────────────

function BuildingSelector({
  buildings,
  activeBuildingId,
  onBuildingChange,
}: {
  buildings: Building[]
  activeBuildingId: string
  onBuildingChange: (id: string) => void
}) {
  return (
    <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-center pointer-events-none">
      <div className="flex gap-1 bg-white/95 glass-panel rounded-xl p-1 shadow-md pointer-events-auto border border-outline-variant/20 overflow-x-auto max-w-full hide-scrollbar">
        {buildings.map((b) => (
          <button
            key={b.id}
            onClick={() => onBuildingChange(b.id)}
            className={`whitespace-nowrap px-3 py-2 rounded-lg text-[10px] font-bold transition-all duration-300 cursor-pointer ${
              activeBuildingId === b.id
                ? "bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] text-white shadow-sm"
                : "bg-transparent text-gray-500 hover:bg-gray-100"
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Level Selector (filtered by building) ───────────────────────────────

function LevelSelector({
  levels,
  activeLevelId,
  onLevelChange,
}: {
  levels: { id: string; name: string }[]
  activeLevelId: string
  onLevelChange: (id: string) => void
}) {
  if (levels.length < 2) return null
  return (
    <div className="absolute top-[70px] left-4 right-4 z-[1000] flex justify-center pointer-events-none">
      <div className="flex gap-1 bg-white/90 glass-panel rounded-lg p-0.5 shadow-sm pointer-events-auto border border-outline-variant/10">
        {levels.map((l) => (
          <button
            key={l.id}
            onClick={() => onLevelChange(l.id)}
            className={`px-2.5 py-1.5 rounded-md text-[9px] font-bold transition-all duration-300 cursor-pointer ${
              activeLevelId === l.id
                ? "bg-[#3B82F6] text-white"
                : "bg-transparent text-gray-400 hover:bg-gray-100"
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Room Search ─────────────────────────────────────────────────────────

function RoomSearch({ onRoomFound }: {
  onRoomFound: (result: { poi: FloorPlanPOI; levelId: string; buildingId: string }) => void
}) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<{ poi: FloorPlanPOI; levelId: string; buildingId: string }[]>([])
  const [focused, setFocused] = useState(false)

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    if (value.trim().length < 1) {
      setSuggestions([])
      return
    }
    const q = value.trim().toUpperCase()
    const results: { poi: FloorPlanPOI; levelId: string; buildingId: string }[] = []
    for (const b of buildings) {
      for (const l of b.levels) {
        for (const p of l.pois) {
          if (p.id.toUpperCase().includes(q)) {
            results.push({ poi: p, levelId: l.id, buildingId: b.id })
          }
        }
      }
    }
    setSuggestions(results.slice(0, 8))
  }, [])

  const handleSelect = useCallback((result: { poi: FloorPlanPOI; levelId: string; buildingId: string }) => {
    setQuery(result.poi.id)
    setSuggestions([])
    setFocused(false)
    onRoomFound(result)
  }, [onRoomFound])

  return (
    <div className="absolute top-[110px] left-4 right-4 z-[1000] pointer-events-none">
      <div className="relative max-w-xs mx-auto pointer-events-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Buscar salón (ej: H-24, C-28)..."
          className="w-full px-3 py-2 rounded-xl bg-white/95 border border-outline-variant/20 text-xs font-bold text-[#1E40AF] placeholder:text-gray-400 outline-none shadow-md"
        />
        {focused && suggestions.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-lg border border-outline-variant/10 overflow-hidden">
            {suggestions.map((s) => (
              <button
                key={s.poi.id}
                onMouseDown={() => handleSelect(s)}
                className="w-full px-3 py-2 text-left text-xs font-bold text-gray-700 hover:bg-[#DBEAFE] transition-colors cursor-pointer border-b border-gray-50 last:border-b-0"
              >
                <span className="text-[#3B82F6]">{s.poi.id}</span>
                <span className="text-gray-400 ml-2">{s.poi.label}</span>
                <span className="text-gray-300 ml-1 text-[9px]">
                  · {getBuildingById(s.buildingId)?.name} · {getLevelById(s.levelId)?.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function FloorPlanMap({
  unlockedCheckpoints,
  selectedPOI,
  onSelectPOI,
  route,
  navFloorId,
  onNavFloorChange,
  navBuildingId,
  onNavBuildingChange,
}: FloorPlanMapProps) {
  const buildingList = useMemo(() => getAllBuildings(), [])
  const [activeBuildingId, setActiveBuildingId] = useState(buildingList[0]?.id || "edificio-c")
  const [activeLevelId, setActiveLevelId] = useState("")
  const [fadeKey, setFadeKey] = useState(0)

  useEffect(() => {
    if (navBuildingId && buildingList.some(b => b.id === navBuildingId)) {
      setActiveBuildingId(navBuildingId)
      if (onNavBuildingChange) onNavBuildingChange(navBuildingId)
      setFadeKey((k) => k + 1)
    }
  }, [navBuildingId, buildingList, onNavBuildingChange])

  const activeBuilding = useMemo(() => getBuildingById(activeBuildingId), [activeBuildingId])

  // Initialize active level
  useEffect(() => {
    if (activeBuilding?.levels.length) {
      const targetId = navFloorId && activeBuilding.levels.some(l => l.id === navFloorId) ? navFloorId : activeBuilding.levels[0].id
      setActiveLevelId(targetId)
    }
  }, [activeBuildingId, navFloorId, activeBuilding])

  const resolvedLevelId = navFloorId || activeLevelId

  const activeLevel = useMemo(
    () => getLevelById(resolvedLevelId) || buildingList[0]?.levels[0],
    [resolvedLevelId, buildingList]
  )

  const levelPOIs = useMemo(() => activeLevel?.pois || [], [activeLevel])

  const handleBuildingChange = useCallback((id: string) => {
    setFadeKey((k) => k + 1)
    setActiveBuildingId(id)
    if (onNavFloorChange) onNavFloorChange("")
  }, [onNavFloorChange])

  const handleLevelChange = useCallback((id: string) => {
    setFadeKey((k) => k + 1)
    setActiveLevelId(id)
    if (onNavFloorChange) onNavFloorChange(id)
  }, [onNavFloorChange])

  const handleRoomFound = useCallback((result: { poi: FloorPlanPOI; levelId: string; buildingId: string }) => {
    setActiveBuildingId(result.buildingId)
    setActiveLevelId(result.levelId)
    if (onNavFloorChange) onNavFloorChange(result.levelId)
    onSelectPOI(result.poi)
    setFadeKey((k) => k + 1)
  }, [onNavFloorChange, onSelectPOI])

  // Load Leaflet CSS
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  if (!activeLevel) return null

  return (
    <div className="w-full h-full relative map-bg-gradient">
      <BuildingSelector
        buildings={buildingList}
        activeBuildingId={activeBuildingId}
        onBuildingChange={handleBuildingChange}
      />

      {activeBuilding && (
        <LevelSelector
          levels={activeBuilding.levels.map(l => ({ id: l.id, name: l.name }))}
          activeLevelId={resolvedLevelId}
          onLevelChange={handleLevelChange}
        />
      )}

      <RoomSearch onRoomFound={handleRoomFound} />

      <MapContainer
        center={[activeLevel.height / 2, activeLevel.width / 2]}
        zoom={1}
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
          url={activeLevel.image}
          bounds={[[0, 0], [activeLevel.height, activeLevel.width]]}
        />
        <RoomOverlay level={activeLevel} />
        <MapBoundsController levelId={resolvedLevelId} level={activeLevel} />
        <FloorMarkers
          pois={levelPOIs}
          selectedPOI={selectedPOI}
          onSelectPOI={onSelectPOI}
          unlockedCheckpoints={unlockedCheckpoints}
          level={activeLevel}
        />
        <RouteOverlay route={route} levelId={resolvedLevelId} />
        <NavSimulator active={route !== null && resolvedLevelId === activeLevel.id} route={route} levelId={resolvedLevelId} />
        <MapControls level={activeLevel} />
      </MapContainer>
    </div>
  )
}

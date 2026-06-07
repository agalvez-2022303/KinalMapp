"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import { mapPOIs, type MapPOI } from "@/lib/kinal-data"
import "leaflet/dist/leaflet.css"

const KINAL_LAT = 14.62611
const KINAL_LNG = -90.53540
const KINAL_ZOOM = 19

interface KinalMapProps {
  unlockedCheckpoints: string[]
  filter: 'Todos' | 'Checkpoints' | 'Eventos' | 'Edificios'
  selectedPOI: MapPOI | null
  onSelectPOI: (poi: MapPOI | null) => void
}

// Controller component to programmatically pan/zoom when a POI is selected
function MapController({ selectedPOI }: { selectedPOI: MapPOI | null }) {
  const map = useMap()
  useEffect(() => {
    if (selectedPOI && selectedPOI.lat && selectedPOI.lng) {
      map.setView([selectedPOI.lat, selectedPOI.lng], 19, { animate: true })
    }
  }, [selectedPOI, map])
  return null
}

function MapControls() {
  const map = useMap()
  return (
    <div
      style={{
        position: "absolute",
        bottom: 120, // offset above bottom drawer
        right: 16,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <button
        onClick={() => map.setView([KINAL_LAT, KINAL_LNG], KINAL_ZOOM)}
        className="w-12 h-12 rounded-xl bg-white/90 glass-panel shadow-md flex items-center justify-center text-[#13275c] active:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
        title="Centrar en Kinal"
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

// Helper to create HTML DivIcon markers styled with Material You design system
const getMarkerIcon = (poi: MapPOI, unlockedCheckpoints: string[], isSelected: boolean) => {
  let bgColor = '#13275c' // Building (Primary)
  let iconName = 'corporate_fare'
  let fillSetting = "'FILL' 0"
  let pulseHtml = ''

  if (poi.type === 'checkpoint') {
    const isUnlocked = unlockedCheckpoints.includes(poi.checkpointId || '')
    bgColor = isUnlocked ? '#22C55E' : '#fee269'
    iconName = isUnlocked ? 'check_circle' : 'hexagon'
    fillSetting = isUnlocked ? "'FILL' 1" : "'FILL' 0"
    
    if (isUnlocked) {
      pulseHtml = '<div class="absolute w-12 h-12 rounded-full bg-[#22C55E]/20 marker-pulse pointer-events-none z-0"></div>'
    } else {
      pulseHtml = '<div class="absolute w-10 h-10 rounded-full bg-[#fee269]/20 animate-ping pointer-events-none z-0"></div>'
    }
  } else if (poi.type === 'event') {
    bgColor = '#f99520' // Tertiary container / orange
    iconName = 'star'
    fillSetting = "'FILL' 1"
  }

  const borderStyle = isSelected 
    ? 'border: 4px solid #ffffff; transform: scale(1.15); box-shadow: 0 8px 24px rgba(44,62,115,0.25);' 
    : 'border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(44,62,115,0.12);'

  const iconColor = (poi.type === 'checkpoint' && !unlockedCheckpoints.includes(poi.checkpointId || ''))
    ? '#756300' // dark gold text on light gold bg
    : '#ffffff'

  return new L.DivIcon({
    html: `
      <div class="relative flex items-center justify-center w-10 h-10">
        ${pulseHtml}
        <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all z-10" style="
          background-color: ${bgColor}; 
          ${borderStyle}
        ">
          <span class="material-symbols-outlined text-[16px] leading-none" style="
            color: ${iconColor}; 
            font-variation-settings: ${fillSetting};
          ">${iconName}</span>
        </div>
      </div>
    `,
    className: 'custom-leaflet-marker-wrapper',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

export default function KinalMap({ unlockedCheckpoints, filter, selectedPOI, onSelectPOI }: KinalMapProps) {
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // Filter coordinates that are valid
  const visiblePOIs = mapPOIs.filter(p => {
    if (!p.lat || !p.lng) return false
    if (filter === 'Todos') return true
    if (filter === 'Checkpoints') return p.type === 'checkpoint'
    if (filter === 'Eventos') return p.type === 'event'
    if (filter === 'Edificios') return p.type === 'building'
    return true
  })

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer
        center={[KINAL_LAT, KINAL_LNG]}
        zoom={KINAL_ZOOM}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Google Maps Hybrid Satellite Tile Layer */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />

        {visiblePOIs.map(poi => (
          <Marker
            key={poi.id}
            position={[poi.lat!, poi.lng!]}
            icon={getMarkerIcon(poi, unlockedCheckpoints, selectedPOI?.id === poi.id)}
            eventHandlers={{
              click: () => {
                onSelectPOI(selectedPOI?.id === poi.id ? null : poi)
              }
            }}
          />
        ))}

        <MapController selectedPOI={selectedPOI} />
        <MapControls />
      </MapContainer>

      {/* Attribution */}
      <div
        className="absolute bottom-1.5 left-2 z-[400] text-[8px] text-gray-500 bg-white/80 px-2 py-0.5 rounded pointer-events-none select-none"
      >
        &copy; Google Maps · Leaflet
      </div>
    </div>
  )
}

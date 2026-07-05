// ─── Types ──────────────────────────────────────────────────────────────────

export interface FloorPlanPOI {
  id: string
  label: string
  x: number
  y: number
  type: 'checkpoint' | 'entrance' | 'stairs'
  description: string
  checkpointId?: string
  buildingId?: string
}

export interface RouteNode {
  id: string
  levelId: string
  x: number
  y: number
  label?: string
}

export interface RouteEdge {
  from: string
  to: string
}

export interface RoomShape {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
  label: string
}

export interface BuildingLevel {
  id: string
  name: string
  buildingId: string
  image: string
  width: number
  height: number
  pois: FloorPlanPOI[]
  nodes: RouteNode[]
  edges: RouteEdge[]
  rooms: RoomShape[]
}

export interface Building {
  id: string
  name: string
  levels: BuildingLevel[]
}

// ─── Soft blue & orange palette ────────────────────────────────────────────

export const DEPT_COLORS = {
  mecanica: '#F7931E',
  dibujo: '#D4BA46',
  electricidad: '#2C3E73',
  electronica: '#22C55E',
  informatica: '#8B5CF6',
  entrance: '#9CA3AF',
  stairs: '#6B7280',
}

const SOFT_BLUE = '#3B82F6'
const SOFT_ORANGE = '#FB923C'

// ─── Building helpers ───────────────────────────────────────────────────────

const BUILDING_NAMES: Record<string, string> = {
  C: "Edificio C",
  G: "Edificio G",
  H: "Edificio H",
  I: "Edificio I",
  F: "Edificio F",
  B: "Servicios",
}

export function getBuildingFromId(id: string): string {
  if (id.startsWith("entrance")) return "Entrada Principal"
  const prefix = id.charAt(0)
  return BUILDING_NAMES[prefix] || "Edificio"
}

// ─── Buildings data ────────────────────────────────────────────────────────

export const buildings: Building[] = [
  // ── Edificio C (C, I) ──────────────────────────────────────────────────────
  {
    id: "edificio-c",
    name: "Edificio C",
    levels: [
      {
        id: "edificio-c-n1",
        name: "Nivel 1",
        buildingId: "edificio-c",
        image: "/planos/plano-nivel-1.svg",
        width: 2487,
        height: 995,
        pois: [
          { id: 'C-12', label: 'Dibujo Técnico', x: 2070, y: 377, type: 'checkpoint', description: 'Proyectos de Dibujo Técnico' },
          { id: 'C-13', label: 'Sistemas básicos del vehículo', x: 2210, y: 304, type: 'checkpoint', description: 'Proyectos de sistemas básicos del vehículo' },
          { id: 'C-14', label: 'Sistemas eléctricos', x: 2070, y: 308, type: 'checkpoint', description: 'Proyectos de sistemas eléctricos' },
          { id: 'C-15', label: 'Sistemas auxiliares del motor', x: 2143, y: 184, type: 'checkpoint', description: 'Proyectos de sistemas auxiliares del motor' },
          { id: 'I-12', label: 'Motores', x: 2337, y: 226, type: 'checkpoint', description: 'Proyectos de Motores' },
        ],
        rooms: [
          { id: 'room-c12', x: 1950, y: 300, width: 180, height: 150, color: DEPT_COLORS.dibujo, label: 'C-12' },
          { id: 'room-c13', x: 2100, y: 230, width: 220, height: 150, color: DEPT_COLORS.mecanica, label: 'C-13' },
          { id: 'room-c14', x: 1950, y: 230, width: 180, height: 150, color: DEPT_COLORS.mecanica, label: 'C-14' },
          { id: 'room-c15', x: 2000, y: 120, width: 200, height: 130, color: DEPT_COLORS.mecanica, label: 'C-15' },
          { id: 'room-i12', x: 2200, y: 120, width: 200, height: 130, color: DEPT_COLORS.mecanica, label: 'I-12' },
          { id: 'room-stairs-ec-n1', x: 2100, y: 60, width: 100, height: 80, color: DEPT_COLORS.stairs, label: 'Escaleras' },
        ],
        nodes: [
          { id: 'hw-ec-n1-1', levelId: 'edificio-c-n1', x: 1950, y: 450 },
          { id: 'hw-ec-n1-2', levelId: 'edificio-c-n1', x: 1950, y: 300 },
          { id: 'hw-ec-n1-3', levelId: 'edificio-c-n1', x: 1950, y: 180 },
          { id: 'stairs-ec-n1', levelId: 'edificio-c-n1', x: 2150, y: 100, label: 'Escaleras' },
          { id: 'exit-ec-n1', levelId: 'edificio-c-n1', x: 2487, y: 450, label: 'Salida Edificio C' },
        ],
        edges: [
          { from: 'hw-ec-n1-1', to: 'hw-ec-n1-2' },
          { from: 'hw-ec-n1-2', to: 'hw-ec-n1-3' },
          { from: 'hw-ec-n1-3', to: 'stairs-ec-n1' },
          { from: 'C-14', to: 'hw-ec-n1-1' },
          { from: 'C-12', to: 'hw-ec-n1-2' },
          { from: 'C-15', to: 'hw-ec-n1-2' },
          { from: 'C-13', to: 'hw-ec-n1-3' },
          { from: 'I-12', to: 'hw-ec-n1-3' },
          { from: 'exit-ec-n1', to: 'hw-ec-n1-1' },
        ],
      },
      {
        id: "edificio-c-n2",
        name: "Nivel 2",
        buildingId: "edificio-c",
        image: "/planos/plano-nivel-2.svg",
        width: 3067,
        height: 2322,
        pois: [
          { id: 'C-20', label: 'Ciencias Exactas', x: 2270, y: 999, type: 'checkpoint', description: 'Proyectos de ciencias exactas' },
        ],
        rooms: [
          { id: 'room-c20', x: 2100, y: 850, width: 350, height: 300, color: DEPT_COLORS.dibujo, label: 'C-20' },
          { id: 'room-stairs-ec-n2', x: 2500, y: 1500, width: 120, height: 100, color: DEPT_COLORS.stairs, label: 'Escaleras' },
        ],
        nodes: [
          { id: 'hw-ec-n2-1', levelId: 'edificio-c-n2', x: 2200, y: 1100 },
          { id: 'hw-ec-n2-2', levelId: 'edificio-c-n2', x: 2300, y: 1100 },
          { id: 'stairs-ec-n2', levelId: 'edificio-c-n2', x: 2560, y: 1550, label: 'Escaleras' },
        ],
        edges: [
          { from: 'hw-ec-n2-1', to: 'hw-ec-n2-2' },
          { from: 'hw-ec-n2-2', to: 'stairs-ec-n2' },
          { from: 'C-20', to: 'hw-ec-n2-2' },
        ],
      },
      {
        id: "edificio-c-n3",
        name: "Nivel 3",
        buildingId: "edificio-c",
        image: "/planos/plano-nivel-3.svg",
        width: 2375,
        height: 1097,
        pois: [
          { id: 'C-31', label: 'Electricidad I', x: 2211, y: 682, type: 'checkpoint', description: 'Proyectos de Electricidad' },
          { id: 'C-32', label: 'Electricidad II', x: 1915, y: 685, type: 'checkpoint', description: 'Proyectos de Electricidad' },
          { id: 'C-33', label: 'Electricidad III', x: 2215, y: 534, type: 'checkpoint', description: 'Proyectos de Electricidad' },
          { id: 'C-36', label: 'Electrónica I', x: 1916, y: 274, type: 'checkpoint', description: 'Proyectos de Electrónica' },
          { id: 'C-37', label: 'Electrónica II', x: 2220, y: 275, type: 'checkpoint', description: 'Proyectos de Electrónica' },
          { id: 'C-38', label: 'Electrónica III', x: 1920, y: 121, type: 'checkpoint', description: 'Proyectos de Electrónica' },
        ],
        rooms: [
          { id: 'room-c31', x: 2080, y: 600, width: 200, height: 160, color: DEPT_COLORS.electricidad, label: 'C-31' },
          { id: 'room-c32', x: 1780, y: 600, width: 200, height: 160, color: DEPT_COLORS.electricidad, label: 'C-32' },
          { id: 'room-c33', x: 2080, y: 450, width: 200, height: 160, color: DEPT_COLORS.electricidad, label: 'C-33' },
          { id: 'room-c36', x: 1780, y: 200, width: 200, height: 150, color: DEPT_COLORS.electronica, label: 'C-36' },
          { id: 'room-c37', x: 2080, y: 200, width: 200, height: 150, color: DEPT_COLORS.electronica, label: 'C-37' },
          { id: 'room-c38', x: 1780, y: 50, width: 200, height: 150, color: DEPT_COLORS.electronica, label: 'C-38' },
          { id: 'room-stairs-ec-n3', x: 2200, y: 50, width: 100, height: 80, color: DEPT_COLORS.stairs, label: 'Escaleras' },
        ],
        nodes: [
          { id: 'hw-ec-n3-1', levelId: 'edificio-c-n3', x: 1700, y: 750 },
          { id: 'hw-ec-n3-2', levelId: 'edificio-c-n3', x: 1700, y: 550 },
          { id: 'hw-ec-n3-3', levelId: 'edificio-c-n3', x: 1700, y: 350 },
          { id: 'hw-ec-n3-4', levelId: 'edificio-c-n3', x: 1700, y: 150 },
          { id: 'stairs-ec-n3', levelId: 'edificio-c-n3', x: 2250, y: 90, label: 'Escaleras' },
        ],
        edges: [
          { from: 'hw-ec-n3-1', to: 'hw-ec-n3-2' },
          { from: 'hw-ec-n3-2', to: 'hw-ec-n3-3' },
          { from: 'hw-ec-n3-3', to: 'hw-ec-n3-4' },
          { from: 'hw-ec-n3-4', to: 'stairs-ec-n3' },
          { from: 'C-31', to: 'hw-ec-n3-2' },
          { from: 'C-32', to: 'hw-ec-n3-2' },
          { from: 'C-33', to: 'hw-ec-n3-3' },
          { from: 'C-36', to: 'hw-ec-n3-4' },
          { from: 'C-37', to: 'hw-ec-n3-4' },
          { from: 'C-38', to: 'hw-ec-n3-4' },
        ],
      },
    ],
  },

  // ── Edificio de Básicos (G, H) ─────────────────────────────────────────────
  {
    id: "basicos",
    name: "Edificio de Básicos",
    levels: [
      {
        id: "basicos-n1",
        name: "Nivel 1",
        buildingId: "basicos",
        image: "/planos/plano-nivel-1.svg",
        width: 2487,
        height: 995,
        pois: [],
        rooms: [],
        nodes: [
          { id: 'exit-basicos-n1', levelId: 'basicos-n1', x: 1850, y: 275, label: 'Salida Básicos' },
        ],
        edges: [],
      },
      {
        id: "basicos-n2",
        name: "Nivel 2",
        buildingId: "basicos",
        image: "/planos/plano-nivel-2.svg",
        width: 3067,
        height: 2322,
        pois: [
          { id: 'G-21', label: 'Ciencias Naturales', x: 698, y: 1147, type: 'checkpoint', description: 'Proyectos de ciencias naturales' },
        ],
        rooms: [
          { id: 'room-g21', x: 500, y: 1000, width: 350, height: 300, color: DEPT_COLORS.informatica, label: 'G-21' },
        ],
        nodes: [
          { id: 'hw-basicos-n2-1', levelId: 'basicos-n2', x: 500, y: 1100 },
          { id: 'hw-basicos-n2-2', levelId: 'basicos-n2', x: 700, y: 1100 },
        ],
        edges: [
          { from: 'hw-basicos-n2-1', to: 'hw-basicos-n2-2' },
          { from: 'G-21', to: 'hw-basicos-n2-1' },
        ],
      },
      {
        id: "basicos-n3",
        name: "Nivel 3",
        buildingId: "basicos",
        image: "/planos/plano-nivel-3.svg",
        width: 2375,
        height: 1097,
        pois: [
          { id: 'G-35', label: 'Informática I', x: 640, y: 640, type: 'checkpoint', description: 'Proyectos de informática' },
          { id: 'G-36', label: 'Informática II', x: 645, y: 460, type: 'checkpoint', description: 'Proyectos de informática' },
          { id: 'H-32', label: 'Informática III', x: 313, y: 889, type: 'checkpoint', description: 'Proyectos de informática' },
          { id: 'H-33', label: 'Informática IV', x: 214, y: 698, type: 'checkpoint', description: 'Proyectos de informática' },
          { id: 'H-34', label: 'Informática V', x: 120, y: 525, type: 'checkpoint', description: 'Proyectos de informática' },
        ],
        rooms: [
          { id: 'room-g35', x: 520, y: 560, width: 200, height: 160, color: DEPT_COLORS.informatica, label: 'G-35' },
          { id: 'room-g36', x: 520, y: 380, width: 200, height: 160, color: DEPT_COLORS.informatica, label: 'G-36' },
          { id: 'room-h32', x: 200, y: 800, width: 180, height: 160, color: DEPT_COLORS.informatica, label: 'H-32' },
          { id: 'room-h33', x: 120, y: 620, width: 180, height: 160, color: DEPT_COLORS.informatica, label: 'H-33' },
          { id: 'room-h34', x: 30, y: 440, width: 180, height: 160, color: DEPT_COLORS.informatica, label: 'H-34' },
        ],
        nodes: [
          { id: 'hw-basicos-n3-1', levelId: 'basicos-n3', x: 800, y: 800 },
          { id: 'hw-basicos-n3-2', levelId: 'basicos-n3', x: 800, y: 620 },
          { id: 'hw-basicos-n3-3', levelId: 'basicos-n3', x: 800, y: 450 },
        ],
        edges: [
          { from: 'hw-basicos-n3-1', to: 'hw-basicos-n3-2' },
          { from: 'hw-basicos-n3-2', to: 'hw-basicos-n3-3' },
          { from: 'G-35', to: 'hw-basicos-n3-2' },
          { from: 'G-36', to: 'hw-basicos-n3-3' },
          { from: 'H-32', to: 'hw-basicos-n3-1' },
          { from: 'H-33', to: 'hw-basicos-n3-1' },
          { from: 'H-34', to: 'hw-basicos-n3-2' },
        ],
      },
    ],
  },

  // ── Campus exterior (connects buildings) ────────────────────────────────────
  {
    id: "exterior",
    name: "Campus",
    levels: [
      {
        id: "exterior",
        name: "Campus",
        buildingId: "exterior",
        image: "/planos/exterior-campus.svg",
        width: 800,
        height: 600,
        pois: [],
        rooms: [],
        nodes: [
          { id: 'ext-c', levelId: 'exterior', x: 200, y: 300, label: 'Edificio C' },
          { id: 'ext-basicos', levelId: 'exterior', x: 600, y: 300, label: 'Básicos' },
        ],
        edges: [
          { from: 'ext-c', to: 'ext-basicos' },
        ],
      },
    ],
  },
]

// ─── Building crop bounds for zoom-to-area ──────────────────────────────────

export const BUILDING_BOUNDS: Record<string, { x: number; y: number; width: number; height: number }> = {
  "edificio-c-n1": { x: 1850, y: 0, width: 637, height: 550 },
  "edificio-c-n2": { x: 1900, y: 0, width: 800, height: 1200 },
  "edificio-c-n3": { x: 1500, y: 0, width: 875, height: 850 },
  "basicos-n1": { x: 1000, y: 0, width: 850, height: 550 },
  "basicos-n2": { x: 0, y: 500, width: 1200, height: 1000 },
  "basicos-n3": { x: 0, y: 200, width: 1200, height: 897 },
}

// ─── Cross-building stair links ────────────────────────────────────────────
// Stairs within each building connect consecutive levels
export const STAIR_LINKS: Record<string, [string, string][]> = {
  "edificio-c": [
    ["stairs-ec-n1", "stairs-ec-n2"],
    ["stairs-ec-n2", "stairs-ec-n3"],
  ],
  "basicos": [],
}

// ─── Building entrance → exterior node mapping ─────────────────────────────
export const BUILDING_EXITS: Record<string, string> = {
  "exit-ec-n1": "ext-c",
  "exit-basicos-n1": "ext-basicos",
}

// ─── Helper functions ──────────────────────────────────────────────────────

export function getAllBuildings(): Building[] {
  return buildings
}

export function getBuildingById(id: string): Building | undefined {
  return buildings.find(b => b.id === id)
}

export function getLevelById(id: string): BuildingLevel | undefined {
  for (const b of buildings) {
    const level = b.levels.find(l => l.id === id)
    if (level) return level
  }
  return undefined
}

export function getLevelByRoomId(roomId: string): BuildingLevel | undefined {
  for (const b of buildings) {
    for (const l of b.levels) {
      if (l.pois.some(p => p.id === roomId)) return l
    }
  }
  return undefined
}

export function getBuildingForLevel(levelId: string): Building | undefined {
  for (const b of buildings) {
    if (b.levels.some(l => l.id === levelId)) return b
  }
  return undefined
}

export function getAllLevelPOIs(): FloorPlanPOI[] {
  return buildings.flatMap(b => b.levels.flatMap(l => l.pois))
}

export function getAllLevels(): BuildingLevel[] {
  return buildings.flatMap(b => b.levels)
}

export function findPOI(id: string): FloorPlanPOI | undefined {
  for (const b of buildings) {
    for (const l of b.levels) {
      const poi = l.pois.find(p => p.id === id)
      if (poi) return poi
    }
  }
  return undefined
}

export function findLevelByPOIId(id: string): BuildingLevel | undefined {
  for (const b of buildings) {
    for (const l of b.levels) {
      if (l.pois.some(p => p.id === id)) return l
    }
  }
  return undefined
}

// ─── Resolve room search (e.g. "H24", "C-28") ──────────────────────────────
export function searchRoom(query: string): { poi: FloorPlanPOI; level: BuildingLevel; building: Building } | null {
  const q = query.trim().toUpperCase()
  for (const b of buildings) {
    for (const l of b.levels) {
      const poi = l.pois.find(p => p.id.toUpperCase() === q)
      if (poi) return { poi, level: l, building: b }
    }
  }
  return null
}

export function getBuildingDisplayName(roomId: string): string {
  // e.g. "C-12" → "Edificio C", "G-21" → "Edificio de Básicos"
  for (const b of buildings) {
    for (const l of b.levels) {
      if (l.pois.some(p => p.id === roomId)) return b.name
    }
  }
  return getBuildingFromId(roomId)
}

// ─── Forward compat ─────────────────────────────────────────────────────────
export function getFloorPlanById(id: string) {
  return getLevelById(id)
}

// ─── Sticker Album Data (unchanged) ─────────────────────────────────────────

export interface Sticker {
  id: string
  name: string
  section: string
  sectionId: string
  checkpointId: string
  unlocked: boolean
  emoji: string
}

export interface AlbumSection {
  id: string
  name: string
  division: 'JR' | 'SR' | 'Histórica'
  color: string
  mascotColor?: string
  mascotCircleColor?: string
  mascotImage?: string
  mascotName?: string
  stickers: Sticker[]
}

export const albumSections: AlbumSection[] = [
  {
    id: 'basicos-1',
    name: 'Básicos',
    division: 'JR',
    color: '#2C3E73',
    mascotColor: '#bc7b4e',
    mascotCircleColor: '#773d1c',
    mascotImage: '/mascotas/Basicos_CHIP.png',
    mascotName: 'CHIP',
    stickers: [
      { id: 's1', name: 'Matemáticas I', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-1', unlocked: false, emoji: '📐' },
      { id: 's2', name: 'Idioma Español', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-2', unlocked: false, emoji: '📖' },
      { id: 's3', name: 'Computación', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-3', unlocked: false, emoji: '💻' },
      { id: 's4', name: 'Inglés', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-4', unlocked: false, emoji: '🌐' },
      { id: 's5', name: 'Artes Plasticas', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-5', unlocked: false, emoji: '🎨'},
      { id: 's6', name: 'Actitudes', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-6', unlocked: false, emoji: '🤝'},
      { id: 's7', name: 'Religión', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-7', unlocked: false, emoji: '🙏'},
      { id: 's8', name: 'Ciencias Naturales', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-8', unlocked: false, emoji: '🔬'},
      { id: 's9', name: 'Ciencias Sociales', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-9', unlocked: false, emoji: '🌍'},
      { id: 's10', name: 'Emprendimiento', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-10', unlocked: false, emoji: '🚀'},
      { id: 's11', name: 'Música', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-11', unlocked: false, emoji: '🎵'},
      { id: 's12', name: 'Kaqchikel', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-12', unlocked: false, emoji: '🌿'},
      { id: 's13', name: 'BA-Mecánica', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-13', unlocked: false, emoji: '🔧'},
      { id: 's14', name: 'BA-Electricidad', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-14', unlocked: false, emoji: '💡'},
      { id: 's15', name: 'BA-Electrónica', section: 'Básicos', sectionId: 'basicos-1', checkpointId: 'CP-BA-15', unlocked: false, emoji: '⚡'},
    ],
  },
  {
    id: 'computacion',
    name: 'Perito en Informática',
    division: 'SR',
    color: '#a6867a',
    mascotColor: '#bda69a',
    mascotCircleColor: '#a6867a',
    mascotImage: '/mascotas/Informatica_KODY.png',
    mascotName: 'KODY',
    stickers: [
      { id: 's16', name: '4to. Informatica', section: 'Perito en Informática', sectionId: 'computacion', checkpointId: 'CP-INF-1', unlocked: false, emoji: '👨‍💻' },
      { id: 's17', name: '5to. Informatica', section: 'Perito en Informática', sectionId: 'computacion', checkpointId: 'CP-INF-2', unlocked: false, emoji: '💻' },
      { id: 's18', name: '6to. Informatica', section: 'Perito en Informática', sectionId: 'computacion', checkpointId: 'CP-INF-3', unlocked: false, emoji: '💾' },
    ],
  },
  {
    id: 'Mecánica',
    name: 'Perito en Mecánica Automotriz',
    division: 'SR',
    color: '#584946',
    mascotColor: '#a7a4a9',
    mascotCircleColor: '#584946',
    mascotImage: '/mascotas/Mecanica_KONG.png',
    mascotName: 'KONG',
    stickers: [
      { id: 's19', name: '4to. Mecanica', section: 'Perito en Mecánica Automotriz', sectionId: 'Mecánica', checkpointId: 'CP-MEC-1', unlocked: false, emoji: '🔧' },
      { id: 's20', name: '5to. Mecanica', section: 'Perito en Mecánica Automotriz', sectionId: 'Mecánica', checkpointId: 'CP-MEC-2', unlocked: false, emoji: '⚙️' },
      { id: 's21', name: '6to. Mecanica', section: 'Perito en Mecánica Automotriz', sectionId: 'Mecánica', checkpointId: 'CP-MEC-3', unlocked: false, emoji: '🏎️' },
    ],
  },
  {
    id: 'Electrónica',
    name: 'Perito en Electrónica',
    division: 'SR',
    color: '#a16f4f',
    mascotColor: '#d7bb96',
    mascotCircleColor: '#a16f4f',
    mascotImage: '/mascotas/Electronica_Nova.png',
    mascotName: 'Nova',
    stickers: [
      { id: 's22', name: '4to. Electrónica', section: 'Perito en Electrónica', sectionId: 'Electrónica', checkpointId: 'CP-ELE-1', unlocked: false, emoji: '🔋' },
      { id: 's23', name: '5to. Electrónica', section: 'Perito en Electrónica', sectionId: 'Electrónica', checkpointId: 'CP-ELE-2', unlocked: false, emoji: '🔌' },
      { id: 's24', name: '6to. Electrónica', section: 'Perito en Electrónica', sectionId: 'Electrónica', checkpointId: 'CP-ELE-3', unlocked: false, emoji: '⚡' },
    ],
  },
  {
    id: 'Electricidad',
    name: 'Perito en Electricidad',
    division: 'SR',
    color: '#224076',
    mascotColor: '#6692c1',
    mascotCircleColor: '#224076',
    mascotImage: '/mascotas/Electricidad_VOLT.png',
    mascotName: 'VOLT',
    stickers: [
      { id: 's25', name: '4to. Electricidad', section: 'Perito en Electricidad', sectionId: 'Electricidad', checkpointId: 'CP-ELC-1', unlocked: false, emoji: '💡' },
      { id: 's26', name: '5to. Electricidad', section: 'Perito en Electricidad', sectionId: 'Electricidad', checkpointId: 'CP-ELC-2', unlocked: false, emoji: '🌀' },
      { id: 's27', name: '6to. Electricidad', section: 'Perito en Electricidad', sectionId: 'Electricidad', checkpointId: 'CP-ELC-3', unlocked: false, emoji: '🗼' },
    ],
  },
  {
    id: 'Dibujo Técnico',
    name: 'Perito en Dibujo Técnico',
    division: 'SR',
    color: '#c8923a',
    mascotColor: '#e1b35c',
    mascotCircleColor: '#c8923a',
    mascotImage: '/mascotas/DibujoTecnico_NEO.png',
    mascotName: 'NEO',
    stickers: [
      { id: 's28', name: '4to. Dibujo Técnico', section: 'Perito en Dibujo Técnico', sectionId: 'Dibujo Técnico', checkpointId: 'CP-DIB-1', unlocked: false, emoji: '📐' },
      { id: 's29', name: '5to. Dibujo Técnico', section: 'Perito en Dibujo Técnico', sectionId: 'Dibujo Técnico', checkpointId: 'CP-DIB-2', unlocked: false, emoji: '✏️' },
      { id: 's30', name: '6to. Dibujo Técnico', section: 'Perito en Dibujo Técnico', sectionId: 'Dibujo Técnico', checkpointId: 'CP-DIB-3', unlocked: false, emoji: '🏗️' },
    ],
  },
  {
    id: 'historica',
    name: 'Colección Histórica',
    division: 'Histórica',
    color: '#D4BA46',
    mascotColor: '#D4BA46',
    mascotCircleColor: '#b8860b',
    mascotImage: '/mascotas/Historia_REXY.png',
    mascotName: 'REXY',
    stickers: [
      { id: 's31', name: 'Fundación 1961', section: 'Colección Histórica', sectionId: 'historica', checkpointId: 'CP-HIS-1', unlocked: false, emoji: '🏫' },
      { id: 's32', name: '25 Años de Trayectoria', section: 'Colección Histórica', sectionId: 'historica', checkpointId: 'CP-HIS-2', unlocked: false, emoji: '🏆' },
      { id: 's33', name: '65 Años Kinal', section: 'Colección Histórica', sectionId: 'historica', checkpointId: 'CP-HIS-3', unlocked: false, emoji: '💎' },
    ],
  },
]

export function getAllCheckpoints(): { id: string; label: string; description: string }[] {
  return albumSections.flatMap(sec =>
    sec.stickers.map(st => ({
      id: st.checkpointId,
      label: st.name,
      description: `Estampita: ${st.name}`,
    }))
  )
}

// ─── Events ─────────────────────────────────────────────────────────────────

export const todayEvents = [
  { time: '04:00', title: 'Proyectos de Motores', location: 'I-12', color: 'gold' },
  { time: '04:00', title: 'Proyectos de Dibujo Técnico', location: 'C-12', color: 'gold' },
  { time: '04:00', title: 'Proyectos de sistemas básicos del vehículo', location: 'C-11', color: 'orange' },
  { time: '04:00', title: 'Proyectos de sistemas básicos del vehículo', location: 'C-13', color: 'orange' },
  { time: '04:00', title: 'Proyectos de sistemas eléctricos', location: 'C-14', color: 'orange' },
  { time: '04:00', title: 'Proyectos de sistemas auxiliares del motor', location: 'C-15', color: 'orange' },
  { time: '04:00', title: 'Proyectos de Electricidad', location: 'C-31', color: 'navy' },
  { time: '04:00', title: 'Proyectos de Electricidad', location: 'C-32', color: 'navy' },
  { time: '04:00', title: 'Proyectos de Electricidad', location: 'C-33', color: 'navy' },
  { time: '04:00', title: 'Proyectos de Electrónica', location: 'C-36', color: 'navy' },
  { time: '04:00', title: 'Proyectos de Electrónica', location: 'C-37', color: 'navy' },
  { time: '04:00', title: 'Proyectos de Electrónica', location: 'C-38', color: 'navy' },
  { time: '04:00', title: 'Proyectos de informática', location: 'G-35', color: 'gold' },
  { time: '04:00', title: 'Proyectos de informática', location: 'G-36', color: 'gold' },
  { time: '04:00', title: 'Proyectos de informática', location: 'H-32', color: 'gold' },
  { time: '04:00', title: 'Proyectos de informática', location: 'H-33', color: 'gold' },
  { time: '04:00', title: 'Proyectos de informática', location: 'H-34', color: 'gold' },
  { time: '04:00', title: 'Proyectos de ciencias exactas', location: 'C-20', color: 'orange' },
  { time: '04:00', title: 'Proyectos de ciencias naturales', location: 'G-21', color: 'orange' },
]

// ─── Timeline ───────────────────────────────────────────────────────────────

export interface TimelineEntry {
  year: string
  title: string
  description: string
  type: 'institution' | 'career' | 'milestone'
  color: string
}

export const timelineEntries: TimelineEntry[] = [
  {
    year: "1961",
    title: 'Fundación de Kinal',
    description: 'Inicia la labor educativa en el municipio de Mixco, impulsada por fieles del Opus Dei y jóvenes profesionales.',
    type: 'institution',
    color: '#D4BA46',
  },
  {
    year: "1970",
    title: 'Primer Programa Técnico',
    description: 'El Centro se establece en una sede cercana al basurero municipal de la Ciudad de Guatemala, atendiendo a obreros y jóvenes con cursos cortos.',
    type: 'career',
    color: '#2C3E73',
  },
  {
    year: "1984",
    title: 'Cierre de etapa',
    description: 'Finaliza el periodo de 14 años en la sede cerca del basurero, marcando el fin de una era de "peregrinación" por diversos barrios populares.',
    type: 'milestone',
    color: '#F7931E',
  },
  {
    year: "1985",
    title: 'Expansión del Campus',
    description: 'Con el apoyo de Álvaro del Portillo (sucesor de San Josemaría), inicia la construcción de la sede actual en la zona 7 capitalina.',
    type: 'institution',
    color: '#D4BA46',
  },
  {
    year: "1986",
    title: 'Fundación Kinal',
    description: 'Se constituye formalmente la Fundación Kinal para gestionar la recaudación de fondos y el desarrollo de la nueva sede.',
    type: 'institution',
    color: '#2C3E73',
  },
  {
    year: "1988",
    title: 'Inauguración',
    description: 'En enero, se traslada el centro a sus instalaciones definitivas en la zona 7, diseñadas específicamente para la formación técnica.',
    type: 'milestone',
    color: '#F7931E',
  },
  {
    year: "1992 - 1998",
    title: 'Crecimiento Institucional',
    description: 'Tras la consolidación en la sede de la zona 7, Kinal fortalece su prestigio como centro de formación técnica de élite y comienza a forjar lazos estrechos con el sector privado guatemalteco.',
    type: 'institution',
    color: '#D4BA46',
  },
  {
    year: "1999 - 2002",
    title: 'Nueva Era',
    description: 'Kinal robustece sus laboratorios de computación, transitando de la electrónica analógica y máquinas de escribir hacia los sistemas digitales y la programación básica.',
    type: 'milestone',
    color: '#2C3E73',
  },
  {
    year: "2003 - 2006",
    title: 'Auge Industrial',
    description: 'Se establecen alianzas estratégicas con empresas de telecomunicaciones y energía, integrando los PLC (controladores lógicos programables) como eje de la electrónica industrial.',
    type: 'institution',
    color: '#F7931E',
  },
  {
    year: "2007 - 2010",
    title: 'Diversificación',
    description: 'Se formalizan las especialidades técnicas y se consolida la "formación dual", combinando el aprendizaje en aula con laboratorios que simulan entornos industriales reales.',
    type: 'career',
    color: '#D4BA46',
  },
  {
    year: "2011 - 2013",
    title: 'Aniversario de Oro',
    description: 'Kinal celebra 50 años con una renovación total de infraestructura, incorporando maquinaria de control numérico (CNC) y relanzando su imagen institucional.',
    type: 'milestone',
    color: '#2C3E73',
  },
  {
    year: "2014 - 2016",
    title: 'Modelo por Competencias',
    description: 'Se adopta el enfoque de resolución de problemas reales y se integran programas de pensamiento creativo y emprendimiento tecnológico.',
    type: 'career',
    color: '#F7931E',
  },
  {
    year: "2018",
    title: 'Metodologías Ágiles',
    description: 'Se intensifica la implementación del Aprendizaje Basado en Proyectos (ABP) y se inicia la adopción formal de certificaciones internacionales.',
    type: 'career',
    color: '#D4BA46',
  },
  {
    year: "2019",
    title: 'Modernización',
    description: 'Se inauguran espacios de trabajo colaborativo en los laboratorios de sistemas, diseñados para simular entornos de oficinas tecnológicas modernas.',
    type: 'milestone',
    color: '#2C3E73',
  },
  {
    year: "2020",
    title: 'Resiliencia Digital',
    description: 'Ante la pandemia, Kinal migra toda su infraestructura académica y el sistema de tutorías personalizadas a entornos virtuales.',
    type: 'milestone',
    color: '#F7931E',
  },
  {
    year: "2022",
    title: 'Industria 4.0',
    description: 'Se integra oficialmente la Inteligencia Artificial y el Internet de las Cosas (IoT) en el currículo de las carreras técnicas.',
    type: 'institution',
    color: '#D4BA46',
  },
  {
    year: "2024",
    title: 'Enfoque Emprendedor',
    description: 'Se consolida el modelo de gestión por proyectos, preparando a los alumnos para la creación de soluciones de software escalables.',
    type: 'milestone',
    color: '#2C3E73',
  },
  {
    year: "2026",
    title: 'Aniversario 65',
    description: 'Consolidación como un ecosistema tecnológico integral, reafirmando alianzas estratégicas con organismos como SEGEPLAN y el sector empresarial.',
    type: 'milestone',
    color: '#F7931E',
  },
]

// ─── Rewards ─────────────────────────────────────────────────────────────────

export const rewards = [
  { threshold: 10, label: 'Premio Explorador', description: 'Sticker digital exclusivo de Kinal', icon: '🎖️' },
  { threshold: 25, label: 'Premio Aventurero', description: 'Acceso a contenido histórico extra', icon: '🏅' },
  { threshold: 50, label: 'Premio Embajador', description: 'Foto con el personaje Kinal + certificado digital', icon: '🥈' },
  { threshold: 70, label: 'Premio Campeón', description: 'Pack de souvenirs Kinal exclusivos', icon: '🥇' },
  { threshold: 80, label: 'Gran Premio — Big Price', description: 'Premio sorpresa especial de la Expo Anual', icon: '🏆' },
]

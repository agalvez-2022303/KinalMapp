// ─── Campus Map Points of Interest ───────────────────────────────────────────

export interface MapPOI {
  id: string
  label: string
  x: number   // percentage
  y: number   // percentage
  type: 'checkpoint' | 'event' | 'building'
  description: string
  checkpointId?: string
  lat?: number
  lng?: number
}

export const mapPOIs: MapPOI[] = [
  // Centro del campus / Edificio principal - Entrada
  { id: 'poi-1', label: 'Entrada Principal', x: 50, y: 30, type: 'building', description: 'Acceso principal — 6A Av. 13-54, Zona 7, Guatemala.', lat: 14.62598, lng: -90.53552 },
  // Área norte del campus (edificios de básicos)
  { id: 'poi-2', label: 'Checkpoint A', x: 25, y: 45, type: 'checkpoint', description: 'Edificio de Básicos — División JR', checkpointId: 'CP-A', lat: 14.62638, lng: -90.53572 },
  // Área este (laboratorios de cómputo)
  { id: 'poi-3', label: 'Checkpoint B', x: 70, y: 55, type: 'checkpoint', description: 'Laboratorios de Computación e Informática', checkpointId: 'CP-B', lat: 14.62625, lng: -90.53510 },
  // Área sur del campus (diversificado)
  { id: 'poi-4', label: 'Checkpoint C', x: 45, y: 70, type: 'checkpoint', description: 'Área de Perito en Mercadotecnia', checkpointId: 'CP-C', lat: 14.62583, lng: -90.53522 },
  // Cancha / Área de eventos al norte
  { id: 'poi-5', label: 'Exposición REDES', x: 72, y: 25, type: 'event', description: 'Exposición de proyectos de Redes — 09:00 a 13:00', lat: 14.62648, lng: -90.53498 },
  // Pabellón oeste
  { id: 'poi-6', label: 'Exposición PROG', x: 30, y: 65, type: 'event', description: 'Muestra de apps y sistemas — 10:00 a 14:00', lat: 14.62590, lng: -90.53575 },
  // Bloque sur-este (bachillerato)
  { id: 'poi-7', label: 'Checkpoint D', x: 58, y: 82, type: 'checkpoint', description: 'Área de Bachillerato en Ciencias y Letras', checkpointId: 'CP-D', lat: 14.62565, lng: -90.53508 },
  // Cafetería - bloque central sur
  { id: 'poi-8', label: 'Cafetería', x: 20, y: 80, type: 'building', description: 'Servicio de alimentación disponible todo el día.', lat: 14.62572, lng: -90.53560 },
]

export const todayEvents = [
  { time: '08:30', title: 'Inauguración Expo Anual', location: 'Aula Magna', color: 'gold' },
  { time: '09:00', title: 'Feria de Computación', location: 'Lab. Informática', color: 'orange' },
  { time: '10:30', title: 'Muestra de Diseño Gráfico', location: 'Pasillo C', color: 'navy' },
  { time: '13:00', title: 'Presentación Banda Escolar', location: 'Cancha Principal', color: 'gold' },
  { time: '15:00', title: 'Premiación de Checkpoints', location: 'Aula Magna', color: 'orange' },
]

// ─── Sticker Album Data ───────────────────────────────────────────────────────

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
  stickers: Sticker[]
}

export const albumSections: AlbumSection[] = [
  {
    id: 'basicos-1',
    name: 'Primero Básico',
    division: 'JR',
    color: '#2C3E73',
    stickers: [
      { id: 's1', name: 'Matemáticas', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '📐' },
      { id: 's2', name: 'Lenguaje', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '📖' },
      { id: 's3', name: 'Computación', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-B', unlocked: false, emoji: '💻' },
      { id: 's4', name: 'Inglés', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '🌐' },
    ],
  },
  {
    id: 'basicos-2',
    name: 'Segundo Básico',
    division: 'JR',
    color: '#2C3E73',
    stickers: [
      { id: 's5', name: 'Plásticas', section: 'Segundo Básico', sectionId: 'basicos-2', checkpointId: 'CP-A', unlocked: false, emoji: '🎨' },
      { id: 's6', name: 'Idioma Maya', section: 'Segundo Básico', sectionId: 'basicos-2', checkpointId: 'CP-A', unlocked: false, emoji: '🌿' },
      { id: 's7', name: 'Religión', section: 'Segundo Básico', sectionId: 'basicos-2', checkpointId: 'CP-C', unlocked: false, emoji: '✨' },
      { id: 's8', name: 'Actitudes', section: 'Segundo Básico', sectionId: 'basicos-2', checkpointId: 'CP-C', unlocked: false, emoji: '🌟' },
    ],
  },
  {
    id: 'basicos-3',
    name: 'Tercero Básico',
    division: 'JR',
    color: '#2C3E73',
    stickers: [
      { id: 's9', name: 'Física', section: 'Tercero Básico', sectionId: 'basicos-3', checkpointId: 'CP-B', unlocked: false, emoji: '⚛️' },
      { id: 's10', name: 'Química', section: 'Tercero Básico', sectionId: 'basicos-3', checkpointId: 'CP-B', unlocked: false, emoji: '🧪' },
      { id: 's11', name: 'Sociales', section: 'Tercero Básico', sectionId: 'basicos-3', checkpointId: 'CP-D', unlocked: false, emoji: '🏛️' },
      { id: 's12', name: 'Matemáticas III', section: 'Tercero Básico', sectionId: 'basicos-3', checkpointId: 'CP-D', unlocked: false, emoji: '🔢' },
    ],
  },
  {
    id: 'computacion',
    name: 'Perito en Informática',
    division: 'SR',
    color: '#D4BA46',
    stickers: [
      { id: 's13', name: 'Programación', section: 'Perito en Informática', sectionId: 'computacion', checkpointId: 'CP-B', unlocked: false, emoji: '👨‍💻' },
      { id: 's14', name: 'Redes', section: 'Perito en Informática', sectionId: 'computacion', checkpointId: 'CP-B', unlocked: false, emoji: '🌐' },
      { id: 's15', name: 'Base de Datos', section: 'Perito en Informática', sectionId: 'computacion', checkpointId: 'CP-B', unlocked: false, emoji: '🗄️' },
    ],
  },
  {
    id: 'Mecánica',
    name: 'Perito en Mecánica Automotriz',
    division: 'SR',
    color: '#F7931E',
    stickers: [
      { id: 's16', name: 'Mantenimiento', section: 'Perito en Mecánica Automotriz', sectionId: 'Mecánica', checkpointId: 'CP-C', unlocked: false, emoji: '📊' },
      { id: 's17', name: 'Pintura', section: 'Perito en Mecánica Automotriz', sectionId: 'Mecánica', checkpointId: 'CP-C', unlocked: false, emoji: '📢' },
      { id: 's18', name: 'Motores y Transmisiones', section: 'Perito en Mecánica Automotriz', sectionId: 'Mecánica', checkpointId: 'CP-C', unlocked: false, emoji: '💰' },
    ],
  },
  {
    id: 'Electrónica',
    name: 'Perito en Electrónica',
    division: 'SR',
    color: '#2C3E73',
    stickers: [
      { id: 's19', name: 'Psicología', section: 'Perito en Electrónica', sectionId: 'Electrónica', checkpointId: 'CP-D', unlocked: false, emoji: '🧠' },
      { id: 's20', name: 'Circuitos Electrónicos', section: 'Perito en Electrónica', sectionId: 'Electrónica', checkpointId: 'CP-D', unlocked: false, emoji: '🔌' },
    ],
  },
  {
    id: 'historica',
    name: 'Colección Histórica',
    division: 'Histórica',
    color: '#D4BA46',
    stickers: [
      { id: 's21', name: 'Fundación 1961', section: 'Colección Histórica', sectionId: 'historica', checkpointId: 'CP-A', unlocked: false, emoji: '🏫' },
      { id: 's22', name: '25 Años de Trayectoria', section: 'Colección Histórica', sectionId: 'historica', checkpointId: 'CP-B', unlocked: false, emoji: '🏆' },
      { id: 's23', name: '65 Años Kinal', section: 'Colección Histórica', sectionId: 'historica', checkpointId: 'CP-C', unlocked: false, emoji: '🌟' },
    ],
  },
]

// ─── Historia / Timeline Data ─────────────────────────────────────────────────

export interface TimelineEntry {
  year: number
  title: string
  description: string
  type: 'institution' | 'career' | 'milestone'
  color: string
}

export const timelineEntries: TimelineEntry[] = [
   {
    year: 1961,
    title: 'Fundación de Kinal',
    description: 'El Centro Educativo Kinal abre sus puertas con el ciclo básico, con una visión de educación técnica de calidad en Guatemala.',
    type: 'institution',
    color: '#D4BA46',
  },
  {
    year: 1970,
    title: 'Primer Programa Técnico',
    description: 'Se inaugura el primer programa de Perito en Computación, siendo pioneros en educación tecnológica en el país.',
    type: 'career',
    color: '#2C3E73',
  },
  {
    year: 1985,
    title: 'Expansión del Campus',
    description: 'Construcción del Aula Magna y los laboratorios de computación modernos. El campus duplica su capacidad estudiantil.',
    type: 'milestone',
    color: '#F7931E',
  },
  {
    year: 1992,
    title: 'Perito en Mercadotecnia',
    description: 'Se lanza la carrera de Perito en Mercadotecnia, respondiendo a la demanda del mercado guatemalteco en crecimiento.',
    type: 'career',
    color: '#2C3E73',
  },
  {
    year: 1998,
    title: 'Bachillerato en Ciencias',
    description: 'Apertura del programa de Bachillerato en Ciencias y Letras, complementando la oferta educativa técnica con formación académica.',
    type: 'career',
    color: '#2C3E73',
  },
  {
    year: 2005,
    title: 'Era Digital',
    description: 'Kinal integra laboratorios de última generación y conectividad a internet en todo el campus, preparando a los estudiantes para la era digital.',
    type: 'milestone',
    color: '#F7931E',
  },
  {
    year: 2010,
    title: '50 Años de Excelencia',
    description: 'Celebración del 50 aniversario con la graduación de la generación más numerosa en la historia de Kinal: más de 400 estudiantes.',
    type: 'institution',
    color: '#D4BA46',
  },
  {
    year: 2020,
    title: 'Educación Híbrida',
    description: 'Kinal adapta su modelo educativo a modalidad híbrida, demostrando resiliencia y compromiso con la continuidad educativa.',
    type: 'milestone',
    color: '#F7931E',
  },
  {
    year: 2026,
    title: '65 Años Transformando Vidas',
    description: 'Hoy, Kinal celebra 65 años formando profesionales técnicos y académicos que impulsan el desarrollo de Guatemala.',
    type: 'institution',
    color: '#D4BA46',
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

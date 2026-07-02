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
      { id: 's1', name: 'Matemáticas I', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '📐' },
      { id: 's2', name: 'Idioma Español', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '📖' },
      { id: 's3', name: 'Computación', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '💻' },
      { id: 's4', name: 'Inglés', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '🌐' },
      { id: 's5', name: 'Artes Plasticas', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '🎨'},
      { id: 's6', name: 'Actitudes', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '🤝'},
      { id: 's7', name: 'Religión', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '🙏'},
      { id: 's8', name: 'Ciencias Naturales', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '🔬'},
      { id: 's9', name: 'Ciencias Sociales', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '🌍'},
      { id: 's10', name: 'Emprendimiento', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '🚀'},
      { id: 's11', name: 'Música', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '🎵'},
      { id: 's12', name: 'Kaqchikel', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '🌿'},
      { id: 's13', name: 'Industriales(M, E y EL)', section: 'Primero Básico', sectionId: 'basicos-1', checkpointId: 'CP-A', unlocked: false, emoji: '🛠️'},
      
    ],
  },
  {
    id: 'computacion',
    name: 'Perito en Informática',
    division: 'SR',
    color: '#D4BA46',
    stickers: [
      { id: 's16', name: '4to. Informatica', section: 'Perito en Informática', sectionId: 'computacion', checkpointId: 'CP-B', unlocked: false, emoji: '👨‍💻' },
      { id: 's17', name: '5to. Informatica', section: 'Perito en Informática', sectionId: 'computacion', checkpointId: 'CP-B', unlocked: false, emoji: '💻' },
      { id: 's18', name: '6to. Informatica', section: 'Perito en Informática', sectionId: 'computacion', checkpointId: 'CP-B', unlocked: false, emoji: '💾' },
    ],
  },
  {
    id: 'Mecánica',
    name: 'Perito en Mecánica Automotriz',
    division: 'SR',
    color: '#F7931E',
    stickers: [
      { id: 's19', name: '4to. Mecanica', section: 'Perito en Mecánica Automotriz', sectionId: 'Mecánica', checkpointId: 'CP-C', unlocked: false, emoji: '🔧' },
      { id: 's20', name: '5to. Mecanica', section: 'Perito en Mecánica Automotriz', sectionId: 'Mecánica', checkpointId: 'CP-C', unlocked: false, emoji: '⚙️' },
      { id: 's21', name: '6to. Mecanica', section: 'Perito en Mecánica Automotriz', sectionId: 'Mecánica', checkpointId: 'CP-C', unlocked: false, emoji: '🏎️' },
    ],
  },
  {
    id: 'Electrónica',
    name: 'Perito en Electrónica',
    division: 'SR',
    color: '#2C3E73',
    stickers: [
      { id: 's22', name: '4to. Electrónica', section: 'Perito en Electrónica', sectionId: 'Electrónica', checkpointId: 'CP-D', unlocked: false, emoji: '🔋' },
      { id: 's23', name: '5to. Electrónica', section: 'Perito en Electrónica', sectionId: 'Electrónica', checkpointId: 'CP-D', unlocked: false, emoji: '🔌' },
      { id: 's24', name: '6to. Electrónica', section: 'Perito en Electrónica', sectionId: 'Electrónica', checkpointId: 'CP-D', unlocked: false, emoji: '⚡' },
    ],
  },
  {
    id: 'Electricidad',
    name: 'Perito en Electricidad',
    division: 'SR',
    color: '#2C3E73',
    stickers: [
      { id: 's25', name: '4to. Electricidad', section: 'Perito en Electricidad', sectionId: 'Electricidad', checkpointId: 'CP-D', unlocked: false, emoji: '💡' },
      { id: 's26', name: '5to. Electricidad', section: 'Perito en Electricidad', sectionId: 'Electricidad', checkpointId: 'CP-D', unlocked: false, emoji: '🌀' },
      { id: 's27', name: '6to. Electricidad', section: 'Perito en Electricidad', sectionId: 'Electricidad', checkpointId: 'CP-D', unlocked: false, emoji: '🗼' },
    ],
  },
  {
    id: 'Dibujo Técnico',
    name: 'Perito en Dibujo Técnico',
    division: 'SR',
    color: '#2C3E73',
    stickers: [
      { id: 's28', name: '4to. Dibujo Técnico', section: 'Perito en Dibujo Técnico', sectionId: 'Dibujo Técnico', checkpointId: 'CP-D', unlocked: false, emoji: '📐' },
      { id: 's29', name: '5to. Dibujo Técnico', section: 'Perito en Dibujo Técnico', sectionId: 'Dibujo Técnico', checkpointId: 'CP-D', unlocked: false, emoji: '✏️' },
      { id: 's30', name: '6to. Dibujo Técnico', section: 'Perito en Dibujo Técnico', sectionId: 'Dibujo Técnico', checkpointId: 'CP-D', unlocked: false, emoji: '🏗️' },
    ],
  },
  {
    id: 'historica',
    name: 'Colección Histórica',
    division: 'Histórica',
    color: '#D4BA46',
    stickers: [
      { id: 's31', name: 'Fundación 1961', section: 'Colección Histórica', sectionId: 'historica', checkpointId: 'CP-A', unlocked: false, emoji: '🏫' },
      { id: 's32', name: '25 Años de Trayectoria', section: 'Colección Histórica', sectionId: 'historica', checkpointId: 'CP-B', unlocked: false, emoji: '🏆' },
      { id: 's33', name: '65 Años Kinal', section: 'Colección Histórica', sectionId: 'historica', checkpointId: 'CP-C', unlocked: false, emoji: '💎' },
    ],
  },
]

// ─── Historia / Timeline Data ─────────────────────────────────────────────────

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

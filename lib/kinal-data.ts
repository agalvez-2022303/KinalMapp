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
  { id: 'poi-1', label: 'Entrada Principal', x: 50, y: 30, type: 'building', description: 'Acceso principal — 6A Av. 13-54, Zona 7, Guatemala.', lat: 14.62598, lng: -90.53552 },
  { id: 'poi-ba-1', label: 'Matemáticas I', x: 12, y: 38, type: 'checkpoint', description: 'Estampita: Matemáticas I', checkpointId: 'CP-BA-1', lat: 14.62638, lng: -90.53580 },
  { id: 'poi-ba-2', label: 'Idioma Español', x: 16, y: 42, type: 'checkpoint', description: 'Estampita: Idioma Español', checkpointId: 'CP-BA-2', lat: 14.62640, lng: -90.53576 },
  { id: 'poi-ba-3', label: 'Computación', x: 20, y: 38, type: 'checkpoint', description: 'Estampita: Computación', checkpointId: 'CP-BA-3', lat: 14.62636, lng: -90.53572 },
  { id: 'poi-ba-4', label: 'Inglés', x: 24, y: 42, type: 'checkpoint', description: 'Estampita: Inglés', checkpointId: 'CP-BA-4', lat: 14.62638, lng: -90.53568 },
  { id: 'poi-ba-5', label: 'Artes Plásticas', x: 14, y: 46, type: 'checkpoint', description: 'Estampita: Artes Plásticas', checkpointId: 'CP-BA-5', lat: 14.62642, lng: -90.53574 },
  { id: 'poi-ba-6', label: 'Actitudes', x: 18, y: 50, type: 'checkpoint', description: 'Estampita: Actitudes', checkpointId: 'CP-BA-6', lat: 14.62644, lng: -90.53570 },
  { id: 'poi-ba-7', label: 'Religión', x: 22, y: 46, type: 'checkpoint', description: 'Estampita: Religión', checkpointId: 'CP-BA-7', lat: 14.62640, lng: -90.53566 },
  { id: 'poi-ba-8', label: 'Ciencias Naturales', x: 26, y: 50, type: 'checkpoint', description: 'Estampita: Ciencias Naturales', checkpointId: 'CP-BA-8', lat: 14.62642, lng: -90.53562 },
  { id: 'poi-ba-9', label: 'Ciencias Sociales', x: 14, y: 54, type: 'checkpoint', description: 'Estampita: Ciencias Sociales', checkpointId: 'CP-BA-9', lat: 14.62646, lng: -90.53568 },
  { id: 'poi-ba-10', label: 'Emprendimiento', x: 18, y: 58, type: 'checkpoint', description: 'Estampita: Emprendimiento', checkpointId: 'CP-BA-10', lat: 14.62648, lng: -90.53564 },
  { id: 'poi-ba-11', label: 'Música', x: 22, y: 54, type: 'checkpoint', description: 'Estampita: Música', checkpointId: 'CP-BA-11', lat: 14.62644, lng: -90.53560 },
  { id: 'poi-ba-12', label: 'Kaqchikel', x: 26, y: 58, type: 'checkpoint', description: 'Estampita: Kaqchikel', checkpointId: 'CP-BA-12', lat: 14.62646, lng: -90.53556 },
  { id: 'poi-ba-13', label: 'BA-Mecánica', x: 14, y: 62, type: 'checkpoint', description: 'Estampita: BA-Mecánica', checkpointId: 'CP-BA-13', lat: 14.62650, lng: -90.53562 },
  { id: 'poi-ba-14', label: 'BA-Electricidad', x: 18, y: 66, type: 'checkpoint', description: 'Estampita: BA-Electricidad', checkpointId: 'CP-BA-14', lat: 14.62652, lng: -90.53558 },
  { id: 'poi-ba-15', label: 'BA-Electrónica', x: 22, y: 62, type: 'checkpoint', description: 'Estampita: BA-Electrónica', checkpointId: 'CP-BA-15', lat: 14.62648, lng: -90.53554 },
  { id: 'poi-inf-1', label: '4to Informática', x: 62, y: 46, type: 'checkpoint', description: 'Estampita: 4to Informática', checkpointId: 'CP-INF-1', lat: 14.62628, lng: -90.53518 },
  { id: 'poi-inf-2', label: '5to Informática', x: 66, y: 50, type: 'checkpoint', description: 'Estampita: 5to Informática', checkpointId: 'CP-INF-2', lat: 14.62626, lng: -90.53514 },
  { id: 'poi-inf-3', label: '6to Informática', x: 70, y: 46, type: 'checkpoint', description: 'Estampita: 6to Informática', checkpointId: 'CP-INF-3', lat: 14.62624, lng: -90.53510 },
  { id: 'poi-mec-1', label: '4to Mecánica', x: 38, y: 64, type: 'checkpoint', description: 'Estampita: 4to Mecánica', checkpointId: 'CP-MEC-1', lat: 14.62588, lng: -90.53530 },
  { id: 'poi-mec-2', label: '5to Mecánica', x: 42, y: 68, type: 'checkpoint', description: 'Estampita: 5to Mecánica', checkpointId: 'CP-MEC-2', lat: 14.62586, lng: -90.53526 },
  { id: 'poi-mec-3', label: '6to Mecánica', x: 46, y: 64, type: 'checkpoint', description: 'Estampita: 6to Mecánica', checkpointId: 'CP-MEC-3', lat: 14.62584, lng: -90.53522 },
  { id: 'poi-ele-1', label: '4to Electrónica', x: 24, y: 60, type: 'checkpoint', description: 'Estampita: 4to Electrónica', checkpointId: 'CP-ELE-1', lat: 14.62594, lng: -90.53582 },
  { id: 'poi-ele-2', label: '5to Electrónica', x: 28, y: 64, type: 'checkpoint', description: 'Estampita: 5to Electrónica', checkpointId: 'CP-ELE-2', lat: 14.62592, lng: -90.53578 },
  { id: 'poi-ele-3', label: '6to Electrónica', x: 32, y: 60, type: 'checkpoint', description: 'Estampita: 6to Electrónica', checkpointId: 'CP-ELE-3', lat: 14.62590, lng: -90.53574 },
  { id: 'poi-elc-1', label: '4to Electricidad', x: 64, y: 22, type: 'checkpoint', description: 'Estampita: 4to Electricidad', checkpointId: 'CP-ELC-1', lat: 14.62650, lng: -90.53506 },
  { id: 'poi-elc-2', label: '5to Electricidad', x: 68, y: 26, type: 'checkpoint', description: 'Estampita: 5to Electricidad', checkpointId: 'CP-ELC-2', lat: 14.62648, lng: -90.53502 },
  { id: 'poi-elc-3', label: '6to Electricidad', x: 72, y: 22, type: 'checkpoint', description: 'Estampita: 6to Electricidad', checkpointId: 'CP-ELC-3', lat: 14.62646, lng: -90.53498 },
  { id: 'poi-dib-1', label: '4to Dibujo Técnico', x: 52, y: 76, type: 'checkpoint', description: 'Estampita: 4to Dibujo Técnico', checkpointId: 'CP-DIB-1', lat: 14.62570, lng: -90.53516 },
  { id: 'poi-dib-2', label: '5to Dibujo Técnico', x: 56, y: 80, type: 'checkpoint', description: 'Estampita: 5to Dibujo Técnico', checkpointId: 'CP-DIB-2', lat: 14.62568, lng: -90.53512 },
  { id: 'poi-dib-3', label: '6to Dibujo Técnico', x: 60, y: 76, type: 'checkpoint', description: 'Estampita: 6to Dibujo Técnico', checkpointId: 'CP-DIB-3', lat: 14.62566, lng: -90.53508 },
  { id: 'poi-his-1', label: 'Fundación 1961', x: 12, y: 74, type: 'checkpoint', description: 'Estampita: Fundación 1961', checkpointId: 'CP-HIS-1', lat: 14.62576, lng: -90.53568 },
  { id: 'poi-his-2', label: '25 Años de Trayectoria', x: 16, y: 78, type: 'checkpoint', description: 'Estampita: 25 Años de Trayectoria', checkpointId: 'CP-HIS-2', lat: 14.62574, lng: -90.53564 },
  { id: 'poi-his-3', label: '65 Años Kinal', x: 20, y: 74, type: 'checkpoint', description: 'Estampita: 65 Años Kinal', checkpointId: 'CP-HIS-3', lat: 14.62572, lng: -90.53560 },
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

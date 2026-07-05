'use client'

import Link from "next/link"

interface PostData {
  id: number
  time: string
  location: string
  avatarOpacity?: number
  avatarAccent?: "yellow" | "orange"
  bgColor: string
  iconType: string
  placeIconColor: string
  placeIconBorder: string
  timestamp: string
  timestampColor: string
  title: string
  titleOpacity?: number
  sublocation: string
  caption: string
  captionTime: string
  decoCircles: Array<{
    width: number
    height: number
    bg: string
    top?: number | string
    bottom?: number | string
    left?: number | string
    right?: number | string
  }>
}

const POSTS: PostData[] = [
  {
    id: 1,
    time: "Hace 10 min",
    location: "Kinal · Hace 10 min",
    avatarAccent: "yellow",
    bgColor: "#1a2340",
    iconType: "business",
    placeIconColor: "#D4BA46",
    placeIconBorder: "rgba(212,186,70,0.3)",
    timestamp: "Hoy · Hace 10 min",
    timestampColor: "#D4BA46",
    title: "Taller de Electromecánica",
    sublocation: "Edificio B – Planta Baja",
    caption: "Visitaste este lugar en tu recorrido de hoy.",
    captionTime: "Hace 10 minutos",
    decoCircles: [
      { width: 140, height: 140, bg: "rgba(212,186,70,0.06)", top: -30, left: -30 },
      { width: 90, height: 90, bg: "rgba(44,62,115,0.4)", top: 40, right: -20 },
    ],
  },
  {
    id: 2,
    time: "10:45 AM",
    location: "Kinal · 10:45 AM",
    avatarAccent: "orange",
    bgColor: "#18202e",
    iconType: "restaurant",
    placeIconColor: "#F7931E",
    placeIconBorder: "rgba(247,147,30,0.3)",
    timestamp: "Hoy · 10:45 AM",
    timestampColor: "#F7931E",
    title: "Cafetería Central",
    sublocation: "Área de descanso",
    caption: "Pasaste por aquí esta mañana.",
    captionTime: "10:45 AM",
    decoCircles: [
      { width: 100, height: 100, bg: "rgba(247,147,30,0.08)", bottom: -20, right: 20 },
      { width: 60, height: 60, bg: "rgba(212,186,70,0.05)", top: 20, left: 20 },
    ],
  },
  {
    id: 3,
    time: "Ayer 02:15 PM",
    location: "Kinal · Ayer 02:15 PM",
    avatarOpacity: 0.6,
    bgColor: "#152030",
    iconType: "science",
    placeIconColor: "rgba(212,186,70,0.5)",
    placeIconBorder: "rgba(212,186,70,0.15)",
    timestamp: "Ayer · 02:15 PM",
    timestampColor: "rgba(212,186,70,0.5)",
    title: "Laboratorio de Química",
    titleOpacity: 0.65,
    sublocation: "Edificio C – Nivel 2",
    caption: "Un recuerdo de ayer en el campus.",
    captionTime: "Ayer · 02:15 PM",
    decoCircles: [
      { width: 120, height: 120, bg: "rgba(44,62,115,0.3)", top: -20, right: -20 },
    ],
  },
  {
    id: 4,
    time: "Ayer 09:00 AM",
    location: "Kinal · Ayer 09:00 AM",
    avatarOpacity: 0.6,
    bgColor: "#152030",
    iconType: "school",
    placeIconColor: "rgba(212,186,70,0.5)",
    placeIconBorder: "rgba(212,186,70,0.15)",
    timestamp: "Ayer · 09:00 AM",
    timestampColor: "rgba(212,186,70,0.5)",
    title: "Auditorio Kinal",
    titleOpacity: 0.65,
    sublocation: "Evento: Expo Kinal 2026",
    caption: "Estuviste en la Expo Kinal 2026.",
    captionTime: "Ayer · 09:00 AM",
    decoCircles: [
      { width: 80, height: 80, bg: "rgba(247,147,30,0.06)", top: 30, left: 10 },
    ],
  },
  {
    id: 5,
    time: "Ayer",
    location: "Kinal · Ayer",
    avatarOpacity: 0.6,
    bgColor: "#152030",
    iconType: "desktop_windows",
    placeIconColor: "rgba(212,186,70,0.5)",
    placeIconBorder: "rgba(212,186,70,0.15)",
    timestamp: "Ayer",
    timestampColor: "rgba(212,186,70,0.5)",
    title: "Centro de Cómputo 3",
    titleOpacity: 0.65,
    sublocation: "Edificio A – Nivel 3",
    caption: "Otro día de trabajo en el campus.",
    captionTime: "Ayer",
    decoCircles: [
      { width: 100, height: 100, bg: "rgba(44,62,115,0.25)", bottom: 20, right: -10 },
    ],
  },
]

function Post({ post, isLast }: { post: PostData; isLast: boolean }) {
  return (
    <div className={isLast ? "" : "border-b-8 border-[#F8F9FB]"}>
      {/* Post Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-3 border-b-[0.5px] border-gray-200">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
          style={{
            background: "#2C3E73",
            color: post.avatarAccent === "orange" ? "#F7931E" : "#D4BA46",
            opacity: post.avatarOpacity ?? 1,
          }}
        >
          <span className="material-symbols-outlined text-sm text-white">location_on</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-primary">kinalmap.gt</div>
          <div className="text-[11px] text-gray-500">{post.location}</div>
        </div>
        <span className="material-symbols-outlined text-[#757575] text-lg">more_horiz</span>
      </div>

      {/* Post Image */}
      <div
        className="w-full aspect-square flex flex-col justify-end p-6 relative overflow-hidden"
        style={{ background: post.bgColor }}
      >
        {/* Deco circles */}
        {post.decoCircles.map((c, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: c.width,
              height: c.height,
              background: c.bg,
              top: c.top,
              bottom: c.bottom,
              left: c.left,
              right: c.right,
            }}
          />
        ))}

        {/* Place icon circle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[72px] h-[72px] rounded-full flex items-center justify-center text-[28px]"
          style={{
            transform: "translate(-50%, -68%)",
            background: "rgba(255,255,255,0.06)",
            border: `1.5px solid ${post.placeIconBorder}`,
            color: post.placeIconColor,
          }}
        >
          <span className="material-symbols-outlined text-[28px]">{post.iconType}</span>
        </div>

        {/* Text */}
        <div className="relative z-10">
          <div
            className="text-[10px] font-semibold tracking-wider uppercase mb-1.5"
            style={{ color: post.timestampColor }}
          >
            {post.timestamp}
          </div>
          <h2
            className="text-xl font-bold leading-tight mb-1"
            style={{ color: post.titleOpacity ? `rgba(255,255,255,${post.titleOpacity})` : "#ffffff" }}
          >
            {post.title}
          </h2>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
            {post.sublocation}
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="px-3.5 py-3">
        <div className="text-[13px] text-gray-700 leading-relaxed">
          <strong className="text-primary">kinalmap.gt</strong> {post.caption}
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1.5">
          {post.captionTime}
        </div>
      </div>
    </div>
  )
}

export default function HistoriaPage() {
  return (
    <div className="showcase-grid-bg min-h-dvh h-dvh w-full flex items-center justify-center p-0 md:p-6 overflow-hidden">
      {/* Desktop side panel */}
      <div className="hidden lg:flex flex-col justify-center max-w-sm mr-12 text-white space-y-6 select-none animate-in fade-in slide-in-from-left duration-700">
        <div className="space-y-2">
          <span className="px-3.5 py-1 text-[10px] font-extrabold tracking-widest text-[#fee269] bg-[#2C3E73] rounded-full border border-[#fee269]/30 uppercase">
            Expo Kinal 2026
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Historia</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Tu recorrido por el campus en formato de historias. Cada visita registrada aparece como un recuerdo.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
          <h3 className="text-xs font-bold text-[#fee269] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">info</span> Tu actividad
          </h3>
          <ul className="text-xs text-gray-300 space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="text-[#fee269] font-bold">•</span>
              <span>Cada QR que escaneas genera una historia nueva.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#fee269] font-bold">•</span>
              <span>Las historias más recientes aparecen primero.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Phone Simulator Frame */}
      <div className="w-full h-full md:max-w-[412px] md:h-[844px] md:smartphone-simulator flex flex-col bg-background relative animate-in zoom-in-95 duration-500">
        <div className="hidden md:flex smartphone-camera-notch">
          <div className="smartphone-speaker"></div>
        </div>

        <div className="flex flex-col w-full h-full overflow-hidden pt-0 md:pt-4">
          {/* Header */}
          <header className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm z-10">
            <div className="flex items-center justify-between px-container-margin h-14 w-full max-w-md mx-auto">
              <Link href="/" className="text-primary hover:underline cursor-pointer">
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </Link>
              <h1 className="font-extrabold text-sm text-primary tracking-tight">Historia Kinal</h1>
              <div className="w-6" />
            </div>
          </header>

          {/* Feed */}
          <main className="flex-1 overflow-y-auto hide-scrollbar" style={{ background: '#f5f6fa' }}>
            {POSTS.map((post, i) => (
              <Post key={post.id} post={post} isLast={i === POSTS.length - 1} />
            ))}
          </main>
        </div>
      </div>
    </div>
  )
}

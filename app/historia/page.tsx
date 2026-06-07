import Link from "next/link"
import MobileFrame from "@/components/kinal/MobileFrame"

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
    iconType: "fa-solid fa-building",
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
    iconType: "fa-solid fa-utensils",
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
    iconType: "fa-solid fa-flask",
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
    iconType: "fa-solid fa-graduation-cap",
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
    iconType: "fa-solid fa-computer",
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
    <div
      style={{
        background: "#ffffff",
        borderBottom: isLast ? "none" : "8px solid #F8F9FB",
      }}
    >
      {/* Post Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 14px",
          borderBottom: "0.5px solid #eeeeee",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#2C3E73",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: post.avatarAccent === "orange" ? "#F7931E" : "#D4BA46",
            fontSize: 15,
            flexShrink: 0,
            opacity: post.avatarOpacity ?? 1,
          }}
        >
          <i className="fa-solid fa-map-pin" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#2C3E73" }}>kinalmap.gt</div>
          <div style={{ fontSize: 11, color: "#757575" }}>{post.location}</div>
        </div>
        <i className="fa-solid fa-ellipsis" style={{ color: "#757575" }} />
      </div>

      {/* Post Image */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1/1",
          background: post.bgColor,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Deco circles */}
        {post.decoCircles.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
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
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -68%)",
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: `1.5px solid ${post.placeIconBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: post.placeIconColor,
            fontSize: 28,
          }}
        >
          <i className={post.iconType} />
        </div>

        {/* Text */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: post.timestampColor,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            {post.timestamp}
          </div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: post.titleOpacity ? `rgba(255,255,255,${post.titleOpacity})` : "#ffffff",
              lineHeight: 1.25,
              marginBottom: 5,
            }}
          >
            {post.title}
          </h2>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
            {post.sublocation}
          </div>
        </div>
      </div>

      {/* Caption */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontSize: 13, color: "#333", lineHeight: 1.5 }}>
          <strong style={{ color: "#2C3E73" }}>kinalmap.gt</strong> {post.caption}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#757575",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginTop: 6,
          }}
        >
          {post.captionTime}
        </div>
      </div>
    </div>
  )
}

export default function HistoriaPage() {
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
        {/* Header */}
        <header
          style={{
            background: "#ffffff",
            padding: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            zIndex: 10,
            flexShrink: 0,
          }}
        >
          <Link href="/" style={{ color: "#2C3E73", textDecoration: "none" }}>
            <i className="fa-solid fa-chevron-left" style={{ fontSize: "1.2rem" }} />
          </Link>
          <span style={{ color: "#2C3E73", fontWeight: 800, fontSize: "1.1rem" }}>
            Historia Kinal
          </span>
          <div style={{ width: 24 }} />
        </header>

        {/* Feed */}
        <div className="hide-scrollbar" style={{ flexGrow: 1, overflowY: "auto" }}>
          {POSTS.map((post, i) => (
            <Post key={post.id} post={post} isLast={i === POSTS.length - 1} />
          ))}
        </div>
      </MobileFrame>
    </main>
  )
}

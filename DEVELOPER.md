# KinalMap — Documentación para Desarrollador Web

> App móvil PWA del **Colegio Técnico Laboral Kinal** para su Exposición Anual.  
> Permite a los estudiantes/visitantes escanear checkpoints QR, coleccionar estampas digitales y explorar el campus en un mapa satelital interactivo.

---

## 🗂️ Estructura del Proyecto

```
KinalMAaa/
├── app/
│   ├── layout.tsx          # Root layout (metadatos, fuentes, providers)
│   ├── page.tsx            # App Shell principal — orquesta las vistas
│   ├── globals.css         # Tokens de diseño + utilidades CSS globales
│   ├── historia/
│   │   └── page.tsx        # Ruta standalone /historia (vista completa)
│   └── mapa/
│       └── page.tsx        # Ruta standalone /mapa (vista completa)
├── components/
│   └── kinal/
│       ├── BottomNav.tsx   # Barra de navegación inferior (5 tabs)
│       ├── HomeView.tsx    # Vista de inicio (dashboard principal)
│       ├── MapView.tsx     # Vista del mapa (dentro de la app shell)
│       ├── KinalMap.tsx    # Componente Leaflet + Google Maps tiles
│       ├── ScannerView.tsx # Escáner de códigos QR
│       ├── AlbumView.tsx   # Álbum de estampas (tipo libro con flip)
│       ├── HistoriaView.tsx# Línea de tiempo histórica de Kinal
│       └── MobileFrame.tsx # Frame de "teléfono" para vistas demo
└── lib/
    ├── store.ts            # Estado global (hook useAppStore)
    └── kinal-data.ts       # Toda la data estática (POIs, stickers, eventos)
```

---

## 🎨 Sistema de Diseño (Design Tokens)

### Paleta de Colores Principal

| Token CSS          | Hex       | Uso                                      |
|--------------------|-----------|------------------------------------------|
| `--navy` / primary | `#2C3E73` | Headers, botones primarios, fondo dark   |
| `--gold` / secondary| `#D4BA46`| Acentos, badges, tabs activos, checkmarks|
| `--orange` / accent| `#F7931E` | Botón QR flotante, eventos, CTAs          |
| `--white`          | `#ffffff` | Cards, fondo de contenido                |
| Background         | `#f5f6fa` | Fondo general de la app                  |
| Dark background    | `#0d1420` | Fondo del escáner                        |
| Dark navy          | `#1a2340` | Variante oscura para gradientes          |

### Tipografía

- **Fuente**: `Inter` (Google Fonts, cargada en `layout.tsx`)
- **Pesos usados**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)
- Sistema: Tailwind CSS v4 + clases inline con `style={{}}`

### Animaciones CSS definidas en `globals.css`

| Clase          | Efecto                                      |
|----------------|---------------------------------------------|
| `.shimmer`     | Brillo deslizante sobre stickers desbloqueados |
| `.pulse-ring`  | Anillo pulsante en checkpoints del mapa     |
| `.sticker-pop` | Pop de escala al desbloquear una estampa    |
| `.book-page`   | Flip 3D de página del álbum (preserve-3d)  |
| `.book-spine`  | Gradiente de lomo del libro                 |

---

## 🧩 Vistas y Componentes

### 1. `HomeView.tsx` — Pantalla de Inicio

**Props recibidas:**
```ts
{
  progressPercent: number   // 0-100, % de stickers completados
  unlockedStickers: number  // cuántas estampas desbloqueadas
  totalStickers: number     // total de estampas (actualmente 23)
  onNavigate: (v: View) => void  // callback para cambiar de pestaña
}
```

**Secciones de la pantalla (de arriba abajo):**

1. **Header**: Logo "KinalMap" + badge con `progressPercent%` en dorado
2. **Progress Banner**: Tarjeta con barra de progreso, contador `X/23 estampas`, texto del próximo reward
3. **Quick Actions** (grid 2x2): Botones de acceso rápido → Mapa, Escanear, Álbum, Historia
4. **Eventos de Hoy**: Lista horizontal de cards con hora, título y color
5. **Próxima Recompensa**: Card que muestra el próximo hito (25%, 50%, 100%)

**Oportunidades de mejora UI:**
- El header podría tener una imagen de fondo o gradiente animado
- Las Quick Actions son rectangulares y planas; podrían ser cards con sombra, íconos más grandes y micro-animaciones al hover
- Los eventos de hoy podrían tener un indicador de "en curso" si la hora ya pasó
- Agregar una sección de "Ranking" o leaderboard si hay múltiples usuarios

---

### 2. `MapView.tsx` — Mapa del Campus

**Props recibidas:**
```ts
{
  unlockedCheckpoints: string[]  // ej: ['CP-A', 'CP-B']
}
```

**Estructura:**
1. **Header azul**: Título + chips de filtro horizontal (Todos / Checkpoints / Eventos / Edificios)
2. **Mapa interactivo**: `KinalMap` cargado dinámicamente (SSR desactivado)
3. **Leyenda**: Overlay superior derecho con los tipos de marcadores
4. **Popup inferior**: Tarjeta que aparece al hacer clic en un marcador (label, descripción, estado del checkpoint)

**Estado del mapa (`KinalMap.tsx`):**
- Usa **React-Leaflet** + teselas de **Google Maps Hybrid** (`lyrs=y`)
- Centro: `lat: 14.62611, lng: -90.53540` (Kinal, Zona 7, Guatemala)
- Zoom inicial: **19** (vista muy cercana al campus)
- Marcadores: `L.DivIcon` con círculos HTML coloreados
  - 🏢 Edificio → Azul `#2C3E73`
  - ★ Evento → Naranja `#F7931E`
  - ⬡ Checkpoint bloqueado → Dorado `#D4BA46`
  - ✓ Checkpoint desbloqueado → Verde `#22c55e`

**Oportunidades de mejora UI:**
- La leyenda superior derecha es pequeña; podría ser un drawer deslizable
- Los chips de filtro son simples; podrían tener íconos y animación al seleccionar
- El popup inferior podría incluir una foto del edificio o un mapa mini
- Agregar un botón de "Cómo llegar" que abra Google Maps externo con la dirección
- Animación de pulsación para checkpoints no escaneados (ya hay CSS `.pulse-ring` disponible)

---

### 3. `ScannerView.tsx` — Escáner QR

**Props recibidas:**
```ts
{
  unlockedCheckpoints: string[]
  onAutocomplete: () => { newlyUnlocked: string[] }
}
```

**Flujo de estados (`ScanState`):**
```
idle → scanning → success | already | error
```

| Estado     | UI mostrada                                        |
|------------|----------------------------------------------------|
| `idle`     | Ícono de cámara + botón "Activar Cámara"           |
| `scanning` | Cámara activa + overlay de marco con esquinas doradas + línea animada |
| `success`  | ✅ Verde + mensaje + contador de estampas desbloqueadas |
| `already`  | ⬡ Dorado + "Ya escaneaste este checkpoint"         |
| `error`    | ❌ Rojo + mensaje de error                         |

**Lógica del escaneo:**
- Al escanear **cualquier checkpoint válido** (CP-A, CP-B, CP-C, CP-D), se autocompleta **todo el álbum** y se guarda en `localStorage`
- Usa la librería **html5-qrcode** (cargada dinámicamente)
- El código QR detectado se convierte a mayúsculas y se busca en `VALID_CHECKPOINTS`

**Oportunidades de mejora UI:**
- El fondo negro del área de cámara es muy plano; podría tener un gradiente oscuro más estético
- Las esquinas del marco scanner son básicas; pueden ser más elaboradas (animación de pulso, glow dorado)
- La pantalla de éxito podría tener una animación de confetti o partículas
- El botón "Activar Cámara" podría tener un efecto de onda (ripple) al presionarlo
- Agregar una animación de transición entre estados (fade-in)

---

### 4. `AlbumView.tsx` — Álbum de Estampas

**Props recibidas:**
```ts
{
  sections: AlbumSection[]
  progressPercent: number
  unlockedStickers: number
  totalStickers: number
}
```

**Estructura de datos de una sección:**
```ts
AlbumSection {
  id: string
  name: string           // ej: 'Perito en Computación'
  division: 'JR' | 'SR' | 'Histórica'
  color: string          // color del header de la sección
  stickers: Sticker[]
}

Sticker {
  id: string
  name: string           // ej: 'Programación'
  emoji: string          // ej: '👨‍💻'
  unlocked: boolean
  checkpointId: string   // qué QR lo desbloquea
}
```

**Secciones del álbum (7 en total):**

| Sección                   | División  | Stickers | QRs que desbloquean |
|---------------------------|-----------|----------|---------------------|
| Primero Básico            | JR        | 4        | CP-A, CP-B          |
| Segundo Básico            | JR        | 4        | CP-A, CP-C          |
| Tercero Básico            | JR        | 4        | CP-B, CP-D          |
| Perito en Computación     | SR        | 3        | CP-B                |
| Perito en Mercadotecnia   | SR        | 3        | CP-C                |
| Bachillerato en Ciencias  | SR        | 2        | CP-D                |
| Colección Histórica       | Histórica | 3        | CP-A, CP-B, CP-C    |

**Total: 23 stickers**

**Efecto visual del álbum:**
- Implementado como un **libro 3D** con flip de páginas usando CSS `transform: rotateY(-180deg)`
- La clase `.book-page.flipped` activa la animación de voltear
- Stickers bloqueados se muestran con `opacity: 0.3` y un fondo gris, sin emoji
- Al desbloquearse aplica la animación `.sticker-pop`

**Oportunidades de mejora UI:**
- El álbum podría tener una cubierta más visual (imagen del colegio, nombre dorado en relieve)
- Los stickers bloqueados podrían tener un efecto de "silueta" más dramático
- Agregar sonido (opcional) al voltear páginas
- Las secciones podrían tener ilustraciones temáticas de fondo
- El indicador de progreso al tope podría ser una barra más visual (animated fill)
- Añadir una pantalla de "¡Álbum Completo!" con animación cuando se llega al 100%

---

### 5. `HistoriaView.tsx` — Línea de Tiempo

**Sin props** — datos estáticos de `kinal-data.ts`

**Datos de la línea de tiempo (9 entradas):**

| Año  | Tipo         | Color   |
|------|--------------|---------|
| 1961 | institution  | Dorado  |
| 1970 | career       | Azul    |
| 1985 | milestone    | Naranja |
| 1992 | career       | Azul    |
| 1998 | career       | Azul    |
| 2005 | milestone    | Naranja |
| 2010 | institution  | Dorado  |
| 2020 | milestone    | Naranja |
| 2026 | institution  | Dorado  |

**Oportunidades de mejora UI:**
- La línea de tiempo podría tener un estilo de "vertical scroll storytelling" con fotos o ilustraciones
- Cada entrada podría expandirse con un acordeón para mostrar más detalles
- Agregar íconos temáticos por `type` (🏫 institution, 💻 career, 🏆 milestone)
- La entrada de 2026 ("65 Años") podría tener un tratamiento especial (más grande, animada)

---

### 6. `BottomNav.tsx` — Navegación Inferior

5 tabs:

| Tab       | Ícono (lucide) | Vista       |
|-----------|---------------|-------------|
| Inicio    | `Home`        | `home`      |
| Mapa      | `Map`         | `map`       |
| Escanear  | `QrCode`      | `scanner`   |
| Álbum     | `BookOpen`    | `album`     |
| Historia  | `Clock`       | `historia`  |

**Comportamiento especial:**
- El tab **Escanear** (centro) es un **botón circular flotante** que sube 20px sobre la barra
- Color activo: `#F7931E` (naranja), inactivo: `#2C3E73` (azul)
- Los otros tabs tienen background `#D4BA46` (dorado) cuando están activos

**Oportunidades de mejora UI:**
- El tab activo podría tener un indicador superior (línea o punto) en lugar de solo color
- El botón QR podría tener un efecto de glow/sombra más prominente
- Agregar una burbuja de notificación en el tab "Álbum" mostrando cuántas estampas hay disponibles para desbloquear

---

## 🗄️ Estado Global — `useAppStore`

Todo el estado se maneja con un **hook de React** simple (sin Zustand/Redux):

```ts
const {
  sections,              // AlbumSection[] — toda la data del álbum con estado unlocked
  unlockedCheckpoints,   // string[] — ej: ['CP-A', 'CP-B']
  totalStickers,         // number — 23
  unlockedStickers,      // number — cuántas están desbloqueadas
  progressPercent,       // number — 0 a 100
  unlockCheckpoint,      // fn(checkpointId) → desbloquea 1 checkpoint y sus stickers
  autocompleteAlbum,     // fn() → desbloquea TODO el álbum
  resetAlbum,            // fn() → resetea todo a cero
} = useAppStore()
```

**Persistencia en `localStorage`:**
- Stickers: `kinalmap-album-v1` (JSON con estado unlocked de cada sticker)
- Checkpoints: `kinalmap-checkpoints-v1` (array de IDs escaneados)

---

## 🔗 Puntos de Interés del Mapa (POIs)

Los 8 POIs están definidos en `lib/kinal-data.ts`:

```ts
interface MapPOI {
  id: string
  label: string
  type: 'checkpoint' | 'event' | 'building'
  description: string
  checkpointId?: string   // solo si type === 'checkpoint'
  lat: number             // coordenada GPS
  lng: number             // coordenada GPS
}
```

| ID     | Label              | Tipo        | Coordenadas aproximadas      |
|--------|--------------------|-------------|------------------------------|
| poi-1  | Entrada Principal  | building    | 14.62598, -90.53552          |
| poi-2  | Checkpoint A       | checkpoint  | 14.62638, -90.53572 (norte)  |
| poi-3  | Checkpoint B       | checkpoint  | 14.62625, -90.53510 (este)   |
| poi-4  | Checkpoint C       | checkpoint  | 14.62583, -90.53522 (sur)    |
| poi-5  | Exposición REDES   | event       | 14.62648, -90.53498 (NE)     |
| poi-6  | Exposición PROG    | event       | 14.62590, -90.53575 (oeste)  |
| poi-7  | Checkpoint D       | checkpoint  | 14.62565, -90.53508 (SE)     |
| poi-8  | Cafetería          | building    | 14.62572, -90.53560 (centro) |

> ⚠️ **Nota**: Las coordenadas de los POIs son aproximadas. Para ajustarlas a los edificios exactos se necesita abrir Google Maps en modo satélite y verificar visualmente.

---

## 📦 Dependencias Clave

| Paquete              | Versión   | Uso                              |
|----------------------|-----------|----------------------------------|
| `next`               | 16.2.6    | Framework (App Router + Turbopack)|
| `react`              | ^19       | UI                               |
| `tailwindcss`        | ^4.2.0    | Estilos utilitarios              |
| `leaflet`            | ^1.9.4    | Mapas interactivos               |
| `react-leaflet`      | ^5.0.0    | Wrapper React de Leaflet         |
| `html5-qrcode`       | ^2.3.8    | Escaneo de códigos QR con cámara |
| `lucide-react`       | ^0.564.0  | Librería de íconos               |
| `@radix-ui/*`        | varios    | Componentes UI accesibles        |
| `tw-animate-css`     | 1.3.3     | Animaciones adicionales          |

---

## 🚀 Comandos

```bash
# Instalar dependencias
pnpm install

# Dev server (localhost:3000)
pnpm dev

# Build de producción
pnpm build
```

---

## 📋 Checklist de Mejoras UI Prioritarias

### Alto impacto / fácil de implementar
- [ ] **HomeView**: Quick Actions con cards de glassmorphism, sombras y hover effects
- [ ] **BottomNav**: Bubble de notificación en tab Álbum con stickers disponibles
- [ ] **ScannerView**: Animación de éxito más elaborada (confetti, escala del ícono)
- [ ] **AlbumView**: Cubierta del libro más visual con logo de Kinal y tipografía en relieve
- [ ] **Global**: Transiciones de vista (fade-in entre tabs)

### Medio impacto
- [ ] **HistoriaView**: Formato de scroll storytelling con ilustraciones temáticas
- [ ] **MapView**: Drawer inferior con detalles expandidos al clic en marcador
- [ ] **HomeView**: Sección de ranking o progreso comparativo
- [ ] **AlbumView**: Pantalla de celebración al completar el 100%

### Para considerar
- [ ] Modo oscuro (los tokens ya están parcialmente definidos con CSS variables)
- [ ] Animaciones de transición 3D entre vistas (como un giro de página)
- [ ] Vibración háptica (Web Vibration API) al escanear exitosamente
- [ ] Sonidos de UI (page flip, sticker pop, éxito de scan)

---

## 🌐 Rutas Disponibles

| Ruta        | Descripción                                              |
|-------------|----------------------------------------------------------|
| `/`         | App shell completa con BottomNav y las 5 vistas          |
| `/mapa`     | Vista de mapa a pantalla completa (con MobileFrame demo) |
| `/historia` | Vista de historia a pantalla completa (con MobileFrame)  |

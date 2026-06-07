import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KinalMap — Campus Kinal',
  description:
    'Guía interactiva del campus Kinal: mapa 2D, checkpoints, álbum de estampas e historia institucional en su Expo Anual.',
}

export const viewport: Viewport = {
  themeColor: '#2C3E73',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ height: '100%', overflow: 'hidden' }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

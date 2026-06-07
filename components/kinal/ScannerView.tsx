'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { mapPOIs } from '@/lib/kinal-data'

interface ScannerViewProps {
  unlockedCheckpoints: string[]
  onScan: (checkpointId: string) => { newlyUnlocked: string[] }
}

type ScanState = 'idle' | 'scanning' | 'success' | 'already' | 'error'

const VALID_CHECKPOINTS = mapPOIs
  .filter((p) => p.type === 'checkpoint')
  .map((p) => ({ id: p.checkpointId!, label: p.label }))

function getCameraErrorMessage(err: unknown): string {
  if (typeof window !== 'undefined' && !window.isSecureContext) {
    return 'La camara requiere HTTPS. Abre la app desde un enlace seguro (https://).'
  }
  const name = err instanceof Error ? err.name : ''
  const msg = err instanceof Error ? err.message : String(err)
  if (name === 'NotAllowedError' || /permission|denied/i.test(msg)) {
    return 'Permiso de camara denegado. Activalo en la configuracion del navegador e intentalo de nuevo.'
  }
  if (name === 'NotFoundError' || /no device|not found/i.test(msg)) {
    return 'No se encontro ninguna camara en este dispositivo.'
  }
  if (name === 'NotReadableError' || /in use|busy/i.test(msg)) {
    return 'La camara esta en uso por otra app. Cierrala e intentalo de nuevo.'
  }
  return 'No se pudo acceder a la camara. Revisa los permisos e intentalo de nuevo.'
}

async function requestCameraPermission(): Promise<void> {
  if (!navigator.mediaDevices?.getUserMedia) return
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: 'environment' } },
    audio: false,
  })
  stream.getTracks().forEach((track) => track.stop())
}

async function resolveCameraConfig(): Promise<string | { facingMode: string }> {
  const { Html5Qrcode } = await import('html5-qrcode')
  try {
    const cameras = await Html5Qrcode.getCameras()
    if (cameras.length > 0) {
      const back = cameras.find((c) =>
        /back|rear|environment|trasera|posterior/i.test(c.label)
      )
      return (back ?? cameras[cameras.length - 1]).id
    }
  } catch {
    // listar camaras puede fallar; usar facingMode
  }
  return { facingMode: 'environment' }
}

const CAMERA_START_CONFIG = {
  fps: 12,
  qrbox: { width: 240, height: 240 },
  aspectRatio: 1.0,
  disableFlip: false,
} as const

export default function ScannerView({
  unlockedCheckpoints,
  onScan,
}: ScannerViewProps) {
  const scannerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html5QrRef = useRef<any>(null)
  const processingRef = useRef(false)
  const unlockedRef = useRef(unlockedCheckpoints)
  const [scanState, setScanState] = useState<ScanState>('idle')
  const [scanMessage, setScanMessage] = useState<string>('')
  const [newStickers, setNewStickers] = useState<string[]>([])
  const [isStarting, setIsStarting] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [cameraRequested, setCameraRequested] = useState(false)

  useEffect(() => {
    unlockedRef.current = unlockedCheckpoints
  }, [unlockedCheckpoints])

  const stopScanner = useCallback(async () => {
    processingRef.current = false
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop()
      } catch {
        // ya detenido
      }
      try {
        await html5QrRef.current.clear()
      } catch {
        // contenedor ya limpio
      }
      html5QrRef.current = null
    }
  }, [])

  const handleDecoded = useCallback(
    async (decodedText: string) => {
      if (processingRef.current) return
      processingRef.current = true

      await stopScanner()

      const trimmed = decodedText.trim().toUpperCase()
      const poi = VALID_CHECKPOINTS.find(
        (c) => c.id === trimmed || decodedText.toUpperCase().includes(c.id)
      )

      if (poi) {
        if (unlockedRef.current.includes(poi.id)) {
          setScanState('already')
          setScanMessage(`Ya completaste el checkpoint: ${poi.label}`)
        } else {
          const { newlyUnlocked } = onScan(poi.id)
          setNewStickers(newlyUnlocked)
          setScanState('success')
          setScanMessage(`Checkpoint ${poi.label} desbloqueado!`)
        }
      } else {
        setScanState('error')
        setScanMessage('Codigo no reconocido como checkpoint de Kinal.')
      }
      setIsStarting(false)
    },
    [onScan, stopScanner]
  )

  const startScanner = useCallback(() => {
    if (isStarting || html5QrRef.current || processingRef.current) return

    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setScanState('error')
      setScanMessage(getCameraErrorMessage(new Error('insecure')))
      return
    }

    setIsStarting(true)
    setScanMessage('')
    setNewStickers([])
    processingRef.current = false
    setScanState('scanning')
    setCameraRequested(true)
  }, [isStarting])

  useEffect(() => {
    if (!cameraRequested || scanState !== 'scanning') return

    let cancelled = false

    async function initCamera() {
      await new Promise((r) => setTimeout(r, 150))

      if (cancelled || !scannerRef.current) return

      try {
        await requestCameraPermission()
        if (cancelled) return

        const { Html5Qrcode } = await import('html5-qrcode')
        const scanner = new Html5Qrcode('qr-reader', { verbose: false })
        html5QrRef.current = scanner

        const tryStart = async (config: string | { facingMode: string }) => {
          await scanner.start(
            config,
            CAMERA_START_CONFIG,
            (decodedText: string) => {
              void handleDecoded(decodedText)
            },
            () => {}
          )
        }

        const cameraConfig = await resolveCameraConfig()
        try {
          await tryStart(cameraConfig)
        } catch {
          if (typeof cameraConfig === 'string') {
            await tryStart({ facingMode: 'environment' })
          } else {
            await tryStart({ facingMode: 'user' })
          }
        }
      } catch (err) {
        if (!cancelled) {
          await stopScanner()
          setScanState('error')
          setScanMessage(getCameraErrorMessage(err))
        }
      } finally {
        if (!cancelled) setIsStarting(false)
      }
    }

    void initCamera()

    return () => {
      cancelled = true
    }
  }, [cameraRequested, scanState, handleDecoded, stopScanner])

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [stopScanner])

  const reset = useCallback(async () => {
    setCameraRequested(false)
    await stopScanner()
    setScanState('idle')
    setScanMessage('')
    setNewStickers([])
    setFlashOn(false)
    setIsStarting(false)
  }, [stopScanner])

  const getStatusText = () => {
    switch (scanState) {
      case 'idle':
        return 'STATUS: IDLE'
      case 'scanning':
        return 'STATUS: SEARCHING...'
      case 'success':
        return 'STATUS: SUCCESS'
      case 'already':
        return 'STATUS: UNLOCKED'
      case 'error':
        return 'STATUS: ERROR'
      default:
        return 'STATUS: IDLE'
    }
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#0D1420] overflow-hidden font-sans text-white">
      <header className="flex-shrink-0 bg-surface/70 dark:bg-dark-navy/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm z-20">
        <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary dark:text-inverse-primary tracking-tight">
            KinalMapp
          </h1>
          <div className="flex items-center gap-2 bg-secondary-container px-3 py-1 rounded-full text-on-secondary-container">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
            <span className="font-label-bold text-[11px]">{unlockedCheckpoints.length}/{VALID_CHECKPOINTS.length} checkpoints</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-between py-12 px-6 overflow-hidden">
        {scanState !== 'scanning' && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              alt="Camera Feed Placeholder"
              className="w-full h-full object-cover opacity-35 grayscale-[0.3] blur-[2px]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoDPP-Zz3-BlzjYfAakyVUNKhzYhIWLljFRyC82smAtFB8pI29UoLrqZw3mqN9EaK15M4t0KP2jRCbMO1oBq9Bkt-tLAhat1jO10ZaoIVBirsufZeQNPW3NYxVUpvcFq5Gzyi0cJ8zhKXtaW-ESNn4YrnSDqZD1-XAkfm25GQ0hSfLN4Yvs4Goy4ym3sr2Xyi5CR3u0BNWLZji5Tns26FnAv2BhDfiRzJfQ2B9-RotoB8Rqp3aGh92YKJtr00V0tTPbSaQ_59f66g2"
            />
          </div>
        )}

        <div
          id="qr-reader"
          ref={scannerRef}
          className={`qr-reader-host absolute inset-0 w-full h-full overflow-hidden ${
            scanState === 'scanning' ? 'z-[8]' : 'z-0 pointer-events-none'
          }`}
          aria-hidden={scanState !== 'scanning'}
        />

        <div
          className={`relative w-full h-full flex flex-col items-center justify-between pointer-events-none ${
            scanState === 'scanning' ? 'z-[12]' : 'z-10'
          }`}
        >
          <div className="text-center space-y-2">
            <p className="font-headline-md text-headline-md text-white drop-shadow-lg font-bold">
              {scanState === 'scanning' ? 'Apunta al codigo QR' : 'Escanear Checkpoint'}
            </p>
            <p className="font-body-md text-xs text-outline-variant/80">
              {scanState === 'scanning'
                ? isStarting
                  ? 'Abriendo camara...'
                  : 'Busca los checkpoints en la exhibicion'
                : 'Ubica el QR en la exposicion de Kinal'}
            </p>
          </div>

          {scanState === 'scanning' ? (
            <div className="relative w-64 h-64 md:w-72 md:h-72 my-auto flex-shrink-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-secondary-container rounded-tl-xl z-10"></div>
              <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-secondary-container rounded-tr-xl z-10"></div>
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-secondary-container rounded-bl-xl z-10"></div>
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-secondary-container rounded-br-xl z-10"></div>
              <div className="absolute left-4 right-4 scanner-line z-10"></div>
            </div>
          ) : (
            <div className="my-auto flex flex-col items-center gap-4 bg-[#1A2340]/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-xs shadow-2xl pointer-events-auto">
              {scanState === 'idle' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="material-symbols-outlined text-[#fee269] text-3xl">
                      qr_code_scanner
                    </span>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-white font-bold text-sm">Camara lista</p>
                    <p className="text-[11px] text-white/60">
                      Presiona Activar Camara para escanear el codigo QR del checkpoint.
                    </p>
                    <Link
                      href="/qr-prueba"
                      className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-[#fee269] hover:underline pointer-events-auto"
                    >
                      <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                      QR de prueba
                    </Link>
                  </div>
                </>
              )}

              {scanState === 'success' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                    <span className="material-symbols-outlined text-green-500 text-3xl font-bold">
                      check_circle
                    </span>
                  </div>
                  <div className="text-center space-y-1.5">
                    <p className="text-white font-extrabold text-sm leading-tight">{scanMessage}</p>
                    {newStickers.length > 0 && (
                      <div className="inline-block px-3 py-1 bg-secondary-container/20 border border-secondary-container/30 rounded-lg text-xs font-bold text-[#fee269]">
                        +{newStickers.length} estampas desbloqueadas!
                      </div>
                    )}
                  </div>
                </>
              )}

              {scanState === 'error' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50">
                    <span className="material-symbols-outlined text-red-500 text-3xl font-bold">
                      cancel
                    </span>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-white font-bold text-sm">Error de Lectura</p>
                    <p className="text-[11px] text-white/70 leading-relaxed">{scanMessage}</p>
                  </div>
                </>
              )}

              {scanState === 'already' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                    <span className="material-symbols-outlined text-blue-400 text-3xl font-bold">
                      check_circle
                    </span>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-white font-bold text-sm">Ya Desbloqueado</p>
                    <p className="text-[11px] text-white/70 leading-relaxed">{scanMessage}</p>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex flex-col items-center gap-5 w-full flex-shrink-0">
            {scanState === 'scanning' && (
              <button
                onClick={() => setFlashOn((prev) => !prev)}
                className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-lg cursor-pointer pointer-events-auto ${
                  flashOn
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/15'
                }`}
                title="Toggle Flash"
              >
                <span
                  className="material-symbols-outlined text-[28px]"
                  style={{ fontVariationSettings: flashOn ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {flashOn ? 'flashlight_off' : 'flashlight_on'}
                </span>
              </button>
            )}

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-3">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  scanState === 'scanning'
                    ? 'bg-white'
                    : scanState === 'success'
                    ? 'bg-green-500'
                    : 'bg-[#fee269] shadow-[0_0_8px_#fee269]'
                }`}
              ></span>
              <span className="font-label-bold text-[10px] tracking-widest text-secondary-fixed select-none">
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-container-margin py-5 bg-[#0D1420] border-t border-white/5 flex flex-col gap-4 pb-24">
        {scanState === 'idle' && (
          <button
            onClick={startScanner}
            disabled={isStarting}
            className="w-full py-4 rounded-xl font-bold text-sm bg-[#fee269] text-[#6f5d00] hover:bg-[#ffe580] transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            {isStarting ? 'Iniciando camara...' : 'Activar Camara'}
          </button>
        )}

        {scanState === 'scanning' && (
          <button
            onClick={reset}
            className="w-full py-4 rounded-xl font-bold text-sm bg-white/10 text-white/80 hover:bg-white/15 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
            Cancelar
          </button>
        )}

        {(scanState === 'success' || scanState === 'already' || scanState === 'error') && (
          <button
            onClick={reset}
            className="w-full py-4 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Escanear Otro
          </button>
        )}

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 select-none">
          <p className="text-[11px] text-white/60 mb-2 font-bold flex justify-between">
            <span>Checkpoints completados</span>
            <span className="text-[#fee269]">
              {unlockedCheckpoints.length} de {VALID_CHECKPOINTS.length}
            </span>
          </p>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4BA46] to-[#F7931E] rounded-full transition-all duration-700"
              style={{ width: `${(unlockedCheckpoints.length / VALID_CHECKPOINTS.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </footer>
    </div>
  )
}

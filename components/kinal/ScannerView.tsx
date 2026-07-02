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
      {/* Header */}
      <header className="flex-shrink-0 bg-white/[0.04] backdrop-blur-xl border-b border-white/10 z-20">
        <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
          <h1 className="font-extrabold text-xl tracking-tight text-white">
            Kinal<span className="text-[#D4BA46]">Mapp</span>
          </h1>
          <div className="flex items-center gap-2 bg-[#D4BA46]/15 border border-[#D4BA46]/30 px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-[16px] text-[#fee269]" style={{ fontVariationSettings: "'FILL' 1" }}>
              qr_code_scanner
            </span>
            <span className="font-bold text-[11px] text-[#fee269]">
              {unlockedCheckpoints.length}/{VALID_CHECKPOINTS.length} checkpoints
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-between py-10 px-6 overflow-hidden">
        {/* Background blurred camera image when not scanning */}
        {scanState !== 'scanning' && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              alt="Camera Feed Placeholder"
              className="w-full h-full object-cover opacity-20 grayscale blur-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoDPP-Zz3-BlzjYfAakyVUNKhzYhIWLljFRyC82smAtFB8pI29UoLrqZw3mqN9EaK15M4t0KP2jRCbMO1oBq9Bkt-tLAhat1jO10ZaoIVBirsufZeQNPW3NYxVUpvcFq5Gzyi0cJ8zhKXtaW-ESNn4YrnSDqZD1-XAkfm25GQ0hSfLN4Yvs4Goy4ym3sr2Xyi5CR3u0BNWLZji5Tns26FnAv2BhDfiRzJfQ2B9-RotoB8Rqp3aGh92YKJtr00V0tTPbSaQ_59f66g2"
            />
            {/* Radial vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#0D1420_90%)]" />
          </div>
        )}

        {/* QR reader host div */}
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
          {/* Top label */}
          <div className="text-center space-y-1.5 pt-2">
            <p className="font-extrabold text-base text-white drop-shadow-lg tracking-tight">
              {scanState === 'scanning' ? 'Apunta al código QR' : 'Escanear Checkpoint'}
            </p>
            <p className="text-[11px] text-white/50 tracking-wide">
              {scanState === 'scanning'
                ? isStarting
                  ? 'Abriendo cámara...'
                  : 'Encuentra los checkpoints en la exposición'
                : 'Ubica el QR en la exposición de Kinal'}
            </p>
          </div>

          {/* Center: viewfinder OR state card */}
          {scanState === 'scanning' ? (
            <div className="relative w-64 h-64 md:w-72 md:h-72 my-auto flex-shrink-0 pointer-events-none">
              {/* Vignette overlay around viewfinder */}
              <div className="absolute inset-0 rounded-2xl ring-[9999px] ring-black/55" />
              {/* Gold glowing corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-[#fee269] rounded-tl-xl z-10"
                   style={{ boxShadow: '0 0 10px #fee269, inset 0 0 4px rgba(254,226,105,0.15)' }} />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-[#fee269] rounded-tr-xl z-10"
                   style={{ boxShadow: '0 0 10px #fee269, inset 0 0 4px rgba(254,226,105,0.15)' }} />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-[#fee269] rounded-bl-xl z-10"
                   style={{ boxShadow: '0 0 10px #fee269, inset 0 0 4px rgba(254,226,105,0.15)' }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-[#fee269] rounded-br-xl z-10"
                   style={{ boxShadow: '0 0 10px #fee269, inset 0 0 4px rgba(254,226,105,0.15)' }} />
              {/* Laser scan line */}
              <div className="absolute left-3 right-3 scanner-line z-10" />
            </div>
          ) : (
            <div className="my-auto flex flex-col items-center gap-5 w-full max-w-xs pointer-events-auto">
              <div className="w-full bg-white/[0.05] backdrop-blur-xl border border-white/10 p-7 rounded-3xl shadow-2xl flex flex-col items-center gap-5">

                {/* IDLE */}
                {scanState === 'idle' && (
                  <>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-[#D4BA46]/15 animate-pulse" />
                      <div className="w-16 h-16 rounded-full bg-[#D4BA46]/20 border border-[#D4BA46]/40 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#fee269] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          qr_code_scanner
                        </span>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-white font-extrabold text-sm">Cámara lista</p>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Presiona <span className="text-[#fee269] font-bold">Activar Cámara</span> para escanear el código QR del checkpoint.
                      </p>
                      <Link
                        href="/qr-prueba"
                        className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-bold text-[#fee269]/60 hover:text-[#fee269] transition-colors pointer-events-auto"
                      >
                        <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                        QR de prueba
                      </Link>
                    </div>
                  </>
                )}

                {/* SUCCESS */}
                {scanState === 'success' && (
                  <>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-green-500/15 animate-ping" style={{ animationDuration: '1.5s' }} />
                      <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center"
                           style={{ boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}>
                        <span className="material-symbols-outlined text-green-400 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                      </div>
                    </div>
                    <div className="text-center space-y-2.5">
                      <p className="text-white font-extrabold text-sm leading-tight">{scanMessage}</p>
                      {newStickers.length > 0 && (
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#fee269]/15 border border-[#fee269]/30 rounded-full text-xs font-extrabold text-[#fee269]">
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          +{newStickers.length} estampas desbloqueadas!
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ERROR */}
                {scanState === 'error' && (
                  <>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-red-500/15 animate-pulse" />
                      <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center"
                           style={{ boxShadow: '0 0 20px rgba(239,68,68,0.15)' }}>
                        <span className="material-symbols-outlined text-red-400 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          cancel
                        </span>
                      </div>
                    </div>
                    <div className="text-center space-y-1.5">
                      <p className="text-white font-extrabold text-sm">Error de Lectura</p>
                      <p className="text-[11px] text-white/55 leading-relaxed">{scanMessage}</p>
                    </div>
                  </>
                )}

                {/* ALREADY */}
                {scanState === 'already' && (
                  <>
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-blue-500/15 animate-pulse" />
                      <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center"
                           style={{ boxShadow: '0 0 20px rgba(59,130,246,0.15)' }}>
                        <span className="material-symbols-outlined text-blue-400 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                      </div>
                    </div>
                    <div className="text-center space-y-1.5">
                      <p className="text-white font-extrabold text-sm">Ya Desbloqueado</p>
                      <p className="text-[11px] text-white/55 leading-relaxed">{scanMessage}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Bottom: status pill + flash toggle */}
          <div className="flex flex-col items-center gap-4 w-full flex-shrink-0">
            {scanState === 'scanning' && (
              <button
                onClick={() => setFlashOn((prev) => !prev)}
                className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-lg cursor-pointer pointer-events-auto ${
                  flashOn
                    ? 'bg-[#fee269] text-[#1a1400]'
                    : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/15'
                }`}
                title="Toggle Flash"
              >
                <span
                  className="material-symbols-outlined text-[26px]"
                  style={{ fontVariationSettings: flashOn ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {flashOn ? 'flashlight_off' : 'flashlight_on'}
                </span>
              </button>
            )}

            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 px-5 py-2 rounded-full flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  scanState === 'scanning'
                    ? 'bg-white animate-pulse'
                    : scanState === 'success'
                    ? 'bg-green-500'
                    : scanState === 'error'
                    ? 'bg-red-500'
                    : 'bg-[#fee269] shadow-[0_0_8px_#fee269] animate-pulse'
                }`}
              />
              <span className="font-bold text-[10px] tracking-widest text-white/40 select-none uppercase">
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-container-margin py-5 bg-[#0D1420]/95 border-t border-white/[0.06] flex flex-col gap-3 pb-24">
        {scanState === 'idle' && (
          <button
            onClick={startScanner}
            disabled={isStarting}
            className="w-full py-4 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-[#D4BA46] to-[#F7931E] text-[#1a0f00] hover:brightness-110 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 duration-150 shadow-lg shadow-[#D4BA46]/20"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            {isStarting ? 'Iniciando cámara...' : 'Activar Cámara'}
          </button>
        )}

        {scanState === 'scanning' && (
          <button
            onClick={reset}
            className="w-full py-4 rounded-2xl font-bold text-sm bg-white/10 text-white/80 hover:bg-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-150 border border-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
            Cancelar
          </button>
        )}

        {(scanState === 'success' || scanState === 'already' || scanState === 'error') && (
          <button
            onClick={reset}
            className="w-full py-4 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-[#2C3E73] to-[#13275c] text-white hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-150 shadow-lg"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Escanear Otro
          </button>
        )}

        {/* Progress card */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] select-none">
          <p className="text-[10px] text-white/45 mb-2.5 font-bold flex justify-between uppercase tracking-widest">
            <span>Checkpoints</span>
            <span className="text-[#fee269]">
              {unlockedCheckpoints.length} / {VALID_CHECKPOINTS.length}
            </span>
          </p>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4BA46] to-[#F7931E] rounded-full transition-all duration-700"
              style={{
                width: `${(unlockedCheckpoints.length / VALID_CHECKPOINTS.length) * 100}%`,
                boxShadow: '0 0 6px #D4BA46',
              }}
            />
          </div>
        </div>
      </footer>
    </div>
  )
}

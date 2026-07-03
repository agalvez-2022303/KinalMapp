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
  .filter((p) => p.type === 'checkpoint' && p.checkpointId)
  .map((p) => ({ id: p.checkpointId!, label: p.label }))

const COOLDOWN_MS = 2500

function getCameraErrorMessage(err: unknown): string {
  if (typeof window !== 'undefined' && !window.isSecureContext) {
    return 'La cámara requiere HTTPS. Abre la app desde un enlace seguro (https://).'
  }
  const name = err instanceof Error ? err.name : ''
  const msg = err instanceof Error ? err.message : String(err)
  if (name === 'NotAllowedError' || /permission|denied/i.test(msg)) {
    return 'Permiso de cámara denegado. Actívalo en la configuración del navegador e intenta de nuevo.'
  }
  if (name === 'NotFoundError' || /no device|not found/i.test(msg)) {
    return 'No se encontró ninguna cámara en este dispositivo.'
  }
  if (name === 'NotReadableError' || /inuse|busy/i.test(msg)) {
    return 'La cámara está en uso por otra app. Ciérrala e intenta de nuevo.'
  }
  return 'No se pudo acceder a la cámara. Revisa los permisos e intenta de nuevo.'
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
    // fallback
  }
  return { facingMode: 'environment' }
}

const CAMERA_START_CONFIG = {
  fps: 6,
  qrbox: { width: 250, height: 250 },
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
  const cooldownRef = useRef(false)
  const unlockedRef = useRef(unlockedCheckpoints)
  const [scanState, setScanState] = useState<ScanState>('idle')
  const [scanMessage, setScanMessage] = useState<string>('')
  const [newStickers, setNewStickers] = useState<string[]>([])
  const [isStarting, setIsStarting] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [cameraRequested, setCameraRequested] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    unlockedRef.current = unlockedCheckpoints
  }, [unlockedCheckpoints])

  const stopScanner = useCallback(async () => {
    if (html5QrRef.current) {
      try { await html5QrRef.current.stop() } catch { /* */ }
      try { await html5QrRef.current.clear() } catch { /* */ }
      html5QrRef.current = null
    }
  }, [])

  const startCooldown = useCallback(() => {
    cooldownRef.current = true
    setCooldownRemaining(COOLDOWN_MS / 1000)
    cooldownTimerRef.current = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current)
          cooldownRef.current = false
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const handleDecoded = useCallback(
    async (decodedText: string) => {
      if (cooldownRef.current) return

      await stopScanner()

      const trimmed = decodedText.trim()
      const trimmedUpper = trimmed.toUpperCase()

      const poi = VALID_CHECKPOINTS.find((c) => c.id === trimmedUpper)

      if (poi) {
        startCooldown()
        if (unlockedRef.current.includes(poi.id)) {
          setScanState('already')
          setScanMessage(`"${poi.label}" ya estaba desbloqueado`)
        } else {
          const { newlyUnlocked } = onScan(poi.id)
          setNewStickers(newlyUnlocked)
          setScanState('success')
          setScanMessage(`"${poi.label}" desbloqueado`)
        }
      } else {
        startCooldown()
        setScanState('error')
        setScanMessage('Código no reconocido. Asegurate de apuntar al QR correcto.')
      }
      setIsStarting(false)
    },
    [onScan, stopScanner, startCooldown]
  )

  const startScanner = useCallback(() => {
    if (isStarting || html5QrRef.current || cooldownRef.current) return

    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setScanState('error')
      setScanMessage(getCameraErrorMessage(new Error('insecure')))
      return
    }

    setIsStarting(true)
    setScanMessage('')
    setNewStickers([])
    setScanState('scanning')
    setCameraRequested(true)
  }, [isStarting])

  useEffect(() => {
    if (!cameraRequested || scanState !== 'scanning') return

    let cancelled = false

    async function initCamera() {
      await new Promise((r) => setTimeout(r, 200))
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
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current)
    }
  }, [stopScanner])

  const reset = useCallback(async () => {
    setCameraRequested(false)
    await stopScanner()
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current)
    cooldownRef.current = false
    setCooldownRemaining(0)
    setScanState('idle')
    setScanMessage('')
    setNewStickers([])
    setFlashOn(false)
    setIsStarting(false)
  }, [stopScanner])

  return (
    <div className="flex flex-col w-full h-full bg-[#0D1420] overflow-hidden font-sans text-white">
      {/* Header */}
      <header className="flex-shrink-0 bg-white/[0.04] backdrop-blur-xl border-b border-white/10 z-20">
        <div className="flex items-center justify-between px-container-margin h-14 w-full max-w-md mx-auto">
          <h1 className="font-extrabold text-lg tracking-tight text-white">
            Kinal<span className="text-[#D4BA46]">Mapp</span>
          </h1>
          <div className="flex items-center gap-2 bg-[#D4BA46]/15 border border-[#D4BA46]/30 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-[14px] text-[#fee269]" style={{ fontVariationSettings: "'FILL' 1" }}>
              qr_code_scanner
            </span>
            <span className="font-bold text-[10px] text-[#fee269]">
              {unlockedCheckpoints.length}/{VALID_CHECKPOINTS.length}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background */}
        {scanState !== 'scanning' && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img
              alt=""
              className="w-full h-full object-cover opacity-10 grayscale blur-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoDPP-Zz3-BlzjYfAakyVUNKhzYhIWLljFRyC82smAtFB8pI29UoLrqZw3mqN9EaK15M4t0KP2jRCbMO1oBq9Bkt-tLAhat1jO10ZaoIVBirsufZeQNPW3NYxVUpvcFq5Gzyi0cJ8zhKXtaW-ESNn4YrnSDqZD1-XAkfm25GQ0hSfLN4Yvs4Goy4ym3sr2Xyi5CR3u0BNWLZji5Tns26FnAv2BhDfiRzJfQ2B9-RotoB8Rqp3aGh92YKJtr00V0tTPbSaQ_59f66g2"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#0D1420_90%)]" />
          </div>
        )}

        <div
          className={`relative w-full h-full flex flex-col items-center justify-center pointer-events-none ${
            scanState === 'scanning' ? 'z-[12]' : 'z-10'
          }`}
        >
          {/* Scanning: viewfinder with camera inside */}
          {scanState === 'scanning' && (
            <div className="flex flex-col items-center gap-6">
              <p className="font-extrabold text-sm text-white/80 tracking-tight">
                Apunta al código QR
              </p>
              <div className="relative w-64 h-64 flex-shrink-0 pointer-events-none">
                {/* Camera feed inside the viewfinder */}
                <div
                  id="qr-reader"
                  ref={scannerRef}
                  className="qr-reader-host absolute inset-0 w-full h-full overflow-hidden rounded-2xl z-0"
                  aria-hidden={scanState !== 'scanning'}
                />
                {/* Vignette overlay */}
                <div className="absolute inset-0 rounded-2xl ring-[9999px] ring-black/55 z-[1] pointer-events-none" />
                {/* Gold corner brackets */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-[3px] border-l-[3px] border-[#fee269] rounded-tl-xl z-10"
                     style={{ boxShadow: '0 0 12px #fee269' }} />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-[3px] border-r-[3px] border-[#fee269] rounded-tr-xl z-10"
                     style={{ boxShadow: '0 0 12px #fee269' }} />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[3px] border-l-[3px] border-[#fee269] rounded-bl-xl z-10"
                     style={{ boxShadow: '0 0 12px #fee269' }} />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[3px] border-r-[3px] border-[#fee269] rounded-br-xl z-10"
                     style={{ boxShadow: '0 0 12px #fee269' }} />
                {/* Scan line */}
                <div className="absolute left-3 right-3 scanner-line z-10" />
              </div>
              {cooldownRemaining > 0 && (
                <div className="px-4 py-2 bg-white/10 rounded-full text-xs text-white/50 font-bold">
                  Espera {cooldownRemaining}s...
                </div>
              )}
            </div>
          )}

          {/* Idle / Result states */}
          {scanState !== 'scanning' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-xs pointer-events-auto">
              {/* IDLE */}
              {scanState === 'idle' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#D4BA46]/15 animate-pulse" />
                    <div className="w-16 h-16 rounded-full bg-[#D4BA46]/20 border border-[#D4BA46]/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#fee269] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        qr_code_scanner
                      </span>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-white font-extrabold text-sm">Escanear QR</p>
                    <p className="text-[11px] text-white/45 leading-relaxed">
                      Apunta la cámara al código QR del checkpoint para desbloquear estampas.
                    </p>
                  </div>
                </div>
              )}

              {/* SUCCESS */}
              {scanState === 'success' && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center"
                       style={{ boxShadow: '0 0 25px rgba(34,197,94,0.25)' }}>
                    <span className="material-symbols-outlined text-green-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-green-400 font-extrabold text-sm">{scanMessage}</p>
                    {newStickers.length > 0 && (
                      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#fee269]/15 border border-[#fee269]/30 rounded-full text-xs font-bold text-[#fee269]">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        +{newStickers.length} estampa{newStickers.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ALREADY */}
              {scanState === 'already' && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center"
                       style={{ boxShadow: '0 0 25px rgba(59,130,246,0.2)' }}>
                    <span className="material-symbols-outlined text-blue-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-400 font-extrabold text-sm">{scanMessage}</p>
                  </div>
                </div>
              )}

              {/* ERROR */}
              {scanState === 'error' && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center"
                       style={{ boxShadow: '0 0 25px rgba(239,68,68,0.2)' }}>
                    <span className="material-symbols-outlined text-red-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      cancel
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-red-400 font-extrabold text-sm">No se pudo leer</p>
                    <p className="text-[11px] text-white/45 mt-1 leading-relaxed">{scanMessage}</p>
                  </div>
                </div>
              )}

              {/* Action button */}
              <button
                onClick={scanState === 'idle' ? startScanner : reset}
                disabled={isStarting}
                className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 duration-150 ${
                  scanState === 'idle'
                    ? 'bg-gradient-to-r from-[#D4BA46] to-[#F7931E] text-[#1a0f00] shadow-lg shadow-[#D4BA46]/20 hover:brightness-110'
                    : 'bg-gradient-to-r from-[#2C3E73] to-[#13275c] text-white shadow-lg hover:brightness-110'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {scanState === 'idle' ? 'photo_camera' : 'refresh'}
                </span>
                {scanState === 'idle'
                  ? isStarting ? 'Iniciando...' : 'Activar Cámara'
                  : 'Escanear Otro'}
              </button>

              {scanState === 'idle' && (
                <Link
                  href="/qr-prueba"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white/30 hover:text-white/60 transition-colors pointer-events-auto"
                >
                  <span className="material-symbols-outlined text-[12px]">qr_code_2</span>
                  Ver QRs de prueba
                </Link>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer: progress */}
      <footer className="px-container-margin py-4 bg-[#0D1420]/95 border-t border-white/[0.06] pb-20">
        <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] select-none">
          <p className="text-[9px] text-white/40 mb-2 font-bold flex justify-between uppercase tracking-widest">
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

"use client"

import { type RouteStep } from "@/lib/routing"
import { type FloorPlanPOI } from "@/lib/kinal-data"

interface NavigationGuideProps {
  steps: RouteStep[]
  from: FloorPlanPOI
  to: FloorPlanPOI
  currentStepIndex: number
  onStop: () => void
  onPause?: () => void
  isPaused?: boolean
}

const floorNames: Record<string, string> = {
  pb: "Planta Baja",
  p2: "Piso 2",
  p3: "Piso 3",
}

function getStepIcon(type: string) {
  switch (type) {
    case "arrival": return "📍"
    case "stairs": return "⬆️"
    default: return "🚶"
  }
}

function getStepLabel(step: RouteStep, index: number, total: number): string {
  if (index === 0) return `Salir de ${step.label || "inicio"}`
  if (index === total - 1) return `Llegar a ${step.label || "destino"}`
  if (step.type === "stairs") return step.label || "Subir escaleras"
  if (step.label) return `Seguir hacia ${step.label}`
  return "Continuar"
}

export default function NavigationGuide({
  steps,
  from,
  to,
  currentStepIndex,
  onStop,
  onPause,
  isPaused,
}: NavigationGuideProps) {
  const totalDistance = steps.length * 15
  const progress = Math.min((currentStepIndex / Math.max(steps.length - 1, 1)) * 100, 100)
  const etaMinutes = Math.max(1, Math.round((steps.length - currentStepIndex) * 0.3))

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[500] pointer-events-none">
      {/* Progress bar */}
      <div className="px-4 mb-0 pointer-events-auto">
        <div className="h-1 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #22C55E, #F7931E)",
            }}
          />
        </div>
      </div>

      {/* Main panel */}
      <div className="bg-white/95 backdrop-blur-xl rounded-t-[28px] shadow-[0px_-8px_30px_rgba(44,62,115,0.15)] border-t border-outline-variant/20 pointer-events-auto">
        {/* Drag handle */}
        <div className="w-full flex justify-center py-3 cursor-pointer">
          <div className="w-12 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* Header with ETA */}
        <div className="px-6 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {etaMinutes} min · ~{totalDistance}m
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-bold text-gray-300">{from.id} → {to.id}</span>
          </div>
        </div>

        {/* Steps list */}
        <div className="px-6 pb-3 max-h-[200px] overflow-y-auto hide-scrollbar">
          <div className="space-y-1">
            {steps.map((step, i) => {
              const isActive = i === currentStepIndex
              const isCompleted = i < currentStepIndex
              const isLast = i === steps.length - 1

              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 py-1.5 px-2 rounded-xl transition-all duration-300 ${
                    isActive ? "bg-[#F7931E]/10 scale-[1.02]" : ""
                  } ${isCompleted ? "opacity-50" : ""}`}
                >
                  {/* Step indicator */}
                  <div className="flex flex-col items-center gap-0.5 mt-0.5">
                    <span
                      className={`w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center text-[6px] font-bold transition-all ${
                        isCompleted
                          ? "bg-[#22C55E] text-white"
                          : isActive
                          ? "bg-[#F7931E] text-white scale-125 shadow-lg"
                          : isLast
                          ? "bg-[#EF4444] text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? "✓" : isLast ? "●" : ""}
                    </span>
                    {!isLast && <span className="w-0.5 h-4 bg-gray-200 rounded-full" />}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]">{getStepIcon(step.type)}</span>
                      <span
                        className={`text-[11px] font-bold leading-tight ${
                          isActive
                            ? "text-[#F7931E]"
                            : isCompleted
                            ? "text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {getStepLabel(step, i, steps.length)}
                      </span>
                    </div>
                    {step.type !== "arrival" && (
                      <span className="text-[8px] text-gray-400 font-medium ml-4">
                        {floorNames[step.floorPlanId] || step.floorPlanId}
                        {i < steps.length - 1 && steps[i + 1]?.floorPlanId !== step.floorPlanId && (
                          <span className="text-[#6B7280] ml-1">
                            → {floorNames[steps[i + 1]?.floorPlanId] || steps[i + 1]?.floorPlanId}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-8 flex gap-3">
          {onPause && (
            <button
              onClick={onPause}
              className="flex-1 bg-gradient-to-r from-[#2C3E73] to-[#13275c] hover:brightness-110 text-white py-3 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {isPaused ? "play_arrow" : "pause"}
              </span>
              {isPaused ? "Reanudar" : "Pausar"}
            </button>
          )}
          <button
            onClick={onStop}
            className="flex-1 bg-white border border-outline-variant/20 hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            Terminar
          </button>
        </div>
      </div>
    </div>
  )
}

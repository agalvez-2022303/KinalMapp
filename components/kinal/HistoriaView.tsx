'use client'

import { timelineEntries } from '@/lib/kinal-data'

const typeIcon: Record<string, string> = {
  institution: 'corporate_fare',
  career: 'school',
  milestone: 'award_star',
}

const typeLabel: Record<string, string> = {
  institution: 'Institución',
  career: 'Carrera',
  milestone: 'Hito',
}

export default function HistoriaView() {
  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden font-sans">
      {/* TopAppBar */}
      <header className="flex-shrink-0 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm z-10">
        <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
            KinalMap
          </h1>
          <button className="text-primary hover:opacity-80 transition-opacity active:scale-95 transition-transform flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              military_tech
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        <div className="w-full max-w-md mx-auto px-container-margin">
          {/* Hero Section */}
          <section className="mb-6 text-center py-stack-md animate-in fade-in duration-500">
            <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-primary mb-2">
              Nuestra Historia
            </h2>
            <p className="text-on-surface-variant font-body-md px-4">
              Recorre los hitos que han forjado el legado técnico y humano de Kinal a través de los años.
            </p>
          </section>

          {/* Timeline Container */}
          <div className="relative pl-8 pr-2 py-4 animate-in fade-in slide-in-from-bottom duration-500 delay-100">
            {/* Central Line */}
            <div className="absolute left-4 top-0 bottom-0 w-1 timeline-line rounded-full"></div>

            {/* List of Entries */}
            <div className="space-y-8">
              {timelineEntries.map((entry, i) => {
                const is1961 = entry.year === 1961
                const is1985 = entry.year === 1985
                const is2026 = entry.year === 2026

                return (
                  <div key={i} className="relative scroll-reveal">
                    {/* Timeline Dot */}
                    <div
                      className={`absolute -left-[26px] top-2 w-5 h-5 rounded-full border-4 border-white shadow-md z-10 ${
                        is2026
                          ? 'bg-on-tertiary-container'
                          : is1961
                          ? 'bg-secondary-fixed'
                          : 'bg-primary'
                      }`}
                    ></div>

                    {/* Glass Card */}
                    <div
                      className={`glass-card p-stack-md rounded-xl border border-white shadow-[0px_4px_12px_rgba(44,62,115,0.08)] ${
                        is2026 ? 'border-2 border-on-tertiary-container/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`font-headline-md px-3 py-1 rounded-full text-xs font-bold ${
                            is2026
                              ? 'text-on-tertiary-container bg-tertiary-container/10'
                              : is1961
                              ? 'text-secondary-fixed-dim bg-primary/10'
                              : 'text-primary-fixed-dim bg-primary/10'
                          }`}
                        >
                          {entry.year}
                        </span>
                        <span className="material-symbols-outlined text-primary/70 text-[20px]">
                          {typeIcon[entry.type] || 'star'}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-primary text-base mb-1">
                        {entry.title}
                      </h3>
                      <p className="text-on-surface-variant font-body-md text-xs leading-relaxed">
                        {entry.description}
                      </p>

                      {/* Custom rich content for 1961 */}
                      {is1961 && (
                        <div className="mt-4 rounded-lg overflow-hidden h-32 relative">
                          <img
                            alt="1960s Traditional School Facade"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXRy46ofuwkZjCwYLzcaweKAq30jxQb0R8qgHIzd6ih1hFE4cU5aSDQSm5nbWbu_bBXk-zmUcKHriwdotAt5dU6wxQb_y75l2tHodWo6wJdRi-fZdGMw57mmOSzuYlhglaiKO0IOBX0mOUxjv-F34aCgM85wjBuXUTf8eGrTgK1QWG0UmhEzuzjIJzBZKE9NZ0FuDzsKPU0R-7t6oI5j7wnqp_dZDvWPCpZeRSo7KYd2ChBrphqGZCbsQbI2y1xzgH-MRNdd5i_4_4"
                            suppressHydrationWarning
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                        </div>
                      )}

                      {/* Custom rich content for 1985 */}
                      {is1985 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="h-24 rounded-lg bg-surface-container overflow-hidden">
                            <img
                              alt="Electrical Engineering Students"
                              className="w-full h-full object-cover"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlVbe9jBc1ONj1b8R8Y_zkqBW4a-i_mtqGG768MLa1Aw83tzlavVuwAEveqQBIkzLn75LjOtYGesYx12gW52H5z7h6j4CND9yKPkjGyUDCRgV0W4FAIXrAzk48KQqvXyuLPtR9EMgGEzApygvnslHQblSVi8xCp2L-UNJhf12euV425Z_M6LjqAn5BhbJ7YrDlKFieHnhbTVrlbVn9ZyNWN8N938vJ0-S5n2E034pTpoAIbuzxrgfdzv8jh1PXlI6omJry3zFEmkH4"
                              suppressHydrationWarning
                            />
                          </div>
                          <div className="h-24 rounded-lg bg-surface-container overflow-hidden">
                            <img
                              alt="1980s Computer Laboratory Workstations"
                              className="w-full h-full object-cover"
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpI_22VZfODGkfRmP2Fb0E8KhKyfNbnBB5xwDWDvC0nTyc8P9wNz_PX6rfzQvdhIMA9ku9KmNE2nBhUMLWaItU46_WwLkY80sLlSzisrb-0HlJ7myYfkd4poj4gX3xr_RI1YGJLv8YqgHfYVGGle_gS-5shcb98QrN02RrR9kVegFOOm1j4_HYe2EDAKn0sGdNghUreTySiZpYrbQKvEPvMhkFTdwCTSrqnoMbquPH-QeTcQ_BNuQuDwWO-C9CxtCYDAP5fdKXkTkV"
                              suppressHydrationWarning
                            />
                          </div>
                        </div>
                      )}

                      {/* Custom rich content for 2026 */}
                      {is2026 && (
                        <div className="mt-4 space-y-1">
                          <div className="flex justify-between text-[11px] font-label-bold text-primary">
                            <span>CAMINO AL LOGRO</span>
                            <span>95%</span>
                          </div>
                          <div className="w-full h-2 bg-outline-variant/30 rounded-full overflow-hidden">
                            <div className="h-full w-[95%] bg-on-tertiary-container relative">
                              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 blur-sm"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Future Vision Section */}
          <section className="mt-8 mb-6 p-stack-md bg-dark-navy text-white rounded-xl shadow-xl animate-in fade-in duration-500 delay-300">
            <h4 className="font-headline-md mb-2 text-base">Mirando al Futuro</h4>
            <p className="text-on-primary-container font-body-md text-xs opacity-90 leading-relaxed">
              Continuamos innovando para preparar a la siguiente generación de ingenieros y técnicos líderes en la región.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

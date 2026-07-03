'use client'

import { useState } from 'react';
import { timelineEntries } from '@/lib/kinal-data'
import ZoomModal from './ZoomModal'

const typeIcon: Record<string, string> = {
  institution: 'corporate_fare',
  career: 'school',
  milestone: 'award_star',
}

export default function HistoriaView() {
  const [modalImg, setModalImg] = useState<string | null>(null);
  return (
    <>
      <div className="flex flex-col w-full h-full bg-background overflow-hidden font-sans">
        {/* Header - Glassmorphism style matching HomeView */}
        <header className="flex-shrink-0 bg-white/70 dark:bg-dark-navy/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_2px_12px_rgba(44,62,115,0.03)] z-10">
          <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
            <h1 className="font-extrabold text-xl tracking-tight text-primary dark:text-inverse-primary">
              Kinal<span className="text-[#D4BA46]">Mapp</span>
            </h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
          <div className="w-full max-w-md mx-auto px-container-margin">
            {/* Title Section with premium gradient card */}
            <section className="mb-5 py-5 animate-in fade-in duration-500">
              <div className="bg-gradient-to-br from-[#1b2a4e] to-[#0f1830] text-white p-5 rounded-2xl shadow-glow-navy relative overflow-hidden border border-white/5">
                {/* Decorative blur spotlights */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#fee269]/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#F7931E]/10 rounded-full blur-xl pointer-events-none"></div>
                
                <div className="relative z-10">
                  <p className="text-[9px] font-extrabold tracking-widest text-[#fee269] uppercase opacity-90 mb-2">
                    NUESTRA HISTORIA
                  </p>
                  <h2 className="font-extrabold text-2xl tracking-tight mb-2">
                    65 Años de Legado
                  </h2>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    Recorre la historia que ha forjado el legado técnico y humano de Fundación Kinal a través del tiempo.
                  </p>
                </div>
              </div>
            </section>

            {/* Timeline Gutter Container */}
            <div className="relative pl-10 pr-2 py-4 animate-in fade-in slide-in-from-bottom duration-500 delay-100">
              {/* Glowing vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-[3px] timeline-gradient-line rounded-full"></div>

              <div className="space-y-7">
                {timelineEntries.map((entry, i) => {
                  const is1961 = entry.year === "1961"
                  const is1970 = entry.year === "1970"
                  const is1984 = entry.year === "1984"
                  const is1985 = entry.year === "1985"
                  const is1992_1998 = entry.year === "1992 - 1998"
                  const is1999_2002 = entry.year === "1999 - 2002"
                  const is2007_2010 = entry.year === "2007 - 2010"
                  const is2011_2013 = entry.year === "2011 - 2013"
                  const is2019 = entry.year === "2019"
                  const is2026 = entry.year === "2026"

                  const nodeColor = is2026 ? '#F7931E' : is1961 ? '#D4BA46' : '#2C3E73'

                  return (
                    <div key={i} className="relative scroll-reveal">
                      {/* Timeline node circle — perfectly centered on the 3px line at left-4 */}
                      <div
                        className="absolute -left-[18px] top-5 w-8 h-8 rounded-full border-[2.5px] border-white dark:border-[#0d1420] shadow-lg z-10 flex items-center justify-center"
                        style={{ backgroundColor: nodeColor }}
                      >
                        <span className="material-symbols-outlined text-[14px] leading-none text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {typeIcon[entry.type] || 'star'}
                        </span>
                      </div>

                      {/* Year badge floating above card */}
                      <div className="mb-1.5 ml-1">
                        <span
                          className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider border"
                          style={{
                            backgroundColor: `${nodeColor}18`,
                            color: nodeColor,
                            borderColor: `${nodeColor}30`,
                          }}
                        >
                          {entry.year}
                        </span>
                      </div>

                      {/* Card */}
                      <div className="bg-white dark:bg-[#1a2340] hover-scale-bounce rounded-2xl shadow-premium border border-outline-variant/10 select-none overflow-hidden">
                        {/* Card top accent strip */}
                        <div className="h-[3px] w-full" style={{ backgroundColor: nodeColor }} />

                        <div className="p-4">
                          <h3 className="font-extrabold text-[13px] text-[#2C3E73] dark:text-white mb-2 leading-snug">
                            {entry.title}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-300 text-[11px] leading-relaxed">
                            {entry.description}
                          </p>

                          {/* Interactive Image attachments */}
                          {is1970 && (
                            <div className="mt-3.5 rounded-xl overflow-hidden h-36 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm" onClick={() => setModalImg('/prueba.jpg')}>
                              <img alt="1970 Primer programa tecnico" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/prueba.jpg" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none flex items-end p-2">
                                <span className="text-[9px] text-white/80 font-bold">Ver imagen completa</span>
                              </div>
                            </div>
                          )}
                          {is1984 && (
                            <div className="mt-3.5 rounded-xl overflow-hidden h-36 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm" onClick={() => setModalImg('/2.jpg')}>
                              <img alt="1984 Cierre de etapa" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/2.jpg" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none flex items-end p-2">
                                <span className="text-[9px] text-white/80 font-bold">Ver imagen completa</span>
                              </div>
                            </div>
                          )}
                          {is1985 && (
                            <div className="mt-3.5 rounded-xl overflow-hidden h-36 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm" onClick={() => setModalImg('/1980.jpg')}>
                              <img alt="1985 Expansión" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/1980.jpg" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none flex items-end p-2">
                                <span className="text-[9px] text-white/80 font-bold">Ver imagen completa</span>
                              </div>
                            </div>
                          )}
                          {is1992_1998 && (
                            <div className="mt-3.5 rounded-xl overflow-hidden h-36 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm" onClick={() => setModalImg('/expancion.jpeg')}>
                              <img alt="1992 - 1998 Crecimiento" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/expancion.jpeg" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none flex items-end p-2">
                                <span className="text-[9px] text-white/80 font-bold">Ver imagen completa</span>
                              </div>
                            </div>
                          )}
                          {is1999_2002 && (
                            <div className="mt-3.5 rounded-xl overflow-hidden h-36 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm" onClick={() => setModalImg('/2013.jpg')}>
                              <img alt="1999 - 2002 Transformación" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/2013.jpg" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none flex items-end p-2">
                                <span className="text-[9px] text-white/80 font-bold">Ver imagen completa</span>
                              </div>
                            </div>
                          )}
                          {is2007_2010 && (
                            <div className="mt-3.5 rounded-xl overflow-hidden h-36 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm" onClick={() => setModalImg('/2007.jpg')}>
                              <img alt="2007 - 2010 Desarrollo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/2007.jpg" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none flex items-end p-2">
                                <span className="text-[9px] text-white/80 font-bold">Ver imagen completa</span>
                              </div>
                            </div>
                          )}
                          {is2011_2013 && (
                            <div className="mt-3.5 rounded-xl overflow-hidden h-36 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm" onClick={() => setModalImg('/E.jpg')}>
                              <img alt="2011 - 2013 Desarrollo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/E.jpg" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none flex items-end p-2">
                                <span className="text-[9px] text-white/80 font-bold">Ver imagen completa</span>
                              </div>
                            </div>
                          )}
                          {is2019 && (
                            <div className="mt-3.5 rounded-xl overflow-hidden h-36 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm" onClick={() => setModalImg('/M.jpg')}>
                              <img alt="2019 Evolución" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/M.jpg" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none flex items-end p-2">
                                <span className="text-[9px] text-white/80 font-bold">Ver imagen completa</span>
                              </div>
                            </div>
                          )}
                          {is2026 && (
                            <div className="mt-3.5 rounded-xl overflow-hidden h-36 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm" onClick={() => setModalImg('/actualidad.avif')}>
                              <img alt="2026 Actualidad" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/actualidad.avif" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none flex items-end p-2">
                                <span className="text-[9px] text-white/80 font-bold">Ver imagen completa</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalImg && (
        <ZoomModal src={modalImg} alt="Foto histórica" onClose={() => setModalImg(null)} />
      )}
    </>
  )
}

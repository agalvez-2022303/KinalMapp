'use client'

import { useState } from 'react';
import { timelineEntries } from '@/lib/kinal-data'

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
            {/* Title Section */}
            <section className="mb-4 text-center py-5 animate-in fade-in duration-500">
              <h2 className="font-extrabold text-2xl text-primary dark:text-white tracking-tight mb-1.5">
                Nuestra Historia
              </h2>
              <p className="text-gray-400 font-medium text-xs px-6 leading-relaxed">
                Recorre la historia que ha forjado el legado técnico y humano de fundación Kinal a través de estos 65 años.
              </p>
            </section>

            {/* Timeline Gutter Container */}
            <div className="relative pl-8 pr-2 py-4 animate-in fade-in slide-in-from-bottom duration-500 delay-100">
              {/* Glowing vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-1 timeline-gradient-line rounded-full"></div>

              <div className="space-y-6">
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

                  return (
                    <div key={i} className="relative scroll-reveal">
                      {/* Timeline Node Icon Circle (centered on the line) */}
                      <div
                        className={`absolute left-1 top-4 w-7 h-7 rounded-full border-2 border-white dark:border-[#0d1420] shadow-md z-10 flex items-center justify-center text-white ${
                          is2026 ? 'bg-[#F7931E]' : is1961 ? 'bg-[#D4BA46]' : 'bg-[#2C3E73]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {typeIcon[entry.type] || 'star'}
                        </span>
                      </div>

                      {/* Glassmorphic timeline entry card */}
                      <div className="bg-white dark:bg-[#1a2340] hover-scale-bounce p-4 rounded-2xl shadow-premium border border-outline-variant/10 select-none">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-[#2C3E73]/10 text-[#2C3E73] dark:bg-[#fee269]/10 dark:text-[#fee269]">
                            {entry.year}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-300 font-bold uppercase tracking-widest flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              {typeIcon[entry.type] || 'star'}
                            </span>
                            {entry.type === 'institution' ? 'Kinal' : entry.type === 'career' ? 'Carrera' : 'Hito'}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-sm text-[#2C3E73] dark:text-white mb-1.5 leading-snug">
                          {entry.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-300 text-xs leading-relaxed">
                          {entry.description}
                        </p>

                        {/* Interactive Image attachments */}
                        {is1970 && (
                          <div className="mt-3.5 rounded-xl overflow-hidden h-32 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm active:scale-98" onClick={() => setModalImg('/prueba.jpg')}>
                            <img alt="1970 Primer programa tecnico" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/prueba.jpg" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                          </div>
                        )}

                        {is1984 && (
                          <div className="mt-3.5 rounded-xl overflow-hidden h-32 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm active:scale-98" onClick={() => setModalImg('/2.jpg')}>
                            <img alt="1984 Cierre de etapa" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/2.jpg" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                          </div>
                        )}

                        {is1985 && (
                          <div className="mt-3.5 rounded-xl overflow-hidden h-32 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm active:scale-98" onClick={() => setModalImg('/1980.jpg')}>
                            <img alt="1985 Expansión" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/1980.jpg" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                          </div>
                        )}

                        {is1992_1998 && (
                          <div className="mt-3.5 rounded-xl overflow-hidden h-32 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm active:scale-98" onClick={() => setModalImg('/expancion.jpeg')}>
                            <img alt="1992 - 1998 Crecimiento" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/expancion.jpeg" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                          </div>
                        )}

                        {is1999_2002 && (
                          <div className="mt-3.5 rounded-xl overflow-hidden h-32 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm active:scale-98" onClick={() => setModalImg('/2013.jpg')}>
                            <img alt="1999 - 2002 Transformación" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/2013.jpg" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                          </div>
                        )}

                        {is2007_2010 && (
                          <div className="mt-3.5 rounded-xl overflow-hidden h-32 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm active:scale-98" onClick={() => setModalImg('/2007.jpg')}>
                            <img alt="2007 - 2010 Desarrollo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/2007.jpg" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                          </div>
                        )}

                        {is2011_2013 && (
                          <div className="mt-3.5 rounded-xl overflow-hidden h-32 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm active:scale-98" onClick={() => setModalImg('/E.jpg')}>
                            <img alt="2011 - 2013 Desarrollo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/E.jpg" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                          </div>
                        )}

                        {is2019 && (
                          <div className="mt-3.5 rounded-xl overflow-hidden h-32 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm active:scale-98" onClick={() => setModalImg('/M.jpg')}>
                            <img alt="2019 Evolución" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/M.jpg" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                          </div>
                        )}

                        {is2026 && (
                          <div className="mt-3.5 rounded-xl overflow-hidden h-32 relative cursor-pointer group border border-outline-variant/10 hover:border-[#D4BA46]/50 transition-all duration-300 shadow-sm active:scale-98" onClick={() => setModalImg('/actualidad.avif')}>
                            <img alt="2026 Actualidad" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="/actualidad.avif" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                          </div>
                        )}
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
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          onClick={() => setModalImg(null)}
        >
          <div className="relative max-w-full max-h-full flex items-center justify-center animate-in zoom-in-95 duration-300">
            <button 
              className="absolute -top-12 right-0 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-all duration-200 z-10 flex items-center justify-center"
              onClick={() => setModalImg(null)}
            >
              <span className="material-symbols-outlined block text-[24px]">close</span>
            </button>
            <img 
              src={modalImg} 
              alt="Full view" 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10" 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </>
  )
}
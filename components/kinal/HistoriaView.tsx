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
      <header className="flex-shrink-0 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm z-10">
        <div className="flex items-center justify-between px-container-margin h-16 w-full max-w-md mx-auto">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
            KinalMapp
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        <div className="w-full max-w-md mx-auto px-container-margin">
          <section className="mb-6 text-center py-stack-md animate-in fade-in duration-500">
            <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-primary mb-2">
              Nuestra Historia
            </h2>
            <p className="text-on-surface-variant font-body-md px-4">
              Recorre la historia que ha forjado el legado técnico y humano de fundación Kinal a través de estos 65 años.
            </p>
          </section>

          <div className="relative pl-8 pr-2 py-4 animate-in fade-in slide-in-from-bottom duration-500 delay-100">
            <div className="absolute left-4 top-0 bottom-0 w-1 timeline-line rounded-full"></div>

            <div className="space-y-8">
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
                    <div
                      className={`absolute -left-[26px] top-2 w-5 h-5 rounded-full border-4 border-white shadow-md z-10 ${is2026 ? 'bg-on-tertiary-container' : is1961 ? 'bg-secondary-fixed' : 'bg-primary'
                        }`}
                    ></div>

                    <div className="glass-card p-stack-md rounded-xl border border-white shadow-[0px_4px_12px_rgba(44,62,115,0.08)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-headline-md px-3 py-1 rounded-full text-xs font-bold text-primary-fixed-dim bg-primary/10">
                          {entry.year}
                        </span>
                        <span className="material-symbols-outlined text-primary/70 text-[20px]">
                          {typeIcon[entry.type] || 'star'}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-primary text-base mb-1">{entry.title}</h3>
                      <p className="text-on-surface-variant font-body-md text-xs leading-relaxed">{entry.description}</p>

                      {/* Imagen para 1970 */}
                      {is1970 && (
                        <div className="mt-4 rounded-lg overflow-hidden h-32 relative">
                          <img alt="1970 Primer programa tecnico" className="w-full h-full object-cover" src="/prueba.jpg" onClick={() => setModalImg('/prueba.jpg')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                        </div>
                      )}

                      {/* Imagen para 1984 */}
                      {is1984 && (
                        <div className="mt-4 rounded-lg overflow-hidden h-32 relative">
                          <img alt="1984 Cierre de etapa" className="w-full h-full object-cover" src="/2.jpg" onClick={() => setModalImg('/2.jpg')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                        </div>
                      )}

                      {/* Imagen para 1985 */}
                      {is1985 && (
                        <div className="mt-4 rounded-lg overflow-hidden h-32 relative">
                          <img alt="1985 Expansión" className="w-full h-full object-cover" src="/1980.jpg" onClick={() => setModalImg('/1980.jpg')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                        </div>
                      )}

                      {/* Imagen para 1992 - 1998 */}
                      {is1992_1998 && (
                        <div className="mt-4 rounded-lg overflow-hidden h-32 relative">
                          <img alt="1992 - 1998 Crecimiento" className="w-full h-full object-cover" src="/expancion.jpeg" onClick={() => setModalImg('/expancion.jpeg')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                        </div>
                      )}

                      {/* Imagen para 1999 - 2002 */}
                      {is1999_2002 && (
                        <div className="mt-4 rounded-lg overflow-hidden h-32 relative">
                          <img alt="1999 - 2002 Transformación" className="w-full h-full object-cover" src="/2013.jpg" onClick={() => setModalImg('/2013.jpg')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                        </div>
                      )}

                      {/* Lógica 2007 - 2010 */}
                      {is2007_2010 && (
                        <div className="mt-4 rounded-lg overflow-hidden h-32 relative">
                          <img alt="2007 - 2010 Desarrollo" className="w-full h-full object-cover" src="/2007.jpg" onClick={() => setModalImg('/2007.jpg')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                        </div>
                      )}

                      {/* Lógica 2011 - 2013 */}
                      {is2011_2013 && (
                        <div className="mt-4 rounded-lg overflow-hidden h-32 relative">
                          <img alt="2011 - 2013 Desarrollo" className="w-full h-full object-cover" src="/E.jpg" onClick={() => setModalImg('/E.jpg')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                        </div>
                      )}

                      {/* Lógica 2019 */}
                      {is2019 && (
                        <div className="mt-4 rounded-lg overflow-hidden h-32 relative">
                          <img alt="2019 Evolución" className="w-full h-full object-cover" src="/M.jpg" onClick={() => setModalImg('/M.jpg')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                        </div>
                      )}

                      {/* Lógica 2026 */}
                      {is2026 && (
                        <div className="mt-4 rounded-lg overflow-hidden h-32 relative">
                          <img alt="2026 Actualidad" className="w-full h-full object-cover" src="/actualidad.avif" onClick={() => setModalImg('/actualidad.avif')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setModalImg(null)}>
          <img src={modalImg} alt="Full view" className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
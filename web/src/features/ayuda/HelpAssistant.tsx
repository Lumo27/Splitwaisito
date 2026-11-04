import { useCallback, useEffect, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, CircleHelp, X } from 'lucide-react'

import { obtenerTutorial, TUTORIALES } from './tutoriales'

export function HelpAssistant({ pathname }: { pathname: string }) {
  const [abierto, setAbierto] = useState(false)
  const [pasoActual, setPasoActual] = useState(0)
  const [finalizado, setFinalizado] = useState(false)
  const tutorial = TUTORIALES[obtenerTutorial(pathname)]
  const paso = tutorial.steps[pasoActual]

  const cerrar = useCallback(() => {
    setAbierto(false)
    setPasoActual(0)
    setFinalizado(false)
  }, [])

  useEffect(() => {
    if (!abierto) return
    function cerrarConEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') cerrar()
    }
    window.addEventListener('keydown', cerrarConEscape)
    return () => window.removeEventListener('keydown', cerrarConEscape)
  }, [abierto, cerrar])

  return (
    <>
      <button
        type="button"
        aria-label={`Abrir ayuda: ${tutorial.title}`}
        onClick={() => setAbierto(true)}
        className="fixed right-4 top-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-dark active:scale-95 md:right-6 md:top-6"
      >
        <span aria-hidden="true" className="text-2xl font-bold leading-none">
          ?
        </span>
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={cerrar}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="ayuda-titulo"
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between border-b border-primary-light px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary-dark">
                  <CircleHelp size={22} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-dark">
                    Ayuda interactiva
                  </p>
                  <h2 id="ayuda-titulo" className="mt-0.5 text-lg font-bold text-text">
                    {tutorial.title}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                aria-label="Cerrar tutorial"
                onClick={cerrar}
                className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-primary-light hover:text-primary-dark"
              >
                <X size={20} />
              </button>
            </header>

            {finalizado ? (
              <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary-dark">
                  <Check size={28} />
                </span>
                <h3 className="text-xl font-bold text-text">
                  ¡Tutorial finalizado!
                </h3>
                <p className="leading-6 text-text-muted">
                  Ya podés seguir usando Junti. Esta ayuda queda disponible
                  cuando la necesites.
                </p>
                <button
                  type="button"
                  onClick={cerrar}
                  className="mt-2 w-full rounded-2xl bg-primary px-5 py-3.5 font-bold text-white transition-colors hover:bg-primary-dark"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="px-5 pb-5 pt-4">
                <div className="mb-5 flex gap-1.5" aria-hidden="true">
                  {tutorial.steps.map((item, index) => (
                    <span
                      key={item.title}
                      className={`h-1.5 flex-1 rounded-full ${
                        index <= pasoActual ? 'bg-primary' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">
                  Paso {pasoActual + 1} de {tutorial.steps.length}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-text">
                  {paso.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-text-muted">
                  {paso.description}
                </p>
                <div className="mt-8 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={pasoActual === 0}
                    onClick={() => setPasoActual((actual) => actual - 1)}
                    className="flex min-h-12 flex-1 items-center justify-center gap-1 rounded-2xl border border-primary-light px-3 font-semibold text-primary-dark transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (pasoActual === tutorial.steps.length - 1) {
                        setFinalizado(true)
                      } else {
                        setPasoActual((actual) => actual + 1)
                      }
                    }}
                    className="flex min-h-12 flex-1 items-center justify-center gap-1 rounded-2xl bg-primary px-3 font-semibold text-white transition-colors hover:bg-primary-dark"
                  >
                    {pasoActual === tutorial.steps.length - 1
                      ? 'Finalizar'
                      : 'Siguiente'}
                    {pasoActual < tutorial.steps.length - 1 && (
                      <ChevronRight size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  )
}

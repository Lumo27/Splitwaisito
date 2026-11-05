import { useState } from 'react'
import { useTerminosAcceptance } from './TerminosContext'
import { TERMINOS_DOCUMENTO } from './terminos'

function textoEnriquecido(texto: string) {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((parte, indice) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return <strong key={indice}>{parte.slice(2, -2)}</strong>
    }
    return parte
  })
}

function ContenidoTerminos() {
  return (
    <div className="space-y-3">
      {TERMINOS_DOCUMENTO.split('\n').map((linea, indice) => {
        if (!linea.trim()) return null
        if (linea === '---') {
          return <hr key={indice} className="my-4 border-slate-200" />
        }
        if (linea.startsWith('# ')) {
          return (
            <h2 key={indice} className="text-xl font-bold text-slate-900">
              {linea.slice(2)}
            </h2>
          )
        }
        if (linea.startsWith('## ')) {
          return (
            <h3 key={indice} className="pt-2 text-base font-bold text-primary-dark">
              {linea.slice(3)}
            </h3>
          )
        }
        if (linea.startsWith('- ')) {
          return (
            <div key={indice} className="flex gap-2 pl-2">
              <span aria-hidden="true">•</span>
              <p className="flex-1 leading-6 text-slate-700">
                {textoEnriquecido(linea.slice(2))}
              </p>
            </div>
          )
        }
        if (linea.startsWith('*') && linea.endsWith('*')) {
          return (
            <p key={indice} className="text-sm italic leading-6 text-slate-600">
              {textoEnriquecido(linea.slice(1, -1))}
            </p>
          )
        }
        return (
          <p key={indice} className="leading-6 text-slate-700">
            {textoEnriquecido(linea)}
          </p>
        )
      })}
    </div>
  )
}

export function TerminosScreen() {
  const { estado, error, aceptar, reintentar } = useTerminosAcceptance()
  const [ocupado, setOcupado] = useState(false)
  const [errorAceptacion, setErrorAceptacion] = useState('')
  const [mostrarDocumento, setMostrarDocumento] = useState(false)
  const puedeAceptar = estado === 'requerido' && !ocupado

  async function aceptarYContinuar() {
    if (!puedeAceptar) return
    setOcupado(true)
    setErrorAceptacion('')
    try {
      await aceptar()
    } catch {
      setErrorAceptacion(
        'No pudimos registrar tu aceptación. Revisá tu conexión e intentá nuevamente.',
      )
    } finally {
      setOcupado(false)
    }
  }

  return (
    <main className="min-h-screen overflow-y-auto bg-background px-4 py-6 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col">
        <div className="mb-4 flex items-center gap-3">
          <img
            src="/logo-junti.png"
            alt="Logotipo de Junti"
            className="h-12 w-12 rounded-2xl object-cover"
          />
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Junti
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-950">
          Antes de comenzar
        </h1>
        <p className="mt-2 text-base leading-6 text-slate-600">
          Para utilizar Junti, necesitamos que leas y aceptes nuestros Términos
          y Condiciones de Uso
        </p>

        <section className="mt-5 flex h-[min(44vh,560px)] min-h-48 flex-col overflow-hidden rounded-3xl border border-primary-light bg-white shadow-sm">
          <header className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary-dark">
              Términos y Condiciones de Uso
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Última actualización: 02/11/2026
            </p>
          </header>
          <div
            className="min-h-0 flex-1 overflow-y-auto px-5 py-4"
            aria-label="Documento completo de términos y condiciones"
          >
            <ContenidoTerminos />
          </div>
        </section>

        {estado === 'comprobando' && (
          <p className="mt-3 text-sm text-slate-600" role="status">
            Verificando tu aceptación...
          </p>
        )}

        {estado === 'error' && (
          <div className="mt-3 rounded-2xl border border-primary-light bg-primary-light/40 p-3">
            <p className="text-sm leading-5 text-primary-dark" role="alert">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void reintentar()}
              className="mt-2 font-bold text-primary-dark underline"
            >
              Reintentar verificación
            </button>
          </div>
        )}

        {!!errorAceptacion && (
          <p className="mt-3 text-sm text-primary-dark" role="alert">
            {errorAceptacion}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2 pb-2">
          <button
            type="button"
            disabled={!puedeAceptar}
            onClick={() => void aceptarYContinuar()}
            className="rounded-2xl bg-primary px-5 py-4 text-base font-bold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-primary-light"
          >
            {ocupado ? 'Registrando aceptación...' : 'Aceptar y continuar'}
          </button>
          <button
            type="button"
            onClick={() => setMostrarDocumento(true)}
            className="rounded-2xl px-4 py-2 text-sm font-semibold text-primary-dark underline"
          >
            Consultar los términos completos
          </button>
        </div>
      </div>

      {mostrarDocumento && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terminos-completos-titulo"
        >
          <section className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
            <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2
                id="terminos-completos-titulo"
                className="text-lg font-bold text-slate-900"
              >
                Términos y Condiciones de Uso
              </h2>
              <button
                type="button"
                onClick={() => setMostrarDocumento(false)}
                className="rounded-full bg-primary-light px-4 py-2 font-semibold text-primary-dark"
              >
                Cerrar
              </button>
            </header>
            <div className="overflow-y-auto px-5 py-6">
              <ContenidoTerminos />
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

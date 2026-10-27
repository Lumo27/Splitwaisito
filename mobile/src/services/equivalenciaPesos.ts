import type { MonedaCodigo } from '@/theme/moneda'

export type MonedaExtranjera = Exclude<MonedaCodigo, 'ARS'>

export interface CotizacionPeso {
  venta: number
  consultadaEn: number
}

export type CotizacionesPesos = Partial<
  Record<MonedaExtranjera, CotizacionPeso>
>

export const VIGENCIA_COTIZACION_MS = 6 * 60 * 60 * 1000
export const TIEMPO_LIMITE_COTIZACION_MS = 10 * 1000

const URLs_COTIZACION: Record<MonedaExtranjera, string> = {
  USD: 'https://dolarapi.com/v1/dolares/oficial',
  BRL: 'https://dolarapi.com/v1/cotizaciones/brl',
}

const solicitudesEnCurso = new Map<
  MonedaExtranjera,
  Promise<CotizacionPeso>
>()

/**
 * Solo para tests: limpia las solicitudes en curso para evitar que una
 * Promise colgada de un test anterior interfiera con el siguiente.
 * No llamar en código de producción.
 */
export function _resetSolicitudesEnCurso(): void {
  solicitudesEnCurso.clear()
}

export function convertirAPesos(
  monto: number,
  cotizacionVenta: number,
): number {
  return monto * cotizacionVenta
}

export function cotizacionValida(
  cotizacion: CotizacionPeso | undefined,
  ahora = Date.now(),
): cotizacion is CotizacionPeso {
  return (
    typeof cotizacion === 'object' &&
    cotizacion !== null &&
    Number.isFinite(cotizacion.venta) &&
    cotizacion.venta > 0 &&
    Number.isFinite(cotizacion.consultadaEn) &&
    cotizacion.consultadaEn <= ahora
  )
}

export function cotizacionVencida(
  cotizacion: CotizacionPeso | undefined,
  ahora = Date.now(),
): boolean {
  if (!cotizacionValida(cotizacion, ahora)) return true
  const antiguedad = ahora - cotizacion.consultadaEn
  return antiguedad < 0 || antiguedad > VIGENCIA_COTIZACION_MS
}

export function obtenerCotizacionPesos(
  moneda: MonedaExtranjera,
): Promise<CotizacionPeso> {
  const solicitudExistente = solicitudesEnCurso.get(moneda)
  if (solicitudExistente) return solicitudExistente

  const controlador = new AbortController()
  const temporizador = setTimeout(
    () => controlador.abort(),
    TIEMPO_LIMITE_COTIZACION_MS,
  )

  const solicitud = fetch(URLs_COTIZACION[moneda], {
    signal: controlador.signal,
  })
    .then(async (respuesta) => {
      if (!respuesta.ok) {
        throw new Error(`DolarApi respondió con estado ${respuesta.status}.`)
      }

      const datos: unknown = await respuesta.json()
      if (
        typeof datos !== 'object' ||
        datos === null ||
        !('venta' in datos) ||
        typeof datos.venta !== 'number' ||
        !Number.isFinite(datos.venta) ||
        datos.venta <= 0
      ) {
        throw new Error(`DolarApi devolvió una cotización inválida para ${moneda}.`)
      }

      return { venta: datos.venta, consultadaEn: Date.now() }
    })
    .finally(() => {
      clearTimeout(temporizador)
      solicitudesEnCurso.delete(moneda)
    })

  solicitudesEnCurso.set(moneda, solicitud)
  return solicitud
}

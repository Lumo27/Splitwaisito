export interface CotizacionDolar {
  moneda: string
  casa: string
  nombre: string
  compra: number
  venta: number
  fechaActualizacion: string
}

export const DOLAR_API_URL = 'https://dolarapi.com/v1/dolares'

export const CASAS_PRINCIPALES = [
  'blue',
  'oficial',
  'bolsa',
  'tarjeta',
] as const

/**
 * Consulta la API pública de cotizaciones de Dólar en Argentina (DolarApi).
 */
export async function obtenerCotizacionesDolar(): Promise<CotizacionDolar[]> {
  const respuesta = await fetch(DOLAR_API_URL)
  if (!respuesta.ok) {
    throw new Error('No se pudo obtener la cotización del dólar.')
  }
  const datos = (await respuesta.json()) as CotizacionDolar[]
  if (!Array.isArray(datos)) {
    throw new Error('Respuesta inválida de la API del dólar.')
  }
  return datos
}

/**
 * Formatea la fecha ISO de actualización a un formato legible para el usuario en Argentina.
 * Ejemplo: 22/10/2026, 11:58 hs
 */
export function formatearFechaCotizacion(fechaIso: string): string {
  try {
    const fecha = new Date(fechaIso)
    if (Number.isNaN(fecha.getTime())) return fechaIso
    const dia = String(fecha.getDate()).padStart(2, '0')
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const anio = fecha.getFullYear()
    const horas = String(fecha.getHours()).padStart(2, '0')
    const minutos = String(fecha.getMinutes()).padStart(2, '0')
    return `${dia}/${mes}/${anio} a las ${horas}:${minutos} hs`
  } catch {
    return fechaIso
  }
}

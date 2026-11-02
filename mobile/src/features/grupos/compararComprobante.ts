/** Datos que la IA lee de un comprobante de transferencia. */
export interface DatosComprobante {
  destinatario?: string
  alias?: string
  cbuCvu?: string
  monto?: number
  /** Fecha de la operación en formato AAAA-MM-DD. */
  fecha?: string
}

export interface PagoEsperado {
  acreedorNombre: string
  acreedorAlias?: string
  monto: number
  /** Fecha de hoy en formato AAAA-MM-DD (se pasa para poder testear). */
  hoy: string
}

export interface ResultadoVerificacion {
  coincide: boolean
  motivos: string[]
}

// Un comprobante viejo no sirve para una deuda de hoy.
const DIAS_MAXIMOS = 30
// Tolerancia para redondeos de la app del banco.
const TOLERANCIA_MONTO = 1

const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

function diasEntre(desde: string, hasta: string) {
  return (Date.parse(hasta) - Date.parse(desde)) / 86_400_000
}

/**
 * Compara lo leído en el comprobante con el pago que se quiere registrar. El
 * destinatario se acepta por alias (único, como el CBU) o por nombre; además
 * tienen que coincidir el monto y la fecha. Cada problema se devuelve como
 * motivo para mostrárselo a quien tiene que aprobar el pago a mano.
 */
export function compararComprobante(
  datos: DatosComprobante,
  esperado: PagoEsperado,
): ResultadoVerificacion {
  const motivos: string[] = []

  const alias = esperado.acreedorAlias ? normalizar(esperado.acreedorAlias) : ''
  const aliasCoincide = Boolean(
    alias && datos.alias && normalizar(datos.alias) === alias,
  )
  const nombre = normalizar(esperado.acreedorNombre)
  const nombreCoincide = Boolean(
    nombre &&
      datos.destinatario &&
      normalizar(datos.destinatario).split(/\s+/).includes(nombre.split(/\s+/)[0]),
  )
  if (!aliasCoincide && !nombreCoincide) {
    motivos.push(
      datos.alias || datos.destinatario
        ? `El destinatario (${datos.alias || datos.destinatario}) no coincide con ${esperado.acreedorNombre}.`
        : 'No se pudo leer a quién se le transfirió.',
    )
  }

  if (typeof datos.monto !== 'number') {
    motivos.push('No se pudo leer el monto.')
  } else if (Math.abs(datos.monto - esperado.monto) > TOLERANCIA_MONTO) {
    motivos.push(
      `El monto del comprobante (${datos.monto}) no coincide con la deuda (${esperado.monto}).`,
    )
  }

  if (!datos.fecha || Number.isNaN(Date.parse(datos.fecha))) {
    motivos.push('No se pudo leer la fecha.')
  } else {
    const antiguedad = diasEntre(datos.fecha, esperado.hoy)
    if (antiguedad < 0) motivos.push('La fecha del comprobante es futura.')
    else if (antiguedad > DIAS_MAXIMOS)
      motivos.push(`El comprobante tiene más de ${DIAS_MAXIMOS} días.`)
  }

  return { coincide: motivos.length === 0, motivos }
}

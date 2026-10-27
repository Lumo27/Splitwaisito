export type MonedaCodigo = 'ARS' | 'USD' | 'BRL'

export interface MonedaConfig {
  codigo: MonedaCodigo
  simbolo: string
  nombre: string
}

export const MONEDAS: Record<MonedaCodigo, MonedaConfig> = {
  ARS: { codigo: 'ARS', simbolo: '$', nombre: 'Pesos argentinos (ARS)' },
  USD: { codigo: 'USD', simbolo: 'US$', nombre: 'Dólares (USD)' },
  BRL: { codigo: 'BRL', simbolo: 'R$', nombre: 'Reales brasileños (BRL)' },
}

export const LISTA_MONEDAS: MonedaConfig[] = [
  MONEDAS.ARS,
  MONEDAS.USD,
  MONEDAS.BRL,
]

/**
 * Formatea un número con separador de miles (.) y decimal (,) al estilo
 * argentino, mostrando hasta 2 decimales solo cuando son distintos de cero.
 *
 * Se implementa manualmente en lugar de usar toLocaleString porque el motor
 * Hermes de React Native no garantiza soporte completo de Intl en builds de
 * producción (APK), lo que haría que los separadores de miles desaparezcan.
 */
function formatearNumero(monto: number): string {
  const redondeado = Math.round(monto * 100) / 100
  const [parteEntera, parteDecimal] = Math.abs(redondeado).toFixed(2).split('.')
  const conSeparadores = (parteEntera ?? '0').replace(
    /\B(?=(\d{3})+(?!\d))/g,
    '.',
  )
  const signo = redondeado < 0 ? '-' : ''
  // Eliminar ceros finales en la parte decimal (ej: "50" → "5", "00" → "")
  const decimalSinCeros = (parteDecimal ?? '').replace(/0+$/, '')
  const valor =
    decimalSinCeros.length === 0
      ? conSeparadores
      : `${conSeparadores},${decimalSinCeros}`
  return `${signo}${valor}`
}

export function formatearMoneda(
  monto: number,
  moneda: MonedaCodigo = 'ARS',
): string {
  const config = MONEDAS[moneda] ?? MONEDAS.ARS
  return `${config.simbolo}${formatearNumero(monto)}`
}

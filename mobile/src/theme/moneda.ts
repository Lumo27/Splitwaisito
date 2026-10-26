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

export function formatearMoneda(
  monto: number,
  moneda: MonedaCodigo = 'ARS',
): string {
  const config = MONEDAS[moneda] ?? MONEDAS.ARS
  const valor = monto.toLocaleString('es-AR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })
  return `${config.simbolo}${valor}`
}

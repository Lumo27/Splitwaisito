import { Text } from 'react-native'
import type { MonedaCodigo } from '@/theme/moneda'
import { useAppStore } from '@/store/useAppStore'
import {
  convertirAPesos,
  cotizacionValida,
} from '@/services/equivalenciaPesos'
import { formatearMoneda } from '@/theme/moneda'

export function EquivalenciaPesos({
  monto,
  moneda,
}: {
  monto: number
  moneda: MonedaCodigo
}) {
  const cotizacion = useAppStore((state) =>
    moneda === 'ARS' ? undefined : state.cotizacionesPesos[moneda],
  )

  if (
    moneda === 'ARS' ||
    !cotizacionValida(cotizacion) ||
    !Number.isFinite(monto)
  ) {
    return null
  }

  const valorEnPesos = convertirAPesos(monto, cotizacion.venta)
  if (!Number.isFinite(valorEnPesos)) return null
  const referencia = moneda === 'USD' ? 'dólar oficial' : 'real brasileño'

  return (
    <Text className="text-xs text-text-muted">
      ≈ {formatearMoneda(valorEnPesos, 'ARS')} · {referencia}
    </Text>
  )
}

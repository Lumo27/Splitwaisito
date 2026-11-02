import { View, Text } from 'react-native'
import type { GastoFirestore } from '@/services/firestore'
import { COLOR_CATEGORIAS } from '@/theme/categorias'
import { formatearMoneda, type MonedaCodigo } from '@/theme/moneda'
import { resumirGastosPorCategoria } from './gastosPorCategoria'

export function GastosPorCategoria({
  gastos,
  moneda,
}: {
  gastos: GastoFirestore[]
  moneda: MonedaCodigo
}) {
  const resumen = resumirGastosPorCategoria(gastos)
  const total = resumen.reduce((suma, item) => suma + item.monto, 0)

  return (
    <View className="mt-5 gap-4 rounded-2xl bg-white p-4">
      <View className="gap-1">
        <Text
          accessibilityRole="header"
          className="text-lg font-bold text-text"
        >
          Gastos por categoría
        </Text>
        <Text className="text-sm text-text-muted">
          Distribución de gastos · {moneda}
        </Text>
      </View>
      {total === 0 ? (
        <Text className="text-sm text-text-muted">
          Todavía no hay gastos para mostrar.
        </Text>
      ) : (
        <View className="gap-4">
          {resumen.map((item) => {
            const porcentaje = Math.round(item.porcentaje)
            return (
              <View
                key={item.categoria}
                accessible
                accessibilityLabel={`${item.categoria}: ${formatearMoneda(item.monto, moneda)}, ${porcentaje}%`}
                className="gap-2"
              >
                <View className="flex-row items-center justify-between gap-2">
                  <Text className="flex-1 text-sm font-semibold text-text">
                    {item.categoria}
                  </Text>
                  <Text className="text-sm font-semibold text-text">
                    {formatearMoneda(item.monto, moneda)}
                  </Text>
                  <Text className="w-10 text-right text-xs text-text-muted">
                    {porcentaje}%
                  </Text>
                </View>
                <View className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <View
                    className="h-2 rounded-full"
                    style={{
                      width: `${item.porcentaje}%`,
                      backgroundColor: COLOR_CATEGORIAS[item.categoria].primary,
                    }}
                  />
                </View>
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

import { ScrollView, Text, View } from 'react-native'
import { Opcion } from '@/components/Formulario'
import { useAppStore } from '@/store/useAppStore'
import type { Preferencias } from '@/store/useAppStore'

type MonedaPreferida = Preferencias['monedaPreferida']

const OPCIONES: { valor: MonedaPreferida; etiqueta: string }[] = [
  { valor: 'ARS', etiqueta: 'Pesos argentinos (ARS)' },
  { valor: 'USD', etiqueta: 'Dólares (USD)' },
  { valor: 'BRL', etiqueta: 'Reales brasileños (BRL)' },
]

export function MonedaScreen() {
  const monedaPreferida = useAppStore((state) => state.preferencias.monedaPreferida)
  const actualizarPreferencias = useAppStore((state) => state.actualizarPreferencias)

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 12 }}
    >
      <View className="gap-3">
        {OPCIONES.map(({ valor, etiqueta }) => (
          <Opcion
            key={valor}
            texto={etiqueta}
            elegida={monedaPreferida === valor}
            onPress={() => actualizarPreferencias({ monedaPreferida: valor })}
          />
        ))}
      </View>

      <Text className="mt-2 px-1 text-xs leading-5 text-textMuted">
        La moneda preferida se usa como sugerencia al crear nuevos grupos. Los grupos existentes no
        se modifican.
      </Text>
    </ScrollView>
  )
}

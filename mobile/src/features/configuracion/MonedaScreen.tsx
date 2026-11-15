import { ScrollView, View } from 'react-native'
import { Opcion } from '@/components/Formulario'
import { Texto as Text } from '@/components/Texto'
import { useAppStore } from '@/store/useAppStore'
import type { Preferencias } from '@/store/useAppStore'
import { useTraduccion } from '@/i18n/useTraduccion'

type MonedaPreferida = Preferencias['monedaPreferida']

const OPCIONES: { valor: MonedaPreferida; clave: string }[] = [
  { valor: 'ARS', clave: 'Pesos argentinos (ARS)' },
  { valor: 'USD', clave: 'Dólares (USD)' },
  { valor: 'BRL', clave: 'Reales brasileños (BRL)' },
]

export function MonedaScreen() {
  const monedaPreferida = useAppStore((state) => state.preferencias.monedaPreferida)
  const actualizarPreferencias = useAppStore((state) => state.actualizarPreferencias)
  const t = useTraduccion()

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 12 }}
    >
      <View className="gap-3">
        {OPCIONES.map(({ valor, clave }) => (
          <Opcion
            key={valor}
            texto={t(clave)}
            elegida={monedaPreferida === valor}
            onPress={() => actualizarPreferencias({ monedaPreferida: valor })}
          />
        ))}
      </View>

      <Text className="mt-2 px-1 text-xs leading-5 text-textMuted">
        {t('La moneda preferida se usa como sugerencia al crear nuevos grupos. Los grupos existentes no se modifican.')}
      </Text>
    </ScrollView>
  )
}

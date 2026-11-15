import { Stack } from 'expo-router'
import { MonedaScreen } from '@/features/configuracion/MonedaScreen'
import { useTraduccion } from '@/i18n/textos'
import { useColorScheme } from 'nativewind'

export default function MonedaRoute() {
  const t = useTraduccion()
  const { colorScheme } = useColorScheme()

  return (
    <>
      <Stack.Screen
        options={{
          title: t('Moneda preferida'),
          headerTintColor: colorScheme === 'dark' ? '#8ED8B0' : '#2E7D57',
          headerTitleStyle: {
            color: colorScheme === 'dark' ? '#F1F5F9' : '#152238',
          },
        }}
      />
      <MonedaScreen />
    </>
  )
}

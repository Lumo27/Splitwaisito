import { Stack } from 'expo-router'
import { MonedaScreen } from '@/features/configuracion/MonedaScreen'
import { colores } from '@/theme/colores'

export default function MonedaRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Moneda preferida',
          headerTintColor: colores.primaryDark,
          headerTitleStyle: { color: colores.text },
        }}
      />
      <MonedaScreen />
    </>
  )
}

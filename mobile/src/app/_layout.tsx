import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { colores } from '@/theme/colores'

export { ErrorBoundary } from 'expo-router'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colores.primaryDark,
          headerTitleStyle: { color: colores.text },
          contentStyle: { backgroundColor: colores.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="grupos/[id]/index" options={{ title: 'Grupo' }} />
        <Stack.Screen
          name="grupos/nuevo"
          options={{ title: 'Crear grupo', presentation: 'modal' }}
        />
        <Stack.Screen
          name="grupos/[id]/cargar-gasto"
          options={{ title: 'Cargar gasto', presentation: 'modal' }}
        />
        <Stack.Screen
          name="grupos/[id]/saldar"
          options={{ title: 'Saldar deuda', presentation: 'modal' }}
        />
      </Stack>
    </>
  )
}

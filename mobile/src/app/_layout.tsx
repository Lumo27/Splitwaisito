import '../global.css'

import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { AuthBootstrap } from '@/features/auth/AuthBootstrap'
import { colores } from '@/theme/colores'
import { useAppStore } from '@/store/useAppStore'

export { ErrorBoundary } from 'expo-router'

export default function RootLayout() {
  const usuario = useAppStore((state) => state.usuarioActual)
  return (
    <AuthBootstrap>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colores.primaryDark,
          headerTitleStyle: { color: colores.text },
          contentStyle: { backgroundColor: colores.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Protected guard={!usuario}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={Boolean(usuario)}>
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
        </Stack.Protected>
      </Stack>
    </AuthBootstrap>
  )
}

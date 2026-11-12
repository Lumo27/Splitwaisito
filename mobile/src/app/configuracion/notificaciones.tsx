import { Stack } from 'expo-router'
import { NotificacionesScreen } from '@/features/configuracion/NotificacionesScreen'
import { colores } from '@/theme/colores'

export default function NotificacionesRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notificaciones',
          headerTintColor: colores.primaryDark,
          headerTitleStyle: { color: colores.text },
        }}
      />
      <NotificacionesScreen />
    </>
  )
}

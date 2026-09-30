import { Stack } from 'expo-router'

import { EnlacePendiente } from '@/components/EnlacePendiente'
import { PantallaPendiente } from '@/components/PantallaPendiente'

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'No encontrada' }} />
      <PantallaPendiente titulo="Esta pantalla no existe">
        <EnlacePendiente href="/" texto="Volver al inicio" />
      </PantallaPendiente>
    </>
  )
}

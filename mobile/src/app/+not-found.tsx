import { router, Stack } from 'expo-router'
import { Text } from 'react-native'
import { Boton, Pantalla, Tarjeta, Titulo } from '@/components/Formulario'

export default function NotFound() {
  return (
    <Pantalla>
      <Stack.Screen options={{ title: 'Página no encontrada' }} />
      <Tarjeta>
        <Titulo>No encontramos esta pantalla</Titulo>
        <Text className="text-sm leading-6 text-text-muted">
          El enlace puede haber cambiado. Volvé al inicio para continuar.
        </Text>
        <Boton texto="Volver al inicio" onPress={() => router.replace('/')} />
      </Tarjeta>
    </Pantalla>
  )
}

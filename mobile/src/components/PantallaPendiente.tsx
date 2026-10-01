import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

// Placeholder del esqueleto de navegación: cada pantalla lo usa hasta que se
// migre su versión real desde /web.
export function PantallaPendiente({
  titulo,
  children,
}: {
  titulo: string
  children?: ReactNode
}) {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-background p-6">
      <Text className="text-xl font-bold text-text">{titulo}</Text>
      <Text className="text-sm text-text-muted">Pantalla pendiente de migrar</Text>
      {children}
    </View>
  )
}

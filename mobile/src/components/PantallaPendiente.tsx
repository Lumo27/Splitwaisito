import type { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { colores } from '@/theme/colores'

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
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.subtitulo}>Pantalla pendiente de migrar</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: colores.background,
  },
  titulo: { fontSize: 20, fontWeight: '700', color: colores.text },
  subtitulo: { fontSize: 14, color: colores.textMuted },
})

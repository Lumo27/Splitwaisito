import { Link, type Href } from 'expo-router'
import { StyleSheet } from 'react-native'

import { colores } from '@/theme/colores'

// Enlace de texto para recorrer el esqueleto de navegación.
export function EnlacePendiente({ href, texto }: { href: Href; texto: string }) {
  return (
    <Link href={href} style={styles.enlace}>
      {texto}
    </Link>
  )
}

const styles = StyleSheet.create({
  enlace: { fontSize: 16, fontWeight: '600', color: colores.primaryDark },
})

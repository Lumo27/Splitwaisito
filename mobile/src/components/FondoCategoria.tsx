import React, { type ReactNode } from 'react'
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import {
  IMAGENES_CATEGORIAS,
  COLOR_CATEGORIAS,
  type CategoriaGasto,
} from '../theme/categorias'

interface FondoCategoriaProps {
  categoria: CategoriaGasto | string
  overlayOpacity?: number
  overlayColor?: string
  style?: StyleProp<ViewStyle>
  children?: ReactNode
}

/**
 * FondoCategoria
 * Muestra la ilustración de la categoría de fondo con una capa de opacidad
 * para que el texto o los botones de encima se lean con claridad.
 */
export function FondoCategoria({
  categoria,
  overlayOpacity = 0.86,
  overlayColor = '#FFFFFF',
  style,
  children,
}: FondoCategoriaProps) {
  const catKey = (categoria in IMAGENES_CATEGORIAS
    ? categoria
    : 'Otro') as CategoriaGasto

  return (
    <View style={[styles.contenedor, style]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image
          source={IMAGENES_CATEGORIAS[catKey]}
          style={styles.imagen}
          resizeMode="cover"
        />
        {/* Capa de contraste para preservar la legibilidad del texto */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: overlayColor, opacity: overlayOpacity },
          ]}
        />
      </View>

      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    position: 'relative',
    overflow: 'hidden',
  },
  imagen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
})

export { COLOR_CATEGORIAS }

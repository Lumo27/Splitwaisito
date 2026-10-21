import React, { type ReactNode } from 'react'
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { SvgXml } from 'react-native-svg'
import {
  SVG_CATEGORIAS,
  COLOR_CATEGORIAS,
  type CategoriaGasto,
} from '../theme/svgCategorias'

interface FondoCategoriaProps {
  categoria: CategoriaGasto | string
  overlayOpacity?: number
  overlayColor?: string
  style?: StyleProp<ViewStyle>
  children?: ReactNode
}

/**
 * FondoCategoria
 * Renderiza la ilustración vectorial de la categoría de fondo
 * con una capa de opacidad controlada para garantizar que
 * cualquier texto o botón superpuesto se lea con total claridad.
 */
export function FondoCategoria({
  categoria,
  overlayOpacity = 0.86,
  overlayColor = '#FFFFFF',
  style,
  children,
}: FondoCategoriaProps) {
  const catKey = (categoria in SVG_CATEGORIAS
    ? categoria
    : 'Otro') as CategoriaGasto

  const svgXml = SVG_CATEGORIAS[catKey]

  return (
    <View style={[styles.contenedor, style]}>
      {/* Capa de fondo con la ilustración vectorial */}
      {svgXml ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SvgXml
            xml={svgXml}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
          {/* Capa de contraste / overlay para preservar legibilidad del texto */}
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: overlayColor, opacity: overlayOpacity },
            ]}
          />
        </View>
      ) : null}

      {/* Contenido en primer plano */}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  contenedor: {
    position: 'relative',
    overflow: 'hidden',
  },
})

export { COLOR_CATEGORIAS }

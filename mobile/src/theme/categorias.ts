import type { ImageSourcePropType } from 'react-native'

export type CategoriaGasto = 'Comida' | 'Transporte' | 'Alojamiento' | 'Otro'

// Ilustraciones exportadas una sola vez a PNG (1200×600, 25-60 KB): una imagen
// se decodifica una vez y queda en caché, un SVG se vuelve a dibujar en cada render.
export const IMAGENES_CATEGORIAS: Record<CategoriaGasto, ImageSourcePropType> = {
  Alojamiento: require('../../assets/images/categorias/alojamiento.png'),
  Comida: require('../../assets/images/categorias/comida.png'),
  Otro: require('../../assets/images/categorias/otro.png'),
  Transporte: require('../../assets/images/categorias/transporte.png'),
}

export const COLOR_CATEGORIAS: Record<
  CategoriaGasto,
  { primary: string; light: string; dark: string }
> = {
  Comida: {
    primary: '#FF4040',
    light: '#FFEBEB',
    dark: '#9E1B1B',
  },
  Transporte: {
    primary: '#E6A200',
    light: '#FFF8E1',
    dark: '#7A5600',
  },
  Alojamiento: {
    primary: '#005EFF',
    light: '#EBF2FF',
    dark: '#0036A0',
  },
  Otro: {
    primary: '#22B14C',
    light: '#E8F8ED',
    dark: '#13622B',
  },
}

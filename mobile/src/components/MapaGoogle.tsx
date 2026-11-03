import { Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import type { Coordenadas } from './MapaLeaflet'

export const urlGoogleMaps = ({ lat, lng }: Coordenadas) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

/**
 * Muestra un punto con el mapa embebido de Google (sin clave ni costo). Es
 * solo de lectura: para elegir un punto se usa MapaLeaflet.
 */
export function MapaGoogle({ lat, lng }: Coordenadas) {
  const uri = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
  if (Platform.OS === 'web') {
    return (
      <iframe
        title="Ubicación"
        src={uri}
        style={{ border: 0, width: '100%', height: '100%' }}
      />
    )
  }
  return <WebView source={{ uri }} scrollEnabled={false} />
}

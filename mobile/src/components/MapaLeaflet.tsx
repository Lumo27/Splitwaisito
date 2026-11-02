import { useEffect, useMemo } from 'react'
import { Platform } from 'react-native'
import { WebView } from 'react-native-webview'

export interface Coordenadas {
  lat: number
  lng: number
}

const CENTRO_POR_DEFECTO: Coordenadas = { lat: -34.6037, lng: -58.3816 }

function htmlMapa(marcador: Coordenadas | undefined, interactivo: boolean) {
  const centro = marcador ?? CENTRO_POR_DEFECTO
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
      body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; }
      .leaflet-control-attribution { font-size: 10px; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      const map = L.map('map', { zoomControl: ${interactivo} })
        .setView([${centro.lat}, ${centro.lng}], ${marcador ? 15 : 13});
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap &copy; CARTO'
      }).addTo(map);
      let marker = ${marcador ? `L.marker([${marcador.lat}, ${marcador.lng}]).addTo(map)` : 'null'};
      ${
        interactivo
          ? `map.on('click', function(e) {
        if (marker) marker.setLatLng(e.latlng); else marker = L.marker(e.latlng).addTo(map);
        const mensaje = JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng });
        if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(mensaje);
        else if (window.parent !== window) window.parent.postMessage(mensaje, '*');
      });`
          : ''
      }
    </script>
  </body>
</html>`
}

function leerCoordenadas(data: unknown): Coordenadas | null {
  if (typeof data !== 'string') return null
  try {
    const coords = JSON.parse(data)
    return typeof coords.lat === 'number' && typeof coords.lng === 'number'
      ? { lat: coords.lat, lng: coords.lng }
      : null
  } catch {
    return null
  }
}

/**
 * Mapa para elegir un punto: Leaflet con el estilo Voyager de CARTO sobre
 * datos de OpenStreetMap (gratis, sin clave). En el celu va en un
 * WebView; en web, donde react-native-webview no funciona, en un iframe que
 * avisa con postMessage. Con `onTocar` el usuario puede marcar un punto.
 */
export function MapaLeaflet({
  marcador,
  onTocar,
}: {
  marcador?: Coordenadas
  onTocar?: (coords: Coordenadas) => void
}) {
  const interactivo = Boolean(onTocar)
  const lat = marcador?.lat
  const lng = marcador?.lng
  // Memorizado para que el WebView no recargue el mapa en cada render.
  const html = useMemo(
    () =>
      htmlMapa(
        lat !== undefined && lng !== undefined ? { lat, lng } : undefined,
        interactivo,
      ),
    [lat, lng, interactivo],
  )

  useEffect(() => {
    if (Platform.OS !== 'web' || !onTocar) return
    const escuchar = (event: MessageEvent) => {
      const coords = leerCoordenadas(event.data)
      if (coords) onTocar(coords)
    }
    window.addEventListener('message', escuchar)
    return () => window.removeEventListener('message', escuchar)
  }, [onTocar])

  if (Platform.OS === 'web') {
    return (
      <iframe
        title="Mapa"
        srcDoc={html}
        style={{ border: 0, width: '100%', height: '100%' }}
      />
    )
  }
  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      scrollEnabled={false}
      onMessage={(event) => {
        const coords = leerCoordenadas(event.nativeEvent.data)
        if (coords) onTocar?.(coords)
      }}
    />
  )
}

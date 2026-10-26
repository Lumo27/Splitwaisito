import { useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { MapPin, X } from 'lucide-react-native'
import { colores } from '@/theme/colores'

interface Props {
  visible: boolean
  onCerrar: () => void
  coordenadasIniciales?: { lat: number; lng: number }
  onSeleccionar: (coords: { lat: number; lng: number }) => void
}

export function MapaSelector({
  visible,
  onCerrar,
  coordenadasIniciales,
  onSeleccionar,
}: Props) {
  const [seleccion, setSeleccion] = useState<{ lat: number; lng: number } | null>(
    coordenadasIniciales ?? null,
  )

  const latInicial = coordenadasIniciales?.lat ?? -34.6037
  const lngInicial = coordenadasIniciales?.lng ?? -58.3816
  const tieneInicial = Boolean(coordenadasIniciales)

  const html = `
    <!DOCTYPE html>
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
          const map = L.map('map').setView([${latInicial}, ${lngInicial}], ${tieneInicial ? 15 : 13});
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);

          let marker = ${tieneInicial ? `L.marker([${latInicial}, ${lngInicial}]).addTo(map)` : 'null'};

          map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            if (marker) {
              marker.setLatLng(e.latlng);
            } else {
              marker = L.marker(e.latlng).addTo(map);
            }
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ lat, lng }));
            }
          });
        </script>
      </body>
    </html>
  `

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCerrar}>
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between border-b border-slate-200 px-4 py-3">
          <View className="flex-row items-center gap-2">
            <MapPin size={20} color={colores.primaryDark} />
            <Text className="text-base font-bold text-text">
              Marcar ubicación en el mapa
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar mapa"
            onPress={onCerrar}
            className="p-1"
          >
            <X size={24} color="#64748B" />
          </Pressable>
        </View>

        <View className="flex-1">
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data)
                if (typeof data.lat === 'number' && typeof data.lng === 'number') {
                  setSeleccion({ lat: data.lat, lng: data.lng })
                }
              } catch {
                // Formato no JSON
              }
            }}
          />
        </View>

        <View className="border-t border-slate-200 p-4">
          <Text className="mb-2 text-xs text-text-muted">
            Tocá en el mapa para marcar el punto. Fuente: © OpenStreetMap.
          </Text>
          {seleccion ? (
            <Text className="mb-3 text-sm font-semibold text-primary-dark">
              Coordenadas: {seleccion.lat.toFixed(5)}, {seleccion.lng.toFixed(5)}
            </Text>
          ) : (
            <Text className="mb-3 text-sm text-text-muted">
              Tocá cualquier punto del mapa para posicionar el marcador.
            </Text>
          )}
          <View className="flex-row gap-3">
            <Pressable
              accessibilityRole="button"
              onPress={onCerrar}
              className="flex-1 items-center justify-center rounded-2xl border border-slate-200 py-3"
            >
              <Text className="font-semibold text-slate-700">Cancelar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={!seleccion}
              onPress={() => {
                if (seleccion) {
                  onSeleccionar(seleccion)
                  onCerrar()
                }
              }}
              className={`flex-1 items-center justify-center rounded-2xl py-3 ${
                seleccion ? 'bg-primary' : 'bg-slate-200'
              }`}
            >
              <Text className="font-bold text-white">Confirmar punto</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

import { useState } from 'react'
import { Modal, Pressable, View } from 'react-native'
import { Texto as Text } from '@/components/Texto'
import { MapPin, X } from 'lucide-react-native'
import { MapaLeaflet, type Coordenadas } from './MapaLeaflet'
import { useReducirAnimaciones } from '@/hooks/useMovimientoReducido'
import { usePaletaActual } from '@/theme/usePaletaActual'
import { useTraduccion } from '@/i18n/useTraduccion'

interface Props {
  visible: boolean
  onCerrar: () => void
  coordenadasIniciales?: Coordenadas
  onSeleccionar: (coords: Coordenadas) => void
}

export function MapaSelector({
  visible,
  onCerrar,
  coordenadasIniciales,
  onSeleccionar,
}: Props) {
  const t = useTraduccion()
  const [seleccion, setSeleccion] = useState<Coordenadas | null>(
    coordenadasIniciales ?? null,
  )
  const paleta = usePaletaActual()
  const reducirAnimaciones = useReducirAnimaciones()

  return (
    <Modal
      visible={visible}
      animationType={reducirAnimaciones ? 'none' : 'slide'}
      onRequestClose={onCerrar}
    >
      <View className="flex-1 bg-background">
        <View className="flex-row items-center justify-between border-b border-slate-200 px-4 py-3">
          <View className="flex-row items-center gap-2">
            <MapPin size={20} color={paleta.primaryDark} />
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
            <X size={24} color={paleta.textMuted} />
          </Pressable>
        </View>

        <View className="flex-1">
          <MapaLeaflet marcador={coordenadasIniciales} onTocar={setSeleccion} />
        </View>

        <View className="border-t border-slate-200 p-4">
          <Text className="mb-2 text-xs text-text-muted">
            Tocá en el mapa para marcar el punto. Fuente: © OpenStreetMap, © CARTO.
          </Text>
          {seleccion ? (
            <Text className="mb-3 text-sm font-semibold text-primary-dark">
              {t('Coordenadas: {lat}, {lng}', {
                lat: seleccion.lat.toFixed(5),
                lng: seleccion.lng.toFixed(5),
              })}
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

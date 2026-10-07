import { Text, View, type StyleProp, type ViewStyle } from 'react-native'
import { Sparkles } from 'lucide-react-native'
import { colores } from '@/theme/colores'
import { Entrada, useMovimientoReducido } from './Movimiento'

export function Portada({
  etiqueta,
  titulo,
  descripcion,
  valor,
  etiquetaValor,
  pie,
  style,
}: {
  etiqueta: string
  titulo: string
  descripcion?: string
  valor?: string
  etiquetaValor?: string
  pie?: string
  style?: StyleProp<ViewStyle>
}) {
  const reducido = useMovimientoReducido()
  return (
    <Entrada reducido={reducido} style={style}>
      <View
        className="overflow-hidden rounded-3xl p-6"
        style={{ backgroundColor: colores.primaryDark }}
      >
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            position: 'absolute',
            right: -32,
            top: -45,
            width: 190,
            height: 190,
            borderRadius: 95,
            backgroundColor: '#138970',
          }}
        />
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            position: 'absolute',
            right: 12,
            bottom: -60,
            width: 130,
            height: 130,
            borderRadius: 65,
            backgroundColor: '#20A68B',
          }}
        />
        <View className="mb-4 flex-row items-center gap-2">
          <Sparkles color="#BDF3DF" size={16} />
          <Text
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#C6F6E4', flexShrink: 1 }}
          >
            {etiqueta}
          </Text>
        </View>
        <Text
          accessibilityRole="header"
          className="text-3xl font-bold tracking-tight text-white"
        >
          {titulo}
        </Text>
        {descripcion ? (
          <Text className="mt-3 text-sm leading-6" style={{ color: '#E1F8EF' }}>
            {descripcion}
          </Text>
        ) : null}
        {valor && etiquetaValor ? (
          <Text
            className="mt-4 text-xs font-semibold"
            style={{ color: '#E1F8EF' }}
          >
            {etiquetaValor}
          </Text>
        ) : null}
        {valor ? (
          <Text className="mt-4 text-4xl font-bold text-white">{valor}</Text>
        ) : null}
        {pie ? (
          <View
            className="mt-4 self-start rounded-full px-3 py-2"
            style={{ backgroundColor: '#DDF8EC' }}
          >
            <Text className="text-xs font-semibold text-primary-dark">
              {pie}
            </Text>
          </View>
        ) : null}
      </View>
    </Entrada>
  )
}

import { ScrollView, Switch, View } from 'react-native'
import { Texto } from '@/components/Texto'
import { useTraduccion } from '@/i18n/useTraduccion'
import { useAppStore } from '@/store/useAppStore'
import { colores } from '@/theme/colores'
import { usePaletaActual } from '@/theme/usePaletaActual'

type OpcionAccesibilidad =
  | 'highContrast'
  | 'reducedMotion'
  | 'respectSystemMotion'
  | 'improveReadability'
  | 'highlightInteractive'
  | 'largeTouchTargets'

const OPCIONES: {
  clave: OpcionAccesibilidad
  etiqueta: string
  descripcion: string
}[] = [
  {
    clave: 'highContrast',
    etiqueta: 'Aumentar contraste',
    descripcion: 'Refuerza el contraste de textos, bordes y superficies.',
  },
  {
    clave: 'reducedMotion',
    etiqueta: 'Reducir animaciones',
    descripcion: 'Desactiva las transiciones de navegación de la app.',
  },
  {
    clave: 'respectSystemMotion',
    etiqueta: 'Respetar el sistema',
    descripcion: 'Reduce las animaciones cuando el dispositivo lo indique.',
  },
  {
    clave: 'improveReadability',
    etiqueta: 'Mejorar legibilidad',
    descripcion: 'Usa texto más legible y aumenta el espacio de línea.',
  },
  {
    clave: 'highlightInteractive',
    etiqueta: 'Destacar controles',
    descripcion: 'Marca con claridad los elementos interactivos.',
  },
  {
    clave: 'largeTouchTargets',
    etiqueta: 'Controles más grandes',
    descripcion: 'Aumenta el área táctil de botones y filas.',
  },
]

export function AccesibilidadScreen() {
  const paleta = usePaletaActual()
  const preferencias = useAppStore((state) => state.preferencias)
  const actualizarPreferencias = useAppStore(
    (state) => state.actualizarPreferencias,
  )
  const t = useTraduccion()

  function leerValor(clave: OpcionAccesibilidad): boolean {
    if (clave === 'highContrast') return preferencias.highContrast
    if (clave === 'reducedMotion') return preferencias.reducedMotion
    return preferencias.accessibilityOptions[
      clave as keyof typeof preferencias.accessibilityOptions
    ]
  }

  function actualizar(clave: OpcionAccesibilidad, valor: boolean) {
    if (clave === 'highContrast') {
      actualizarPreferencias({ highContrast: valor })
    } else if (clave === 'reducedMotion') {
      actualizarPreferencias({ reducedMotion: valor })
    } else {
      actualizarPreferencias({
        accessibilityOptions: {
          ...preferencias.accessibilityOptions,
          [clave]: valor,
        },
      })
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 16 }}
    >
      <View className="overflow-hidden rounded-2xl border border-slate-100 bg-surface">
        {OPCIONES.map(({ clave, etiqueta, descripcion }, indice) => (
          <View
            key={clave}
            className={`flex-row items-center gap-3 px-4 py-4 ${
              indice < OPCIONES.length - 1 ? 'border-b border-slate-100' : ''
            }`}
          >
            <View className="flex-1 gap-1">
              <Texto className="text-base font-medium text-text">
                {t(etiqueta)}
              </Texto>
              <Texto className="text-xs leading-5 text-textMuted">
                {t(descripcion)}
              </Texto>
            </View>
            <Switch
              value={leerValor(clave)}
              onValueChange={(valor) => actualizar(clave, valor)}
              trackColor={{ false: paleta.outline, true: colores.primary }}
              thumbColor="#FFFFFF"
              accessibilityLabel={t(etiqueta)}
              accessibilityHint={t(descripcion)}
            />
          </View>
        ))}
      </View>
      <Texto className="px-1 text-xs leading-5 text-textMuted">
        {t('Los controles mantienen un indicador de foco visible al navegar con teclado.')}
      </Texto>
    </ScrollView>
  )
}

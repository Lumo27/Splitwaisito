import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { Pressable, ScrollView, View } from 'react-native'
import { Boton, Opcion } from '@/components/Formulario'
import { Texto } from '@/components/Texto'
import { useTraduccion } from '@/i18n/translations'
import { useAppStore, type Preferencias } from '@/store/useAppStore'
import { colores } from '@/theme/colores'
import { usePaletaActual } from '@/theme/usePaletaActual'

const TEMAS: Preferencias['theme'][] = ['light', 'dark', 'system']
const FUENTES: Preferencias['fontFamily'][] = ['system', 'serif', 'monospace']
const TAMANOS: { valor: Preferencias['fontSize']; porcentaje: number }[] = [
  { valor: 'verySmall', porcentaje: 85 },
  { valor: 'small', porcentaje: 92 },
  { valor: 'normal', porcentaje: 100 },
  { valor: 'large', porcentaje: 112 },
  { valor: 'veryLarge', porcentaje: 125 },
]

const ETIQUETAS_TEMA: Record<Preferencias['theme'], string> = {
  light: 'appearance.light',
  dark: 'appearance.dark',
  system: 'appearance.system',
}

const ETIQUETAS_FUENTE: Record<Preferencias['fontFamily'], string> = {
  system: 'appearance.fontSystem',
  serif: 'appearance.fontSerif',
  monospace: 'appearance.fontMonospace',
}

const ETIQUETAS_TAMANO: Record<Preferencias['fontSize'], string> = {
  verySmall: 'appearance.verySmall',
  small: 'appearance.small',
  normal: 'appearance.normal',
  large: 'appearance.large',
  veryLarge: 'appearance.veryLarge',
}

export function AparienciaScreen() {
  const router = useRouter()
  const paleta = usePaletaActual()
  const preferencias = useAppStore((state) => state.preferencias)
  const actualizarPreferencias = useAppStore(
    (state) => state.actualizarPreferencias,
  )
  const t = useTraduccion()

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 16 }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('Volver')}
        onPress={() =>
          router.canGoBack()
            ? router.back()
            : router.replace('/configuracion')
        }
        className="min-h-12 flex-row items-center gap-2 self-start rounded-xl px-2"
      >
        <ArrowLeft color={paleta.primaryDark} size={20} />
        <Texto className="font-semibold text-primary-dark">{t('Volver')}</Texto>
      </Pressable>

      <View className="gap-3 rounded-2xl border border-slate-100 bg-surface p-4">
        <Texto className="text-base font-semibold text-text">
          {t('appearance.theme')}
        </Texto>
        <Texto className="text-sm leading-6 text-textMuted">
          {t('appearance.systemDescription')}
        </Texto>
        {TEMAS.map((tema) => (
          <Opcion
            key={tema}
            texto={t(ETIQUETAS_TEMA[tema])}
            elegida={preferencias.theme === tema}
            onPress={() => actualizarPreferencias({ theme: tema })}
          />
        ))}
      </View>

      <View className="gap-3 rounded-2xl border border-slate-100 bg-surface p-4">
        <Texto className="text-base font-semibold text-text">
          {t('appearance.font')}
        </Texto>
        {FUENTES.map((fuente) => (
          <Opcion
            key={fuente}
            texto={t(ETIQUETAS_FUENTE[fuente])}
            elegida={preferencias.fontFamily === fuente}
            onPress={() => actualizarPreferencias({ fontFamily: fuente })}
          />
        ))}
        <View className="rounded-xl bg-subtle p-3">
          <Texto className="text-base text-text">
            {t('appearance.preview')}
          </Texto>
        </View>
      </View>

      <View className="gap-3 rounded-2xl border border-slate-100 bg-surface p-4">
        <View className="flex-row items-center justify-between gap-2">
          <Texto className="flex-1 text-base font-semibold text-text">
            {t('appearance.fontSize')}
          </Texto>
          <Texto
            accessibilityLiveRegion="polite"
            className="font-semibold text-primary-dark"
          >
            {TAMANOS.find((opcion) => opcion.valor === preferencias.fontSize)
              ?.porcentaje ?? 100}
            %
          </Texto>
        </View>
        {TAMANOS.map(({ valor, porcentaje }) => (
          <Opcion
            key={valor}
            texto={`${t(ETIQUETAS_TAMANO[valor])} · ${porcentaje}%`}
            elegida={preferencias.fontSize === valor}
            onPress={() => actualizarPreferencias({ fontSize: valor })}
          />
        ))}
        <Boton
          texto={t('appearance.reset')}
          secundario
          onPress={() => actualizarPreferencias({ fontSize: 'normal' })}
        />
      </View>

      <View className="flex-row items-center gap-2 px-1">
        <View
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: colores.primary }}
        />
        <View
          className="h-5 w-5 rounded-full"
          style={{ backgroundColor: colores.secondary }}
        />
        <Texto className="text-xs text-textMuted">Junti</Texto>
      </View>
    </ScrollView>
  )
}

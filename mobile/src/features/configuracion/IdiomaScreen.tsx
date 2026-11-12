import { ScrollView, View } from 'react-native'
import { Opcion } from '@/components/Formulario'
import { Texto } from '@/components/Texto'
import { useTraduccion } from '@/i18n/translations'
import { useAppStore, type Preferencias } from '@/store/useAppStore'

const IDIOMAS: { valor: Preferencias['language']; clave: string }[] = [
  { valor: 'es', clave: 'language.es' },
  { valor: 'en', clave: 'language.en' },
  { valor: 'pt', clave: 'language.pt' },
]

export function IdiomaScreen() {
  const idioma = useAppStore((state) => state.preferencias.language)
  const actualizarPreferencias = useAppStore(
    (state) => state.actualizarPreferencias,
  )
  const t = useTraduccion()

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 12 }}
    >
      <View className="gap-3 rounded-2xl border border-slate-100 bg-surface p-4">
        {IDIOMAS.map(({ valor, clave }) => (
          <Opcion
            key={valor}
            texto={t(clave)}
            elegida={idioma === valor}
            onPress={() => actualizarPreferencias({ language: valor })}
          />
        ))}
      </View>
      <Texto className="px-1 text-xs leading-5 text-textMuted">
        {t('language.fallback')}
      </Texto>
    </ScrollView>
  )
}

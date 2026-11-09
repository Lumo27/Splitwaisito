import Constants from 'expo-constants'
import { router } from 'expo-router'
import { FileText } from 'lucide-react-native'
import { View } from 'react-native'
import { FilaConfig } from '@/components/Formulario'
import { colores } from '@/theme/colores'
import { Texto as Text } from '@/components/Texto'
import { useTraduccion } from '@/i18n/translations'

export function AcercaScreen() {
  const version = Constants.expoConfig?.version ?? 'No disponible'
  const t = useTraduccion()

  return (
    <View className="flex-1 gap-4 bg-background p-4">
      <View className="gap-2 rounded-2xl border border-slate-100 bg-surface p-4">
        <Text className="text-xl font-bold text-text">Junti</Text>
        <Text className="text-sm leading-6 text-textMuted">
          {t('about.description')}
        </Text>
        <Text className="text-sm text-textMuted">
          {t('about.version').replace('{version}', version)}
        </Text>
      </View>

      <View className="overflow-hidden rounded-2xl border border-slate-100 bg-surface">
        <FilaConfig
          icono={<FileText size={18} color={colores.textMuted} />}
          titulo={t('privacy.terms')}
          descripcion={t('privacy.termsDescription')}
          onPress={() => router.push('/terminos')}
        />
        <FilaConfig
          icono={<FileText size={18} color={colores.textMuted} />}
          titulo={t('about.privacy')}
          descripcion={t('about.privacyDescription')}
          onPress={() => router.push('/configuracion/privacidad')}
        />
      </View>
    </View>
  )
}

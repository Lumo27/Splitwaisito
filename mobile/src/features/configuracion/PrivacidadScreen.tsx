import { router } from 'expo-router'
import { ScrollView, View } from 'react-native'
import { FileText, UserRound } from 'lucide-react-native'
import { FilaConfig } from '@/components/Formulario'
import { colores } from '@/theme/colores'
import { Texto as Text } from '@/components/Texto'
import { useTraduccion } from '@/i18n/translations'

export function PrivacidadScreen() {
  const t = useTraduccion()

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 16 }}
    >
      <View className="gap-2 rounded-2xl border border-slate-100 bg-surface p-4">
        <Text className="text-base font-semibold text-text">
          {t('privacy.data')}
        </Text>
        <Text className="text-sm leading-6 text-textMuted">
          {t('privacy.dataDescription')}
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
          icono={<UserRound size={18} color={colores.primary} />}
          titulo={t('privacy.profile')}
          descripcion={t('privacy.profileDescription')}
          onPress={() => router.push('/perfil')}
        />
      </View>

      <View className="gap-2 rounded-2xl border border-slate-100 bg-surface p-4">
        <Text className="text-base font-semibold text-text">
          {t('privacy.controls')}
        </Text>
        <Text className="text-sm leading-6 text-textMuted">
          {t('privacy.controlsDescription')}
        </Text>
      </View>
    </ScrollView>
  )
}

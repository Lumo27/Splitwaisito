import Constants from 'expo-constants'
import { router } from 'expo-router'
import { FileText } from 'lucide-react-native'
import { View } from 'react-native'
import { FilaConfig } from '@/components/Formulario'
import { colores } from '@/theme/colores'
import { Texto as Text } from '@/components/Texto'
import { useTraduccion } from '@/i18n/textos'

export function AcercaScreen() {
  const version = Constants.expoConfig?.version ?? 'No disponible'
  const t = useTraduccion()

  return (
    <View className="flex-1 gap-4 bg-background p-4">
      <View className="gap-2 rounded-2xl border border-slate-100 bg-surface p-4">
        <Text className="text-xl font-bold text-text">Junti</Text>
        <Text className="text-sm leading-6 text-textMuted">
          {t('Aplicación para organizar gastos compartidos y consultar saldos.')}
        </Text>
        <Text className="text-sm text-textMuted">
          {t('Versión {version}', { version })}
        </Text>
      </View>

      <View className="overflow-hidden rounded-2xl border border-slate-100 bg-surface">
        <FilaConfig
          icono={<FileText size={18} color={colores.textMuted} />}
          titulo={t('Términos y condiciones')}
          descripcion={t('Revisá el documento y el tratamiento de datos')}
          onPress={() => router.push('/terminos')}
        />
        <FilaConfig
          icono={<FileText size={18} color={colores.textMuted} />}
          titulo={t('Información de privacidad')}
          descripcion={t('Datos y controles disponibles')}
          onPress={() => router.push('/configuracion/privacidad')}
        />
      </View>
    </View>
  )
}

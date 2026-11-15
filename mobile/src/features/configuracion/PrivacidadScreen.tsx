import { router } from 'expo-router'
import { ScrollView, View } from 'react-native'
import { FileText, UserRound } from 'lucide-react-native'
import { FilaConfig } from '@/components/Formulario'
import { colores } from '@/theme/colores'
import { Texto as Text } from '@/components/Texto'
import { useTraduccion } from '@/i18n/useTraduccion'

export function PrivacidadScreen() {
  const t = useTraduccion()

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 16 }}
    >
      <View className="gap-2 rounded-2xl border border-slate-100 bg-surface p-4">
        <Text className="text-base font-semibold text-text">
          {t('Información que guarda la app')}
        </Text>
        <Text className="text-sm leading-6 text-textMuted">
          {t('Junti guarda los datos del perfil y la información de grupos, movimientos y comprobantes necesarios para sus funciones. Las preferencias de configuración y moneda se guardan en este dispositivo; no se sincronizan entre dispositivos.')}
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
          icono={<UserRound size={18} color={colores.primary} />}
          titulo={t('Datos del perfil')}
          descripcion={t('El perfil se administra desde la pestaña Perfil')}
          onPress={() => router.push('/perfil')}
        />
      </View>

      <View className="gap-2 rounded-2xl border border-slate-100 bg-surface p-4">
        <Text className="text-base font-semibold text-text">
          {t('Controles disponibles')}
        </Text>
        <Text className="text-sm leading-6 text-textMuted">
          {t('Actualmente no hay controles para cambiar la visibilidad del perfil, exportar o borrar todos los datos, administrar sesiones remotas ni revocar la aceptación de los términos desde la app. No se muestran opciones que prometan esos controles.')}
        </Text>
      </View>
    </ScrollView>
  )
}

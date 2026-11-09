import { Tabs } from 'expo-router'
import { Receipt, Settings, User, UserPlus } from 'lucide-react-native'

import { colores } from '@/theme/colores'
import { useAppStore } from '@/store/useAppStore'
import { useTraduccion } from '@/i18n/translations'
import { useColorScheme } from 'nativewind'
import { FACTORES_TAMANO_TEXTO } from '@/theme/paleta'

// Mismas tabs y etiquetas que web/src/components/TabsLayout.tsx.
export default function TabsLayout() {
  const t = useTraduccion()
  const { colorScheme } = useColorScheme()
  const controlesGrandes = useAppStore(
    (state) => state.preferencias.accessibilityOptions.largeTouchTargets,
  )
  const fontSize = useAppStore((state) => state.preferencias.fontSize)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#8ED8B0' : colores.primaryDark,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#C0CBD7' : colores.textMuted,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1B2835' : colores.surface,
          borderTopColor: colorScheme === 'dark' ? '#45586B' : colores.primaryLight,
          minHeight: controlesGrandes ? 72 : undefined,
        },
        headerTitleStyle: {
          color: colorScheme === 'dark' ? '#F1F5F9' : colores.text,
          fontSize: 17 * FACTORES_TAMANO_TEXTO[fontSize],
        },
        tabBarLabelStyle: {
          fontSize: 12 * FACTORES_TAMANO_TEXTO[fontSize],
        },
        sceneStyle: {
          backgroundColor: colorScheme === 'dark' ? '#111A24' : colores.background,
        },
      }}
    >
      <Tabs.Screen
        name="grupos"
        options={{ title: t('nav.groups'), tabBarIcon: ({ color }) => <Receipt color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="actividad"
        options={{ title: t('nav.activity'), tabBarIcon: ({ color }) => <UserPlus color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: t('nav.profile'), tabBarIcon: ({ color }) => <User color={color} size={22} /> }}
      />
      <Tabs.Screen
        name="configuracion"
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color }) => <Settings color={color} size={22} />,
        }}
      />
    </Tabs>
  )
}

import '../global.css'

import { Stack, usePathname } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Appearance, Platform, View } from 'react-native'
import { useColorScheme, vars } from 'nativewind'

import {
  AuthBootstrap,
  useTerminosAcceptance,
} from '@/features/auth/AuthBootstrap'
import {
  crearPreferenciasPredeterminadas,
  useAppStore,
} from '@/store/useAppStore'
import { MODO_SEEDS } from '@/services/firebase'
import { HelpAssistant } from '@/features/ayuda/HelpAssistant'
import {
  obtenerPaleta,
  obtenerVariablesTema,
  temaOscuroPreferido,
  FACTORES_TAMANO_TEXTO,
  obtenerFuente,
} from '@/theme/paleta'
import { useTraduccion } from '@/i18n/translations'
import { useMovimientoReducidoSistema } from '@/hooks/useMovimientoReducido'
import {
  cargarPreferenciasUsuario,
  guardarPreferenciasUsuario,
} from '@/services/preferencias'

export { ErrorBoundary } from 'expo-router'

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignorar en entornos sin soporte nativo de splash (p. ej. Web)
})

export default function RootLayout() {
  return (
    <AuthBootstrap>
      <AppNavigator />
    </AuthBootstrap>
  )
}

function AppNavigator() {
  const usuario = useAppStore((state) => state.usuarioActual)
  const preferencias = useAppStore((state) => state.preferencias)
  const { estado } = useTerminosAcceptance()
  const pathname = usePathname()
  const { setColorScheme } = useColorScheme()
  const t = useTraduccion()
  const [sistemaOscuro, setSistemaOscuro] = useState(
    Appearance.getColorScheme() === 'dark',
  )
  const [usuarioConPreferenciasSincronizadas, setUsuarioConPreferenciasSincronizadas] =
    useState<string | null>(null)
  const usuarioSincronizado = useRef<string | null>(null)
  const movimientoReducidoSistema = useMovimientoReducidoSistema()
  const terminosAceptados = estado === 'aceptado'
  const oscuro = temaOscuroPreferido(preferencias.theme, sistemaOscuro)
  const reducirAnimaciones =
    preferencias.reducedMotion ||
    (preferencias.accessibilityOptions.respectSystemMotion &&
      movimientoReducidoSistema)
  const paleta = useMemo(
    () => obtenerPaleta(oscuro, preferencias.highContrast),
    [oscuro, preferencias.highContrast],
  )
  const variables = useMemo(() => obtenerVariablesTema(paleta), [paleta])

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSistemaOscuro(colorScheme === 'dark')
    })
    return () => subscription.remove()
  }, [])

  useEffect(() => {
    setColorScheme(oscuro ? 'dark' : 'light')
  }, [oscuro, setColorScheme])

  useEffect(() => {
    if (!usuario?.id) {
      usuarioSincronizado.current = null
      return
    }

    let vigente = true
    usuarioSincronizado.current = null
    if (MODO_SEEDS) {
      usuarioSincronizado.current = usuario.id
      return
    }

    useAppStore
      .getState()
      .actualizarPreferencias(crearPreferenciasPredeterminadas())
    void cargarPreferenciasUsuario(usuario.id)
      .then(async (remotas) => {
        if (!vigente) return
        const preferenciasCuenta = crearPreferenciasPredeterminadas(remotas ?? {})
        useAppStore
          .getState()
          .actualizarPreferencias(preferenciasCuenta)
        if (!remotas) {
          await guardarPreferenciasUsuario(usuario.id, preferenciasCuenta)
        }
        if (vigente) {
          usuarioSincronizado.current = usuario.id
          setUsuarioConPreferenciasSincronizadas(usuario.id)
        }
      })
      .catch((error: unknown) => {
        console.error('No se pudieron cargar las preferencias de la cuenta.', error)
      })

    return () => {
      vigente = false
    }
  }, [usuario?.id])

  useEffect(() => {
    if (
      !usuario?.id ||
      usuarioConPreferenciasSincronizadas !== usuario.id ||
      usuarioSincronizado.current !== usuario.id
    ) {
      return
    }

    void guardarPreferenciasUsuario(usuario.id, preferencias).catch(
      (error: unknown) => {
        console.error('No se pudieron guardar las preferencias de la cuenta.', error)
      },
    )
  }, [usuario?.id, usuarioConPreferenciasSincronizadas, preferencias])

  return (
    <View className="flex-1 bg-background" style={vars(variables)}>
      <StatusBar style={oscuro ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerTintColor: paleta.primaryDark,
          headerStyle: { backgroundColor: paleta.surface },
          headerTitleStyle: {
            color: paleta.text,
            fontFamily: obtenerFuente(
              preferencias.fontFamily,
              Platform.OS === 'web' ||
                Platform.OS === 'ios' ||
                Platform.OS === 'android'
                ? Platform.OS
                : 'other',
            ),
            fontSize: 17 * FACTORES_TAMANO_TEXTO[preferencias.fontSize],
          },
          contentStyle: { backgroundColor: paleta.background },
          animation: reducirAnimaciones ? 'none' : 'default',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Protected guard={!usuario}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={Boolean(usuario) && !terminosAceptados}>
          <Stack.Screen name="terminos" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={Boolean(usuario) && terminosAceptados}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="grupos/[id]/index" options={{ title: t('nav.groups') }} />
          <Stack.Screen
            name="grupos/nuevo"
            options={{ title: t('groups.create'), presentation: 'modal' }}
          />
          <Stack.Screen
            name="grupos/[id]/cargar-gasto"
            options={{ title: t('expenses.create'), presentation: 'modal' }}
          />
          <Stack.Screen
            name="grupos/[id]/gasto/[gastoId]"
            options={{ title: t('expenses.details') }}
          />
          <Stack.Screen
            name="grupos/[id]/saldar"
            options={{ title: t('debts.settle'), presentation: 'modal' }}
          />
          <Stack.Screen
            name="configuracion/accesibilidad"
            options={{ title: t('accessibility.title') }}
          />
          <Stack.Screen
            name="configuracion/apariencia"
            options={{
              title: t('settings.appearance'),
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="configuracion/idioma"
            options={{ title: t('settings.language') }}
          />
          <Stack.Screen
            name="configuracion/notificaciones"
            options={{ title: t('settings.notifications') }}
          />
          <Stack.Screen
            name="configuracion/moneda"
            options={{ title: t('settings.currency') }}
          />
          <Stack.Screen
            name="configuracion/privacidad"
            options={{ title: t('settings.privacy') }}
          />
          <Stack.Screen
            name="configuracion/seguridad"
            options={{ title: t('settings.security') }}
          />
          <Stack.Screen
            name="configuracion/acerca"
            options={{ title: t('settings.about') }}
          />
        </Stack.Protected>
      </Stack>
      {usuario && terminosAceptados && (
        <HelpAssistant key={pathname} pathname={pathname} />
      )}
    </View>
  )
}

import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import {
  Bell,
  CircleUserRound,
  DollarSign,
  Info,
  Languages,
  Palette,
  Shield,
  Accessibility,
} from 'lucide-react-native'
import { Boton, FilaConfig, Mensaje } from '@/components/Formulario'
import { MODO_SEEDS } from '@/services/firebase'
import { getUsuarioPerfil } from '@/services/firestore'
import { obtenerAmigosAceptados } from '@/services/amistades'
import { restablecerSeeds } from '@/services/seedBackend'
import { useAppStore } from '@/store/useAppStore'
import { colores } from '@/theme/colores'
import { Texto as Text } from '@/components/Texto'
import { useTraduccion } from '@/i18n/translations'
import { confirmar } from '@/utils/alerta'

function SeccionTitulo({ texto }: { texto: string }) {
  return (
    <Text className="mb-1 mt-4 px-1 text-xs font-semibold uppercase tracking-widest text-textMuted">
      {texto}
    </Text>
  )
}

function TarjetaSeccion({ children }: { children: React.ReactNode }) {
  return (
    <View className="overflow-hidden rounded-2xl border border-slate-100 bg-surface">
      {children}
    </View>
  )
}

export function ConfiguracionScreen() {
  const usuario = useAppStore((state) => state.usuarioActual)
  const idioma = useAppStore((state) => state.preferencias.language)
  const [restableciendo, setRestableciendo] = useState(false)
  const [errorRestablecer, setErrorRestablecer] = useState('')
  const [mensajeRestablecer, setMensajeRestablecer] = useState('')
  const mutacion = useRef(false)
  const t = useTraduccion()

  async function reiniciarDemo() {
    if (mutacion.current || !MODO_SEEDS || !usuario) return
    mutacion.current = true
    setRestableciendo(true)
    setErrorRestablecer('')
    setMensajeRestablecer('')
    try {
      await restablecerSeeds()
      const perfil = await getUsuarioPerfil(usuario.id)
      if (!perfil) throw new Error('No se pudo recuperar el perfil demo.')
      useAppStore.getState().iniciarSesion(
        perfil.nombre,
        perfil.email,
        perfil.alias,
        perfil.id,
        perfil.fotoUrl,
        perfil.descripcion,
        perfil.moneda,
      )
      useAppStore
        .getState()
        .reemplazarAmigos(await obtenerAmigosAceptados(usuario.id))
      setMensajeRestablecer(t('demo.resetSuccess'))
    } catch (fallo) {
      console.error('No se pudieron restablecer los datos de ejemplo.', fallo)
      setErrorRestablecer(t('demo.resetError'))
    } finally {
      mutacion.current = false
      setRestableciendo(false)
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
    >
      <Mensaje texto={mensajeRestablecer} />
      <Mensaje texto={errorRestablecer} error />

      <SeccionTitulo texto={t('settings.account')} />
      <TarjetaSeccion>
        <FilaConfig
          icono={<CircleUserRound size={18} color={colores.primary} />}
          titulo={usuario?.nombre ?? t('settings.noSession')}
          descripcion={usuario?.email ?? ''}
          onPress={() => router.push('/configuracion/seguridad')}
        />
      </TarjetaSeccion>

      <SeccionTitulo texto={t('settings.preferences')} />
      <TarjetaSeccion>
        <FilaConfig
          icono={<Palette size={18} color={colores.primary} />}
          titulo={t('settings.appearance')}
          descripcion={t('settings.appearanceDescription')}
          onPress={() => router.push('/configuracion/apariencia')}
        />
        <FilaConfig
          icono={<Languages size={18} color={colores.primary} />}
          titulo={t('settings.language')}
          descripcion={t(`language.${idioma}`)}
          onPress={() => router.push('/configuracion/idioma')}
        />
        <FilaConfig
          icono={<Bell size={18} color={colores.primary} />}
          titulo={t('settings.notifications')}
          descripcion={t('settings.notificationsDescription')}
          onPress={() => router.push('/configuracion/notificaciones')}
        />
        <FilaConfig
          icono={<DollarSign size={18} color={colores.primary} />}
          titulo={t('settings.currency')}
          descripcion={t('settings.currencyDescription')}
          onPress={() => router.push('/configuracion/moneda')}
        />
      </TarjetaSeccion>

      <SeccionTitulo texto={t('settings.privacySecurity')} />
      <TarjetaSeccion>
        <FilaConfig
          icono={<Shield size={18} color={colores.primary} />}
          titulo={t('settings.privacy')}
          descripcion={t('settings.privacyDescription')}
          onPress={() => router.push('/configuracion/privacidad')}
        />
        <FilaConfig
          icono={<CircleUserRound size={18} color={colores.primary} />}
          titulo={t('settings.security')}
          descripcion={t('settings.securityDescription')}
          onPress={() => router.push('/configuracion/seguridad')}
        />
        <FilaConfig
          icono={<Info size={18} color={colores.textMuted} />}
          titulo={t('settings.about')}
          descripcion={t('settings.aboutDescription')}
          onPress={() => router.push('/configuracion/acerca')}
        />
        <FilaConfig
          icono={<Accessibility size={18} color={colores.primary} />}
          titulo={t('accessibility.title')}
          descripcion={t('accessibility.highlightDescription')}
          onPress={() => router.push('/configuracion/accesibilidad')}
        />
      </TarjetaSeccion>

      {MODO_SEEDS && (
        <>
          <SeccionTitulo texto={t('demo.section')} />
          <View className="gap-3 rounded-2xl border border-slate-100 bg-surface p-4">
            <Text className="text-sm leading-5 text-textMuted">
              {t('settings.demo')}
            </Text>
            <Boton
              texto={t('demo.resetButton')}
              peligro
              disabled={restableciendo}
              cargando={restableciendo}
              onPress={() =>
                confirmar({
                  titulo: t('demo.resetTitle'),
                  mensaje: t('demo.resetPrompt'),
                  textoConfirmar: t('demo.resetConfirm'),
                  textoCancelar: t('security.cancel'),
                  destructivo: true,
                  alConfirmar: () => {
                    void reiniciarDemo()
                  },
                })
              }
            />
          </View>
        </>
      )}
    </ScrollView>
  )
}

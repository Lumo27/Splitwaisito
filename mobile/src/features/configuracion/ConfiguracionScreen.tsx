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
  ShieldCheck,
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
import { useTraduccion } from '@/i18n/useTraduccion'
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
      setMensajeRestablecer(t('Datos de ejemplo restablecidos.'))
    } catch (fallo) {
      console.error('No se pudieron restablecer los datos de ejemplo.', fallo)
      setErrorRestablecer(t('No pudimos restablecer los datos de ejemplo.'))
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

      <SeccionTitulo texto={t('Cuenta')} />
      <TarjetaSeccion>
        <FilaConfig
          icono={<CircleUserRound size={18} color={colores.primary} />}
          titulo={usuario?.nombre ?? t('Sin sesión activa')}
          descripcion={usuario?.email ?? ''}
          onPress={() => router.push('/perfil')}
        />
      </TarjetaSeccion>

      <SeccionTitulo texto={t('Preferencias')} />
      <TarjetaSeccion>
        <FilaConfig
          icono={<Palette size={18} color={colores.primary} />}
          titulo={t('Apariencia')}
          descripcion={t('Tema, fuente y tamaño de texto')}
          onPress={() => router.push('/configuracion/apariencia')}
        />
        <FilaConfig
          icono={<Languages size={18} color={colores.primary} />}
          titulo={t('Idioma')}
          descripcion={t(`language.${idioma}`)}
          onPress={() => router.push('/configuracion/idioma')}
        />
        <FilaConfig
          icono={<Bell size={18} color={colores.primary} />}
          titulo={t('Notificaciones')}
          descripcion={t('Administrá tus preferencias')}
          onPress={() => router.push('/configuracion/notificaciones')}
        />
        <FilaConfig
          icono={<DollarSign size={18} color={colores.primary} />}
          titulo={t('Moneda preferida')}
          descripcion={t('Sugerencia al crear nuevos grupos')}
          onPress={() => router.push('/configuracion/moneda')}
        />
      </TarjetaSeccion>

      <SeccionTitulo texto={t('Información y protección')} />
      <TarjetaSeccion>
        <FilaConfig
          icono={<Shield size={18} color={colores.primary} />}
          titulo={t('Privacidad')}
          descripcion={t('Datos, visibilidad y consentimientos')}
          onPress={() => router.push('/configuracion/privacidad')}
        />
        <FilaConfig
          icono={<ShieldCheck size={18} color={colores.primary} />}
          titulo={t('Seguridad')}
          descripcion={t('Sesión, contraseña y acceso a la cuenta')}
          onPress={() => router.push('/configuracion/seguridad')}
        />
        <FilaConfig
          icono={<Info size={18} color={colores.textMuted} />}
          titulo={t('Acerca de Junti')}
          descripcion={t('Versión, documentos e información')}
          onPress={() => router.push('/configuracion/acerca')}
        />
        <FilaConfig
          icono={<Accessibility size={18} color={colores.primary} />}
          titulo={t('Accesibilidad')}
          descripcion={t('Contraste, animaciones y legibilidad')}
          onPress={() => router.push('/configuracion/accesibilidad')}
        />
      </TarjetaSeccion>

      {MODO_SEEDS && (
        <>
          <SeccionTitulo texto={t('Modo demo')} />
          <View className="gap-3 rounded-2xl border border-slate-100 bg-surface p-4">
            <Text className="text-sm leading-5 text-textMuted">
              {t('Estás usando el modo demo. Tus preferencias se guardan en este dispositivo.')}
            </Text>
            <Boton
              texto={t('Restablecer datos de ejemplo')}
              peligro
              disabled={restableciendo}
              cargando={restableciendo}
              onPress={() =>
                confirmar({
                  titulo: t('Restablecer datos'),
                  mensaje: t('Se borrarán los cambios realizados en el modo demo de este dispositivo. ¿Continuar?'),
                  textoConfirmar: t('Restablecer'),
                  textoCancelar: t('Cancelar'),
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

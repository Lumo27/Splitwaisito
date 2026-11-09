import { useRef, useState } from 'react'
import { router } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'
import {
  Bell,
  CircleUserRound,
  DollarSign,
  FileText,
  Info,
  LogOut,
  RefreshCw,
} from 'lucide-react-native'
import { FilaConfig, Mensaje } from '@/components/Formulario'
import { signOutUser } from '@/services/auth'
import { MODO_SEEDS } from '@/services/firebase'
import { getUsuarioPerfil } from '@/services/firestore'
import { restablecerSeeds } from '@/services/seedBackend'
import { useAppStore } from '@/store/useAppStore'
import { confirmar } from '@/utils/alerta'
import { colores } from '@/theme/colores'

function SeccionTitulo({ texto }: { texto: string }) {
  return (
    <Text className="mb-1 mt-4 px-1 text-xs font-semibold uppercase tracking-widest text-textMuted">
      {texto}
    </Text>
  )
}

function TarjetaSeccion({ children }: { children: React.ReactNode }) {
  return (
    <View className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      {children}
    </View>
  )
}

export function ConfiguracionScreen() {
  const usuario = useAppStore((state) => state.usuarioActual)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const mutacion = useRef(false)

  async function salir() {
    if (mutacion.current) return
    mutacion.current = true
    setOcupado(true)
    setError('')
    try {
      await signOutUser()
      useAppStore.getState().cerrarSesion()
      router.replace('/login')
    } catch {
      setError('No pudimos cerrar la sesión. Volvé a intentar.')
    } finally {
      mutacion.current = false
      setOcupado(false)
    }
  }

  async function reiniciar() {
    if (mutacion.current || !MODO_SEEDS || !usuario) return
    mutacion.current = true
    setOcupado(true)
    setError('')
    setMensaje('')
    try {
      await restablecerSeeds()
      const perfil = await getUsuarioPerfil(usuario.id)
      if (perfil) {
        useAppStore.getState().iniciarSesion(
          perfil.nombre,
          perfil.email,
          perfil.alias,
          perfil.id,
          perfil.fotoUrl,
          perfil.descripcion,
          perfil.moneda,
        )
      }
      setMensaje('Datos de ejemplo restablecidos.')
    } catch {
      setError('No pudimos restablecer los datos de ejemplo.')
    } finally {
      mutacion.current = false
      setOcupado(false)
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
    >
      <Mensaje texto={mensaje} />
      <Mensaje texto={error} error />

      {/* ── Cuenta ── */}
      <SeccionTitulo texto="Cuenta" />
      <TarjetaSeccion>
        <FilaConfig
          icono={<CircleUserRound size={18} color={colores.primary} />}
          titulo={usuario?.nombre ?? 'Sin sesión activa'}
          descripcion={usuario?.email ?? ''}
          derecha={<View />}
        />
        <FilaConfig
          icono={<LogOut size={18} color="#E11D48" />}
          titulo="Cerrar sesión"
          descripcion="Salir de tu cuenta en este dispositivo"
          deshabilitado={ocupado}
          onPress={() =>
            confirmar({
              titulo: 'Cerrar sesión',
              mensaje: '¿Querés salir de tu cuenta?',
              textoConfirmar: 'Salir',
              textoCancelar: 'Cancelar',
              destructivo: false,
              alConfirmar: () => {
                void salir()
              },
            })
          }
        />
      </TarjetaSeccion>

      {/* ── Preferencias ── */}
      <SeccionTitulo texto="Preferencias" />
      <TarjetaSeccion>
        <FilaConfig
          icono={<Bell size={18} color={colores.primary} />}
          titulo="Notificaciones"
          descripcion="Recordatorios y actividad del grupo"
          onPress={() => router.push('/configuracion/notificaciones')}
        />
        <FilaConfig
          icono={<DollarSign size={18} color={colores.primary} />}
          titulo="Moneda preferida"
          descripcion="Sugerencia al crear nuevos grupos"
          onPress={() => router.push('/configuracion/moneda')}
        />
      </TarjetaSeccion>

      {/* ── Información ── */}
      <SeccionTitulo texto="Información" />
      <TarjetaSeccion>
        <FilaConfig
          icono={<FileText size={18} color={colores.textMuted} />}
          titulo="Términos y condiciones"
          descripcion="Leé los términos de uso de Junti"
          onPress={() => router.push('/terminos')}
        />
        <FilaConfig
          icono={<Info size={18} color={colores.textMuted} />}
          titulo="Acerca de Junti"
          descripcion="Versión 1.0.0"
          derecha={<View />}
        />
      </TarjetaSeccion>

      {/* ── Modo demo ── */}
      {MODO_SEEDS && (
        <>
          <SeccionTitulo texto="Modo demo" />
          <TarjetaSeccion>
            <FilaConfig
              icono={<RefreshCw size={18} color="#D97706" />}
              titulo="Restablecer datos de ejemplo"
              descripcion="Vuelve al estado inicial del demo"
              deshabilitado={ocupado}
              onPress={() =>
                confirmar({
                  titulo: 'Restablecer datos',
                  mensaje:
                    'Se borrarán los cambios realizados en el modo demo de este dispositivo. ¿Continuar?',
                  textoConfirmar: 'Restablecer',
                  textoCancelar: 'Cancelar',
                  destructivo: true,
                  alConfirmar: () => {
                    void reiniciar()
                  },
                })
              }
            />
          </TarjetaSeccion>
        </>
      )}
    </ScrollView>
  )
}

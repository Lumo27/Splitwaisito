import { useRef, useState } from 'react'
import { router } from 'expo-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Mail, ShieldCheck } from 'lucide-react-native'
import { ScrollView, View } from 'react-native'
import { Boton, FilaConfig, Mensaje } from '@/components/Formulario'
import { auth, MODO_SEEDS } from '@/services/firebase'
import { signOutUser } from '@/services/auth'
import { useAppStore } from '@/store/useAppStore'
import { colores } from '@/theme/colores'
import { confirmar } from '@/utils/alerta'
import { Texto as Text } from '@/components/Texto'
import { useTraduccion } from '@/i18n/useTraduccion'

export function SeguridadScreen() {
  const usuario = useAppStore((state) => state.usuarioActual)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const mutacion = useRef(false)
  const t = useTraduccion()
  const email = auth?.currentUser?.email ?? usuario?.email ?? ''
  const puedeRestablecer = Boolean(
    !MODO_SEEDS &&
      auth?.currentUser?.providerData.some(
        (proveedor) => proveedor.providerId === 'password',
      ),
  )

  async function restablecerContrasena() {
    if (!auth || !email || !puedeRestablecer || mutacion.current) return
    mutacion.current = true
    setOcupado(true)
    setError('')
    setMensaje('')
    try {
      await sendPasswordResetEmail(auth, email)
      setMensaje(
        t('Enviamos un enlace para restablecer la contraseña a {email}.', {
          email,
        }),
      )
    } catch {
      setError(t('No pudimos enviar el enlace. Revisá tu conexión e intentá otra vez.'))
    } finally {
      mutacion.current = false
      setOcupado(false)
    }
  }

  async function cerrarSesion() {
    if (mutacion.current) return
    mutacion.current = true
    setOcupado(true)
    setError('')
    try {
      await signOutUser()
      useAppStore.getState().cerrarSesion()
      router.replace('/login')
    } catch {
      setError(t('No pudimos cerrar la sesión. Volvé a intentar.'))
    } finally {
      mutacion.current = false
      setOcupado(false)
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 16 }}
    >
      <Mensaje texto={mensaje} />
      <Mensaje texto={error} error />

      <View className="overflow-hidden rounded-2xl border border-slate-100 bg-surface">
        <FilaConfig
          icono={<ShieldCheck size={18} color={colores.primary} />}
          titulo={t(MODO_SEEDS ? 'Sesión de demostración' : 'Sesión actual')}
          descripcion={email || t('Sin correo disponible')}
          derecha={<View />}
        />
        <FilaConfig
          icono={<Mail size={18} color={colores.primary} />}
          titulo={t('Restablecer contraseña')}
          descripcion={
            puedeRestablecer
              ? t('Enviaremos un enlace a tu correo')
              : t('Disponible para cuentas con e-mail y contraseña')
          }
          onPress={() => {
            void restablecerContrasena()
          }}
          deshabilitado={!puedeRestablecer || ocupado}
        />
      </View>

      <View className="gap-2 rounded-2xl border border-slate-100 bg-surface p-4">
        <Text className="text-base font-semibold text-text">
          {t('Sesiones y métodos de acceso')}
        </Text>
        <Text className="text-sm leading-6 text-textMuted">
          {t('La app muestra y cierra la sesión de este dispositivo. La administración de sesiones remotas no está disponible. Si ingresaste con Google, la contraseña se administra desde tu cuenta de Google.')}
        </Text>
      </View>

      <Boton
        texto={t('Cerrar sesión')}
        peligro
        disabled={ocupado}
        onPress={() =>
          confirmar({
            titulo: t('Cerrar sesión'),
            mensaje: t('¿Querés salir de tu cuenta en este dispositivo?'),
            textoConfirmar: t('Salir'),
            textoCancelar: t('Cancelar'),
            destructivo: false,
            alConfirmar: () => {
              void cerrarSesion()
            },
          })
        }
      />
    </ScrollView>
  )
}

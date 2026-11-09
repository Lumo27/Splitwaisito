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
import { useTraduccion } from '@/i18n/translations'

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
      setMensaje(t('security.resetSent').replace('{email}', email))
    } catch {
      setError(t('security.resetError'))
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
      setError(t('security.logoutError'))
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
          titulo={t(MODO_SEEDS ? 'security.demo' : 'security.current')}
          descripcion={email || t('security.noEmail')}
          derecha={<View />}
        />
        <FilaConfig
          icono={<Mail size={18} color={colores.primary} />}
          titulo={t('security.password')}
          descripcion={
            puedeRestablecer
              ? t('security.passwordAvailable')
              : t('security.passwordUnavailable')
          }
          onPress={() => {
            void restablecerContrasena()
          }}
          deshabilitado={!puedeRestablecer || ocupado}
        />
      </View>

      <View className="gap-2 rounded-2xl border border-slate-100 bg-surface p-4">
        <Text className="text-base font-semibold text-text">
          {t('security.methods')}
        </Text>
        <Text className="text-sm leading-6 text-textMuted">
          {t('security.methodsDescription')}
        </Text>
      </View>

      <Boton
        texto={t('security.logout')}
        peligro
        disabled={ocupado}
        onPress={() =>
          confirmar({
            titulo: t('security.logoutTitle'),
            mensaje: t('security.logoutConfirm'),
            textoConfirmar: t('security.confirm'),
            textoCancelar: t('security.cancel'),
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

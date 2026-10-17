import { useEffect, useRef, useState } from 'react'
import { Image, Pressable, Text, View } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import {
  Boton,
  Campo,
  Mensaje,
  Pantalla,
  Tarjeta,
  Titulo,
} from '@/components/Formulario'
import {
  signInDemo,
  signInWithEmail,
  signInWithGoogleIdToken,
  signUpWithEmail,
} from '@/services/auth'
import { isFirebaseAvailable, MODO_SEEDS } from '@/services/firebase'

WebBrowser.maybeCompleteAuthSession()

export function LoginScreen() {
  const [esRegistro, setEsRegistro] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const operacion = useRef(false)

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId,
    webClientId: webClientId,
    androidClientId: androidClientId,
  })

  useEffect(() => {
    let vigente = true

    if (response?.type === 'success') {
      const idToken =
        response.params?.id_token || response.authentication?.idToken
      if (idToken) {
        void (async () => {
          await Promise.resolve()
          if (!vigente) return

          setOcupado(true)
          setError('')
          try {
            await signInWithGoogleIdToken(idToken)
          } catch (fallo) {
            if (!vigente) return
            const mensaje =
              fallo && typeof fallo === 'object' && 'message' in fallo
                ? String(fallo.message)
                : 'No pudimos autenticarte con Google.'
            setError(mensaje)
          } finally {
            if (vigente) {
              setOcupado(false)
            }
          }
        })()
      }
    } else if (response?.type === 'error') {
      void Promise.resolve().then(() => {
        if (vigente) {
          setError('No se pudo conectar con Google. Intentá nuevamente.')
        }
      })
    }

    return () => {
      vigente = false
    }
  }, [response])

  async function entrar() {
    if (operacion.current) return
    if (
      !MODO_SEEDS &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !clave)
    ) {
      setError('Ingresá tu e-mail y contraseña.')
      return
    }
    if (esRegistro && clave.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    operacion.current = true
    setOcupado(true)
    setError('')
    try {
      if (MODO_SEEDS) {
        signInDemo()
      } else if (esRegistro) {
        await signUpWithEmail(email.trim(), clave, nombre.trim())
      } else {
        await signInWithEmail(email.trim(), clave)
      }
    } catch (fallo) {
      const codigo =
        fallo && typeof fallo === 'object' && 'code' in fallo
          ? String(fallo.code)
          : ''
      setError(
        codigo === 'auth/network-request-failed'
          ? 'No pudimos conectarnos. Revisá tu conexión a internet.'
          : codigo === 'auth/email-already-in-use'
            ? 'Ese e-mail ya está registrado. Probá iniciando sesión.'
            : codigo === 'auth/invalid-credential' ||
                codigo === 'auth/user-not-found' ||
                codigo === 'auth/wrong-password'
              ? 'Datos incorrectos. Revisá tu e-mail y contraseña o registrate.'
              : codigo === 'auth/weak-password'
                ? 'La contraseña es muy débil. Usá al menos 6 caracteres.'
                : codigo === 'auth/operation-not-allowed'
                  ? 'El método de acceso todavía no está habilitado en Firebase.'
                  : 'No pudimos ingresar. Revisá tus datos e intentá de nuevo.',
      )
    } finally {
      operacion.current = false
      setOcupado(false)
    }
  }

  return (
    <Pantalla>
      <View className="items-center gap-4 py-8">
        <Image
          source={require('../../../assets/images/icon.png')}
          style={{ width: 84, height: 84, borderRadius: 20 }}
          accessibilityLabel="Logotipo de Splitwaisito"
        />
        <Titulo>Splitwaisito</Titulo>
        <Text className="text-center text-base leading-6 text-text-muted">
          Compartí los planes, organizá los gastos.
        </Text>
      </View>
      <Tarjeta>
        <Text
          accessibilityRole="header"
          className="text-xl font-bold text-text"
        >
          {MODO_SEEDS
            ? 'Probá la app'
            : esRegistro
              ? 'Crear cuenta'
              : 'Iniciar sesión'}
        </Text>
        {MODO_SEEDS ? (
          <>
            <Text className="text-sm leading-6 text-text-muted">
              Explorá grupos, gastos y deudas con datos de ejemplo. Tus cambios
              se guardan en este dispositivo.
            </Text>
            <Boton
              texto="Entrar con datos de ejemplo"
              cargando={ocupado}
              onPress={() => {
                void entrar()
              }}
            />
          </>
        ) : (
          <>
            <Pressable
              accessibilityRole="button"
              disabled={ocupado || !request}
              onPress={() => {
                setError('')
                void promptAsync()
              }}
              className="flex-row items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm active:bg-slate-50"
            >
              <View className="h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                <Text className="text-sm font-extrabold text-[#4285F4]">G</Text>
              </View>
              <Text className="text-base font-semibold text-slate-700">
                Continuar con Google
              </Text>
            </Pressable>

            <View className="my-1 flex-row items-center gap-3">
              <View className="h-px flex-1 bg-slate-200" />
              <Text className="text-xs font-medium uppercase text-slate-400">
                o con correo y contraseña
              </Text>
              <View className="h-px flex-1 bg-slate-200" />
            </View>

            {esRegistro && (
              <Campo
                label="Tu nombre"
                placeholder="Ej: Germán Morales"
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
                editable={!ocupado}
              />
            )}
            <Campo
              label="E-mail"
              placeholder="tu@correo.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
              editable={!ocupado}
            />
            <Campo
              label="Contraseña"
              placeholder={esRegistro ? 'Mínimo 6 caracteres' : '••••••••'}
              value={clave}
              onChangeText={setClave}
              secureTextEntry
              autoComplete={esRegistro ? 'new-password' : 'current-password'}
              editable={!ocupado}
            />
            <Boton
              texto={esRegistro ? 'Crear mi cuenta' : 'Iniciar sesión'}
              cargando={ocupado}
              disabled={!isFirebaseAvailable()}
              onPress={() => {
                void entrar()
              }}
            />

            <Pressable
              disabled={ocupado}
              onPress={() => {
                setError('')
                setEsRegistro((prev) => !prev)
              }}
              className="items-center py-2"
            >
              <Text className="text-sm font-semibold text-primary">
                {esRegistro
                  ? '¿Ya tenés cuenta? Iniciá sesión'
                  : '¿No tenés cuenta todavía? Registrate gratis'}
              </Text>
            </Pressable>

            {!isFirebaseAvailable() && (
              <Mensaje texto="El acceso a cuentas todavía no está configurado. Contactá al equipo para habilitarlo." />
            )}
          </>
        )}
        <Mensaje texto={error} error />
      </Tarjeta>
    </Pantalla>
  )
}

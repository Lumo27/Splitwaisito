import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constants, { ExecutionEnvironment } from 'expo-constants'
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react-native'
import Svg, { Circle, Path } from 'react-native-svg'

import {
  signInDemo,
  signInWithEmail,
  signInWithGoogleIdToken,
  signUpWithEmail,
  sendPasswordReset,
} from '@/services/auth'
import { isFirebaseAvailable, MODO_SEEDS } from '@/services/firebase'
import { colores } from '@/theme/colores'
import { ContenidoTerminos } from '@/features/terminos/ContenidoTerminos'

let GoogleSigninModule: any = null
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  GoogleSigninModule = require('@react-native-google-signin/google-signin').GoogleSignin
} catch {
  GoogleSigninModule = null
}

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CANTIDAD_ANIMACIONES = 9
const USAR_DRIVER_NATIVO = Platform.OS !== 'web'

export function LoginScreen() {
  const [esRegistro, setEsRegistro] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [mostrarClave, setMostrarClave] = useState(false)
  const [error, setError] = useState('')
  const [aviso, setAviso] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const [recuperandoClave, setRecuperandoClave] = useState(false)
  const [mostrarTerminos, setMostrarTerminos] = useState(false)
  const [transicionando, setTransicionando] = useState(false)
  const operacion = useRef(false)
  const cambiandoModo = useRef(false)
  const emailRef = useRef<TextInput>(null)
  const claveRef = useRef<TextInput>(null)
  const [entradaCabecera] = useState(() => new Animated.Value(0))
  const [entradaFormulario] = useState(() => new Animated.Value(0))
  const [desplazamientoFormulario] = useState(() => new Animated.Value(12))
  const [entradas] = useState(() =>
    Array.from({ length: CANTIDAD_ANIMACIONES }, () => new Animated.Value(0)),
  )
  const [escalaBoton] = useState(() => new Animated.Value(1))

  const esExpoGo =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
    (Constants as unknown as { appOwnership?: string }).appOwnership === 'expo'
  const mostrarGoogle =
    Platform.OS !== 'web' && !esExpoGo && Boolean(GoogleSigninModule)

  useEffect(() => {
    if (Platform.OS !== 'web' && !esExpoGo && GoogleSigninModule) {
      try {
        GoogleSigninModule.configure({
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        })
      } catch {
        // El acceso por correo sigue disponible si Google no puede inicializarse.
      }
    }

    Animated.parallel([
      Animated.timing(entradaCabecera, {
        toValue: 1,
        duration: 520,
        useNativeDriver: USAR_DRIVER_NATIVO,
      }),
      Animated.parallel([
        Animated.timing(entradaFormulario, {
          toValue: 1,
          duration: 380,
          useNativeDriver: USAR_DRIVER_NATIVO,
        }),
        Animated.timing(desplazamientoFormulario, {
          toValue: 0,
          duration: 420,
          useNativeDriver: USAR_DRIVER_NATIVO,
        }),
      ]),
      Animated.stagger(
        65,
        entradas.map((entrada) =>
          Animated.timing(entrada, {
            toValue: 1,
            duration: 280,
            useNativeDriver: USAR_DRIVER_NATIVO,
          }),
        ),
      ),
    ]).start()
  }, [
    desplazamientoFormulario,
    entradaCabecera,
    entradaFormulario,
    entradas,
    esExpoGo,
  ])

  function animarEntradas() {
    entradas.forEach((entrada) => entrada.setValue(0))
    return Animated.stagger(
      55,
      entradas.map((entrada) =>
        Animated.timing(entrada, {
          toValue: 1,
          duration: 240,
          useNativeDriver: USAR_DRIVER_NATIVO,
        }),
      ),
    )
  }

  function cambiarModo() {
    if (ocupado || cambiandoModo.current) return
    cambiandoModo.current = true
    setTransicionando(true)
    Animated.timing(entradaFormulario, {
      toValue: 0,
      duration: 120,
      useNativeDriver: USAR_DRIVER_NATIVO,
    }).start(({ finished }) => {
      if (!finished) {
        cambiandoModo.current = false
        setTransicionando(false)
        return
      }
      setEsRegistro((actual) => !actual)
      setError('')
      setAviso('')
      setMostrarClave(false)
      desplazamientoFormulario.setValue(8)
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(entradaFormulario, {
            toValue: 1,
            duration: 240,
            useNativeDriver: USAR_DRIVER_NATIVO,
          }),
          Animated.timing(desplazamientoFormulario, {
            toValue: 0,
            duration: 260,
            useNativeDriver: USAR_DRIVER_NATIVO,
          }),
        ]).start()
        const entradaDeCampos = animarEntradas()
        entradaDeCampos.start(({ finished }) => {
          if (finished) {
            cambiandoModo.current = false
            setTransicionando(false)
          }
        })
      })
    })
  }

  function estiloEntrada(indice: number) {
    return {
      opacity: entradas[indice],
      transform: [
        {
          translateY: entradas[indice].interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          }),
        },
      ],
    }
  }

  async function entrarConGoogle() {
    if (operacion.current) return
    operacion.current = true
    setOcupado(true)
    setError('')
    setAviso('')
    try {
      await GoogleSigninModule.hasPlayServices()
      const respuesta = await GoogleSigninModule.signIn()
      const idToken = respuesta.data?.idToken ?? respuesta.idToken
      if (!idToken) {
        throw new Error('No pudimos obtener las credenciales de Google.')
      }
      await signInWithGoogleIdToken(idToken)
    } catch (fallo: unknown) {
      const mensaje =
        fallo && typeof fallo === 'object' && 'message' in fallo
          ? String(fallo.message)
          : 'No pudimos autenticarte con Google.'
      setError(mensaje)
    } finally {
      operacion.current = false
      setOcupado(false)
    }
  }

  async function entrar() {
    if (operacion.current) return
    const emailLimpio = email.trim()
    if (
      !MODO_SEEDS &&
      (!EMAIL_VALIDO.test(emailLimpio) || clave.length === 0)
    ) {
      setAviso('')
      setError(
        !EMAIL_VALIDO.test(emailLimpio)
          ? 'Ingresá un correo electrónico válido.'
          : 'Ingresá tu contraseña.',
      )
      return
    }
    if (esRegistro && !nombre.trim()) {
      setAviso('')
      setError('Ingresá tu nombre para crear la cuenta.')
      return
    }
    if (esRegistro && clave.length < 6) {
      setAviso('')
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    operacion.current = true
    setOcupado(true)
    setError('')
    setAviso('')
    try {
      if (MODO_SEEDS) {
        signInDemo()
      } else if (esRegistro) {
        await signUpWithEmail(emailLimpio, clave, nombre.trim())
      } else {
        await signInWithEmail(emailLimpio, clave)
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
            ? 'Ese correo ya está registrado. Probá iniciando sesión.'
            : codigo === 'auth/invalid-email'
              ? 'El formato del correo electrónico no es válido.'
              : codigo === 'auth/invalid-credential' ||
                  codigo === 'auth/user-not-found' ||
                  codigo === 'auth/wrong-password'
                ? 'Datos incorrectos. Revisá tu correo y contraseña o registrate.'
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

  async function recuperarClave() {
    if (operacion.current) return
    const emailLimpio = email.trim()
    if (!EMAIL_VALIDO.test(emailLimpio)) {
      setAviso('')
      setError('Ingresá un correo válido para enviarte el enlace.')
      emailRef.current?.focus()
      return
    }
    if (!isFirebaseAvailable()) {
      setError('La recuperación por correo no está configurada en este entorno.')
      return
    }

    operacion.current = true
    setOcupado(true)
    setRecuperandoClave(true)
    setError('')
    setAviso('')
    try {
      await sendPasswordReset(emailLimpio)
      setAviso(
        'Si el correo está registrado, vas a recibir un enlace para restablecer tu contraseña.',
      )
    } catch (fallo) {
      const codigo =
        fallo && typeof fallo === 'object' && 'code' in fallo
          ? String(fallo.code)
          : ''
      setError(
        codigo === 'auth/network-request-failed'
          ? 'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.'
          : codigo === 'auth/too-many-requests'
            ? 'Hubo demasiados intentos. Esperá un momento y volvé a probar.'
            : 'No pudimos enviar el enlace. Revisá el correo e intentá de nuevo.',
      )
    } finally {
      operacion.current = false
      setOcupado(false)
      setRecuperandoClave(false)
    }
  }

  function presionarBoton() {
    Animated.spring(escalaBoton, {
      toValue: 0.985,
      useNativeDriver: USAR_DRIVER_NATIVO,
      speed: 35,
      bounciness: 2,
    }).start()
  }

  function soltarBoton() {
    Animated.spring(escalaBoton, {
      toValue: 1,
      useNativeDriver: USAR_DRIVER_NATIVO,
      speed: 30,
      bounciness: 5,
    }).start()
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        >
          <View className="w-full">
            <View className="h-[258px] items-center">
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 400 258"
                preserveAspectRatio="none"
                className="absolute inset-0"
              >
                <Path
                  d="M0 0H400V176C347 211 289 204 220 188C136 168 67 192 0 231V0Z"
                  fill={colores.primary}
                />
                <Circle cx="352" cy="48" r="52" fill="#DCF3E6" opacity={0.13} />
                <Circle cx="39" cy="181" r="29" fill="#FFFFFF" opacity={0.1} />
              </Svg>
              <Animated.View
                style={{
                  opacity: entradaCabecera,
                  transform: [
                    {
                      translateY: entradaCabecera.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-12, 0],
                      }),
                    },
                  ],
                }}
                className="w-full max-w-[500px] items-center px-6 pt-5"
              >
                <View className="mb-5 flex-row items-center gap-3">
                  <Image
                    source={require('../../../assets/images/logo-junti.png')}
                    style={{ width: 58, height: 58, borderRadius: 20 }}
                    accessibilityLabel="Logotipo de Junti"
                  />
                  <Text className="text-xl font-extrabold tracking-tight text-white">
                    Junti
                  </Text>
                </View>
                <Text className="text-center text-[25px] font-bold leading-[32px] text-white">
                  Qué bueno tenerte de vuelta
                </Text>
                <Text className="mt-1 text-center text-sm leading-5 text-white/90">
                  Tus planes y gastos compartidos te esperan.
                </Text>
              </Animated.View>
            </View>

            <View className="-mt-7 w-full self-center px-5" style={{ maxWidth: 500 }}>
              <Animated.View
                style={[
                  estilos.tarjeta,
                  {
                    opacity: entradaFormulario,
                    transform: [{ translateY: desplazamientoFormulario }],
                  },
                ]}
              >
                {MODO_SEEDS ? (
                  <>
                    <Animated.View style={estiloEntrada(0)}>
                      <Text accessibilityRole="header" className="text-2xl font-bold text-text">
                        Probá la app
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-text-muted">
                        Explorá grupos, gastos y deudas con datos de ejemplo.
                        Tus cambios se guardan en este dispositivo.
                      </Text>
                    </Animated.View>
                    <Animated.View style={estiloEntrada(6)}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ busy: ocupado }}
                        disabled={ocupado}
                        onPress={() => void entrar()}
                        onPressIn={presionarBoton}
                        onPressOut={soltarBoton}
                      >
                        <Animated.View
                          style={[
                            estilos.botonPrincipal,
                            { transform: [{ scale: escalaBoton }] },
                          ]}
                        >
                          {ocupado ? (
                            <ActivityIndicator color={colores.surface} />
                          ) : (
                            <Text className="text-center text-base font-bold text-white">
                              Entrar con datos de ejemplo
                            </Text>
                          )}
                        </Animated.View>
                      </Pressable>
                    </Animated.View>
                  </>
                ) : (
                  <>
                    <Animated.View style={estiloEntrada(0)}>
                      <Text accessibilityRole="header" className="text-2xl font-bold text-text">
                        {esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
                      </Text>
                      <Text className="mt-1 text-sm leading-6 text-text-muted">
                        {esRegistro
                          ? 'Empezá a organizar los gastos de tus planes.'
                          : 'Ingresá para continuar con tus grupos.'}
                      </Text>
                    </Animated.View>

                    {mostrarGoogle && (
                      <Animated.View style={estiloEntrada(1)} className="gap-4">
                        <Pressable
                          accessibilityRole="button"
                          accessibilityState={{ disabled: ocupado, busy: ocupado }}
                          disabled={ocupado}
                          onPress={() => void entrarConGoogle()}
                          className="min-h-[52px] flex-row items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 active:bg-primary-light"
                        >
                          <View className="h-7 w-7 items-center justify-center rounded-full bg-background">
                            <Text className="text-base font-extrabold text-[#4285F4]">G</Text>
                          </View>
                          <Text className="text-base font-semibold text-text">
                            Continuar con Google
                          </Text>
                        </Pressable>
                        <View className="flex-row items-center gap-3">
                          <View className="h-px flex-1 bg-slate-200" />
                          <Text className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                            O
                          </Text>
                          <View className="h-px flex-1 bg-slate-200" />
                        </View>
                      </Animated.View>
                    )}

                    {esRegistro && (
                      <Animated.View style={estiloEntrada(2)}>
                        <Text className="mb-2 text-sm font-semibold text-text">
                          Nombre
                        </Text>
                        <View className="min-h-[54px] flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-background px-4">
                          <UserRound size={19} color={colores.textMuted} />
                          <TextInput
                            accessibilityLabel="Nombre"
                            value={nombre}
                            onChangeText={setNombre}
                            placeholder="Ej: Germán Morales"
                            placeholderTextColor={colores.textMuted}
                            autoCapitalize="words"
                            autoComplete="name"
                            editable={!ocupado}
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current?.focus()}
                            className="min-h-[52px] flex-1 text-base text-text"
                          />
                        </View>
                      </Animated.View>
                    )}

                    <Animated.View style={estiloEntrada(3)}>
                      <Text className="mb-2 text-sm font-semibold text-text">
                        Correo electrónico
                      </Text>
                      <View className="min-h-[54px] flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-background px-4">
                        <Mail size={19} color={colores.textMuted} />
                        <TextInput
                          ref={emailRef}
                          accessibilityLabel="Correo electrónico"
                          value={email}
                          onChangeText={setEmail}
                          placeholder="tu@correo.com"
                          placeholderTextColor={colores.textMuted}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="email-address"
                          autoComplete="email"
                          textContentType="emailAddress"
                          editable={!ocupado}
                          returnKeyType="next"
                          onSubmitEditing={() => claveRef.current?.focus()}
                          className="min-h-[52px] flex-1 text-base text-text"
                        />
                      </View>
                    </Animated.View>

                    <Animated.View style={estiloEntrada(4)}>
                      <Text className="mb-2 text-sm font-semibold text-text">
                        Contraseña
                      </Text>
                      <View className="min-h-[54px] flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-background px-4">
                        <LockKeyhole size={19} color={colores.textMuted} />
                        <TextInput
                          ref={claveRef}
                          accessibilityLabel="Contraseña"
                          value={clave}
                          onChangeText={setClave}
                          placeholder={esRegistro ? 'Mínimo 6 caracteres' : 'Tu contraseña'}
                          placeholderTextColor={colores.textMuted}
                          secureTextEntry={!mostrarClave}
                          autoComplete={esRegistro ? 'new-password' : 'current-password'}
                          textContentType={esRegistro ? 'newPassword' : 'password'}
                          editable={!ocupado}
                          returnKeyType="done"
                          onSubmitEditing={() => void entrar()}
                          className="min-h-[52px] flex-1 text-base text-text"
                        />
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={
                            mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'
                          }
                          accessibilityState={{ checked: mostrarClave }}
                          disabled={ocupado}
                          onPress={() => setMostrarClave((actual) => !actual)}
                          hitSlop={10}
                        >
                          {mostrarClave ? (
                            <EyeOff size={20} color={colores.textMuted} />
                          ) : (
                            <Eye size={20} color={colores.textMuted} />
                          )}
                        </Pressable>
                      </View>
                    </Animated.View>

                    {!esRegistro && (
                      <Animated.View style={estiloEntrada(5)} className="items-end">
                        <Pressable
                          accessibilityRole="button"
                          accessibilityState={{ busy: recuperandoClave }}
                          disabled={ocupado}
                          onPress={() => void recuperarClave()}
                          hitSlop={8}
                        >
                          {recuperandoClave ? (
                            <View className="flex-row items-center gap-2 py-1">
                              <ActivityIndicator
                                size="small"
                                color={colores.primaryDark}
                              />
                              <Text className="text-sm font-semibold text-primary-dark">
                                Enviando enlace…
                              </Text>
                            </View>
                          ) : (
                            <Text className="py-1 text-sm font-semibold text-primary-dark">
                              ¿Olvidaste tu contraseña?
                            </Text>
                          )}
                        </Pressable>
                      </Animated.View>
                    )}

                    <Animated.View style={estiloEntrada(6)}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={
                          esRegistro ? 'Crear mi cuenta' : 'Iniciar sesión'
                        }
                        accessibilityState={{
                          disabled: ocupado || !isFirebaseAvailable(),
                          busy: ocupado,
                        }}
                        disabled={ocupado || !isFirebaseAvailable()}
                        onPress={() => void entrar()}
                        onPressIn={presionarBoton}
                        onPressOut={soltarBoton}
                      >
                        <Animated.View
                          style={[
                            estilos.botonPrincipal,
                            {
                              opacity: ocupado || !isFirebaseAvailable() ? 0.65 : 1,
                              transform: [{ scale: escalaBoton }],
                            },
                          ]}
                        >
                          {ocupado && !recuperandoClave ? (
                            <>
                              <ActivityIndicator color={colores.surface} />
                              <Text className="text-base font-bold text-white">
                                Un momento…
                              </Text>
                            </>
                          ) : (
                            <>
                              <Text className="text-base font-bold text-white">
                                {esRegistro ? 'Crear mi cuenta' : 'Iniciar sesión'}
                              </Text>
                              <ArrowRight size={19} color={colores.surface} />
                            </>
                          )}
                        </Animated.View>
                      </Pressable>
                    </Animated.View>

                    {error ? (
                      <Animated.View style={estiloEntrada(8)}>
                        <Text
                          accessibilityRole="alert"
                          accessibilityLiveRegion="polite"
                          className="text-sm leading-5 text-red-700"
                        >
                          {error}
                        </Text>
                      </Animated.View>
                    ) : null}
                    {aviso ? (
                      <Animated.View style={estiloEntrada(8)}>
                        <Text
                          accessibilityLiveRegion="polite"
                          className="text-sm leading-5 text-primary-dark"
                        >
                          {aviso}
                        </Text>
                      </Animated.View>
                    ) : null}

                    {!isFirebaseAvailable() && (
                      <Text className="text-sm leading-5 text-text-muted">
                        El acceso a cuentas todavía no está configurado.
                        Contactá al equipo para habilitarlo.
                      </Text>
                    )}

                    <Animated.View style={estiloEntrada(7)} className="mt-1 items-center">
                      <Pressable
                        accessibilityRole="button"
                        disabled={ocupado || transicionando}
                        onPress={cambiarModo}
                        className="flex-row flex-wrap justify-center py-2"
                      >
                        <Text className="text-sm text-text-muted">
                          {esRegistro ? '¿Ya tenés una cuenta? ' : '¿No tenés una cuenta? '}
                        </Text>
                        <Text className="text-sm font-bold text-primary-dark">
                          {esRegistro ? 'Iniciá sesión' : 'Registrate'}
                        </Text>
                      </Pressable>
                    </Animated.View>
                  </>
                )}
              </Animated.View>
              <Pressable
                accessibilityRole="button"
                onPress={() => setMostrarTerminos(true)}
                className="items-center py-4"
              >
                <Text className="text-sm font-semibold text-primary-dark underline">
                  Leer Términos y Condiciones
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        visible={mostrarTerminos}
        animationType="slide"
        onRequestClose={() => setMostrarTerminos(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-4">
            <Text className="text-lg font-bold text-slate-900">
              Términos y Condiciones
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar términos y condiciones"
              onPress={() => setMostrarTerminos(false)}
              className="rounded-full bg-primary-light px-4 py-2"
            >
              <Text className="font-semibold text-primary-dark">Cerrar</Text>
            </Pressable>
          </View>
          <ScrollView
            contentContainerClassName="mx-auto w-full max-w-3xl gap-4 px-5 py-6"
          >
            <ContenidoTerminos />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const estilos = {
  tarjeta: {
    width: '100%' as const,
    gap: 18,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E8EEF1',
    backgroundColor: colores.surface,
    padding: 22,
    boxShadow: '0px 8px 18px rgba(46, 125, 87, 0.12)',
  },
  botonPrincipal: {
    minHeight: 54,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 10,
    borderRadius: 18,
    backgroundColor: colores.primary,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
}

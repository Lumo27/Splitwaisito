import { useRef, useState } from 'react'
import { Image, Pressable, Text, View } from 'react-native'
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
  signUpWithEmail,
} from '@/services/auth'
import { isFirebaseAvailable, MODO_SEEDS } from '@/services/firebase'

export function LoginScreen() {
  const [esRegistro, setEsRegistro] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const operacion = useRef(false)

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

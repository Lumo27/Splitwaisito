import { useRef, useState } from 'react'
import { Text, View } from 'react-native'
import { Portada } from '@/components/Portada'
import {
  Boton,
  Campo,
  Mensaje,
  Pantalla,
  Tarjeta,
} from '@/components/Formulario'
import { signInDemo, signInWithEmail } from '@/services/auth'
import { isFirebaseAvailable, MODO_SEEDS } from '@/services/firebase'

export function LoginScreen() {
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
    operacion.current = true
    setOcupado(true)
    setError('')
    try {
      if (MODO_SEEDS) signInDemo()
      else await signInWithEmail(email.trim(), clave)
      // La navegación protegida cambia de pantalla cuando se restaura el perfil.
    } catch (fallo) {
      const codigo =
        fallo && typeof fallo === 'object' && 'code' in fallo
          ? String(fallo.code)
          : ''
      setError(
        codigo === 'auth/network-request-failed'
          ? 'No pudimos conectarnos. Revisá tu conexión.'
          : codigo === 'auth/operation-not-allowed'
            ? 'El acceso por e-mail todavía no está habilitado para esta app.'
            : 'No pudimos iniciar sesión. Revisá tus datos y volvé a intentar.',
      )
    } finally {
      operacion.current = false
      setOcupado(false)
    }
  }
  return (
    <Pantalla>
      <Portada
        etiqueta="Menos cuentas. Más planes."
        titulo="Splitwaisito"
        descripcion="Compartí los planes, organizá los gastos."
        pie="Tu gente. Tus planes. Todo claro."
      />
      <View className="flex-row flex-wrap gap-2">
        {['Grupos', 'Tickets', 'Saldos claros'].map((texto, index) => (
          <View
            key={texto}
            className="rounded-full px-4 py-2"
            style={{
              backgroundColor: ['#DDF8EC', '#E0F2FE', '#FFF0E8'][index],
            }}
          >
            <Text className="text-xs font-semibold text-text">{texto}</Text>
          </View>
        ))}
      </View>{' '}
      <Tarjeta>
        <Text
          accessibilityRole="header"
          className="text-xl font-bold text-text"
        >
          {MODO_SEEDS ? 'Probá la app' : 'Iniciar sesión'}
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
              value={clave}
              onChangeText={setClave}
              secureTextEntry
              autoComplete="current-password"
              editable={!ocupado}
            />
            <Boton
              texto="Iniciar sesión"
              cargando={ocupado}
              disabled={!isFirebaseAvailable()}
              onPress={() => {
                void entrar()
              }}
            />
            {!isFirebaseAvailable() && (
              <Mensaje texto="El acceso a cuentas todavía no está configurado. Contactá al equipo para habilitarlo." />
            )}
            <Text className="text-xs leading-5 text-text-muted">
              El acceso con Google requiere configurar la versión instalada de
              la app. En Expo Go podés usar el modo de prueba o una cuenta con
              e-mail y contraseña habilitada.
            </Text>
          </>
        )}
        <Mensaje texto={error} error />
      </Tarjeta>
    </Pantalla>
  )
}

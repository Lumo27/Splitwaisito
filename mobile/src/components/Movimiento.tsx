import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  AccessibilityInfo,
  Animated,
  Platform,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

// Un solo observador del sistema para todos los componentes animados.
const MovimientoContext = createContext(true)
export function useMovimientoReducido() {
  return useContext(MovimientoContext)
}
export function MovimientoProvider({ children }: { children: ReactNode }) {
  const [reducido, setReducido] = useState(true)
  useEffect(() => {
    let activo = true
    let cambioRecibido = false
    const escucha = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (valor) => {
        cambioRecibido = true
        if (activo) setReducido(valor)
      },
    )
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((valor) => {
        if (activo && !cambioRecibido) setReducido(valor)
      })
      .catch(() => {})
    return () => {
      activo = false
      escucha.remove()
    }
  }, [])
  return (
    <MovimientoContext.Provider value={reducido}>
      {children}
    </MovimientoContext.Provider>
  )
}

export function Entrada({
  children,
  style,
  reducido,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  reducido: boolean
}) {
  const [progreso] = useState(() => new Animated.Value(1))
  useEffect(() => {
    if (reducido) {
      progreso.setValue(1)
      return
    }
    progreso.setValue(0)
    const animacion = Animated.timing(progreso, {
      toValue: 1,
      duration: 280,
      useNativeDriver: Platform.OS !== 'web',
      isInteraction: false,
    })
    animacion.start()
    return () => animacion.stop()
  }, [progreso, reducido])
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progreso,
          transform: [
            {
              translateY: progreso.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  )
}

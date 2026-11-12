import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

export function useMovimientoReducidoSistema() {
  const [reducido, setReducido] = useState(false)

  useEffect(() => {
    let vigente = true
    void AccessibilityInfo.isReduceMotionEnabled().then(
      (valor) => {
        if (vigente) setReducido(valor)
      },
      (error: unknown) => {
        console.error(
          'No se pudo leer la preferencia de movimiento del sistema.',
          error,
        )
      },
    )
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReducido,
    )
    return () => {
      vigente = false
      subscription.remove()
    }
  }, [])

  return reducido
}

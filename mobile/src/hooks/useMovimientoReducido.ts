import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'
import { useAppStore } from '@/store/useAppStore'

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

/**
 * true si hay que evitar animaciones: porque el usuario lo pidió en
 * Accesibilidad o porque el sistema lo pide y la app está configurada para
 * respetarlo.
 */
export function useReducirAnimaciones() {
  const sistema = useMovimientoReducidoSistema()
  const reducidoPorUsuario = useAppStore(
    (state) => state.preferencias.reducedMotion,
  )
  const respetarSistema = useAppStore(
    (state) => state.preferencias.accessibilityOptions.respectSystemMotion,
  )
  return reducidoPorUsuario || (respetarSistema && sistema)
}

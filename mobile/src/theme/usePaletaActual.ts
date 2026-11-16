import { useMemo } from 'react'
import { useColorScheme } from 'nativewind'
import { useAppStore } from '@/store/useAppStore'
import { obtenerPaleta } from './paleta'

export function usePaletaActual() {
  const { colorScheme } = useColorScheme()
  const altoContraste = useAppStore(
    (state) => state.preferencias.highContrast,
  )

  return useMemo(
    () => obtenerPaleta(colorScheme === 'dark', altoContraste),
    [colorScheme, altoContraste],
  )
}

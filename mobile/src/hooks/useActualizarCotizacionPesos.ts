import { useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import type { MonedaCodigo } from '@/theme/moneda'
import {
  cotizacionVencida,
  obtenerCotizacionPesos,
} from '@/services/equivalenciaPesos'
import { useAppStore } from '@/store/useAppStore'

export function useActualizarCotizacionPesos(moneda: MonedaCodigo) {
  const cotizacion = useAppStore((state) =>
    moneda === 'ARS' ? undefined : state.cotizacionesPesos[moneda],
  )
  const guardarCotizaciones = useAppStore(
    (state) => state.guardarCotizacionesPesos,
  )

  useFocusEffect(
    useCallback(() => {
      if (moneda === 'ARS' || !cotizacionVencida(cotizacion)) return

      void obtenerCotizacionPesos(moneda)
        .then((nuevaCotizacion) =>
          guardarCotizaciones({ [moneda]: nuevaCotizacion }),
        )
        .catch((error: unknown) => {
          console.warn(`No se pudo actualizar la cotización ${moneda}.`, error)
        })
    }, [moneda, cotizacion, guardarCotizaciones]),
  )
}

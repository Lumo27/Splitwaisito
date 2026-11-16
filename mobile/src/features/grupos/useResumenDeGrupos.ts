import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTraduccion } from '@/i18n/useTraduccion'
import {
  obtenerGastosDelGrupo,
  obtenerGruposDelUsuario,
} from '@/services/firestore'
import { notificarAhora } from '@/services/recordatorios'
import { useAppStore } from '@/store/useAppStore'
import { formatearMoneda } from '@/theme/moneda'
import { saldoDelUsuario } from './deudasDelGrupo'
import { pagosParaRevisar, type PagoParaRevisar } from './pagos'

// Pagos ya notificados en este dispositivo, para avisar una sola vez por pago.
const CLAVE_AVISADOS = 'junti-pagos-avisados'

async function leerAvisados(): Promise<string[]> {
  try {
    const guardado = await AsyncStorage.getItem(CLAVE_AVISADOS)
    return guardado ? (JSON.parse(guardado) as string[]) : []
  } catch {
    return []
  }
}

/**
 * Resume los grupos del usuario cada vez que la pantalla toma foco: su saldo
 * en cada grupo y los comprobantes que tiene que aprobar. Si hay alguno nuevo y las notificaciones de pagos están
 * activas, lo avisa con una notificación local. No es push: el aviso llega
 * cuando quien recibe el dinero abre la app.
 */
export function useResumenDeGrupos() {
  const usuarioId = useAppStore((state) => state.usuarioActual?.id)
  const generales = useAppStore(
    (state) => state.preferencias.notificacionesGenerales,
  )
  const pagos = useAppStore((state) => state.preferencias.notificacionesPagos)
  const t = useTraduccion()
  const [pendientes, setPendientes] = useState<PagoParaRevisar[]>([])
  const [saldos, setSaldos] = useState<Record<string, number>>({})

  const buscar = useCallback(async () => {
    if (!usuarioId) return
    try {
      const grupos = await obtenerGruposDelUsuario(usuarioId)
      const conMovimientos = await Promise.all(
        grupos.map(async (grupo) => ({
          id: grupo.id,
          nombre: grupo.nombre,
          moneda: grupo.moneda ?? 'ARS',
          miembros: grupo.miembros,
          movimientos: await obtenerGastosDelGrupo(grupo.id),
        })),
      )
      setSaldos(
        Object.fromEntries(
          conMovimientos.map((grupo) => [
            grupo.id,
            saldoDelUsuario(usuarioId, grupo.miembros, grupo.movimientos),
          ]),
        ),
      )
      const encontrados = pagosParaRevisar(usuarioId, conMovimientos)
      setPendientes(encontrados)

      if (!generales || !pagos) return
      const avisados = await leerAvisados()
      const nuevos = encontrados.filter(
        ({ pago }) => pago.id && !avisados.includes(pago.id),
      )
      if (nuevos.length === 0) return
      const [primero] = nuevos
      const moneda =
        conMovimientos.find((grupo) => grupo.id === primero.grupoId)?.moneda ??
        'ARS'
      const avisado = await notificarAhora(
        t('Tenés un pago para revisar'),
        nuevos.length === 1
          ? t('{nombre} subió un comprobante de {monto} en "{grupo}".', {
              nombre: primero.pago.pagadoPorNombre,
              monto: formatearMoneda(primero.pago.monto, moneda),
              grupo: primero.grupoNombre,
            })
          : t('Tenés {cantidad} comprobantes para aprobar.', {
              cantidad: nuevos.length,
            }),
      )
      if (avisado) {
        await AsyncStorage.setItem(
          CLAVE_AVISADOS,
          JSON.stringify([...avisados, ...nuevos.map(({ pago }) => pago.id)]),
        )
      }
    } catch (error) {
      // El aviso es secundario: si falla, la pantalla sigue funcionando.
      console.warn('No se pudieron revisar los pagos pendientes.', error)
    }
  }, [usuarioId, generales, pagos, t])

  useFocusEffect(
    useCallback(() => {
      void buscar()
    }, [buscar]),
  )

  return { pendientes, saldos }
}

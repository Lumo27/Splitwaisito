import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { Preferencias } from '@/store/useAppStore'
import { db, MODO_SEEDS } from './firebase'

function esUnoDe<T extends string>(
  valor: unknown,
  opciones: readonly T[],
): valor is T {
  return typeof valor === 'string' && opciones.includes(valor as T)
}

function esBooleano(valor: unknown): valor is boolean {
  return typeof valor === 'boolean'
}

function leerPreferencias(valor: unknown): Partial<Preferencias> | null {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return null
  const datos = valor as Record<string, unknown>
  const preferencias: Partial<Preferencias> = {}

  if (esUnoDe(datos.theme, ['light', 'dark', 'system'])) {
    preferencias.theme = datos.theme
  }
  if (esUnoDe(datos.fontFamily, ['system', 'serif', 'monospace'])) {
    preferencias.fontFamily = datos.fontFamily
  }
  if (
    esUnoDe(datos.fontSize, [
      'verySmall',
      'small',
      'normal',
      'large',
      'veryLarge',
    ])
  ) {
    preferencias.fontSize = datos.fontSize
  }
  if (esUnoDe(datos.language, ['es', 'en', 'pt'])) {
    preferencias.language = datos.language
  }
  if (esBooleano(datos.highContrast)) {
    preferencias.highContrast = datos.highContrast
  }
  if (esBooleano(datos.reducedMotion)) {
    preferencias.reducedMotion = datos.reducedMotion
  }

  const accesibilidad = datos.accessibilityOptions
  if (accesibilidad && typeof accesibilidad === 'object') {
    const opciones = accesibilidad as Record<string, unknown>
    if (
      esBooleano(opciones.respectSystemMotion) &&
      esBooleano(opciones.improveReadability) &&
      esBooleano(opciones.highlightInteractive) &&
      esBooleano(opciones.largeTouchTargets)
    ) {
      preferencias.accessibilityOptions = {
        respectSystemMotion: opciones.respectSystemMotion,
        improveReadability: opciones.improveReadability,
        highlightInteractive: opciones.highlightInteractive,
        largeTouchTargets: opciones.largeTouchTargets,
      }
    }
  }

  const booleanos = [
    'notificacionesGenerales',
    'notificacionesCuenta',
    'notificacionesRecordatorios',
    'notificacionesActividad',
    'notificacionesNovedades',
    'notificacionesActualizaciones',
    'notificacionesAlertas',
  ] as const
  for (const clave of booleanos) {
    if (esBooleano(datos[clave])) preferencias[clave] = datos[clave]
  }
  if (esUnoDe(datos.monedaPreferida, ['ARS', 'USD', 'BRL'])) {
    preferencias.monedaPreferida = datos.monedaPreferida
  }

  return Object.keys(preferencias).length > 0 ? preferencias : null
}

export async function cargarPreferenciasUsuario(
  usuarioId: string,
): Promise<Partial<Preferencias> | null> {
  if (MODO_SEEDS) return null
  if (!db) throw new Error('Firebase no está configurado.')

  const perfil = await getDoc(doc(db, 'usuarios', usuarioId))
  return perfil.exists()
    ? leerPreferencias(perfil.data().preferencias)
    : null
}

export async function guardarPreferenciasUsuario(
  usuarioId: string,
  preferencias: Preferencias,
): Promise<void> {
  if (MODO_SEEDS) return
  if (!db) throw new Error('Firebase no está configurado.')

  await setDoc(
    doc(db, 'usuarios', usuarioId),
    { preferencias },
    { merge: true },
  )
}

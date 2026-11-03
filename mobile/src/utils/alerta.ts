import { Alert, Platform } from 'react-native'

export interface OpcionesConfirmacion {
  titulo: string
  mensaje: string
  textoConfirmar?: string
  textoCancelar?: string
  destructivo?: boolean
  alConfirmar: () => void | Promise<void>
  alCancelar?: () => void
}

/**
 * Diálogo de confirmación multiplataforma.
 * En Web utiliza window.confirm para no bloquear el flujo de confirmación.
 * En iOS y Android utiliza Alert.alert con estilo destructivo configurable.
 */
export function confirmar({
  titulo,
  mensaje,
  textoConfirmar = 'Eliminar',
  textoCancelar = 'Cancelar',
  destructivo = true,
  alConfirmar,
  alCancelar,
}: OpcionesConfirmacion) {
  if (Platform.OS === 'web') {
    const cuerpo = mensaje ? `${titulo}\n\n${mensaje}` : titulo
    const host: Record<string, unknown> =
      typeof window !== 'undefined'
        ? (window as unknown as Record<string, unknown>)
        : (globalThis as unknown as Record<string, unknown>)

    const fnConfirmar =
      typeof host.confirm === 'function'
        ? (host.confirm as (msg: string) => boolean)
        : null

    const aceptado = fnConfirmar ? fnConfirmar(cuerpo) : true

    if (aceptado) {
      void alConfirmar()
    } else if (alCancelar) {
      alCancelar()
    }
    return
  }

  Alert.alert(titulo, mensaje, [
    {
      text: textoCancelar,
      style: 'cancel',
      onPress: alCancelar,
    },
    {
      text: textoConfirmar,
      style: destructivo ? 'destructive' : 'default',
      onPress: () => {
        void alConfirmar()
      },
    },
  ])
}

/**
 * Mensaje de aviso simple multiplataforma.
 */
export function avisar(titulo: string, mensaje?: string) {
  if (Platform.OS === 'web') {
    const texto = mensaje ? `${titulo}\n\n${mensaje}` : titulo
    const host: Record<string, unknown> =
      typeof window !== 'undefined'
        ? (window as unknown as Record<string, unknown>)
        : (globalThis as unknown as Record<string, unknown>)

    const fnAlert =
      typeof host.alert === 'function'
        ? (host.alert as (msg: string) => void)
        : null

    if (fnAlert) {
      fnAlert(texto)
    }
    return
  }

  Alert.alert(titulo, mensaje)
}

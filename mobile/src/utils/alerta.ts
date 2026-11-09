import { Alert, Platform } from 'react-native'
import { useAppStore } from '@/store/useAppStore'
import { traducirTexto } from '@/i18n/textos'

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
  const idioma = useAppStore.getState().preferencias.language
  const tituloTraducido = traducirTexto(idioma, titulo)
  const mensajeTraducido = traducirTexto(idioma, mensaje)
  const confirmarTraducido = textoConfirmar
    ? traducirTexto(idioma, textoConfirmar)
    : undefined
  const cancelarTraducido = textoCancelar
    ? traducirTexto(idioma, textoCancelar)
    : undefined

  if (Platform.OS === 'web') {
    const cuerpo = mensajeTraducido
      ? `${tituloTraducido}\n\n${mensajeTraducido}`
      : tituloTraducido
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
      text: cancelarTraducido,
      style: 'cancel',
      onPress: alCancelar,
    },
    {
      text: confirmarTraducido,
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
  const idioma = useAppStore.getState().preferencias.language
  const tituloTraducido = traducirTexto(idioma, titulo)
  const mensajeTraducido = mensaje ? traducirTexto(idioma, mensaje) : undefined

  if (Platform.OS === 'web') {
    const texto = mensajeTraducido
      ? `${tituloTraducido}\n\n${mensajeTraducido}`
      : tituloTraducido
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

  Alert.alert(tituloTraducido, mensajeTraducido)
}

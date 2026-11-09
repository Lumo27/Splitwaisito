import { cssInterop } from 'nativewind'
import {
  Platform,
  StyleSheet,
  Text as NativeText,
  type TextProps,
  type TextStyle,
} from 'react-native'
import { useAppStore } from '@/store/useAppStore'
import { FACTORES_TAMANO_TEXTO, obtenerFuente } from '@/theme/paleta'
import { traducirTexto } from '@/i18n/translations'

function TextoConPreferencias({
  style,
  ...props
}: TextProps) {
  const fuente = useAppStore((state) => state.preferencias.fontFamily)
  const tamano = useAppStore((state) => state.preferencias.fontSize)
  const legibilidad = useAppStore(
    (state) => state.preferencias.accessibilityOptions.improveReadability,
  )
  const idioma = useAppStore((state) => state.preferencias.language)
  const escala = FACTORES_TAMANO_TEXTO[tamano] * (legibilidad ? 1.06 : 1)
  const estilo = StyleSheet.flatten(style) as TextStyle | undefined

  const estiloEscalado: TextStyle | undefined = estilo
    ? {
        ...estilo,
        ...(typeof estilo.fontSize === 'number'
          ? { fontSize: estilo.fontSize * escala }
          : {}),
        ...(typeof estilo.lineHeight === 'number'
          ? {
              lineHeight:
                estilo.lineHeight *
                escala *
                (legibilidad ? 1.12 : 1),
            }
          : {}),
      }
    : undefined

  return (
    <NativeText
      {...props}
      {...(typeof props.children === 'string'
        ? { children: traducirTexto(idioma, props.children) }
        : {})}
      style={[
        estiloEscalado,
        {
          fontFamily: obtenerFuente(
            fuente,
            Platform.OS === 'web' ||
              Platform.OS === 'ios' ||
              Platform.OS === 'android'
              ? Platform.OS
              : 'other',
          ),
        },
      ]}
    />
  )
}

export const Texto = cssInterop(TextoConPreferencias, {
  className: 'style',
})

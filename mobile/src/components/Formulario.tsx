import { useState, type ReactNode } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { Texto as Text } from '@/components/Texto'
import { useAppStore } from '@/store/useAppStore'
import { FACTORES_TAMANO_TEXTO, obtenerFuente } from '@/theme/paleta'
import { traducirTexto } from '@/i18n/translations'
import { usePaletaActual } from '@/theme/usePaletaActual'

export function Pantalla({ children }: { children: ReactNode }) {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={88}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
export function Tarjeta({ children }: { children: ReactNode }) {
  return (
    <View className="gap-3 rounded-2xl border border-slate-100 bg-surface p-4">
      {children}
    </View>
  )
}
export function Titulo({ children }: { children: ReactNode }) {
  return (
    <Text accessibilityRole="header" className="text-2xl font-bold text-text">
      {children}
    </Text>
  )
}
export function Campo({ label, ...props }: TextInputProps & { label: string }) {
  const paleta = usePaletaActual()
  const fuente = useAppStore((state) => state.preferencias.fontFamily)
  const tamano = useAppStore((state) => state.preferencias.fontSize)
  const idioma = useAppStore((state) => state.preferencias.language)
  const legibilidad = useAppStore(
    (state) => state.preferencias.accessibilityOptions.improveReadability,
  )
  const escala = FACTORES_TAMANO_TEXTO[tamano] * (legibilidad ? 1.06 : 1)
  const { style, placeholder, ...inputProps } = props
  const plataforma =
    Platform.OS === 'web' ||
    Platform.OS === 'ios' ||
    Platform.OS === 'android'
      ? Platform.OS
      : 'other'

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-text">{label}</Text>
      <TextInput
        accessibilityLabel={traducirTexto(idioma, label)}
        placeholderTextColor={paleta.textMuted}
        className="min-h-12 rounded-xl border border-slate-200 bg-surface px-3 py-3 text-base text-text"
        style={[
          {
            fontFamily: obtenerFuente(fuente, plataforma),
            fontSize: 16 * escala,
            lineHeight: 24 * escala,
          },
          style,
        ]}
        placeholder={
          placeholder ? traducirTexto(idioma, placeholder) : undefined
        }
        {...inputProps}
      />
    </View>
  )
}
export function Boton({
  texto,
  onPress,
  disabled = false,
  cargando = false,
  secundario = false,
  peligro = false,
}: {
  texto: string
  onPress: () => void
  disabled?: boolean
  cargando?: boolean
  secundario?: boolean
  peligro?: boolean
}) {
  const paleta = usePaletaActual()
  const [enFoco, setEnFoco] = useState(false)
  const controlesGrandes = useAppStore(
    (state) => state.preferencias.accessibilityOptions.largeTouchTargets,
  )
  const resaltar = useAppStore(
    (state) => state.preferencias.accessibilityOptions.highlightInteractive,
  )
  const bloqueado = disabled || cargando
  const idioma = useAppStore((state) => state.preferencias.language)
  const fondo = peligro
    ? 'border border-rose-200 bg-rose-50'
    : secundario
      ? 'bg-primary-light'
      : 'bg-primary'
  const textoColor = peligro
    ? 'text-rose-600'
    : secundario
      ? 'text-primary-dark'
      : 'text-white'
  const colorLoader = peligro
    ? paleta.danger
    : secundario
    ? paleta.primaryDark
      : '#FFFFFF'

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={traducirTexto(idioma, texto)}
      accessibilityState={{ disabled: bloqueado, busy: cargando }}
      onPress={onPress}
      onFocus={() => setEnFoco(true)}
      onBlur={() => setEnFoco(false)}
      disabled={bloqueado}
      style={{
        opacity: bloqueado ? 0.5 : 1,
        minHeight: controlesGrandes ? 56 : 48,
        ...(resaltar && enFoco
          ? { borderWidth: 2, borderColor: paleta.primaryDark }
          : {}),
      }}
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-xl px-4 py-3 ${fondo}`}
    >
      {cargando && <ActivityIndicator color={colorLoader} />}
      <Text className={`text-center font-bold ${textoColor}`}>
        {texto}
      </Text>
    </Pressable>
  )
}
export function Mensaje({
  texto,
  error = false,
}: {
  texto: string
  error?: boolean
}) {
  const paleta = usePaletaActual()
  return texto ? (
    <Text
      accessibilityRole={error ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
      className="text-sm leading-6"
      style={{ color: error ? paleta.danger : paleta.primaryDark }}
    >
      {texto}
    </Text>
  ) : null
}
export function Opcion({
  texto,
  elegida,
  onPress,
  disabled = false,
}: {
  texto: string
  elegida: boolean
  onPress: () => void
  disabled?: boolean
}) {
  const paleta = usePaletaActual()
  const controlesGrandes = useAppStore(
    (state) => state.preferencias.accessibilityOptions.largeTouchTargets,
  )
  const resaltar = useAppStore(
    (state) => state.preferencias.accessibilityOptions.highlightInteractive,
  )
  const idioma = useAppStore((state) => state.preferencias.language)
  const [enFoco, setEnFoco] = useState(false)
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: elegida, disabled }}
      accessibilityLabel={traducirTexto(idioma, texto)}
      disabled={disabled}
      onPress={onPress}
      onFocus={() => setEnFoco(true)}
      onBlur={() => setEnFoco(false)}
      className={`min-h-12 justify-center rounded-xl border px-3 py-3 ${elegida ? 'border-primary bg-primary-light' : 'border-slate-200 bg-surface'}`}
      style={[
        { minHeight: controlesGrandes ? 56 : 48 },
        resaltar && enFoco
          ? { borderWidth: 2, borderColor: paleta.primaryDark }
          : undefined,
      ]}
    >
      <Text
        className={elegida ? 'font-semibold text-primary-dark' : 'text-text'}
      >
        {elegida ? '✓ ' : ''}
        {texto}
      </Text>
    </Pressable>
  )
}

export function FilaConfig({
  icono,
  titulo,
  descripcion,
  onPress,
  derecha,
  deshabilitado = false,
}: {
  icono: ReactNode
  titulo: string
  descripcion?: string
  onPress?: () => void
  derecha?: ReactNode
  deshabilitado?: boolean
}) {
  const paleta = usePaletaActual()
  const controlesGrandes = useAppStore(
    (state) => state.preferencias.accessibilityOptions.largeTouchTargets,
  )
  const resaltar = useAppStore(
    (state) => state.preferencias.accessibilityOptions.highlightInteractive,
  )
  const [enFoco, setEnFoco] = useState(false)
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={onPress}
      onFocus={() => setEnFoco(true)}
      onBlur={() => setEnFoco(false)}
      style={({ pressed }) => ({
        opacity: pressed || deshabilitado ? 0.7 : 1,
        minHeight: controlesGrandes ? 64 : 56,
        ...(resaltar && enFoco
          ? { borderWidth: 2, borderColor: paleta.primaryDark }
          : {}),
      })}
      className="min-h-14 flex-row items-center gap-3 border-b border-slate-100 bg-surface px-4 py-3 last:border-b-0"
    >
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
        {icono}
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-base font-medium text-text">{titulo}</Text>
        {descripcion ? (
          <Text className="text-xs leading-4 text-textMuted">{descripcion}</Text>
        ) : null}
      </View>
      <View className="items-center justify-center">
        {derecha ?? <ChevronRight size={18} color={paleta.textMuted} />}
      </View>
    </Pressable>
  )
}

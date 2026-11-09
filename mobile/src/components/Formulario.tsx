import type { ReactNode } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import { colores } from '@/theme/colores'

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
    <View className="gap-3 rounded-2xl border border-slate-100 bg-white p-4">
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
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-text">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colores.textMuted}
        className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-text"
        {...props}
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
  const bloqueado = disabled || cargando
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
    ? '#E11D48'
    : secundario
      ? colores.primaryDark
      : '#FFFFFF'

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={texto}
      accessibilityState={{ disabled: bloqueado, busy: cargando }}
      onPress={onPress}
      disabled={bloqueado}
      style={{ opacity: bloqueado ? 0.5 : 1 }}
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
  return texto ? (
    <Text
      accessibilityRole={error ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
      className={`text-sm leading-6 ${error ? 'text-red-700' : 'text-primary-dark'}`}
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
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: elegida, disabled }}
      accessibilityLabel={texto}
      disabled={disabled}
      onPress={onPress}
      className={`min-h-12 justify-center rounded-xl border px-3 py-3 ${elegida ? 'border-primary bg-primary-light' : 'border-slate-200 bg-white'}`}
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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed || deshabilitado ? 0.7 : 1 })}
      className="min-h-14 flex-row items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 last:border-b-0"
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
        {derecha ?? <ChevronRight size={18} color={colores.textMuted} />}
      </View>
    </Pressable>
  )
}

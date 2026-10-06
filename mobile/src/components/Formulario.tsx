import type { ReactNode } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from 'react-native'
import { colores } from '@/theme/colores'

export function Pantalla({ children }: { children: ReactNode }) {
  return <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={88}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}>{children}</ScrollView></KeyboardAvoidingView>
}
export function Tarjeta({ children }: { children: ReactNode }) {
  return <View className="gap-3 rounded-2xl border border-slate-100 bg-white p-4">{children}</View>
}
export function Titulo({ children }: { children: ReactNode }) {
  return <Text accessibilityRole="header" className="text-2xl font-bold text-text">{children}</Text>
}
export function Campo({ label, ...props }: TextInputProps & { label: string }) {
  return <View className="gap-2"><Text className="text-sm font-semibold text-text">{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor={colores.textMuted} className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-text" {...props} /></View>
}
export function Boton({ texto, onPress, disabled = false, cargando = false, secundario = false }: { texto: string; onPress: () => void; disabled?: boolean; cargando?: boolean; secundario?: boolean }) {
  const bloqueado = disabled || cargando
  return <Pressable accessibilityRole="button" accessibilityLabel={texto} accessibilityState={{ disabled: bloqueado, busy: cargando }} onPress={onPress} disabled={bloqueado} style={{ opacity: bloqueado ? 0.5 : 1 }} className={`min-h-12 flex-row items-center justify-center gap-2 rounded-xl px-4 py-3 ${secundario ? 'bg-primary-light' : 'bg-primary'}`}>{cargando && <ActivityIndicator color={secundario ? colores.primaryDark : '#FFFFFF'} />}<Text className={`text-center font-bold ${secundario ? 'text-primary-dark' : 'text-white'}`}>{texto}</Text></Pressable>
}
export function Mensaje({ texto, error = false }: { texto: string; error?: boolean }) {
  return texto ? <Text accessibilityRole={error ? 'alert' : undefined} accessibilityLiveRegion="polite" className={`text-sm leading-6 ${error ? 'text-red-700' : 'text-primary-dark'}`}>{texto}</Text> : null
}
export function Opcion({ texto, elegida, onPress, disabled = false }: { texto: string; elegida: boolean; onPress: () => void; disabled?: boolean }) {
  return <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: elegida, disabled }} accessibilityLabel={texto} disabled={disabled} onPress={onPress} className={`min-h-12 justify-center rounded-xl border px-3 py-3 ${elegida ? 'border-primary bg-primary-light' : 'border-slate-200 bg-white'}`}><Text className={elegida ? 'font-semibold text-primary-dark' : 'text-text'}>{elegida ? '✓ ' : ''}{texto}</Text></Pressable>
}

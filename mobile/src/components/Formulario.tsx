import { useState, type ReactNode } from 'react'
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  CircleAlert,
} from 'lucide-react-native'
import { colores } from '@/theme/colores'
import { Entrada, useMovimientoReducido } from './Movimiento'

export function Pantalla({ children }: { children: ReactNode }) {
  const reducido = useMovimientoReducido()
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={88}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        <Entrada
          reducido={reducido}
          style={{ width: '100%', maxWidth: 640, alignSelf: 'center', gap: 18 }}
        >
          {children}
        </Entrada>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
export function Tarjeta({
  children,
  style,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
}) {
  return (
    <View
      className="gap-4 rounded-3xl border border-white bg-white p-5"
      style={[{ boxShadow: '0px 5px 20px rgba(20, 45, 42, 0.05)' }, style]}
    >
      {children}
    </View>
  )
}
export function Titulo({ children }: { children: ReactNode }) {
  return (
    <Text
      accessibilityRole="header"
      className="text-3xl font-bold tracking-tight text-text"
    >
      {children}
    </Text>
  )
}
export function Campo({
  label,
  onFocus,
  onBlur,
  style,
  ...props
}: TextInputProps & { label: string }) {
  const [foco, setFoco] = useState(false)
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-text">{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colores.textMuted}
        className="min-h-14 rounded-2xl border-2 bg-background px-4 py-3 text-base text-text"
        style={[
          {
            borderColor: foco ? colores.primary : '#E4ECE9',
            backgroundColor: foco ? '#FFFFFF' : colores.background,
          },
          style,
        ]}
        onFocus={(evento) => {
          setFoco(true)
          onFocus?.(evento)
        }}
        onBlur={(evento) => {
          setFoco(false)
          onBlur?.(evento)
        }}
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
}: {
  texto: string
  onPress: () => void
  disabled?: boolean
  cargando?: boolean
  secundario?: boolean
}) {
  const bloqueado = disabled || cargando
  const reducido = useMovimientoReducido()
  const [escala] = useState(() => new Animated.Value(1))
  function animar(valor: number) {
    escala.stopAnimation()
    if (reducido) {
      escala.setValue(1)
      return
    }
    Animated.timing(escala, {
      toValue: valor,
      duration: 100,
      useNativeDriver: Platform.OS !== 'web',
    }).start()
  }
  return (
    <Animated.View
      style={{ transform: [{ scale: escala }], opacity: bloqueado ? 0.5 : 1 }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={texto}
        accessibilityState={{ disabled: bloqueado, busy: cargando }}
        onPress={onPress}
        disabled={bloqueado}
        onPressIn={() => animar(0.98)}
        onPressOut={() => animar(1)}
        className={`min-h-14 flex-row items-center justify-center gap-3 rounded-2xl px-4 py-4 ${secundario ? 'bg-primary-light' : 'bg-primary'}`}
      >
        {cargando && (
          <ActivityIndicator
            color={secundario ? colores.primaryDark : '#FFFFFF'}
          />
        )}
        <Text
          className={`text-center text-base font-bold ${secundario ? 'text-primary-dark' : 'text-white'}`}
          style={{ flexShrink: 1 }}
        >
          {texto}
        </Text>
        {!secundario && !cargando && <ArrowRight size={18} color="#FFFFFF" />}
      </Pressable>
    </Animated.View>
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
    <View
      className="flex-row items-start gap-3 rounded-2xl p-4"
      style={{ backgroundColor: error ? '#FFF0EE' : colores.primaryLight }}
    >
      {error ? (
        <CircleAlert size={20} color="#B42318" />
      ) : (
        <CheckCircle2 size={20} color={colores.primaryDark} />
      )}
      <Text
        accessibilityRole={error ? 'alert' : undefined}
        accessibilityLiveRegion="polite"
        className={`flex-1 text-sm leading-6 ${error ? 'text-red-700' : 'text-primary-dark'}`}
      >
        {texto}
      </Text>
    </View>
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
      style={({ pressed }) => ({
        opacity: disabled ? 0.5 : pressed ? 0.75 : 1,
      })}
      className={`min-h-14 flex-row items-center gap-3 rounded-2xl border-2 px-4 py-3 ${elegida ? 'border-primary bg-primary-light' : 'border-slate-100 bg-white'}`}
    >
      {elegida ? (
        <Check size={20} color={colores.primaryDark} />
      ) : (
        <Circle size={20} color={colores.textMuted} />
      )}
      <Text
        className={`flex-1 ${elegida ? 'font-semibold text-primary-dark' : 'text-text'}`}
      >
        {texto}
      </Text>
    </Pressable>
  )
}

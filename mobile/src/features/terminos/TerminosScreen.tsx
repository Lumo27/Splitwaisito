import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTerminosAcceptance } from '@/features/auth/AuthBootstrap'
import { TERMINOS_DOCUMENTO } from './terminos'

function textoEnriquecido(texto: string) {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((parte, indice) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return (
        <Text key={indice} className="font-bold text-slate-800">
          {parte.slice(2, -2)}
        </Text>
      )
    }

    return parte
  })
}

function ContenidoTerminos() {
  const lineas = TERMINOS_DOCUMENTO.split('\n')

  return (
    <View className="gap-3">
      {lineas.map((linea, indice) => {
        if (!linea.trim()) return null
        if (linea === '---') {
          return <View key={indice} className="my-2 h-px bg-slate-200" />
        }
        if (linea.startsWith('# ')) {
          return (
            <Text
              key={indice}
              accessibilityRole="header"
              className="text-xl font-bold text-slate-900"
            >
              {linea.slice(2)}
            </Text>
          )
        }
        if (linea.startsWith('## ')) {
          return (
            <Text
              key={indice}
              accessibilityRole="header"
              className="mt-2 text-base font-bold text-primary-dark"
            >
              {linea.slice(3)}
            </Text>
          )
        }
        if (linea.startsWith('- ')) {
          return (
            <View key={indice} className="flex-row gap-2 pl-2">
              <Text className="text-base leading-6 text-slate-700">•</Text>
              <Text className="flex-1 text-base leading-6 text-slate-700">
                {textoEnriquecido(linea.slice(2))}
              </Text>
            </View>
          )
        }
        if (linea.startsWith('*') && linea.endsWith('*')) {
          return (
            <Text
              key={indice}
              className="text-sm italic leading-6 text-slate-600"
            >
              {textoEnriquecido(linea.slice(1, -1))}
            </Text>
          )
        }
        return (
          <Text key={indice} className="text-base leading-6 text-slate-700">
            {textoEnriquecido(linea)}
          </Text>
        )
      })}
    </View>
  )
}

export function TerminosScreen() {
  const { height } = useWindowDimensions()
  const { estado, error, aceptar, reintentar } = useTerminosAcceptance()
  const [ocupado, setOcupado] = useState(false)
  const [errorAceptacion, setErrorAceptacion] = useState('')
  const [mostrarDocumento, setMostrarDocumento] = useState(false)
  const verificando = estado === 'comprobando'
  const puedeAceptar = estado === 'requerido' && !ocupado

  async function aceptarYContinuar() {
    if (!puedeAceptar) return
    setOcupado(true)
    setErrorAceptacion('')
    try {
      await aceptar()
    } catch {
      setErrorAceptacion(
        'No pudimos registrar tu aceptación. Revisá tu conexión e intentá nuevamente.',
      )
    } finally {
      setOcupado(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="w-full self-center px-5 pb-3 pt-4"
          style={{ maxWidth: 880, minHeight: height - 60, flexGrow: 1 }}
        >
          <View className="mb-4 flex-row items-center gap-3">
            <Image
              source={require('../../../assets/images/logo-junti.png')}
              style={{ width: 48, height: 48, borderRadius: 12 }}
              accessibilityLabel="Logotipo de Junti"
            />
            <Text className="text-2xl font-extrabold tracking-tight text-slate-900">
              Junti
            </Text>
          </View>

          <Text
            accessibilityRole="header"
            className="text-3xl font-extrabold text-slate-950"
          >
            Antes de comenzar
          </Text>
          <Text className="mt-2 text-base leading-6 text-slate-600">
            Para utilizar Junti, necesitamos que leas y aceptes nuestros
            Términos y Condiciones de Uso
          </Text>

          <View
            className="mt-5 min-h-0 flex-1 overflow-hidden rounded-3xl border border-primary-light bg-white shadow-sm"
            style={{ height: Math.min(Math.max(height * 0.4, 170), 560) }}
          >
            <View className="border-b border-slate-100 px-5 py-4">
              <Text className="text-sm font-bold uppercase tracking-wider text-primary-dark">
                Términos y Condiciones de Uso
              </Text>
              <Text className="mt-1 text-xs text-slate-500">
                Última actualización: 02/11/2026
              </Text>
            </View>
            <ScrollView
              className="flex-1"
              contentContainerClassName="gap-4 px-5 py-4"
              nestedScrollEnabled
            >
              <ContenidoTerminos />
            </ScrollView>
          </View>

          {verificando && (
            <View className="mt-3 flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#2E7D57" />
              <Text className="text-sm text-slate-600">
                Verificando tu aceptación...
              </Text>
            </View>
          )}

          {estado === 'error' && (
            <View className="mt-3 rounded-2xl border border-primary-light bg-primary-light/40 p-3">
              <Text
                accessibilityRole="alert"
                className="text-sm leading-5 text-primary-dark"
              >
                {error}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void reintentar()}
                className="mt-2 self-start"
              >
                <Text className="font-bold text-primary-dark">
                  Reintentar verificación
                </Text>
              </Pressable>
            </View>
          )}

          {!!errorAceptacion && (
            <Text
              accessibilityRole="alert"
              className="mt-3 text-sm text-primary-dark"
            >
              {errorAceptacion}
            </Text>
          )}

          <View className="mt-4 gap-2">
            <Pressable
              accessibilityRole="button"
              disabled={!puedeAceptar}
              onPress={() => void aceptarYContinuar()}
              className={`items-center justify-center rounded-2xl px-5 py-4 ${
                puedeAceptar
                  ? 'bg-primary active:bg-primary-dark'
                  : 'bg-primary-light'
              }`}
            >
              {ocupado ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-base font-bold text-white">
                  Aceptar y continuar
                </Text>
              )}
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setMostrarDocumento(true)}
              className="items-center rounded-2xl px-4 py-2"
            >
              <Text className="text-sm font-semibold text-primary-dark underline">
                Consultar los términos completos
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={mostrarDocumento}
        animationType="slide"
        onRequestClose={() => setMostrarDocumento(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-4">
            <Text className="text-lg font-bold text-slate-900">
              Términos y Condiciones de Uso
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar términos completos"
              onPress={() => setMostrarDocumento(false)}
              className="rounded-full bg-primary-light px-4 py-2"
            >
              <Text className="font-semibold text-primary-dark">Cerrar</Text>
            </Pressable>
          </View>
          <ScrollView
            contentContainerClassName="mx-auto w-full max-w-3xl gap-4 px-5 py-6"
          >
            <ContenidoTerminos />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

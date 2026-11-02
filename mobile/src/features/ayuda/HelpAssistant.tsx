import { useState } from 'react'
import { Modal, Pressable, Text, View, useWindowDimensions } from 'react-native'
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native'

import { obtenerTutorial, TUTORIALES } from './tutoriales'

export function HelpAssistant({ pathname }: { pathname: string }) {
  const [abierto, setAbierto] = useState(false)
  const [pasoActual, setPasoActual] = useState(0)
  const [finalizado, setFinalizado] = useState(false)
  const { width } = useWindowDimensions()
  const tutorial = TUTORIALES[obtenerTutorial(pathname)]
  const paso = tutorial.steps[pasoActual]

  function cerrar() {
    setAbierto(false)
    setPasoActual(0)
    setFinalizado(false)
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir ayuda: ${tutorial.title}`}
        onPress={() => setAbierto(true)}
        className="absolute right-5 z-40 h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg active:bg-primary-dark"
        style={{ top: 56 }}
      >
        <Text className="text-2xl font-bold text-white">?</Text>
      </Pressable>

      <Modal
        visible={abierto}
        transparent
        animationType="fade"
        onRequestClose={cerrar}
        statusBarTranslucent
      >
        <View className="flex-1 items-center justify-center bg-slate-950/50 p-4">
          <Pressable
            accessibilityLabel="Cerrar ayuda"
            onPress={cerrar}
            className="absolute inset-0"
          />
          <View
            accessibilityRole="none"
            className="w-full overflow-hidden rounded-3xl bg-white shadow-2xl"
            style={{ maxWidth: 440, maxHeight: '85%', width: width - 32 }}
          >
            <View className="flex-row items-start justify-between border-b border-primary-light px-5 py-4">
              <View className="flex-1 flex-row items-center gap-3 pr-3">
                <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary-light">
                  <Text className="text-xl font-extrabold text-primary-dark">?</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold uppercase tracking-wider text-primary-dark">
                    Ayuda interactiva
                  </Text>
                  <Text className="mt-0.5 text-lg font-bold text-text">
                    {tutorial.title}
                  </Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cerrar tutorial"
                onPress={cerrar}
                className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
              >
                <X size={20} color="#475569" />
              </Pressable>
            </View>

            {finalizado ? (
              <View className="items-center gap-3 px-6 py-10">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                  <Text className="text-2xl font-bold text-primary-dark">✓</Text>
                </View>
                <Text className="text-center text-xl font-bold text-text">
                  ¡Tutorial finalizado!
                </Text>
                <Text className="text-center leading-6 text-text-muted">
                  Ya podés seguir usando Junti. Esta ayuda queda disponible
                  cuando la necesites.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={cerrar}
                  className="mt-2 w-full items-center rounded-2xl bg-primary px-5 py-3.5 active:bg-primary-dark"
                >
                  <Text className="font-bold text-white">Cerrar</Text>
                </Pressable>
              </View>
            ) : (
              <View className="px-5 pb-5 pt-4">
                <View className="mb-5 flex-row gap-1.5">
                  {tutorial.steps.map((item, index) => (
                    <View
                      key={item.title}
                      className={`h-1.5 flex-1 rounded-full ${
                        index <= pasoActual ? 'bg-primary' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </View>
                <Text className="text-xs font-bold uppercase tracking-wide text-primary-dark">
                  Paso {pasoActual + 1} de {tutorial.steps.length}
                </Text>
                <Text className="mt-2 text-2xl font-bold text-text">
                  {paso.title}
                </Text>
                <Text className="mt-3 text-base leading-7 text-text-muted">
                  {paso.description}
                </Text>
                <View className="mt-8 flex-row items-center justify-between gap-3">
                  <Pressable
                    accessibilityRole="button"
                    disabled={pasoActual === 0}
                    onPress={() => setPasoActual((actual) => actual - 1)}
                    className="min-h-12 flex-1 flex-row items-center justify-center gap-1 rounded-2xl border border-primary-light px-3 disabled:opacity-40"
                  >
                    <ChevronLeft size={18} color="#2E7D57" />
                    <Text className="font-semibold text-primary-dark">Anterior</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      if (pasoActual === tutorial.steps.length - 1) {
                        setFinalizado(true)
                      } else {
                        setPasoActual((actual) => actual + 1)
                      }
                    }}
                    className="min-h-12 flex-1 flex-row items-center justify-center gap-1 rounded-2xl bg-primary px-3 active:bg-primary-dark"
                  >
                    <Text className="font-semibold text-white">
                      {pasoActual === tutorial.steps.length - 1
                        ? 'Finalizar'
                        : 'Siguiente'}
                    </Text>
                    {pasoActual < tutorial.steps.length - 1 && (
                      <ChevronRight size={18} color="#FFFFFF" />
                    )}
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  )
}

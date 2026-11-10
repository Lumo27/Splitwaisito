import { Text, View } from 'react-native'

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

export function ContenidoTerminos() {
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

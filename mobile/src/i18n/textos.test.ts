import { describe, expect, it } from 'vitest'
import { DICCIONARIOS, traducirTexto } from './textos'

const variables = (texto: string) => (texto.match(/\{\w+\}/g) ?? []).sort()

describe('traducciones de interfaz', () => {
  it('usa el español como clave y como respaldo', () => {
    expect(traducirTexto('es', 'Crear grupo')).toBe('Crear grupo')
    expect(traducirTexto('pt', 'texto sin traducción')).toBe(
      'texto sin traducción',
    )
    expect(traducirTexto('en', 'Crear grupo')).toBe('Create group')
    expect(traducirTexto('pt', 'Crear grupo')).toBe('Criar grupo')
  })

  it('completa las variables en cualquier idioma', () => {
    expect(traducirTexto('es', 'Recordar a {nombre}', { nombre: 'Ana' })).toBe(
      'Recordar a Ana',
    )
    expect(traducirTexto('en', 'Recordar a {nombre}', { nombre: 'Ana' })).toBe(
      'Remind Ana',
    )
    expect(
      traducirTexto('pt', 'Agregar a {nombre} al grupo', { nombre: 'Joao' }),
    ).toBe('Adicionar Joao ao grupo')
    expect(
      traducirTexto('en', 'Paso {actual} de {total}', { actual: 2, total: 4 }),
    ).toBe('Step 2 of 4')
  })

  it('inglés y portugués traducen las mismas frases', () => {
    const en = Object.keys(DICCIONARIOS.en).sort()
    const pt = Object.keys(DICCIONARIOS.pt).sort()
    expect(en.filter((clave) => !pt.includes(clave))).toEqual([])
    expect(pt.filter((clave) => !en.includes(clave))).toEqual([])
  })

  it('cada traducción conserva las variables de la frase original', () => {
    for (const diccionario of Object.values(DICCIONARIOS)) {
      for (const [original, traduccion] of Object.entries(diccionario)) {
        expect(variables(traduccion), original).toEqual(variables(original))
      }
    }
  })
})

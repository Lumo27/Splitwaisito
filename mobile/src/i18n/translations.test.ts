import { describe, expect, it } from 'vitest'
import { traducirTexto } from './textos'

describe('traducciones de interfaz', () => {
  it('mantiene el español como idioma de respaldo', () => {
    expect(traducirTexto('es', 'Crear grupo')).toBe('Crear grupo')
    expect(traducirTexto('pt', 'texto sin traducción')).toBe(
      'texto sin traducción',
    )
  })

  it('traduce etiquetas conocidas sin alterar contenido dinámico', () => {
    expect(traducirTexto('en', 'Crear grupo')).toBe('Create group')
    expect(traducirTexto('pt', 'Crear grupo')).toBe('Criar grupo')
    expect(traducirTexto('en', 'Eliminar a Ana')).toBe('Remove Ana')
    expect(traducirTexto('pt', 'Agregar a Joao al grupo')).toBe(
      'Adicionar Joao ao grupo',
    )
    expect(traducirTexto('en', 'Paso 2 de 4')).toBe('Step 2 of 4')
    expect(traducirTexto('en', 'Descripción escrita por el usuario')).toBe(
      'Descripción escrita por el usuario',
    )
  })
})

import { describe, expect, it } from 'vitest'

import { obtenerTutorial, TUTORIALES } from './tutoriales'

describe('tutoriales contextuales', () => {
  it.each([
    ['/grupos', 'groups'],
    ['/grupos/nuevo', 'groupCreate'],
    ['/grupos/grupo-1', 'groupDetail'],
    ['/grupos/grupo-1/cargar-gasto', 'expenseForm'],
    ['/grupos/grupo-1/cargar', 'expenseForm'],
    ['/gastos/nuevo', 'expenseForm'],
    ['/grupos/grupo-1/gasto/gasto-1', 'expenseDetail'],
    ['/grupos/grupo-1/saldar', 'debts'],
    ['/saldar/grupo-1/0', 'debts'],
    ['/actividad', 'activity'],
    ['/perfil', 'profile'],
    ['/configuracion', 'settings'],
  ] as const)('resuelve %s al tutorial %s', (pathname, tutorial) => {
    expect(obtenerTutorial(pathname)).toBe(tutorial)
  })

  it('ofrece pasos completos para cada contexto', () => {
    for (const tutorial of Object.values(TUTORIALES)) {
      expect(tutorial.title.length).toBeGreaterThan(0)
      expect(tutorial.steps.length).toBeGreaterThan(1)
      for (const paso of tutorial.steps) {
        expect(paso.title.length).toBeGreaterThan(0)
        expect(paso.description.length).toBeGreaterThan(0)
      }
    }
  })
})

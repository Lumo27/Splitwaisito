import { describe, expect, it } from 'vitest'
import { hasFirebaseConfig } from './firebase'

describe('hasFirebaseConfig', () => {
  it('devuelve false cuando faltan valores de configuración', () => {
    expect(hasFirebaseConfig({})).toBe(false)
  })

  it('devuelve true cuando todos los valores están completos', () => {
    expect(
      hasFirebaseConfig({
        apiKey: 'key',
        authDomain: 'domain',
        projectId: 'project',
        storageBucket: 'bucket',
        messagingSenderId: 'sender',
        appId: 'app',
      }),
    ).toBe(true)
  })
})

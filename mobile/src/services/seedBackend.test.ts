import { beforeEach, describe, expect, it, vi } from 'vitest'

// AsyncStorage en memoria: sobrevive a vi.resetModules(), que simula cerrar y
// volver a abrir la app.
const almacen = new Map<string, string>()

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: async (clave: string) => almacen.get(clave) ?? null,
    setItem: async (clave: string, valor: string) => void almacen.set(clave, valor),
    removeItem: async (clave: string) => void almacen.delete(clave),
  },
}))

async function abrirApp() {
  vi.resetModules()
  const seed = await import('./seedBackend')
  await seed.inicializarSeeds()
  return seed
}

describe('seedBackend en React Native', () => {
  beforeEach(() => {
    almacen.clear()
  })

  it('crea los datos de ejemplo la primera vez', async () => {
    const seed = await abrirApp()

    expect(seed.seedGruposDelUsuario(seed.SEED_USUARIO_ID)).toHaveLength(3)
  })

  it('conserva los cambios al reabrir la app', async () => {
    const seed = await abrirApp()
    const grupo = seed.seedCrearGrupo('Finde en la costa', seed.SEED_USUARIO_ID)
    seed.seedGuardarGasto(grupo.id, {
      descripcion: 'Nafta',
      monto: 30000,
      categoria: 'Transporte',
      pagadoPorId: seed.SEED_USUARIO_ID,
      pagadoPorNombre: 'Lucas',
      fecha: '',
    })

    const reabierta = await abrirApp()

    expect(reabierta.seedGetGrupo(grupo.id)?.nombre).toBe('Finde en la costa')
    expect(reabierta.seedGastosDelGrupo(grupo.id)).toHaveLength(1)
  })

  it('mantiene la sesión demo al reabrir la app y la cierra al salir', async () => {
    const seed = await abrirApp()
    seed.seedIniciarSesion()

    const reabierta = await abrirApp()
    const oyente = vi.fn()
    reabierta.seedSuscribirSesion(oyente)
    expect(oyente).toHaveBeenLastCalledWith(expect.objectContaining({ uid: seed.SEED_USUARIO_ID }))

    reabierta.seedCerrarSesion()
    expect(oyente).toHaveBeenLastCalledWith(null)
  })

  it('no deja modificar los datos guardados sin pasar por las funciones', async () => {
    const seed = await abrirApp()
    const [grupo] = seed.seedGruposDelUsuario(seed.SEED_USUARIO_ID)
    grupo.nombre = 'Cambiado a mano'

    expect(seed.seedGetGrupo(grupo.id)?.nombre).not.toBe('Cambiado a mano')
  })

  it('actualiza un gasto existente', async () => {
    const seed = await abrirApp()
    seed.seedActualizarGasto('grupo-asado', 'g-a1', { monto: 35000 })

    const gasto = seed.seedGastosDelGrupo('grupo-asado').find((g) => g.id === 'g-a1')
    expect(gasto?.monto).toBe(35000)
  })
})

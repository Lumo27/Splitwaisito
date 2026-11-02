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

  it('registra una transferencia y solo el acreedor puede confirmarla', async () => {
    const seed = await abrirApp()
    const transferencia = seed.seedCrearTransferenciaPendiente(
      'grupo-bariloche',
      seed.SEED_USUARIO_ID,
      'seed-cande',
      12000,
    )

    expect(transferencia.estado).toBe('pendiente')
    expect(() =>
      seed.seedResponderTransferencia(
        'grupo-bariloche',
        transferencia.id,
        seed.SEED_USUARIO_ID,
        'confirmada',
      ),
    ).toThrow('Solo el acreedor puede responder')

    const confirmada = seed.seedResponderTransferencia(
      'grupo-bariloche',
      transferencia.id,
      'seed-cande',
      'confirmada',
    )
    expect(confirmada.estado).toBe('confirmada')
    expect(confirmada.fechaRespuesta).toBeTruthy()
  })

  it('rechaza solicitudes duplicadas de transferencia pendientes', async () => {
    const seed = await abrirApp()
    seed.seedCrearTransferenciaPendiente(
      'grupo-bariloche',
      seed.SEED_USUARIO_ID,
      'seed-cande',
      12000,
    )

    expect(() =>
      seed.seedCrearTransferenciaPendiente(
        'grupo-bariloche',
        seed.SEED_USUARIO_ID,
        'seed-cande',
        12000,
      ),
    ).toThrow('Ya hay una transferencia pendiente')
  })

  it('limita a diez pendientes por grupo y libera el cupo al responder', async () => {
    const seed = await abrirApp()
    const pares = [
      ['seed-lucas', 'seed-cande'],
      ['seed-lucas', 'seed-german'],
      ['seed-lucas', 'seed-nahuel'],
      ['seed-cande', 'seed-lucas'],
      ['seed-cande', 'seed-german'],
      ['seed-cande', 'seed-nahuel'],
      ['seed-german', 'seed-lucas'],
      ['seed-german', 'seed-cande'],
      ['seed-german', 'seed-nahuel'],
      ['seed-nahuel', 'seed-lucas'],
      ['seed-nahuel', 'seed-cande'],
      ['seed-nahuel', 'seed-german'],
    ] as const

    const pendientes = pares.slice(0, 10).map(([deudorId, acreedorId]) =>
      seed.seedCrearTransferenciaPendiente(
        'grupo-bariloche',
        deudorId,
        acreedorId,
        1000,
      ),
    )
    expect(() =>
      seed.seedCrearTransferenciaPendiente(
        'grupo-bariloche',
        ...pares[10],
        1000,
      ),
    ).toThrow('El grupo ya tiene 10 transferencias pendientes')

    seed.seedResponderTransferencia(
      'grupo-bariloche',
      pendientes[0].id,
      pendientes[0].acreedorId,
      'rechazada',
    )

    expect(
      seed.seedCrearTransferenciaPendiente(
        'grupo-bariloche',
        ...pares[10],
        1000,
      ).estado,
    ).toBe('pendiente')

    seed.seedResponderTransferencia(
      'grupo-bariloche',
      pendientes[1].id,
      pendientes[1].acreedorId,
      'confirmada',
    )
    expect(
      seed.seedCrearTransferenciaPendiente(
        'grupo-bariloche',
        ...pares[11],
        1000,
      ).estado,
    ).toBe('pendiente')
  })
})

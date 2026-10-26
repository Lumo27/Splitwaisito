import { describe, expect, it, vi, beforeEach } from 'vitest'
import { avisar, confirmar } from './alerta'

const { mockPlatform, mockAlert } = vi.hoisted(() => ({
  mockPlatform: { OS: 'web' },
  mockAlert: { alert: vi.fn() },
}))

vi.mock('react-native', () => ({
  Platform: mockPlatform,
  Alert: mockAlert,
}))

describe('Utilidad de alertas multiplataforma', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockAlert.alert.mockClear()
  })

  it('ejecuta alConfirmar en entorno Web cuando window.confirm retorna true', () => {
    mockPlatform.OS = 'web'
    const confirmSpy = vi.fn().mockReturnValue(true)
    vi.stubGlobal('confirm', confirmSpy)

    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    confirmar({
      titulo: 'Eliminar elemento',
      mensaje: '¿Estás seguro?',
      alConfirmar: onConfirm,
      alCancelar: onCancel,
    })

    expect(confirmSpy).toHaveBeenCalledWith('Eliminar elemento\n\n¿Estás seguro?')
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('ejecuta alCancelar en entorno Web cuando window.confirm retorna false', () => {
    mockPlatform.OS = 'web'
    const confirmSpy = vi.fn().mockReturnValue(false)
    vi.stubGlobal('confirm', confirmSpy)

    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    confirmar({
      titulo: 'Eliminar elemento',
      mensaje: '¿Estás seguro?',
      alConfirmar: onConfirm,
      alCancelar: onCancel,
    })

    expect(onConfirm).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('llama a Alert.alert con las opciones adecuadas en plataformas móviles', () => {
    mockPlatform.OS = 'android'

    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    confirmar({
      titulo: 'Eliminar grupo',
      mensaje: 'Esta acción no se puede deshacer',
      alConfirmar: onConfirm,
      alCancelar: onCancel,
    })

    expect(mockAlert.alert).toHaveBeenCalledOnce()
    const [, , botones] = mockAlert.alert.mock.calls[0]
    expect(botones).toHaveLength(2)

    // Botón cancelar
    expect(botones?.[0].text).toBe('Cancelar')
    expect(botones?.[0].style).toBe('cancel')
    botones?.[0].onPress?.()
    expect(onCancel).toHaveBeenCalledOnce()

    // Botón confirmar
    expect(botones?.[1].text).toBe('Eliminar')
    expect(botones?.[1].style).toBe('destructive')
    botones?.[1].onPress?.()
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('llama a avisar en Web y Android', () => {
    mockPlatform.OS = 'web'
    const alertSpyWeb = vi.fn()
    vi.stubGlobal('alert', alertSpyWeb)
    avisar('Error', 'Algo salió mal')
    expect(alertSpyWeb).toHaveBeenCalledWith('Error\n\nAlgo salió mal')

    mockPlatform.OS = 'ios'
    avisar('Éxito', 'Guardado con éxito')
    expect(mockAlert.alert).toHaveBeenCalledWith('Éxito', 'Guardado con éxito')
  })
})

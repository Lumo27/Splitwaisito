import { useCallback, useRef, useState } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native'
import { ChevronRight, Plus, Trash2, Users } from 'lucide-react-native'

import { eliminarGrupo, obtenerGruposDelUsuario, type GrupoFirestore } from '@/services/firestore'
import { useAppStore } from '@/store/useAppStore'
import { colores } from '@/theme/colores'

export function GruposScreen() {
  const usuarioId = useAppStore((state) => state.usuarioActual?.id)
  const [grupos, setGrupos] = useState<GrupoFirestore[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [eliminando, setEliminando] = useState<string | null>(null)
  const peticion = useRef(0)
  const borradoEnCurso = useRef(false)

  const cargarGrupos = useCallback(async () => {
    const actual = ++peticion.current
    setCargando(true)
    setError('')
    if (!usuarioId) {
      setGrupos([])
      setCargando(false)
      return
    }
    try {
      const resultado = await obtenerGruposDelUsuario(usuarioId)
      if (actual === peticion.current) setGrupos(resultado)
    } catch {
      if (actual === peticion.current) {
        setError('No pudimos cargar tus grupos. Revisá la conexión y volvé a intentar.')
      }
    } finally {
      if (actual === peticion.current) setCargando(false)
    }
  }, [usuarioId])

  useFocusEffect(useCallback(() => {
    setGrupos([])
    void cargarGrupos()
    return () => { peticion.current += 1 }
  }, [cargarGrupos]))

  function confirmarEliminar(grupo: GrupoFirestore) {
    Alert.alert('Eliminar grupo', `¿Eliminar “${grupo.nombre}” y todos sus gastos? Esta acción no se puede deshacer.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: () => {
          if (borradoEnCurso.current || useAppStore.getState().usuarioActual?.id !== usuarioId) return
          borradoEnCurso.current = true
          setEliminando(grupo.id)
          void eliminarGrupo(grupo.id)
            .then(() => {
              if (useAppStore.getState().usuarioActual?.id !== usuarioId) return
              // Invalida lecturas anteriores para que no reaparezca el grupo borrado.
              peticion.current += 1
              setCargando(false)
              setGrupos((actuales) => actuales.filter((item) => item.id !== grupo.id))
            })
            .catch(() => Alert.alert('No se pudo eliminar', 'Revisá la conexión y volvé a intentar.'))
            .finally(() => {
              borradoEnCurso.current = false
              setEliminando(null)
            })
        },
      },
    ])
  }

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, paddingBottom: 32, flexGrow: 1 }}
      data={grupos}
      keyExtractor={(grupo) => grupo.id}
      refreshing={cargando}
      onRefresh={() => { void cargarGrupos() }}
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListHeaderComponent={
        <View className="mb-6 gap-4">
          <View>
            <Text className="mb-1 text-xs font-bold uppercase tracking-widest text-primary-dark">Espacio compartido</Text>
            <Text accessibilityRole="header" className="text-3xl font-bold text-text">Mis grupos</Text>
            <Text className="mt-2 text-sm text-text-muted">Organizá los gastos y saldos con tu gente.</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Crear un nuevo grupo"
            onPress={() => router.push('/grupos/nuevo')}
            className="min-h-12 flex-row items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3"
          >
            <Plus size={20} color="#FFFFFF" />
            <Text className="font-bold text-white">Crear grupo</Text>
          </Pressable>
          {error ? (
            <View accessibilityRole="alert" className="gap-2 rounded-2xl bg-red-50 p-4">
              <Text className="text-sm text-red-700">{error}</Text>
              <Pressable accessibilityRole="button" onPress={() => { void cargarGrupos() }} className="min-h-11 justify-center">
                <Text className="font-bold text-primary-dark">Volver a intentar</Text>
              </Pressable>
            </View>
          ) : null}
          <Text className="text-sm font-semibold text-text-muted">{grupos.length} grupo{grupos.length === 1 ? '' : 's'}</Text>
        </View>
      }
      ListEmptyComponent={
        cargando ? (
          <View className="items-center gap-3 py-12">
            <ActivityIndicator color={colores.primary} />
            <Text className="text-text-muted">Cargando tus grupos...</Text>
          </View>
        ) : !error ? (
          <View className="items-center gap-3 rounded-3xl bg-white px-6 py-12">
            <Users size={40} color={colores.primaryDark} />
            <Text className="text-lg font-bold text-text">Tu próximo plan empieza acá</Text>
            <Text className="text-center text-sm leading-6 text-text-muted">Creá tu primer grupo para compartir los gastos de un viaje, la casa o una salida.</Text>
          </View>
        ) : null
      }
      renderItem={({ item: grupo }) => (
        <View className="flex-row items-center rounded-2xl border border-slate-100 bg-white p-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${grupo.nombre}, ${grupo.miembros.length} integrantes`}
            className="min-h-24 flex-1 flex-row items-center gap-3 p-3"
            onPress={() => router.push({ pathname: '/grupos/[id]', params: { id: grupo.id } })}
          >
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
              <Users size={23} color={colores.primaryDark} />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-base font-bold text-text">{grupo.nombre}</Text>
              <Text className="text-xs text-text-muted">{grupo.miembros.length} integrante{grupo.miembros.length === 1 ? '' : 's'}</Text>
              {grupo.descripcion ? <Text numberOfLines={2} className="text-xs text-text-muted">{grupo.descripcion}</Text> : null}
            </View>
            <ChevronRight size={18} color={colores.textMuted} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Eliminar ${grupo.nombre}`}
            accessibilityState={{ disabled: eliminando !== null }}
            disabled={eliminando !== null}
            className="min-h-12 min-w-12 items-center justify-center rounded-xl"
            onPress={() => confirmarEliminar(grupo)}
          >
            {eliminando === grupo.id ? <ActivityIndicator color={colores.primary} /> : <Trash2 size={19} color={colores.textMuted} />}
          </Pressable>
        </View>
      )}
    />
  )
}

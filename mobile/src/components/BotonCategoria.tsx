import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Check, Circle, Home, Package, Utensils, Car } from 'lucide-react-native'
import { FondoCategoria } from './FondoCategoria'
import { COLOR_CATEGORIAS, type CategoriaGasto } from '../theme/svgCategorias'
import { colores } from '../theme/colores'

interface BotonCategoriaProps {
  categoria: CategoriaGasto
  elegida: boolean
  onPress: () => void
  disabled?: boolean
}

const ICONOS = {
  Comida: Utensils,
  Transporte: Car,
  Alojamiento: Home,
  Otro: Package,
}

export function BotonCategoria({
  categoria,
  elegida,
  onPress,
  disabled = false,
}: BotonCategoriaProps) {
  const Icono = ICONOS[categoria] ?? Package
  const paleta = COLOR_CATEGORIAS[categoria] ?? COLOR_CATEGORIAS.Otro

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Categoría ${categoria}`}
      accessibilityState={{ selected: elegida, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.boton,
        {
          borderColor: elegida ? paleta.primary : '#E2E8F0',
          borderWidth: elegida ? 2.5 : 1.5,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <FondoCategoria
        categoria={categoria}
        overlayOpacity={elegida ? 0.72 : 0.84}
        overlayColor="#FFFFFF"
        style={styles.fondo}
      >
        <View style={styles.contenido}>
          {/* Badge con ícono */}
          <View
            style={[
              styles.iconoBadge,
              { backgroundColor: elegida ? paleta.primary : '#F1F5F9' },
            ]}
          >
            <Icono
              size={18}
              color={elegida ? '#FFFFFF' : colores.textMuted}
            />
          </View>

          {/* Nombre de la categoría */}
          <Text
            style={[
              styles.texto,
              {
                fontWeight: elegida ? '700' : '600',
                color: elegida ? '#0F172A' : '#334155',
              },
            ]}
          >
            {categoria}
          </Text>

          {/* Indicador de selección */}
          <View style={styles.checkContenedor}>
            {elegida ? (
              <View
                style={[
                  styles.checkCirculo,
                  { backgroundColor: paleta.primary },
                ]}
              >
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </View>
            ) : (
              <Circle size={20} color="#94A3B8" />
            )}
          </View>
        </View>
      </FondoCategoria>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  boton: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  fondo: {
    borderRadius: 20,
    width: '100%',
  },
  contenido: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconoBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    flex: 1,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  checkContenedor: {
    marginLeft: 'auto',
  },
  checkCirculo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

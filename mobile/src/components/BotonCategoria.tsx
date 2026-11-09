import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Texto as Text } from '@/components/Texto'
import { Check, Circle, Home, Package, Utensils, Car } from 'lucide-react-native'
import { FondoCategoria } from './FondoCategoria'
import { COLOR_CATEGORIAS, type CategoriaGasto } from '../theme/categorias'
import { usePaletaActual } from '@/theme/usePaletaActual'

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
  const tema = usePaletaActual()

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
          borderColor: elegida ? paleta.primary : tema.outline,
          borderWidth: elegida ? 2.5 : 1.5,
          backgroundColor: tema.surface,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <FondoCategoria
        categoria={categoria}
        overlayOpacity={elegida ? 0.72 : 0.84}
        overlayColor={tema.surface}
        style={styles.fondo}
      >
        <View style={styles.contenido}>
          {/* Badge con ícono */}
          <View
            style={[
              styles.iconoBadge,
              { backgroundColor: elegida ? paleta.primary : tema.subtle },
            ]}
          >
            <Icono
              size={18}
              color={elegida ? '#FFFFFF' : tema.textMuted}
            />
          </View>

          {/* Nombre de la categoría */}
          <Text
            style={[
              styles.texto,
              {
                fontWeight: elegida ? '700' : '600',
                color: tema.text,
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
              <Circle size={20} color={tema.outline} />
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

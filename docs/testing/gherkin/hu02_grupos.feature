# language: es

Característica: HU-02 Ver y crear grupos
  Como usuario autenticado
  quiero ver la lista de mis grupos y crear nuevos
  para organizar los gastos compartidos por contexto.

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @android
  Escenario: Ver lista de grupos con datos precargados
    Dado que el usuario inició sesión correctamente
    Y tiene grupos disponibles (Firestore o modo demo)
    Cuando navega al tab "Gastos"
    Entonces ve una lista con el nombre de cada grupo
    Y cada ítem muestra la cantidad de integrantes
    Y puede tocar cada ítem para ir al detalle

  @android
  Escenario: Ver estado vacío cuando no hay grupos
    Dado que el usuario inició sesión correctamente
    Y no tiene ningún grupo creado
    Cuando navega al tab "Gastos"
    Entonces ve el texto "Creá tu primer grupo para compartir los gastos de un viaje, la casa o una salida."
    Y ve el botón "Crear grupo"

  @android @requiere-firebase
  Escenario: Crear grupo con nombre, moneda y un amigo
    Dado que el usuario inició sesión correctamente
    Y tiene al menos un amigo aceptado en su lista
    Y está en la pantalla de lista de grupos
    Cuando toca "Crear grupo"
    Y ingresa el nombre "Viaje Bariloche"
    Y selecciona moneda "ARS"
    Y selecciona a un amigo de la lista
    Y toca "Crear grupo"
    Entonces es redirigido al detalle del grupo "Viaje Bariloche"
    Y el grupo tiene al menos 2 integrantes (usuario + amigo seleccionado)

  @android
  Escenario: Pull-to-refresh recarga la lista de grupos
    Dado que el usuario está en la lista de grupos con datos cargados
    Cuando desliza hacia abajo para refrescar
    Entonces la app vuelve a consultar los grupos desde Firestore o seeds
    Y actualiza la lista en pantalla

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @android
  Escenario: Intentar crear grupo sin nombre
    Dado que el usuario está en la pantalla "Crear grupo"
    Cuando deja el campo nombre vacío
    Y toca "Crear grupo"
    Entonces ve el mensaje de error "Ingresá un nombre para el grupo."
    Y permanece en la pantalla de creación

  @android @requiere-firebase
  Escenario: Error de red al cargar grupos
    Dado que el usuario inició sesión correctamente
    Y Firestore no está disponible (sin conexión o error de red)
    Cuando navega al tab "Gastos"
    Entonces ve el mensaje "No pudimos cargar tus grupos. Revisá la conexión y volvé a intentar."
    Y ve el botón "Volver a intentar"

  @android @requiere-firebase
  Escenario: Eliminar un grupo existente
    Dado que el usuario está en la lista de grupos con al menos un grupo
    Cuando toca el ícono de eliminar en un grupo
    Y confirma la acción en el diálogo de confirmación
    Entonces el grupo desaparece de la lista
    Y sus gastos también son eliminados de Firestore

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @android
  Escenario: Crear grupo con moneda USD y verificar símbolo en detalle
    Dado que el usuario está en la pantalla "Crear grupo"
    Cuando ingresa nombre "Compras en Miami"
    Y selecciona moneda "Dólares (USD)"
    Y toca "Crear grupo"
    Entonces en el detalle del grupo los montos se muestran con el símbolo "US$"
    # formatearMoneda usa MONEDAS[moneda].simbolo = 'US$'

# language: es

Característica: HU-04 Cargar, editar y eliminar gasto
  Como integrante de un grupo
  quiero cargar gastos con descripción, monto, categoría y participantes
  para llevar el registro compartido y calcular deudas correctamente.

  # Reglas de validarGasto.ts aplicadas en estos escenarios:
  # - Descripción: no vacía ni solo espacios
  # - Monto: regex ^\d+(?:[.,]\d{1,2})?$, valor > 0, <= MAX_SAFE_INTEGER/100
  # - Pagador: debe estar en miembros[] del grupo
  # - Participantes: al menos uno, todos deben ser miembros[]

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @android @requiere-firebase
  Escenario: Cargar gasto con datos mínimos válidos
    Dado que el usuario está en la pantalla "Cargar gasto" de un grupo
    Cuando ingresa descripción "Cena"
    Y ingresa monto "1500"
    Y selecciona categoría "Comida"
    Y selecciona pagador "Vos"
    Y mantiene todos los participantes seleccionados
    Y toca "Guardar gasto"
    Entonces vuelve al detalle del grupo
    Y el gasto "Cena" aparece en la lista con monto $1.500

  @android @hardware
  Escenario: Agregar foto del ticket desde la galería (opcional)
    Dado que el usuario está completando el formulario de gasto
    Y el formulario ya tiene descripción y monto válidos
    Cuando toca "Elegir foto"
    Y concede permiso de acceso a la galería
    Y selecciona una imagen
    Entonces la imagen se muestra en la tarjeta de foto
    Y al guardar el gasto, tieneFoto queda en true

  @android @hardware
  Escenario: Detectar ubicación GPS (opcional)
    Dado que el usuario está completando el formulario de gasto
    Cuando toca "Detectar mi ubicación GPS"
    Y concede permiso de geolocalización
    Entonces aparece la dirección o coordenadas debajo del botón
    Y al guardar el gasto, ubicacion.lat y ubicacion.lng quedan guardados

  @android @hardware
  Escenario: Marcar punto en el mapa y confirmar
    Dado que el usuario está en el formulario de gasto
    Cuando toca "Marcar en el mapa"
    Y se abre el modal MapaSelector con el mapa de OpenStreetMap
    Y toca un punto en el mapa
    Entonces aparece un marcador en ese punto
    Y el botón "Confirmar punto" se habilita
    Cuando toca "Confirmar punto"
    Entonces el modal se cierra
    Y las coordenadas aparecen en el campo de dirección del formulario

  @android
  Escenario: Editar gasto existente y cambiar monto
    Dado que el usuario está en el detalle de un grupo con un gasto de $1.500
    Cuando toca "Editar gasto" en ese gasto
    Y cambia el monto a "2000"
    Y toca "Guardar gasto"
    Entonces vuelve al detalle del grupo
    Y el gasto muestra el nuevo monto $2.000

  @android @requiere-firebase
  Escenario: Eliminar gasto desde pantalla de edición
    Dado que el usuario está editando un gasto existente
    Cuando toca "Eliminar este gasto"
    Y confirma la acción en el diálogo
    Entonces vuelve al detalle del grupo
    Y el gasto eliminado ya no aparece en la lista

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @android
  Escenario: Error al guardar con descripción vacía
    Dado que el usuario está en el formulario de gasto
    Cuando deja el campo "¿Qué compraste?" vacío
    Y toca "Guardar gasto"
    # validarGasto: !descripcion.trim() → error
    Entonces ve el mensaje de error "Ingresá una descripción."
    Y permanece en el formulario

  @android
  Escenario: Error al guardar con monto cero
    Dado que el usuario está en el formulario de gasto con descripción válida
    Cuando ingresa monto "0"
    Y toca "Guardar gasto"
    # validarGasto: valor <= 0 → error
    Entonces ve el mensaje de error "El monto debe ser mayor que cero y estar dentro del rango permitido."

  @android
  Escenario: Error con separador de miles en el monto
    Dado que el usuario está en el formulario de gasto
    Cuando ingresa monto "1.500"
    Y toca "Guardar gasto"
    # validarGasto: regex ^\d+(?:[.,]\d{1,2})?$ no acepta 1.500 (3 dígitos decimales)
    Entonces ve el mensaje de error "Ingresá un monto válido con hasta dos decimales."

  @android
  Escenario: Error con monto negativo
    Dado que el usuario está en el formulario de gasto
    Cuando ingresa monto "-50"
    Y toca "Guardar gasto"
    # validarGasto: regex no acepta el signo menos
    Entonces ve el mensaje de error "Ingresá un monto válido con hasta dos decimales."

  @android
  Escenario: Error al guardar sin ningún participante seleccionado
    Dado que el usuario está en el formulario de gasto con descripción y monto válidos
    Cuando destilda a todos los participantes de la sección "Dividir entre"
    Y toca "Guardar gasto"
    # validarGasto: !participantes.length → error
    Entonces ve el mensaje de error "Elegí al menos un participante del grupo."

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @android
  Escenario: Monto con coma decimal es aceptado
    Dado que el usuario está en el formulario de gasto
    Cuando ingresa monto "1500,50"
    Y completa los demás campos requeridos
    Y toca "Guardar gasto"
    # validarGasto: monto.trim().replace(',', '.') → 1500.50
    Entonces el gasto se guarda con monto 1500.50

  @android
  Escenario: Pagador fuera de los participantes del reparto es válido
    Dado que el usuario está en el formulario de gasto con 3 participantes
    Cuando selecciona al pagador "Lucas"
    Y en "Dividir entre" solo selecciona a "Ana" y "Ben" (sin Lucas)
    Y toca "Guardar gasto"
    # validarGasto: pagador no necesita estar en participantes, solo en miembros[]
    # deudasDelGrupo: si pagador no está en participantes, recibe el monto completo
    Entonces el gasto se guarda correctamente
    Y Lucas aparece como acreedor del monto total en las deudas

  @android @hardware
  Escenario: Permiso de cámara denegado muestra mensaje de error
    Dado que el usuario toca "Tomar foto" en el formulario de gasto
    Y deniega el permiso de cámara
    # ImagePicker.requestCameraPermissionsAsync().granted === false
    Entonces ve el mensaje de error "Permití el acceso a la cámara para tomar la foto."
    Y el formulario permanece con el resto de los campos intactos

  @android @hardware
  Escenario: Permiso de GPS denegado muestra mensaje de error
    Dado que el usuario toca "Detectar mi ubicación GPS" en el formulario de gasto
    Y deniega el permiso de geolocalización
    # Location.requestForegroundPermissionsAsync().granted === false
    Entonces ve el mensaje de error "Permití el acceso a la ubicación para detectar tu posición actual."
    Y la ubicación permanece sin datos en el formulario

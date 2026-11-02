# language: es
# version: 1.1
# fecha: 31/10/2026
# commit-probado: 2e3a5cb
# autor: Candela Sandoval

Característica: HU-04 Cargar, editar y eliminar gasto
  Como integrante de un grupo
  quiero cargar gastos con descripción, monto, categoría y participantes
  para llevar el registro compartido y calcular deudas correctamente.

  # - Descripción: no vacía ni solo espacios
  # - Monto: regex ^\d+(?:[.,]\d{1,2})?$, valor > 0, <= MAX_SAFE_INTEGER/100
  # - Pagador: debe estar en miembros[] del grupo
  # - Participantes: al menos uno, todos deben ser miembros[]

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @HU-04 @TC-HU04-001 @alta @humo @android @requiere-firebase
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

  @HU-04 @TC-HU04-002 @media @funcional @android @hardware
  Escenario: Agregar foto del ticket desde la galería (opcional)
    Dado que el usuario está completando el formulario de gasto
    Y el formulario ya tiene descripción y monto válidos
    Cuando toca "Elegir foto"
    Y concede permiso de acceso a la galería
    Y selecciona una imagen
    Entonces la imagen se muestra en la tarjeta de foto
    Y al guardar el gasto, tieneFoto queda en true

  @HU-04 @TC-HU04-003 @media @funcional @android @hardware
  Escenario: Detectar ubicación GPS (opcional)
    Dado que el usuario está completando el formulario de gasto
    Cuando toca "Detectar mi ubicación GPS"
    Y concede permiso de geolocalización
    Entonces aparece la dirección o coordenadas debajo del botón
    Y al guardar el gasto, ubicacion.lat y ubicacion.lng quedan guardados

  @HU-04 @TC-HU04-004 @media @funcional @android @hardware
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

  @HU-04 @TC-HU04-005 @alta @funcional @android
  Escenario: Editar gasto existente y cambiar monto
    Dado que el usuario está en el detalle de un grupo con un gasto de $1.500
    Cuando toca "Editar gasto" en ese gasto
    Y cambia el monto a "2000"
    Y toca "Guardar gasto"
    Entonces vuelve al detalle del grupo
    Y el gasto muestra el nuevo monto $2.000

  @HU-04 @TC-HU04-006 @alta @funcional @android @requiere-firebase
  Escenario: Eliminar gasto desde pantalla de edición
    Dado que el usuario está editando un gasto existente
    Cuando toca "Eliminar este gasto"
    Y confirma la acción en el diálogo
    Entonces vuelve al detalle del grupo
    Y el gasto eliminado ya no aparece en la lista

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @HU-04 @TC-HU04-007 @alta @negativo @android
  Escenario: Error al guardar con descripción vacía
    Dado que el usuario está en el formulario de gasto
    Cuando deja el campo "¿Qué compraste?" vacío
    Y toca "Guardar gasto"
    Entonces ve el mensaje de error "Ingresá una descripción."
    Y permanece en el formulario

  @HU-04 @TC-HU04-008 @alta @negativo @android
  Escenario: Error al guardar con monto cero
    Dado que el usuario está en el formulario de gasto con descripción válida
    Cuando ingresa monto "0"
    Y toca "Guardar gasto"
    Entonces ve el mensaje de error "El monto debe ser mayor que cero y estar dentro del rango permitido."

  @HU-04 @TC-HU04-009 @alta @negativo @android
  Escenario: Error con separador de miles en el monto
    Dado que el usuario está en el formulario de gasto
    Cuando ingresa monto "1.500"
    Y toca "Guardar gasto"
    Entonces ve el mensaje de error "Ingresá un monto válido con hasta dos decimales."

  @HU-04 @TC-HU04-010 @alta @negativo @android
  Escenario: Error con monto negativo
    Dado que el usuario está en el formulario de gasto
    Cuando ingresa monto "-50"
    Y toca "Guardar gasto"
    Entonces ve el mensaje de error "Ingresá un monto válido con hasta dos decimales."

  @HU-04 @TC-HU04-011 @alta @negativo @android
  Escenario: Error al guardar sin ningún participante seleccionado
    Dado que el usuario está en el formulario de gasto con descripción y monto válidos
    Cuando destilda a todos los participantes de la sección "Dividir entre"
    Y toca "Guardar gasto"
    Entonces ve el mensaje de error "Elegí al menos un participante del grupo."

  @HU-04 @TC-HU04-012 @media @negativo @android
  Escenario: Error con monto de 3 decimales
    Dado que el usuario está en el formulario de gasto
    Cuando ingresa monto "1500,999"
    Y toca "Guardar gasto"
    Entonces ve el mensaje de error "Ingresá un monto válido con hasta dos decimales."

  @HU-04 @TC-HU04-013 @media @negativo @android
  Escenario: Error con monto alfanumérico
    Dado que el usuario está en el formulario de gasto
    Cuando ingresa monto "abc"
    Y toca "Guardar gasto"
    Entonces ve el mensaje de error "Ingresá un monto válido con hasta dos decimales."

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @HU-04 @TC-HU04-014 @alta @borde @android
  Escenario: Monto con coma decimal es aceptado
    Dado que el usuario está en el formulario de gasto
    Cuando ingresa monto "1500,50"
    Y completa los demás campos requeridos
    Y toca "Guardar gasto"
    Entonces el gasto se guarda con monto 1500.50

  @HU-04 @TC-HU04-015 @alta @borde @android
  Escenario: Pagador fuera de los participantes del reparto es válido
    Dado que el usuario está en el formulario de gasto con 3 participantes
    Cuando selecciona al pagador "Lucas"
    Y en "Dividir entre" solo selecciona a "Ana" y "Ben" (sin Lucas)
    Y toca "Guardar gasto"
    Entonces el gasto se guarda correctamente
    Y Lucas aparece como acreedor del monto total en las deudas

  @HU-04 @TC-HU04-016 @media @borde @android
  Escenario: Monto mínimo válido 0.01 es aceptado
    Dado que el usuario está en el formulario de gasto
    Cuando ingresa monto "0,01"
    Y completa los demás campos requeridos
    Y toca "Guardar gasto"
    Entonces el gasto se guarda correctamente con monto 0.01

  @HU-04 @TC-HU04-017 @media @borde @android
  Escenario: Monto entero simple 1 es aceptado
    Dado que el usuario está en el formulario de gasto
    Cuando ingresa monto "1"
    Y completa los demás campos requeridos
    Y toca "Guardar gasto"
    Entonces el gasto se guarda correctamente con monto 1

  @HU-04 @TC-HU04-018 @media @borde @android
  Escenario: Monto grande 999999.99 es aceptado
    Dado que el usuario está en el formulario de gasto
    Cuando ingresa monto "999999,99"
    Y completa los demás campos requeridos
    Y toca "Guardar gasto"
    Entonces el gasto se guarda correctamente con monto 999999.99

  @HU-04 @TC-HU04-019 @media @borde @android @hardware
  Escenario: Permiso de cámara denegado muestra mensaje de error
    Dado que el usuario toca "Tomar foto" en el formulario de gasto
    Y deniega el permiso de cámara
    Entonces ve el mensaje de error "Permití el acceso a la cámara para tomar la foto."
    Y el formulario permanece con el resto de los campos intactos

  @HU-04 @TC-HU04-020 @media @borde @android @hardware
  Escenario: Permiso de GPS denegado muestra mensaje de error
    Dado que el usuario toca "Detectar mi ubicación GPS" en el formulario de gasto
    Y deniega el permiso de geolocalización
    Entonces ve el mensaje de error "Permití el acceso a la ubicación para detectar tu posición actual."
    Y la ubicación permanece sin datos en el formulario

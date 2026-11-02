# language: es
# version: 1.1
# fecha: 31/10/2026
# commit-probado: 2e3a5cb
# autor: Candela Sandoval

Característica: HU-07 Editar perfil y ver cotización del dólar
  Como usuario autenticado
  quiero editar mi alias y descripción y consultar la cotización del dólar
  para configurar cómo me ven mis compañeros al saldar deudas y tener referencia de cambio.

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @HU-07 @TC-HU07-001 @alta @funcional @android
  Escenario: Guardar alias y descripción correctamente
    Dado que el usuario está en el tab "Perfil"
    Cuando edita el campo alias a "german.mp"
    Y edita el campo descripción a "Pagador del grupo"
    Y toca "Guardar cambios"
    Entonces ve el mensaje de confirmación "Perfil guardado."
    Y el nuevo alias queda guardado en Firestore y en el store local

  @HU-07 @TC-HU07-002 @media @funcional @android
  Escenario: Cotización del dólar carga correctamente
    Dado que el usuario está en el tab "Perfil"
    Y el dispositivo tiene conexión a internet
    Cuando la pantalla termina de cargar
    # obtenerCotizacionesDolar() consulta dolarapi.com/v1/dolares
    Entonces ve los tipos "Blue", "Oficial", "Bolsa" y "Tarjeta"
    Y cada tipo muestra los valores de compra y venta
    Y la fecha de actualización aparece en formato "DD/MM/AAAA a las HH:MM hs"

  @HU-07 @TC-HU07-003 @baja @funcional @android
  Escenario: Actualizar cotización manualmente con el botón de refresh
    Dado que el usuario está en el tab "Perfil" con la cotización ya cargada
    Cuando toca el botón de actualizar cotización
    Entonces se vuelve a consultar dolarapi.com
    Y la cotización se actualiza con los datos más recientes

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @HU-07 @TC-HU07-004 @media @negativo @android
  Escenario: Error de red al cargar la cotización del dólar
    Dado que el dispositivo no tiene conexión a internet
    Cuando el usuario abre el tab "Perfil"
    Entonces ve el mensaje "No pudimos actualizar la cotización."
    Y ve el botón "Reintentar"
    Y el resto del perfil (alias, descripción) sigue disponible para editar

  @HU-07 @TC-HU07-005 @alta @negativo @android @requiere-firebase
  Escenario: Error de red al guardar el perfil
    Dado que Firestore no está disponible al intentar guardar
    Cuando el usuario toca "Guardar cambios"
    # upsertUsuarioPerfil lanza excepción
    Entonces ve el mensaje de error "No pudimos guardar el perfil. Tus datos anteriores se conservan; volvé a intentar."
    Y el store local NO se actualiza con los valores nuevos (actualizarAlias solo se llama tras éxito)

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @HU-07 @TC-HU07-006 @media @borde @android
  Escenario: Alias vacío es aceptado por el formulario
    Dado que el usuario está en el tab "Perfil"
    Cuando borra el contenido del campo alias dejándolo vacío
    Y toca "Guardar cambios"
    # No hay validación de alias obligatorio; upsertUsuarioPerfil guarda alias: ''
    Entonces el perfil se guarda sin errores de validación
    Y el alias queda vacío en Firestore

  @HU-07 @TC-HU07-007 @media @borde @android
  Escenario: Descripción de exactamente 160 caracteres es aceptada
    Dado que el usuario está editando su descripción
    Cuando ingresa exactamente 160 caracteres en el campo descripción
    Entonces el contador muestra "160/160"
    Y el campo acepta el texto sin truncarlo

  @HU-07 @TC-HU07-008 @baja @borde @android
  Escenario: Los campos se recargan al volver al tab Perfil
    Dado que el usuario guardó cambios en el perfil y luego navegó a otro tab
    Cuando vuelve al tab "Perfil"
    Entonces los campos muestran los valores guardados más recientes, no los del borrador

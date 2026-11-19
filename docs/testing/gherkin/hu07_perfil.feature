# language: es
# version: 1.2
# fecha: 13/11/2026
# commit-referencia: f8266c083b31aad0924ea5dcf729436012eef103
# autor: Candela Sandoval

Característica: HU-07 Perfil y cotización del dólar
  Como usuario autenticado
  quiero editar mi perfil y ver la cotización del dólar y las equivalencias en pesos
  para pagar y registrar gastos con la información correcta.

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @HU-07 @TC-HU07-001 @alta @funcional @android @web @RF-13
  Escenario: Guardar alias y descripción correctamente
    Dado que el usuario está en el tab "Perfil"
    Cuando edita el campo alias a "manzana.test.mp"
    Y edita el campo descripción a "Pagador del grupo"
    Y toca "Guardar cambios"
    Entonces ve el mensaje de confirmación "Perfil guardado."
    Y el nuevo alias queda guardado en Firestore y en el store local

  @HU-07 @TC-HU07-002 @media @funcional @android @web @RF-13
  Escenario: Cotización del dólar carga correctamente
    Dado que el usuario está en el tab "Perfil"
    Y el dispositivo tiene conexión a internet
    Cuando la pantalla termina de cargar
    Entonces ve los tipos "Blue", "Oficial", "Bolsa" y "Tarjeta"
    Y cada tipo muestra los valores de compra y venta
    Y la fecha de actualización aparece en formato "DD/MM/AAAA a las HH:MM hs"

  @HU-07 @TC-HU07-003 @baja @funcional @android @web @RF-13 @DEF-003 @falla-conocida
  Escenario: Actualizar cotización manualmente con el botón de refresh
    Dado que el usuario está en el tab "Perfil" con la cotización ya cargada
    Cuando toca el botón de actualizar cotización
    Entonces se vuelve a consultar dolarapi.com
    Y la cotización se actualiza con los datos más recientes

  @HU-07 @TC-HU07-009 @media @funcional @android @web @RF-14
  Escenario: Ver equivalencia en pesos para monto USD
    Dado que hay una cotización válida de venta del dólar oficial
    Y el grupo está configurado en USD
    Cuando abre el detalle del grupo con gasto o deuda
    Entonces ve equivalencia aproximada calculada con precio de venta e identificada como dólar oficial

  @HU-07 @TC-HU07-010 @media @funcional @android @web @RF-14
  Escenario: Ver equivalencia en pesos para monto BRL
    Dado que hay una cotización válida de venta del real brasileño
    Y el grupo está configurado en BRL
    Cuando abre el detalle del grupo con gasto o deuda
    Entonces ve equivalencia aproximada calculada con precio de venta e identificada como real brasileño

  @HU-07 @TC-HU07-012 @media @funcional @requiere-inspeccion-de-red @android @web @RF-14 @RNF-05
  Escenario: Reutilizar cotización vigente y renovar la vencida
    Dado que hay una cotización guardada con timestamp controlable
    Y el grupo está en USD o BRL
    Cuando abre el grupo con cotización de menos de 6 h
    Y verifica que no se repita la consulta
    Y abre con cotización mayor a 6 h
    Entonces la cotización de menos de 6 h se reutiliza
    Y la vencida dispara una nueva consulta y se usa la nueva respuesta

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @HU-07 @TC-HU07-004 @media @negativo @android @web @RF-13
  Escenario: Error de red al cargar la cotización del dólar
    Dado que el dispositivo no tiene conexión a internet
    Cuando el usuario abre el tab "Perfil"
    Entonces ve el mensaje "No pudimos actualizar la cotización."
    Y ve el botón "Reintentar"
    Y el resto del perfil (alias, descripción) sigue disponible para editar

  @HU-07 @TC-HU07-005 @alta @negativo @requiere-firebase @android @web @RF-13
  Escenario: Error de red al guardar el perfil
    Dado que Firestore no está disponible al intentar guardar
    Cuando el usuario toca "Guardar cambios"
    # actualizarAlias solo se llama tras éxito
    Entonces ve el mensaje de error "No pudimos guardar el perfil. Tus datos anteriores se conservan; volvé a intentar."
    Y el store local NO se actualiza con los valores nuevos

  @HU-07 @TC-HU07-013 @media @negativo @hardware @android @web @RF-14 @RNF-05
  Escenario: Fallo de cotización no bloquea detalle de grupo
    Dado que hay un grupo USD o BRL sin cotización válida guardada
    Y la consulta de red falla o supera 10 s
    Cuando abre el detalle del grupo
    Entonces el detalle, gastos y deudas siguen disponibles
    Y no se muestra equivalencia calculada con datos inválidos

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @HU-07 @TC-HU07-006 @media @borde @android @web @RF-13
  Escenario: Alias vacío es aceptado por el formulario
    Dado que el usuario está en el tab "Perfil"
    Cuando borra el contenido del campo alias dejándolo vacío
    Y toca "Guardar cambios"
    Entonces el perfil se guarda sin errores de validación
    Y el alias queda vacío en Firestore

  @HU-07 @TC-HU07-007 @media @borde @android @web @RF-13
  Escenario: Descripción de exactamente 160 caracteres es aceptada
    Dado que el usuario está editando su descripción
    Cuando ingresa exactamente 160 caracteres en el campo descripción
    Entonces el contador muestra "160/160"
    Y el campo acepta el texto sin truncarlo

  @HU-07 @TC-HU07-008 @baja @borde @android @web @RF-13
  Escenario: Los campos se recargan al volver al tab Perfil
    Dado que el usuario guardó cambios en el perfil y luego navegó a otro tab
    Cuando vuelve al tab "Perfil"
    Entonces los campos muestran los valores guardados más recientes, no los del borrador

  @HU-07 @TC-HU07-011 @baja @borde @android @web @RF-14
  Escenario: No mostrar equivalencia adicional para moneda ARS
    Dado que el grupo está configurado en ARS con gastos o deuda
    Cuando abre el detalle del grupo
    Entonces ve el monto en ARS sin una segunda línea de equivalencia en pesos


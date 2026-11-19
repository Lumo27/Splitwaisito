
# commit-referencia: f8266c083b31aad0924ea5dcf729436012eef103
# autor: Candela Sandoval

Característica: HU-05 Saldar deuda
  Como usuario que tiene una deuda pendiente en un grupo
  quiero ver el monto exacto que debo, copiar el alias del acreedor (o su e-mail) y adjuntar el comprobante
  para saldar la deuda sin tener que buscar los datos del acreedor.
  La app no mueve dinero ni abre Mercado Pago: la transferencia se hace desde un banco o billetera externa.

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @HU-05 @TC-HU05-001 @alta @humo @android @hardware @RF-09
  Escenario: Abrir Saldar deuda y ver los datos de la deuda
    Dado que el usuario debe una transferencia en un grupo
    Y el acreedor no tiene alias y sí tiene e-mail registrado
    Cuando navega a la pantalla "Saldar deuda" desde el detalle del grupo
    Entonces ve el nombre y el monto de la deuda
    Y el e-mail se copia automáticamente como dato para transferir
    Y ve la confirmación "E-mail copiado."

  @HU-05 @TC-HU05-002 @alta @funcional @android @web @RF-18
  Escenario: La app no inicia transferencias ni abre Mercado Pago
    # RF-18 está retirado: la integración con Mercado Pago no está implementada
    Dado que el usuario está en la pantalla "Saldar deuda" con una deuda válida
    Cuando abre Saldar deuda y observa las opciones disponibles
    Entonces ve instrucciones para transferir desde un banco o billetera externa
    Y no hay ningún botón que abra Mercado Pago
    Y no se registra un pago hasta adjuntar el comprobante

  @HU-05 @TC-HU05-003 @media @funcional @android @hardware @RF-09
  Escenario: Copiar el monto al portapapeles
    Dado que el usuario está en la pantalla "Saldar deuda"
    Cuando toca "Copiar monto"
    Entonces el monto de la deuda se copia al portapapeles
    Y aparece el mensaje "Monto copiado."

  @HU-05 @TC-HU05-004 @media @funcional @android @hardware @falla-conocida @RF-09
  Escenario: Copiar el alias manualmente
    Dado que el usuario está en "Saldar deuda" y el acreedor tiene alias
    Cuando toca "Copiar alias"
    Entonces el alias se copia al portapapeles
    Y aparece el mensaje "Alias copiado."
    # caso fallido (DEF-005): solo se muestra el e-mail del acreedor, no se copia el alias y no aparece "Alias copiado"

  @HU-05 @TC-HU05-009 @alta @funcional @android @hardware @falla-conocida @RF-09
  Escenario: Priorizar alias cuando el acreedor también tiene e-mail
    Dado que el acreedor tiene alias y e-mail registrados
    Y el usuario debe una transferencia
    Cuando abre "Saldar deuda"
    Y observa el dato copiado
    Y toca "Copiar alias"
    Entonces se copia el alias al abrir la pantalla y aparece "Alias copiado."
    Y el botón permite copiarlo otra vez
    # caso fallido (DEF-005): solo se muestra el e-mail y "Copiar alias" aparece sin valor; no se prioriza el alias

  @HU-05 @TC-HU05-010 @alta @funcional @android @web @requiere-firebase-ai-logic @RF-10
  Escenario: Comprobante coincidente aprueba automáticamente el pago
    Dado que hay una deuda válida y Firebase AI Logic está disponible
    Y el comprobante es reciente y su destinatario o alias, monto y fecha coinciden
    Cuando adjunta el comprobante
    Y toca "Registrar pago con comprobante"
    Entonces el pago queda aprobado
    Y la deuda se salda por el monto transferido
    Y el comprobante se asocia al pago

  @HU-05 @TC-HU05-013 @media @funcional @android @hardware @RF-12
  Escenario: Programar recordatorio local de pago
    Dado que hay una deuda pendiente
    Y la app corre en un dispositivo móvil con permiso de notificaciones concedido
    Cuando toca "Recordarme pagar más tarde"
    Y espera el plazo del modo activo
    Entonces se programa el recordatorio
    Y se recibe una notificación con monto, acreedor y grupo al plazo configurado

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @HU-05 @TC-HU05-005 @alta @negativo @android @web @requiere-firebase @RF-09
  Escenario: Deuda ya saldada al llegar a la pantalla
    Dado que otro integrante eliminó los gastos del grupo antes de que el usuario navegara a Saldar deuda
    Cuando la pantalla termina de cargar los datos actualizados
    # deudasDelGrupo recalcula y la deuda (de, a) ya no existe
    Entonces ve el mensaje "Esta transferencia ya no está pendiente. Volvé al grupo para consultar el saldo actualizado."
    Y ve el botón "Volver al grupo"

  @HU-05 @TC-HU05-006 @media @negativo @android @web @RF-09
  Escenario: Sin alias ni e-mail se deshabilita la copia del alias
    # observación (OBS-003): no se puede armar la precondición, porque todo usuario registrado tiene e-mail de login y la app lo usa como dato de transferencia
    Dado que el acreedor no tiene alias ni e-mail guardados
    Y el usuario abre "Saldar deuda"
    Entonces ve el texto "No tenemos el alias ni el e-mail del acreedor. Pedíselos antes de transferir."
    Y el botón "Copiar alias" está deshabilitado

  @HU-05 @TC-HU05-007 @alta @negativo @android @web @requiere-firebase @RF-09
  Escenario: Error de red al cargar la deuda
    Dado que Firestore no está disponible al abrir la pantalla "Saldar deuda"
    Cuando la pantalla intenta cargar el grupo y los gastos
    Entonces ve un spinner mientras carga
    Y luego ve un mensaje de error
    Y ve los botones "Volver al grupo" y "Actualizar"

  @HU-05 @TC-HU05-011 @alta @negativo @android @web @requiere-firebase-ai-logic @RF-10
  Escenario: Comprobante con datos distintos queda pendiente
    Dado que hay una deuda válida y Firebase AI Logic está disponible
    Y el comprobante tiene un monto o un destinatario distinto
    Cuando adjunta el comprobante
    Y toca "Registrar pago con comprobante"
    Entonces el pago queda pendiente de aprobación
    Y la deuda sigue pendiente
    Y el acreedor puede revisar el comprobante

  @HU-05 @TC-HU05-012 @media @negativo @android @web @requiere-firebase-ai-logic @RF-10
  Escenario: IA no disponible deja el pago para revisión manual
    Dado que hay una deuda válida y Firebase AI Logic no está disponible
    Y el usuario adjuntó un comprobante
    Cuando toca "Registrar pago con comprobante"
    Entonces el pago queda pendiente de aprobación
    Y no salda la deuda hasta la revisión del acreedor
    Y el comprobante queda visible para el acreedor con las opciones "Aprobar: recibí el dinero" y "Rechazar"
    # el texto que se muestra es "No se pudo verificar automáticamente", no "IA no disponible"

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @HU-05 @TC-HU05-008 @alta @borde @android @web @RF-09
  Escenario: Intentar acceder a Saldar deuda de una deuda ajena
    Dado que el usuario navega manualmente a /grupos/[id]/saldar con parámetro de=otroUsuarioId
    Y de !== usuarioId actual
    # SaldarDeudaScreen: if (de !== usuarioId) throw new Error(...)
    Cuando la pantalla termina de cargar
    Entonces ve el mensaje de error "Elegí una deuda tuya desde el detalle del grupo."
    Y ve el botón "Volver al grupo"
    # además se muestra el botón "Actualizar", no previsto en el caso

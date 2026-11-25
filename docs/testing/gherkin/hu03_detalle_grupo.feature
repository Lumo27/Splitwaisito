# commit-referencia: f8266c083b31aad0924ea5dcf729436012eef103
# autor: Candela Sandoval

Característica: HU-03 Ver detalle de grupo, gastos y deudas
  Como integrante de un grupo
  quiero ver el detalle del grupo con gastos y deudas simplificadas
  para saber quién debe qué sin tener que calcular manualmente.

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @HU-03 @TC-HU03-001 @alta @humo @android @web @RF-04
  Escenario: Ver total, gastos ordenados y deudas simplificadas
    Dado que el usuario es integrante de un grupo con 3 gastos
    Cuando abre el detalle de ese grupo
    Entonces ve el total sumado de todos los gastos
    Y los gastos aparecen ordenados por fecha descendente
    Y ve la sección "Deudas" con el importe de cada transferencia pendiente

  @HU-03 @TC-HU03-002 @alta @funcional @android @web @RF-04
  Escenario: Deuda respeta participantes por gasto (no divide entre todos)
    Dado que el grupo tiene 3 integrantes (A, B y C)
    Y existe un gasto de $120 pagado por A con participantes=[A, B]
    Cuando abre el detalle del grupo
    Entonces la deuda calculada es "B le debe $60 a A"
    Y C no aparece como deudor en ese gasto

  @HU-03 @TC-HU03-003 @alta @funcional @android @web @RF-04 @RF-12
  Escenario: Botones de acción correctos según rol en cada deuda
    Dado que el usuario es deudor en una transferencia y acreedor en otra
    Cuando abre el detalle del grupo
    Entonces en la deuda donde es deudor ve el botón "Saldar deuda"
    Y en la deuda donde es acreedor ve el botón "Recordar a [nombre del deudor]"

  @HU-03 @TC-HU03-004 @media @funcional @android @hardware @RF-12
  Escenario: Recordar deuda por WhatsApp
    Dado que el usuario es acreedor de una deuda pendiente
    Y WhatsApp está instalado en el dispositivo
    Cuando toca "Recordar a [nombre]"
    Y en el diálogo de confirmación elige "Abrir WhatsApp"
    Entonces se abre WhatsApp con un mensaje prellenado que incluye el nombre del deudor, el monto y el nombre del grupo

  @HU-03 @TC-HU03-005 @media @funcional @android @hardware @RF-12
  Escenario: Recordar deuda por email
    Dado que el usuario es acreedor de una deuda pendiente
    Y el deudor tiene email registrado en el grupo
    Cuando toca "Recordar a [nombre]"
    Y en el diálogo de confirmación elige "Por E-mail"
    Entonces se abre el cliente de correo con destinatario, asunto y cuerpo prellenados

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @HU-03 @TC-HU03-006 @alta @negativo @android @web @requiere-firebase @RF-04
  Escenario: Error de red al cargar el detalle del grupo
    Dado que el usuario navega al detalle de un grupo
    Y Firestore no está disponible
    Cuando la pantalla intenta cargar datos
    Entonces ve un spinner mientras carga
    Y luego ve el mensaje "No pudimos cargar el grupo. Revisá la conexión y volvé a intentar."
    Y ve el botón "Volver a intentar"

  @HU-03 @TC-HU03-007 @alta @negativo @android @web @requiere-firebase @RF-04
  Escenario: Usuario que ya no es integrante del grupo
    Dado que el usuario fue removido de un grupo (su uid no está en miembros[])
    Cuando intenta acceder al detalle de ese grupo
    Entonces ve el mensaje "Este grupo no está disponible o ya no sos integrante."
    # caso bloqueado (OBS-004): el detalle del grupo no ofrece eliminar integrantes, no se puede armar la precondición

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @HU-03 @TC-HU03-008 @media @borde @android @web @demo @RF-04
  Escenario: Grupo sin gastos muestra estado vacío y deudas saldadas
    Dado que el usuario abre el detalle de un grupo que no tiene gastos
    Entonces ve el texto "Todavía no hay gastos. Cargá el primero para empezar."
    Y en la sección de deudas ve "Todo está saldado. No hay transferencias pendientes."
    Y en "Gastos por categoría" ve el mensaje "Todavía no hay gastos para mostrar"
    Y el total del grupo es "$0"

  @HU-03 @TC-HU03-009 @baja @borde @android @web @RF-04
  Escenario: Gráfico muestra 0% y $0 para categorías sin gastos
    Dado que el grupo solo tiene gastos de categoría "Comida"
    Cuando abre el detalle del grupo
    Entonces el gráfico muestra "Comida" con 100% del total
    Y las categorías "Transporte", "Alojamiento" y "Otro" aparecen con $0 y 0%
    # resumirGastosPorCategoria incluye todas las categorías aunque sean 0

  @HU-03 @TC-HU03-010 @alta @funcional @android @RF-04
  Escenario: Los pagos no se suman al total ni al gráfico de gastos
    Dado que el grupo tiene un gasto de $120 y movimientos de pago aprobados, pendientes y rechazados
    Cuando abre el detalle del grupo
    Entonces el total y el gráfico contabilizan solo el gasto de $120
    Y los movimientos de pago aparecen separados en "Pagos registrados" con su estado

  @HU-03 @TC-HU03-011 @alta @funcional @android @RF-04
  Escenario: Un pago aprobado compensa la deuda
    Dado que B debe $60 a A y hay un pago aprobado de B a A por $60
    Cuando abre el detalle del grupo
    Entonces la transferencia ya no aparece como deuda pendiente
    Y el pago figura como "Aprobado" en "Pagos registrados"

  @HU-03 @TC-HU03-012 @alta @funcional @android @RF-04
  Escenario: Pagos pendientes o rechazados no compensan la deuda
    Dado que B debe $60 a A y hay un pago pendiente o rechazado por ese monto
    Cuando abre el detalle del grupo
    Entonces B todavía debe $60 a A
    Y el pago muestra su estado pendiente o rechazado en "Pagos registrados"

  @HU-03 @TC-HU03-013 @alta @funcional @android @requiere-firebase @RF-04 @RF-11
  Escenario: El acreedor revisa y aprueba un comprobante pendiente
    Dado que A es el acreedor de un pago pendiente de B y el movimiento tiene comprobante
    Cuando A abre el detalle de ese pago
    Entonces ve el comprobante y las opciones "Aprobar: recibí el dinero" y "Rechazar"
    Cuando toca "Aprobar: recibí el dinero"
    Entonces el pago queda aprobado
    Y la deuda de B a A se reduce por el monto del pago

  @HU-03 @TC-HU03-014 @alta @funcional @android @requiere-firebase @RF-04 @RF-11
  Escenario: El acreedor rechaza un comprobante pendiente
    Dado que A es el acreedor de un pago pendiente de B
    Cuando A abre el detalle del pago y toca "Rechazar"
    Entonces el pago queda rechazado
    Y la deuda de B a A no se reduce

  @HU-03 @TC-HU03-015 @media @funcional @android @RF-04 @RF-11
  Escenario: Deshacer un pago aprobado restaura la deuda
    Dado que hay un pago aprobado de B a A que compensa una deuda
    Cuando desde el detalle del grupo toca "Deshacer" en ese pago y confirma
    Entonces el pago y su comprobante dejan de aparecer en el grupo
    Y la deuda de B a A vuelve a calcularse como pendiente


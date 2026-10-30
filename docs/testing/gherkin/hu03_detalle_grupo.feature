# language: es

Característica: HU-03 Ver detalle de grupo, gastos y deudas
  Como integrante de un grupo
  quiero ver el detalle del grupo con gastos y deudas simplificadas
  para saber quién debe qué sin tener que calcular manualmente.

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @android
  Escenario: Ver total, gastos ordenados y deudas simplificadas
    Dado que el usuario es integrante de un grupo con 3 gastos
    Cuando abre el detalle de ese grupo
    Entonces ve el total sumado de todos los gastos
    Y los gastos aparecen ordenados por fecha descendente
    Y ve la sección "Deudas simplificadas" con las transferencias mínimas necesarias
    # deudasDelGrupo.ts aplica el algoritmo mayor-deudor-paga-mayor-acreedor

  @android
  Escenario: Deuda respeta participantes por gasto (no divide entre todos)
    Dado que el grupo tiene 3 integrantes (A, B y C)
    Y existe un gasto de $120 pagado por A con participantes=[A, B]
    # deudasDelGrupo.ts filtra por gasto.participantes cuando existe
    Cuando abre el detalle del grupo
    Entonces la deuda calculada es "B le debe $60 a A"
    Y C no aparece como deudor en ese gasto

  @android
  Escenario: Botones de acción correctos según rol en cada deuda
    Dado que el usuario es deudor en una transferencia y acreedor en otra
    Cuando abre el detalle del grupo
    Entonces en la deuda donde es deudor ve el botón "Saldar deuda"
    Y en la deuda donde es acreedor ve el botón "Recordar a [nombre del deudor]"

  @android @hardware
  Escenario: Recordar deuda por WhatsApp
    Dado que el usuario es acreedor de una deuda pendiente
    Y WhatsApp está instalado en el dispositivo
    Cuando toca "Recordar a [nombre]"
    Y en el diálogo de confirmación elige "Abrir WhatsApp"
    # Linking.openURL('https://wa.me/?text=...')
    Entonces se abre WhatsApp con un mensaje prellenado que incluye el nombre del deudor, el monto y el nombre del grupo

  @android @hardware
  Escenario: Recordar deuda por email
    Dado que el usuario es acreedor de una deuda pendiente
    Y el deudor tiene email registrado en el grupo
    Cuando toca "Recordar a [nombre]"
    Y en el diálogo de confirmación elige "Por E-mail"
    # Linking.openURL('mailto:...')
    Entonces se abre el cliente de correo con destinatario, asunto y cuerpo prellenados

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @android @requiere-firebase
  Escenario: Error de red al cargar el detalle del grupo
    Dado que el usuario navega al detalle de un grupo
    Y Firestore no está disponible
    Cuando la pantalla intenta cargar datos
    Entonces ve un spinner mientras carga
    Y luego ve el mensaje "No pudimos cargar el grupo. Revisá la conexión y volvé a intentar."
    Y ve el botón "Volver a intentar"

  @android @requiere-firebase
  Escenario: Usuario que ya no es integrante del grupo
    Dado que el usuario fue removido de un grupo (su uid no está en miembros[])
    Cuando intenta acceder al detalle de ese grupo
    Entonces ve el mensaje "Este grupo no está disponible o ya no sos integrante."

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @android
  Escenario: Grupo sin gastos muestra estado vacío y deudas saldadas
    Dado que el usuario abre el detalle de un grupo que no tiene gastos
    Entonces ve el texto "Todavía no hay gastos. Cargá el primero para empezar."
    Y en la sección de deudas ve "Todo está saldado. No hay transferencias pendientes."
    Y el total del grupo es "$0"

  @android
  Escenario: Gráfico muestra 0% y $0 para categorías sin gastos
    Dado que el grupo solo tiene gastos de categoría "Comida"
    Cuando abre el detalle del grupo
    Entonces el gráfico muestra "Comida" con 100% del total
    Y las categorías "Transporte", "Alojamiento" y "Otro" aparecen con $0 y 0%
    # resumirGastosPorCategoria incluye todas las categorías aunque sean 0

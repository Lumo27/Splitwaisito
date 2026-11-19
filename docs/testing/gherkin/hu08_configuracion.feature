# language: es
# version: 1.2
# fecha: 13/11/2026
# commit-referencia: f8266c083b31aad0924ea5dcf729436012eef103
# autor: Candela Sandoval

Característica: HU-08 Configuración y cierre de sesión
  Como usuario autenticado
  quiero cerrar sesión, restablecer los datos de ejemplo y ver la ayuda contextual
  para controlar mi sesión y el modo de la app.

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @HU-08 @TC-HU08-001 @alta @funcional @android @web @RF-15
  Escenario: Cerrar sesión correctamente
    Dado que el usuario está autenticado en Firebase
    Y está en el tab "Configuración"
    Cuando toca "Cerrar sesión"
    Y confirma la acción en el Alert ("Salir")
    Entonces es redirigido a la pantalla de login
    Y el botón Atrás no lleva de vuelta a la app autenticada

  @HU-08 @TC-HU08-002 @alta @funcional @android @web @RF-15
  Escenario: Restablecer datos de ejemplo en modo demo
    Dado que la app corre con MODO_SEEDS=true
    Y el usuario está en el tab "Configuración"
    Cuando toca "Restablecer datos de ejemplo"
    Y confirma la acción en el Alert
    Entonces los grupos, gastos, amigos y perfil vuelven al estado inicial del seed
    Y es redirigido al tab "Gastos"

  @HU-08 @TC-HU08-008 @baja @funcional @android @web @RF-16 @RNF-01
  Escenario: Recorrer y cerrar ayuda contextual
    Dado que el usuario está autenticado en el detalle de un grupo
    Cuando abre el control de ayuda interactiva
    Y toca Siguiente hasta el último paso
    Y toca Finalizar y después Cerrar
    Entonces ve "Ayuda interactiva", los pasos y "¡Tutorial finalizado!"
    Y al cerrar vuelve al detalle del grupo

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @HU-08 @TC-HU08-003 @alta @negativo @requiere-firebase @android @web @RF-15
  Escenario: Error de red al cerrar sesión
    Dado que Firebase no está disponible
    Y el usuario toca "Cerrar sesión" y confirma
    Entonces ve el mensaje de error "No pudimos cerrar la sesión. Volvé a intentar."
    Y permanece en el tab "Configuración" con la sesión activa

  @HU-08 @TC-HU08-004 @media @negativo @android @web @RF-15
  Escenario: Cancelar el cierre de sesión en el Alert
    Dado que el usuario está en el tab "Configuración"
    Cuando toca "Cerrar sesión"
    Y toca "Cancelar" en el Alert
    Entonces permanece en el tab "Configuración"
    Y la sesión sigue activa

  @HU-08 @TC-HU08-005 @media @negativo @android @web @RF-15
  Escenario: Botón de restablecer no aparece en modo Firebase real
    Dado que la app corre con MODO_SEEDS=false (Firebase configurado)
    Cuando el usuario navega al tab "Configuración"
    Entonces la sección "Datos de ejemplo" NO está visible en pantalla

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @HU-08 @TC-HU08-006 @baja @borde @android @web @RF-15
  Escenario: Pantalla muestra email del usuario y modo de conexión
    Dado que el usuario está autenticado y navega al tab "Configuración"
    Entonces ve el e-mail de la cuenta
    Y en MODO_SEEDS=true ve "Modo demo activo (sin credenciales reales de Firebase)."
    Y en MODO_SEEDS=false ve "Estás conectado a Firebase."

  @HU-08 @TC-HU08-007 @media @borde @android @web @RF-15
  Escenario: Cancelar el restablecimiento de datos en modo demo
    Dado que la app corre con MODO_SEEDS=true
    Y el usuario está en el tab "Configuración"
    Cuando toca "Restablecer datos de ejemplo"
    Y toca "Cancelar" en el Alert
    Entonces los datos no cambian
    Y permanece en el tab "Configuración"

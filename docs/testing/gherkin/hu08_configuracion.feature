# language: es

Característica: HU-08 Configuración y cerrar sesión
  Como usuario autenticado
  quiero acceder a la configuración de la app
  para cerrar sesión o restablecer los datos de ejemplo en modo demo.

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @android @requiere-firebase
  Escenario: Cerrar sesión correctamente
    Dado que el usuario está autenticado en Firebase
    Y está en el tab "Configuración"
    Cuando toca "Cerrar sesión"
    Y confirma la acción en el Alert ("Salir")
    # signOutUser() → router.replace('/login')
    Entonces es redirigido a la pantalla de login
    Y el botón Atrás no lleva de vuelta a la app autenticada

  @android
  Escenario: Restablecer datos de ejemplo en modo demo
    Dado que la app corre con MODO_SEEDS=true
    Y el usuario está en el tab "Configuración"
    Cuando toca "Restablecer datos de ejemplo"
    Y confirma la acción en el Alert
    # restablecerSeeds() → router.replace('/grupos')
    Entonces los grupos, gastos, amigos y perfil vuelven al estado inicial del seed
    Y es redirigido al tab "Gastos"

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @android @requiere-firebase
  Escenario: Error de red al cerrar sesión
    Dado que Firebase no está disponible
    Y el usuario toca "Cerrar sesión" y confirma
    # signOutUser() lanza excepción → setError
    Entonces ve el mensaje de error "No pudimos cerrar la sesión. Volvé a intentar."
    Y permanece en el tab "Configuración" con la sesión activa

  @android
  Escenario: Cancelar el cierre de sesión en el Alert
    Dado que el usuario está en el tab "Configuración"
    Cuando toca "Cerrar sesión"
    Y toca "Cancelar" en el Alert
    Entonces permanece en el tab "Configuración"
    Y la sesión sigue activa

  @android
  Escenario: Botón de restablecer no aparece en modo Firebase real
    Dado que la app corre con MODO_SEEDS=false (Firebase configurado)
    Cuando el usuario navega al tab "Configuración"
    # La sección de seeds está envuelta en {MODO_SEEDS && ...}
    Entonces la sección "Datos de ejemplo" NO está visible en pantalla

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @android
  Escenario: Pantalla muestra email del usuario y modo de conexión
    Dado que el usuario está autenticado y navega al tab "Configuración"
    Entonces ve el email de su cuenta activa
    Y si MODO_SEEDS=true ve el texto "Estás usando datos de ejemplo, guardados en este dispositivo."
    Y si MODO_SEEDS=false ve el texto "Estás conectado a Firebase."

  @android
  Escenario: Cancelar el restablecimiento de datos en modo demo
    Dado que la app corre con MODO_SEEDS=true
    Y el usuario está en el tab "Configuración"
    Cuando toca "Restablecer datos de ejemplo"
    Y toca "Cancelar" en el Alert
    Entonces los datos no cambian
    Y permanece en el tab "Configuración"

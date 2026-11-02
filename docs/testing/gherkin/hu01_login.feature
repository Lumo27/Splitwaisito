# language: es
# version: 1.1
# fecha: 31/10/2026
# commit-probado: 2e3a5cb
# autor: Candela Sandoval

Característica: HU-01 Iniciar sesión
  Como usuario de Splitwaisito
  quiero poder iniciar sesión con modo demo o email/contraseña
  y acceder a mis grupos y gastos de forma segura.
  El acceso con Google quedó fuera de esta versión y requiere una compilación compatible.

  # ─────────────────────────────────────────────────────────────────────
  # MODO DEMO
  # ─────────────────────────────────────────────────────────────────────

  @HU-01 @TC-HU01-001 @alta @humo @android
  Escenario: Entrar en modo demo correctamente
    Dado que la app corre con MODO_SEEDS=true
    Y el usuario está en la pantalla de login
    Cuando el usuario toca "Entrar con datos de ejemplo"
    Entonces es redirigido a la pantalla de lista de grupos
    Y puede ver los grupos precargados de ejemplo

  # ─────────────────────────────────────────────────────────────────────
  # EMAIL / CONTRASEÑA
  # ─────────────────────────────────────────────────────────────────────

  @HU-01 @TC-HU01-002 @alta @funcional @requiere-firebase @android
  Escenario: Login con email y contraseña válidos
    Dado que Firebase está configurado con el proveedor email/contraseña habilitado
    Y existe un usuario con email "test@splitwaisito.com" y contraseña "clave123"
    Y el usuario está en la pantalla de login en modo "Iniciar sesión"
    Cuando ingresa email "test@splitwaisito.com"
    Y ingresa contraseña "clave123"
    Y toca "Iniciar sesión"
    Entonces es redirigido a la pantalla de lista de grupos

  @HU-01 @TC-HU01-003 @alta @funcional @requiere-firebase @android
  Escenario: Registro con datos válidos
    Dado que Firebase está configurado con el proveedor email/contraseña habilitado
    Y el usuario está en la pantalla de login
    Y toca "¿No tenés cuenta todavía? Registrate gratis"
    Cuando ingresa nombre "Cande"
    Y ingresa email "nuevousuario@test.com"
    Y ingresa contraseña "segura1"
    Y toca "Crear mi cuenta"
    Entonces es redirigido a la pantalla de lista de grupos

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @HU-01 @TC-HU01-004 @alta @negativo @android
  Escenario: Intento de login con campos incompletos o email inválido
    Dado que el usuario está en la pantalla de login en modo "Iniciar sesión"
    Cuando ingresa email "noesuncorreo"
    Y deja la contraseña vacía
    Y toca "Iniciar sesión"
    Entonces ve el mensaje de error "Ingresá tu e-mail y contraseña."
    Y permanece en la pantalla de login

  @HU-01 @TC-HU01-010 @alta @negativo @requiere-firebase @android
  Escenario: Registro con un email ya utilizado
    Dado que Firebase está configurado con el proveedor email/contraseña habilitado
    Y existe una cuenta con el email "existente@test.com"
    Y el usuario está en modo registro
    Cuando ingresa nombre "Candela"
    Y ingresa email "existente@test.com"
    Y ingresa contraseña "segura1"
    Y toca "Crear mi cuenta"
    Entonces ve el mensaje de error "Ese e-mail ya está registrado. Probá iniciando sesión."
    Y permanece en la pantalla de login

  @HU-01 @TC-HU01-005 @alta @negativo @requiere-firebase @android
  Escenario: Registro con contraseña menor a 6 caracteres
    Dado que Firebase está configurado
    Y el usuario está en modo registro
    Cuando ingresa contraseña "abc"
    Y toca "Crear mi cuenta"
    # validación: clave.length < 6 devuelve error antes de llamar a Firebase
    Entonces ve el mensaje de error "La contraseña debe tener al menos 6 caracteres."
    Y permanece en la pantalla de login

  @HU-01 @TC-HU01-006 @media @negativo @requiere-firebase @android
  Escenario: Login con credenciales incorrectas
    Dado que Firebase está configurado
    Y el usuario está en la pantalla de login en modo "Iniciar sesión"
    Cuando ingresa email "real@correo.com"
    Y ingresa contraseña "incorrecta"
    Y toca "Iniciar sesión"
    # Firebase devuelve auth/invalid-credential, auth/user-not-found o auth/wrong-password
    Entonces ve el mensaje de error "Datos incorrectos. Revisá tu e-mail y contraseña o registrate."
    Y permanece en la pantalla de login

  @HU-01 @TC-HU01-007 @media @negativo @requiere-firebase @android
  Escenario: Login sin conexión a internet
    Dado que Firebase está configurado
    Y el dispositivo no tiene conexión a internet
    Y el usuario está en la pantalla de login
    Cuando ingresa email válido y contraseña
    Y toca "Iniciar sesión"
    # Firebase devuelve auth/network-request-failed
    Entonces ve el mensaje de error "No pudimos conectarnos. Revisá tu conexión a internet."
    Y permanece en la pantalla de login

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE — GOOGLE
  # ─────────────────────────────────────────────────────────────────────

  @HU-01 @TC-HU01-008 @alta @borde @android
  Escenario: El botón de Google no se muestra en Expo Go
    Dado que la app corre en Expo Go (MODO_SEEDS=false, executionEnvironment=StoreClient)
    Y esExpoGo es verdadero
    Y el usuario está en la pantalla de login
    Entonces el botón "Continuar con Google" NO está visible en pantalla

  @HU-01 @TC-HU01-009 @alta @borde @web @falla-conocida
  Escenario: Google se muestra incorrectamente en web
    Dado que la app corre en plataforma web
    Y el usuario está en la pantalla de login
    Cuando observa la pantalla
    Entonces no debería aparecer el botón "Continuar con Google"
    Pero el botón actual aparece debido al modo de ejecución de Expo en web
    Y al tocarlo se muestra un mensaje indicando que Google no está implementado en web

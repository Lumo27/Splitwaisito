# language: es
# version: 1.0
# fecha: 29/10/2026
# commit-probado: 2e3a5cb
# autor: Candela Sandoval

Característica: HU-01 Iniciar sesión
  Como usuario de Splitwaisito
  quiero poder iniciar sesión con modo demo, email/contraseña o Google
  para acceder a mis grupos y gastos de forma segura.

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

  @HU-01 @TC-HU01-004 @alta @negativo @requiere-firebase @android
  Escenario: Intento de login con email inválido
    Dado que Firebase está configurado
    Y el usuario está en la pantalla de login en modo "Iniciar sesión"
    Cuando ingresa email "noesuncorreo"
    Y ingresa contraseña "clave123"
    Y toca "Iniciar sesión"
    # validación local antes de llamar a Firebase
    Entonces ve el mensaje de error "Ingresá tu e-mail y contraseña."
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
    # El bloque de Google está envuelto en {!esExpoGo && ...}
    Entonces el botón "Continuar con Google" NO está visible en pantalla

  @HU-01 @TC-HU01-009 @alta @borde @web @falla-conocida
  Escenario: El botón de Google no debería mostrarse en web pero actualmente falla
    # BUG CONOCIDO: en plataforma web, esExpoGo=false porque Constants.executionEnvironment
    # no es StoreClient. Por eso el botón de Google SÍ se renderiza en web.
    # Al tocarlo, la librería @react-native-google-signin lanza:
    # "RNGoogleSignIn: not-implemented method on web platform"
    # Este escenario documenta el comportamiento ESPERADO (que debería fallar hoy).
    Dado que la app corre en plataforma web (expo start --web)
    Y esExpoGo es falso en ese entorno
    Y el usuario está en la pantalla de login
    # Comportamiento esperado (hoy NO se cumple):
    Entonces el botón "Continuar con Google" NO debería estar visible en pantalla
    # Comportamiento actual (bug):
    Pero el botón SÍ aparece y al tocarlo muestra el error "RNGoogleSignIn: not-implemented method on web platform"

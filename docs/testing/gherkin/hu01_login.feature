commit-referencia: f8266c083b31aad0924ea5dcf729436012eef103
# autor: Candela Sandoval

Característica: HU-01 Iniciar sesión y aceptar términos
  Como usuario de Junti
  quiero poder iniciar sesión con modo demo o email/contraseña
  y acceder a mis grupos y gastos de forma segura.
  El acceso con Google está disponible en APK propio, no en Expo Go.

  # ─────────────────────────────────────────────────────────────────────
  # MODO DEMO
  # ─────────────────────────────────────────────────────────────────────

  @HU-01 @TC-HU01-001 @alta @humo @android @web @RF-01
  Escenario: Entrar en modo demo correctamente
    Dado que la app corre con MODO_SEEDS=true
    Y el usuario ya aceptó los Términos y Condiciones en este dispositivo
    Y el usuario está en la pantalla de login
    Cuando el usuario toca "Entrar con datos de ejemplo"
    Entonces es redirigido a la pantalla de lista de grupos
    Y puede ver los grupos precargados de ejemplo

  # ─────────────────────────────────────────────────────────────────────
  # EMAIL / CONTRASEÑA
  # ─────────────────────────────────────────────────────────────────────

  @HU-01 @TC-HU01-002 @alta @funcional @requiere-firebase @android @web @RF-01
  Escenario: Login con email y contraseña válidos
    Dado que Firebase está configurado con el proveedor email/contraseña habilitado
    Y existe un usuario con email "test@junti.com" y contraseña "clave123"
    Y esa cuenta ya aceptó los Términos y Condiciones vigentes
    Y el usuario está en la pantalla de login en modo "Iniciar sesión"
    Cuando ingresa email "test@junti.com"
    Y ingresa contraseña "clave123"
    Y toca "Iniciar sesión"
    Entonces es redirigido a la pantalla de lista de grupos

  @HU-01 @TC-HU01-003 @alta @funcional @requiere-firebase @android @web @RF-01 @RF-02 @RNF-03
  Escenario: Registro con datos válidos
    Dado que Firebase está configurado con el proveedor email/contraseña habilitado
    Y el usuario está en la pantalla de login
    Y toca "¿No tenés cuenta todavía? Registrate gratis"
    Cuando ingresa nombre "Cande"
    Y ingresa email "nuevousuario@test.com"
    Y ingresa contraseña "segura1"
    Y toca "Crear mi cuenta"
    Entonces se muestra la pantalla "Términos y Condiciones"
    Cuando lee y acepta los términos
    Entonces es redirigido a la pantalla de lista de grupos

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @HU-01 @TC-HU01-004 @alta @negativo @android @web @RF-01
  Escenario: Intento de login con campos incompletos o email inválido
    Dado que el usuario está en la pantalla de login en modo "Iniciar sesión"
    Cuando ingresa email "noesuncorreo"
    Y deja la contraseña vacía
    Y toca "Iniciar sesión"
    # la validación se hace en el cliente, sin llamar a Firebase
    Entonces ve el mensaje de error "Ingresá un correo electrónico válido."
    Y permanece en la pantalla de login

  @HU-01 @TC-HU01-010 @alta @negativo @requiere-firebase @android @web @RF-01
  Escenario: Registro con un email ya utilizado
    Dado que Firebase está configurado con el proveedor email/contraseña habilitado
    Y existe una cuenta con el email "existente@test.com"
    Y el usuario está en modo registro
    Cuando ingresa nombre "Candela"
    Y ingresa email "existente@test.com"
    Y ingresa contraseña "segura1"
    Y toca "Crear mi cuenta"
    Entonces ve el mensaje de error "Ese correo ya está registrado. Probá iniciando sesión."
    Y permanece en la pantalla de registro

  @HU-01 @TC-HU01-005 @alta @negativo @requiere-firebase @android @web @RF-01
  Escenario: Registro con contraseña menor a 6 caracteres
    Dado que Firebase está configurado
    Y el usuario está en modo registro
    Cuando ingresa contraseña "abc"
    Y toca "Crear mi cuenta"
    # validación: clave.length < 6 devuelve error antes de llamar a Firebase
    Entonces ve el mensaje de error "La contraseña debe tener al menos 6 caracteres."
    Y permanece en la pantalla de login

  @HU-01 @TC-HU01-006 @media @negativo @requiere-firebase @android @web @RF-01
  Escenario: Login con credenciales incorrectas
    Dado que Firebase está configurado
    Y el usuario está en la pantalla de login en modo "Iniciar sesión"
    Cuando ingresa email "real@correo.com"
    Y ingresa contraseña "incorrecta"
    Y toca "Iniciar sesión"
    # Firebase devuelve auth/invalid-credential, auth/user-not-found o auth/wrong-password
    Entonces ve el mensaje de error "Datos incorrectos. Revisá tu e-mail y contraseña o registrate."
    Y permanece en la pantalla de login

  @HU-01 @TC-HU01-007 @media @negativo @requiere-firebase @android @web @RF-01
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

  @HU-01 @TC-HU01-008 @alta @borde @android @RF-01 @RNF-02
  Escenario: El botón de Google no se muestra en Expo Go
    Dado que la app corre en Expo Go (MODO_SEEDS=false, executionEnvironment=StoreClient)
    Y esExpoGo es verdadero
    Y el usuario está en la pantalla de login
    Entonces el botón "Continuar con Google" NO está visible en pantalla

  @HU-01 @TC-HU01-009 @alta @borde @web @falla-conocida @fuera-de-alcance-mobile @RF-01
  Escenario: Google se muestra incorrectamente en web
    Dado que la app corre en plataforma web
    Y el usuario está en la pantalla de login
    Cuando observa la pantalla
    Entonces no debería aparecer el botón "Continuar con Google"
    Pero el botón actual aparece debido al modo de ejecución de Expo en web
    Cuando toca "Continuar con Google"
    Entonces debería verse el mensaje "Google no disponible en esta versión."
    Pero se muestra el mensaje técnico "RNGoogleSignin: you are calling a not-implemented method on web platform..."
    Y permanece en la pantalla de login sin abrir el flujo de Google

  @HU-01 @TC-HU01-011 @alta @funcional @android @demo @RF-01 @RF-02 @RNF-03
  Escenario: Aceptar términos en modo demo y conservar la aceptación
    Dado que la app corre con MODO_SEEDS=true
    Y el usuario todavía no aceptó los Términos y Condiciones
    Cuando toca "Entrar con datos de ejemplo"
    Entonces se muestra la pantalla "Términos y Condiciones"
    Cuando lee y acepta los términos
    Entonces accede a la lista de grupos
    Cuando cierra y vuelve a abrir la app en el mismo dispositivo
    Y vuelve a entrar en modo demo
    Entonces accede a la lista de grupos sin que se solicite aceptar los términos otra vez

  @HU-01 @TC-HU01-012 @alta @funcional @android @requiere-firebase @RF-01 @RF-02 @RNF-03
  Escenario: Aceptar términos en una cuenta Firebase y conservar la aceptación
    Dado que Firebase está configurado y existe una cuenta que aún no aceptó los términos vigentes
    Cuando inicia sesión con sus credenciales
    Entonces se muestra la pantalla "Términos y Condiciones"
    Cuando lee y acepta los términos
    Entonces accede a la lista de grupos
    Cuando cierra sesión e inicia sesión otra vez con la misma cuenta
    Entonces accede a la lista de grupos sin que se solicite aceptar los términos otra vez

  @HU-01 @TC-HU01-013 @alta @funcional @android @requiere-firebase @apk @RF-01 @RF-02 @RNF-03
  Escenario: Iniciar sesión con Google en un APK compatible
    Dado que la app corre en un APK propio con Google Sign-In y Firebase configurados
    Y el usuario está en la pantalla de login
    Cuando toca "Continuar con Google" y elige una cuenta válida
    Entonces inicia sesión con esa cuenta
    Y si todavía no aceptó los términos vigentes se muestra "Términos y Condiciones"
    Y después de aceptarlos accede a la lista de grupos

  @HU-01 @TC-HU01-014 @media @negativo @android @requiere-firebase @RF-01 @RF-02 @RNF-03
  Escenario: Reintentar la verificación de términos cuando falla la conexión
    Dado que Firebase está configurado y el usuario inició sesión con una cuenta sin aceptación vigente
    Y el dispositivo no tiene conexión a internet
    Cuando se verifica la aceptación de los términos
    Entonces ve un mensaje de error y la opción "Reintentar verificación"
    Y no accede a las pantallas autenticadas
    Cuando recupera la conexión y toca "Reintentar verificación"
    Entonces puede ver y aceptar los términos antes de acceder a los grupos


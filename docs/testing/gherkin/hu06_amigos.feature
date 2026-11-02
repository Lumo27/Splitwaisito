# language: es
# version: 1.1
# fecha: 31/10/2026
# commit-probado: 2e3a5cb
# autor: Candela Sandoval

Característica: HU-06 Gestionar amigos
  Como usuario autenticado
  quiero enviar y recibir solicitudes de amistad por e-mail
  para poder agregar conocidos a mis grupos sin compartir credenciales.

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @HU-06 @TC-HU06-001 @alta @funcional @android @requiere-firebase
  Escenario: Enviar solicitud de amistad con email válido
    Dado que el usuario está en el tab "Amigos"
    Y existe otro usuario en Firebase con email "amigo@correo.com"
    Cuando ingresa "amigo@correo.com" en el campo "Invitar por e-mail"
    Y toca "Enviar solicitud"
    Entonces ve el mensaje de confirmación "Solicitud enviada."
    Y el campo de email queda vacío

  @HU-06 @TC-HU06-002 @alta @funcional @android @requiere-firebase
  Escenario: Aceptar solicitud de amistad pendiente
    Dado que el usuario tiene una solicitud de amistad pendiente en la sección "Solicitudes pendientes"
    Cuando toca "Aceptar a [nombre]"
    Entonces la solicitud desaparece de la sección de pendientes
    Y el amigo aparece en la lista "Tus amigos"

  @HU-06 @TC-HU06-003 @alta @funcional @android @requiere-firebase
  Escenario: Rechazar solicitud de amistad pendiente
    Dado que el usuario tiene una solicitud de amistad pendiente
    Cuando toca "Rechazar solicitud"
    Entonces la solicitud desaparece de la sección de pendientes
    Y el remitente NO aparece en "Tus amigos"

  @HU-06 @TC-HU06-004 @media @funcional @android @requiere-firebase
  Escenario: Eliminar amigo existente con confirmación
    Dado que el usuario tiene al menos un amigo en su lista
    Cuando toca "Eliminar a [nombre]"
    Y confirma la acción en el Alert
    Entonces el amigo desaparece de la lista "Tus amigos"

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @HU-06 @TC-HU06-005 @alta @negativo @android
  Escenario: Enviar solicitud con email inválido
    Dado que el usuario está en el tab "Amigos"
    Cuando ingresa "sinpunto" en el campo de email
    Y toca "Enviar solicitud"
    # Validación local: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    Entonces ve el mensaje de error "Ingresá un e-mail válido."
    Y no se crea ninguna solicitud

  @HU-06 @TC-HU06-006 @alta @negativo @android
  Escenario: Enviarse solicitud a uno mismo
    Dado que el usuario está en el tab "Amigos"
    Y su propio email es "yo@correo.com"
    Cuando ingresa "yo@correo.com" en el campo de email
    Y toca "Enviar solicitud"
    # Validación: destinatario === usuario.email.toLowerCase()
    Entonces ve el mensaje de error "Ingresá el e-mail de otra persona."

  @HU-06 @TC-HU06-007 @alta @negativo @android
  Escenario: Enviar solicitud a alguien que ya es amigo
    Dado que el usuario tiene a "amigo@correo.com" en su lista de amigos
    Cuando ingresa "amigo@correo.com" en el campo de email
    Y toca "Enviar solicitud"
    # Validación: amigos.some(a => a.email.toLowerCase() === destinatario)
    Entonces ve el mensaje de error "Esta persona ya está en tus amigos."

  @HU-06 @TC-HU06-008 @media @negativo @android @requiere-firebase
  Escenario: Error de red al cargar amigos y solicitudes
    Dado que Firestore no está disponible al abrir el tab "Amigos"
    Cuando la pantalla intenta cargar los datos
    Entonces ve el mensaje de error "No pudimos cargar tus amigos. Volvé a intentar."

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @HU-06 @TC-HU06-009 @baja @borde @android
  Escenario: Estado vacío sin amigos aceptados
    Dado que el usuario no tiene ningún amigo aceptado
    Cuando abre el tab "Amigos"
    Entonces ve el texto "Todavía no tenés amigos. Enviá una solicitud para empezar."

  @HU-06 @TC-HU06-010 @baja @borde @android
  Escenario: Lista de amigos se recarga al volver al tab
    Dado que el usuario estaba en otro tab y volvió al tab "Amigos"
    Entonces la app vuelve a consultar amigos y solicitudes desde Firestore o seeds
    Y actualiza la lista con los datos más recientes

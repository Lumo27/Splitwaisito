# language: es

Característica: HU-05 Saldar deuda
  Como usuario que tiene una deuda pendiente en un grupo
  quiero ver el monto exacto que debo y poder iniciar la transferencia en Mercado Pago
  para saldar la deuda sin tener que buscar los datos del acreedor.

  # ─────────────────────────────────────────────────────────────────────
  # CAMINOS FELICES
  # ─────────────────────────────────────────────────────────────────────

  @android @hardware
  Escenario: Ver deuda y email copiado automáticamente al entrar
    Dado que el usuario es deudor de una transferencia en un grupo
    Y el acreedor tiene un email registrado
    Cuando navega a la pantalla "Saldar deuda" desde el detalle del grupo
    Entonces ve el nombre del acreedor
    Y ve el monto que debe
    Y el email del acreedor fue copiado automáticamente al portapapeles
    # useEffect al montar: Clipboard.setStringAsync(email)
    Y ve la confirmación "E-mail copiado."

  @android
  Escenario: Abrir Mercado Pago desde Saldar deuda
    Dado que el usuario está en la pantalla "Saldar deuda" con una deuda válida
    Cuando toca "Abrir Enviar dinero en Mercado Pago"
    # Linking.openURL('https://www.mercadopago.com.ar/money-transfer')
    Entonces se abre el navegador o la app de Mercado Pago con la URL de transferencia

  @android @hardware
  Escenario: Copiar el monto al portapapeles
    Dado que el usuario está en la pantalla "Saldar deuda"
    Cuando toca "Copiar monto"
    Entonces el monto de la deuda se copia al portapapeles
    Y aparece el mensaje "Monto copiado."

  @android @hardware
  Escenario: Copiar el email manualmente (segunda vez)
    Dado que el usuario está en la pantalla "Saldar deuda" con email del acreedor disponible
    Cuando toca "Copiar e-mail"
    Entonces el email del acreedor vuelve a copiarse al portapapeles
    Y aparece el mensaje "E-mail copiado."

  # ─────────────────────────────────────────────────────────────────────
  # NEGATIVOS
  # ─────────────────────────────────────────────────────────────────────

  @android @requiere-firebase
  Escenario: Deuda ya saldada al llegar a la pantalla
    Dado que otro integrante eliminó los gastos del grupo antes de que el usuario navegara a Saldar deuda
    Cuando la pantalla termina de cargar los datos actualizados
    # deudasDelGrupo recalcula y la deuda (de, a) ya no existe
    Entonces ve el mensaje "Esta transferencia ya no está pendiente. Volvé al grupo para consultar el saldo actualizado."
    Y ve el botón "Volver al grupo"

  @android
  Escenario: Acreedor sin email registrado deshabilita el botón de copiar
    Dado que el acreedor no tiene email guardado en el store de amigos
    Y el usuario navega a la pantalla "Saldar deuda"
    Entonces ve el texto "No tenemos el e-mail del acreedor. Pedíselo antes de transferir."
    Y el botón "Copiar e-mail" está deshabilitado

  @android @requiere-firebase
  Escenario: Error de red al cargar la deuda
    Dado que Firestore no está disponible al abrir la pantalla "Saldar deuda"
    Cuando la pantalla intenta cargar el grupo y los gastos
    Entonces ve un spinner mientras carga
    Y luego ve un mensaje de error
    Y ve los botones "Volver al grupo" y "Actualizar"

  # ─────────────────────────────────────────────────────────────────────
  # CASOS BORDE
  # ─────────────────────────────────────────────────────────────────────

  @android
  Escenario: Intentar acceder a Saldar deuda de una deuda ajena
    Dado que el usuario navega manualmente a /grupos/[id]/saldar con parámetro de=otroUsuarioId
    Y de !== usuarioId actual
    # SaldarDeudaScreen: if (de !== usuarioId) throw new Error(...)
    Cuando la pantalla termina de cargar
    Entonces ve el mensaje de error "Elegí una deuda tuya desde el detalle del grupo."
    Y ve el botón "Volver al grupo"

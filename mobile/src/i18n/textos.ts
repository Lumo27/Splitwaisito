export type Idioma = 'es' | 'en' | 'pt'

const textosEn: Record<string, string> = {
  'Compartí los planes, organizá los gastos.': 'Share plans and organize expenses.',
  'Probá la app': 'Try the app',
  'Crear cuenta': 'Create account',
  'Iniciar sesión': 'Sign in',
  'Entrar con datos de ejemplo': 'Continue with sample data',
  'Continuar con Google': 'Continue with Google',
  'o con correo y contraseña': 'or with email and password',
  'Tu nombre': 'Your name',
  'Contraseña': 'Password',
  'Mínimo 6 caracteres': 'At least 6 characters',
  'Crear mi cuenta': 'Create my account',
  'Explorá grupos, gastos y deudas con datos de ejemplo. Tus cambios se guardan en este dispositivo.':
    'Explore groups, expenses, and balances with sample data. Your changes are saved on this device.',
  '¿Ya tenés cuenta? Iniciá sesión': 'Already have an account? Sign in',
  '¿No tenés cuenta todavía? Registrate gratis': 'No account yet? Sign up for free',
  'El acceso a cuentas todavía no está configurado. Contactá al equipo para habilitarlo.':
    'Account access is not configured yet. Contact the team to enable it.',
  'Iniciá sesión para ver tus amigos.': 'Sign in to see your friends.',
  'Amigos': 'Friends',
  'Compartí gastos con tus amigos y gestioná sus solicitudes.':
    'Share expenses with friends and manage their requests.',
  'Invitar por e-mail': 'Invite by email',
  'amigo@correo.com': 'friend@example.com',
  'Enviar solicitud': 'Send request',
  'Actualizar amigos': 'Refresh friends',
  'Solicitudes pendientes': 'Pending requests',
  'No tenés solicitudes pendientes.': 'You have no pending requests.',
  'Aceptar solicitud': 'Accept request',
  'Rechazar': 'Decline',
  'Tus amigos': 'Your friends',
  'Todavía no tenés amigos. Enviá una solicitud para empezar.':
    'You have no friends yet. Send a request to get started.',
  'Eliminar amigo': 'Remove friend',
  'Solicitud enviada.': 'Request sent.',
  'Solicitud aceptada.': 'Request accepted.',
  'Solicitud rechazada.': 'Request declined.',
  'Amigo eliminado.': 'Friend removed.',
  'Ingresá un e-mail válido.': 'Enter a valid email address.',
  'Ingresá el e-mail de otra persona.': 'Enter another person’s email address.',
  'Esta persona ya está en tus amigos.': 'This person is already your friend.',
  'No pudimos cargar tus amigos. Volvé a intentar.':
    'Could not load your friends. Please try again.',
  'No se pudo completar la acción. Volvé a intentar.':
    'Could not complete the action. Please try again.',
  'Un nuevo plan compartido': 'A new shared plan',
  'Creá un grupo y elegí con quién vas a compartir los gastos.':
    'Create a group and choose who to share expenses with.',
  'Nombre del grupo': 'Group name',
  'Moneda del grupo': 'Group currency',
  'Todos los gastos y saldos se expresarán en esta moneda.':
    'All expenses and balances will use this currency.',
  'Integrantes': 'Members',
  'Vos ya estás incluido.': 'You are already included.',
  'Podés agregar amigos después desde el detalle del grupo.':
    'You can add friends later from the group details.',
  'Ingresá un nombre para el grupo.': 'Enter a group name.',
  'No pudimos crear el grupo. Revisá la conexión y volvé a intentar.':
    'Could not create the group. Check your connection and try again.',
  'Espacio compartido': 'Shared space',
  'Mis grupos': 'My groups',
  'Organizá los gastos y saldos con tu gente.':
    'Organize expenses and balances with your group.',
  'Tu próximo plan empieza acá': 'Your next plan starts here',
  'Creá tu primer grupo para compartir los gastos de un viaje, la casa o una salida.':
    'Create your first group to share expenses for a trip, home, or outing.',
  'No se pudo eliminar': 'Could not delete',
  'Revisá la conexión y volvé a intentar.':
    'Check your connection and try again.',
  'Cargando tus grupos...': 'Loading your groups...',
  'Este grupo no está disponible o ya no sos integrante.':
    'This group is unavailable or you are no longer a member.',
  'Total de gastos del grupo': 'Group expenses total',
  'Cargar gasto': 'Add expense',
  'Deudas simplificadas': 'Simplified debts',
  'Los saldos aparecerán al cargar el primer gasto.':
    'Balances will appear after the first expense is added.',
  'Todo está saldado. No hay transferencias pendientes.':
    'Everything is settled. There are no pending transfers.',
  'Saldar deuda': 'Settle debt',
  'Todavía no hay gastos. Cargá el primero para empezar.':
    'There are no expenses yet. Add the first one to get started.',
  'Pagos registrados': 'Recorded payments',
  'Deshacer pago': 'Undo payment',
  'Transferencia': 'Transfer',
  'Verificado automáticamente': 'Automatically verified',
  'El destinatario, el monto y la fecha del comprobante coinciden con la deuda.':
    'The recipient, amount, and date on the receipt match the debt.',
  'Quien recibió el dinero revisó el comprobante y confirmó el pago.':
    'The recipient reviewed the receipt and confirmed the payment.',
  'Revisá el comprobante': 'Review the receipt',
  'Esperando que quien recibe lo apruebe': 'Waiting for the recipient to approve',
  'Aprobar: recibí el dinero': 'Approve: I received the money',
  'Dividido entre': 'Split between',
  'Ver comprobante': 'View receipt',
  'Comprobante': 'Receipt',
  'Comprobante de pago': 'Payment receipt',
  'Foto del gasto': 'Expense photo',
  'Foto del ticket o del lugar': 'Receipt or location photo',
  'Ubicación': 'Location',
  'Abrir en Google Maps': 'Open in Google Maps',
  'Volver': 'Back',
  'Editar gasto': 'Edit expense',
  '¿Qué compraste?': 'What did you buy?',
  'Ej: Cena del viaje': 'e.g. Trip dinner',
  'Monto total': 'Total amount',
  '¿Quién pagó?': 'Who paid?',
  'Dividir entre': 'Split between',
  'Elegí al menos un participante.': 'Choose at least one participant.',
  'Foto del ticket o del lugar (opcional)': 'Receipt or location photo (optional)',
  'Tomar foto': 'Take photo',
  'Elegir foto': 'Choose photo',
  'Elegir captura': 'Choose screenshot',
  'Quitar foto': 'Remove photo',
  'Lugar o dirección (opcional)': 'Place or address (optional)',
  'Ej: Bar Central o Palermo': 'e.g. Central Bar or Palermo',
  'Detectar mi ubicación GPS': 'Detect my GPS location',
  'Quitar ubicación': 'Remove location',
  'Guardar gasto': 'Save expense',
  'Eliminar este gasto': 'Delete this expense',
  'No pudimos guardar el gasto. Volvé a intentar.':
    'Could not save the expense. Please try again.',
  'No pudimos abrir la cámara o las fotos.':
    'Could not open the camera or photos.',
  'Mi perfil': 'My profile',
  'Dólar hoy en Argentina': 'Dollar rate in Argentina today',
  'Cotizaciones oficiales y de mercado': 'Official and market rates',
  'Actualizar cotización del dólar': 'Refresh dollar rates',
  'Reintentar': 'Try again',
  'Compra': 'Buy',
  'Venta': 'Sell',
  'Alias para transferencias': 'Transfer alias',
  'Ej: german123': 'e.g. alex123',
  'Descripción breve': 'Short description',
  'Contá algo sobre vos': 'Tell us a little about yourself',
  'Guardar cambios': 'Save changes',
  'No pudimos actualizar la cotización.': 'Could not refresh the exchange rate.',
  'Tenés una deuda pendiente': 'You have an outstanding debt',
  'Activá las notificaciones para recibir el recordatorio.':
    'Enable notifications to receive the reminder.',
  'No pudimos programar el recordatorio.': 'Could not schedule the reminder.',
  'Esta transferencia ya no está pendiente. Volvé al grupo para consultar el saldo actualizado.':
    'This transfer is no longer pending. Return to the group to see the updated balance.',
  'Volver al grupo': 'Back to group',
  'Actualizar': 'Refresh',
  '¿Ya transferiste?': 'Have you transferred?',
  'Subí la captura o la foto del comprobante.':
    'Upload a screenshot or photo of the receipt.',
  'Registrar pago con comprobante': 'Record payment with receipt',
  'Pago en revisión': 'Payment under review',
  'No tenemos el alias ni el e-mail del acreedor. Pedíselos antes de transferir.':
    'We do not have the creditor’s alias or email. Ask them before transferring.',
  'No se pudo verificar el comprobante automáticamente.':
    'Could not verify the receipt automatically.',
  'El comprobante coincide con la deuda: quedó saldada.':
    'The receipt matches the debt: it is now settled.',
  'Pago verificado': 'Payment verified',
  'Pago pendiente de aprobación': 'Payment awaiting approval',
  '¿Deseás abrir WhatsApp para enviar el recordatorio del saldo pendiente?':
    'Open WhatsApp to send a reminder about the outstanding balance?',
  'Abrir WhatsApp': 'Open WhatsApp',
  'Por E-mail': 'By email',
  'No pudimos copiar el alias. Podés volver a intentarlo.':
    'Could not copy the alias. You can try again.',
  'No pudimos copiar el e-mail. Podés volver a intentarlo.':
    'Could not copy the email. You can try again.',
  'No pudimos copiar el dato. Volvé a intentar.':
    'Could not copy the information. Please try again.',
  'No pudimos registrar el pago. Volvé a intentar.':
    'Could not record the payment. Please try again.',
  'Crear un grupo': 'Create a group',
  'Términos y condiciones': 'Terms and conditions',
  'Información que guarda la app': 'Information saved by the app',
  'Controles disponibles': 'Available controls',
  'Restaurando tu sesión...': 'Restoring your session...',
  'Cargando': 'Loading',
  'Punto en mapa': 'Map point',
  'Tocá en el mapa para marcar el punto. Fuente: © OpenStreetMap, © CARTO.':
    'Tap the map to mark a point. Map data: © OpenStreetMap, © CARTO.',
  'Ya podés seguir usando Junti. Esta ayuda queda disponible cuando la necesites.':
    'You can keep using Junti. This help will be here whenever you need it.',
  '¡Tutorial finalizado!': 'Tutorial complete!',
  'Paso': 'Step',
  'Pendiente de aprobación': 'Awaiting approval',
  'Aprobado': 'Approved',
  'Rechazado': 'Rejected',
  'Comida': 'Food',
  'Transporte': 'Transport',
  'Alojamiento': 'Accommodation',
  'Otro': 'Other',
  'Pesos argentinos (ARS)': 'Argentine pesos (ARS)',
  'Reales brasileños (BRL)': 'Brazilian reals (BRL)',
  'Iniciá sesión para crear un grupo.': 'Sign in to create a group.',
  'Ingresá una descripción.': 'Enter a description.',
  'Ingresá un monto válido con hasta dos decimales.':
    'Enter a valid amount with up to two decimal places.',
  'El monto debe ser mayor que cero y estar dentro del rango permitido.':
    'The amount must be greater than zero and within the allowed range.',
  'Elegí un pagador del grupo.': 'Choose a payer from the group.',
  'Elegí al menos un participante del grupo.':
    'Choose at least one group member.',
  'No pudimos cargar tus grupos. Revisá la conexión y volvé a intentar.':
    'Could not load your groups. Check your connection and try again.',
  'No pudimos cargar el grupo. Revisá la conexión y volvé a intentar.':
    'Could not load the group. Check your connection and try again.',
  'Iniciá sesión para editar tu perfil.': 'Sign in to edit your profile.',
  'Alias:': 'Alias:',
  'E-mail:': 'Email:',
  'Le debés a': 'You owe',
  'Transferí desde el banco o la billetera que quieras usando el alias o el e-mail. Después subí el comprobante para saldar la deuda en el grupo.':
    'Transfer from any bank or digital wallet using the alias or email. Then upload the receipt to settle the debt in the group.',
  'Copiar alias': 'Copy alias',
  'Copiar monto': 'Copy amount',
  'Recordarme pagar más tarde': 'Remind me to pay later',
  'Ya subiste un comprobante para esta deuda.':
    'You already uploaded a receipt for this debt.',
  'lo tiene que aprobar desde el detalle del pago.':
    'must approve it from the payment details.',
  'Foto de': 'Photo of',
  'Marcar en el mapa': 'Mark on map',
  'Agregar': 'Add',
  'E-mail copiado.': 'Email copied.',
  'El método de acceso todavía no está habilitado en Firebase.':
    'This sign-in method is not enabled in Firebase yet.',
  'No pudimos autenticarte con Google.': 'Could not authenticate with Google.',
  'El inicio con Google no está disponible en este entorno.':
    'Google sign-in is unavailable in this environment.',
  'No pudimos obtener las credenciales de Google.':
    'Could not obtain Google credentials.',
  'No pudimos ingresar. Revisá tus datos e intentá de nuevo.':
    'Could not sign in. Check your details and try again.',
  'Sin correo disponible': 'No email available',
  'Controles': 'Controls',
  'Categoría': 'Category',
  'Gastos y saldos en un solo lugar': 'Expenses and balances in one place',
  'Fuente: © OpenStreetMap, © CARTO.': 'Map data: © OpenStreetMap, © CARTO.',
  'Alias copiado.': 'Alias copied.',
  'No pudimos abrir WhatsApp. Verificá que esté instalado.':
    'Could not open WhatsApp. Check that it is installed.',
  'Nombre': 'Name',
  'Aceptar': 'Accept',
  'Guardar': 'Save',
  'Monto copiado.': 'Amount copied.',
  'Alias copiado': 'Alias copied',
  'Monto copiado': 'Amount copied',
  'No pudimos guardar el perfil. Tus datos anteriores se conservan; volvé a intentar.':
    'Could not save your profile. Your previous details are unchanged; please try again.',
  'WhatsApp no disponible': 'WhatsApp unavailable',
  'No tenemos registrado el e-mail': 'We do not have the email address',
  'No pudimos abrir WhatsApp. Verificá que esté instalado en tu dispositivo.':
    'Could not open WhatsApp. Check that it is installed on your device.',
  'No pudimos abrir tu aplicación de correo.':
    'Could not open your email app.',
  'No pudimos actualizar el pago. Volvé a intentar.':
    'Could not update the payment. Please try again.',
  'E-mail no disponible': 'Email unavailable',
  'No pudimos obtener tu ubicación.': 'Could not get your location.',
  'No pudimos cargar el formulario.': 'Could not load the form.',
  'No pudimos cargar el movimiento.': 'Could not load the transaction.',
  'El movimiento ya no existe.': 'This transaction no longer exists.',
  'El gasto ya no está disponible.': 'This expense is no longer available.',
  'El grupo no está disponible.': 'This group is unavailable.',
  'Ya no sos integrante de este grupo.': 'You are no longer a member of this group.',
  'No pudimos eliminar el gasto. Volvé a intentar.':
    'Could not delete the expense. Please try again.',
  'Aceptar y continuar': 'Accept and continue',
  'No se pudo verificar la aceptación de los términos.':
    'Could not verify acceptance of the terms.',
  'Iniciá sesión para aceptar los términos.':
    'Sign in to accept the terms.',
  'La sesión cambió antes de registrar la aceptación.':
    'The session changed before acceptance could be recorded.',
  'Cerrar términos completos': 'Close full terms',
  '¿Eliminar': 'Delete?',
  'No se pudo guardar': 'Could not save',
  'No pudimos cancelar los recordatorios programados. Volvé a intentar.':
    'Could not cancel scheduled reminders. Please try again.',
  'La programación de notificaciones no está disponible en la versión web.':
    'Notifications cannot be scheduled on the web version.',
  'Las preferencias de configuración y moneda se guardan en este dispositivo; no se sincronizan entre dispositivos.':
    'Settings and currency preferences are saved on this device and are not synced across devices.',
  'No se muestran opciones que prometan esos controles.':
    'The app does not show controls for features that are unavailable.',
  'Perfil guardado.': 'Profile saved.',
  'Sesión de demostración': 'Demo session',
  'Restablecer contraseña': 'Reset password',
  'Cerrar sesión': 'Sign out',
  '¿Querés salir de tu cuenta en este dispositivo?':
    'Do you want to sign out on this device?',
  'Enviaremos un enlace a tu correo': 'We will send a link to your email',
  'Disponible para cuentas con e-mail y contraseña':
    'Available for email and password accounts',
  'La app muestra y cierra la sesión de este dispositivo. La administración de sesiones remotas no está disponible. Si ingresaste con Google, la contraseña se administra desde tu cuenta de Google.':
    'The app shows and signs out this device. Remote session management is unavailable. If you signed in with Google, manage your password through your Google account.',
  'No pudimos enviar el enlace. Revisá tu conexión e intentá otra vez.':
    'Could not send the link. Check your connection and try again.',
  'No pudimos cerrar la sesión. Volvé a intentar.':
    'Could not sign out. Please try again.',
  'Aplicación para organizar gastos compartidos y consultar saldos.':
    'An app for organizing shared expenses and tracking balances.',
  'Información de privacidad': 'Privacy information',
  'Datos y controles disponibles': 'Data and available controls',
  'La moneda preferida se usa como sugerencia al crear nuevos grupos. Los grupos existentes no se modifican.':
    'The preferred currency is suggested when creating new groups. Existing groups are not changed.',
  'Usá las pestañas para ir a Gastos, Amigos, Perfil y Configuración.':
    'Use the tabs to open Expenses, Friends, Profile, and Settings.',
  'Creá un grupo, sumá integrantes y registrá los gastos que quieran dividir.':
    'Create a group, add members, and record the expenses you want to split.',
  'Los saldos resumen los gastos y pagos registrados. Las transferencias se hacen fuera de Junti.':
    'Balances summarize recorded expenses and payments. Transfers take place outside Junti.',
  'Cada grupo reúne a las personas y los gastos de un plan compartido. Abrí uno para ver sus movimientos y saldos.':
    'Each group brings together people and expenses for a shared plan. Open one to see its transactions and balances.',
  'Usá “Crear grupo” para ponerle un nombre, elegir la moneda y sumar integrantes disponibles.':
    'Use “Create group” to name it, choose a currency, and add available members.',
  'Desde un grupo podés registrar qué se pagó, cuánto, quién pagó y entre quiénes se divide.':
    'In a group, record what was paid, how much, who paid, and how to split it.',
  'El detalle del grupo muestra sus gastos, el total por categoría y los saldos pendientes entre integrantes.':
    'Group details show expenses, totals by category, and outstanding balances between members.',
  'Elegí un nombre y, si querés, agregá una descripción para que todos reconozcan el grupo.':
    'Choose a name and, optionally, add a description so everyone can identify the group.',
  'Seleccioná la moneda que usarán los gastos del grupo. Los movimientos se calculan en esa moneda.':
    'Select the currency for group expenses. Transactions are calculated in that currency.',
  'Podés invitar amistades disponibles al grupo. Después, cada gasto se divide entre las personas que selecciones.':
    'You can invite available friends to the group. Each expense is then split among the people you select.',
  'El total y el gráfico resumen los gastos registrados. Tocá un movimiento para consultar su detalle y comprobante.':
    'The total and chart summarize recorded expenses. Tap a transaction to see its details and receipt.',
  'La lista muestra quiénes participan. Si tenés amistades disponibles, podés agregarlas desde esta pantalla.':
    'The list shows participants. If you have available friends, you can add them here.',
  'Los saldos indican quién debe y quién tiene que recibir según los gastos y pagos aprobados del grupo.':
    'Balances show who owes and who should receive money based on group expenses and approved payments.',
  'Usá “Cargar gasto” para agregar un movimiento. Para saldar, transferí por fuera de Junti y cargá el comprobante.':
    'Use “Add expense” to record a transaction. To settle up, transfer outside Junti and upload the receipt.',
  'Ingresá el concepto, el monto total y una de las categorías disponibles.':
    'Enter a description, the total amount, and one of the available categories.',
  'Seleccioná a la persona que hizo el pago. El pagador también forma parte del reparto.':
    'Select who made the payment. The payer is also included in the split.',
  'Marcá los integrantes que comparten el gasto. Junti muestra cuánto corresponde a cada uno.':
    'Select the members who share the expense. Junti shows each person’s share.',
  'Podés adjuntar la foto del ticket y la ubicación cuando estén disponibles. Guardá el gasto para verlo en el grupo.':
    'You can attach a receipt photo and location when available. Save the expense to see it in the group.',
  'Acá ves el monto, la fecha, quién pagó y cómo se repartió el gasto entre los participantes.':
    'See the amount, date, payer, and how the expense was split among participants.',
  'Si se adjuntó una foto o captura, aparece en el detalle del movimiento para que puedas revisarla.':
    'If a photo or screenshot was attached, it appears in the transaction details for review.',
  'Los pagos pendientes esperan la revisión de quien recibió el dinero. Solo los pagos aprobados reducen la deuda.':
    'Pending payments await review by the recipient. Only approved payments reduce the debt.',
  'La pantalla muestra el acreedor y el monto pendiente calculado para el grupo.':
    'This screen shows the creditor and the outstanding amount calculated for the group.',
  'Copiá el alias o e-mail del acreedor y el monto. Junti no realiza transferencias ni administra dinero.':
    'Copy the creditor’s alias or email and the amount. Junti does not transfer or manage money.',
  'Después de transferir, subí una foto o captura. El pago puede verificarse automáticamente o quedar pendiente de revisión.':
    'After transferring, upload a photo or screenshot. The payment may be verified automatically or remain pending review.',
  'Solo un pago aprobado salda la deuda. Si queda pendiente, quien recibió el dinero puede aprobarlo o rechazarlo.':
    'Only an approved payment settles the debt. If it is pending, the recipient can approve or reject it.',
  'Escribí el e-mail de otra persona y enviá una solicitud para compartir grupos y gastos.':
    'Enter another person’s email and send a request to share groups and expenses.',
  'En solicitudes pendientes podés aceptar o rechazar invitaciones que recibiste.':
    'Accept or reject invitations from the pending requests list.',
  'La lista de amigos muestra tus contactos aceptados. Desde allí también podés quitar una amistad.':
    'The friends list shows your accepted contacts. You can also remove a friend there.',
  'El perfil muestra el nombre y el e-mail asociados a tu cuenta.':
    'Your profile shows the name and email associated with your account.',
  'Podés guardar un alias para que tus amistades sepan dónde transferirte cuando corresponda.':
    'Save an alias so your friends know where to transfer money when needed.',
  'Editá los datos disponibles y tocá “Guardar cambios” para actualizar tu perfil.':
    'Edit your details and tap “Save changes” to update your profile.',
  'La pantalla indica la cuenta activa y permite cerrar sesión en este dispositivo.':
    'This screen shows the active account and lets you sign out on this device.',
  'En modo demo podés restablecer los grupos y gastos de prueba. Esta opción no aparece con una cuenta real.':
    'In demo mode, you can reset sample groups and expenses. This option is unavailable for real accounts.',
  'Cerrar sesión no elimina tu cuenta ni tus datos guardados. Iniciá sesión de nuevo para continuar.':
    'Signing out does not delete your account or saved data. Sign in again to continue.',
  'Crear grupo': 'Create group',
  'Volver a intentar': 'Try again',
  'Eliminar grupo': 'Delete group',
  'Cancelar': 'Cancel',
  'Eliminar': 'Delete',
  'Anterior': 'Previous',
  'Siguiente': 'Next',
  'Finalizar': 'Finish',
  'Cerrar': 'Close',
  'Ayuda interactiva': 'Interactive help',
  'Confirmar punto': 'Confirm location',
  'Marcar ubicación en el mapa': 'Mark a location on the map',
  'Tocá cualquier punto del mapa para posicionar el marcador.':
    'Tap anywhere on the map to place the marker.',
  // Centro de configuración
  'Gastos': 'Expenses',
  'Perfil': 'Profile',
  'Configuración': 'Settings',
  'Detalle del movimiento': 'Transaction details',
  'Cuenta': 'Account',
  'Preferencias': 'Preferences',
  'Información y protección': 'Information and protection',
  'Apariencia': 'Appearance',
  'Tema, fuente y tamaño de texto': 'Theme, font, and text size',
  'Idioma': 'Language',
  'Notificaciones': 'Notifications',
  'Administrá tus preferencias': 'Manage your preferences',
  'Moneda preferida': 'Preferred currency',
  'Sugerencia al crear nuevos grupos': 'Suggestion when creating groups',
  'Privacidad': 'Privacy',
  'Datos, visibilidad y consentimientos': 'Data, visibility, and consent',
  'Seguridad': 'Security',
  'Sesión, contraseña y acceso a la cuenta': 'Session, password, and account access',
  'Contraste, animaciones y legibilidad': 'Contrast, animations, and readability',
  'Acerca de Junti': 'About Junti',
  'Versión, documentos e información': 'Version, documents, and information',
  'Estás usando el modo demo. Tus preferencias se guardan en este dispositivo.': 'You are using demo mode. Preferences are saved on this device.',
  'Modo demo': 'Demo mode',
  'Restablecer datos de ejemplo': 'Reset sample data',
  'Restablecer datos': 'Reset data',
  'Se borrarán los cambios realizados en el modo demo de este dispositivo. ¿Continuar?': 'Changes made to demo data on this device will be erased. Continue?',
  'Restablecer': 'Reset',
  'Datos de ejemplo restablecidos.': 'Sample data has been reset.',
  'No pudimos restablecer los datos de ejemplo.': 'Could not reset sample data.',
  'Tema': 'Theme',
  'Claro': 'Light',
  'Oscuro': 'Dark',
  'Automático': 'Automatic',
  'Usa la preferencia del dispositivo': 'Use your device preference',
  'Tipografía': 'Font',
  'Predeterminada del sistema': 'System default',
  'Serif': 'Serif',
  'Monoespaciada': 'Monospace',
  'Vista previa: Gastos compartidos': 'Preview: Shared expenses',
  'Tamaño del texto': 'Text size',
  'Muy pequeño': 'Very small',
  'Pequeño': 'Small',
  'Normal': 'Normal',
  'Grande': 'Large',
  'Muy grande': 'Very large',
  'Restablecer tamaño': 'Reset text size',
  'Accesibilidad': 'Accessibility',
  'Aumentar contraste': 'Increase contrast',
  'Refuerza el contraste de textos, bordes y superficies.': 'Improve contrast for text, borders, and surfaces.',
  'Reducir animaciones': 'Reduce motion',
  'Desactiva las transiciones de navegación de la app.': 'Turn off app navigation transitions.',
  'Respetar el sistema': 'Respect system setting',
  'Reduce las animaciones cuando el dispositivo lo indique.': 'Reduce motion when requested by your device.',
  'Mejorar legibilidad': 'Improve readability',
  'Usa texto más legible y aumenta el espacio de línea.': 'Use more readable text and increase line spacing.',
  'Destacar controles': 'Highlight controls',
  'Marca con claridad los elementos interactivos.': 'Make interactive elements easier to identify.',
  'Controles más grandes': 'Larger controls',
  'Aumenta el área táctil de botones y filas.': 'Increase the touch area of buttons and rows.',
  'Los controles mantienen un indicador de foco visible al navegar con teclado.': 'Controls keep a visible focus indicator when using a keyboard.',
  'Español': 'Español',
  'English': 'English',
  'Português': 'Português',
  'Los textos sin traducción disponible se muestran en español.': 'Text without an available translation is shown in Spanish.',
  'Notificaciones generales': 'General notifications',
  'Actividad de la cuenta': 'Account activity',
  'Recordatorios': 'Reminders',
  'Actividad del grupo': 'Group activity',
  'Novedades': 'News',
  'Actualizaciones': 'Updates',
  'Alertas importantes': 'Important alerts',
  'Preferencia guardada para futuras notificaciones.': 'Preference saved for future notifications.',
  'Preferencia guardada para futuras alertas de cuenta.': 'Preference saved for future account alerts.',
  'Permite programar recordatorios de pago en este dispositivo.': 'Allows payment reminders to be scheduled on this device.',
  'Preferencia guardada para futuras alertas de grupos.': 'Preference saved for future group alerts.',
  'Preferencia guardada para futuras novedades.': 'Preference saved for future news.',
  'Preferencia guardada para futuras actualizaciones.': 'Preference saved for future updates.',
  'Preferencia guardada para futuras alertas.': 'Preference saved for future alerts.',
  'Los recordatorios se programan localmente cuando elegís “Recordarme pagar más tarde”. Al desactivarlos se cancelan los recordatorios pendientes de la app.': 'Reminders are scheduled locally when you choose “Remind me to pay later”. Turning them off cancels the app’s pending reminders.',
  'Todas las opciones se guardan en este dispositivo.': 'All preferences are saved on this device.',
  'Estas preferencias no se sincronizan con otros dispositivos.': 'These preferences are not synced across devices.',
  'Junti guarda los datos del perfil y la información de grupos, movimientos y comprobantes necesarios para sus funciones. Las preferencias de configuración y moneda se guardan en este dispositivo; no se sincronizan entre dispositivos.': 'Junti saves profile, group, transaction, and receipt information needed for its features. Settings and currency preferences are saved on this device and are not synced across devices.',
  'Revisá el documento y el tratamiento de datos': 'Review the document and data handling',
  'Datos del perfil': 'Profile details',
  'El perfil se administra desde la pestaña Perfil': 'Manage your profile from the Profile tab',
  'Actualmente no hay controles para cambiar la visibilidad del perfil, exportar o borrar todos los datos, administrar sesiones remotas ni revocar la aceptación de los términos desde la app. No se muestran opciones que prometan esos controles.': 'The app currently cannot change profile visibility, export or erase all data, manage remote sessions, or revoke acceptance of the terms. No controls are shown for features that are not available.',
  'Sesión actual': 'Current session',
  'Sesiones y métodos de acceso': 'Sessions and sign-in methods',
  'Enviamos un enlace para restablecer la contraseña a {email}.': 'We sent a password reset link to {email}.',
  'Salir': 'Sign out',
  'Versión {version}': 'Version {version}',
  'Sin sesión activa': 'No active session',
  'Dólares (USD)': 'US dollars (USD)',
  'No pudimos registrar tu aceptación. Revisá tu conexión e intentá nuevamente.': 'We could not record your acceptance. Check your connection and try again.',
  // Textos con variables
  '¿Eliminar a {nombre} de tus amigos?': 'Remove {nombre} from your friends?',
  'Eliminar a {nombre}': 'Remove {nombre}',
  'Agregar a {nombre} al grupo': 'Add {nombre} to the group',
  '¿Eliminar “{nombre}” y todos sus gastos? Esta acción no se puede deshacer.':
    'Delete “{nombre}” and all its expenses? This cannot be undone.',
  '¿Eliminar “{nombre}”? Esta acción no se puede deshacer.':
    'Delete “{nombre}”? This cannot be undone.',
  '¿Seguro que querés eliminar “{nombre}”? Esta acción no se puede deshacer.':
    'Delete “{nombre}”? This cannot be undone.',
  '¿Deshacer “{nombre}”? Se borra el pago y su comprobante.':
    'Undo “{nombre}”? The payment and its receipt will be deleted.',
  'Recordar a {nombre}': 'Remind {nombre}',
  'Cada participante: {monto}': 'Each participant: {monto}',
  '1 grupo': '1 group',
  '{cantidad} grupos': '{cantidad} groups',
  '1 integrante · {moneda}': '1 member · {moneda}',
  '{cantidad} integrantes · {moneda}': '{cantidad} members · {moneda}',
  'Paso {actual} de {total}': 'Step {actual} of {total}',
  // Completado de traducciones
  'Página no encontrada':
    'Page not found',
  'No encontramos esta pantalla':
    'We couldn\'t find this screen',
  'El enlace puede haber cambiado. Volvé al inicio para continuar.':
    'The link may have changed. Go back to the start to continue.',
  'Volver al inicio':
    'Back to start',
  'dólar oficial':
    'official dollar rate',
  'real brasileño':
    'Brazilian real',
  'Mapa':
    'Map',
  'Cerrar mapa':
    'Close map',
  'Coordenadas: {lat}, {lng}':
    'Coordinates: {lat}, {lng}',
  'Solicitudes pendientes ({cantidad})':
    'Pending requests ({cantidad})',
  'Tus amigos ({cantidad})':
    'Your friends ({cantidad})',
  'Logotipo de Junti':
    'Junti logo',
  'Ingresá un correo electrónico válido.':
    'Enter a valid email address.',
  'Ingresá tu contraseña.':
    'Enter your password.',
  'Ingresá tu nombre para crear la cuenta.':
    'Enter your name to create the account.',
  'La contraseña debe tener al menos 6 caracteres.':
    'Password must be at least 6 characters.',
  'No pudimos conectarnos. Revisá tu conexión a internet.':
    'We couldn\'t connect. Check your internet connection.',
  'Ese correo ya está registrado. Probá iniciando sesión.':
    'That email is already registered. Try signing in.',
  'El formato del correo electrónico no es válido.':
    'The email format is not valid.',
  'Datos incorrectos. Revisá tu correo y contraseña o registrate.':
    'Incorrect details. Check your email and password or sign up.',
  'La contraseña es muy débil. Usá al menos 6 caracteres.':
    'The password is too weak. Use at least 6 characters.',
  'Ingresá un correo válido para enviarte el enlace.':
    'Enter a valid email so we can send you the link.',
  'La recuperación por correo no está configurada en este entorno.':
    'Email recovery is not configured in this environment.',
  'Si el correo está registrado, vas a recibir un enlace para restablecer tu contraseña.':
    'If the email is registered, you\'ll receive a link to reset your password.',
  'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.':
    'We couldn\'t connect. Check your connection and try again.',
  'Hubo demasiados intentos. Esperá un momento y volvé a probar.':
    'Too many attempts. Wait a moment and try again.',
  'No pudimos enviar el enlace. Revisá el correo e intentá de nuevo.':
    'We couldn\'t send the link. Check the email and try again.',
  'Conocé Junti':
    'Meet Junti',
  'Bienvenido a Junti':
    'Welcome to Junti',
  'Qué bueno tenerte de vuelta':
    'Good to have you back',
  'Creá tu cuenta y empezá a dividir gastos.':
    'Create your account and start splitting expenses.',
  'Tus planes y gastos compartidos te esperan.':
    'Your shared plans and expenses are waiting.',
  'Empezá a organizar los gastos de tus planes.':
    'Start organizing the expenses of your plans.',
  'Ingresá para continuar con tus grupos.':
    'Sign in to continue with your groups.',
  'Ej: Germán Morales':
    'e.g. Alex Smith',
  'Correo electrónico':
    'Email',
  'Tu contraseña':
    'Your password',
  'Ocultar contraseña':
    'Hide password',
  'Mostrar contraseña':
    'Show password',
  'Enviando enlace…':
    'Sending link…',
  '¿Olvidaste tu contraseña?':
    'Forgot your password?',
  'Un momento…':
    'One moment…',
  '¿Ya tenés una cuenta? ':
    'Already have an account? ',
  '¿No tenés una cuenta? ':
    'Don\'t have an account? ',
  'Iniciá sesión':
    'Sign in',
  'Registrate':
    'Sign up',
  'Leer Términos y Condiciones':
    'Read Terms and Conditions',
  'Términos y Condiciones':
    'Terms and Conditions',
  'Cerrar términos y condiciones':
    'Close terms and conditions',
  'Abrir ayuda: {titulo}':
    'Open help: {titulo}',
  'Cerrar ayuda':
    'Close help',
  'Cerrar tutorial':
    'Close tutorial',
  'No disponible':
    'Not available',
  'No se pudo recuperar el perfil demo.':
    'Could not restore the demo profile.',
  'Iniciá sesión para cargar gastos.':
    'Sign in to add expenses.',
  'Permití el acceso a la ubicación para detectar tu posición actual.':
    'Allow location access to detect your current position.',
  'Eliminar gasto':
    'Delete expense',
  'este gasto':
    'this expense',
  'Monto total ({moneda})':
    'Total amount ({moneda})',
  'Pagó el total':
    'Paid the total',
  'Ya pagó su parte':
    'Already paid their share',
  'Todavía debe':
    'Still owes',
  'Al día':
    'All settled',
  'quien recibe':
    'the recipient',
  'Aprobado por {nombre}':
    'Approved by {nombre}',
  'Dividido entre {cantidad}':
    'Split between {cantidad}',
  'Ej: Viaje a la costa':
    'e.g. Beach trip',
  'Sesión o grupo ausente':
    'Missing session or group',
  'Correo no disponible':
    'Email unavailable',
  'Recordar saldo a {nombre}\n\nPresioná Aceptar para enviar por WhatsApp o Cancelar para enviar por E-mail.':
    'Remind {nombre} about the balance\n\nPress OK to send via WhatsApp or Cancel to send by email.',
  'Agregar a {nombre}':
    'Add {nombre}',
  'Gastos ({cantidad})':
    'Expenses ({cantidad})',
  'Ver detalle de {nombre}':
    'View details of {nombre}',
  'Pagó {nombre}':
    'Paid by {nombre}',
  'Con foto':
    'With photo',
  'Con ubicación':
    'With location',
  'Pagos registrados ({cantidad})':
    'Recorded payments ({cantidad})',
  'Con comprobante':
    'With receipt',
  'Deshacer':
    'Undo',
  'Gastos por categoría':
    'Expenses by category',
  'Distribución de gastos · {moneda}':
    'Expense breakdown · {moneda}',
  'Todavía no hay gastos para mostrar.':
    'There are no expenses to show yet.',
  'Crear un nuevo grupo':
    'Create a new group',
  'Elegí una deuda tuya desde el detalle del grupo.':
    'Choose one of your debts from the group details.',
  'No pudimos cargar la deuda.':
    'We couldn\'t load the debt.',
  'otro integrante':
    'another member',
  '{nombre} tiene que revisar el comprobante y aprobarlo.':
    '{nombre} needs to review the receipt and approve it.',
  'Le debés {monto} a {nombre} por "{grupo}".':
    'You owe {nombre} {monto} for "{grupo}".',
  'Te vamos a avisar en {segundos} segundos.':
    'We\'ll remind you in {segundos} seconds.',
  'Te vamos a avisar en una hora.':
    'We\'ll remind you in an hour.',
  'el grupo':
    'the group',
  'Le debés a {nombre}':
    'You owe {nombre}',
  '1 gasto':
    '1 expense',
  '{cantidad} gastos':
    '{cantidad} expenses',
  'Alias: {alias}':
    'Alias: {alias}',
  'Ya subiste un comprobante para esta deuda. {nombre} lo tiene que aprobar desde el detalle del pago.':
    'You already uploaded a receipt for this debt. {nombre} needs to approve it from the payment details.',
  'El acreedor':
    'The creditor',
  'Avisar por WhatsApp':
    'Notify via WhatsApp',
  'No se pudo leer a quién se le transfirió.':
    'Could not read who received the transfer.',
  'No se pudo leer el monto.':
    'Could not read the amount.',
  'No se pudo leer la fecha.':
    'Could not read the date.',
  'La fecha del comprobante es futura.':
    'The receipt date is in the future.',
  'Actualizado: {fecha}':
    'Updated: {fecha}',
  'Antes de comenzar':
    'Before you start',
  'Para utilizar Junti, necesitamos que leas y aceptes nuestros Términos y Condiciones de Uso':
    'To use Junti, please read and accept our Terms and Conditions of Use',
  'Términos y Condiciones de Uso':
    'Terms and Conditions of Use',
  'Verificando tu aceptación...':
    'Checking your acceptance...',
  'Reintentar verificación':
    'Retry verification',
  'Consultar los términos completos':
    'View the full terms',
  'Firebase no está configurado.':
    'Firebase is not configured.',
  'No hay una sesión autenticada para consultar los términos.':
    'There is no signed-in session to check the terms.',
  'Iniciá sesión para registrar la aceptación de los términos.':
    'Sign in to record your acceptance of the terms.',
  'Permití el acceso a la cámara para tomar la foto.':
    'Allow camera access to take the photo.',
  'Permití el acceso a tus fotos para elegir una imagen.':
    'Allow access to your photos to choose an image.',
  // Pagos para revisar
  'Si la apagás, Junti no muestra ninguna notificación.':
    'If you turn this off, Junti will not show any notifications.',
  'Pagos para revisar':
    'Payments to review',
  'Te avisa cuando alguien sube un comprobante que tenés que aprobar.':
    'Lets you know when someone uploads a receipt you need to approve.',
  'Tenés un pago para revisar':
    'You have a payment to review',
  'Tenés {cantidad} pagos para revisar':
    'You have {cantidad} payments to review',
  '{nombre} subió un comprobante en "{grupo}". Tocá para revisarlo.':
    '{nombre} uploaded a receipt in "{grupo}". Tap to review it.',
  '{nombre} subió un comprobante de {monto} en "{grupo}".':
    '{nombre} uploaded a receipt for {monto} in "{grupo}".',
  'Tenés {cantidad} comprobantes para aprobar.':
    'You have {cantidad} receipts to approve.',
  'Grupo': 'Group',
  'Los pagos para revisar se avisan cuando abrís la app.':
    'We let you know about payments to review when you open the app.',
}
const textosPt: Record<string, string> = {
  'Compartí los planes, organizá los gastos.': 'Compartilhe planos e organize despesas.',
  'Probá la app': 'Conheça o app',
  'Crear cuenta': 'Criar conta',
  'Iniciar sesión': 'Entrar',
  'Entrar con datos de ejemplo': 'Continuar com dados de exemplo',
  'Continuar con Google': 'Continuar com o Google',
  'o con correo y contraseña': 'ou com e-mail e senha',
  'Tu nombre': 'Seu nome',
  'Contraseña': 'Senha',
  'Mínimo 6 caracteres': 'Mínimo de 6 caracteres',
  'Crear mi cuenta': 'Criar minha conta',
  'Explorá grupos, gastos y deudas con datos de ejemplo. Tus cambios se guardan en este dispositivo.':
    'Explore grupos, despesas e saldos com dados de exemplo. Suas alterações são salvas neste dispositivo.',
  '¿Ya tenés cuenta? Iniciá sesión': 'Já tem uma conta? Entre',
  '¿No tenés cuenta todavía? Registrate gratis': 'Ainda não tem conta? Cadastre-se grátis',
  'El acceso a cuentas todavía no está configurado. Contactá al equipo para habilitarlo.':
    'O acesso às contas ainda não está configurado. Fale com a equipe para habilitá-lo.',
  'Iniciá sesión para ver tus amigos.': 'Entre para ver seus amigos.',
  'Amigos': 'Amigos',
  'Compartí gastos con tus amigos y gestioná sus solicitudes.':
    'Compartilhe despesas com seus amigos e gerencie as solicitações.',
  'Invitar por e-mail': 'Convidar por e-mail',
  'amigo@correo.com': 'amigo@exemplo.com',
  'Enviar solicitud': 'Enviar solicitação',
  'Actualizar amigos': 'Atualizar amigos',
  'Solicitudes pendientes': 'Solicitações pendentes',
  'No tenés solicitudes pendientes.': 'Você não tem solicitações pendentes.',
  'Aceptar solicitud': 'Aceitar solicitação',
  'Rechazar': 'Recusar',
  'Tus amigos': 'Seus amigos',
  'Todavía no tenés amigos. Enviá una solicitud para empezar.':
    'Você ainda não tem amigos. Envie uma solicitação para começar.',
  'Eliminar amigo': 'Remover amigo',
  'Solicitud enviada.': 'Solicitação enviada.',
  'Solicitud aceptada.': 'Solicitação aceita.',
  'Solicitud rechazada.': 'Solicitação recusada.',
  'Amigo eliminado.': 'Amigo removido.',
  'Ingresá un e-mail válido.': 'Digite um e-mail válido.',
  'Ingresá el e-mail de otra persona.': 'Digite o e-mail de outra pessoa.',
  'Esta persona ya está en tus amigos.': 'Essa pessoa já está entre seus amigos.',
  'No pudimos cargar tus amigos. Volvé a intentar.':
    'Não foi possível carregar seus amigos. Tente novamente.',
  'No se pudo completar la acción. Volvé a intentar.':
    'Não foi possível concluir a ação. Tente novamente.',
  'Un nuevo plan compartido': 'Um novo plano compartilhado',
  'Creá un grupo y elegí con quién vas a compartir los gastos.':
    'Crie um grupo e escolha com quem compartilhar as despesas.',
  'Nombre del grupo': 'Nome do grupo',
  'Moneda del grupo': 'Moeda do grupo',
  'Todos los gastos y saldos se expresarán en esta moneda.':
    'Todas as despesas e saldos serão expressos nesta moeda.',
  'Integrantes': 'Participantes',
  'Vos ya estás incluido.': 'Você já está incluído.',
  'Podés agregar amigos después desde el detalle del grupo.':
    'Você pode adicionar amigos depois nos detalhes do grupo.',
  'Ingresá un nombre para el grupo.': 'Digite um nome para o grupo.',
  'No pudimos crear el grupo. Revisá la conexión y volvé a intentar.':
    'Não foi possível criar o grupo. Verifique a conexão e tente novamente.',
  'Espacio compartido': 'Espaço compartilhado',
  'Mis grupos': 'Meus grupos',
  'Organizá los gastos y saldos con tu gente.':
    'Organize as despesas e os saldos com seu grupo.',
  'Tu próximo plan empieza acá': 'Seu próximo plano começa aqui',
  'Creá tu primer grupo para compartir los gastos de un viaje, la casa o una salida.':
    'Crie seu primeiro grupo para compartilhar as despesas de uma viagem, da casa ou de um passeio.',
  'No se pudo eliminar': 'Não foi possível excluir',
  'Revisá la conexión y volvé a intentar.':
    'Verifique sua conexão e tente novamente.',
  'Cargando tus grupos...': 'Carregando seus grupos...',
  'Cargar gasto': 'Adicionar despesa',
  'Saldar deuda': 'Quitar dívida',
  'Pagos registrados': 'Pagamentos registrados',
  'Editar gasto': 'Editar despesa',
  'Deshacer pago': 'Desfazer pagamento',
  'Transferencia': 'Transferência',
  'Ver comprobante': 'Ver comprovante',
  'Comprobante': 'Comprovante',
  'Comprobante de pago': 'Comprovante de pagamento',
  'Foto del gasto': 'Foto da despesa',
  'Foto del ticket o del lugar': 'Foto do recibo ou do local',
  'Ubicación': 'Localização',
  'Volver': 'Voltar',
  'Reintentar': 'Tentar novamente',
  'Ej: german123': 'Ex.: alex123',
  'Alias copiado.': 'Alias copiado.',
  'Monto copiado.': 'Valor copiado.',
  'Esta transferencia ya no está pendiente. Volvé al grupo para consultar el saldo actualizado.':
    'Esta transferência não está mais pendente. Volte ao grupo para consultar o saldo atualizado.',
  'Volver al grupo': 'Voltar ao grupo',
  'Actualizar': 'Atualizar',
  'No pudimos copiar el alias. Podés volver a intentarlo.':
    'Não foi possível copiar o alias. Você pode tentar novamente.',
  'No pudimos copiar el e-mail. Podés volver a intentarlo.':
    'Não foi possível copiar o e-mail. Você pode tentar novamente.',
  'Crear un grupo': 'Criar um grupo',
  'Punto en mapa': 'Ponto no mapa',
  'Tocá en el mapa para marcar el punto. Fuente: © OpenStreetMap, © CARTO.':
    'Toque no mapa para marcar o local. Mapa: © OpenStreetMap, © CARTO.',
  'Ya podés seguir usando Junti. Esta ayuda queda disponible cuando la necesites.':
    'Você pode continuar usando o Junti. A ajuda estará disponível quando precisar.',
  '¡Tutorial finalizado!': 'Tutorial concluído!',
  'Pendiente de aprobación': 'Aguardando aprovação',
  'Aprobado': 'Aprovado',
  'Rechazado': 'Recusado',
  'Comida': 'Comida',
  'Transporte': 'Transporte',
  'Alojamiento': 'Hospedagem',
  'Otro': 'Outro',
  'Iniciá sesión para crear un grupo.': 'Entre para criar um grupo.',
  'Ingresá una descripción.': 'Digite uma descrição.',
  'Ingresá un monto válido con hasta dos decimales.':
    'Digite um valor válido com até duas casas decimais.',
  'El monto debe ser mayor que cero y estar dentro del rango permitido.':
    'O valor deve ser maior que zero e estar dentro do limite permitido.',
  'Elegí un pagador del grupo.': 'Escolha quem pagou no grupo.',
  'Elegí al menos un participante del grupo.':
    'Escolha pelo menos um participante do grupo.',
  'No pudimos cargar tus grupos. Revisá la conexión y volvé a intentar.':
    'Não foi possível carregar seus grupos. Verifique a conexão e tente novamente.',
  'No pudimos cargar el grupo. Revisá la conexión y volvé a intentar.':
    'Não foi possível carregar o grupo. Verifique a conexão e tente novamente.',
  'No pudimos guardar el perfil. Tus datos anteriores se conservan; volvé a intentar.':
    'Não foi possível salvar seu perfil. Seus dados anteriores foram mantidos; tente novamente.',
  'Iniciá sesión para editar tu perfil.': 'Entre para editar seu perfil.',
  'Le debés a': 'Você deve para',
  'Transferí desde el banco o la billetera que quieras usando el alias o el e-mail. Después subí el comprobante para saldar la deuda en el grupo.':
    'Transfira de qualquer banco ou carteira digital usando o alias ou e-mail. Depois envie o comprovante para quitar a dívida no grupo.',
  'Copiar alias': 'Copiar alias',
  'Copiar monto': 'Copiar valor',
  'Recordarme pagar más tarde': 'Lembrar de pagar mais tarde',
  'Ya subiste un comprobante para esta deuda.':
    'Você já enviou um comprovante para esta dívida.',
  'lo tiene que aprobar desde el detalle del pago.':
    'precisa aprová-lo nos detalhes do pagamento.',
  'No pudimos autenticarte con Google.': 'Não foi possível autenticar com o Google.',
  'El inicio con Google no está disponible en este entorno.':
    'O acesso com Google não está disponível neste ambiente.',
  'No pudimos obtener las credenciales de Google.':
    'Não foi possível obter as credenciais do Google.',
  'El método de acceso todavía no está habilitado en Firebase.':
    'Este método de acesso ainda não está habilitado no Firebase.',
  'No pudimos ingresar. Revisá tus datos e intentá de nuevo.':
    'Não foi possível entrar. Verifique seus dados e tente novamente.',
  'E-mail:': 'E-mail:',
  'No tenemos el alias ni el e-mail del acreedor. Pedíselos antes de transferir.':
    'Não temos o alias nem o e-mail do credor. Peça antes de transferir.',
  '¿Deseás abrir WhatsApp para enviar el recordatorio del saldo pendiente?':
    'Deseja abrir o WhatsApp para enviar um lembrete sobre o saldo pendente?',
  'Abrir WhatsApp': 'Abrir WhatsApp',
  'Por E-mail': 'Por e-mail',
  'No pudimos abrir WhatsApp. Verificá que esté instalado.':
    'Não foi possível abrir o WhatsApp. Verifique se está instalado.',
  'Tenés una deuda pendiente': 'Você tem uma dívida pendente',
  '¿Ya transferiste?': 'Você já fez a transferência?',
  'Subí la captura o la foto del comprobante.':
    'Envie uma captura de tela ou foto do comprovante.',
  'Registrar pago con comprobante': 'Registrar pagamento com comprovante',
  'Pago en revisión': 'Pagamento em análise',
  'Pago verificado': 'Pagamento verificado',
  'Pago pendiente de aprobación': 'Pagamento aguardando aprovação',
  'El comprobante coincide con la deuda: quedó saldada.':
    'O comprovante corresponde à dívida: ela foi quitada.',
  'No se pudo verificar el comprobante automáticamente.':
    'Não foi possível verificar o comprovante automaticamente.',
  'Revisá el comprobante': 'Confira o comprovante',
  'Esperando que quien recibe lo apruebe': 'Aguardando aprovação de quem recebeu',
  'Aprobar: recibí el dinero': 'Aprovar: recebi o dinheiro',
  'Verificado automáticamente': 'Verificado automaticamente',
  'El destinatario, el monto y la fecha del comprobante coinciden con la deuda.':
    'O destinatário, o valor e a data do comprovante correspondem à dívida.',
  'Quien recibió el dinero revisó el comprobante y confirmó el pago.':
    'Quem recebeu o dinheiro conferiu o comprovante e confirmou o pagamento.',
  'Dividido entre': 'Dividido entre',
  'Abrir en Google Maps': 'Abrir no Google Maps',
  'Detectar mi ubicación GPS': 'Detectar minha localização GPS',
  'Marcar en el mapa': 'Marcar no mapa',
  'Quitar ubicación': 'Remover localização',
  'Guardar gasto': 'Salvar despesa',
  'Eliminar este gasto': 'Excluir esta despesa',
  'Tomar foto': 'Tirar foto',
  'Elegir foto': 'Escolher foto',
  'Elegir captura': 'Escolher captura de tela',
  'Quitar foto': 'Remover foto',
  '¿Qué compraste?': 'O que você comprou?',
  'Ej: Cena del viaje': 'Ex.: Jantar da viagem',
  'Categoría': 'Categoria',
  '¿Quién pagó?': 'Quem pagou?',
  'Foto del ticket o del lugar (opcional)': 'Foto do recibo ou local (opcional)',
  'Lugar o dirección (opcional)': 'Local ou endereço (opcional)',
  'Ej: Bar Central o Palermo': 'Ex.: Bar Central ou Palermo',
  'Elegí al menos un participante.': 'Escolha pelo menos um participante.',
  'No pudimos guardar el gasto. Volvé a intentar.':
    'Não foi possível salvar a despesa. Tente novamente.',
  'No pudimos eliminar el gasto. Volvé a intentar.':
    'Não foi possível excluir a despesa. Tente novamente.',
  'No pudimos obtener tu ubicación.': 'Não foi possível obter sua localização.',
  'No pudimos abrir la cámara o las fotos.':
    'Não foi possível abrir a câmera ou as fotos.',
  'No pudimos actualizar la cotización.': 'Não foi possível atualizar a cotação.',
  'Dólar hoy en Argentina': 'Cotação do dólar na Argentina hoje',
  'Cotizaciones oficiales y de mercado': 'Cotações oficiais e de mercado',
  'Actualizar cotización del dólar': 'Atualizar cotação do dólar',
  'Compra': 'Compra',
  'Venta': 'Venda',
  'Alias para transferencias': 'Alias para transferências',
  'Descripción breve': 'Descrição breve',
  'Contá algo sobre vos': 'Conte um pouco sobre você',
  'Guardar cambios': 'Salvar alterações',
  'Perfil guardado.': 'Perfil salvo.',
  'Mi perfil': 'Meu perfil',
  'No pudimos copiar el dato. Volvé a intentar.':
    'Não foi possível copiar os dados. Tente novamente.',
  'No pudimos registrar el pago. Volvé a intentar.':
    'Não foi possível registrar o pagamento. Tente novamente.',
  'No pudimos actualizar el pago. Volvé a intentar.':
    'Não foi possível atualizar o pagamento. Tente novamente.',
  'Activá las notificaciones para recibir el recordatorio.':
    'Ative as notificações para receber o lembrete.',
  'No pudimos programar el recordatorio.': 'Não foi possível agendar o lembrete.',
  'Este grupo no está disponible o ya no sos integrante.':
    'Este grupo não está disponível ou você não é mais participante.',
  'Gastos y saldos en un solo lugar': 'Despesas e saldos em um só lugar',
  'Total de gastos del grupo': 'Total de despesas do grupo',
  'Deudas simplificadas': 'Dívidas simplificadas',
  'Los saldos aparecerán al cargar el primer gasto.':
    'Os saldos aparecerão após adicionar a primeira despesa.',
  'Todo está saldado. No hay transferencias pendientes.':
    'Está tudo quitado. Não há transferências pendentes.',
  'Todavía no hay gastos. Cargá el primero para empezar.':
    'Ainda não há despesas. Adicione a primeira para começar.',
  'Términos y condiciones': 'Termos e condições',
  'Información de privacidad': 'Informações de privacidade',
  'Restaurando tu sesión...': 'Restaurando sua sessão...',
  'Cada grupo reúne a las personas y los gastos de un plan compartido. Abrí uno para ver sus movimientos y saldos.':
    'Cada grupo reúne as pessoas e as despesas de um plano compartilhado. Abra um para ver movimentações e saldos.',
  'Usá “Crear grupo” para ponerle un nombre, elegir la moneda y sumar integrantes disponibles.':
    'Use “Criar grupo” para dar um nome, escolher a moeda e adicionar participantes.',
  'Desde un grupo podés registrar qué se pagó, cuánto, quién pagó y entre quiénes se divide.':
    'Em um grupo, registre o que foi pago, quanto, quem pagou e como dividir.',
  'El detalle del grupo muestra sus gastos, el total por categoría y los saldos pendientes entre integrantes.':
    'Os detalhes do grupo mostram despesas, totais por categoria e saldos pendentes entre participantes.',
  'Elegí un nombre y, si querés, agregá una descripción para que todos reconozcan el grupo.':
    'Escolha um nome e, se quiser, adicione uma descrição para identificar o grupo.',
  'Seleccioná la moneda que usarán los gastos del grupo. Los movimientos se calculan en esa moneda.':
    'Selecione a moeda das despesas do grupo. As movimentações são calculadas nessa moeda.',
  'Podés invitar amistades disponibles al grupo. Después, cada gasto se divide entre las personas que selecciones.':
    'Você pode convidar amigos disponíveis para o grupo. Depois, cada despesa é dividida entre as pessoas selecionadas.',
  'El total y el gráfico resumen los gastos registrados. Tocá un movimiento para consultar su detalle y comprobante.':
    'O total e o gráfico resumem as despesas registradas. Toque em uma movimentação para ver detalhes e comprovante.',
  'La lista muestra quiénes participan. Si tenés amistades disponibles, podés agregarlas desde esta pantalla.':
    'A lista mostra os participantes. Se houver amigos disponíveis, você pode adicioná-los nesta tela.',
  'Los saldos indican quién debe y quién tiene que recibir según los gastos y pagos aprobados del grupo.':
    'Os saldos indicam quem deve e quem deve receber, com base nas despesas e pagamentos aprovados.',
  'Usá “Cargar gasto” para agregar un movimiento. Para saldar, transferí por fuera de Junti y cargá el comprobante.':
    'Use “Adicionar despesa” para registrar uma movimentação. Para quitar, transfira fora do Junti e envie o comprovante.',
  'Ingresá el concepto, el monto total y una de las categorías disponibles.':
    'Digite a descrição, o valor total e uma das categorias disponíveis.',
  'Seleccioná a la persona que hizo el pago. El pagador también forma parte del reparto.':
    'Selecione quem fez o pagamento. Essa pessoa também participa da divisão.',
  'Marcá los integrantes que comparten el gasto. Junti muestra cuánto corresponde a cada uno.':
    'Selecione os participantes que dividirão a despesa. O Junti mostra o valor de cada um.',
  'Podés adjuntar la foto del ticket y la ubicación cuando estén disponibles. Guardá el gasto para verlo en el grupo.':
    'Você pode anexar uma foto do recibo e a localização. Salve a despesa para vê-la no grupo.',
  'Acá ves el monto, la fecha, quién pagó y cómo se repartió el gasto entre los participantes.':
    'Aqui você vê o valor, a data, quem pagou e como a despesa foi dividida.',
  'Si se adjuntó una foto o captura, aparece en el detalle del movimiento para que puedas revisarla.':
    'Se uma foto ou captura foi anexada, ela aparece nos detalhes da movimentação.',
  'Los pagos pendientes esperan la revisión de quien recibió el dinero. Solo los pagos aprobados reducen la deuda.':
    'Pagamentos pendentes aguardam a análise de quem recebeu o dinheiro. Só pagamentos aprovados reduzem a dívida.',
  'La pantalla muestra el acreedor y el monto pendiente calculado para el grupo.':
    'A tela mostra o credor e o valor pendente calculado para o grupo.',
  'Copiá el alias o e-mail del acreedor y el monto. Junti no realiza transferencias ni administra dinero.':
    'Copie o alias ou e-mail do credor e o valor. O Junti não faz transferências nem administra dinheiro.',
  'Después de transferir, subí una foto o captura. El pago puede verificarse automáticamente o quedar pendiente de revisión.':
    'Depois de transferir, envie uma foto ou captura. O pagamento pode ser verificado automaticamente ou aguardar análise.',
  'Solo un pago aprobado salda la deuda. Si queda pendiente, quien recibió el dinero puede aprobarlo o rechazarlo.':
    'Só um pagamento aprovado quita a dívida. Se ficar pendente, quem recebeu pode aprovar ou rejeitar.',
  'Escribí el e-mail de otra persona y enviá una solicitud para compartir grupos y gastos.':
    'Digite o e-mail de outra pessoa e envie uma solicitação para compartilhar grupos e despesas.',
  'En solicitudes pendientes podés aceptar o rechazar invitaciones que recibiste.':
    'Em solicitações pendentes, você pode aceitar ou recusar convites recebidos.',
  'La lista de amigos muestra tus contactos aceptados. Desde allí también podés quitar una amistad.':
    'A lista de amigos mostra seus contatos aceitos. Você também pode remover uma amizade.',
  'El perfil muestra el nombre y el e-mail asociados a tu cuenta.':
    'O perfil mostra o nome e o e-mail associados à sua conta.',
  'Podés guardar un alias para que tus amistades sepan dónde transferirte cuando corresponda.':
    'Você pode salvar um alias para que seus amigos saibam para onde transferir.',
  'Editá los datos disponibles y tocá “Guardar cambios” para actualizar tu perfil.':
    'Edite os dados e toque em “Salvar alterações” para atualizar seu perfil.',
  'La pantalla indica la cuenta activa y permite cerrar sesión en este dispositivo.':
    'A tela mostra a conta ativa e permite sair neste dispositivo.',
  'En modo demo podés restablecer los grupos y gastos de prueba. Esta opción no aparece con una cuenta real.':
    'No modo demo, você pode restaurar grupos e despesas de teste. Essa opção não aparece em contas reais.',
  'Cerrar sesión no elimina tu cuenta ni tus datos guardados. Iniciá sesión de nuevo para continuar.':
    'Sair não exclui sua conta nem seus dados. Entre novamente para continuar.',
  'Crear grupo': 'Criar grupo',
  'Volver a intentar': 'Tentar novamente',
  'Eliminar grupo': 'Excluir grupo',
  'Cancelar': 'Cancelar',
  'Eliminar': 'Excluir',
  'Anterior': 'Anterior',
  'Siguiente': 'Próximo',
  'Finalizar': 'Concluir',
  'Cerrar': 'Fechar',
  'Ayuda interactiva': 'Ajuda interativa',
  'Confirmar punto': 'Confirmar local',
  'Marcar ubicación en el mapa': 'Marcar local no mapa',
  'Tocá cualquier punto del mapa para posicionar el marcador.':
    'Toque em qualquer ponto do mapa para posicionar o marcador.',
  // Centro de configuración
  'Gastos': 'Despesas',
  'Perfil': 'Perfil',
  'Configuración': 'Configurações',
  'Detalle del movimiento': 'Detalhes da movimentação',
  'Cuenta': 'Conta',
  'Preferencias': 'Preferências',
  'Información y protección': 'Informações e proteção',
  'Apariencia': 'Aparência',
  'Tema, fuente y tamaño de texto': 'Tema, fonte e tamanho do texto',
  'Idioma': 'Idioma',
  'Notificaciones': 'Notificações',
  'Administrá tus preferencias': 'Gerencie suas preferências',
  'Moneda preferida': 'Moeda preferida',
  'Sugerencia al crear nuevos grupos': 'Sugestão ao criar novos grupos',
  'Privacidad': 'Privacidade',
  'Datos, visibilidad y consentimientos': 'Dados, visibilidade e consentimentos',
  'Seguridad': 'Segurança',
  'Sesión, contraseña y acceso a la cuenta': 'Sessão, senha e acesso à conta',
  'Contraste, animaciones y legibilidad': 'Contraste, animações e legibilidade',
  'Acerca de Junti': 'Sobre o Junti',
  'Versión, documentos e información': 'Versão, documentos e informações',
  'Estás usando el modo demo. Tus preferencias se guardan en este dispositivo.': 'Você está usando o modo de demonstração. As preferências são salvas neste dispositivo.',
  'Modo demo': 'Modo de demonstração',
  'Restablecer datos de ejemplo': 'Restaurar dados de exemplo',
  'Restablecer datos': 'Restaurar dados',
  'Se borrarán los cambios realizados en el modo demo de este dispositivo. ¿Continuar?': 'As alterações feitas nos dados de demonstração deste dispositivo serão apagadas. Continuar?',
  'Restablecer': 'Restaurar',
  'Datos de ejemplo restablecidos.': 'Os dados de exemplo foram restaurados.',
  'No pudimos restablecer los datos de ejemplo.': 'Não foi possível restaurar os dados de exemplo.',
  'Tema': 'Tema',
  'Claro': 'Claro',
  'Oscuro': 'Escuro',
  'Automático': 'Automático',
  'Usa la preferencia del dispositivo': 'Usa a preferência do dispositivo',
  'Tipografía': 'Tipografia',
  'Predeterminada del sistema': 'Padrão do sistema',
  'Serif': 'Serifada',
  'Monoespaciada': 'Monoespaçada',
  'Vista previa: Gastos compartidos': 'Prévia: Despesas compartilhadas',
  'Tamaño del texto': 'Tamanho do texto',
  'Muy pequeño': 'Muito pequeno',
  'Pequeño': 'Pequeno',
  'Normal': 'Normal',
  'Grande': 'Grande',
  'Muy grande': 'Muito grande',
  'Restablecer tamaño': 'Restaurar tamanho',
  'Accesibilidad': 'Acessibilidade',
  'Aumentar contraste': 'Aumentar contraste',
  'Refuerza el contraste de textos, bordes y superficies.': 'Aumenta o contraste de textos, bordas e superfícies.',
  'Reducir animaciones': 'Reduzir animações',
  'Desactiva las transiciones de navegación de la app.': 'Desativa as transições de navegação do app.',
  'Respetar el sistema': 'Respeitar o sistema',
  'Reduce las animaciones cuando el dispositivo lo indique.': 'Reduz animações quando o dispositivo solicitar.',
  'Mejorar legibilidad': 'Melhorar legibilidade',
  'Usa texto más legible y aumenta el espacio de línea.': 'Usa texto mais legível e aumenta o espaçamento entre linhas.',
  'Destacar controles': 'Destacar controles',
  'Marca con claridad los elementos interactivos.': 'Destaca os elementos interativos.',
  'Controles más grandes': 'Controles maiores',
  'Aumenta el área táctil de botones y filas.': 'Aumenta a área de toque de botões e linhas.',
  'Los controles mantienen un indicador de foco visible al navegar con teclado.': 'Os controles mantêm um indicador de foco visível ao navegar com o teclado.',
  'Español': 'Español',
  'English': 'English',
  'Português': 'Português',
  'Los textos sin traducción disponible se muestran en español.': 'Os textos sem tradução disponível são exibidos em espanhol.',
  'Notificaciones generales': 'Notificações gerais',
  'Actividad de la cuenta': 'Atividade da conta',
  'Recordatorios': 'Lembretes',
  'Actividad del grupo': 'Atividade do grupo',
  'Novedades': 'Novidades',
  'Actualizaciones': 'Atualizações',
  'Alertas importantes': 'Alertas importantes',
  'Preferencia guardada para futuras notificaciones.': 'Preferência salva para futuras notificações.',
  'Preferencia guardada para futuras alertas de cuenta.': 'Preferência salva para futuros alertas da conta.',
  'Permite programar recordatorios de pago en este dispositivo.': 'Permite programar lembretes de pagamento neste dispositivo.',
  'Preferencia guardada para futuras alertas de grupos.': 'Preferência salva para futuros alertas dos grupos.',
  'Preferencia guardada para futuras novedades.': 'Preferência salva para futuras novidades.',
  'Preferencia guardada para futuras actualizaciones.': 'Preferência salva para futuras atualizações.',
  'Preferencia guardada para futuras alertas.': 'Preferência salva para futuros alertas.',
  'No pudimos cancelar los recordatorios programados. Volvé a intentar.': 'Não foi possível cancelar os lembretes programados. Tente novamente.',
  'La programación de notificaciones no está disponible en la versión web.': 'A programação de notificações não está disponível na versão web.',
  'Los recordatorios se programan localmente cuando elegís “Recordarme pagar más tarde”. Al desactivarlos se cancelan los recordatorios pendientes de la app.': 'Os lembretes são programados localmente quando você escolhe “Lembrar de pagar mais tarde”. Desativá-los cancela os lembretes pendentes do app.',
  'Todas las opciones se guardan en este dispositivo.': 'Todas as opções são salvas neste dispositivo.',
  'Estas preferencias no se sincronizan con otros dispositivos.': 'Estas preferências não são sincronizadas entre dispositivos.',
  'Información que guarda la app': 'Informações salvas pelo app',
  'Junti guarda los datos del perfil y la información de grupos, movimientos y comprobantes necesarios para sus funciones. Las preferencias de configuración y moneda se guardan en este dispositivo; no se sincronizan entre dispositivos.': 'O Junti salva os dados do perfil e as informações de grupos, transações e comprovantes necessários para suas funções. As preferências são salvas neste dispositivo e não são sincronizadas entre dispositivos.',
  'Revisá el documento y el tratamiento de datos': 'Consulte o documento e o tratamento de dados',
  'Datos del perfil': 'Dados do perfil',
  'El perfil se administra desde la pestaña Perfil': 'Gerencie o perfil na aba Perfil',
  'Controles disponibles': 'Controles disponíveis',
  'Actualmente no hay controles para cambiar la visibilidad del perfil, exportar o borrar todos los datos, administrar sesiones remotas ni revocar la aceptación de los términos desde la app. No se muestran opciones que prometan esos controles.': 'Atualmente, o app não permite alterar a visibilidade do perfil, exportar ou apagar todos os dados, gerenciar sessões remotas ou revogar a aceitação dos termos. Não são exibidos controles para recursos indisponíveis.',
  'Sesión de demostración': 'Sessão de demonstração',
  'Sesión actual': 'Sessão atual',
  'Sin correo disponible': 'Nenhum e-mail disponível',
  'Restablecer contraseña': 'Redefinir senha',
  'Enviaremos un enlace a tu correo': 'Enviaremos um link para seu e-mail',
  'Disponible para cuentas con e-mail y contraseña': 'Disponível para contas com e-mail e senha',
  'Sesiones y métodos de acceso': 'Sessões e métodos de acesso',
  'La app muestra y cierra la sesión de este dispositivo. La administración de sesiones remotas no está disponible. Si ingresaste con Google, la contraseña se administra desde tu cuenta de Google.': 'O app mostra e encerra a sessão deste dispositivo. O gerenciamento de sessões remotas não está disponível. Se você entrou com o Google, gerencie a senha na sua conta Google.',
  'Cerrar sesión': 'Sair da conta',
  'Enviamos un enlace para restablecer la contraseña a {email}.': 'Enviamos um link para redefinir a senha para {email}.',
  'No pudimos enviar el enlace. Revisá tu conexión e intentá otra vez.': 'Não foi possível enviar o link. Verifique a conexão e tente novamente.',
  'No pudimos cerrar la sesión. Volvé a intentar.': 'Não foi possível sair da conta. Tente novamente.',
  '¿Querés salir de tu cuenta en este dispositivo?': 'Quer sair da sua conta neste dispositivo?',
  'Salir': 'Sair',
  'Aplicación para organizar gastos compartidos y consultar saldos.': 'Aplicativo para organizar despesas compartilhadas e consultar saldos.',
  'Versión {version}': 'Versão {version}',
  'Datos y controles disponibles': 'Dados e controles disponíveis',
  'Sin sesión activa': 'Nenhuma sessão ativa',
  'Pesos argentinos (ARS)': 'Pesos argentinos (ARS)',
  'Dólares (USD)': 'Dólares americanos (USD)',
  'Reales brasileños (BRL)': 'Reais brasileiros (BRL)',
  'La moneda preferida se usa como sugerencia al crear nuevos grupos. Los grupos existentes no se modifican.': 'A moeda preferida é sugerida ao criar novos grupos. Os grupos existentes não são alterados.',
  'No pudimos registrar tu aceptación. Revisá tu conexión e intentá nuevamente.': 'Não foi possível registrar sua aceitação. Verifique sua conexão e tente novamente.',
  // Textos com variáveis
  '¿Eliminar a {nombre} de tus amigos?': 'Remover {nombre} dos seus amigos?',
  'Eliminar a {nombre}': 'Remover {nombre}',
  'Agregar a {nombre} al grupo': 'Adicionar {nombre} ao grupo',
  '¿Eliminar “{nombre}” y todos sus gastos? Esta acción no se puede deshacer.':
    'Excluir “{nombre}” e todas as despesas? Esta ação não pode ser desfeita.',
  '¿Eliminar “{nombre}”? Esta acción no se puede deshacer.':
    'Excluir “{nombre}”? Esta ação não pode ser desfeita.',
  '¿Seguro que querés eliminar “{nombre}”? Esta acción no se puede deshacer.':
    'Excluir “{nombre}”? Esta ação não pode ser desfeita.',
  '¿Deshacer “{nombre}”? Se borra el pago y su comprobante.':
    'Desfazer “{nombre}”? O pagamento e o comprovante serão excluídos.',
  'Recordar a {nombre}': 'Lembrar {nombre}',
  'Cada participante: {monto}': 'Cada participante: {monto}',
  '1 grupo': '1 grupo',
  '{cantidad} grupos': '{cantidad} grupos',
  '1 integrante · {moneda}': '1 participante · {moneda}',
  '{cantidad} integrantes · {moneda}': '{cantidad} participantes · {moneda}',
  'Paso {actual} de {total}': 'Etapa {actual} de {total}',
  // Completado de traducciones
  'Monto total':
    'Valor total',
  'Dividir entre':
    'Dividir entre',
  'Cargando':
    'Carregando',
  'Paso':
    'Etapa',
  'Alias:':
    'Alias:',
  'Foto de':
    'Foto de',
  'Agregar':
    'Adicionar',
  'E-mail copiado.':
    'E-mail copiado.',
  'Controles':
    'Controles',
  'Fuente: © OpenStreetMap, © CARTO.':
    'Dados do mapa: © OpenStreetMap, © CARTO.',
  'Nombre':
    'Nome',
  'Aceptar':
    'Aceitar',
  'Guardar':
    'Salvar',
  'Alias copiado':
    'Alias copiado',
  'Monto copiado':
    'Valor copiado',
  'WhatsApp no disponible':
    'WhatsApp indisponível',
  'No tenemos registrado el e-mail':
    'Não temos o e-mail registrado',
  'No pudimos abrir WhatsApp. Verificá que esté instalado en tu dispositivo.':
    'Não foi possível abrir o WhatsApp. Verifique se ele está instalado no seu dispositivo.',
  'No pudimos abrir tu aplicación de correo.':
    'Não foi possível abrir seu aplicativo de e-mail.',
  'E-mail no disponible':
    'E-mail indisponível',
  'No pudimos cargar el formulario.':
    'Não foi possível carregar o formulário.',
  'No pudimos cargar el movimiento.':
    'Não foi possível carregar a movimentação.',
  'El movimiento ya no existe.':
    'Esta movimentação não existe mais.',
  'El gasto ya no está disponible.':
    'Esta despesa não está mais disponível.',
  'El grupo no está disponible.':
    'Este grupo não está disponível.',
  'Ya no sos integrante de este grupo.':
    'Você não faz mais parte deste grupo.',
  'Aceptar y continuar':
    'Aceitar e continuar',
  'No se pudo verificar la aceptación de los términos.':
    'Não foi possível verificar a aceitação dos termos.',
  'Iniciá sesión para aceptar los términos.':
    'Entre para aceitar os termos.',
  'La sesión cambió antes de registrar la aceptación.':
    'A sessão mudou antes de registrar a aceitação.',
  'Cerrar términos completos':
    'Fechar termos completos',
  '¿Eliminar':
    'Excluir?',
  'No se pudo guardar':
    'Não foi possível salvar',
  'Las preferencias de configuración y moneda se guardan en este dispositivo; no se sincronizan entre dispositivos.':
    'As preferências de configuração e moeda são salvas neste dispositivo e não são sincronizadas entre dispositivos.',
  'No se muestran opciones que prometan esos controles.':
    'O app não mostra controles para recursos indisponíveis.',
  'Usá las pestañas para ir a Gastos, Amigos, Perfil y Configuración.':
    'Use as abas para ir a Despesas, Amigos, Perfil e Configurações.',
  'Creá un grupo, sumá integrantes y registrá los gastos que quieran dividir.':
    'Crie um grupo, adicione participantes e registre as despesas que querem dividir.',
  'Los saldos resumen los gastos y pagos registrados. Las transferencias se hacen fuera de Junti.':
    'Os saldos resumem as despesas e pagamentos registrados. As transferências são feitas fora do Junti.',
  'Página no encontrada':
    'Página não encontrada',
  'No encontramos esta pantalla':
    'Não encontramos esta tela',
  'El enlace puede haber cambiado. Volvé al inicio para continuar.':
    'O link pode ter mudado. Volte ao início para continuar.',
  'Volver al inicio':
    'Voltar ao início',
  'dólar oficial':
    'dólar oficial',
  'real brasileño':
    'real brasileiro',
  'Mapa':
    'Mapa',
  'Cerrar mapa':
    'Fechar mapa',
  'Coordenadas: {lat}, {lng}':
    'Coordenadas: {lat}, {lng}',
  'Solicitudes pendientes ({cantidad})':
    'Solicitações pendentes ({cantidad})',
  'Tus amigos ({cantidad})':
    'Seus amigos ({cantidad})',
  'Logotipo de Junti':
    'Logotipo do Junti',
  'Ingresá un correo electrónico válido.':
    'Informe um e-mail válido.',
  'Ingresá tu contraseña.':
    'Informe sua senha.',
  'Ingresá tu nombre para crear la cuenta.':
    'Informe seu nome para criar a conta.',
  'La contraseña debe tener al menos 6 caracteres.':
    'A senha deve ter pelo menos 6 caracteres.',
  'No pudimos conectarnos. Revisá tu conexión a internet.':
    'Não foi possível conectar. Verifique sua conexão com a internet.',
  'Ese correo ya está registrado. Probá iniciando sesión.':
    'Esse e-mail já está cadastrado. Tente entrar.',
  'El formato del correo electrónico no es válido.':
    'O formato do e-mail não é válido.',
  'Datos incorrectos. Revisá tu correo y contraseña o registrate.':
    'Dados incorretos. Verifique seu e-mail e senha ou cadastre-se.',
  'La contraseña es muy débil. Usá al menos 6 caracteres.':
    'A senha é muito fraca. Use pelo menos 6 caracteres.',
  'Ingresá un correo válido para enviarte el enlace.':
    'Informe um e-mail válido para enviarmos o link.',
  'La recuperación por correo no está configurada en este entorno.':
    'A recuperação por e-mail não está configurada neste ambiente.',
  'Si el correo está registrado, vas a recibir un enlace para restablecer tu contraseña.':
    'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.',
  'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.':
    'Não foi possível conectar. Verifique sua conexão e tente novamente.',
  'Hubo demasiados intentos. Esperá un momento y volvé a probar.':
    'Muitas tentativas. Aguarde um momento e tente novamente.',
  'No pudimos enviar el enlace. Revisá el correo e intentá de nuevo.':
    'Não foi possível enviar o link. Verifique o e-mail e tente novamente.',
  'Conocé Junti':
    'Conheça o Junti',
  'Bienvenido a Junti':
    'Boas-vindas ao Junti',
  'Qué bueno tenerte de vuelta':
    'Que bom ter você de volta',
  'Creá tu cuenta y empezá a dividir gastos.':
    'Crie sua conta e comece a dividir despesas.',
  'Tus planes y gastos compartidos te esperan.':
    'Seus planos e despesas compartilhadas esperam por você.',
  'Empezá a organizar los gastos de tus planes.':
    'Comece a organizar as despesas dos seus planos.',
  'Ingresá para continuar con tus grupos.':
    'Entre para continuar com seus grupos.',
  'Ej: Germán Morales':
    'Ex.: Ana Souza',
  'Correo electrónico':
    'E-mail',
  'Tu contraseña':
    'Sua senha',
  'Ocultar contraseña':
    'Ocultar senha',
  'Mostrar contraseña':
    'Mostrar senha',
  'Enviando enlace…':
    'Enviando link…',
  '¿Olvidaste tu contraseña?':
    'Esqueceu sua senha?',
  'Un momento…':
    'Um momento…',
  '¿Ya tenés una cuenta? ':
    'Já tem uma conta? ',
  '¿No tenés una cuenta? ':
    'Não tem uma conta? ',
  'Iniciá sesión':
    'Entrar',
  'Registrate':
    'Cadastre-se',
  'Leer Términos y Condiciones':
    'Ler Termos e Condições',
  'Términos y Condiciones':
    'Termos e Condições',
  'Cerrar términos y condiciones':
    'Fechar termos e condições',
  'Abrir ayuda: {titulo}':
    'Abrir ajuda: {titulo}',
  'Cerrar ayuda':
    'Fechar ajuda',
  'Cerrar tutorial':
    'Fechar tutorial',
  'No disponible':
    'Indisponível',
  'No se pudo recuperar el perfil demo.':
    'Não foi possível restaurar o perfil de demonstração.',
  'Iniciá sesión para cargar gastos.':
    'Entre para adicionar despesas.',
  'Permití el acceso a la ubicación para detectar tu posición actual.':
    'Permita o acesso à localização para detectar sua posição atual.',
  'Eliminar gasto':
    'Excluir despesa',
  'este gasto':
    'esta despesa',
  'Monto total ({moneda})':
    'Valor total ({moneda})',
  'Pagó el total':
    'Pagou o total',
  'Ya pagó su parte':
    'Já pagou sua parte',
  'Todavía debe':
    'Ainda deve',
  'Al día':
    'Em dia',
  'quien recibe':
    'quem recebe',
  'Aprobado por {nombre}':
    'Aprovado por {nombre}',
  'Dividido entre {cantidad}':
    'Dividido entre {cantidad}',
  'Ej: Viaje a la costa':
    'Ex.: Viagem para a praia',
  'Sesión o grupo ausente':
    'Sessão ou grupo ausente',
  'Correo no disponible':
    'E-mail indisponível',
  'Recordar saldo a {nombre}\n\nPresioná Aceptar para enviar por WhatsApp o Cancelar para enviar por E-mail.':
    'Lembrar {nombre} do saldo\n\nToque em OK para enviar pelo WhatsApp ou em Cancelar para enviar por e-mail.',
  'Agregar a {nombre}':
    'Adicionar {nombre}',
  'Gastos ({cantidad})':
    'Despesas ({cantidad})',
  'Ver detalle de {nombre}':
    'Ver detalhes de {nombre}',
  'Pagó {nombre}':
    'Pago por {nombre}',
  'Con foto':
    'Com foto',
  'Con ubicación':
    'Com localização',
  'Pagos registrados ({cantidad})':
    'Pagamentos registrados ({cantidad})',
  'Con comprobante':
    'Com comprovante',
  'Deshacer':
    'Desfazer',
  'Gastos por categoría':
    'Despesas por categoria',
  'Distribución de gastos · {moneda}':
    'Distribuição de despesas · {moneda}',
  'Todavía no hay gastos para mostrar.':
    'Ainda não há despesas para mostrar.',
  'Crear un nuevo grupo':
    'Criar um novo grupo',
  'Elegí una deuda tuya desde el detalle del grupo.':
    'Escolha uma de suas dívidas nos detalhes do grupo.',
  'No pudimos cargar la deuda.':
    'Não foi possível carregar a dívida.',
  'otro integrante':
    'outro participante',
  '{nombre} tiene que revisar el comprobante y aprobarlo.':
    '{nombre} precisa revisar o comprovante e aprová-lo.',
  'Le debés {monto} a {nombre} por "{grupo}".':
    'Você deve {monto} a {nombre} em "{grupo}".',
  'Te vamos a avisar en {segundos} segundos.':
    'Vamos avisar em {segundos} segundos.',
  'Te vamos a avisar en una hora.':
    'Vamos avisar em uma hora.',
  'el grupo':
    'o grupo',
  'Le debés a {nombre}':
    'Você deve a {nombre}',
  '1 gasto':
    '1 despesa',
  '{cantidad} gastos':
    '{cantidad} despesas',
  'Alias: {alias}':
    'Alias: {alias}',
  'Ya subiste un comprobante para esta deuda. {nombre} lo tiene que aprobar desde el detalle del pago.':
    'Você já enviou um comprovante para esta dívida. {nombre} precisa aprová-lo nos detalhes do pagamento.',
  'El acreedor':
    'O credor',
  'Avisar por WhatsApp':
    'Avisar pelo WhatsApp',
  'No se pudo leer a quién se le transfirió.':
    'Não foi possível ler quem recebeu a transferência.',
  'No se pudo leer el monto.':
    'Não foi possível ler o valor.',
  'No se pudo leer la fecha.':
    'Não foi possível ler a data.',
  'La fecha del comprobante es futura.':
    'A data do comprovante é futura.',
  'Actualizado: {fecha}':
    'Atualizado: {fecha}',
  'Antes de comenzar':
    'Antes de começar',
  'Para utilizar Junti, necesitamos que leas y aceptes nuestros Términos y Condiciones de Uso':
    'Para usar o Junti, precisamos que você leia e aceite nossos Termos e Condições de Uso',
  'Términos y Condiciones de Uso':
    'Termos e Condições de Uso',
  'Verificando tu aceptación...':
    'Verificando sua aceitação...',
  'Reintentar verificación':
    'Tentar verificar novamente',
  'Consultar los términos completos':
    'Consultar os termos completos',
  'Firebase no está configurado.':
    'O Firebase não está configurado.',
  'No hay una sesión autenticada para consultar los términos.':
    'Não há uma sessão autenticada para consultar os termos.',
  'Iniciá sesión para registrar la aceptación de los términos.':
    'Entre para registrar a aceitação dos termos.',
  'Permití el acceso a la cámara para tomar la foto.':
    'Permita o acesso à câmera para tirar a foto.',
  'Permití el acceso a tus fotos para elegir una imagen.':
    'Permita o acesso às suas fotos para escolher uma imagem.',
  // Pagos para revisar
  'Si la apagás, Junti no muestra ninguna notificación.':
    'Se você desativar, o Junti não mostrará nenhuma notificação.',
  'Pagos para revisar':
    'Pagamentos para revisar',
  'Te avisa cuando alguien sube un comprobante que tenés que aprobar.':
    'Avisa quando alguém envia um comprovante que você precisa aprovar.',
  'Tenés un pago para revisar':
    'Você tem um pagamento para revisar',
  'Tenés {cantidad} pagos para revisar':
    'Você tem {cantidad} pagamentos para revisar',
  '{nombre} subió un comprobante en "{grupo}". Tocá para revisarlo.':
    '{nombre} enviou um comprovante em "{grupo}". Toque para revisar.',
  '{nombre} subió un comprobante de {monto} en "{grupo}".':
    '{nombre} enviou um comprovante de {monto} em "{grupo}".',
  'Tenés {cantidad} comprobantes para aprobar.':
    'Você tem {cantidad} comprovantes para aprovar.',
  'Grupo': 'Grupo',
  'Los pagos para revisar se avisan cuando abrís la app.':
    'Os pagamentos para revisar são avisados quando você abre o app.',
}

const textosAyudaEn: Record<string, string> = {
  'Grupos y gastos': 'Groups and expenses',
  'Tus grupos, en un solo lugar': 'Your groups, all in one place',
  'Creá un grupo': 'Create a group',
  'Cargá un gasto': 'Add an expense',
  'Consultá la actividad': 'Review activity',
  'Crear un grupo': 'Create a group',
  'Identificá el plan': 'Name the plan',
  'Definí la moneda': 'Choose a currency',
  'Sumá integrantes': 'Add members',
  'Detalle del grupo': 'Group details',
  'Revisá los gastos': 'Review expenses',
  'Administrá integrantes': 'Manage members',
  'Entendé los saldos': 'Understand balances',
  'Registrá un gasto o pago': 'Record an expense or payment',
  'Cargar un gasto': 'Add an expense',
  'Describí el gasto': 'Describe the expense',
  'Indicá quién pagó': 'Select who paid',
  'Elegí cómo dividirlo': 'Choose how to split it',
  'Agregá respaldo y guardá': 'Attach a receipt and save',
  'Detalle y comprobantes': 'Details and receipts',
  'Consultá el movimiento': 'Review the transaction',
  'Abrí el comprobante': 'Open the receipt',
  'Revisá el estado de un pago': 'Review payment status',
  'Saldar una deuda': 'Settle a debt',
  'Revisá a quién y cuánto': 'Check who to pay and how much',
  'Transferí desde tu banco': 'Transfer from your bank',
  'Adjuntá el comprobante': 'Attach the receipt',
  'Confirmá el saldo': 'Confirm the balance',
  'Amigos y solicitudes': 'Friends and requests',
  'Invitá por e-mail': 'Invite by email',
  'Respondé solicitudes': 'Respond to requests',
  'Administrá tus amistades': 'Manage your friends',
  'Tu perfil': 'Your profile',
  'Revisá tus datos': 'Review your details',
  'Actualizá tu alias': 'Update your alias',
  'Guardá los cambios': 'Save changes',
  'Configuración': 'Settings',
  'Gestioná tu sesión': 'Manage your session',
  'Datos de ejemplo': 'Sample data',
  'Volvé cuando quieras': 'Come back anytime',
  'Ayuda de Junti': 'Junti help',
  'Movete por la app': 'Navigate the app',
  'Compartí gastos': 'Share expenses',
  'Consultá tus saldos': 'Review your balances',
}

const textosAyudaPt: Record<string, string> = {
  'Grupos y gastos': 'Grupos e despesas',
  'Tus grupos, en un solo lugar': 'Seus grupos em um só lugar',
  'Creá un grupo': 'Criar um grupo',
  'Cargá un gasto': 'Adicionar uma despesa',
  'Consultá la actividad': 'Consultar atividades',
  'Crear un grupo': 'Criar um grupo',
  'Identificá el plan': 'Identifique o plano',
  'Definí la moneda': 'Defina a moeda',
  'Sumá integrantes': 'Adicionar participantes',
  'Detalle del grupo': 'Detalhes do grupo',
  'Revisá los gastos': 'Confira as despesas',
  'Administrá integrantes': 'Gerencie participantes',
  'Entendé los saldos': 'Entenda os saldos',
  'Registrá un gasto o pago': 'Registrar despesa ou pagamento',
  'Cargar un gasto': 'Adicionar uma despesa',
  'Describí el gasto': 'Descreva a despesa',
  'Indicá quién pagó': 'Indique quem pagou',
  'Elegí cómo dividirlo': 'Escolha como dividir',
  'Agregá respaldo y guardá': 'Anexe o comprovante e salve',
  'Detalle y comprobantes': 'Detalhes e comprovantes',
  'Consultá el movimiento': 'Consulte a movimentação',
  'Abrí el comprobante': 'Abra o comprovante',
  'Revisá el estado de un pago': 'Confira o status do pagamento',
  'Saldar una deuda': 'Quitar uma dívida',
  'Revisá a quién y cuánto': 'Confira para quem e quanto pagar',
  'Transferí desde tu banco': 'Transfira pelo seu banco',
  'Adjuntá el comprobante': 'Anexe o comprovante',
  'Confirmá el saldo': 'Confirme o saldo',
  'Amigos y solicitudes': 'Amigos e solicitações',
  'Invitá por e-mail': 'Convide por e-mail',
  'Respondé solicitudes': 'Responda às solicitações',
  'Administrá tus amistades': 'Gerencie suas amizades',
  'Tu perfil': 'Seu perfil',
  'Revisá tus datos': 'Confira seus dados',
  'Actualizá tu alias': 'Atualize seu alias',
  'Guardá los cambios': 'Salve as alterações',
  'Configuración': 'Configurações',
  'Gestioná tu sesión': 'Gerencie sua sessão',
  'Datos de ejemplo': 'Dados de exemplo',
  'Volvé cuando quieras': 'Volte quando quiser',
  'Ayuda de Junti': 'Ajuda do Junti',
  'Movete por la app': 'Navegue pelo app',
  'Compartí gastos': 'Compartilhe despesas',
  'Consultá tus saldos': 'Consulte seus saldos',
}

export type Valores = Record<string, string | number>

function interpolar(texto: string, valores?: Valores) {
  if (!valores) return texto
  return texto.replace(/\{(\w+)\}/g, (marca, nombre: string) =>
    nombre in valores ? String(valores[nombre]) : marca,
  )
}

/**
 * Traduce un texto escrito en español. La frase en español es la clave del
 * diccionario; las partes variables se escriben como {nombre} y se completan
 * con `valores`. Si no hay traducción, se usa el español.
 */
/** Diccionarios por idioma, exportados para verificarlos en los tests. */
export const DICCIONARIOS = {
  en: { ...textosEn, ...textosAyudaEn },
  pt: { ...textosPt, ...textosAyudaPt },
}

export function traducirTexto(
  idioma: Idioma,
  texto: string,
  valores?: Valores,
): string {
  if (idioma === 'es') return interpolar(texto, valores)
  return interpolar(DICCIONARIOS[idioma][texto] ?? texto, valores)
}

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
  'Dólares estadounidenses (USD)': 'US dollars (USD)',
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
  'No pudimos copiar el dato. Podés volver a intentarlo.':
    'Could not copy the information. You can try again.',
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
  'Listo': 'Done',
  'Nombre': 'Name',
  'Aceptar': 'Accept',
  'Guardar': 'Save',
  'Foto de perfil': 'Profile photo',
  'Todavía no hay amigos. Enviá una solicitud para empezar.':
    'You have no friends yet. Send a request to get started.',
  'Monto copiado.': 'Amount copied.',
  'Alias copiado': 'Alias copied',
  'Monto copiado': 'Amount copied',
  'No pudimos guardar el perfil. Tus datos anteriores se conservan; volvé a intentar.':
    'Could not save your profile. Your previous details are unchanged; please try again.',
  'No pudimos obtener la ubicación.': 'Could not get your location.',
  'No pudimos abrir la aplicación de correo.':
    'Could not open your email app.',
  'No tenemos registrado el e-mail de la persona.':
    'We do not have this person’s email address.',
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
  'No pudimos actualizar el perfil.': 'Could not update the profile.',
  'No pudimos eliminar el gasto. Volvé a intentar.':
    'Could not delete the expense. Please try again.',
  'Ubicación actual': 'Current location',
  'Otro integrante': 'Another member',
  'Tu cuenta': 'Your account',
  'Todos los derechos reservados.': 'All rights reserved.',
  'Términos completos': 'Full terms',
  'Aceptar y continuar': 'Accept and continue',
  'Debés aceptar los términos para continuar.':
    'You must accept the terms to continue.',
  'No se pudo verificar la aceptación de los términos.':
    'Could not verify acceptance of the terms.',
  'Iniciá sesión para aceptar los términos.':
    'Sign in to accept the terms.',
  'La sesión cambió antes de registrar la aceptación.':
    'The session changed before acceptance could be recorded.',
  'Cerrar términos completos': 'Close full terms',
  '¿Eliminar': 'Delete?',
  'No se pudo guardar': 'Could not save',
  'No pudimos cargar el detalle del grupo.':
    'Could not load the group details.',
  'Recordatorio programado': 'Reminder scheduled',
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

export function traducirTexto(idioma: Idioma, texto: string): string {
  if (idioma === 'es') return texto

  const traducciones = idioma === 'en' ? textosEn : textosPt
  const ayuda = idioma === 'en' ? textosAyudaEn : textosAyudaPt
  const exacta = traducciones[texto] ?? ayuda[texto]
  if (exacta) return exacta

  const eliminarAmigo = texto.match(/^¿Eliminar a (.+) de tus amigos\?$/)
  if (eliminarAmigo) {
    return idioma === 'en'
      ? `Remove ${eliminarAmigo[1]} from your friends?`
      : `Remover ${eliminarAmigo[1]} dos seus amigos?`
  }

  const eliminarAmigoEtiqueta = texto.match(/^Eliminar a (.+)$/)
  if (eliminarAmigoEtiqueta) {
    return idioma === 'en'
      ? `Remove ${eliminarAmigoEtiqueta[1]}`
      : `Remover ${eliminarAmigoEtiqueta[1]}`
  }

  const agregarIntegrante = texto.match(/^Agregar a (.+) al grupo$/)
  if (agregarIntegrante) {
    return idioma === 'en'
      ? `Add ${agregarIntegrante[1]} to the group`
      : `Adicionar ${agregarIntegrante[1]} ao grupo`
  }

  const eliminarNombre = texto.match(/^¿Eliminar “(.+)” y todos sus gastos\? Esta acción no se puede deshacer\.$/)
  if (eliminarNombre) {
    return idioma === 'en'
      ? `Delete “${eliminarNombre[1]}” and all its expenses? This cannot be undone.`
      : `Excluir “${eliminarNombre[1]}” e todas as despesas? Esta ação não pode ser desfeita.`
  }

  const eliminarGasto = texto.match(/^¿(?:Seguro que querés )?eliminar “(.+)”\? Esta acción no se puede deshacer\.$/)
  if (eliminarGasto) {
    return idioma === 'en'
      ? `Delete “${eliminarGasto[1]}”? This cannot be undone.`
      : `Excluir “${eliminarGasto[1]}”? Esta ação não pode ser desfeita.`
  }

  const deshacerPago = texto.match(/^¿Deshacer “(.+)”\? Se borra el pago y su comprobante\.$/)
  if (deshacerPago) {
    return idioma === 'en'
      ? `Undo “${deshacerPago[1]}”? The payment and its receipt will be deleted.`
      : `Desfazer “${deshacerPago[1]}”? O pagamento e o comprovante serão excluídos.`
  }

  const recordarA = texto.match(/^Recordar a (.+)$/)
  if (recordarA) {
    return idioma === 'en'
      ? `Remind ${recordarA[1]}`
      : `Lembrar ${recordarA[1]}`
  }

  const participante = texto.match(/^Cada participante: (.+)$/)
  if (participante) {
    return idioma === 'en'
      ? `Each participant: ${participante[1]}`
      : `Cada participante: ${participante[1]}`
  }

  const cantidadGrupos = texto.match(/^(\d+) grupo(s?)$/)
  if (cantidadGrupos) {
    return idioma === 'en'
      ? `${cantidadGrupos[1]} group${Number(cantidadGrupos[1]) === 1 ? '' : 's'}`
      : `${cantidadGrupos[1]} grupo${Number(cantidadGrupos[1]) === 1 ? '' : 's'}`
  }

  const cantidadIntegrantes = texto.match(/^(\d+) integrante(s?) · (.+)$/)
  if (cantidadIntegrantes) {
    return idioma === 'en'
      ? `${cantidadIntegrantes[1]} member${Number(cantidadIntegrantes[1]) === 1 ? '' : 's'} · ${cantidadIntegrantes[3]}`
      : `${cantidadIntegrantes[1]} participante${Number(cantidadIntegrantes[1]) === 1 ? '' : 's'} · ${cantidadIntegrantes[3]}`
  }

  const paso = texto.match(/^Paso (\d+) de (\d+)$/)
  if (paso) {
    return idioma === 'en'
      ? `Step ${paso[1]} of ${paso[2]}`
      : `Etapa ${paso[1]} de ${paso[2]}`
  }

  return texto
}

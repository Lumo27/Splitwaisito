export type TutorialKey =
  | 'groups'
  | 'groupCreate'
  | 'groupDetail'
  | 'expenseForm'
  | 'expenseDetail'
  | 'debts'
  | 'activity'
  | 'profile'
  | 'settings'
  | 'general'

export interface TutorialStep {
  title: string
  description: string
}

export interface Tutorial {
  title: string
  steps: TutorialStep[]
}

export const TUTORIALES: Record<TutorialKey, Tutorial> = {
  groups: {
    title: 'Grupos y gastos',
    steps: [
      {
        title: 'Tus grupos, en un solo lugar',
        description:
          'Cada grupo reúne a las personas y los gastos de un plan compartido. Abrí uno para ver sus movimientos y saldos.',
      },
      {
        title: 'Creá un grupo',
        description:
          'Usá “Crear grupo” para ponerle un nombre, elegir la moneda y sumar integrantes disponibles.',
      },
      {
        title: 'Cargá un gasto',
        description:
          'Desde un grupo podés registrar qué se pagó, cuánto, quién pagó y entre quiénes se divide.',
      },
      {
        title: 'Consultá la actividad',
        description:
          'El detalle del grupo muestra sus gastos, el total por categoría y los saldos pendientes entre integrantes.',
      },
    ],
  },
  groupCreate: {
    title: 'Crear un grupo',
    steps: [
      {
        title: 'Identificá el plan',
        description:
          'Elegí un nombre y, si querés, agregá una descripción para que todos reconozcan el grupo.',
      },
      {
        title: 'Definí la moneda',
        description:
          'Seleccioná la moneda que usarán los gastos del grupo. Los movimientos se calculan en esa moneda.',
      },
      {
        title: 'Sumá integrantes',
        description:
          'Podés invitar amistades disponibles al grupo. Después, cada gasto se divide entre las personas que selecciones.',
      },
    ],
  },
  groupDetail: {
    title: 'Detalle del grupo',
    steps: [
      {
        title: 'Revisá los gastos',
        description:
          'El total y el gráfico resumen los gastos registrados. Tocá un movimiento para consultar su detalle y comprobante.',
      },
      {
        title: 'Administrá integrantes',
        description:
          'La lista muestra quiénes participan. Si tenés amistades disponibles, podés agregarlas desde esta pantalla.',
      },
      {
        title: 'Entendé los saldos',
        description:
          'Los saldos indican quién debe y quién tiene que recibir según los gastos y pagos aprobados del grupo.',
      },
      {
        title: 'Registrá un gasto o pago',
        description:
          'Usá “Cargar gasto” para agregar un movimiento. Para saldar, transferí por fuera de Junti y cargá el comprobante.',
      },
    ],
  },
  expenseForm: {
    title: 'Cargar un gasto',
    steps: [
      {
        title: 'Describí el gasto',
        description:
          'Ingresá el concepto, el monto total y una de las categorías disponibles.',
      },
      {
        title: 'Indicá quién pagó',
        description:
          'Seleccioná a la persona que hizo el pago. El pagador también forma parte del reparto.',
      },
      {
        title: 'Elegí cómo dividirlo',
        description:
          'Marcá los integrantes que comparten el gasto. Junti muestra cuánto corresponde a cada uno.',
      },
      {
        title: 'Agregá respaldo y guardá',
        description:
          'Podés adjuntar la foto del ticket y la ubicación cuando estén disponibles. Guardá el gasto para verlo en el grupo.',
      },
    ],
  },
  expenseDetail: {
    title: 'Detalle y comprobantes',
    steps: [
      {
        title: 'Consultá el movimiento',
        description:
          'Acá ves el monto, la fecha, quién pagó y cómo se repartió el gasto entre los participantes.',
      },
      {
        title: 'Abrí el comprobante',
        description:
          'Si se adjuntó una foto o captura, aparece en el detalle del movimiento para que puedas revisarla.',
      },
      {
        title: 'Revisá el estado de un pago',
        description:
          'Los pagos pendientes esperan la revisión de quien recibió el dinero. Solo los pagos aprobados reducen la deuda.',
      },
    ],
  },
  debts: {
    title: 'Saldar una deuda',
    steps: [
      {
        title: 'Revisá a quién y cuánto',
        description:
          'La pantalla muestra el acreedor y el monto pendiente calculado para el grupo.',
      },
      {
        title: 'Transferí desde tu banco',
        description:
          'Copiá el alias o e-mail del acreedor y el monto. Junti no realiza transferencias ni administra dinero.',
      },
      {
        title: 'Adjuntá el comprobante',
        description:
          'Después de transferir, subí una foto o captura. El pago puede verificarse automáticamente o quedar pendiente de revisión.',
      },
      {
        title: 'Confirmá el saldo',
        description:
          'Solo un pago aprobado salda la deuda. Si queda pendiente, quien recibió el dinero puede aprobarlo o rechazarlo.',
      },
    ],
  },
  activity: {
    title: 'Amigos y solicitudes',
    steps: [
      {
        title: 'Invitá por e-mail',
        description:
          'Escribí el e-mail de otra persona y enviá una solicitud para compartir grupos y gastos.',
      },
      {
        title: 'Respondé solicitudes',
        description:
          'En solicitudes pendientes podés aceptar o rechazar invitaciones que recibiste.',
      },
      {
        title: 'Administrá tus amistades',
        description:
          'La lista de amigos muestra tus contactos aceptados. Desde allí también podés quitar una amistad.',
      },
    ],
  },
  profile: {
    title: 'Tu perfil',
    steps: [
      {
        title: 'Revisá tus datos',
        description:
          'El perfil muestra el nombre y el e-mail asociados a tu cuenta.',
      },
      {
        title: 'Actualizá tu alias',
        description:
          'Podés guardar un alias para que tus amistades sepan dónde transferirte cuando corresponda.',
      },
      {
        title: 'Guardá los cambios',
        description:
          'Editá los datos disponibles y tocá “Guardar cambios” para actualizar tu perfil.',
      },
    ],
  },
  settings: {
    title: 'Configuración',
    steps: [
      {
        title: 'Gestioná tu sesión',
        description:
          'La pantalla indica la cuenta activa y permite cerrar sesión en este dispositivo.',
      },
      {
        title: 'Datos de ejemplo',
        description:
          'En modo demo podés restablecer los grupos y gastos de prueba. Esta opción no aparece con una cuenta real.',
      },
      {
        title: 'Volvé cuando quieras',
        description:
          'Cerrar sesión no elimina tu cuenta ni tus datos guardados. Iniciá sesión de nuevo para continuar.',
      },
    ],
  },
  general: {
    title: 'Ayuda de Junti',
    steps: [
      {
        title: 'Movete por la app',
        description:
          'Usá las pestañas para ir a Gastos, Amigos, Perfil y Configuración.',
      },
      {
        title: 'Compartí gastos',
        description:
          'Creá un grupo, sumá integrantes y registrá los gastos que quieran dividir.',
      },
      {
        title: 'Consultá tus saldos',
        description:
          'Los saldos resumen los gastos y pagos registrados. Las transferencias se hacen fuera de Junti.',
      },
    ],
  },
}

export function obtenerTutorial(pathname: string): TutorialKey {
  if (pathname.includes('/gasto/')) return 'expenseDetail'
  if (
    pathname.endsWith('/cargar-gasto') ||
    pathname === '/gastos/nuevo' ||
    (pathname.includes('/grupos/') && pathname.endsWith('/cargar'))
  ) {
    return 'expenseForm'
  }
  if (pathname.includes('/saldar') || pathname.startsWith('/saldar/')) {
    return 'debts'
  }
  if (pathname === '/grupos/nuevo') return 'groupCreate'
  if (pathname.startsWith('/grupos/') && pathname !== '/grupos') {
    return 'groupDetail'
  }
  if (pathname.startsWith('/actividad')) return 'activity'
  if (pathname.startsWith('/perfil')) return 'profile'
  if (pathname.startsWith('/configuracion')) return 'settings'
  if (pathname === '/grupos') return 'groups'
  return 'general'
}

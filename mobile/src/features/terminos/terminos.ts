export const TERMINOS_VERSION = '1.0.1'

export const TERMINOS_DOCUMENTO = `# Términos y Condiciones de Uso de Junti

**Última actualización:** 02/11/2026

Bienvenido a Junti. Estos Términos y Condiciones ("Términos") regulan el acceso y uso de la aplicación móvil y/o web Junti (en adelante, "la Aplicación"), operada por No name, persona física (en adelante, "Junti", "nosotros" o "el Operador"), con domicilio en N/A, correo de contacto splitwaisito@gmail.com.

Al crear una cuenta o utilizar la Aplicación, usted ("Usuario") acepta estos Términos. Si no está de acuerdo, no utilice la Aplicación.

## 1. Descripción del servicio

Junti es una herramienta de gestión de gastos compartidos que permite a grupos de personas registrar gastos comunes, dividirlos entre los participantes y llevar un registro del saldo que cada uno debe a los demás.

Junti es operada por una persona física y no por una sociedad ni otra persona jurídica. Por ello, las obligaciones y responsabilidades del Operador se asumen a título personal, en la medida permitida por la ley aplicable.

## 2. Naturaleza del servicio: Junti no custodia dinero

2.1. Junti **no es una entidad financiera**, billetera electrónica, plataforma de pagos ni intermediario de fondos. **No recibe, retiene, custodia, transfiere ni administra dinero** de los Usuarios.

2.2. Todos los pagos entre Usuarios se realizan directamente entre ellos, por los medios que acuerden (transferencia bancaria, efectivo, u otros servicios de terceros). Junti no participa en dichas transacciones.

2.3. Los saldos mostrados en la Aplicación son **registros informativos** basados en los datos ingresados por los Usuarios. No representan fondos disponibles, depósitos ni saldos bancarios.

## 3. Sistema de comprobantes

3.1. Los gastos registrados en la Aplicación deben respaldarse mediante **comprobantes** (fotografías, archivos o capturas de pantalla de tickets, facturas, transferencias u otros documentos), cuando el Usuario lo tenga disponible.

3.2. Los comprobantes cargados sirven como respaldo informativo de los registros. Junti no verifica la autenticidad, validez fiscal ni exactitud de los comprobantes o montos ingresados.

3.3. El Usuario es responsable de que la información y los comprobantes que carga sean veraces, lícitos y no infrinjan derechos de terceros.

3.4. Los comprobantes de pago cargados por un Usuario pueden ser visibles para los demás miembros del grupo, según la configuración del mismo.

## 4. Registro y cuenta

4.1. Para usar la Aplicación es necesario crear una cuenta con datos verdaderos y actualizados.

4.2. El Usuario es responsable de mantener la confidencialidad de sus credenciales y de toda actividad realizada desde su cuenta.

4.3. El Usuario debe ser mayor de edad o contar con autorización de su representante legal.

## 5. Obligaciones del Usuario

El Usuario se compromete a:

- Utilizar la Aplicación conforme a la ley y a estos Términos.
- No usar la Aplicación para actividades fraudulentas, de lavado de dinero, financiamiento ilícito o cualquier otra actividad ilegal.
- No intentar acceder a cuentas, datos o sistemas de otros Usuarios o de Junti.
- No cargar contenido ofensivo, malicioso o que vulnere derechos de terceros.

## 6. Información almacenada y solicitudes de autoridades

6.1. Junti almacena la información necesaria para el funcionamiento del servicio, incluyendo datos de cuenta, registros de gastos, grupos, comprobantes y registros técnicos.

6.2. La información retenida **estará disponible** para las autoridades competentes cuando sea requerida mediante **orden judicial, mandato legal o requerimiento formal** emitido conforme a la legislación aplicable en ARGENTINA.

6.3. Junti no entregará información a terceros sin un requerimiento legal válido, salvo consentimiento expreso del Usuario o cuando la ley lo exija.

6.4. Junti podrá colaborar con las autoridades en investigaciones relacionadas con actividades ilícitas, conforme a la normativa vigente.

## 7. Privacidad y protección de datos

El tratamiento de datos personales se rige por nuestra Política de Privacidad, que forma parte integral de estos Términos. Junti aplica medidas de seguridad técnicas y organizativas razonables para proteger la información almacenada. Ninguna medida es infalible, por lo que el Usuario reconoce los riesgos inherentes al uso de servicios en línea.

## 8. Limitación de responsabilidad

8.1. Junti no será responsable por:

- Pagos no realizados, retrasos, errores o disputas entre Usuarios.
- Pérdidas económicas derivadas de acuerdos entre Usuarios.
- Inexactitud de los datos ingresados por los Usuarios o de los comprobantes cargados.
- Interrupciones del servicio, fallas técnicas o pérdida de datos fuera de su control razonable.

8.2. En la máxima medida permitida por la ley, la responsabilidad total de Junti frente al Usuario no excederá el monto que el Usuario haya pagado por el servicio en los últimos 12 meses, o [monto] si el servicio es gratuito.

## 9. Disponibilidad del servicio

Junti procura mantener la Aplicación disponible, pero no garantiza su funcionamiento ininterrumpido. Podrán realizarse mantenimientos, actualizaciones o modificaciones del servicio.

## 10. Suspensión y terminación

10.1. Junti podrá suspender o cancelar cuentas que incumplan estos Términos, sin perjuicio de otras acciones legales.

10.2. El Usuario puede solicitar la eliminación de su cuenta en cualquier momento desde la Aplicación o escribiendo a splitwaisito@gmail.com. Ciertos datos podrán conservarse por el plazo que exija la ley, incluyendo lo requerido por autoridades competentes.

## 11. Propiedad intelectual

La Aplicación, su marca, logotipos, diseño y código son propiedad de Junti o de sus licenciantes. Se concede al Usuario una licencia limitada, no exclusiva, intransferible y revocable para uso personal o interno de la Aplicación.

## 12. Modificaciones

Junti podrá modificar estos Términos. Los cambios se notificarán a través de la Aplicación o por correo electrónico. El uso continuado de la Aplicación tras la notificación implica la aceptación de los cambios.

## 13. Ley aplicable y jurisdicción

Estos Términos se rigen por las leyes de ARGENTINA. Cualquier controversia será sometida a los tribunales competentes de Buenos Aires, Argentina, salvo que la ley aplicable disponga otra cosa.

## 14. Contacto

Para consultas sobre estos Términos: splitwaisito@gmail.com.

---

*Nota: Este documento es un borrador general. Recomendamos revisarlo con un abogado en la jurisdicción donde opera Junti, en especial las secciones 2 (no custodia de dinero), 6 (requerimientos de autoridades) y 8 (limitación de responsabilidad), así como alinearlo con su Política de Privacidad y con la normativa de protección de datos aplicable.*`

export function tieneAceptacionRegistrada(aceptacion: unknown): boolean {
  if (!aceptacion || typeof aceptacion !== 'object') return false
  const registro = aceptacion as Record<string, unknown>
  return registro.estado === 'aceptado'
}

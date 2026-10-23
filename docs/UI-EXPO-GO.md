# Diseño móvil para Expo Go

Verde intenso (#087F63), verde oscuro (#065F4B), fondos claros y acentos celestes y coral. Tarjetas redondeadas, sombras suaves, campos con foco visible y botones de al menos 56 px. El estilo compartido se aplica a las diez pantallas; grupos, detalle, login y perfil incorporan composiciones específicas. Totales y contadores usan datos actuales.

Movimiento: entrada de 280 ms con opacidad y desplazamiento de 10 px; botones con escala 0,98 durante el toque y transición de 100 ms. Animated de React Native, sin dependencias nuevas. Un observador de accesibilidad respeta reducir movimiento y las entradas se detienen al desmontar.

Figma editable: https://www.figma.com/design/4gdXD0wVLkX19tMSTSvA12?node-id=3-27
Tres propuestas (grupos, carga de gasto, perfil) con componentes, variables y estilos de texto. Los datos son ejemplos para discutir el diseño. La implementación conserva los controles funcionales y la tipografía del sistema.

Validación: typecheck correcto, 22 pruebas aprobadas y lint sin errores, con cuatro advertencias previas sobre Array<T>. Revisión visual web a 390 × 844 de grupos, detalle, carga de gasto y perfil. Campos y selección actualizan el reparto. Pendiente confirmar físicamente en Android e iPhone las transiciones, teclado y reducir movimiento.

La rama feature/ui-expo-go parte de feature/rn-pantallas-expo-go. Comparar contra esa rama permite revisar únicamente el rediseño.

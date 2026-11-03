# web

Frontend de Splitwaisito (React 18 + Vite + TypeScript + Tailwind).

```
npm install
cp .env.example .env.local   # completar con credenciales de Firebase (pedírselas a Lucas)
npm run dev
```

Ver [el README del repo](../README.md) y [CLAUDE.md](../CLAUDE.md) para contexto general del proyecto y decisiones de stack.

## Modo demo (datos de prueba)

```
npm run dev:seeds
```

Levanta la app con datos de ejemplo (usuario "Lucas", 4 amigos, 3 grupos con gastos y una solicitud de amistad pendiente) y **sin conectarse a Firebase**, así que no lee ni pisa datos reales. Sirve para probar y mostrar las pantallas sin credenciales. Los cambios se guardan en el navegador; para volver al estado inicial usá Configuración → "Restablecer datos de prueba". El modo normal (`npm run dev`) sigue usando Firebase.


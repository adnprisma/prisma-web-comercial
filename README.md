# PRISMA — Sitio comercial

Sitio estático responsive, publicado en Vercel (deploy automático en cada push a `main`, sin workflow de CI de por medio). No requiere build, Node ni dependencias externas.

## Qué incluye

- Landing comercial responsive desktop / tablet / mobile.
- Identidad PRISMA (carbón, coral, beige) y assets visuales locales.
- Píxel con animaciones CSS ligeras.
- Navegación sticky + menú mobile.
- Sección Motor + ADN.
- Storytelling de automatización 9:47 PM.
- Proceso comercial.
- Planes Inicia, Esencial y Completo.
- Modales de detalle de cada plan.
- Calculadora visual del esquema de pago de Esencial: contado, 3 o 6 pagos.
- FAQ interactivo.
- Formulario de diagnóstico con generación/copia de mensaje.
- Integración opcional de WhatsApp mediante `config.js`.
- Animaciones de entrada con IntersectionObserver y soporte para `prefers-reduced-motion`.

## Publicar

El sitio ya está conectado a Vercel (proyecto `prisma-web-comercial`, cuenta
Prisma ADN) — cualquier push a `main` se publica solo, sin workflow de CI
de por medio. No hay pasos manuales que seguir.

## Activar WhatsApp del formulario

Edita `config.js`:

```js
window.PRISMA_CONFIG = {
  whatsappNumber: "5215512345678",
  analyticsId: ""
};
```

Usa solo dígitos, con código de país. Si se deja vacío, el formulario sigue funcionando y permite copiar el mensaje, pero no muestra el botón de WhatsApp.

## Importante sobre precios

Los precios y componentes incluidos se cargaron desde el manual comercial de PRISMA. El esquema de Esencial muestra:

- Contado: MXN $27,000.
- 3 pagos: MXN $5,000 inicial + 3 × MXN $7,334 = MXN $27,002.
- 6 pagos: MXN $5,000 inicial + 6 × MXN $3,667 = MXN $27,002.

Se presenta como precio total + facilidad de pago, no como suscripción cancelable mes a mes.

## Personalización sugerida antes de producción

- Agregar el número oficial de WhatsApp de PRISMA en `config.js`.
- Conectar el formulario a Supabase / CRM si se desea guardar leads directamente.
- Agregar Analytics/Pixel solo después de definir la herramienta de medición.
- Sustituir o ampliar imágenes de Píxel con exports oficiales transparentes si se generan posteriormente.

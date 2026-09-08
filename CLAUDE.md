# CLAUDE.md — Sitio comercial Prisma

Instrucciones permanentes para cualquier agente que trabaje en este repositorio.
Léelas completas antes de escribir código. Aplican a TODAS las sesiones.

---

## 1. Qué es este proyecto

Sitio comercial público de Prisma (`iaprisma.com`), estático (HTML/CSS/JS
sin build), publicado en GitHub Pages. Landing, calculadora de planes,
formulario de diagnóstico (abre WhatsApp, no toca la base) y el onboarding
de clientes por código (`onboarding/`, sí toca la base).

**Este sitio comparte la base de Supabase con `prisma-dashboard` (el
dashboard interno del equipo, `adnprisma.com`) — mismo esquema, dos modelos
de amenaza distintos: aquí todo visitante pega con el rol `anon`, sin
sesión.** Todo lo que gobierna esa relación (qué puede llamar este sitio,
qué tablas nunca se le exponen, dónde viven las migraciones, cómo se agrega
una pantalla nueva que toque la base) vive en
**`CONTRATO_BASE_COMPARTIDA.md`, en la raíz de `prisma-dashboard`** — no en
este repo. Léelo ahí antes de agregar cualquier código que llame a Supabase
desde este sitio. (En la máquina donde se escribió esto, ambos repos viven
como carpetas hermanas — `../prisma-dashboard/CONTRATO_BASE_COMPARTIDA.md`
— pero el archivo autoritativo es el de ese repo, no una copia de acá.)

Regla que se sigue en la práctica, ya antes de que existiera el documento:
este sitio **nunca lee tablas de Supabase directamente** — el único punto de
contacto con la base es `client.rpc('verify_onboarding_access', ...)` en
`onboarding/index.html`. Cualquier función nueva que este sitio necesite
llamar se agrega primero a la tabla de funciones permitidas del contrato, y
se escribe como migración en `prisma-dashboard/supabase/migrations/` —
nunca como un `.sql` suelto en este repo (`supabase-onboarding-access.sql`
es el ejemplo histórico de lo que ya no se debe repetir: se aplicó a mano y
quedó viviendo aquí en vez de capturarse como migración numerada del otro
repo).

---

## 2. Reglas de código

- Sitio estático, sin build ni dependencias — no se agrega un bundler ni un
  framework sin que sea una decisión explícita, discutida antes de escribir
  código.
- La anon key en `config.js` es pública por diseño (ver el contrato,
  sección 6) — no es un secreto y no se trata como tal, pero tampoco se
  agrega ninguna otra llave ahí. La `service_role` nunca vive en este repo:
  se despliega a GitHub Pages, hosting 100% estático, así que cualquier
  secret puesto aquí queda público en el bundle servido, no solo en el
  código fuente del repo.
- Idioma de la interfaz: **español (México)**, igual que el dashboard.

---

## 3. Flujo de trabajo

- Antes de un bloque grande, presenta el plan y espera confirmación.
- Si el cambio necesita algo nuevo de Supabase (una función, una columna),
  sigue el procedimiento de la sección 7 de `CONTRATO_BASE_COMPARTIDA.md`
  antes de escribir el código del sitio — la función se escribe y se
  verifica primero, del lado de `prisma-dashboard`.

# CLAUDE.md — Sitio comercial Prisma

Instrucciones permanentes para cualquier agente que trabaje en este repositorio.
Léelas completas antes de escribir código. Aplican a TODAS las sesiones.

---

## 1. Qué es este proyecto

Sitio comercial público de Prisma (`iaprisma.com`), estático (HTML/CSS/JS
sin build), publicado en **Vercel** (no GitHub Pages — se evaluó Pages
primero, el repo nunca tuvo GitHub Pages habilitado del lado de cuenta y
el workflow que lo intentaba fallaba en silencio; Vercel ya estaba
sirviendo el dominio de todos modos, confirmado el 10 de septiembre de
2026). Deploy automático en cada push a `main` vía la integración nativa
de Vercel con GitHub — no hay un workflow de CI que lo dispare, es el
propio Vercel el que ve el push. Landing, calculadora de planes,
formulario de diagnóstico (abre WhatsApp, no toca la base), el gate de
onboarding por código y la landing de 3 secciones que aparece después
(`onboarding/index.html`), y el formulario de arranque en su propia
página (`onboarding/formulario.html`, sin candado — no toca la base).

**Cómo se verifica que un deploy quedó bien: contra el dominio real, con
headers HTTP — no contra el repo ni contra Vercel a ciegas.**
`curl -sSI https://iaprisma.com` debe traer `server: Vercel`; el
`x-vercel-id` y `last-modified`/`age` dicen qué tan reciente es lo que
está sirviendo. Para confirmar que un cambio de contenido específico ya
está en vivo (no solo que el servidor responde), se lee el HTML real
(`curl -sS https://iaprisma.com/<ruta>`) buscando algo que solo existiera
en la versión nueva — no basta con un 200.

**Este repo NO tiene ningún candado antes de producción — ni pre-push, ni
CI, nada.** A diferencia de `prisma-dashboard` (tres candados en
`.husky/pre-push` y en `npm run build`), aquí **cada push a `main` es
producción inmediata**, en segundos, sin ningún paso intermedio que lo
detenga. Esto no es un descuido pendiente de arreglar — es del tamaño real
del sitio (estático, sin build, bajo riesgo por diseño) — pero hay que
tenerlo presente exactamente así: nada entre un `git push` y que un
cliente real lo vea.

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
este sitio **nunca lee tablas de Supabase directamente** — solo llama
funciones específicas, listadas en la sección 3 del contrato. Hoy son dos,
las dos desde `onboarding/index.html`: `verify_onboarding_access()`
(valida el código, registra el acceso) y `get_onboarding_landing()` (trae
lo que arma la landing de 3 secciones — cotización, pago de
implementación, pago de plataforma). `onboarding/formulario.html` no
llama nada — es el formulario de arranque, sin candado de acceso, porque
nunca tocó la base. Cualquier función nueva que este sitio necesite
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

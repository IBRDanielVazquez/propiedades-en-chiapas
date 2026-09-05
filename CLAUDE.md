# Propiedades en Chiapas (PEC) — contexto para Claude

Portal inmobiliario SaaS de Chiapas, propiedad de IBR Marketing Digital (Daniel Vázquez). Live en propiedadesenchiapas.com. Este archivo se actualiza cada vez que Claude investiga o trabaja en el repo — mantenlo al día en vez de crear notas sueltas.

## Orquestación (cómo trabaja Daniel)

Daniel orquesta varias IAs: Claude = cerebro estratégico/arquitecto (decide qué hacer y por qué), Antigravity = terminal/ejecución/deploy, GPT = copy, Gemini = multimodal/SEO, NotebookLM = memoria. Cuando Claude no ejecuta directamente, genera prompts completos y copy-paste-ready para que Antigravity los ejecute. Daniel espera respuestas sin relleno, listas para usar, y prefiere cero idas y vueltas.

Formato de auditoría que Antigravity deja en `AUDIT.md` (síguelo si generas reportes de estado):
PROYECTO / PASO ACTUAL / OBJETIVO DEL PASO / HERRAMIENTA USADA / PROMPT USADO / RESULTADO OBTENIDO / ARCHIVOS CREADOS O MODIFICADOS / ERRORES DETECTADOS / RIESGOS / PENDIENTES / DECISIÓN QUE NECESITA CLAUDE / RECOMENDACIÓN DEL AGENTE INTERMEDIO.

## Stack

- React 19 + Vite 8, React Router 7, react-helmet-async
- Supabase (proyecto `lfmbhdtrxmtxjwyfzdcz`) — auth + Postgres, tabla principal `properties`
- Deploy: **siempre `git push origin main`** (Vercel conectado al repo). Nunca `npx vercel --prod` ni FTP directo — hay scripts legacy de FTP (`deploy_chiapas.js`, `ftp_5_images.js`, etc.) que son de una migración vieja desde Hostinger, no el flujo actual.
- Repo local: este mismo directorio. Repo remoto: GitHub `IBRDanielVazquez/propiedades-en-chiapas` (el MCP de GitHub de esta sesión no tenía credenciales válidas al 2026-09-04 — verificar).

## Regla no negociable de marca (de `.agents/AGENTS.md`)

Prohibido modificar, "mejorar" o interpretar los colores/fuentes del sistema IBR bajo cualquier circunstancia:
```
--color-fondo: #141414       --color-texto: #F7F1E8
--color-card: #1E1E1E        --color-gold: #B8924A
--color-input: #2A2A2A       --color-borde: #333333
--color-error: #EF4444       --color-exito: #22C55E
Títulos: 'Cormorant Garamond'   Cuerpo: 'Inter'
```
Aplica al CRM/Dashboard, tarjetas digitales, y a los desarrollos premium (Bella Vista, Rioja). **El Home público (`src/components/Home.jsx`) es la excepción**: usa su propia identidad "PEC", con Plus Jakarta Sans — es intencional, un portal de consumo distinto al admin.

**Paleta del Home actualizada 2026-09-04** (a petición de Daniel, derivada por muestreo de píxeles del logo oficial `propiedadesenchiapas.com`, ver `src/assets/logo-pec.png`):
```
--ink:#0A0838        (antes #0B1B3A)
--indigo:#0E0A78     (azul marino del logo, antes #13287A)
--indigo-2:#4682B4   (azul acero del logo, antes #1E3A9B)
--emerald:#0B6B0E    (verde oscuro del logo, antes #0E9F6E)
--emerald-2:#1FAE3B  (verde vivo derivado, antes #10B981)
--violet:#8B54F3     (NUEVO — violeta del techo, usado en el glow del hero y el punto del pill superior)
--red:#B23A3D        (NUEVO — rojo de las ventanitas del logo, reemplaza el --amber muerto; usado en el corazón de favoritos y en .tag-feat)
```
El logo (recortado a su bounding box real, sin el padding blanco sobrante) vive en `src/assets/logo-pec.png` y se importa en `Home.jsx` reemplazando el bloque `.pec-mark` (ícono + texto) del header por `<img className="pec-logo-img" />`.

## Rutas (src/App.jsx)

- `/` — Home.jsx, portal público con búsqueda y catálogo (Supabase `properties`, excluye títulos de prueba vía `EXCLUDE_TITLES`)
- `/propiedad/:id` — PropertyDetail.jsx (público)
- `/card/:slug` — DigitalCard.jsx (tarjeta digital de asesor)
- `/l/:slug` — LandingViewer.jsx
- `/asesores` — LandingCaptacion.jsx (landing de captación de asesores, trial 14 días)
- `/bella-vista`, `/bella-vista-ocozocoautla` — BellaVistaLanding.jsx (desarrollo, estética IBR dorada)
- `/rioja`, `/rioja/360`, `/rioja/360/editor` — RiojaLanding.jsx + tour virtual 360 con editor de hotspots (Tour360Editor.jsx, sidecar local puerto 3600 para autosave)
- `/privacidad` — AvisoPrivacidad.jsx
- `/crm/*` — Dashboard.jsx (protegido, requiere sesión Supabase)
- `/preview/leads-crm` — LeadsDashboard.jsx en modo preview
- `*` — NotFound.jsx

## Estado del repo al 2026-09-04

- Branch actual: `main`. **Último commit: 2026-07-15** ("feat: implement premium iOS style floating bottom navigation bar... Montecristo landing") — casi 2 meses sin actividad de commits.
- Un refactor a arquitectura modular global (`src/modules/virtual-tour/`) con integración de 13 escenas reales de Montecristo se hizo (`feat(montecristo-360)`) y luego se **revirtió con `git reset`** a un commit anterior — no llegó a su forma final en main. Si retomas Montecristo 360, parte de ahí.
- Existe branch local `feat/bella-vista-landing` (ref sin borrar) de una auditoría de estabilización anterior (TDZ, setState en cascada, `Math.random` en render) — ya corregida en su momento; el trabajo de Bella Vista ya vive en main, esa branch quedó obsoleta.
- **Pendiente de seguridad real**: `security-quarantine/` contiene datos operativos y reglas de acceso que se sacaron de `public/` en un lockdown P0 porque el CRM no tenía autenticación/autorización server-side. No regresar nada de ahí a `public/` hasta resolver eso — hoy el CRM depende solo de auth client-side de Supabase.
- No hay forma de leer `git status` (cambios sin commitear) desde esta sesión de Cowork — no hay shell en el puente al dispositivo. Verifícalo con Antigravity o pídele a Daniel un `git status` si es relevante antes de asumir que el working tree está limpio.

## Pendientes conocidos (memoria + AUDIT.md)

- **Home "premium" — trabajándose punto por punto en este chat (2026-09-04).** Hecho: logo real + paleta de marca (ver arriba) — verificado byte a byte que ambos archivos (`Home.jsx`, `src/assets/logo-pec.png`) quedaron escritos correctamente en disco; si el logo no se ve en local, es cache del navegador o falta reiniciar `npm run dev`, no un archivo faltante. **Sin verificar aún: `npm run dev` / `npm run build` en local** — esta sesión de Cowork no tiene shell en el puente al dispositivo, solo puede editar y escribir archivos, no ejecutar comandos. Daniel debe correr ambos antes de dar por bueno cualquier cambio de este chat y antes de cualquier `git push`.
  **Superauditoría completa entregada en `HOME_AUDIT.md`** (raíz del repo) — hallazgo principal: existe un segundo sistema de diseño "Airbnb style" completo y sin usar (`src/index.css` líneas 34-373 + `PropertyCard.jsx` + `Filters.jsx` + `Navbar.jsx`), con tarjeta de rating/"guest favorite" **inventada** (no viene de datos reales — el propio código lo admite: `// Mocking Airbnb-like metrics`). Antes de portar cualquier pieza de ahí a `Home.jsx`, decidir con Daniel qué se rescata (multi-foto vía `images[]`, amenidades vía `amenities[]`, badge "Popular" honesto vía `views`) y qué se borra. Otro hallazgo de alto impacto/bajo esfuerzo: `useNavigate` está importado en `Home.jsx` pero nunca usado — el click en cada tarjeta hace `window.location.href` (recarga completa de página) en vez de navegación SPA. Ver el archivo para la lista completa (datos reales sin usar, código muerto, SEO, performance, accesibilidad con contraste WCAG ya calculado) y el orden de ejecución sugerido.
- Stripe payments, Master Admin Dashboard, PWA
- Migrar landings estáticas de Hostinger (Monte de los Olivos, Colinas, Sima Park, La Cañada, El Higo Copoya, Montecristo, Quinta Berriozábal, Cuauhtli) al sistema React como fichas — sin tocar MX records de Hostinger todavía

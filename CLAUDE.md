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
--violet:#8B54F3     (violeta del techo, usado en el glow del hero y el punto del pill superior)
--red:#B23A3D        (rojo de las ventanitas del logo, reemplaza el --amber muerto; usado en el corazón de favoritos)
```
El logo (recortado a su bounding box real, sin el padding blanco sobrante) vive en `src/assets/logo-pec.png` y se importa en `Home.jsx` reemplazando el bloque `.pec-mark` (ícono + texto) del header por `<img className="pec-logo-img" />`.

## Rutas (src/App.jsx)

- `/` — Home.jsx, portal público con búsqueda y catálogo (Supabase `properties` + fichas estáticas de `src/data/desarrollos.js`)
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

## Estado del repo al 2026-09-04 (post-merge)

- Branch `main`. Mientras se trabajaba el Home en este chat, Daniel (vía Antigravity, en paralelo) avanzó **13 commits** en `origin/main` con otro cambio grande: integró un catálogo estático de desarrollos/landings (`src/data/desarrollos.js` + `DevelopmentCard.jsx` + `DevelopmentDetailModal.jsx`), tocando también `App.jsx`, `LandingManager.jsx`, `main.jsx`, `supabaseClient.js` y `postbuild.js`. `git pull --no-rebase origin main` produjo conflicto **solo en dos archivos**: `index.html` y `src/components/Home.jsx` (el resto — incluidos los 4 archivos nuevos de desarrollos — se fusionó limpio).
- **Cómo se resolvió** (ambas versiones se leyeron completas desde este chat, no a ciegas):
  - `index.html`: se conservaron los fixes de ambos lados — el bloque de scripts del lado remoto (desregistro de service workers viejos + captura global de errores para evitar pantallas blancas en móvil, con meta no-cache) **y** el `<link rel="preconnect">`/`stylesheet` de Plus Jakarta Sans de este chat. Los OG tags se quedaron con la versión del lado remoto (ya corregidos a "Propiedades en Chiapas", ya no los de Bella Vista) — **este era justo el hallazgo #4 de `HOME_AUDIT.md`, resuelto sin querer por el otro track de trabajo.** Se quitó `maximum-scale=1.0, user-scalable=no` del viewport (bloquea el zoom, mala práctica de accesibilidad) a favor del viewport simple de este chat.
  - `src/components/Home.jsx`: la versión remota traía un rediseño paralelo completo (nueva paleta `--primary`, tarjetas vía `PropertyCard.jsx`, paginación con `.range()`). **Se descartó ese rediseño de Home** porque `PropertyCard.jsx` (que solo esa versión usaba) tiene rating y badge "Recomendado" **inventados** (`// Mocking Airbnb-like metrics` — exactamente el mismo anti-patrón que ya se había detectado en el sistema "Airbnb style" huérfano). Se conservó la base construida en este chat (logo real, paleta derivada, carrusel de fotos, amenidades, tags venta/renta, badge "Popular" honesto por `views`, favoritos persistentes, paginación por `limit` creciente, JSON-LD, fixes de contraste/accesibilidad) y **se le integró encima** lo único genuinamente nuevo y sin datos falsos del lado remoto: la sección "Desarrollos & Fichas Destacadas" (`DevelopmentCard` + `DevelopmentDetailModal` + `DESARROLLOS`) — esto además adelanta el pendiente de roadmap "migrar landings estáticas de Hostinger".
  - **Bugs reales encontrados y corregidos durante el merge** (preexistían en el `Home.jsx` de este chat *antes* del merge, no los introdujo el otro track): faltaban los imports de los íconos `Heart`, `MapPin`, `Bed`, `Bath`, `Maximize`, `ArrowRight` de `lucide-react`; el JSX referenciaba `CATEGORIES` pero la constante se llamaba `CATEGORY_DEFINITIONS`; y se usaban `propsMostradas`, `destacadas`, `restantes`, `peso()` y `EXCLUDE_TITLES` sin que existiera su definición en el archivo. Cualquiera de estos hubiera tronado el render completo del Home en producción (pantalla en blanco) — se corrigieron todos; se simplificó quitando la sección "Destacadas" separada (no estaba documentada como parte del alcance y sumaba variables sin definir) a favor de un solo grid con el badge "Popular" ya funcionando igual. `EXCLUDE_TITLES` quedó como arreglo vacío `[]` (placeholder) — si existían títulos de prueba específicos a excluir, pedírselos a Daniel y llenarlo.
  - El archivo resuelto se verificó con `npx esbuild@0.19.12 Home.jsx --format=esm` (sin errores de sintaxis ni marcadores de conflicto sobrantes) antes de escribirlo — pero **sigue sin poder correr `npm run dev`/`npm run build` real desde esta sesión de Cowork**, así que Daniel debe validarlo visualmente antes de dar por bueno el merge.
- **Pendiente de seguridad real**: `security-quarantine/` contiene datos operativos y reglas de acceso que se sacaron de `public/` en un lockdown P0 porque el CRM no tenía autenticación/autorización server-side. No regresar nada de ahí a `public/` hasta resolver eso — hoy el CRM depende solo de auth client-side de Supabase.
- No hay forma de correr `git status`/`git`/shell desde esta sesión de Cowork — todo el trabajo de este archivo se hizo leyendo/escribiendo archivos vía el puente al dispositivo; los comandos de git los corre Daniel en su Terminal.

## Pendientes conocidos (memoria + AUDIT.md)

- **Home "premium" — sesión 2026-09-04, ya fusionado con los 13 commits paralelos de Antigravity (ver sección de arriba).** Superauditoría completa en `HOME_AUDIT.md` (raíz del repo). Lo ya resuelto: logo real + paleta de marca, `useNavigate` (ya no recarga página completa al abrir una ficha), header con CTA "Iniciar sesión", carrusel de fotos real (`images[]`), amenidades reales (`amenities[]`), tags Venta/Renta (`operation_type`), badge "Popular" honesto (`views`, nunca inventado), favoritos persistentes (`localStorage`), paginación real ("Ver más"), estado de error de Supabase distinguido de "sin resultados", JSON-LD, fix de contraste WCAG en el botón "Buscar", perf (fuente ya no bloquea el primer render), accesibilidad (`aria-pressed`, label del buscador), y ahora también la sección de Desarrollos/Fichas estáticas integrada al Home.
- **A propósito NO tocado** (fuera de alcance de este chat o requiere decisión/verificación de Daniel):
  - `select('*')` en las consultas a Supabase — se mantiene.
  - El desajuste `city` vs `municipality` del esquema real (`city` no está confirmada como columna en `supabase_schema.sql`) — la búsqueda ahora filtra por `title`/`municipality`/`address` (se quitó `city` del filtro por seguridad, para no arriesgar un error de columna inexistente); en pantalla se sigue mostrando `city || municipality || 'Chiapas'` como fallback de visualización, que es inofensivo aunque `city` no exista.
  - Filtro por `status` ('Disponible'/'Apartado'/'Vendido') — Home sigue filtrando solo por `active=true`.
  - `SHOW_STATS`, y los archivos huérfanos del sistema "Airbnb style" (`src/index.css` líneas 34-373, `PropertyCard.jsx` con su rating/badge inventado, `Filters.jsx`, `Navbar.jsx`) — siguen sin borrar, `PropertyCard.jsx` en particular **no debe usarse en `Home.jsx`** por los datos inventados que contiene.
  - `EXCLUDE_TITLES` quedó vacío (ver arriba) — confirmar con Daniel si hace falta.
  - Sigue sin poder verificarse `npm run dev`/`npm run build` real desde esta sesión de Cowork.
- Stripe payments, Master Admin Dashboard, PWA
- Migrar landings estáticas de Hostinger — **en progreso**: `desarrollos.js` ya trae Bella Vista Ocozocoautla y La Cañada Eco-Campestre migradas y visibles en el Home; faltan Monte de los Olivos, Colinas, Sima Park, El Higo Copoya, Montecristo, Quinta Berriozábal, Cuauhtli — sin tocar MX records de Hostinger todavía.

# Auditoría del Home público — Propiedades en Chiapas
**Fecha:** 2026-09-04 · **Archivo auditado:** `src/components/Home.jsx` (+ dependencias directas)
**Restricción del cliente:** conservar la estructura actual tipo Airbnb (header → hero/buscador → categorías → grid de tarjetas → banner promo → footer). Nada aquí propone cambiar esa estructura — todo es dentro de ella.

---

## 0. El hallazgo más grande: ya existe un segundo sistema "Airbnb" en el repo, y está muerto

Antes de la lista punto por punto, esto merece su propio apartado porque cambia cómo deberíamos ejecutar varios de los puntos de abajo.

`Home.jsx` es 100% autocontenido: su propio `<style>{STYLES}</style>` y su propio componente `Card` inline. Pero el repo tiene **otro** sistema de diseño "Airbnb style" construido en paralelo, completo y con su propio CSS, que **no se usa en ningún lado**:

- `src/index.css` (líneas 34-373) tiene, literalmente comentado como `/* Navbar (Airbnb style) */` y `/* Property Card (Airbnb style) */`: un navbar con `.search-pill` (buscador tipo píldora dividida), `.categories-wrapper` con subrayado activo, `.properties-grid`, `.properties-slider` (carrusel horizontal con scroll-snap para secciones tipo "Populares en X"), `.property-card` con badge de "guest favorite" y rating, y un `.floating-map-btn` (botón flotante "Ver mapa", el gesto clásico de Airbnb).
- `src/components/PropertyCard.jsx` — tarjeta con badge "Recomendado", rating con estrella SVG, chips de amenidades (+N más). El propio código dice en un comentario: `// Mocking Airbnb-like metrics`.
- `src/components/Filters.jsx` — barra de filtros con buscador + selects de estado/desarrollo + botón.
- `src/components/Navbar.jsx` — navbar independiente con el mismo logo/wordmark en texto.

Ninguno de los cuatro se importa desde `App.jsx` ni desde `Home.jsx` (lo confirmé con grep sobre todo `src/`). Es trabajo terminado y estilizado que quedó huérfano cuando `Home.jsx` se reconstruyó con su paleta propia "PEC".

**Por qué importa:** no estás partiendo de cero para varias de las mejoras de abajo — ya hay una versión de la tarjeta con rating y amenidades, ya hay un botón de mapa flotante, ya hay un carrusel horizontal por categoría. La decisión no es "construir o no construir", es **portar las ideas útiles al `Card` actual de `Home.jsx` (respetando tu paleta nueva) y borrar lo demás**, no resucitar el sistema viejo completo (tiene su propia paleta `--primary:#1A365D` que no es la tuya, y su rating está inventado — ver punto 1).

**Riesgo si se ignora:** si en algún momento otro asistente (Antigravity, GPT) o tú mismo importan `PropertyCard.jsx` pensando que es "la tarjeta buena", el sitio saldría con dos paletas de color al mismo tiempo y con un rating falso visible a usuarios reales.

---

## 1. Datos reales vs. datos inventados (prioridad alta — confianza del usuario)

Comparé `Home.jsx` contra el esquema real (`supabase_schema.sql`, tabla `properties`):

| Campo real en la tabla | ¿Home.jsx lo usa? | Nota |
|---|---|---|
| `images text[]` (múltiples fotos) | ❌ No — el `Card` solo pinta `featured_image_url` | Cada propiedad probablemente ya tiene más de una foto guardada y la tarjeta muestra una sola. El swipe de fotos en hover (el gesto #1 de Airbnb) es viable **hoy**, con datos reales, sin inventar nada. |
| `amenities text[]` | ❌ No | `PropertyCard.jsx` (el huérfano del punto 0) ya trae la lógica de chips `+N más` lista para portar. |
| `views int` | ❌ No | Es la métrica real más parecida a "popularidad" que existe. Se puede usar para un badge honesto tipo "Popular esta semana" (top N por vistas). |
| `operation_type` ('Venta'/'Renta') | ❌ No se muestra en la tarjeta ni se filtra | Un usuario no puede saber, viendo el grid, si una propiedad es para comprar o para rentar. Para un portal que mezcla ambos, esto es información básica de decisión, no un "nice to have". |
| `status` ('Disponible'/'Apartado'/'Vendido') | ⚠️ Sin verificar | La consulta filtra solo `active=true`. Si `active` y `status` no son estrictamente el mismo interruptor en tu flujo de trabajo, una propiedad `Apartado` o `Vendido` con `active=true` se seguiría mostrando como disponible. **No lo cambio sin que confirmes cómo se usan ambos campos hoy** — lo dejo como TODO explícito. |
| `city` (usado en `Card`, línea `propiedad.city`) | — | El esquema que tengo **no tiene columna `city`**, tiene `municipality` y `colony`. Puede que la tabla real ya se haya alterado después de este `.sql` (el archivo es de mayo). Verifícalo en el dashboard de Supabase — si `city` no existe, esa línea siempre cae al fallback `'Chiapas'` y todas las tarjetas se ven idénticas en la zona. |
| `garages` | ❌ No se muestra | Menor, pero es dato real gratis para la fila de specs. |

**El rating/"guest favorite" de `PropertyCard.jsx` está inventado** (`property.rating || "4.92"` fijo, y el badge sale por un hash del id, no por datos reales — lo dice el propio comentario del archivo). Si en algún punto de esta lista decides traer ese elemento visual a `Home.jsx`, la recomendación es: o se ancla a `views` real con una etiqueta honesta ("Popular", no "4.92 ⭐"), o no se hace. Mostrar una calificación de estrellas fabricada a compradores reales de una propiedad es el tipo de cosa que, si se descubre, cuesta más confianza de la que gana en clics.

---

## 2. Código muerto y arquitectura duplicada (prioridad media — no rompe nada, pero acumula riesgo)

- `Navbar.jsx`, `Filters.jsx`, `PropertyCard.jsx` y ~250 líneas de `index.css` no se usan en ninguna ruta activa (confirmado por grep). No son "por si acaso" inofensivos: son una segunda paleta de marca (`--primary:#1A365D`) y un segundo componente de tarjeta que puede confundir a cualquiera (humano o IA) que edite el repo después.
- `SHOW_STATS = false` en `Home.jsx` — una barra de stats que se construyó y se apagó, sin usar. Decide: ¿la terminamos o la borramos junto con el comentario "mantenido por compatibilidad futura"?
- `.tag-feat` (CSS) está definida pero nunca se renderiza — solo existe `tag-land`. Dead CSS, bajo riesgo, pero lo actualicé de paso con el rojo de marca por si se retoma.
- **`useNavigate` está importado en `Home.jsx` (línea 3) pero nunca se usa.** El click de cada tarjeta navega con `window.location.href = '/propiedad/' + id` — eso fuerza una **recarga completa de página** en vez de una transición de SPA. En un sitio "tipo Airbnb" esto se siente: Airbnb nunca recarga la página al abrir un listado, la tarjeta transiciona al instante. Este es probablemente el cambio de **mayor impacto por esfuerzo** de toda esta auditoría — es una línea de código (`navigate('/propiedad/' + id)` en vez de `window.location.href = ...`), no un rediseño, y hace que todo el sitio se sienta más rápido y más "app", sin tocar la estructura.

---

## 3. UX / conversión — lo que falta para sentirse Airbnb de verdad (no solo verse)

Manteniendo tu estructura exacta:

- **Sin paginación**: 9 propiedades en la vista inicial, 24 tope en búsqueda, sin "cargar más". Si tienes más inventario que eso, una parte queda invisible siempre.
- **Favoritos no persisten** (`useState` puro) — el corazón se ve funcional pero se olvida al recargar. Airbnb persiste la lista de guardados entre sesiones; aquí ni siquiera sobrevive un F5.
- **Una sola foto por tarjeta** — cubierto en el punto 1, dato real disponible, no usado.
- **Sin control de orden** (precio ↑↓, más recientes) — hoy solo hay categoría + texto libre.
- **Sin filtro de precio** — para bienes raíces, probablemente el filtro más pedido después de la ubicación, y no existe ninguno.
- **Header sin CTA propio** (ya lo habíamos marcado antes de este mensaje): con el logo ya puesto, el lado derecho del header sigue vacío — el login vive solo en el footer. Un header "tipo Airbnb" normalmente trae al menos un CTA visible (login o "publica tu propiedad") sin que el usuario tenga que bajar hasta el footer.
- **Banner "Para asesores" con el mismo peso visual que el catálogo** — compite por atención con el grid de propiedades, que es la tarea principal del usuario que llega a `/`.
- **Carrusel horizontal por categoría** — ya existe el CSS (`.properties-slider`, punto 0) para un patrón tipo "Populares en Tuxtla" que hoy no se usa; el grid actual es una sola sección "todas".
- **Botón de mapa flotante** — también ya existe el CSS (`.floating-map-btn`) sin componente conectado ni lógica de mapa detrás; lo marco como pendiente de decisión, no como algo para construir ya (implica agregar un mapa real, es un salto de alcance mayor que el resto de esta lista).

---

## 4. SEO

- Sin JSON-LD (`schema.org`/`RealEstateListing` o `ItemList`) — solo hay meta tags básicos vía `Helmet`. Para un portal que se posiciona como "#1 de Chiapas" y cuyo canal principal es orgánico, es la pieza técnica de SEO con mejor costo/beneficio que falta.
- `og:image` apunta a `https://propiedadesenchiapas.com/og-portal.jpg` — no lo pude verificar (no toco `public/` sin que me lo pidas); si ese archivo no existe, cualquier link compartido en WhatsApp/Facebook sale sin imagen de vista previa.
- Meta tags estáticos sin importar filtros activos — normal para un Home de SPA, solo lo dejo anotado por si en algún momento quieres long-tail por municipio.

---

## 5. Performance

- La fuente `Plus Jakarta Sans` se carga con `@import` **dentro** del `<style>` inyectado por JS — esto bloquea el render más que un `<link rel="preload">` en el `<head>` del HTML. Cambio pequeño, mejora el primer pintado, especialmente relevante si parte de tu tráfico entra desde conexiones más lentas en Chiapas.
- La consulta a Supabase pide `select('*')` — trae todas las columnas (`description`, `images`, `amenities`, etc.) para pintar solo 9 campos en la tarjeta. Con `select('id,title,price,price_suffix,type,municipality,bedrooms,bathrooms,size_m2,featured_image_url,landing_slug')` (ajustado a los campos reales que uses) se reduce el payload por request.
- Imágenes sin `width`/`height` explícitos en el `<img>` — el contenedor sí tiene `aspect-ratio` fijo en CSS, así que el riesgo de salto de layout (CLS) es bajo, pero no cero en navegadores viejos.

---

## 6. Accesibilidad

- El input de búsqueda no tiene `<label>` asociado, solo `placeholder` — un lector de pantalla no anuncia qué campo es una vez que el usuario empieza a escribir (el placeholder desaparece).
- Los botones de categoría (`.pec-cat.on`) no tienen `aria-pressed` — el estado "activo" es solo visual (color), no se anuncia.
- El corazón de favoritos tiene `aria-label` fijo ("Guardar en favoritos") que no cambia a "Quitar de favoritos" cuando ya está marcado.
- **Contraste verificado con números reales** (no a ojo) sobre la paleta nueva que acabamos de aplicar:

  | Combinación | Ratio | ¿Pasa AA (4.5:1 texto normal)? |
  |---|---|---|
  | Texto muted `#5C6B8A` sobre blanco | 5.35:1 | ✅ |
  | Texto verde `--emerald` sobre blanco | 6.72:1 | ✅ |
  | Texto tinta `--ink` sobre blanco | 19.0:1 | ✅ |
  | Texto blanco sobre botón "Buscar" (`--emerald-2` sólido) | **2.93:1** | ❌ **No pasa** |

  El botón "Buscar" con texto blanco sobre el verde vivo (`--emerald-2`) no alcanza el mínimo de contraste — esto ya pasaba con el verde anterior también, no es algo que haya introducido el cambio de paleta de hoy, pero como pediste auditar todo, queda registrado. Fix sugerido si quieres corregirlo: oscurecer ese verde específico (solo para el fondo sólido del botón, no para los degradados) a `#17822C` (≈4.9:1, ya pasa) — es un ajuste de una línea, lo dejo pendiente de tu ok porque cambia el tono exacto del verde en ese único lugar.

---

## Resumen ejecutivo (si solo lees esto)

1. **Hay un segundo sistema de diseño Airbnb completo y sin usar en el repo** (`index.css` + `PropertyCard.jsx` + `Filters.jsx` + `Navbar.jsx`) — antes de construir nada nuevo, decide qué se porta al `Home.jsx` actual y qué se borra.
2. **El click en cada tarjeta recarga la página entera** (`useNavigate` importado pero no usado) — el fix de mayor impacto por menor esfuerzo de toda la lista.
3. **Hay datos reales sin usar**: multi-foto (`images[]`), amenidades (`amenities[]`), y `views` como métrica honesta de popularidad — en vez del rating inventado que existe en el componente huérfano.
4. **`operation_type` (Venta/Renta) no se ve en el grid** — riesgo de confusión real para quien navega.
5. Botón "Buscar" con contraste de texto insuficiente (dato verificado, no opinión).

## Cómo lo ejecutamos

Como quedamos, vamos punto por punto — dime con cuál seguimos. Mi sugerencia de orden por impacto/esfuerzo, pero es tu decisión:

1. Fix de navegación SPA (`useNavigate`) — 1 línea, impacto alto.
2. Multi-foto en tarjeta desde `images[]` — dato real, sin inventar nada.
3. Badge de "Popular" honesto desde `views`, retirando cualquier tentación de usar el rating falso del componente huérfano.
4. Mostrar `operation_type` en la tarjeta.
5. Limpieza del código muerto (`Navbar.jsx`, `Filters.jsx`, `PropertyCard.jsx`, CSS huérfano) — una vez decidido qué se porta.
6. El resto de la lista (paginación, favoritos persistentes, filtro de precio, header CTA, JSON-LD, performance, a11y) en el orden que prefieras.

PROYECTO: Propiedades en Chiapas
PASO ACTUAL: Auditoría inicial
OBJETIVO DEL PASO: Inventariar estado real
HERRAMIENTA USADA: Antigravity + terminal
PROMPT USADO: ver Claude
RESULTADO OBTENIDO:
  - Build: OK (Éxito, generado assets/app.js de 750.30 KB y assets/index.css de 9.16 KB en 4.23s)
  - Lint: 68 errores / 1 warning
  - Rutas detectadas:
    - `/` (Home, Public)
    - `/asesores` (LandingCaptacion, Public)
    - `/card/:id` (DigitalCard, Public, inicia con `/card/`)
    - `/l/:slug` (LandingViewer, Public, inicia con `/l/`)
    - `/crm` (Dashboard, Protegido, inicia con `/crm`)
    - `/bella-vista` y `/bella-vista-ocozocoautla` (BellaVistaLanding, Public)
  - Componentes (nombre + KB):
    - AgencyManager.jsx: 2.39 KB
    - AnalyticsView.jsx: 5.45 KB
    - Dashboard.jsx: 30.06 KB
    - DigitalCard.jsx: 10.54 KB
    - Filters.jsx: 1.35 KB
    - Home.jsx: 33.27 KB
    - LandingCaptacion.jsx: 64.15 KB
    - LandingManager.jsx: 16.18 KB
    - LandingViewer.jsx: 2.03 KB
    - Login.jsx: 10.54 KB
    - Navbar.jsx: 1.95 KB
    - PropertyCard.jsx: 3.56 KB
    - PropertyDetail.jsx: 35.95 KB
    - PropertyManager.jsx: 4.77 KB
    - PropertyTable.jsx: 3.58 KB
    - UserManager.jsx: 8.11 KB
  - Supabase: conectado + env vars referenciadas (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
  - Stripe: no iniciado
  - PWA: no
  - Branch actual + último commit: feat/bella-vista-landing | e32dd43 deploy: update ftp credentials and apply prefix-preserving subdirectory routing
ARCHIVOS CREADOS O MODIFICADOS: ninguno (solo lectura)
ERRORES DETECTADOS:
  1. Temporal Dead Zone (TDZ): Funciones y estados accedidos antes de ser declarados (ej. `fetchAgencies` en AgencyManager.jsx, `fetchData` en DigitalCard.jsx, `setAgentProfile` en Dashboard.jsx).
  2. Efectos con setState síncrono: Llamadas directas a setState dentro de `useEffect` que provocan re-renders en cascada (Dashboard.jsx, LandingManager.jsx, PropertyDetail.jsx, UserManager.jsx).
  3. Función impura en render: Uso de `Math.random()` durante el renderizado en `PropertyCard.jsx` (línea 12).
  4. Importaciones y variables sin usar: Legacy `import React` en la mayoría de los archivos y variables declaradas obsoletas (ej. `MUNICIPALITIES` en Home.jsx, `LockedOverlay` en Dashboard.jsx).
  5. Error sintáctico de tracking: Salto de línea inesperado entre función y llamada en `useBellaVistaTracking.js` (línea 46).
RIESGOS:
  1. Caídas en runtime por TDZ: La invocación de funciones antes de su declaración causará errores fatales si cambian los flujos de inicialización.
  2. Comportamiento inestable por renderizado impuro: La evaluación de `Math.random()` al renderizar tarjetas de propiedad puede generar estados visuales inconsistentes o bucles infinitos de actualización.
  3. Degradación de rendimiento: Los renders en cascada por setState síncrono en componentes masivos (Dashboard 30KB, PropertyDetail 35KB) ralentizan la interfaz en dispositivos de gama media/baja.
PENDIENTES detectados en código (TODO/FIXME): ninguno detectado en comentarios de código
DECISIÓN QUE NECESITA CLAUDE: ninguna
RECOMENDACIÓN DEL AGENTE INTERMEDIO: Corregir los errores de Temporal Dead Zone (TDZ) en `AgencyManager.jsx`, `DigitalCard.jsx` y `Dashboard.jsx` moviendo las declaraciones de las funciones/estados antes de sus llamadas en `useEffect` para asegurar la estabilidad del runtime.

PROYECTO: Propiedades en Chiapas
PASO ACTUAL: Estabilización (Paso 2)
OBJETIVO DEL PASO: Matar errores de runtime + aclarar branch
HERRAMIENTA USADA: Antigravity + terminal
PROMPT USADO: ver Claude
RESULTADO OBTENIDO:
  - Estado branch: trabajo a medias (la branch feat/bella-vista-landing tiene 25 archivos modificados con cambios locales pendientes de commitear y probar en profundidad)
  - Errores lint: antes 68 → después autofix 66 → después manual 66
  - Math.random PropertyCard: corregido (reemplazado por una fórmula estable y determinista basada en el ID de la propiedad)
  - Tracking línea 46: corregido (eliminado el salto de línea inesperado entre el bloque de la función autoejecutable y sus argumentos en useBellaVistaTracking.js)
  - TDZ AgencyManager: corregido (declaración de fetchAgencies movida antes de ser llamada por useEffect)
  - TDZ DigitalCard: corregido (declaración de fetchData movida antes de ser llamada por useEffect)
  - TDZ Dashboard: corregido (declaración de agentProfile y sus dependencias hoisted para evitar accesos previos en useEffect)
  - setState useEffect: sin loops (se verificaron Dashboard, LandingManager, PropertyDetail y UserManager; todos son estables y no causan loop infinito de renderizado)
  - Build final: OK
ARCHIVOS MODIFICADOS:
  - deploy_chiapas.js (32 líneas cambiadas)
  - list_chiapas_ftp.js (4 líneas cambiadas)
  - public/.htaccess (8 líneas cambiadas)
  - src/App.jsx (14 líneas cambiadas)
  - src/components/AgencyManager.jsx (16 líneas cambiadas)
  - src/components/Dashboard.jsx (64 líneas cambiadas)
  - src/components/DigitalCard.jsx (16 líneas cambiadas)
  - src/components/PropertyCard.jsx (4 líneas cambiadas)
  - src/modules/developments/bella-vista/BellaVistaLanding.jsx (75 líneas cambiadas)
  - src/modules/developments/bella-vista/components/AmenidadCard.jsx (21 líneas cambiadas)
  - src/modules/developments/bella-vista/components/ScrollReveal.jsx (52 líneas cambiadas)
  - src/modules/developments/bella-vista/components/WhatsAppFloat.jsx (41 líneas cambiadas)
  - src/modules/developments/bella-vista/content/amenidades.json (37 líneas cambiadas)
  - src/modules/developments/bella-vista/content/faq.json (25 líneas cambiadas)
  - src/modules/developments/bella-vista/content/testimonios.json (19 líneas cambiadas)
  - src/modules/developments/bella-vista/hooks/useBellaVistaTracking.js (4 líneas cambiadas)
  - src/modules/developments/bella-vista/sections/Amenidades.jsx (38 líneas cambiadas)
  - src/modules/developments/bella-vista/sections/CTAFinal.jsx (238 líneas cambiadas)
  - src/modules/developments/bella-vista/sections/ExperienceReel.jsx (135 líneas cambiadas)
  - src/modules/developments/bella-vista/sections/FAQ.jsx (54 líneas cambiadas)
  - src/modules/developments/bella-vista/sections/HeroCinematic.jsx (112 líneas cambiadas)
  - src/modules/developments/bella-vista/sections/Inversion.jsx (192 líneas cambiadas)
  - src/modules/developments/bella-vista/sections/Manifiesto.jsx (50 líneas cambiadas)
  - src/modules/developments/bella-vista/sections/Testimonios.jsx (62 líneas cambiadas)
  - src/modules/developments/bella-vista/sections/UbicacionMapa.jsx (117 líneas cambiadas)
ERRORES DETECTADOS: Ninguno crítico de runtime. Quedan advertencias estéticas de variables importadas sin usar (p. ej., 'React is defined but never used') no críticas para el runtime.
RIESGOS:
  - 1. Desincronización con main: Al tener tantos archivos pendientes de commit y merge, la rama puede divergir.
  - 2. Cambios colaterales sin probar en producción: Las modificaciones hechas en componentes transversales como Dashboard o PropertyCard deben validarse minuciosamente por los asesores.
  - 3. Acumulación de warnings de linting: Aunque no son errores de runtime, no resolver las advertencias de variables no usadas puede dificultar futuras auditorías de código.
PENDIENTES:
  - Commitear los cambios estabilizados.
  - Solicitar feedback a Claude para el merge final.
DECISIÓN QUE NECESITA CLAUDE: ¿Mergear la rama feat/bella-vista-landing a main o continuar testeando de forma aislada?
RECOMENDACIÓN DEL AGENTE INTERMEDIO: Mantener la rama `feat/bella-vista-landing` para pruebas finales antes de mergear a `main`. Ya no hay errores de runtime ni TDZ críticos.

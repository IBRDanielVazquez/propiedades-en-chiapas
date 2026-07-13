export interface Hotspot {
  id: string;
  yaw: number;
  pitch: number;
  title: string;
  description: string;
  type: 'navigation' | 'info' | 'action' | 'reference';
  targetScene?: string;
  actionUrl?: string;
  icon?: string;
}

export interface Scene {
  id: string;
  orden: number;
  title: string;
  file: string;
  thumb: string;
  initialYaw: number;
  initialPitch: number;
  coords: { x: number; y: number }; // Para el minimapa
  hotspots: Hotspot[];
}

export const rioja360Tour: Scene[] = [
  {
    id: "pano_01",
    orden: 1,
    title: "Acceso Principal",
    file: "/rioja/360/optimizadas/rioja-360-pano_01.webp",
    thumb: "/rioja/360/miniaturas/rioja-360-pano_01.webp",
    initialYaw: 0,
    initialPitch: 0,
    coords: { x: 30, y: 80 },
    hotspots: [
      {
        id: "hs_nav_to_pano02",
        yaw: 0.15,
        pitch: -0.1,
        title: "Ingresar al Desarrollo",
        description: "Avanza hacia el camino principal de RIOJA.",
        type: "navigation",
        targetScene: "pano_02"
      },
      {
        id: "hs_info_access",
        yaw: 0.8,
        pitch: 0.05,
        title: "Entrada a Rioja",
        description: "Acceso diseñado para conectar de manera segura con la autopista y calles aledañas.",
        type: "info",
        icon: "info"
      },
      {
        id: "hs_info_ubicacion",
        yaw: -0.8,
        pitch: 0.02,
        title: "Ubicación RIOJA",
        description: "Ubicado en la zona de mayor crecimiento campestre y alta plusvalía de Berriozábal, Chiapas.",
        type: "info",
        icon: "map"
      },
      {
        id: "hs_ref_autodromo",
        yaw: 2.9,
        pitch: 0.08,
        title: "Autódromo Chiapas",
        description: "A unos minutos del desarrollo, un punto de referencia deportivo y de alta conectividad en la zona.",
        type: "reference",
        icon: "compass"
      },
      {
        id: "hs_ref_zona_habitada",
        yaw: -1.8,
        pitch: -0.05,
        title: "Zona Habitada",
        description: "El desarrollo cuenta con construcciones activas y viviendas habitadas a los alrededores, asegurando viabilidad.",
        type: "reference",
        icon: "home"
      },
      {
        id: "hs_action_maps",
        yaw: -2.3,
        pitch: -0.15,
        title: "Abrir en Google Maps",
        description: "Obtén la ruta exacta para visitar físicamente los lotes en Berriozábal.",
        type: "action",
        actionUrl: "https://maps.app.goo.gl/y2Peb5b5tN5z7M6T7",
        icon: "external-link"
      }
    ]
  },
  {
    id: "pano_02",
    orden: 2,
    title: "Camino Principal",
    file: "/rioja/360/optimizadas/rioja-360-pano_02.webp",
    thumb: "/rioja/360/miniaturas/rioja-360-pano_02.webp",
    initialYaw: 0,
    initialPitch: 0,
    coords: { x: 50, y: 55 },
    hotspots: [
      {
        id: "hs_nav_back_to_pano01",
        yaw: 3.14,
        pitch: -0.1,
        title: "Volver al Acceso",
        description: "Regresa a la entrada principal del desarrollo.",
        type: "navigation",
        targetScene: "pano_01"
      },
      {
        id: "hs_nav_to_pano03",
        yaw: 0.1,
        pitch: -0.08,
        title: "Avanzar al Interior",
        description: "Camina hacia la zona interior de los lotes residenciales.",
        type: "navigation",
        targetScene: "pano_03"
      },
      {
        id: "hs_info_lote",
        yaw: -0.7,
        pitch: -0.05,
        title: "Lotes de 200 m²",
        description: "Medidas estándar de 10 x 20 metros listos para construir a tu ritmo con Escritura Pública.",
        type: "info",
        icon: "layers"
      },
      {
        id: "hs_action_visit",
        yaw: 0.6,
        pitch: 0.02,
        title: "Agendar Visita Guiada",
        description: "Agenda un recorrido personalizado para elegir la ubicación ideal de tu terreno campestre.",
        type: "action",
        actionUrl: "https://wa.link/02846w",
        icon: "calendar"
      }
    ]
  },
  {
    id: "pano_03",
    orden: 3,
    title: "Recorrido Interior",
    file: "/rioja/360/optimizadas/rioja-360-pano_03.webp",
    thumb: "/rioja/360/miniaturas/rioja-360-pano_03.webp",
    initialYaw: 0,
    initialPitch: 0,
    coords: { x: 70, y: 35 },
    hotspots: [
      {
        id: "hs_nav_back_to_pano02",
        yaw: 3.14,
        pitch: -0.1,
        title: "Volver al Camino",
        description: "Regresa a la arteria vial principal del proyecto.",
        type: "navigation",
        targetScene: "pano_02"
      },
      {
        id: "hs_nav_to_pano04",
        yaw: 0.2,
        pitch: 0.25,
        title: "Ver Perspectiva Aérea",
        description: "Elévate para observar la distribución general y el valle completo.",
        type: "navigation",
        targetScene: "pano_04"
      },
      {
        id: "hs_info_naturaleza",
        yaw: -1.2,
        pitch: 0.08,
        title: "Entorno Campestre",
        description: "Clima fresco, vegetación nativa y aire limpio. Diseñado para descanso e inversión patrimonial.",
        type: "info",
        icon: "sparkles"
      },
      {
        id: "hs_action_financiamiento",
        yaw: 0.8,
        pitch: -0.02,
        title: "Consultar Financiamiento",
        description: "Accede al plan de pagos directos desde $1,000 quincenales y enganche de $3,000.",
        type: "action",
        actionUrl: "https://wa.link/02846w",
        icon: "dollar-sign"
      }
    ]
  },
  {
    id: "pano_04",
    orden: 4,
    title: "Vista Panorámica",
    file: "/rioja/360/optimizadas/rioja-360-pano_04.webp",
    thumb: "/rioja/360/miniaturas/rioja-360-pano_04.webp",
    initialYaw: 0,
    initialPitch: -0.2,
    coords: { x: 80, y: 15 },
    hotspots: [
      {
        id: "hs_nav_back_to_pano03",
        yaw: 3.14,
        pitch: -0.4,
        title: "Regresar a Tierra",
        description: "Desciende de nuevo al interior del loteo residencial.",
        type: "navigation",
        targetScene: "pano_03"
      },
      {
        id: "hs_info_vuelo",
        yaw: 0.0,
        pitch: -0.1,
        title: "Vista del Valle",
        description: "Vista panorámica aérea que demuestra la amplitud y la belleza geográfica de la zona campestre de Berriozábal.",
        type: "info",
        icon: "eye"
      },
      {
        id: "hs_action_contacto",
        yaw: -1.5,
        pitch: -0.15,
        title: "Contactar a un Asesor",
        description: "Escríbenos para recibir todos los folletos de distribución oficial de lotes.",
        type: "action",
        actionUrl: "https://wa.link/02846w",
        icon: "phone"
      }
    ]
  }
];

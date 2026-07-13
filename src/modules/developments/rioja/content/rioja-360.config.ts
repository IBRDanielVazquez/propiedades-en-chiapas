export interface Hotspot {
  id: string;
  type: 'navigation' | 'info' | 'location' | 'reference' | 'financiamiento' | 'whatsapp' | 'galeria' | 'google-maps';
  title: string;
  description: string;
  yaw: number;
  pitch: number;
  icon: string;
  targetSceneId?: string;
  url?: string | null;
  enabled: boolean;
  approved: boolean;
}

export interface Scene {
  id: string;
  order: number;
  title: string;
  source: string;
  thumb: string;
  coords: { x: number; y: number }; // Para el minimapa
  initialView: {
    yaw: number;
    pitch: number;
    hfov: number;
  };
  hotspots: Hotspot[];
}

export const rioja360Scenes: Scene[] = [
  {
    id: "vista-aerea-principal",
    order: 1,
    title: "Vista Aérea Principal",
    source: "/rioja/360/optimizadas/rioja-360-pano_04.webp",
    thumb: "/rioja/360/miniaturas/rioja-360-pano_04.webp",
    coords: { x: 50, y: 30 },
    initialView: {
      yaw: 0,
      pitch: -0.2,
      hfov: 100
    },
    hotspots: [
      {
        id: "nav-to-acceso-from-aerea",
        type: "navigation",
        title: "Ir al acceso desde carretera",
        description: "Desciende a la entrada principal a nivel de carretera.",
        yaw: 0.2,
        pitch: -0.3,
        icon: "arrow",
        targetSceneId: "acceso-carretera",
        url: null,
        enabled: true,
        approved: false
      },
      {
        id: "nav-to-general-from-aerea",
        type: "navigation",
        title: "Ver vista aérea general",
        description: "Explora la perspectiva aérea general del valle.",
        yaw: -0.5,
        pitch: -0.15,
        icon: "arrow",
        targetSceneId: "vista-aerea-general",
        url: null,
        enabled: true,
        approved: false
      }
    ]
  },
  {
    id: "acceso-carretera",
    order: 2,
    title: "Acceso Carretera",
    source: "/rioja/360/optimizadas/rioja-360-pano_01.webp",
    thumb: "/rioja/360/miniaturas/rioja-360-pano_01.webp",
    coords: { x: 30, y: 75 },
    initialView: {
      yaw: 0,
      pitch: 0,
      hfov: 100
    },
    hotspots: [
      {
        id: "nav-to-principal-from-acceso",
        type: "navigation",
        title: "Volver a vista aérea principal",
        description: "Sube a la perspectiva aérea principal del proyecto.",
        yaw: 3.14,
        pitch: -0.1,
        icon: "arrow",
        targetSceneId: "vista-aerea-principal",
        url: null,
        enabled: true,
        approved: false
      },
      {
        id: "nav-to-general-from-acceso",
        type: "navigation",
        title: "Ir a vista aérea general",
        description: "Muévete hacia la zona del camino principal.",
        yaw: 0.15,
        pitch: -0.05,
        icon: "arrow",
        targetSceneId: "vista-aerea-general",
        url: null,
        enabled: true,
        approved: false
      }
    ]
  },
  {
    id: "vista-aerea-general",
    order: 3,
    title: "Vista Aérea General",
    source: "/rioja/360/optimizadas/rioja-360-pano_02.webp",
    thumb: "/rioja/360/miniaturas/rioja-360-pano_02.webp",
    coords: { x: 70, y: 65 },
    initialView: {
      yaw: 0,
      pitch: 0,
      hfov: 100
    },
    hotspots: [
      {
        id: "nav-to-principal-from-general",
        type: "navigation",
        title: "Volver a vista aérea principal",
        description: "Regresa a la visualización de inicio.",
        yaw: 3.14,
        pitch: -0.1,
        icon: "arrow",
        targetSceneId: "vista-aerea-principal",
        url: null,
        enabled: true,
        approved: false
      },
      {
        id: "nav-to-acceso-from-general",
        type: "navigation",
        title: "Ir al acceso",
        description: "Muévete de regreso a la portería de entrada.",
        yaw: 0.1,
        pitch: -0.1,
        icon: "arrow",
        targetSceneId: "acceso-carretera",
        url: null,
        enabled: true,
        approved: false
      }
    ]
  }
];

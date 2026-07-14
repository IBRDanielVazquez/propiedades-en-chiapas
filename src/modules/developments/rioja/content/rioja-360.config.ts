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
    "id": "vista-aerea-regional",
    "order": 1,
    "title": "Vista Aérea Regional",
    "source": "/rioja/360/rioja-360-03.webp",
    "thumb": "/rioja/360/miniaturas/rioja-360-03.webp",
    "coords": {
      "x": 70,
      "y": 65
    },
    "initialView": {
      "yaw": 0,
      "pitch": 0,
      "hfov": 100
    },
    "hotspots": [
      {
        "id": "hs-1784047735621",
        "type": "location",
        "title": "Rioja",
        "description": "Terrenos en Venta",
        "yaw": 0.008614875671838038,
        "pitch": -0.09749286569629034,
        "icon": "map",
        "targetSceneId": "vista-aerea-regional",
        "url": null,
        "enabled": true,
        "approved": true
      },
      {
        "id": "hs-1784047831534",
        "type": "info",
        "title": "Autódromo",
        "description": "Súper Óvalo Chiapas",
        "yaw": 3.8574472821531574,
        "pitch": -0.09825246266099597,
        "icon": "info",
        "targetSceneId": "vista-aerea-regional",
        "url": null,
        "enabled": true,
        "approved": true
      },
      {
        "id": "hs-1784047930452",
        "type": "location",
        "title": "Tuxtla Gutiérrez",
        "description": "Escribe una descripción corta aquí.",
        "yaw": 5.135005966121419,
        "pitch": 0.026963934226399422,
        "icon": "navigation2",
        "targetSceneId": "vista-aerea-regional",
        "url": null,
        "enabled": true,
        "approved": true
      }
    ]
  },
  {
    "id": "vista-aerea-principal",
    "order": 2,
    "title": "Vista Aérea Principal",
    "source": "/rioja/360/rioja-360-01.webp",
    "thumb": "/rioja/360/miniaturas/rioja-360-01.webp",
    "coords": {
      "x": 50,
      "y": 30
    },
    "initialView": {
      "yaw": 0,
      "pitch": -0.2,
      "hfov": 100
    },
    "hotspots": [
      {
        "id": "nav-to-acceso-from-aerea",
        "type": "navigation",
        "title": "Ir al acceso desde carretera",
        "description": "Desciende a la entrada principal a nivel de carretera.",
        "yaw": 0.2,
        "pitch": -0.3,
        "icon": "arrow",
        "targetSceneId": "acceso-carretera",
        "url": null,
        "enabled": true,
        "approved": false
      },
      {
        "id": "nav-to-regional-from-aerea",
        "type": "navigation",
        "title": "Ver vista aérea regional",
        "description": "Explora la perspectiva aérea regional del valle.",
        "yaw": -0.5,
        "pitch": -0.15,
        "icon": "arrow",
        "targetSceneId": "vista-aerea-regional",
        "url": null,
        "enabled": true,
        "approved": false
      }
    ]
  },
  {
    "id": "acceso-carretera",
    "order": 3,
    "title": "Acceso Carretera",
    "source": "/rioja/360/rioja-360-02.webp",
    "thumb": "/rioja/360/miniaturas/rioja-360-02.webp",
    "coords": {
      "x": 30,
      "y": 75
    },
    "initialView": {
      "yaw": 0,
      "pitch": 0,
      "hfov": 100
    },
    "hotspots": [
      {
        "id": "nav-to-principal-from-acceso",
        "type": "navigation",
        "title": "Volver a vista aérea principal",
        "description": "Sube a la perspectiva aérea principal del proyecto.",
        "yaw": 3.14,
        "pitch": -0.1,
        "icon": "arrow",
        "targetSceneId": "vista-aerea-principal",
        "url": null,
        "enabled": true,
        "approved": false
      },
      {
        "id": "nav-to-regional-from-acceso",
        "type": "navigation",
        "title": "Ir a vista aérea regional",
        "description": "Muévete hacia la zona del camino principal.",
        "yaw": 0.15,
        "pitch": -0.05,
        "icon": "arrow",
        "targetSceneId": "vista-aerea-regional",
        "url": null,
        "enabled": true,
        "approved": false
      }
    ]
  }
];

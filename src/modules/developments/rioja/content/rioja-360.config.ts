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
      },
      {
        "id": "hs-1784049654569",
        "type": "info",
        "title": "ACCESO",
        "description": "Acceso desde la Carretera Internacional a Tuxtla",
        "yaw": -1.3875516002379653,
        "pitch": -0.7046614597479297,
        "icon": "corner-right",
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
        "title": "Acceso desde carretera",
        "description": "Entrada sobre la Carretera Internacional",
        "yaw": 0.39292433055361675,
        "pitch": -0.2419454972811228,
        "icon": "arrow",
        "targetSceneId": "acceso-carretera",
        "url": null,
        "enabled": true,
        "approved": true
      },
      {
        "id": "hs-1784048184746",
        "type": "info",
        "title": "Camino a Rioja",
        "description": "Ruta hacia los Terrenos en Venta",
        "yaw": -1.5902512650043246,
        "pitch": -0.08619491643474042,
        "icon": "corner-right",
        "targetSceneId": "vista-aerea-regional",
        "url": null,
        "enabled": true,
        "approved": true
      },
      {
        "id": "hs-1784049861723",
        "type": "info",
        "title": "A Tuxtla Gutiérrez",
        "description": "",
        "yaw": 1.558629083488897,
        "pitch": 0.1433456467815324,
        "icon": "map",
        "targetSceneId": "vista-aerea-regional",
        "url": null,
        "enabled": true,
        "approved": true
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

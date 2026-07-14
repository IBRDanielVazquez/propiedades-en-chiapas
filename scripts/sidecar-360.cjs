const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3600;
const CONFIG_PATH = path.join(__dirname, '../src/modules/developments/rioja/content/rioja-360.config.ts');
const WORKSPACE_DIR = path.join(__dirname, '..');

// Función para subir los cambios a producción de manera automática
function autoDeploy() {
  console.log('[Sidecar 360] Iniciando Auto-Deploy a producción...');
  
  const cmd = `git add src/modules/developments/rioja/content/rioja-360.config.ts && git commit -m "update(rioja-360): guardar configuración automáticamente desde el editor web" && git push origin main`;
  
  exec(cmd, { cwd: WORKSPACE_DIR }, (err, stdout, stderr) => {
    if (err) {
      console.error('[Sidecar 360] Error en el Auto-Deploy:', err);
      return;
    }
    console.log('[Sidecar 360] ¡Auto-Deploy completado con éxito!');
    console.log(stdout);
  });
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const scenes = JSON.parse(body);
        if (!Array.isArray(scenes)) {
          throw new Error('La configuración debe ser un array de escenas');
        }

        // Limpiar propiedades temporales locales del JSON antes de guardarlo en producción
        const cleanScenes = scenes.map(scene => {
          const { _localFile, ...rest } = scene;
          return {
            ...rest,
            hotspots: (scene.hotspots || []).map(hs => {
              const { id, type, title, description, yaw, pitch, icon, targetSceneId, url, enabled, approved } = hs;
              return { id, type, title, description, yaw, pitch, icon, targetSceneId, url: url || null, enabled, approved };
            })
          };
        });

        const fileContent = `export interface Hotspot {
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

export const rioja360Scenes: Scene[] = ${JSON.stringify(cleanScenes, null, 2)};
`;

        fs.writeFileSync(CONFIG_PATH, fileContent, 'utf-8');
        console.log(`[Sidecar 360] Configuración escrita correctamente en: ${CONFIG_PATH}`);

        // Disparar la subida automática a producción (Git push) en segundo plano
        autoDeploy();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Configuración guardada en disco e iniciando auto-deploy' }));
      } catch (err) {
        console.error('[Sidecar 360] Error procesando guardado:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`[Sidecar 360] Servidor local escuchando en http://localhost:${PORT}`);
});

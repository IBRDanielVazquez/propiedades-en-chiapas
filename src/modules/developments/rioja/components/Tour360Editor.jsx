import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { 
  X, ChevronLeft, ChevronRight, Volume2, VolumeX, 
  Compass, MapPin, Info, Layers, ExternalLink, 
  Calendar, DollarSign, Eye, Phone, ArrowRight, 
  Home, Sparkles, Plus, Copy, Settings, Download, Trash2,
  // Navegación & movimiento
  Navigation, Navigation2, MoveRight, ChevronsRight, CornerDownRight, Route,
  // Ubicación & terreno
  Mountain, Trees, Flag, Landmark, Building2, Store, Warehouse,
  // Financiero & negocio
  BadgeDollarSign, Wallet, CreditCard, Receipt, TrendingUp, BarChart2,
  // Naturaleza & amenidades
  Sun, Droplets, Wind, Flower2, Leaf, Bird,
  // Construcción & lote
  Ruler, PenTool, Wrench, HardHat, Hammer, Fence,
  // Contacto & social
  MessageCircle, Mail, Share2, UserCheck, Users, Star,
  // Multimedia & extras
  Camera, Image, PlayCircle, Zap, Globe, Search
} from 'lucide-react';
import { rioja360Scenes } from '../content/rioja-360.config';
import '../styles/rioja-360.css';

export default function Tour360Editor() {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const isInitialMount = useRef(true);

  // Obtener estado inicial — descarta el borrador si las rutas de imágenes cambiaron
  const getInitialScenes = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rioja-360-scenes-draft');
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          // Verificar que las rutas source del borrador coincidan con el config actual.
          // Si difieren (config fue actualizado), descartamos el borrador stale.
          const configSources = rioja360Scenes.map(s => s.source).join('|');
          const draftSources  = draft.map(s => s.source).join('|');
          if (draftSources === configSources) {
            return draft; // borrador válido — hotspots conservados
          }
          // Borrador stale: migrar los hotspots al nuevo config
          console.info('[Editor 360] Rutas de imágenes actualizadas — migrando hotspots del borrador.');
          localStorage.removeItem('rioja-360-scenes-draft');
          const migrated = rioja360Scenes.map((scene, i) => ({
            ...scene,
            hotspots: draft[i]?.hotspots ?? scene.hotspots,
          }));
          return migrated;
        } catch (e) {
          console.error('Error al cargar borrador de localStorage', e);
          localStorage.removeItem('rioja-360-scenes-draft');
        }
      }
    }
    return rioja360Scenes;
  };

  // Estados
  const [scenesState, setScenesState] = useState(getInitialScenes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [yawDegrees, setYawDegrees] = useState(0);
  const [pitchDegrees, setPitchDegrees] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [muted, setMuted] = useState(true);

  const [isEditMode, setIsEditMode] = useState(true);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [activeEditHotspot, setActiveEditHotspot] = useState(null);
  const [draggingHotspotId, setDraggingHotspotId] = useState(null);
  const [selectedPreviewHotspot, setSelectedPreviewHotspot] = useState(null);

  // Estado modal "Agregar imagen 360°"
  const [addSceneModal, setAddSceneModal] = useState(null);

  // Drag-and-drop reordenamiento de escenas (barra inferior)
  const [dragSceneIdx, setDragSceneIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // Panel arrastrable de escenas
  const [panelPos, setPanelPos] = useState({ x: 10, y: 60 });
  const panelDrag = useRef({ active: false, startX: 0, startY: 0, origX: 0, origY: 0 });

  // Toast de guardado
  const [saveToast, setSaveToast] = useState(false);
  const [saveStatus, setSaveStatus] = useState('local'); // 'local' | 'server' | 'error'

  // Ref mutable para evitar stale closure en los listeners del visualizador
  const updatePositionsRef = useRef(null);

  // Registro de posición inicial del puntero para diferenciar arrastre de click intencional
  const clickStartPos = useRef({ x: 0, y: 0 });

  const currentScene = scenesState[currentIndex];

  // Persistir cambios locales en localStorage para desarrollo
  useEffect(() => {
    localStorage.setItem('rioja-360-scenes-draft', JSON.stringify(scenesState));
  }, [scenesState]);

  // Audio de ambiente sutil
  useEffect(() => {
    audioRef.current = new Audio("https://www.soundjay.com/nature/sounds/countryside-1.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.12;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (muted) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.log("Autoplay bloqueado por el navegador", err);
      });
    }
  }, [muted]);

  // Mantener la referencia mutable siempre actualizada con la versión más fresca del renderizado
  updatePositionsRef.current = updatePositions;

  // Actualizador manual de coordenadas en 2D (Hotspots Overlays)
  const updatePositions = () => {
    if (!viewerRef.current || !viewerRef.current.dataHelper) return;
    const scene = scenesState[currentIndex];
    if (!scene || !scene.hotspots) return;
    
    // En modo visitante, solo renderizamos los aprobados. En modo edición, todos.
    const visibleHotspots = scene.hotspots.filter(hs => isEditMode || (hs.approved && hs.enabled));

    visibleHotspots.forEach(hs => {
      const el = document.getElementById(`hs-ed-${hs.id}`);
      if (!el) return;
      
      const coords = viewerRef.current.dataHelper.sphericalCoordsToViewerCoords({
        yaw: hs.yaw,
        pitch: hs.pitch
      });
      
      if (coords) {
        el.style.left = `${coords.x}px`;
        el.style.top = `${coords.y}px`;
        el.style.display = 'flex';
      } else {
        el.style.display = 'none';
      }
    });
  };

  // Inicialización única de Photo Sphere Viewer
  useEffect(() => {
    if (!containerRef.current) return;

    viewerRef.current = new Viewer({
      container: containerRef.current,
      panorama: currentScene.source,
      caption: currentScene.title,
      navbar: ['zoom', 'fullscreen'],
      defaultZoomLvl: 0,
      touchmoveTwoFingers: false,
      mousewheelCtrlKey: false,
      defaultYaw: currentScene.initialView.yaw || 0,
      defaultPitch: currentScene.initialView.pitch || 0
    });

    viewerRef.current.addEventListener('position-updated', ({ position }) => {
      const deg = (position.yaw * 180) / Math.PI;
      setYawDegrees(deg);
      setPitchDegrees(position.pitch * (180 / Math.PI));
      if (updatePositionsRef.current) updatePositionsRef.current();
    });

    viewerRef.current.addEventListener('zoom-updated', ({ zoomLevel }) => {
      setZoomLevel(Math.round(zoomLevel));
      if (updatePositionsRef.current) updatePositionsRef.current();
    });

    viewerRef.current.addEventListener('ready', () => {
      setLoading(false);
      setTimeout(() => {
        if (updatePositionsRef.current) updatePositionsRef.current();
      }, 150);
    });

    const handleResize = () => {
      if (updatePositionsRef.current) updatePositionsRef.current();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navegación de escenas (Actualiza Panorama)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (viewerRef.current) {
      setLoading(true);
      setActiveEditHotspot(null);
      setSelectedPreviewHotspot(null);
      
      viewerRef.current.setPanorama(currentScene.source, {
        caption: currentScene.title,
        showLoader: false
      })
      .then(() => {
        setLoading(false);
        viewerRef.current.rotate({
          yaw: currentScene.initialView.yaw || 0,
          pitch: currentScene.initialView.pitch || 0
        });
        setTimeout(updatePositions, 200);
      })
      .catch((err) => {
        console.error("Error cargando panorama:", err);
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handleNext = () => {
    if (isEditMode) return;
    setCurrentIndex((prev) => (prev + 1) % scenesState.length);
  };

  const handlePrev = () => {
    if (isEditMode) return;
    setCurrentIndex((prev) => (prev === 0 ? scenesState.length - 1 : prev - 1));
  };

  // Clic en hotspot
  const handleHotspotClick = (hs) => {
    if (isEditMode) {
      setActiveEditHotspot({ ...hs });
    } else {
      if (hs.type === 'navigation') {
        const idx = scenesState.findIndex(s => s.id === hs.targetSceneId);
        if (idx !== -1) {
          setCurrentIndex(idx);
        }
      } else {
        setSelectedPreviewHotspot(hs);
      }
    }
  };

  // Drag and Drop (Arrastre de Hotspot en 3D)
  const handleMouseDown = (e, hsId) => {
    if (!isEditMode) return;
    e.stopPropagation();
    e.preventDefault();
    setDraggingHotspotId(hsId);
  };

  const handleMouseMove = (e) => {
    if (!isEditMode || !draggingHotspotId) return;
    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (viewerRef.current && viewerRef.current.dataHelper) {
      const coords = viewerRef.current.dataHelper.viewerCoordsToSphericalCoords({ x, y });
      if (coords) {
        setScenesState(prev => prev.map(scene => {
          if (scene.id === currentScene.id) {
            return {
              ...scene,
              hotspots: scene.hotspots.map(hs => {
                if (hs.id === draggingHotspotId) {
                  return { ...hs, yaw: coords.yaw, pitch: coords.pitch };
                }
                return hs;
              })
            };
          }
          return scene;
        }));

        if (activeEditHotspot && activeEditHotspot.id === draggingHotspotId) {
          setActiveEditHotspot(prev => ({ ...prev, yaw: coords.yaw, pitch: coords.pitch }));
        }

        setTimeout(updatePositions, 10);
      }
    }
  };

  const handleMouseUp = () => {
    if (draggingHotspotId) {
      setDraggingHotspotId(null);
    }
  };

  // Registrar posición inicial del click para filtrar gestos de arrastre
  const handleContainerMouseDown = (e) => {
    clickStartPos.current = { x: e.clientX, y: e.clientY };
  };

  // Crear nuevo Hotspot al hacer clic en el visor
  const handleContainerClick = (e) => {
    if (!isEditMode || !isAddingPoint) return;

    // Calcular distancia del arrastre para evitar crear puntos durante un drag de cámara
    const dx = e.clientX - clickStartPos.current.x;
    const dy = e.clientY - clickStartPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Umbral de 6 píxeles: si se movió más, se interpreta como rotación de cámara
    if (distance > 6) return;

    setIsAddingPoint(false);

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (viewerRef.current && viewerRef.current.dataHelper) {
      const coords = viewerRef.current.dataHelper.viewerCoordsToSphericalCoords({ x, y });
      if (coords) {
        const newHs = {
          id: `hs-${Date.now()}`,
          type: 'info',
          title: 'Nuevo Hotspot',
          description: 'Escribe una descripción corta aquí.',
          yaw: coords.yaw,
          pitch: coords.pitch,
          icon: 'info',
          targetSceneId: scenesState[0].id,
          url: null,
          enabled: true,
          approved: false
        };

        setScenesState(prev => prev.map(scene => {
          if (scene.id === currentScene.id) {
            return {
              ...scene,
              hotspots: [...scene.hotspots, newHs]
            };
          }
          return scene;
        }));

        setActiveEditHotspot(newHs);
        setTimeout(updatePositions, 100);
      }
    }
  };

  // Guardar Hotspot editado en formulario
  const handleSaveHotspotForm = (e) => {
    e.preventDefault();
    if (!activeEditHotspot) return;

    setScenesState(prev => prev.map(scene => {
      if (scene.id === currentScene.id) {
        return {
          ...scene,
          hotspots: scene.hotspots.map(hs => hs.id === activeEditHotspot.id ? activeEditHotspot : hs)
        };
      }
      return scene;
    }));

    setActiveEditHotspot(null);
    setTimeout(updatePositions, 50);
  };

  // Eliminar Hotspot
  const handleDeleteHotspot = (hsId) => {
    setScenesState(prev => prev.map(scene => {
      if (scene.id === currentScene.id) {
        return {
          ...scene,
          hotspots: scene.hotspots.filter(hs => hs.id !== hsId)
        };
      }
      return scene;
    }));
    setActiveEditHotspot(null);
    setTimeout(updatePositions, 50);
  };

  // Duplicar Hotspot
  const handleDuplicateHotspot = (hs) => {
    const duplicated = {
      ...hs,
      id: `hs-dup-${Date.now()}`,
      yaw: hs.yaw + 0.1,
      approved: false
    };

    setScenesState(prev => prev.map(scene => {
      if (scene.id === currentScene.id) {
        return {
          ...scene,
          hotspots: [...scene.hotspots, duplicated]
        };
      }
      return scene;
    }));
    setActiveEditHotspot(duplicated);
    setTimeout(updatePositions, 100);
  };

  // Copiar configuración limpia para pegar en rioja-360.config.ts
  const handleCopyConfig = () => {
    const output = `export const rioja360Scenes = ${JSON.stringify(scenesState, null, 2)};`;
    navigator.clipboard.writeText(output).then(() => {
      alert("¡Configuración copiada! Pégala directamente en src/modules/developments/rioja/content/rioja-360.config.ts");
    }).catch(err => {
      alert("Error al copiar configuración: " + err);
    });
  };

  // Descargar archivo JSON
  const handleDownloadConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scenesState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "rioja-360-config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copiar posición actual de la cámara
  const handleCopyCurrentPosition = () => {
    if (!viewerRef.current) return;
    const pos = viewerRef.current.getPosition();
    const formatted = JSON.stringify({
      yaw: parseFloat(pos.yaw.toFixed(4)),
      pitch: parseFloat(pos.pitch.toFixed(4))
    }, null, 2);
    
    navigator.clipboard.writeText(formatted).then(() => {
      alert(`¡Coordenadas copiadas!\n${formatted}`);
    });
  };

  // Limpiar borrador de localStorage y restaurar la original
  const handleResetConfig = () => {
    if (window.confirm("¿Seguro que deseas restaurar la configuración original? Esto eliminará todos tus borradores locales.")) {
      localStorage.removeItem('rioja-360-scenes-draft');
      setScenesState(rioja360Scenes);
      setActiveEditHotspot(null);
      setTimeout(updatePositions, 100);
    }
  };

  // ── GESTIÓN DE ESCENAS ────────────────────────────────────────────────────

  // Reordenar escenas (dirección: -1 = subir, +1 = bajar)
  const handleReorderScene = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= scenesState.length) return;
    setScenesState(prev => {
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      // Recalcular order
      return arr.map((s, i) => ({ ...s, order: i + 1 }));
    });
    setCurrentIndex(newIdx);
  };

  // Eliminar escena
  const handleDeleteScene = (idx) => {
    if (scenesState.length <= 1) {
      alert('Debe quedar al menos una escena en el recorrido.');
      return;
    }
    if (!window.confirm(`¿Eliminar la escena "${scenesState[idx].title}" del recorrido? No se borra el archivo original.`)) return;
    setScenesState(prev => {
      const arr = prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 }));
      return arr;
    });
    setCurrentIndex(c => (c >= idx && c > 0 ? c - 1 : c));
  };

  // Abrir selector de archivo local para agregar panorámica
  const handleAddSceneFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validación de tamaño (max 30MB)
      if (file.size > 30 * 1024 * 1024) {
        alert(`El archivo "${file.name}" pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB. El máximo permitido es 30 MB.`);
        return;
      }

      // Validación de extensión
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        alert(`Formato no permitido: .${ext}. Usa JPG, JPEG, PNG o WEBP.`);
        return;
      }

      // Validar dimensiones y ratio 2:1
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        if (ratio < 1.9 || ratio > 2.1) {
          URL.revokeObjectURL(previewUrl);
          alert(
            `La imagen no tiene proporción equirectangular 2:1 (panorámica 360°).\n` +
            `Dimensiones detectadas: ${img.naturalWidth} × ${img.naturalHeight} (ratio: ${ratio.toFixed(2)}).\n` +
            `Se requiere una relación ancho/alto entre 1.90 y 2.10.`
          );
          return;
        }

        const newId = `escena-${Date.now()}`;
        setAddSceneModal({
          file,
          previewUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          id: newId,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          order: scenesState.length + 1,
          approved: false
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(previewUrl);
        alert('El archivo está corrupto o no es una imagen válida.');
      };
      img.src = previewUrl;
    };
    input.click();
  };

  // Guardar configuración en localStorage e intentar sincronizar con el Servidor local Sidecar
  const handleSaveConfig = async () => {
    // 1. Guardado en borrador local del navegador
    localStorage.setItem('rioja-360-scenes-draft', JSON.stringify(scenesState));
    setSaveStatus('local');
    setSaveToast(true);

    // 2. Intentar guardar directamente en el disco (sidecar local en puerto 3600)
    try {
      const response = await fetch('http://localhost:3600/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scenesState),
      });

      if (response.ok) {
        setSaveStatus('server');
      } else {
        console.warn('[Editor 360] El servidor local respondió con error:', response.status);
      }
    } catch {
      // Falla silenciosa si no está el sidecar corriendo (comportamiento normal en producción externa)
      console.info('[Editor 360] Sincronización local offline (esperado fuera de desarrollo local).');
    }

    // Ocultar el toast tras 3.5 segundos
    setTimeout(() => setSaveToast(false), 3500);
  };

  // Arrastar panel de escenas
  const handlePanelMouseDown = (e) => {
    panelDrag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: panelPos.x,
      origY: panelPos.y
    };
    const onMove = (ev) => {
      if (!panelDrag.current.active) return;
      setPanelPos({
        x: panelDrag.current.origX + (ev.clientX - panelDrag.current.startX),
        y: panelDrag.current.origY + (ev.clientY - panelDrag.current.startY)
      });
    };
    const onUp = () => {
      panelDrag.current.active = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    e.preventDefault();
  };

  // Confirmar incorporación de nueva escena al editor
  const handleConfirmAddScene = () => {
    if (!addSceneModal) return;
    const newScene = {
      id: addSceneModal.id,
      order: scenesState.length + 1,
      title: addSceneModal.title || `Escena ${scenesState.length + 1}`,
      source: addSceneModal.previewUrl,
      thumb: addSceneModal.previewUrl,
      coords: { x: 50, y: 50 },
      initialView: { yaw: 0, pitch: 0, hfov: 100 },
      hotspots: [],
      approved: addSceneModal.approved,
      _localFile: true,
    };
    setScenesState(prev => [...prev, newScene]);
    setCurrentIndex(scenesState.length);
    setAddSceneModal(null);
  };

  const handleDragSceneStart = (e, idx) => {
    setDragSceneIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    // Imagen fantasma semitransparente
    const el = e.currentTarget;
    e.dataTransfer.setDragImage(el, el.offsetWidth / 2, el.offsetHeight / 2);
  };

  const handleDragSceneOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (idx !== dragSceneIdx) setDragOverIdx(idx);
  };

  const handleDropScene = (e, dropIdx) => {
    e.preventDefault();
    if (dragSceneIdx === null || dragSceneIdx === dropIdx) {
      setDragSceneIdx(null);
      setDragOverIdx(null);
      return;
    }
    setScenesState(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragSceneIdx, 1);
      arr.splice(dropIdx, 0, moved);
      return arr.map((s, i) => ({ ...s, order: i + 1 }));
    });
    // El currentIndex sigue a la escena que se movió
    setCurrentIndex(dropIdx);
    setDragSceneIdx(null);
    setDragOverIdx(null);
  };

  const handleDragSceneEnd = () => {
    setDragSceneIdx(null);
    setDragOverIdx(null);
  };


  // Cardinales para la brújula
  const getCardinalDirection = (deg) => {
    let norm = (deg + 180) % 360;
    if (norm < 0) norm += 360;
    
    if (norm >= 337.5 || norm < 22.5) return 'S';
    if (norm >= 22.5 && norm < 67.5) return 'SO';
    if (norm >= 67.5 && norm < 112.5) return 'O';
    if (norm >= 112.5 && norm < 157.5) return 'NO';
    if (norm >= 157.5 && norm < 202.5) return 'N';
    if (norm >= 202.5 && norm < 247.5) return 'NE';
    if (norm >= 247.5 && norm < 292.5) return 'E';
    if (norm >= 292.5 && norm < 337.5) return 'SE';
    return 'N';
  };

  // Iconos dinámicos
  // Mapa completo de iconos disponibles (key → { label, component })
  const ICON_CATALOG = [
    // Navegación
    { key: 'arrow',           label: 'Flecha',          icon: <ArrowRight size={18}/> },
    { key: 'navigation',      label: 'Navegación',      icon: <Navigation size={18}/> },
    { key: 'navigation2',     label: 'Dirección',       icon: <Navigation2 size={18}/> },
    { key: 'move-right',      label: 'Avanzar',         icon: <MoveRight size={18}/> },
    { key: 'chevrons-right',  label: 'Siguiente',       icon: <ChevronsRight size={18}/> },
    { key: 'route',           label: 'Ruta',            icon: <Route size={18}/> },
    { key: 'corner-right',    label: 'Doblar',          icon: <CornerDownRight size={18}/> },
    // Información
    { key: 'info',            label: 'Info',            icon: <Info size={18}/> },
    { key: 'eye',             label: 'Vista',           icon: <Eye size={18}/> },
    { key: 'search',          label: 'Buscar',          icon: <Search size={18}/> },
    { key: 'star',            label: 'Destacado',       icon: <Star size={18}/> },
    { key: 'sparkles',        label: 'Especial',        icon: <Sparkles size={18}/> },
    { key: 'zap',             label: 'Destacar',        icon: <Zap size={18}/> },
    // Ubicación & Terreno
    { key: 'map',             label: 'Marcador',        icon: <MapPin size={18}/> },
    { key: 'compass',         label: 'Brújula',         icon: <Compass size={18}/> },
    { key: 'flag',            label: 'Bandera/Lote',    icon: <Flag size={18}/> },
    { key: 'mountain',        label: 'Montaña',         icon: <Mountain size={18}/> },
    { key: 'trees',           label: 'Vegetación',      icon: <Trees size={18}/> },
    { key: 'leaf',            label: 'Naturaleza',      icon: <Leaf size={18}/> },
    { key: 'fence',           label: 'Colindancia',     icon: <Fence size={18}/> },
    { key: 'globe',           label: 'Contexto',        icon: <Globe size={18}/> },
    { key: 'layers',          label: 'Lotes/Capas',     icon: <Layers size={18}/> },
    // Inmueble & Construcción
    { key: 'home',            label: 'Vivienda',        icon: <Home size={18}/> },
    { key: 'building',        label: 'Edificio',        icon: <Building2 size={18}/> },
    { key: 'landmark',        label: 'Hito',            icon: <Landmark size={18}/> },
    { key: 'warehouse',       label: 'Bodega/Área',     icon: <Warehouse size={18}/> },
    { key: 'ruler',           label: 'Medidas',         icon: <Ruler size={18}/> },
    { key: 'hard-hat',        label: 'Construcción',    icon: <HardHat size={18}/> },
    { key: 'hammer',          label: 'Obra',            icon: <Hammer size={18}/> },
    { key: 'pen-tool',        label: 'Diseño',          icon: <PenTool size={18}/> },
    { key: 'wrench',          label: 'Infraestructura', icon: <Wrench size={18}/> },
    // Financiero
    { key: 'dollar-sign',     label: 'Precio',          icon: <DollarSign size={18}/> },
    { key: 'badge-dollar',    label: 'Oferta',          icon: <BadgeDollarSign size={18}/> },
    { key: 'wallet',          label: 'Financiamiento',  icon: <Wallet size={18}/> },
    { key: 'credit-card',     label: 'Pago',            icon: <CreditCard size={18}/> },
    { key: 'trending-up',     label: 'Plusvalía',       icon: <TrendingUp size={18}/> },
    { key: 'bar-chart',       label: 'Estadísticas',    icon: <BarChart2 size={18}/> },
    { key: 'receipt',         label: 'Contrato',        icon: <Receipt size={18}/> },
    // Contacto
    { key: 'phone',           label: 'Teléfono',        icon: <Phone size={18}/> },
    { key: 'message',         label: 'WhatsApp/Chat',   icon: <MessageCircle size={18}/> },
    { key: 'mail',            label: 'Correo',          icon: <Mail size={18}/> },
    { key: 'user-check',      label: 'Asesor',          icon: <UserCheck size={18}/> },
    { key: 'users',           label: 'Equipo',          icon: <Users size={18}/> },
    { key: 'share',           label: 'Compartir',       icon: <Share2 size={18}/> },
    // Amenidades & extras
    { key: 'calendar',        label: 'Fecha/Evento',    icon: <Calendar size={18}/> },
    { key: 'external-link',   label: 'Enlace externo',  icon: <ExternalLink size={18}/> },
    { key: 'camera',          label: 'Fotografía',      icon: <Camera size={18}/> },
    { key: 'image',           label: 'Galería',         icon: <Image size={18}/> },
    { key: 'play',            label: 'Video/Tour',      icon: <PlayCircle size={18}/> },
    { key: 'sun',             label: 'Clima/Soleado',   icon: <Sun size={18}/> },
    { key: 'droplets',        label: 'Agua/Riego',      icon: <Droplets size={18}/> },
    { key: 'wind',            label: 'Aire/Brisa',      icon: <Wind size={18}/> },
    { key: 'bird',            label: 'Fauna',           icon: <Bird size={18}/> },
    { key: 'flower',          label: 'Jardinería',      icon: <Flower2 size={18}/> },
    { key: 'store',           label: 'Comercio',        icon: <Store size={18}/> },
  ];

  const getHotspotIcon = (type, iconName) => {
    const found = ICON_CATALOG.find(ic => ic.key === iconName);
    if (found) return found.icon;
    return type === 'navigation' ? <ArrowRight size={20}/> : <Info size={20}/>;
  };

  return (
    <div className="rioja-360-overlay" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      {/* Cabecera del Editor */}
      <div className="rioja-360-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="rioja-360-title">
            Mesa de Edición 360° RIOJA
          </div>
          {/* Selector Superior de Panorámicas */}
          <select 
            className="rioja-editor-select" 
            style={{ width: '220px', padding: '6px 12px', background: 'rgba(255,255,255,0.1)' }}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
          >
            {scenesState.map((scene, idx) => (
              <option key={scene.id} value={idx}>{scene.title}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Toggle entre Modo Edición y Modo Visitante */}
          <button 
            className="rioja-editor-btn"
            style={{ marginRight: '15px', background: isEditMode ? '#c3a479' : 'rgba(8,10,8,0.8)', color: isEditMode ? '#1e3224' : 'white' }}
            onClick={() => {
              setIsEditMode(!isEditMode);
              setActiveEditHotspot(null);
              setSelectedPreviewHotspot(null);
              setTimeout(updatePositions, 100);
            }}
          >
            {isEditMode ? <Eye size={16} /> : <Settings size={16} />}
            {isEditMode ? "Vista del visitante" : "Volver a editar"}
          </button>

          {/* Botón de Audio */}
          <button 
            className="rioja-360-audio-toggle" 
            onClick={() => setMuted(!muted)}
            title={muted ? "Activar sonido" : "Silenciar"}
            aria-label="Toggle audio"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <button className="rioja-360-close" onClick={() => window.location.href = '/rioja'} aria-label="Cerrar Editor">
            <X size={28} />
          </button>
        </div>
      </div>

      {/* Workspace del Visor */}
      <div 
        className="rioja-360-viewer-wrapper"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {loading && (
          <div className="rioja-360-loader">
            <div className="rioja-spinner"></div>
            <span>Cargando lienzo de edición...</span>
          </div>
        )}
        
        {/* Lienzo del Visor */}
        <div 
          ref={containerRef} 
          className={`rioja-360-container ${isAddingPoint ? 'adding-point' : ''}`}
          onMouseDown={handleContainerMouseDown}
          onClick={handleContainerClick}
        />

        {/* Hotspots interactivos del editor */}
        <div className="rioja-360-hotspots-container">
          {(currentScene?.hotspots || [])
            .filter(hs => isEditMode || (hs.approved && hs.enabled))
            .map((hs) => (
              <div
                key={hs.id}
                id={`hs-ed-${hs.id}`}
                style={{ display: 'none', position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 10 }}
              >
                <button
                  className={`rioja-360-hotspot rioja-hs-${hs.type} ${hs.approved ? 'approved' : 'pending'} ${activeEditHotspot?.id === hs.id ? 'editing' : ''}`}
                  onClick={() => handleHotspotClick(hs)}
                  onMouseDown={(e) => handleMouseDown(e, hs.id)}
                  style={{ display: 'flex' }}
                >
                  <div className="rioja-hs-icon-ring">
                    {getHotspotIcon(hs.type, hs.icon)}
                  </div>
                  <span className="rioja-hs-label">
                    {hs.title}
                    {isEditMode && !hs.approved && <span className="rioja-hs-badge">Borrador</span>}
                  </span>
                </button>
                {/* Botón eliminar directo en el pin */}
                {isEditMode && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteHotspot(hs.id); }}
                    title="Eliminar pin"
                    style={{
                      position: 'absolute', top: '-8px', right: '-8px',
                      width: '20px', height: '20px',
                      borderRadius: '50%',
                      background: '#ef4444',
                      border: '2px solid #0d1a0f',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 900,
                      lineHeight: 1, padding: 0,
                      zIndex: 5,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
        </div>

        {/* Controles del HUD superior de edición */}
        {isEditMode && (
          <div className="rioja-editor-top-bar">
            <button 
              className={`rioja-editor-btn ${isAddingPoint ? 'active' : ''}`}
              onClick={() => setIsAddingPoint(!isAddingPoint)}
            >
              <Plus size={16} /> {isAddingPoint ? "Clica sobre el panorama..." : "Agregar punto"}
            </button>
            <button
              className="rioja-editor-btn"
              onClick={handleAddSceneFile}
              title="Agrega una nueva panorámica 360° al recorrido (solo sesión local)"
              style={{ background: 'rgba(195,164,121,0.2)', border: '1px solid #c3a479', color: '#c3a479' }}
            >
              <Layers size={16} /> Agregar imagen 360°
            </button>
            <button className="rioja-editor-btn" onClick={handleCopyConfig}>
              <Copy size={16} /> Copiar config TS
            </button>
            <button className="rioja-editor-btn" onClick={handleDownloadConfig}>
              <Download size={16} /> Descargar JSON
            </button>
            <button
              className="rioja-editor-btn"
              onClick={handleSaveConfig}
              style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid #22c55e', color: '#22c55e', fontWeight: 700 }}
            >
              ✓ Guardar
            </button>
            <button className="rioja-editor-btn danger" onClick={handleResetConfig}>
              <Trash2 size={16} /> Restaurar original
            </button>
          </div>
        )}

        {/* Panel de Gestión de Escenas — ARRASTRABLE */}
        {isEditMode && (
          <div style={{
            position: 'absolute',
            left: `${panelPos.x}px`,
            top: `${panelPos.y}px`,
            background: 'rgba(8,12,8,0.92)', backdropFilter: 'blur(14px)',
            border: '1px solid rgba(195,164,121,0.35)', borderRadius: '10px',
            zIndex: 20, minWidth: '210px', maxWidth: '250px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            userSelect: 'none'
          }}>
            {/* Cabecera arrastrable */}
            <div
              onMouseDown={handlePanelMouseDown}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px',
                borderBottom: '1px solid rgba(195,164,121,0.2)',
                cursor: 'grab', color: '#c3a479',
                fontSize: '11px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '1px'
              }}
            >
              <span>☰ Escenas del recorrido</span>
            </div>
            <div style={{ padding: '8px' }}>
              {scenesState.map((scene, idx) => (
                <div
                  key={scene.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 8px', marginBottom: '4px', borderRadius: '6px',
                    background: idx === currentIndex ? 'rgba(195,164,121,0.2)' : 'rgba(255,255,255,0.04)',
                    border: idx === currentIndex ? '1px solid rgba(195,164,121,0.5)' : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <span style={{ color: '#c3a479', fontSize: '11px', minWidth: '16px' }}>{scene.order}</span>
                  <span style={{ color: 'white', fontSize: '12px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {scene.title}
                    {scene._localFile && <span style={{ color: '#f59e0b', fontSize: '9px', marginLeft: '4px' }}>LOCAL</span>}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); handleReorderScene(idx, -1); }} disabled={idx === 0} title="Subir"
                    style={{ background: 'none', border: 'none', color: idx === 0 ? '#555' : '#c3a479', cursor: idx === 0 ? 'default' : 'pointer', padding: '2px', fontSize: '12px' }}>▲</button>
                  <button onClick={(e) => { e.stopPropagation(); handleReorderScene(idx, 1); }} disabled={idx === scenesState.length - 1} title="Bajar"
                    style={{ background: 'none', border: 'none', color: idx === scenesState.length - 1 ? '#555' : '#c3a479', cursor: idx === scenesState.length - 1 ? 'default' : 'pointer', padding: '2px', fontSize: '12px' }}>▼</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteScene(idx); }} title="Excluir del recorrido"
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HUD inferior con coordenadas */}
        {isEditMode && (
          <div className="rioja-editor-hud">
            <div className="rioja-hud-item">Escena: <strong>{currentScene.id}</strong></div>
            <div className="rioja-hud-item">Yaw: <strong>{yawDegrees.toFixed(1)}°</strong></div>
            <div className="rioja-hud-item">Pitch: <strong>{pitchDegrees.toFixed(1)}°</strong></div>
            <div className="rioja-hud-item">Zoom: <strong>{zoomLevel}</strong></div>
            <button className="rioja-editor-btn" style={{ padding: '4px 10px', fontSize: '0.7rem' }} onClick={handleCopyCurrentPosition}>
              Copiar posición actual
            </button>
          </div>
        )}

        {/* Brújula */}
        <div className="rioja-360-compass">
          <div className="rioja-compass-dial" style={{ transform: `rotate(${-yawDegrees}deg)` }}>
            <span className="rioja-compass-label n">N</span>
            <span className="rioja-compass-label e">E</span>
            <span className="rioja-compass-label s">S</span>
            <span className="rioja-compass-label o">O</span>
          </div>
          <div className="rioja-compass-needle"></div>
          <div className="rioja-compass-reading">{getCardinalDirection(yawDegrees)}</div>
        </div>

        {/* Minimapa */}
        <div className="rioja-360-minimap">
          <svg className="rioja-minimap-svg" viewBox="0 0 100 100">
            <line x1="50" y1="30" x2="30" y2="75" stroke="rgba(195, 164, 121, 0.4)" strokeWidth="1.5" strokeDasharray="3" />
            <line x1="30" y1="75" x2="70" y2="65" stroke="rgba(195, 164, 121, 0.4)" strokeWidth="1.5" strokeDasharray="3" />
          </svg>
          {scenesState.map((scene, idx) => (
            <button
              key={scene.id}
              className={`rioja-minimap-node ${idx === currentIndex ? 'active' : ''}`}
              style={{ left: `${scene.coords.x}%`, top: `${scene.coords.y}%` }}
              onClick={() => {
                if (isEditMode) return;
                setCurrentIndex(idx);
              }}
              title={scene.title}
            >
              <span className="rioja-minimap-tooltip">{scene.title}</span>
            </button>
          ))}
        </div>

        {/* Formulario lateral de edición de puntos */}
        {isEditMode && activeEditHotspot && (
          <div className="rioja-360-editor-sidebar">
            <div className="rioja-sidebar-header">
              <h3>Propiedades del Punto</h3>
              <button className="rioja-popup-card-close" onClick={() => setActiveEditHotspot(null)}>
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSaveHotspotForm} className="rioja-sidebar-scroll">
              <div className="rioja-editor-group">
                <label className="rioja-editor-label">ID del Hotspot (Único)</label>
                <input 
                  type="text" 
                  className="rioja-editor-input"
                  value={activeEditHotspot.id}
                  disabled
                />
              </div>

              <div className="rioja-editor-group">
                <label className="rioja-editor-label">Título</label>
                <input 
                  type="text" 
                  className="rioja-editor-input"
                  value={activeEditHotspot.title}
                  onChange={(e) => setActiveEditHotspot({ ...activeEditHotspot, title: e.target.value })}
                  required
                />
              </div>

              <div className="rioja-editor-group">
                <label className="rioja-editor-label">Descripción</label>
                <textarea 
                  className="rioja-editor-textarea"
                  value={activeEditHotspot.description || ''}
                  onChange={(e) => setActiveEditHotspot({ ...activeEditHotspot, description: e.target.value })}
                />
              </div>

              <div className="rioja-editor-group">
                <label className="rioja-editor-label">Tipo de Punto</label>
                <select 
                  className="rioja-editor-select"
                  value={activeEditHotspot.type}
                  onChange={(e) => setActiveEditHotspot({ ...activeEditHotspot, type: e.target.value })}
                >
                  <option value="navigation">Navegación</option>
                  <option value="reference">Referencia</option>
                  <option value="info">Información</option>
                  <option value="location">Ubicación</option>
                  <option value="google-maps">Google Maps</option>
                  <option value="financiamiento">Financiamiento</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="galeria">Galería</option>
                </select>
              </div>

              <div className="rioja-editor-group">
                <label className="rioja-editor-label">Icono del Pin</label>
                {/* Selector visual de iconos en cuadrícula */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '5px',
                  maxHeight: '210px',
                  overflowY: 'auto',
                  padding: '6px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  border: '1px solid rgba(195,164,121,0.2)'
                }}>
                  {ICON_CATALOG.map(({ key, label, icon }) => (
                    <button
                      key={key}
                      type="button"
                      title={label}
                      onClick={() => setActiveEditHotspot({ ...activeEditHotspot, icon: key })}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '3px',
                        padding: '6px 2px',
                        borderRadius: '6px',
                        border: activeEditHotspot.icon === key
                          ? '1.5px solid #c3a479'
                          : '1px solid transparent',
                        background: activeEditHotspot.icon === key
                          ? 'rgba(195,164,121,0.25)'
                          : 'rgba(255,255,255,0.04)',
                        color: activeEditHotspot.icon === key ? '#c3a479' : '#8da88d',
                        cursor: 'pointer',
                        fontSize: '8px',
                        lineHeight: 1.2,
                        transition: 'all 0.15s',
                        minWidth: 0,
                        overflow: 'hidden'
                      }}
                    >
                      {icon}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {activeEditHotspot.type === 'navigation' && (
                <div className="rioja-editor-group">
                  <label className="rioja-editor-label">Escena de Destino</label>
                  <select 
                    className="rioja-editor-select"
                    value={activeEditHotspot.targetSceneId || ''}
                    onChange={(e) => setActiveEditHotspot({ ...activeEditHotspot, targetSceneId: e.target.value })}
                  >
                    {scenesState.map(scene => (
                      <option key={scene.id} value={scene.id}>{scene.title}</option>
                    ))}
                  </select>
                </div>
              )}

              {(activeEditHotspot.type === 'whatsapp' || activeEditHotspot.type === 'google-maps') && (
                <div className="rioja-editor-group">
                  <label className="rioja-editor-label">Enlace URL</label>
                  <input 
                    type="text" 
                    className="rioja-editor-input"
                    value={activeEditHotspot.url || ''}
                    placeholder="https://..."
                    onChange={(e) => setActiveEditHotspot({ ...activeEditHotspot, url: e.target.value })}
                  />
                </div>
              )}

              <div className="rioja-editor-checkbox-row">
                <input 
                  type="checkbox" 
                  id="hs-form-approved"
                  className="rioja-editor-checkbox"
                  checked={activeEditHotspot.approved}
                  onChange={(e) => setActiveEditHotspot({ ...activeEditHotspot, approved: e.target.checked })}
                />
                <label htmlFor="hs-form-approved" className="rioja-editor-checkbox-label">
                  Aprobado / Publicado
                </label>
              </div>

              <div className="rioja-editor-checkbox-row">
                <input 
                  type="checkbox" 
                  id="hs-form-enabled"
                  className="rioja-editor-checkbox"
                  checked={activeEditHotspot.enabled}
                  onChange={(e) => setActiveEditHotspot({ ...activeEditHotspot, enabled: e.target.checked })}
                />
                <label htmlFor="hs-form-enabled" className="rioja-editor-checkbox-label">
                  Activo / Habilitado
                </label>
              </div>

              <div className="rioja-editor-group" style={{ opacity: 0.7, fontSize: '0.75rem' }}>
                <span className="rioja-editor-label" style={{ marginBottom: '2px' }}>Coordenadas en Esfera</span>
                <div>Yaw: {activeEditHotspot.yaw.toFixed(4)} rad</div>
                <div>Pitch: {activeEditHotspot.pitch.toFixed(4)} rad</div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="rioja-btn-delete"
                  onClick={() => handleDuplicateHotspot(activeEditHotspot)}
                >
                  Duplicar
                </button>
                <button 
                  type="button" 
                  className="rioja-btn-delete"
                  style={{ color: '#FF453A', borderColor: 'rgba(255, 69, 58, 0.2)' }}
                  onClick={() => handleDeleteHotspot(activeEditHotspot.id)}
                >
                  Eliminar
                </button>
              </div>
            </form>

            <div className="rioja-sidebar-footer">
              <button type="button" className="rioja-btn-cancel" onClick={() => setActiveEditHotspot(null)}>
                Cancelar
              </button>
              <button type="button" className="rioja-btn-save" onClick={handleSaveHotspotForm}>
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* Tarjeta de Información Emergente en Vista del Visitante */}
        {!isEditMode && selectedPreviewHotspot && (
          <div className="rioja-360-popup-card">
            <div className="rioja-popup-card-header">
              <div className="rioja-popup-card-title-group">
                <div className="rioja-popup-card-icon">
                  {getHotspotIcon(selectedPreviewHotspot.type, selectedPreviewHotspot.icon)}
                </div>
                <h3>{selectedPreviewHotspot.title}</h3>
              </div>
              <button 
                className="rioja-popup-card-close" 
                onClick={() => setSelectedPreviewHotspot(null)}
                aria-label="Cerrar detalles"
              >
                <X size={16} />
              </button>
            </div>
            <div className="rioja-popup-card-body">
              <p>{selectedPreviewHotspot.description}</p>
              {selectedPreviewHotspot.url && (
                <a 
                  href={selectedPreviewHotspot.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="rioja-popup-card-action-btn"
                >
                  Ver Más <ArrowRight size={16} />
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* Controles de Flechas Laterales (Vista del visitante) */}
        {!isEditMode && (
          <>
            <button className="rioja-360-nav left" onClick={handlePrev} aria-label="Anterior">
              <ChevronLeft size={32} />
            </button>
            <button className="rioja-360-nav right" onClick={handleNext} aria-label="Siguiente">
              <ChevronRight size={32} />
            </button>
          </>
        )}
      </div>

      {/* Barra de escenas — Drag-to-Reorder en edición / Click-to-navigate en visitante */}
      <div
        className="rioja-360-gallery"
        style={{ opacity: 1, pointerEvents: 'auto' }}
      >
        {isEditMode && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '4px 10px 0',
            color: '#c3a479', fontSize: '10px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8
          }}>
            <span>&#9776;</span> Arrastra para reordenar
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px', padding: '6px 10px', overflowX: 'auto' }}>
          {scenesState.map((scene, idx) => (
            <div
              key={scene.id}
              draggable={isEditMode}
              onDragStart={isEditMode ? (e) => handleDragSceneStart(e, idx) : undefined}
              onDragOver={isEditMode ? (e) => handleDragSceneOver(e, idx) : undefined}
              onDrop={isEditMode ? (e) => handleDropScene(e, idx) : undefined}
              onDragEnd={isEditMode ? handleDragSceneEnd : undefined}
              onClick={() => setCurrentIndex(idx)}
              style={{
                position: 'relative',
                flexShrink: 0,
                width: '110px',
                cursor: isEditMode ? 'grab' : 'pointer',
                borderRadius: '8px',
                border: dragOverIdx === idx && dragSceneIdx !== idx
                  ? '2px dashed #c3a479'
                  : idx === currentIndex
                    ? '2px solid #c3a479'
                    : '2px solid transparent',
                opacity: dragSceneIdx === idx ? 0.4 : 1,
                transition: 'border 0.15s, opacity 0.15s',
                background: 'rgba(0,0,0,0.4)',
                overflow: 'hidden',
                userSelect: 'none'
              }}
            >
              <img
                src={scene.thumb}
                alt={scene.title}
                loading="lazy"
                style={{ width: '100%', height: '62px', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
              />
              {/* Etiqueta con número de orden */}
              <div style={{
                padding: '4px 6px',
                fontSize: '10px',
                color: idx === currentIndex ? '#c3a479' : '#ccc',
                fontWeight: idx === currentIndex ? 700 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(0,0,0,0.5)'
              }}>
                <span style={{
                  background: idx === currentIndex ? '#c3a479' : 'rgba(255,255,255,0.15)',
                  color: idx === currentIndex ? '#0d1a0f' : 'white',
                  borderRadius: '50%',
                  width: '16px', height: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 700, flexShrink: 0
                }}>
                  {scene.order}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {scene.title}
                </span>
              </div>
              {/* Indicador de zona de destino */}
              {isEditMode && dragOverIdx === idx && dragSceneIdx !== idx && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(195,164,121,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  pointerEvents: 'none'
                }}>
                  <span style={{ color: '#c3a479', fontSize: '20px' }}>&#8595;</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toast de guardado dinámico */}
      {saveToast && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
          background: saveStatus === 'server'
            ? 'rgba(34,197,94,0.96)' // Verde brillante
            : saveStatus === 'error'
              ? 'rgba(239,68,68,0.96)'  // Rojo
              : 'rgba(245,158,11,0.96)', // Ámbar/Naranja
          color: 'white',
          padding: '12px 28px', borderRadius: '30px',
          fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '15px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          zIndex: 99999, animation: 'fadeInUp 0.3s ease',
          display: 'flex', alignItems: 'center', gap: '10px',
          border: saveStatus === 'server' ? '1px solid #4ade80' : '1px solid transparent'
        }}>
          {saveStatus === 'server' && <span>⚡ ¡Configuración sincronizada directamente en el código!</span>}
          {saveStatus === 'local' && <span>✓ Configuración guardada en borrador (local)</span>}
          {saveStatus === 'error' && <span>⚠️ Error al sincronizar con el Servidor local</span>}
        </div>
      )}

      {/* Modal: Agregar imagen 360° */}
      {addSceneModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.85)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#0d1a0f', border: '1px solid rgba(195,164,121,0.4)',
            borderRadius: '16px', padding: '28px', maxWidth: '520px', width: '100%',
            fontFamily: 'Outfit, sans-serif'
          }}>
            <h3 style={{ color: '#c3a479', margin: '0 0 16px', fontSize: '18px', fontWeight: 700 }}>
              Agregar imagen 360° al recorrido
            </h3>

            {/* Previsualización */}
            <img
              src={addSceneModal.previewUrl}
              alt="Vista previa"
              style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
            />
            <p style={{ color: '#8da88d', fontSize: '12px', margin: '0 0 16px' }}>
              ✅ Resolución: {addSceneModal.width} × {addSceneModal.height} px &nbsp;|&nbsp;
              Ratio: {(addSceneModal.width / addSceneModal.height).toFixed(2)} &nbsp;|&nbsp;
              Peso: {(addSceneModal.file.size / (1024 * 1024)).toFixed(1)} MB
            </p>

            <label style={{ display: 'block', color: '#a8c5a0', fontSize: '13px', marginBottom: '6px' }}>
              Nombre interno de la escena
            </label>
            <input
              type="text"
              value={addSceneModal.title}
              onChange={(e) => setAddSceneModal(m => ({ ...m, title: e.target.value }))}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(195,164,121,0.3)',
                color: 'white', fontSize: '14px', marginBottom: '14px', boxSizing: 'border-box'
              }}
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a8c5a0', fontSize: '13px', marginBottom: '20px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={addSceneModal.approved}
                onChange={(e) => setAddSceneModal(m => ({ ...m, approved: e.target.checked }))}
              />
              Marcar como aprobada (visible públicamente)
            </label>

            <p style={{ color: '#f59e0b', fontSize: '11px', margin: '0 0 20px', lineHeight: 1.5 }}>
              ⚠️ Esta imagen se cargará solo durante esta sesión del editor. Para publicarla,
              deberás optimizarla manualmente y copiar la configuración exportada al archivo de código.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { URL.revokeObjectURL(addSceneModal.previewUrl); setAddSceneModal(null); }}
                style={{ padding: '10px 20px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#ccc', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAddScene}
                style={{ padding: '10px 24px', borderRadius: '8px', background: '#c3a479', border: 'none', color: '#0d1a0f', cursor: 'pointer', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}
              >
                Agregar al recorrido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

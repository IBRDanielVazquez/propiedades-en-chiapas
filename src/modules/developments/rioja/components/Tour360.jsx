import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { 
  X, ChevronLeft, ChevronRight, Volume2, VolumeX, 
  Compass, MapPin, Info, Layers, ExternalLink, 
  Calendar, DollarSign, Eye, Phone, ArrowRight, 
  Home, Sparkles, Plus, Copy, Settings, Download
} from 'lucide-react';
import { rioja360Scenes } from '../content/rioja-360.config';
import '../styles/rioja-360.css';

export default function Tour360({ onClose }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const isInitialMount = useRef(true);

  // Determinar si estamos en modo desarrollo o URL de edición
  const isDev = import.meta.env.DEV || (typeof window !== 'undefined' && window.location.search.includes('edit360=true'));

  // Estados de la Experiencia
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [yawDegrees, setYawDegrees] = useState(0);
  const [pitchDegrees, setPitchDegrees] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [muted, setMuted] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Estados del Editor Visual
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [scenesState, setScenesState] = useState(rioja360Scenes);
  const [activeEditHotspot, setActiveEditHotspot] = useState(null);
  const [draggingHotspotId, setDraggingHotspotId] = useState(null);

  const currentScene = scenesState[currentIndex];

  // Helper de Audio Campestre
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
        console.log("Autoplay bloqueado por el navegador hasta interacción del usuario", err);
      });
    }
  }, [muted]);

  // Actualizador manual de coordenadas en 2D (Hotspots Overlay)
  const updatePositions = () => {
    if (!viewerRef.current || !viewerRef.current.dataHelper) return;
    const scene = scenesState[currentIndex];
    if (!scene || !scene.hotspots) return;
    
    scene.hotspots.forEach(hs => {
      const el = document.getElementById(`hs-${hs.id}`);
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

  // Inicialización de Photo Sphere Viewer
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

    // Escuchar rotación de la cámara (Yaw, Pitch)
    viewerRef.current.addEventListener('position-updated', ({ position }) => {
      const deg = (position.yaw * 180) / Math.PI;
      setYawDegrees(deg);
      setPitchDegrees(position.pitch * (180 / Math.PI));
      updatePositions();
    });

    // Escuchar cambio de zoom
    viewerRef.current.addEventListener('zoom-updated', ({ zoomLevel }) => {
      setZoomLevel(Math.round(zoomLevel));
      updatePositions();
    });

    // Escuchar renderizado inicial
    viewerRef.current.addEventListener('ready', () => {
      setLoading(false);
      setTimeout(updatePositions, 150);
    });

    window.addEventListener('resize', updatePositions);

    return () => {
      window.removeEventListener('resize', updatePositions);
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
      setSelectedHotspot(null);
      viewerRef.current.setPanorama(currentScene.source, {
        caption: currentScene.title,
        showLoader: false
      })
      .then(() => {
        setLoading(false);
        // Resetear orientación de cámara al valor inicial de la escena
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

  // Clic en hotspot (En modo edición abre formulario, en modo visitante ejecuta acción)
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
        setSelectedHotspot(hs);
      }
    }
  };

  // Drag and Drop manual de Hotspots en Modo Edición
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

  // Agregar nuevo Hotspot al hacer clic en la pantalla
  const handleContainerClick = (e) => {
    if (!isEditMode || !isAddingPoint) return;
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

  // Guardar Hotspot editado en el formulario
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
      yaw: hs.yaw + 0.1, // desplazar ligeramente a la derecha para diferenciar
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

  // Copiar configuración al portapapeles
  const handleCopyConfig = () => {
    // Formatear JSON limpio sin campos adicionales de desarrollo si se prefiere
    const output = `export const rioja360Scenes = ${JSON.stringify(scenesState, null, 2)};`;
    navigator.clipboard.writeText(output).then(() => {
      alert("¡Configuración copiada al portapapeles con éxito! Pégala directamente en src/modules/developments/rioja/content/rioja-360.config.ts");
    }).catch(err => {
      alert("Error al copiar configuración: " + err);
    });
  };

  // Descargar configuración JSON
  const handleDownloadConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scenesState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "rioja-360-config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copiar posición de cámara actual
  const handleCopyCurrentPosition = () => {
    if (!viewerRef.current) return;
    const pos = viewerRef.current.getPosition();
    const formatted = JSON.stringify({
      yaw: parseFloat(pos.yaw.toFixed(4)),
      pitch: parseFloat(pos.pitch.toFixed(4))
    }, null, 2);
    
    navigator.clipboard.writeText(formatted).then(() => {
      alert(`¡Posición copiada!\n${formatted}`);
    });
  };

  // Convertir orientación en cardinal para la brújula
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

  // Renderizador dinámico de iconos
  const getHotspotIcon = (type, iconName) => {
    switch (iconName) {
      case 'map': return <MapPin size={20} />;
      case 'compass': return <Compass size={20} />;
      case 'home': return <Home size={20} />;
      case 'external-link': return <ExternalLink size={20} />;
      case 'calendar': return <Calendar size={20} />;
      case 'layers': return <Layers size={20} />;
      case 'sparkles': return <Sparkles size={20} />;
      case 'dollar-sign': return <DollarSign size={20} />;
      case 'eye': return <Eye size={20} />;
      case 'phone': return <Phone size={20} />;
      default:
        return type === 'navigation' ? <ArrowRight size={20} /> : <Info size={20} />;
    }
  };

  return (
    <div className="rioja-360-overlay">
      {/* Cabecera */}
      <div className="rioja-360-header">
        <div className="rioja-360-title">
          {currentScene.title} <span className="rioja-360-counter">({currentIndex + 1} / {scenesState.length})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Alternador de Modo Edición (Solo para desarrollo) */}
          {isDev && (
            <button 
              className={`rioja-360-audio-toggle ${isEditMode ? 'active' : ''}`}
              style={{ color: isEditMode ? '#25D366' : 'white' }}
              onClick={() => {
                setIsEditMode(!isEditMode);
                setActiveEditHotspot(null);
                setSelectedHotspot(null);
                setTimeout(updatePositions, 100);
              }}
              title={isEditMode ? "Vista del visitante" : "Editar puntos 360°"}
            >
              <Settings size={20} />
            </button>
          )}

          {/* Botón de Audio Ambiental */}
          <button 
            className="rioja-360-audio-toggle" 
            onClick={() => setMuted(!muted)}
            title={muted ? "Activar sonido ambiental" : "Silenciar sonido ambiental"}
            aria-label="Toggle audio"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <button className="rioja-360-close" onClick={onClose} aria-label="Cerrar recorrido">
            <X size={28} />
          </button>
        </div>
      </div>

      {/* Visor y Capas Flotantes */}
      <div 
        className="rioja-360-viewer-wrapper"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {loading && (
          <div className="rioja-360-loader">
            <div className="rioja-spinner"></div>
            <span>Cargando entorno...</span>
          </div>
        )}
        
        {/* Lienzo del Visor */}
        <div 
          ref={containerRef} 
          className={`rioja-360-container ${isAddingPoint ? 'adding-point' : ''}`}
          onClick={handleContainerClick}
        />

        {/* Capa de Hotspots Interactivos (En modo edición muestra todos, en visitante solo aprobados y activos) */}
        <div className="rioja-360-hotspots-container">
          {(currentScene?.hotspots || [])
            .filter(hs => isEditMode || (hs.approved && hs.enabled))
            .map((hs) => (
              <button
                key={hs.id}
                id={`hs-${hs.id}`}
                className={`rioja-360-hotspot rioja-hs-${hs.type} ${hs.approved ? 'approved' : 'pending'} ${activeEditHotspot?.id === hs.id ? 'editing' : ''}`}
                onClick={() => handleHotspotClick(hs)}
                onMouseDown={(e) => handleMouseDown(e, hs.id)}
                style={{ display: 'none', transform: 'translate(-50%, -50%)' }}
              >
                <div className="rioja-hs-icon-ring">
                  {getHotspotIcon(hs.type, hs.icon)}
                </div>
                <span className="rioja-hs-label">
                  {hs.title}
                  {isEditMode && !hs.approved && <span className="rioja-hs-badge">Pendiente</span>}
                </span>
              </button>
            ))}
        </div>

        {/* HUD de Edición (Controles de creación y copiado global) */}
        {isEditMode && (
          <div className="rioja-editor-top-bar">
            <button 
              className={`rioja-editor-btn ${isAddingPoint ? 'active' : ''}`}
              onClick={() => setIsAddingPoint(!isAddingPoint)}
            >
              <Plus size={16} /> {isAddingPoint ? "Haz clic en la imagen..." : "Agregar punto"}
            </button>
            <button className="rioja-editor-btn" onClick={handleCopyConfig}>
              <Copy size={16} /> Copiar config TS
            </button>
            <button className="rioja-editor-btn" onClick={handleDownloadConfig}>
              <Download size={16} /> Descargar JSON
            </button>
          </div>
        )}

        {/* HUD de coordenadas de cámara actual */}
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

        {/* Brújula Dinámica */}
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

        {/* Minimapa Flotante (Conexiones entre las 3 panorámicas) */}
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
              aria-label={`Ir a ${scene.title}`}
            >
              <span className="rioja-minimap-tooltip">{scene.title}</span>
            </button>
          ))}
        </div>

        {/* Formulario de Edición Lateral del Hotspot */}
        {isEditMode && activeEditHotspot && (
          <div className="rioja-360-editor-sidebar">
            <div className="rioja-sidebar-header">
              <h3>Configurar Hotspot</h3>
              <button className="rioja-popup-card-close" onClick={() => setActiveEditHotspot(null)}>
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSaveHotspotForm} className="rioja-sidebar-scroll">
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
                  <option value="info">Información</option>
                  <option value="location">Ubicación</option>
                  <option value="reference">Referencia</option>
                  <option value="financiamiento">Financiamiento</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="galeria">Galería</option>
                  <option value="google-maps">Google Maps</option>
                </select>
              </div>

              <div className="rioja-editor-group">
                <label className="rioja-editor-label">Icono</label>
                <select 
                  className="rioja-editor-select"
                  value={activeEditHotspot.icon}
                  onChange={(e) => setActiveEditHotspot({ ...activeEditHotspot, icon: e.target.value })}
                >
                  <option value="arrow">Flecha de avance</option>
                  <option value="info">Información (i)</option>
                  <option value="map">Marcador de Mapa</option>
                  <option value="compass">Brújula</option>
                  <option value="home">Casa</option>
                  <option value="calendar">Calendario</option>
                  <option value="layers">Capas/Lotes</option>
                  <option value="sparkles">Estrellas</option>
                  <option value="dollar-sign">Dinero</option>
                  <option value="eye">Ojo</option>
                  <option value="phone">Teléfono</option>
                  <option value="external-link">Enlace externo</option>
                </select>
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
                  Publicado / Aprobado
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
                <span className="rioja-editor-label" style={{ marginBottom: '2px' }}>Coordenadas Físicas</span>
                <div>Yaw: {activeEditHotspot.yaw.toFixed(4)} rad</div>
                <div>Pitch: {activeEditHotspot.pitch.toFixed(4)} rad</div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="rioja-btn-delete"
                  onClick={() => handleDuplicateHotspot(activeEditHotspot)}
                  title="Duplicar este punto"
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
        {!isEditMode && selectedHotspot && (
          <div className="rioja-360-popup-card">
            <div className="rioja-popup-card-header">
              <div className="rioja-popup-card-title-group">
                <div className="rioja-popup-card-icon">
                  {getHotspotIcon(selectedHotspot.type, selectedHotspot.icon)}
                </div>
                <h3>{selectedHotspot.title}</h3>
              </div>
              <button 
                className="rioja-popup-card-close" 
                onClick={() => setSelectedHotspot(null)}
                aria-label="Cerrar detalles"
              >
                <X size={16} />
              </button>
            </div>
            <div className="rioja-popup-card-body">
              <p>{selectedHotspot.description}</p>
              {selectedHotspot.url && (
                <a 
                  href={selectedHotspot.url} 
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
        
        {/* Controles de Flechas Laterales (Ocultos en Modo Edición para evitar navegación involuntaria) */}
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

      {/* Galería de Selección de Miniaturas (Deshabilitada en Modo Edición para no interrumpir el guardado) */}
      <div className="rioja-360-gallery" style={{ opacity: isEditMode ? 0.5 : 1, pointerEvents: isEditMode ? 'none' : 'auto' }}>
        {scenesState.map((scene, idx) => (
          <button 
            key={scene.id} 
            className={`rioja-360-thumb ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Ver ${scene.title}`}
          >
            <img src={scene.thumb} alt={scene.title} loading="lazy" />
            <div className="rioja-360-thumb-label">{scene.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

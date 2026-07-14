import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { 
  X, ChevronLeft, ChevronRight, Volume2, VolumeX, 
  Compass, MapPin, Info, Layers, ExternalLink, 
  Calendar, DollarSign, Eye, Phone, ArrowRight, 
  Home, Sparkles,
  Navigation, Navigation2, MoveRight, ChevronsRight, CornerDownRight, Route,
  Mountain, Trees, Flag, Landmark, Building2, Store, Warehouse,
  BadgeDollarSign, Wallet, CreditCard, Receipt, TrendingUp, BarChart2,
  Sun, Droplets, Wind, Flower2, Leaf, Bird,
  Ruler, PenTool, Wrench, HardHat, Hammer, Fence,
  MessageCircle, Mail, Share2, UserCheck, Users, Star,
  Camera, Image, PlayCircle, Zap, Globe, Search
} from 'lucide-react';
import { rioja360Scenes } from '../content/rioja-360.config';
import '../styles/rioja-360.css';

// Lee el borrador del editor si existe; ordena siempre por .order
function getActiveScenes() {
  try {
    const draft = localStorage.getItem('rioja-360-scenes-draft');
    if (draft) {
      const parsed = JSON.parse(draft);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.source) {
        // Respetar el orden que el editor guardó
        const sorted = [...parsed].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        return { scenes: sorted, isDraft: true };
      }
    }
  } catch (e) {
    console.warn('[Tour360] No se pudo leer borrador local:', e);
  }
  return { scenes: rioja360Scenes, isDraft: false };
}

export default function Tour360({ onClose }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const isInitialMount = useRef(true);

  const { scenes: activeScenes } = getActiveScenes();

  // Ref para que updatePositions siempre lea el índice actual (evita stale closure)
  const currentIndexRef = useRef(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [yawDegrees, setYawDegrees] = useState(0);
  const [muted, setMuted] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Mantener ref sincronizado con el estado
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  const currentScene = activeScenes[currentIndex];

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

  // Actualizar posiciones 2D de hotspots — usa ref para no capturar índice stale
  const updatePositions = () => {
    if (!viewerRef.current || !viewerRef.current.dataHelper) return;
    const scene = activeScenes[currentIndexRef.current];
    if (!scene || !scene.hotspots) return;

    const publicHotspots = scene.hotspots.filter(hs => hs.approved && hs.enabled);

    publicHotspots.forEach(hs => {
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

    // Escuchar rotación de la cámara (Yaw)
    viewerRef.current.addEventListener('position-updated', ({ position }) => {
      const deg = (position.yaw * 180) / Math.PI;
      setYawDegrees(deg);
      updatePositions();
    });

    // Escuchar cambio de zoom
    viewerRef.current.addEventListener('zoom-updated', updatePositions);

    // Escuchar renderizado de fotogramas
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
        // Resetear orientación de cámara al valor inicial del panorama
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
    setCurrentIndex((prev) => (prev + 1) % activeScenes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeScenes.length - 1 : prev - 1));
  };

  const handleHotspotClick = (hs) => {
    if (hs.type === 'navigation') {
      const idx = activeScenes.findIndex(s => s.id === hs.targetSceneId);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    } else {
      setSelectedHotspot(hs);
    }
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

  // Iconos completos — mismo catálogo que el editor
  const getHotspotIcon = (type, iconName) => {
    const s = 20;
    const map = {
      'arrow': <ArrowRight size={s}/>, 'navigation': <Navigation size={s}/>,
      'navigation2': <Navigation2 size={s}/>, 'move-right': <MoveRight size={s}/>,
      'chevrons-right': <ChevronsRight size={s}/>, 'route': <Route size={s}/>,
      'corner-right': <CornerDownRight size={s}/>,
      'info': <Info size={s}/>, 'eye': <Eye size={s}/>, 'search': <Search size={s}/>,
      'star': <Star size={s}/>, 'sparkles': <Sparkles size={s}/>, 'zap': <Zap size={s}/>,
      'map': <MapPin size={s}/>, 'compass': <Compass size={s}/>, 'flag': <Flag size={s}/>,
      'mountain': <Mountain size={s}/>, 'trees': <Trees size={s}/>, 'leaf': <Leaf size={s}/>,
      'fence': <Fence size={s}/>, 'globe': <Globe size={s}/>, 'layers': <Layers size={s}/>,
      'home': <Home size={s}/>, 'building': <Building2 size={s}/>, 'landmark': <Landmark size={s}/>,
      'warehouse': <Warehouse size={s}/>, 'ruler': <Ruler size={s}/>, 'hard-hat': <HardHat size={s}/>,
      'hammer': <Hammer size={s}/>, 'pen-tool': <PenTool size={s}/>, 'wrench': <Wrench size={s}/>,
      'dollar-sign': <DollarSign size={s}/>, 'badge-dollar': <BadgeDollarSign size={s}/>,
      'wallet': <Wallet size={s}/>, 'credit-card': <CreditCard size={s}/>,
      'trending-up': <TrendingUp size={s}/>, 'bar-chart': <BarChart2 size={s}/>,
      'receipt': <Receipt size={s}/>,
      'phone': <Phone size={s}/>, 'message': <MessageCircle size={s}/>,
      'mail': <Mail size={s}/>, 'user-check': <UserCheck size={s}/>,
      'users': <Users size={s}/>, 'share': <Share2 size={s}/>,
      'calendar': <Calendar size={s}/>, 'external-link': <ExternalLink size={s}/>,
      'camera': <Camera size={s}/>, 'image': <Image size={s}/>, 'play': <PlayCircle size={s}/>,
      'sun': <Sun size={s}/>, 'droplets': <Droplets size={s}/>, 'wind': <Wind size={s}/>,
      'bird': <Bird size={s}/>, 'flower': <Flower2 size={s}/>, 'store': <Store size={s}/>,
    };
    return map[iconName] ?? (type === 'navigation' ? <ArrowRight size={s}/> : <Info size={s}/>);
  };

  return (
    <div className="rioja-360-overlay">
      {/* Cabecera */}
      <div className="rioja-360-header">
        <div className="rioja-360-title">
          {currentScene.title} <span className="rioja-360-counter">({currentIndex + 1} / {activeScenes.length})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
      <div className="rioja-360-viewer-wrapper">
        {loading && (
          <div className="rioja-360-loader">
            <div className="rioja-spinner"></div>
            <span>Cargando entorno...</span>
          </div>
        )}
        
        {/* Lienzo del Visor */}
        <div ref={containerRef} className="rioja-360-container" />

        {/* Capa de Hotspots Interactivos */}
        <div className="rioja-360-hotspots-container">
          {(currentScene?.hotspots || [])
            .filter(hs => hs.approved && hs.enabled)
            .map((hs) => (
              <button
                key={hs.id}
                id={`hs-${hs.id}`}
                className={`rioja-360-hotspot rioja-hs-${hs.type}`}
                onClick={() => handleHotspotClick(hs)}
                style={{ display: 'none', transform: 'translate(-50%, -50%)' }}
              >
                <div className="rioja-hs-icon-ring">
                  {getHotspotIcon(hs.type, hs.icon)}
                </div>
                <span className="rioja-hs-label">{hs.title}</span>
              </button>
            ))}
        </div>

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

        {/* Minimapa Flotante */}
        <div className="rioja-360-minimap">
          <svg className="rioja-minimap-svg" viewBox="0 0 100 100">
            <line x1="50" y1="30" x2="30" y2="75" stroke="rgba(195, 164, 121, 0.4)" strokeWidth="1.5" strokeDasharray="3" />
            <line x1="30" y1="75" x2="70" y2="65" stroke="rgba(195, 164, 121, 0.4)" strokeWidth="1.5" strokeDasharray="3" />
          </svg>
          {activeScenes.map((scene, idx) => (
            <button
              key={scene.id}
              className={`rioja-minimap-node ${idx === currentIndex ? 'active' : ''}`}
              style={{ left: `${scene.coords.x}%`, top: `${scene.coords.y}%` }}
              onClick={() => setCurrentIndex(idx)}
              title={scene.title}
              aria-label={`Ir a ${scene.title}`}
            >
              <span className="rioja-minimap-tooltip">{scene.title}</span>
            </button>
          ))}
        </div>

        {/* Tarjeta de Información Emergente Premium */}
        {selectedHotspot && (
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
        
        {/* Controles de Flechas Laterales */}
        <button className="rioja-360-nav left" onClick={handlePrev} aria-label="Anterior">
          <ChevronLeft size={32} />
        </button>
        <button className="rioja-360-nav right" onClick={handleNext} aria-label="Siguiente">
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Galería de Selección de Miniaturas */}
      <div className="rioja-360-gallery">
        {activeScenes.map((scene, idx) => (
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

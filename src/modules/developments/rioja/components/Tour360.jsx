import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { rioja360Tour } from '../content/rioja-360.config';
import '../styles/rioja-360.css';

export default function Tour360({ onClose }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    viewerRef.current = new Viewer({
      container: containerRef.current,
      panorama: rioja360Tour[currentIndex].file,
      caption: rioja360Tour[currentIndex].title,
      navbar: ['zoom', 'fullscreen'],
      defaultZoomLvl: 0,
      touchmoveTwoFingers: false,
      mousewheelCtrlKey: false
    });

    viewerRef.current.addEventListener('ready', () => {
      setLoading(false);
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (viewerRef.current) {
      setLoading(true);
      viewerRef.current.setPanorama(rioja360Tour[currentIndex].file, {
        caption: rioja360Tour[currentIndex].title,
        showLoader: false
      }).then(() => setLoading(false));
    }
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % rioja360Tour.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? rioja360Tour.length - 1 : prev - 1));
  };

  return (
    <div className="rioja-360-overlay">
      <div className="rioja-360-header">
        <div className="rioja-360-title">
          {rioja360Tour[currentIndex].title} <span className="rioja-360-counter">({currentIndex + 1} / {rioja360Tour.length})</span>
        </div>
        <button className="rioja-360-close" onClick={onClose} aria-label="Cerrar recorrido">
          <X size={28} />
        </button>
      </div>

      <div className="rioja-360-viewer-wrapper">
        {loading && (
          <div className="rioja-360-loader">
            <div className="rioja-spinner"></div>
            <span>Cargando entorno...</span>
          </div>
        )}
        <div ref={containerRef} className="rioja-360-container" />
        
        <button className="rioja-360-nav left" onClick={handlePrev} aria-label="Anterior">
          <ChevronLeft size={32} />
        </button>
        <button className="rioja-360-nav right" onClick={handleNext} aria-label="Siguiente">
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="rioja-360-gallery">
        {rioja360Tour.map((scene, idx) => (
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

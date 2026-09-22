import { useEffect, useRef, useState, useCallback } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { ChevronLeft, ChevronRight, Expand, X, Images, Compass, Play } from 'lucide-react';
import { dispararEvento } from '../../../lib/tracking';

const FOTOS = Array.from({ length: 17 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { full: `/cascadas/galeria/cds-${n}.webp`, mini: `/cascadas/galeria/cds-${n}-mini.webp` };
});

const PANORAMAS = [
  { id: 'acceso', titulo: 'Acceso desde la carretera', src: '/cascadas/360/pano-01.webp', mini: '/cascadas/360/pano-01-mini.webp' },
  { id: 'vialidad', titulo: 'Vialidad interior y lotes', src: '/cascadas/360/pano-02.webp', mini: '/cascadas/360/pano-02-mini.webp' },
  { id: 'valle', titulo: 'Vista al valle y la reserva', src: '/cascadas/360/pano-03.webp', mini: '/cascadas/360/pano-03-mini.webp' },
];

const PESTANAS = [
  { id: 'video', etiqueta: 'Video', Icono: Play },
  { id: 'fotos', etiqueta: 'Imágenes', Icono: Images },
  { id: 'tour', etiqueta: 'Recorrido virtual', Icono: Compass },
];

export default function GaleriaCascadas() {
  const [pestana, setPestana] = useState('video');
  const [slide, setSlide] = useState(0);
  const [lightbox, setLightbox] = useState(null); // {tipo:'foto'|'plano', indice}
  const [panoIdx, setPanoIdx] = useState(0);
  const [tourCompleto, setTourCompleto] = useState(false);
  const [cargadas, setCargadas] = useState(() => new Set([0, 1, 16]));

  const stageRef = useRef(null);
  const visorRef = useRef(null);
  const tactilRef = useRef({ x: 0, y: 0 });

  const irSlide = useCallback((n) => {
    const i = (n + FOTOS.length) % FOTOS.length;
    setSlide(i);
    setCargadas((prev) => {
      const s = new Set(prev);
      [i - 1, i, i + 1].forEach((k) => s.add((k + FOTOS.length) % FOTOS.length));
      return s;
    });
  }, []);

  // Visor 360: se crea solo al abrir la pestaña y se destruye al salir
  useEffect(() => {
    if (pestana !== 'tour' || !stageRef.current) return undefined;
    const visor = new Viewer({
      container: stageRef.current,
      panorama: PANORAMAS[panoIdx].src,
      navbar: false,
      defaultZoomLvl: 5,
      touchmoveTwoFingers: false,
      mousewheelCtrlKey: false,
      loadingTxt: 'Cargando vista 360°…',
    });
    visorRef.current = visor;
    dispararEvento('ViewContent', { content_name: 'Cascadas del Sur', seccion: 'tour_360' });
    return () => { visor.destroy(); visorRef.current = null; };
  }, [pestana]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (visorRef.current) visorRef.current.setPanorama(PANORAMAS[panoIdx].src, { showLoader: true });
  }, [panoIdx]);

  useEffect(() => {
    if (!tourCompleto) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setTourCompleto(false);
      if (event.key === 'ArrowRight') setPanoIdx((current) => (current + 1) % PANORAMAS.length);
      if (event.key === 'ArrowLeft') setPanoIdx((current) => (current - 1 + PANORAMAS.length) % PANORAMAS.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => visorRef.current?.autoSize(), 80);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      window.setTimeout(() => visorRef.current?.autoSize(), 80);
    };
  }, [tourCompleto]);

  // Teclado del lightbox
  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (lightbox.tipo === 'foto') {
        if (e.key === 'ArrowRight') setLightbox({ tipo: 'foto', indice: (lightbox.indice + 1) % FOTOS.length });
        if (e.key === 'ArrowLeft') setLightbox({ tipo: 'foto', indice: (lightbox.indice - 1 + FOTOS.length) % FOTOS.length });
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [lightbox]);

  const pantallaCompleta = () => {
    setTourCompleto(true);
    dispararEvento('ViewContent', { content_name: 'Cascadas del Sur', seccion: 'tour_360_pantalla_completa' });
  };

  return (
    <div id="galeria" className="cds-galeria">
      <div>
        <div className="cds-tabs" role="tablist">
          {PESTANAS.map(({ id, etiqueta, Icono }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={pestana === id}
              className={pestana === id ? 'on' : ''}
              onClick={() => setPestana(id)}
            >
              <Icono size={16} /> {etiqueta}
            </button>
          ))}
        </div>

        {/* ---------- IMÁGENES ---------- */}
        {pestana === 'fotos' && (
          <div>
            <div
              className="cds-slider"
              onTouchStart={(e) => { tactilRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
              onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - tactilRef.current.x;
                const dy = e.changedTouches[0].clientY - tactilRef.current.y;
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) irSlide(dx < 0 ? slide + 1 : slide - 1);
              }}
            >
              <div className="cds-rail" style={{ transform: `translateX(-${slide * 100}%)` }}>
                {FOTOS.map((f, i) => (
                  <figure key={f.full}>
                    <img
                      src={cargadas.has(i) ? f.full : f.mini}
                      alt={`Cascadas del Sur, vista ${i + 1}`}
                      width="1200"
                      height="1200"
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </figure>
                ))}
              </div>
              <button type="button" className="cds-snav prev" onClick={() => irSlide(slide - 1)} aria-label="Foto anterior"><ChevronLeft size={18} /></button>
              <button type="button" className="cds-snav next" onClick={() => irSlide(slide + 1)} aria-label="Foto siguiente"><ChevronRight size={18} /></button>
              <span className="cds-scount">{slide + 1} / {FOTOS.length}</span>
              <button type="button" className="cds-sfull" onClick={() => setLightbox({ tipo: 'foto', indice: slide })}>
                <Expand size={15} /> Ver completo
              </button>
            </div>

            <div className="cds-tiras">
              {FOTOS.map((f, i) => (
                <button key={f.mini} type="button" className={i === slide ? 'on' : ''} onClick={() => irSlide(i)} aria-label={`Ver foto ${i + 1}`}>
                  <img src={f.mini} alt="" width="360" height="360" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------- RECORRIDO 360 ---------- */}
        {pestana === 'tour' && (
          <div>
            <div className={`cds-stage-wrap ${tourCompleto ? 'cds-stage-full' : ''}`} role={tourCompleto ? 'dialog' : undefined} aria-modal={tourCompleto ? 'true' : undefined} aria-label={tourCompleto ? 'Recorrido virtual de Cascadas del Sur en pantalla completa' : undefined}>
              <div className="cds-stage" ref={stageRef} />
              <span className="cds-badge"><i />{PANORAMAS[panoIdx].titulo}</span>
              {!tourCompleto && <button type="button" className="cds-sfull" onClick={pantallaCompleta}><Expand size={15} /> Ver completo</button>}
              {tourCompleto && (
                <>
                  <button type="button" className="cds-tour-close" onClick={() => setTourCompleto(false)} aria-label="Cerrar recorrido completo"><X size={20} /></button>
                  <div className="cds-tour-nav">
                    <button type="button" onClick={() => setPanoIdx((panoIdx - 1 + PANORAMAS.length) % PANORAMAS.length)} aria-label="Panorámica anterior"><ChevronLeft size={20} /></button>
                    <span>{panoIdx + 1} / {PANORAMAS.length}</span>
                    <button type="button" onClick={() => setPanoIdx((panoIdx + 1) % PANORAMAS.length)} aria-label="Panorámica siguiente"><ChevronRight size={20} /></button>
                  </div>
                </>
              )}
            </div>
            <div className="cds-tiras cds-tiras-360">
              {PANORAMAS.map((p, i) => (
                <button key={p.id} type="button" className={i === panoIdx ? 'on' : ''} onClick={() => setPanoIdx(i)}>
                  <img src={p.mini} alt={p.titulo} width="640" height="320" loading="lazy" />
                  <b>{i + 1}. {p.titulo}</b>
                </button>
              ))}
            </div>
            <p className="cds-nota">Arrastra para mirar alrededor y pellizca para acercar.</p>
          </div>
        )}

        {/* ---------- VIDEO ---------- */}
        {pestana === 'video' && (
          <div>
            <video
              controls
              playsInline
              preload="none"
              poster="/cascadas/video/recorrido-poster.jpg"
              className="cds-video"
              onPlay={() => dispararEvento('ViewContent', { content_name: 'Cascadas del Sur', seccion: 'video' })}
            >
              <source src="/cascadas/video/recorrido.mp4" type="video/mp4" />
            </video>
            <p className="cds-nota">Recorrido aéreo del desarrollo, 59 segundos.</p>
          </div>
        )}


      </div>

      {/* ---------- LIGHTBOX ---------- */}
      {lightbox && (
        <div className="cds-lb" role="dialog" aria-modal="true" onClick={(e) => { if (e.target.classList.contains('cds-lb')) setLightbox(null); }}>
          <img
            src={FOTOS[lightbox.indice].full}
            alt={`Cascadas del Sur, vista ${lightbox.indice + 1}`}
          />
          <button type="button" className="cds-lb-cerrar" onClick={() => setLightbox(null)} aria-label="Cerrar"><X size={18} /></button>
          {(
            <div className="cds-lb-nav">
              <button type="button" onClick={() => setLightbox({ tipo: 'foto', indice: (lightbox.indice - 1 + FOTOS.length) % FOTOS.length })} aria-label="Anterior"><ChevronLeft size={17} /></button>
              <span>{lightbox.indice + 1} / {FOTOS.length}</span>
              <button type="button" onClick={() => setLightbox({ tipo: 'foto', indice: (lightbox.indice + 1) % FOTOS.length })} aria-label="Siguiente"><ChevronRight size={17} /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

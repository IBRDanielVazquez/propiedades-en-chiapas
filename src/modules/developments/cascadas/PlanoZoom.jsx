import { useEffect, useRef, useState } from 'react';
import { Expand, X, ZoomIn, ZoomOut } from 'lucide-react';

export default function PlanoZoom({ src, srcMovil, alto, ancho, alt, etiqueta = 'Ver plano completo' }) {
  const [abierto, setAbierto] = useState(false);
  const [escala, setEscala] = useState(1);
  const pinchRef = useRef(0);
  const arrastreRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!abierto) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setAbierto(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [abierto]);

  const cerrar = () => { setAbierto(false); setEscala(1); setPos({ x: 0, y: 0 }); };
  const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  return (
    <>
      <button type="button" className="cds-plano-thumb" onClick={() => setAbierto(true)}>
        <picture>
          {srcMovil && <source media="(max-width: 700px)" srcSet={srcMovil} />}
          <img src={src} alt={alt} width={ancho} height={alto} loading="lazy" decoding="async" />
        </picture>
        <span className="cds-plano-label"><Expand size={15} /> {etiqueta}</span>
      </button>

      {abierto && (
        <div
          className="cds-plano-lb"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={(e) => { if (e.target.classList.contains('cds-plano-lb')) cerrar(); }}
          onTouchStart={(e) => {
            if (e.touches.length === 2) pinchRef.current = dist(e.touches);
            else if (escala > 1) arrastreRef.current = { x: e.touches[0].clientX - pos.x, y: e.touches[0].clientY - pos.y };
          }}
          onTouchMove={(e) => {
            if (e.touches.length === 2 && pinchRef.current) {
              const d = dist(e.touches);
              setEscala((s) => Math.max(1, Math.min(4, s * (d / pinchRef.current))));
              pinchRef.current = d;
            } else if (escala > 1 && arrastreRef.current) {
              setPos({ x: e.touches[0].clientX - arrastreRef.current.x, y: e.touches[0].clientY - arrastreRef.current.y });
            }
          }}
          onTouchEnd={() => { pinchRef.current = 0; arrastreRef.current = null; }}
        >
          <img
            src={src}
            alt={alt}
            style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${escala})` }}
            onDoubleClick={() => { setEscala((s) => (s > 1 ? 1 : 2)); setPos({ x: 0, y: 0 }); }}
          />
          <button type="button" className="cds-plano-cerrar" onClick={cerrar} aria-label="Cerrar"><X size={18} /></button>
          <div className="cds-plano-zoom">
            <button type="button" onClick={() => setEscala((s) => Math.max(1, s - 0.5))} aria-label="Alejar"><ZoomOut size={17} /></button>
            <span>{Math.round(escala * 100)}%</span>
            <button type="button" onClick={() => setEscala((s) => Math.min(4, s + 0.5))} aria-label="Acercar"><ZoomIn size={17} /></button>
          </div>
        </div>
      )}
    </>
  );
}

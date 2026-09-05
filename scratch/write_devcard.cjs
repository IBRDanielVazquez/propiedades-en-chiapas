const fs = require('fs');
const path = require('path');

// ── DevelopmentCard.jsx ──────────────────────────────────────────────────────
const devCardCode = `import React, { useState } from 'react';

// Tarjeta de Desarrollo estilo Airbnb premium
// Muestra la información extraída de las landing pages
// Las landing pages originales NO fueron modificadas

export default function DevelopmentCard({ dev, onClick }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgErr, setImgErr] = useState(false);

  const img = !imgErr && dev.galeria?.[imgIdx]
    ? dev.galeria[imgIdx]
    : (dev.imagen || null);

  const fmt = (n) => '$' + Number(n).toLocaleString('es-MX');

  return (
    <div
      className="property-card dev-card"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Imagen con galería en hover */}
      <div className="property-card-img-wrapper dev-img-wrap">
        {img ? (
          <img
            src={img}
            alt={dev.titulo}
            className="property-card-img"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(145deg,#1A365D,#1E3A9B)', color: 'rgba(255,255,255,.5)'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
          </div>
        )}

        {/* Badge "Desarrollo" */}
        <div className="guest-favorite-badge dev-badge">
          ✦ Desarrollo
        </div>

        {/* Etiqueta personalizada */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)',
          color: '#fff', fontSize: '0.72rem', fontWeight: 700,
          padding: '4px 10px', borderRadius: 20, letterSpacing: '.3px',
        }}>
          {dev.etiqueta}
        </div>

        {/* Dots de galería — solo si hay más de 1 foto */}
        {dev.galeria && dev.galeria.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 5,
          }}>
            {dev.galeria.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                style={{
                  width: i === imgIdx ? 16 : 6, height: 6,
                  borderRadius: 3, border: 'none', cursor: 'pointer',
                  background: i === imgIdx ? '#fff' : 'rgba(255,255,255,.5)',
                  transition: 'all .2s', padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="property-title-row" style={{ marginTop: '0.75rem' }}>
        <div className="property-title" style={{ fontSize: '0.95rem' }}>
          {dev.ciudad.toUpperCase()} · Terreno
        </div>
        <div className="property-rating">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', height:'12px', width:'12px', fill:'currentcolor' }}>
            <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z"/>
          </svg>
          {dev.id === 'rioja-berriozabal' ? '4.97' : '4.95'}
        </div>
      </div>

      <div className="property-subtitle" style={{ marginTop: 2, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {dev.titulo}
      </div>

      <div className="property-subtitle">
        {dev.superficie} · {dev.ubicacionNota}
      </div>

      {/* Amenidades top 3 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
        {dev.amenidades.slice(0, 3).map(a => (
          <span key={a} style={{
            fontSize: '0.7rem', padding: '3px 8px',
            background: '#f1f5f9', color: '#475569',
            borderRadius: 6, fontWeight: 600, border: '1px solid #e2e8f0',
          }}>
            ✨ {a}
          </span>
        ))}
        {dev.amenidades.length > 3 && (
          <span style={{
            fontSize: '0.7rem', padding: '3px 8px',
            background: '#f1f5f9', color: '#0284c7',
            borderRadius: 6, fontWeight: 700, border: '1px solid #cbd5e1',
          }}>
            +{dev.amenidades.length - 3} más
          </span>
        )}
      </div>

      {/* Precio */}
      <div className="property-price" style={{ marginTop: 8 }}>
        <b>{dev.precioTexto}</b>{' '}
        <span style={{ fontSize: '0.85rem', color: '#717171', fontWeight: 400 }}>
          {dev.pagoSemanal || dev.pagoQuincenal}
        </span>
      </div>
    </div>
  );
}
`;

// ── Escribir DevelopmentCard.jsx ─────────────────────────────────────────────
const cardPath = path.join(__dirname, '../src/components/DevelopmentCard.jsx');
fs.writeFileSync(cardPath, devCardCode, 'utf8');
console.log('Wrote DevelopmentCard.jsx —', devCardCode.split('\\n').length, 'lines');

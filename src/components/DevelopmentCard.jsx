import React, { useState } from 'react';

// Tarjeta de Desarrollo / Landing Page estilo Airbnb premium
// Muestra la información e imágenes extraídas de su respectiva landing page

export default function DevelopmentCard({ dev, onClick }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgErr, setImgErr] = useState(false);

  const img = !imgErr && dev.galeria?.[imgIdx]
    ? dev.galeria[imgIdx]
    : (dev.imagen || null);

  const totalPhotos = dev.galeria ? dev.galeria.length : 0;

  return (
    <div
      className="property-card dev-card"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Imagen con carrusel/galería */}
      <div className="property-card-img-wrapper dev-img-wrap">
        {img ? (
          <img
            src={img}
            alt={dev.titulo}
            className="property-card-img"
            loading="lazy"
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

        {/* Badge "Desarrollo" / "Asesor" */}
        <div className="guest-favorite-badge dev-badge">
          {dev.tipo === 'asesor' ? '👤 Asesor IBR' : '✦ Desarrollo'}
        </div>

        {/* Contador de Fotos */}
        {totalPhotos > 1 && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(6px)',
            color: '#fff', fontSize: '0.72rem', fontWeight: 700,
            padding: '3px 9px', borderRadius: 20, letterSpacing: '.3px',
          }}>
            📸 {imgIdx + 1}/{totalPhotos}
          </div>
        )}

        {/* Navigation Dots */}
        {dev.galeria && dev.galeria.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 5, zIndex: 2
          }}>
            {dev.galeria.slice(0, 7).map((_, i) => (
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
        <div className="property-title" style={{ fontSize: '0.92rem' }}>
          {(dev.ciudad || 'Chiapas').toUpperCase()} · {dev.tipo === 'asesor' ? 'ASESOR' : (dev.tipo || 'DESARROLLO').toUpperCase()}
        </div>
        <div className="property-rating">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', height:'12px', width:'12px', fill:'currentcolor' }}>
            <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z"/>
          </svg>
          4.96
        </div>
      </div>

      <div className="property-subtitle" style={{ marginTop: 2, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#1e293b' }}>
        {dev.titulo}
      </div>

      <div className="property-subtitle" style={{ fontSize: '0.82rem', color: '#64748b' }}>
        {dev.ubicacionNota || dev.ciudad}
      </div>

      {/* Amenidades */}
      {dev.amenidades && dev.amenidades.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          {dev.amenidades.slice(0, 3).map(a => (
            <span key={a} style={{
              fontSize: '0.68rem', padding: '2px 7px',
              background: '#f1f5f9', color: '#475569',
              borderRadius: 6, fontWeight: 600, border: '1px solid #e2e8f0',
            }}>
              ✨ {a}
            </span>
          ))}
        </div>
      )}

      {/* Precio */}
      <div className="property-price" style={{ marginTop: 8 }}>
        <b>{dev.precioTexto}</b>{' '}
        {dev.pagoSemanal || dev.pagoQuincenal ? (
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
            · {dev.pagoSemanal || dev.pagoQuincenal}
          </span>
        ) : null}
      </div>
    </div>
  );
}

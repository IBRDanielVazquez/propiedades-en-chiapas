import React, { useState } from 'react';

// Tarjeta Inmobiliaria de Desarrollo / Landing Page
// Renderiza la ficha completa con imágenes reales, amenidades, precios y facilidades de pago

export default function DevelopmentCard({ dev, onClick }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgErr, setImgErr] = useState(false);

  const imgList = Array.isArray(dev.galeria) && dev.galeria.length > 0 ? dev.galeria : (dev.imagen ? [dev.imagen] : []);
  const currentImg = !imgErr && imgList[imgIdx] ? imgList[imgIdx] : (dev.imagen || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800');
  const totalPhotos = imgList.length;

  const nextImg = (e) => {
    e.stopPropagation();
    setImgErr(false);
    setImgIdx((prev) => (prev + 1) % totalPhotos);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setImgErr(false);
    setImgIdx((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  return (
    <div
      className="property-card dev-card"
      onClick={onClick}
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Contenedor de Imagen con Carrusel */}
      <div
        className="property-card-img-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          background: '#0f172a',
          overflow: 'hidden',
        }}
      >
        <img
          src={currentImg}
          alt={dev.titulo}
          className="property-card-img"
          loading="lazy"
          onError={() => setImgErr(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.3s ease',
          }}
        />

        {/* Overlay Degradado para legibilidad */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />

        {/* Badge Tipo / Categoría */}
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 2,
          background: dev.tipo === 'asesor' ? 'rgba(30,58,138,0.9)' : 'rgba(16,185,129,0.92)',
          backdropFilter: 'blur(6px)',
          color: '#ffffff', fontSize: '0.72rem', fontWeight: 800,
          padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}>
          {dev.tipo === 'asesor' ? '👤 Asesor IBR' : (dev.tipo === 'casa' ? '🏠 Residencial' : '✦ Desarrollo')}
        </div>

        {/* Etiqueta Personalizada */}
        {dev.etiqueta && (
          <div style={{
            position: 'absolute', top: 12, right: 12, zIndex: 2,
            background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)',
            color: '#ffffff', fontSize: '0.72rem', fontWeight: 700,
            padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.3px',
          }}>
            {dev.etiqueta}
          </div>
        )}

        {/* Flechas de Carrusel en Hover / Touch */}
        {totalPhotos > 1 && (
          <>
            <button
              onClick={prevImg}
              aria-label="Foto anterior"
              style={{
                position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', zIndex: 3,
                width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.85)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: 14, color: '#1e293b', boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              ‹
            </button>
            <button
              onClick={nextImg}
              aria-label="Foto siguiente"
              style={{
                position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', zIndex: 3,
                width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.85)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: 14, color: '#1e293b', boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              ›
            </button>

            {/* Contador de Fotos */}
            <div style={{
              position: 'absolute', bottom: 10, right: 12, zIndex: 2,
              background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.68rem',
              fontWeight: 700, padding: '2px 8px', borderRadius: 12,
            }}>
              📸 {imgIdx + 1}/{totalPhotos}
            </div>
          </>
        )}
      </div>

      {/* Cuerpo de la Ficha Inmobiliaria */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Encabezado: Ubicación + Tipo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>
            {(dev.ciudad || 'Chiapas').toUpperCase()} · {(dev.tipo || 'LOTE').toUpperCase()}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '2px 8px', borderRadius: 6 }}>
            {dev.status || 'Disponible'}
          </span>
        </div>

        {/* Título de la Ficha */}
        <h3 style={{
          fontSize: '1rem', fontWeight: 800, color: '#1e293b',
          lineHeight: 1.3, marginBottom: 4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {dev.titulo}
        </h3>

        {/* Ubicación / Conectividad */}
        <p style={{
          fontSize: '0.8rem', color: '#64748b', marginBottom: 8, fontWeight: 500,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          📍 {dev.ubicacionNota || dev.ciudad}
        </p>

        {/* Superficie / Dimensiones */}
        {dev.superficie && (
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: 8 }}>
            📐 {dev.superficie}
          </div>
        )}

        {/* Amenidades Reales de la Landing */}
        {dev.amenidades && dev.amenidades.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
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

        {/* Bloque de Precio y Facilidades de Pago */}
        <div style={{
          marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8,
        }}>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
              {dev.precioTexto}
            </div>
            {(dev.pagoSemanal || dev.pagoQuincenal) && (
              <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, marginTop: 1 }}>
                💳 {dev.pagoSemanal || dev.pagoQuincenal}
              </div>
            )}
          </div>

          <span style={{
            fontSize: '0.75rem', fontWeight: 800, color: '#1A365D',
            display: 'flex', alignItems: 'center', gap: 2,
          }}>
            Ver Landing →
          </span>
        </div>
      </div>
    </div>
  );
}

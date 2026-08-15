import React, { useState } from 'react';
import { X, MapPin, CheckCircle, Share2, MessageCircle, ExternalLink, Calendar, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

export default function DevelopmentDetailModal({ dev, onClose }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [imgErr, setImgErr] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!dev) return null;

  const galeria = Array.isArray(dev.galeria) && dev.galeria.length > 0
    ? dev.galeria
    : [dev.imagen || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800'];

  const currentImg = !imgErr && galeria[activeImgIdx] ? galeria[activeImgIdx] : dev.imagen;

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waText = encodeURIComponent(`Hola, vi la ficha inmobiliaria de *${dev.titulo}* en Propiedades en Chiapas y deseo información y disponibilidad.`);
  const waUrl = `${dev.whatsapp || 'https://wa.me/529612466204'}?text=${waText}`;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '1rem', overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff', borderRadius: '24px',
          maxWidth: '900px', width: '100%', maxHeight: '92vh',
          overflowY: 'auto', position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex', flexDirection: 'column',
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
          color: '#1e293b', animation: 'modalFade .25s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalFade { from { opacity:0; transform:scale(.97); } to { opacity:1; transform:scale(1); } }
          .modal-btn-primary {
            background: linear-gradient(135deg, #10b981, #059669);
            color: #fff; border: none; border-radius: 14px;
            padding: 14px 24px; font-weight: 800; font-size: 0.95rem;
            cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
            text-decoration: none; transition: transform .15s, box-shadow .15s;
            box-shadow: 0 4px 14px rgba(16,185,129,0.35);
          }
          .modal-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(16,185,129,0.45); }
          .modal-btn-secondary {
            background: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1;
            border-radius: 14px; padding: 14px 20px; font-weight: 700; font-size: 0.9rem;
            cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
            text-decoration: none; transition: background .15s;
          }
          .modal-btn-secondary:hover { background: #e2e8f0; }
        `}</style>

        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar ficha"
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 10,
            background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
            width: 38, height: 38, cursor: 'pointer', display: 'grid', placeItems: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)', color: '#1e293b',
          }}
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* 📸 Galería y Foto de Portada Principal */}
        <div style={{ position: 'relative', width: '100%', background: '#0f172a' }}>
          <div style={{ width: '100%', height: '380px', position: 'relative', overflow: 'hidden' }}>
            <img
              src={currentImg}
              alt={dev.titulo}
              onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Overlay sutil */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 40%)' }} />

            {/* Badges de Estado y Categoría */}
            <div style={{ position: 'absolute', bottom: 16, left: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: '#10b981', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: 20 }}>
                ✦ {dev.etiqueta || 'Ficha Inmobiliaria'}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.9)', color: '#0f172a', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: 20 }}>
                📍 {dev.ciudad}
              </span>
            </div>
          </div>

          {/* Selector de Miniaturas (Galería completa extraída de la landing) */}
          {galeria.length > 1 && (
            <div style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto', background: '#0f172a' }}>
              {galeria.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => { setImgErr(false); setActiveImgIdx(idx); }}
                  style={{
                    flex: 'none', width: 64, height: 48, borderRadius: 8, overflow: 'hidden',
                    border: idx === activeImgIdx ? '2px solid #10b981' : '2px solid transparent',
                    opacity: idx === activeImgIdx ? 1 : 0.6, cursor: 'pointer', padding: 0, background: 'none'
                  }}
                >
                  <img src={url} alt={`Foto ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 📋 Información Técnica Estructurada de la Ficha */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Título y Compartir */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {(dev.ciudad || 'Chiapas')} · {(dev.tipo || 'LOTE').toUpperCase()}
              </span>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 6px', letterSpacing: '-0.5px' }}>
                {dev.titulo}
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={16} color="#10b981" /> {dev.ubicacionNota || `${dev.ciudad}, Chiapas`}
              </p>
            </div>

            <button
              onClick={shareLink}
              style={{
                background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 12,
                padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6, color: '#334155'
              }}
            >
              <Share2 size={16} /> {copied ? '✅ Enlace Copiado' : 'Compartir'}
            </button>
          </div>

          {/* 💳 Tarjeta Destacada de Precio y Financiamiento Directo */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
            borderRadius: 16, border: '1.5px solid #e2e8f0', padding: '20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', uppercase: 'uppercase', letterSpacing: '0.5px' }}>
                ESQUEMA FINANCIERO & PRECIO
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '2px 0' }}>
                {dev.precioTexto}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#059669' }}>
                💳 {dev.pagoSemanal || dev.pagoQuincenal || 'Financiamiento Directo Disponible'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexDirection: 'column', textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                📐 Superficie: <strong>{dev.superficie}</strong>
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                <ShieldCheck size={16} /> Certeza Jurídica Garantizada
              </span>
            </div>
          </div>

          {/* 📝 Descripción Técnica */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
              Descripción del Inmueble
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
              {dev.descripcion}
            </p>
          </div>

          {/* ✨ Amenidades y Ventajas Incluidas */}
          {dev.amenidades && dev.amenidades.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={18} color="#10b981" /> Amenidades y Características
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {dev.amenidades.map((am, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#f8fafc', padding: '10px 14px', borderRadius: 10,
                    border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 700, color: '#334155'
                  }}>
                    <CheckCircle size={16} color="#10b981" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🚀 Botones de Acción Inmobiliaria (WhatsApp / Cita / Ver Landing Original) */}
          <div style={{
            display: 'flex', gap: 12, marginTop: 8, paddingTop: 16,
            borderTop: '1px solid #e2e8f0', flexWrap: 'wrap'
          }}>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="modal-btn-primary"
              style={{ flex: 1, minWidth: 220 }}
            >
              <MessageCircle size={20} /> Solicitar Información por WhatsApp
            </a>

            <a
              href={`/${dev.slug}`}
              target="_blank"
              rel="noreferrer"
              className="modal-btn-secondary"
              style={{ flex: 1, minWidth: 200 }}
            >
              <ExternalLink size={18} /> Ver Landing Page Completa
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

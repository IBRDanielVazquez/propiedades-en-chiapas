import React, { useState } from 'react';

const PALETTES = {
  oro_elegante: {
    name: 'Elegante Oro',
    main: '#0f172a',
    accent: '#fbbf24',
    text: '#f8fafc',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    glass: 'rgba(255, 255, 255, 0.05)'
  },
  modern_minimal: {
    name: 'Minimalista Pro',
    main: '#ffffff',
    accent: '#000000',
    text: '#171717',
    bg: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
    glass: 'rgba(0, 0, 0, 0.03)'
  },
  nature_chiapas: {
    name: 'Esmeralda Chiapas',
    main: '#064e3b',
    accent: '#10b981',
    text: '#ecfdf5',
    bg: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
    glass: 'rgba(255, 255, 255, 0.05)'
  },
  luxury_dark: {
    name: 'Noche de Lujo',
    main: '#1e1b4b',
    accent: '#818cf8',
    text: '#e0e7ff',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    glass: 'rgba(255, 255, 255, 0.08)'
  },
  corporate_pro: {
    name: 'Azul Corporativo',
    main: '#0ea5e9',
    accent: '#0f172a',
    text: '#ffffff',
    bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    glass: 'rgba(255, 255, 255, 0.1)'
  }
};

const SOCIAL_CONFIG = [
  { key: 'whatsapp',  label: 'WhatsApp',  color: '#25D366', icon: '💬', prefix: 'https://wa.me/' },
  { key: 'instagram', label: 'Instagram', color: '#E1306C', icon: '📸', prefix: 'https://instagram.com/' },
  { key: 'facebook',  label: 'Facebook',  color: '#1877F2', icon: '👥', prefix: 'https://facebook.com/' },
  { key: 'tiktok',    label: 'TikTok',    color: '#000000', icon: '🎵', prefix: 'https://tiktok.com/@' },
  { key: 'linkedin',  label: 'LinkedIn',  color: '#0A66C2', icon: '💼', prefix: 'https://linkedin.com/in/' },
  { key: 'website',   label: 'Sitio Web', color: '#6366f1', icon: '🌐', prefix: '' },
];

function SocialButton({ config, value, palette }) {
  if (!value) return null;
  const url = config.prefix ? `${config.prefix}${value.replace(/^@/, '')}` : value;
  const isDark = palette.main !== '#ffffff';
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
        padding: '0.85rem', borderRadius: '14px', textDecoration: 'none',
        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        color: isDark ? '#ffffff' : '#1e293b',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        fontWeight: '700', fontSize: '0.85rem',
        transition: 'all 0.3s ease', cursor: 'pointer',
        flex: '1 1 calc(50% - 0.5rem)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={e => { 
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.background = palette.accent;
        e.currentTarget.style.color = palette.main === '#ffffff' ? '#ffffff' : palette.main;
      }}
      onMouseLeave={e => { 
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
        e.currentTarget.style.color = isDark ? '#ffffff' : '#1e293b';
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{config.icon}</span> {config.label}
    </a>
  );
}

export default function DigitalCard({ profile, plan, isPublished = false }) {
  const [flipped, setFlipped] = useState(false);
  const [showQrTab, setShowQrTab] = useState(false);

  const palette = PALETTES[profile.palette_id] || PALETTES.oro_elegante;
  const isDark = palette.main !== '#ffffff';
  const hasSocials = SOCIAL_CONFIG.some(s => profile[s.key]);

  const handleDownloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name || 'Asesor'}
ORG:${profile.company || 'Propiedades en Chiapas'}
TITLE:${profile.position || 'Asesor Inmobiliario'}
TEL;TYPE=CELL:${profile.phone || ''}
EMAIL:${profile.email || ''}
URL:${profile.website || ''}
NOTE:Tarjeta Digital de Propiedades en Chiapas
END:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(profile.name || 'asesor').replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto', position: 'relative' }}>

      {/* Control de visualización */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem', gap: '0.6rem' }}>
        <button
          onClick={() => setFlipped(f => !f)}
          style={{ 
            background: isDark ? 'rgba(255,255,255,0.1)' : '#ffffff', 
            color: isDark ? '#ffffff' : '#1e293b', 
            padding: '0.5rem 1.25rem', borderRadius: '30px', 
            fontSize: '0.8rem', fontWeight: '700', border: '1px solid rgba(0,0,0,0.05)', 
            cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          🔄 {flipped ? 'Ver Info Principal' : 'Ver Redes Sociales'}
        </button>
      </div>

      {/* CARD CONTAINER */}
      <div style={{ perspective: '1200px', height: '560px', position: 'relative' }}>
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>

          {/* ── FRENTE (Premium Style) ── */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            borderRadius: '28px', overflow: 'hidden',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.25)',
            background: palette.bg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
            display: 'flex', flexDirection: 'column'
          }}>
            {/* Header / Logo */}
            <div style={{ padding: '2rem 2rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {profile.logo_url ? (
                <img src={profile.logo_url} alt="Logo" style={{ height: '40px', maxWidth: '140px', objectFit: 'contain' }} />
              ) : (
                <div style={{ color: palette.accent, fontWeight: '900', fontSize: '1rem', letterSpacing: '0.5px' }}>PROPIEDADES CHIAPAS</div>
              )}
              <span style={{ 
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', 
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.65rem', 
                fontWeight: '800', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' 
              }}>
                {plan?.icon} {plan?.name}
              </span>
            </div>

            {/* Foto Perfil Circular con Anillo de Luz */}
            <div style={{ position: 'relative', textAlign: 'center', margin: '1rem 0' }}>
              <div style={{ 
                width: '140px', height: '140px', margin: '0 auto', borderRadius: '50%', 
                padding: '5px', background: `linear-gradient(45deg, ${palette.accent}, transparent)`,
                boxShadow: `0 0 20px ${palette.accent}33`
              }}>
                <img
                  src={profile.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'}
                  alt={profile.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ffffff' }}
                />
              </div>
            </div>

            {/* Información Central */}
            <div style={{ padding: '1rem 2rem 2rem', textAlign: 'center', flex: 1 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: palette.text, marginBottom: '0.35rem', letterSpacing: '-0.5px' }}>
                {profile.name || 'Tu Nombre'}
              </h2>
              <div style={{ 
                display: 'inline-block', padding: '4px 14px', background: palette.accent, 
                color: palette.main === '#ffffff' ? '#ffffff' : palette.main, borderRadius: '8px',
                fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', 
                letterSpacing: '1px', marginBottom: '1.25rem' 
              }}>
                {profile.position || 'Asesor Inmobiliario'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', color: palette.text, opacity: 0.9 }}>
                {profile.company && <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>🏢 {profile.company}</div>}
                {profile.phone && <a href={`tel:${profile.phone}`} style={{ fontSize: '0.95rem', fontWeight: '700', color: palette.accent, textDecoration: 'none' }}>📞 {profile.phone}</a>}
                {profile.location && <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>📍 {profile.location}</div>}
              </div>

              {profile.bio && (
                <p style={{
                  marginTop: '1.5rem', fontSize: '0.8rem', color: palette.text, opacity: 0.7,
                  lineHeight: '1.6', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)',
                  padding: '1rem', borderRadius: '15px'
                }}>
                  "{profile.bio}"
                </p>
              )}
            </div>

            {/* Footer con Licencia */}
            {profile.license && (
              <div style={{ 
                padding: '1rem', background: 'rgba(0,0,0,0.1)', textAlign: 'center', 
                fontSize: '0.7rem', fontWeight: '700', color: palette.text, opacity: 0.5, letterSpacing: '1px' 
              }}>
                CERTIFICACIÓN: {profile.license}
              </div>
            )}
          </div>

          {/* ── REVERSO (Redes Sociales y QR) ── */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '28px', overflow: 'hidden',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.25)',
            background: palette.bg, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
            padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column'
          }}>
            <h3 style={{ 
              color: palette.accent, fontSize: '0.85rem', fontWeight: '900', 
              textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '2rem', textAlign: 'center' 
            }}>
              Canales Digitales
            </h3>

            {hasSocials ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {SOCIAL_CONFIG.map(cfg => (
                  <SocialButton key={cfg.key} config={cfg} value={profile[cfg.key]} palette={palette} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: palette.text, opacity: 0.5, padding: '3rem 0' }}>
                <p>No has configurado redes sociales todavía.</p>
              </div>
            )}

            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
              <button 
                onClick={handleDownloadVCard}
                style={{
                  width: '100%', padding: '1rem', background: palette.accent,
                  color: palette.main === '#ffffff' ? '#ffffff' : palette.main,
                  border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '0.9rem',
                  cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                📥 Descargar Contacto VCF
              </button>
            </div>
          </div>
        </div>

        {/* ── MINI PESTAÑA QR (Interactivo) ── */}
        <div style={{
          position: 'absolute', bottom: '20px', left: '-15px', zIndex: 100,
          transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: showQrTab ? 'translateX(25px) translateY(-80px) scale(1.1)' : 'translateX(0) scale(1)',
        }}>
          {/* El botón-pestaña */}
          <div 
            onClick={() => setShowQrTab(!showQrTab)}
            style={{
              width: '50px', height: '50px', background: palette.accent, borderRadius: '15px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)', border: '2px solid #ffffff'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{showQrTab ? '✕' : '📱'}</span>
          </div>

          {/* El panel del QR que emerge */}
          {showQrTab && (
            <div style={{
              position: 'absolute', top: '65px', left: '0', background: '#ffffff',
              padding: '1.25rem', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              width: '220px', textAlign: 'center', animation: 'fadeIn 0.3s ease', border: '1px solid #e2e8f0'
            }}>
              <p style={{ color: '#1e293b', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
                Escanéame para guardar mis datos
              </p>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/card/' + (profile.slug || profile.id || 'usr'))}`} 
                alt="QR" 
                style={{ width: '140px', height: '140px', marginBottom: '0.8rem', borderRadius: '10px' }}
              />
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>
                Tu contacto digital inteligente
              </div>
            </div>
          )}
          
          {/* Tooltip indicador */}
          {!showQrTab && (
            <div style={{
              position: 'absolute', left: '65px', top: '50%', transform: 'translateY(-50%)',
              background: '#0f172a', color: '#ffffff', padding: '6px 12px', borderRadius: '10px',
              fontSize: '0.7rem', fontWeight: '700', whiteSpace: 'nowrap', pointerEvents: 'none'
            }}>
              QR de Contacto ⬅️
            </div>
          )}
        </div>
      </div>

      {/* Marca de agua elegante */}
      <div style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.4, fontSize: '0.7rem', color: palette.text, letterSpacing: '2px', fontWeight: '800' }}>
        PROPIEDADES EN CHIAPAS
      </div>
    </div>
  );
}

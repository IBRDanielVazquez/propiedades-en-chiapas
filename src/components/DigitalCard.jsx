import React, { useState } from 'react';

const SOCIAL_CONFIG = [
  { key: 'whatsapp',  label: 'WhatsApp',  color: '#25D366', icon: '💬', prefix: 'https://wa.me/' },
  { key: 'instagram', label: 'Instagram', color: '#E1306C', icon: '📸', prefix: 'https://instagram.com/' },
  { key: 'facebook',  label: 'Facebook',  color: '#1877F2', icon: '👥', prefix: 'https://facebook.com/' },
  { key: 'tiktok',    label: 'TikTok',    color: '#000000', icon: '🎵', prefix: 'https://tiktok.com/@' },
  { key: 'youtube',   label: 'YouTube',   color: '#FF0000', icon: '▶️', prefix: 'https://youtube.com/@' },
  { key: 'linkedin',  label: 'LinkedIn',  color: '#0A66C2', icon: '💼', prefix: 'https://linkedin.com/in/' },
  { key: 'website',   label: 'Sitio Web', color: '#0284c7', icon: '🌐', prefix: '' },
];

function SocialButton({ config, value }) {
  if (!value) return null;
  const url = config.prefix ? `${config.prefix}${value.replace(/^@/, '')}` : value;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        padding: '0.65rem 1rem', borderRadius: '10px', textDecoration: 'none',
        background: config.color + '15', color: config.color,
        border: `1px solid ${config.color}30`, fontWeight: '700', fontSize: '0.85rem',
        transition: 'all 0.2s', cursor: 'pointer',
        flex: '1 1 auto', minWidth: '120px'
      }}
      onMouseEnter={e => { e.currentTarget.style.background = config.color; e.currentTarget.style.color = '#ffffff'; }}
      onMouseLeave={e => { e.currentTarget.style.background = config.color + '15'; e.currentTarget.style.color = config.color; }}
    >
      <span>{config.icon}</span> {config.label}
    </a>
  );
}

export default function DigitalCard({ profile, plan, isPublished = false }) {
  const [flipped, setFlipped] = useState(false);

  const hasSocials = SOCIAL_CONFIG.some(s => profile[s.key]);
  const planColors = {
    admin: '#ef4444', developer: '#f59e0b', premium: '#7c3aed',
    basic: '#0284c7', starter: '#64748b'
  };
  const accentColor = planColors[plan?.id] || '#0284c7';

  return (
    <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>

      {/* Status badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', gap: '0.5rem', flexWrap: 'wrap' }}>
        {isPublished ? (
          <span style={{ background: '#dcfce7', color: '#166534', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', border: '1px solid #86efac' }}>
            ✅ Tarjeta Pública — Visible en el portal
          </span>
        ) : (
          <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', border: '1px solid #fcd34d' }}>
            👁️ Vista Previa — Solo tú puedes verla
          </span>
        )}
        <span
          onClick={() => setFlipped(f => !f)}
          style={{ background: '#f1f5f9', color: '#475569', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', border: '1px solid #e2e8f0', cursor: 'pointer' }}
        >
          🔄 {flipped ? 'Ver frente' : 'Voltear'}
        </span>
      </div>

      {/* Card with flip animation */}
      <div style={{ perspective: '1000px', height: '520px' }}>
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>

          {/* ── FRENTE ── */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            background: '#ffffff'
          }}>
            {/* Header con gradiente */}
            <div style={{
              height: '160px', position: 'relative', overflow: 'hidden',
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}88 100%)`
            }}>
              {/* Patrón decorativo */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    width: `${60 + i * 20}px`, height: `${60 + i * 20}px`,
                    borderRadius: '50%', border: '2px solid white',
                    top: `${-20 + i * 15}px`, right: `${-30 + i * 10}px`
                  }} />
                ))}
              </div>

              {/* Plan badge */}
              <span style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)',
                color: '#ffffff', padding: '4px 12px', borderRadius: '20px',
                fontSize: '0.72rem', fontWeight: '700', border: '1px solid rgba(255,255,255,0.3)'
              }}>
                {plan?.icon} Plan {plan?.name}
              </span>

              {/* Logo inmobiliaria */}
              <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%) translateY(50%)' }}>
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%',
                  border: '4px solid #ffffff', overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)', background: '#f1f5f9'
                }}>
                  <img
                    src={profile.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'}
                    alt={profile.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>

            {/* Datos */}
            <div style={{ padding: '3.5rem 1.75rem 1.75rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>
                {profile.name || 'Tu Nombre Aquí'}
              </h2>
              <p style={{ color: accentColor, fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                {profile.position || 'Asesor Inmobiliario'}
              </p>
              {profile.company && (
                <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1rem' }}>🏢 {profile.company}</p>
              )}
              {profile.location && (
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1rem' }}>📍 {profile.location}</p>
              )}

              {profile.bio && (
                <p style={{
                  color: '#475569', fontSize: '0.82rem', lineHeight: '1.5',
                  background: '#f8fafc', padding: '0.75rem', borderRadius: '10px',
                  border: '1px solid #f1f5f9', fontStyle: 'italic', marginBottom: '1.25rem'
                }}>
                  "{profile.bio}"
                </p>
              )}

              {/* Contacto rápido */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem', borderRadius: '20px', background: '#f1f5f9', color: '#475569', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '600', border: '1px solid #e2e8f0' }}>
                    📞 {profile.phone}
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem', borderRadius: '20px', background: '#f1f5f9', color: '#475569', textDecoration: 'none', fontSize: '0.82rem', fontWeight: '600', border: '1px solid #e2e8f0' }}>
                    ✉️ Email
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ── REVERSO ── */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            background: '#0f172a'
          }}>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h3 style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', textAlign: 'center' }}>
                Encuéntrame en
              </h3>

              {hasSocials ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center' }}>
                  {SOCIAL_CONFIG.map(cfg => (
                    <SocialButton key={cfg.key} config={cfg} value={profile[cfg.key]} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#475569', padding: '2rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                  <p style={{ fontSize: '0.85rem' }}>Agrega tus redes sociales<br />en tu perfil para verlas aquí.</p>
                </div>
              )}

              {/* QR placeholder */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e293b' }}>
                <div style={{ width: '70px', height: '70px', background: '#1e293b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                  📱
                </div>
                <p style={{ color: '#475569', fontSize: '0.72rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                  ESCANEA PARA CONTACTARME
                </p>
                {profile.license && (
                  <p style={{ color: '#334155', fontSize: '0.68rem', fontWeight: '600' }}>
                    Reg. {profile.license}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA publicar — solo si tiene card_publish */}
      {!isPublished && (
        <div style={{ marginTop: '1.25rem', background: 'linear-gradient(135deg, #7c3aed22, #0284c722)', borderRadius: '14px', padding: '1.25rem', border: '1px solid #7c3aed33', textAlign: 'center' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.4rem' }}>
            🚀 ¿Listo para publicarte?
          </p>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
            Actualiza tu plan para publicar tu tarjeta en el portal y recibir leads.
          </p>
          <button style={{
            background: 'linear-gradient(135deg, #7c3aed, #0284c7)', color: '#ffffff',
            border: 'none', borderRadius: '10px', padding: '0.65rem 1.75rem',
            fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer'
          }}>
            💳 Activar Plan
          </button>
        </div>
      )}
    </div>
  );
}

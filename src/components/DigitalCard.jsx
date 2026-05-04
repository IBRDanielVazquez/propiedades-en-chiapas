import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../supabaseClient';

// --- CONFIG & DESIGN TOKENS ---
const COLORS = {
  primary: '#1A1A6E',
  gold: '#C9A84C',
  whatsapp: '#25D366',
  verified: '#2E7D32',
  grayText: '#888',
  lightGray: '#f0f0f0',
  white: '#FFFFFF',
  bio: '#444',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

const FONTS = {
  serif: 'Georgia, serif',
  sans: 'system-ui, -apple-system, sans-serif',
};

// --- HELPER COMPONENTS (ICONS) ---
const IconWA = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 8.81 19.79 19.79 0 0 1 6.11 2.18 2 2 0 0 1 8 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L12.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.9v2.02z" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconSave = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconSocial = ({ type }) => {
  switch (type) {
    case 'instagram':
      return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
    case 'facebook':
      return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
    case 'tiktok':
      return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z" /></svg>;
    case 'youtube':
      return <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 0 0-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
    default:
      return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
  }
};

// --- vCARD GENERATOR ---
const downloadVCard = (user) => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${user.name}
ORG:Propiedades en Chiapas
TITLE:${user.cargo || 'Asesor Inmobiliario'}
TEL;TYPE=CELL:+${user.phone || user.whatsapp || ''}
EMAIL:${user.email || ''}
URL:https://propiedadesenchiapas.com/card/${user.slug}
PHOTO;VALUE=URI:${user.photo_url || ''}
END:VCARD`;
  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${user.slug}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
};

// --- MAIN COMPONENT ---
export default function DigitalCard() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const slug = window.location.pathname.split('/card/')[1]?.split('/')[0] || '';
  const cardUrl = `https://propiedadesenchiapas.com/card/${slug}`;

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .eq('active', true)
        .single();

      if (userError || !userData) {
        setLoading(false);
        return;
      }

      setUser(userData);

      const { data: propsData } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userData.id)
        .eq('active', true)
        .limit(3);

      setProperties(propsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: FONTS.sans }}>Cargando...</div>;
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: 20, textAlign: 'center', fontFamily: FONTS.sans }}>
        <h2 style={{ color: COLORS.primary }}>Asesor no encontrado</h2>
        <button 
          onClick={() => window.location.href = 'https://propiedadesenchiapas.com'}
          style={{ marginTop: 20, padding: '12px 24px', background: COLORS.primary, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
        >
          Ir al portal
        </button>
      </div>
    );
  }

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '0 0 40px 0' }}>
      <Helmet>
        <title>{user.name} | Propiedades en Chiapas</title>
        <meta property="og:title" content={`${user.name} - Asesor Inmobiliario`} />
        <meta property="og:description" content={`Contacta a ${user.name} para encontrar tu propiedad ideal en Chiapas.`} />
        <meta property="og:image" content={user.photo_url || ''} />
        <meta property="og:url" content={cardUrl} />
      </Helmet>

      <div style={{ width: '100%', maxWidth: 430, background: COLORS.white, boxShadow: `0 10px 30px ${COLORS.shadow}`, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* 1. HEADER AGENCIA */}
        <header style={{ height: 40, background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '0.5px', fontFamily: FONTS.sans }}>Propiedades en Chiapas</span>
        </header>

        {/* 2. FOTO + IDENTIDAD */}
        <section style={{ padding: '30px 24px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            {user.photo_url ? (
              <img 
                src={user.photo_url} 
                alt={user.name} 
                loading="lazy"
                style={{ width: 110, height: 110, borderRadius: '50%', border: `3px solid ${COLORS.gold}`, objectFit: 'cover' }} 
              />
            ) : (
              <div style={{ width: 110, height: 110, borderRadius: '50%', background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32, fontWeight: 700, border: `3px solid ${COLORS.gold}` }}>
                {initials}
              </div>
            )}
          </div>
          
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: COLORS.primary, fontFamily: FONTS.serif }}>{user.name}</h1>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: COLORS.grayText, fontStyle: 'italic', fontFamily: FONTS.sans }}>{user.cargo || 'Asesor Inmobiliario'}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: COLORS.verified, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2, fontFamily: FONTS.sans }}>
               ✓ Asesor Verificado
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: COLORS.grayText, fontFamily: FONTS.sans }}>📍 {user.municipio || 'Chiapas'}, MX</p>
        </section>

        {/* 3. BOTÓN WHATSAPP PRINCIPAL */}
        <section style={{ padding: '0 24px 16px' }}>
          <a 
            href={`https://wa.me/${user.whatsapp || user.phone || ''}?text=${encodeURIComponent('Hola, vi tu tarjeta digital y me gustaría más información.')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              height: 52, background: COLORS.whatsapp, color: '#fff', textDecoration: 'none',
              borderRadius: 14, fontSize: 16, fontWeight: 700, fontFamily: FONTS.sans,
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
            }}
          >
            <IconWA /> Escribir por WhatsApp
          </a>
        </section>

        {/* 4. BOTONES SECUNDARIOS */}
        <section style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <a href={`tel:+${user.phone || user.whatsapp || ''}`} style={{ ...styles.secondaryBtn, borderColor: COLORS.primary, color: COLORS.primary }}>
            <IconPhone />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Llamar</span>
          </a>
          <a href={`mailto:${user.email || ''}`} style={{ ...styles.secondaryBtn, borderColor: '#7B3FBE', color: '#7B3FBE' }}>
            <IconMail />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Email</span>
          </a>
          <button onClick={() => downloadVCard(user)} style={{ ...styles.secondaryBtn, borderColor: '#555', color: '#555', background: 'none', cursor: 'pointer' }}>
            <IconSave />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Guardar</span>
          </button>
        </section>

        {/* 5. BIO */}
        {user.bio && (
          <section style={{ padding: '24px 24px', borderTop: `1px solid ${COLORS.lightGray}` }}>
            <p style={{ 
              margin: 0, fontSize: 14, color: COLORS.bio, lineHeight: 1.7, fontFamily: FONTS.sans,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: bioExpanded ? 'unset' : 3, WebkitBoxOrient: 'vertical'
            }}>
              {user.bio}
            </p>
            {user.bio.length > 120 && (
              <button 
                onClick={() => setBioExpanded(!bioExpanded)}
                style={{ background: 'none', border: 'none', color: COLORS.primary, padding: '8px 0 0', cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: FONTS.sans }}
              >
                {bioExpanded ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </section>
        )}

        {/* 6. REDES SOCIALES */}
        <section style={{ padding: '10px 0 24px' }}>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 24px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {user.instagram && (
              <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer" style={{ ...styles.socialPill, background: 'rgba(225, 48, 108, 0.1)', color: '#E1306C' }}>
                <IconSocial type="instagram" /> Instagram
              </a>
            )}
            {user.facebook && (
              <a href={`https://facebook.com/${user.facebook}`} target="_blank" rel="noopener noreferrer" style={{ ...styles.socialPill, background: 'rgba(24, 119, 242, 0.1)', color: '#1877F2' }}>
                <IconSocial type="facebook" /> Facebook
              </a>
            )}
            {user.tiktok && (
              <a href={`https://tiktok.com/@${user.tiktok}`} target="_blank" rel="noopener noreferrer" style={{ ...styles.socialPill, background: 'rgba(0, 0, 0, 0.05)', color: '#000' }}>
                <IconSocial type="tiktok" /> TikTok
              </a>
            )}
            {user.youtube && (
              <a href={`https://youtube.com/${user.youtube}`} target="_blank" rel="noopener noreferrer" style={{ ...styles.socialPill, background: 'rgba(255, 0, 0, 0.1)', color: '#FF0000' }}>
                <IconSocial type="youtube" /> YouTube
              </a>
            )}
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer" style={{ ...styles.socialPill, background: 'rgba(26, 26, 110, 0.1)', color: COLORS.primary }}>
                <IconSocial type="web" /> Web
              </a>
            )}
          </div>
        </section>

        {/* 7. PROPIEDADES */}
        {properties.length > 0 && (
          <section style={{ padding: '24px 0', borderTop: `1px solid ${COLORS.lightGray}` }}>
            <h3 style={{ margin: '0 24px 16px', fontSize: 11, color: COLORS.grayText, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, fontFamily: FONTS.sans }}>Mis propiedades</h3>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 24px', scrollbarWidth: 'none' }}>
              {properties.map(prop => (
                <div 
                  key={prop.id} 
                  onClick={() => window.location.href = `/propiedad/${prop.id}`}
                  style={{ minWidth: 160, width: 160, cursor: 'pointer', borderRadius: 12, overflow: 'hidden', border: `1px solid ${COLORS.lightGray}` }}
                >
                  <img 
                    src={prop.images?.[0] || 'https://via.placeholder.com/160x90?text=Sin+Foto'} 
                    alt={prop.title} 
                    loading="lazy"
                    style={{ width: '100%', height: 90, objectFit: 'cover' }}
                  />
                  <div style={{ padding: 10 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: COLORS.primary, fontFamily: FONTS.sans }}>${Number(prop.price).toLocaleString('es-MX')}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#555', lineHeight: 1.3, height: 28, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontFamily: FONTS.sans }}>
                      {prop.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. ZONA COMPARTIR */}
        <section style={{ padding: '32px 24px', borderTop: `1px solid ${COLORS.lightGray}`, textAlign: 'center' }}>
          <div style={{ marginBottom: 16 }}>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(cardUrl)}`} 
              alt="QR Card" 
              style={{ width: 100, height: 100, borderRadius: 8 }}
            />
            <p style={{ margin: '8px 0 0', fontSize: 11, color: '#999', fontFamily: FONTS.sans }}>Escanea mi tarjeta</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button 
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Hola, te comparto la tarjeta digital de ${user.name}: ${cardUrl}`)}`, '_blank')}
              style={{ ...styles.shareBtn, borderColor: COLORS.whatsapp, color: COLORS.whatsapp }}
            >
              Compartir por WhatsApp
            </button>
            <button 
              onClick={handleCopy}
              style={{ ...styles.shareBtn, borderColor: '#007AFF', color: '#007AFF' }}
            >
              {copied ? '✓ Enlace copiado' : 'Copiar link'}
            </button>
          </div>
        </section>

        {/* 9. FOOTER */}
        <footer style={{ padding: '24px 24px 40px', textAlign: 'center', background: '#fafafa', borderTop: `1px solid ${COLORS.lightGray}` }}>
          <a href="https://propiedadesenchiapas.com" style={{ textDecoration: 'none', color: COLORS.primary, fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 6, fontFamily: FONTS.sans }}>
            Ver propiedades disponibles →
          </a>
          <p style={{ margin: 0, fontSize: 11, color: '#ccc', fontFamily: FONTS.sans }}>propiedadesenchiapas.com</p>
        </footer>

      </div>
    </div>
  );
}

const styles = {
  secondaryBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 60,
    border: '1px solid',
    borderRadius: 10,
    textDecoration: 'none',
    fontFamily: FONTS.sans,
    transition: 'transform 0.1s',
  },
  socialPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    fontFamily: FONTS.sans,
  },
  shareBtn: {
    padding: '12px',
    borderRadius: 10,
    border: '1px solid',
    background: 'none',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: FONTS.sans,
  }
};

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../supabaseClient';

/**
 * SKILL: Tarjeta Digital Inmobiliaria Premium v2.0
 * Reescrita COMPLETAMENTE siguiendo la especificación oficial.
 */

// ── CONSTANTES Y ESTILOS ───────────────────────────────────────────────────
const COLORS = {
  primary: '#1A1A6E', // IBR Navy
  secondary: '#2E7D32', // Chiapas Green
  whatsapp: '#25D366',
  error: '#DC2626',
  white: '#FFFFFF',
  gray: {
    light: '#F9FAFB',
    medium: '#6B7280',
    dark: '#1F2937',
    border: '#E5E7EB'
  }
};

const STYLES = {
  container: {
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    background: COLORS.white,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    position: 'relative',
    borderRadius: '20px',
    overflowX: 'hidden'
  },
  section: {
    padding: '20px',
    borderBottom: `1px solid ${COLORS.gray.border}`
  },
  btn: {
    width: '100%',
    height: '48px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: '600',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'transform 0.2s active'
  },
  propCard: {
    minWidth: '160px',
    width: '160px',
    background: COLORS.gray.light,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${COLORS.gray.border}`,
    textDecoration: 'none',
    color: 'inherit'
  }
};

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function DigitalCard() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bioExpanded, setBioExpanded] = useState(false);

  // Obtener slug desde la URL
  const slug = window.location.pathname.split('/card/')[1]?.replace(/\/$/, '') || '';

  useEffect(() => {
    if (!slug) {
      setError('Slug no proporcionado');
      setLoading(false);
      return;
    }
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      // 1. Fetch User by Slug
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('slug', slug)
        .single();

      if (userError || !userData) throw new Error('Asesor no encontrado');
      setUser(userData);

      // 2. Fetch Top 3 Properties
      const { data: propData } = await supabase
        .from('properties')
        .select('id, title, price, featured_image_url, type')
        .eq('user_id', userData.id)
        .eq('active', true)
        .limit(3);
      
      setProperties(propData || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── UTILIDADES ───────────────────────────────────────────────────────────
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  const generateVCard = (u) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${u.name}
ORG:${u.agency || 'Propiedades en Chiapas'}
TITLE:${u.cargo || 'Asesor Inmobiliario'}
TEL;TYPE=CELL:+${u.whatsapp || u.phone}
EMAIL:${u.email}
URL:https://propiedadesenchiapas.com/card/${u.slug}
END:VCARD`;
    
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${u.slug}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatPrice = (p) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(p);
  };

  // ── ESTADOS DE CARGA / ERROR ─────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ ...STYLES.container, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: `4px solid ${COLORS.gray.border}`,
          borderTopColor: COLORS.primary,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{ ...STYLES.container, justifyContent: 'center', alignItems: 'center', padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: COLORS.error, fontSize: '24px', fontWeight: '800' }}>404</h2>
        <p style={{ color: COLORS.gray.medium, marginTop: '10px' }}>Asesor no encontrado</p>
        <a href="/" style={{ marginTop: '20px', color: COLORS.primary, fontWeight: '700' }}>Volver al inicio</a>
      </div>
    );
  }

  const primaryColor = user.color_primary || COLORS.primary;
  const cardUrl = `https://propiedadesenchiapas.com/card/${user.slug}`;

  return (
    <div style={STYLES.container}>
      <Helmet>
        <title>{user.name} | Asesor Inmobiliario en Chiapas</title>
        <meta name="description" content={user.bio} />
        <meta property="og:title" content={`${user.name} - ${user.cargo || 'Asesor Inmobiliario'}`} />
        <meta property="og:description" content={user.bio} />
        <meta property="og:image" content={user.photo_url} />
        <meta property="og:url" content={cardUrl} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* SECCIÓN 1 — HEADER DE AGENCIA */}
      <header style={{
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: COLORS.white,
        borderBottom: `1px solid ${COLORS.gray.border}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user.logo_url ? (
            <img src={user.logo_url} alt="Logo Agencia" style={{ height: '30px', maxWidth: '120px', objectFit: 'contain' }} />
          ) : (
            <div style={{ fontWeight: '800', fontSize: '18px', color: primaryColor }}>{user.agency || 'IBR'}</div>
          )}
        </div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: COLORS.gray.medium, letterSpacing: '1px' }}>CHIAPAS</div>
      </header>

      {/* SECCIÓN 2 — PERFIL DEL ASESOR */}
      <section style={{ ...STYLES.section, textAlign: 'center', padding: '30px 20px' }}>
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          margin: '0 auto 20px',
          border: `4px solid ${primaryColor}`,
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: COLORS.gray.light
        }}>
          {user.photo_url ? (
            <img src={user.photo_url} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ fontSize: '40px', fontWeight: '800', color: primaryColor }}>{getInitials(user.name)}</div>
          )}
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: primaryColor, margin: '0 0 5px' }}>{user.name}</h1>
        <div style={{ fontSize: '14px', color: COLORS.gray.medium, fontWeight: '600', marginBottom: '5px' }}>{user.cargo || 'Asesor Inmobiliario'}</div>
        <div style={{ fontSize: '14px', color: COLORS.gray.dark, fontWeight: '700', marginBottom: '5px' }}>{user.agency || 'IBR Marketing Digital'}</div>
        {user.municipio && <div style={{ fontSize: '13px', color: COLORS.gray.medium }}>📍 {user.municipio}, Chiapas</div>}
      </section>

      {/* SECCIÓN 3 — BOTONES DE CONTACTO */}
      <section style={{ ...STYLES.section, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <a href={`https://wa.me/${user.whatsapp}?text=${encodeURIComponent(`Hola ${user.name}, vi tu tarjeta digital y me gustaría recibir información sobre tus propiedades.`)}`} 
           style={{ ...STYLES.btn, background: COLORS.whatsapp, color: COLORS.white }}>
          <span>💬</span> Contactar por WhatsApp
        </a>
        <a href={`tel:${user.phone}`} style={{ ...STYLES.btn, background: primaryColor, color: COLORS.white }}>
          <span>📞</span> Llamar ahora
        </a>
        <a href={`mailto:${user.email}`} style={{ ...STYLES.btn, background: '#6366F1', color: COLORS.white }}>
          <span>✉️</span> Enviar Email
        </a>
        <button onClick={() => generateVCard(user)} style={{ ...STYLES.btn, background: COLORS.gray.light, color: COLORS.gray.dark, border: `1px solid ${COLORS.gray.border}` }}>
          <span>💾</span> Guardar contacto
        </button>
      </section>

      {/* SECCIÓN 4 — BIO */}
      <section style={STYLES.section}>
        <div style={{ fontSize: '14px', color: COLORS.gray.dark, fontWeight: '700', marginBottom: '8px' }}>Sobre mí</div>
        <p style={{
          fontSize: '14px',
          color: '#444',
          lineHeight: '1.6',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: bioExpanded ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {user.bio}
        </p>
        {user.bio?.length > 150 && (
          <button onClick={() => setBioExpanded(!bioExpanded)} style={{
            background: 'none', border: 'none', color: primaryColor, fontWeight: '700', fontSize: '13px', padding: '5px 0', cursor: 'pointer'
          }}>
            {bioExpanded ? 'Ver menos ↑' : 'Ver más ↓'}
          </button>
        )}
      </section>

      {/* SECCIÓN 5 — REDES SOCIALES */}
      {(user.instagram || user.facebook || user.tiktok || user.youtube || user.linkedin || user.website) && (
        <section style={{ ...STYLES.section, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {user.instagram && <a href={`https://instagram.com/${user.instagram}`} target="_blank" style={{ textDecoration: 'none', padding: '8px 12px', borderRadius: '8px', background: '#E1306C15', color: '#E1306C', fontWeight: '700', fontSize: '12px' }}>Instagram</a>}
          {user.facebook && <a href={`https://facebook.com/${user.facebook}`} target="_blank" style={{ textDecoration: 'none', padding: '8px 12px', borderRadius: '8px', background: '#1877F215', color: '#1877F2', fontWeight: '700', fontSize: '12px' }}>Facebook</a>}
          {user.tiktok && <a href={`https://tiktok.com/@${user.tiktok}`} target="_blank" style={{ textDecoration: 'none', padding: '8px 12px', borderRadius: '8px', background: '#00000015', color: '#000000', fontWeight: '700', fontSize: '12px' }}>TikTok</a>}
          {user.linkedin && <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" style={{ textDecoration: 'none', padding: '8px 12px', borderRadius: '8px', background: '#0A66C215', color: '#0A66C2', fontWeight: '700', fontSize: '12px' }}>LinkedIn</a>}
          {user.website && <a href={user.website} target="_blank" style={{ textDecoration: 'none', padding: '8px 12px', borderRadius: '8px', background: primaryColor + '15', color: primaryColor, fontWeight: '700', fontSize: '12px' }}>Sitio Web</a>}
        </section>
      )}

      {/* SECCIÓN 6 — PROPIEDADES DESTACADAS */}
      {properties.length > 0 && (
        <section style={STYLES.section}>
          <div style={{ fontSize: '14px', color: COLORS.gray.dark, fontWeight: '700', marginBottom: '12px' }}>Propiedades destacadas</div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
            {properties.map(p => (
              <a key={p.id} href={`/propiedad/${p.id}`} style={STYLES.propCard}>
                <div style={{ height: '100px', background: COLORS.gray.border }}>
                  <img src={p.featured_image_url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: primaryColor, marginBottom: '2px' }}>{formatPrice(p.price)}</div>
                  <div style={{ fontSize: '10px', fontWeight: '600', color: COLORS.gray.dark, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                  <div style={{ fontSize: '9px', color: COLORS.gray.medium }}>{p.type}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* SECCIÓN 7 — QR CODE */}
      <section style={{ ...STYLES.section, textAlign: 'center', background: COLORS.gray.light }}>
        <div style={{ background: COLORS.white, display: 'inline-block', padding: '15px', borderRadius: '15px', border: `1px solid ${COLORS.gray.border}` }}>
          <QRCodeSVG value={cardUrl} size={120} />
        </div>
        <p style={{ fontSize: '12px', fontWeight: '700', color: COLORS.gray.medium, marginTop: '10px' }}>Escanea para ver mi tarjeta</p>
      </section>

      {/* SECCIÓN 8 — ACCIONES FINALES */}
      <section style={{ ...STYLES.section, display: 'flex', gap: '10px', borderBottom: 'none' }}>
        <button onClick={() => {
          navigator.share ? navigator.share({ title: user.name, url: cardUrl }) : navigator.clipboard.writeText(cardUrl);
        }} style={{ ...STYLES.btn, background: COLORS.gray.dark, color: COLORS.white, flex: 1 }}>
          🔗 Compartir
        </button>
        <button onClick={() => window.print()} style={{ ...STYLES.btn, background: COLORS.gray.light, color: COLORS.gray.dark, flex: 1, border: `1px solid ${COLORS.gray.border}` }}>
          🖼️ Imprimir
        </button>
      </section>

      <footer style={{ padding: '20px', textAlign: 'center', fontSize: '10px', color: COLORS.gray.medium, fontWeight: '800', letterSpacing: '2px' }}>
        PROPIEDADES EN CHIAPAS
      </footer>
    </div>
  );
}

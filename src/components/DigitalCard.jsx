import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../supabaseClient';

// ── QR simple sin dependencia externa ──────────────────────────────────────
function QRPlaceholder({ url, size = 100 }) {
  return (
    <div style={{
      width: size, height: size,
      background: '#fff',
      border: '2px solid #e5e5e5',
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: 10, color: '#999', textAlign: 'center', padding: '0 6px', lineHeight: 1.3 }}>
        QR disponible en app
      </div>
    </div>
  );
}

// ── Íconos SVG inline ──────────────────────────────────────────────────────
const IconWA    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const IconPhone = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.9v2.02z"/></svg>;
const IconMail  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconSave  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconShare = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const IconIG    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const IconFB    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const IconTK    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/></svg>;
const IconWeb   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const IconHome  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;

// ── vCard generator ────────────────────────────────────────────────────────
function downloadVCard(user) {
  const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${user.name}\nORG:${user.agency || 'IBR Marketing Digital'}\nTITLE:${user.cargo || 'Asesor Inmobiliario'}\nTEL;TYPE=CELL:+${user.whatsapp || user.phone || ''}\nEMAIL:${user.email || ''}\nURL:https://propiedadesenchiapas.com/card/${user.slug}\nPHOTO;VALUE=URI:${user.photo_url || ''}\nEND:VCARD`;
  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${user.slug || 'contacto'}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function Skeleton({ w = '100%', h = 16, r = 8, mb = 0 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      marginBottom: mb,
    }} />
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 120, color = '#1A1A6E' }) {
  const [imgError, setImgError] = useState(false);
  const initials = name ? name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : '?';

  if (!src || imgError) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${color}CC)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.35, fontWeight: 700, color: '#fff',
        flexShrink: 0, letterSpacing: 2,
        border: `3px solid ${color}22`,
      }}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setImgError(true)}
      style={{
        width: size, height: size, borderRadius: '50%',
        objectFit: 'cover', flexShrink: 0,
        border: `3px solid ${color}33`,
      }}
    />
  );
}

// ── PropertyMini ───────────────────────────────────────────────────────────
function PropertyMini({ prop, color }) {
  const price = prop.price
    ? `$${Number(prop.price).toLocaleString('es-MX')} MXN`
    : 'Consultar';

  return (
    <div
      onClick={() => window.location.href = `/propiedad/${prop.id}`}
      style={{
        minWidth: 150, maxWidth: 150,
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'transform .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {prop.images?.[0] ? (
        <img src={prop.images[0]} alt={prop.title}
          style={{ width: '100%', height: 90, objectFit: 'cover' }} />
      ) : (
        <div style={{
          width: '100%', height: 90,
          background: `linear-gradient(135deg, ${color}22, ${color}44)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>🏠</div>
      )}
      <div style={{ padding: '8px 10px' }}>
        <p style={{ fontSize: 11, color: '#888', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '.04em' }}>
          {prop.tipo || prop.type || 'Propiedad'}
        </p>
        <p style={{ fontSize: 12, fontWeight: 600, color, margin: '0 0 2px', lineHeight: 1.3 }}>
          {price}
        </p>
        <p style={{ fontSize: 11, color: '#555', margin: 0, lineHeight: 1.3,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {prop.title}
        </p>
      </div>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────
export default function DigitalCard() {
  const [user, setUser]           = useState(null);
  const [props, setProps]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);
  const [copied, setCopied]       = useState(false);
  const [bioOpen, setBioOpen]     = useState(false);

  // Extraer slug del pathname: /card/slug-aqui
  const slug = window.location.pathname.split('/card/')[1]?.split('/')[0] || '';

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }
    loadUser();
  }, [slug]);

  const loadUser = async () => {
    setLoading(true);
    try {
      // Buscar por slug o por id
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .eq('active', true)
        .single();

      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setUser(data);

      // Cargar propiedades del asesor
      const { data: properties } = await supabase
        .from('properties')
        .select('id, title, price, tipo, type, images, municipio')
        .eq('user_id', data.id)
        .eq('active', true)
        .limit(3);

      setProps(properties || []);
    } catch (e) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const color    = user?.color_primary  || '#1A1A6E';
  const colorSec = user?.color_secondary || '#2E7D32';
  const cardUrl  = `https://propiedadesenchiapas.com/card/${slug}`;

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(cardUrl); } catch { }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWA = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Hola, te comparto mi tarjeta digital: ${cardUrl}`)}`, '_blank');
  };

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={styles.page}>
      <style>{shimmerCSS}</style>
      <div style={styles.card}>
        <div style={{ ...styles.header(color), paddingBottom: 60 }} />
        <div style={{ padding: '0 24px', marginTop: -50 }}>
          <Skeleton w={100} h={100} r={50} mb={16} />
          <Skeleton w="60%" h={20} mb={8} />
          <Skeleton w="40%" h={14} mb={24} />
          <Skeleton w="100%" h={48} r={12} mb={8} />
          <Skeleton w="100%" h={48} r={12} mb={8} />
        </div>
      </div>
    </div>
  );

  // ── NOT FOUND ─────────────────────────────────────────────────────────────
  if (notFound) return (
    <div style={styles.page}>
      <div style={{ ...styles.card, padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
        <h2 style={{ color, fontWeight: 700, marginBottom: 8 }}>Asesor no encontrado</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>
          La tarjeta digital que buscas no existe o no está disponible.
        </p>
        <button onClick={() => window.location.href = '/'}
          style={{ ...styles.btnPrimary(color), width: '100%' }}>
          Ver propiedades disponibles
        </button>
      </div>
    </div>
  );

  const hasBio     = user.bio && user.bio.length > 0;
  const hasRedes   = user.instagram || user.facebook || user.tiktok || user.youtube || user.linkedin || user.website;
  const hasProps   = props.length > 0;
  const cargo      = user.cargo || 'Asesor Inmobiliario';
  const agency     = user.agency || 'IBR Marketing Digital';

  return (
    <div style={styles.page}>
      <style>{shimmerCSS + animCSS}</style>

      <Helmet>
        <title>{user.name} | {cargo} en Chiapas</title>
        <meta name="description" content={user.bio || `${user.name}, ${cargo} en Chiapas. Contacta ahora.`} />
        <meta property="og:title" content={`${user.name} | ${cargo}`} />
        <meta property="og:description" content={user.bio || `${cargo} profesional en Chiapas`} />
        {user.photo_url && <meta property="og:image" content={user.photo_url} />}
        <meta property="og:url" content={cardUrl} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div style={styles.card}>

        {/* ── HEADER COLOR ── */}
        <div style={styles.header(color)}>
          {/* Logo agencia */}
          <div style={styles.agencyBadge}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', letterSpacing: '.06em', textTransform: 'uppercase', opacity: .85 }}>
              {agency}
            </span>
          </div>
        </div>

        {/* ── AVATAR + INFO ── */}
        <div style={{ padding: '0 24px', marginTop: -52, position: 'relative', zIndex: 2 }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
            <div style={{
              borderRadius: '50%', padding: 3,
              background: '#fff',
              boxShadow: `0 4px 20px ${color}33`,
            }}>
              <Avatar src={user.photo_url} name={user.name} size={96} color={color} />
            </div>
            {/* Verificado */}
            <div style={{ paddingBottom: 6 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: `${colorSec}18`, border: `1px solid ${colorSec}33`,
                borderRadius: 20, padding: '3px 10px',
                fontSize: 11, fontWeight: 600, color: colorSec,
              }}>
                ✓ Asesor verificado
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, color, margin: '0 0 4px', letterSpacing: '-.02em' }}>
            {user.name}
          </h1>
          <p style={{ fontSize: 14, color: '#555', margin: '0 0 2px', fontWeight: 500 }}>
            {cargo}
          </p>
          <p style={{ fontSize: 13, color: '#888', margin: '0 0 20px' }}>
            📍 {user.municipio || 'Chiapas, México'}
          </p>

          {/* ── BIO ── */}
          {hasBio && (
            <div style={{ marginBottom: 20 }}>
              <p style={{
                fontSize: 14, color: '#444', lineHeight: 1.65, margin: 0,
                overflow: bioOpen ? 'visible' : 'hidden',
                display: bioOpen ? 'block' : '-webkit-box',
                WebkitLineClamp: bioOpen ? 'unset' : 3,
                WebkitBoxOrient: 'vertical',
              }}>
                {user.bio}
              </p>
              {user.bio.length > 120 && (
                <button onClick={() => setBioOpen(!bioOpen)}
                  style={{ background: 'none', border: 'none', color, fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit' }}>
                  {bioOpen ? 'Ver menos ↑' : 'Ver más ↓'}
                </button>
              )}
            </div>
          )}

          {/* ── BOTONES CONTACTO ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>

            <a href={`https://wa.me/${user.whatsapp || user.phone || '529612466204'}`}
              target="_blank" rel="noreferrer"
              style={{ ...styles.btnContact, background: '#25D366', color: '#fff', textDecoration: 'none' }}>
              <IconWA /> WhatsApp
            </a>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <a href={`tel:+${user.whatsapp || user.phone || '529612466204'}`}
                style={{ ...styles.btnContact, background: `${color}12`, color, border: `1.5px solid ${color}30`, textDecoration: 'none' }}>
                <IconPhone /> Llamar
              </a>
              <a href={`mailto:${user.email}`}
                style={{ ...styles.btnContact, background: '#7B3FBE12', color: '#7B3FBE', border: '1.5px solid #7B3FBE30', textDecoration: 'none' }}>
                <IconMail /> Email
              </a>
            </div>

            <button onClick={() => downloadVCard(user)}
              style={{ ...styles.btnContact, background: '#f5f5f5', color: '#444', border: '1.5px solid #e5e5e5', cursor: 'pointer', fontFamily: 'inherit' }}>
              <IconSave /> Guardar contacto
            </button>

          </div>

          {/* ── SEPARADOR ── */}
          <div style={styles.divider} />

          {/* ── REDES SOCIALES ── */}
          {hasRedes && (
            <div style={{ marginBottom: 20 }}>
              <p style={styles.sectionLabel}>Redes sociales</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {user.instagram && (
                  <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noreferrer"
                    style={styles.redBtn('#E1306C')}>
                    <IconIG /> @{user.instagram}
                  </a>
                )}
                {user.facebook && (
                  <a href={`https://facebook.com/${user.facebook}`} target="_blank" rel="noreferrer"
                    style={styles.redBtn('#1877F2')}>
                    <IconFB /> Facebook
                  </a>
                )}
                {user.tiktok && (
                  <a href={`https://tiktok.com/@${user.tiktok}`} target="_blank" rel="noreferrer"
                    style={styles.redBtn('#000')}>
                    <IconTK /> @{user.tiktok}
                  </a>
                )}
                {user.website && (
                  <a href={user.website} target="_blank" rel="noreferrer"
                    style={styles.redBtn(color)}>
                    <IconWeb /> Sitio web
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ── PROPIEDADES ── */}
          {hasProps && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ ...styles.sectionLabel, margin: 0 }}>Mis propiedades</p>
                <a href="/" style={{ fontSize: 12, color, fontWeight: 600, textDecoration: 'none' }}>
                  Ver todas →
                </a>
              </div>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
                {props.map(p => <PropertyMini key={p.id} prop={p} color={color} />)}
              </div>
            </div>
          )}

          <div style={styles.divider} />

          {/* ── COMPARTIR ── */}
          <div style={{ marginBottom: 20 }}>
            <p style={styles.sectionLabel}>Compartir tarjeta</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={shareWA}
                style={{ ...styles.btnShare, background: '#25D36618', color: '#128C7E', border: '1.5px solid #25D36630', cursor: 'pointer', fontFamily: 'inherit' }}>
                <IconWA /> WhatsApp
              </button>
              <button onClick={copyLink}
                style={{ ...styles.btnShare, background: `${color}12`, color, border: `1.5px solid ${color}30`, cursor: 'pointer', fontFamily: 'inherit' }}>
                {copied ? '✓ Copiado' : '🔗 Copiar link'}
              </button>
            </div>
          </div>

          {/* ── QR ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <QRPlaceholder url={cardUrl} size={100} />
            <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>Escanea para ver esta tarjeta</p>
          </div>

        </div>

        {/* ── FOOTER ── */}
        <div style={{
          borderTop: '1px solid #f0f0f0',
          padding: '16px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button onClick={() => window.location.href = '/'}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            <IconHome /> Ver propiedades
          </button>
          <span style={{ fontSize: 11, color: '#ccc' }}>propiedadesenchiapas.com</span>
        </div>

      </div>
    </div>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #f8f9ff 0%, #f0f4ff 100%)',
    display: 'flex', justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px 16px 40px',
  },
  card: {
    background: '#fff',
    borderRadius: 24,
    boxShadow: '0 8px 48px rgba(26,26,110,0.10), 0 1px 4px rgba(0,0,0,0.04)',
    width: '100%',
    maxWidth: 460,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  header: (color) => ({
    height: 110,
    background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
    position: 'relative',
    overflow: 'hidden',
  }),
  agencyBadge: {
    position: 'absolute',
    bottom: 12, left: 24,
  },
  divider: {
    height: 1,
    background: '#f0f0f0',
    margin: '0 0 20px',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '.08em',
    textTransform: 'uppercase',
    color: '#999',
    margin: '0 0 10px',
  },
  btnContact: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 48, borderRadius: 12,
    fontSize: 15, fontWeight: 600,
    border: 'none',
    transition: 'opacity .15s',
  },
  btnPrimary: (color) => ({
    height: 48, borderRadius: 12,
    background: color, color: '#fff',
    border: 'none', fontSize: 15, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  }),
  btnShare: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 6, height: 42, borderRadius: 10,
    fontSize: 13, fontWeight: 600,
    transition: 'opacity .15s',
  },
  redBtn: (color) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 12px', borderRadius: 20,
    background: `${color}12`, color,
    border: `1.5px solid ${color}25`,
    fontSize: 12, fontWeight: 500,
    textDecoration: 'none',
  }),
};

const shimmerCSS = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}`;

const animCSS = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}`;

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../supabaseClient';

// ── Constantes de color ───────────────────────────────────────────────────────
const MARINO  = '#1A1A6E';
const VERDE   = '#2E7D32';
const VERDEWA = '#25D366';
const BLANCO  = '#FFFFFF';
const GRIS_BG = '#F8FAFC';
const GRIS_BD = '#E2E8F0';
const GRIS_T  = '#64748B';
const NEGRO   = '#0A0A1A';

// ── Keyframes ─────────────────────────────────────────────────────────────────
const KF = `
  @keyframes ring-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(46,125,50,.45); }
    50%       { box-shadow: 0 0 0 10px rgba(46,125,50,0); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-wa {
    0%   { box-shadow: 0 0 0 0 rgba(37,211,102,.6); }
    70%  { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ── Formatear precio ──────────────────────────────────────────────────────────
const FMT = (n) => n
  ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
  : '';

// ── Generar vCard ─────────────────────────────────────────────────────────────
const descargarVCard = (profile) => {
  const cardUrl = `${window.location.origin}/card/${profile.slug || profile.id}`;
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.name || 'Asesor'}`,
    `ORG:${profile.company || 'Propiedades en Chiapas'}`,
    `TITLE:${profile.position || 'Asesor Inmobiliario'}`,
    profile.phone    ? `TEL;TYPE=CELL:${profile.phone}` : '',
    profile.whatsapp ? `TEL;TYPE=WORK:${profile.whatsapp}` : '',
    profile.email    ? `EMAIL:${profile.email}` : '',
    profile.location ? `ADR:;;${profile.location};;;MX` : '',
    `URL:${cardUrl}`,
    `NOTE:Asesor inmobiliario en Propiedades en Chiapas. ${cardUrl}`,
    'END:VCARD',
  ].filter(Boolean).join('\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${(profile.name || 'asesor').replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ── Redes sociales ────────────────────────────────────────────────────────────
const RRSS = [
  { key: 'instagram', label: 'Instagram', bg: '#E1306C', icon: '📸', prefix: 'https://instagram.com/' },
  { key: 'facebook',  label: 'Facebook',  bg: '#1877F2', icon: '👥', prefix: 'https://facebook.com/' },
  { key: 'tiktok',    label: 'TikTok',    bg: '#010101', icon: '🎵', prefix: 'https://tiktok.com/@' },
  { key: 'linkedin',  label: 'LinkedIn',  bg: '#0A66C2', icon: '💼', prefix: 'https://linkedin.com/in/' },
  { key: 'website',   label: 'Sitio Web', bg: '#6366f1', icon: '🌐', prefix: '' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function DigitalCard({ profile, plan, isPublished = false }) {
  const [propiedades,  setPropiedades]  = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [copied,       setCopied]       = useState(false);
  const [tab,          setTab]          = useState('info'); // 'info' | 'props' | 'qr'

  const cardUrl  = `${window.location.origin}/card/${profile.slug || profile.id || 'usr'}`;
  const qrUrl    = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=1A1A6E&bgcolor=FFFFFF&data=${encodeURIComponent(cardUrl)}`;
  const wa       = (profile.whatsapp || profile.phone || '').replace(/\D/g, '');
  const rrssActivas = RRSS.filter(r => profile[r.key]);

  // ── Cargar propiedades del asesor ────────────────────────────────────────
  useEffect(() => {
    if (!profile.id) { setLoadingProps(false); return; }
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('properties')
          .select('id,title,type,price,price_suffix,operation_type,municipality,featured_image_url,bedrooms,bathrooms,size_m2')
          .eq('user_id', profile.id)
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(6);
        setPropiedades(data || []);
      } catch {
        setPropiedades([]);
      } finally {
        setLoadingProps(false);
      }
    };
    fetch();
  }, [profile.id]);

  // ── Copiar link ──────────────────────────────────────────────────────────
  const copiarLink = () => {
    navigator.clipboard.writeText(cardUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // ── Compartir en WhatsApp ────────────────────────────────────────────────
  const compartirWA = () => {
    const txt = encodeURIComponent(
      `¡Hola! Soy ${profile.name || 'asesor inmobiliario'} en Chiapas 🏠\n` +
      `Mira mi tarjeta digital con mis propiedades:\n${cardUrl}`
    );
    window.open(`https://wa.me/?text=${txt}`, '_blank');
  };

  // ── Compartir en Instagram (copia link) ─────────────────────────────────
  const compartirIG = () => {
    navigator.clipboard.writeText(cardUrl).then(() => {
      alert('✅ Link copiado. Pégalo en tu bio o stories de Instagram.');
    });
  };

  return (
    <>
      <style>{KF}</style>

      {/* ── OG tags dinámicos por asesor ──────────────────────────────────── */}
      {isPublished && (
        <Helmet>
          <title>{profile.name || 'Asesor'} | Tarjeta Digital · Propiedades en Chiapas</title>
          <meta name="description" content={profile.bio || `${profile.name} — ${profile.position || 'Asesor Inmobiliario'} en ${profile.location || 'Chiapas'}. Propiedades activas y contacto directo.`} />

          {/* Open Graph — WhatsApp y Facebook */}
          <meta property="og:title"       content={`${profile.name || 'Asesor'} | ${profile.position || 'Asesor Inmobiliario'}`} />
          <meta property="og:description" content={profile.bio || `Contacta a ${profile.name} en ${profile.company || 'Propiedades en Chiapas'}. ${propiedades.length} propiedades activas.`} />
          <meta property="og:image"       content={profile.avatar_url || 'https://propiedadesenchiapas.com/og-asesores.jpg'} />
          <meta property="og:image:width"  content="400" />
          <meta property="og:image:height" content="400" />
          <meta property="og:type"        content="profile" />
          <meta property="og:url"         content={cardUrl} />
          <meta property="og:site_name"   content="Propiedades en Chiapas" />

          {/* Twitter */}
          <meta name="twitter:card"        content="summary" />
          <meta name="twitter:title"       content={`${profile.name} | Asesor Inmobiliario`} />
          <meta name="twitter:description" content={profile.bio || `Contacta a ${profile.name} directamente.`} />
          <meta name="twitter:image"       content={profile.avatar_url || 'https://propiedadesenchiapas.com/og-asesores.jpg'} />

          <meta name="theme-color" content={MARINO} />
        </Helmet>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TARJETA PRINCIPAL
      ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        width: '100%', maxWidth: 420, margin: '0 auto',
        fontFamily: "'Inter','Segoe UI',sans-serif",
        animation: 'fade-in .5s ease both',
      }}>

        {/* ── HEADER con gradiente marino ──────────────────────────────── */}
        <div style={{
          background: `linear-gradient(135deg, #0D0D4A 0%, ${MARINO} 100%)`,
          borderRadius: '24px 24px 0 0',
          padding: '1.5rem 1.5rem 0',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Patrón sutil */}
          <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.05,pointerEvents:'none' }}>
            <defs><pattern id="dp" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#fff"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#dp)"/>
          </svg>

          {/* Logo + plan */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative', zIndex:1, marginBottom:'1.5rem' }}>
            {profile.logo_url ? (
              <img src={profile.logo_url} alt="Logo" style={{ height:32, maxWidth:130, objectFit:'contain' }}/>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:'.4rem' }}>
                <div style={{ width:28, height:28, borderRadius:7, background:VERDE, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem' }}>🏡</div>
                <span style={{ color:BLANCO, fontWeight:800, fontSize:'.8rem', letterSpacing:'-.01em' }}>
                  Propiedades <span style={{ color:'#34d399' }}>Chiapas</span>
                </span>
              </div>
            )}
            {plan?.name && (
              <span style={{ background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.2)', borderRadius:999, padding:'3px 10px', fontSize:'.65rem', fontWeight:800, color:BLANCO, letterSpacing:'.04em' }}>
                {plan.name?.toUpperCase()}
              </span>
            )}
          </div>

          {/* Foto + nombre (sobresale del header) */}
          <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
            {/* Foto circular */}
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              background: `linear-gradient(135deg, ${VERDE}, #4ade80)`,
              padding: 4, margin: '0 auto',
              boxShadow: `0 0 0 4px rgba(255,255,255,.15), 0 12px 32px rgba(0,0,0,.4)`,
              animation: 'ring-pulse 3s ease infinite',
            }}>
              <img
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'A')}&background=1A1A6E&color=fff&size=200`}
                alt={profile.name}
                style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover', border:`3px solid ${BLANCO}`, display:'block' }}
              />
            </div>

            {/* Nombre y cargo — encima del borde blanco */}
            <div style={{ padding:'1rem 1rem 1.5rem' }}>
              <h1 style={{ color:BLANCO, fontSize:'1.45rem', fontWeight:900, margin:'0 0 .3rem', letterSpacing:'-.02em', lineHeight:1.15 }}>
                {profile.name || 'Tu Nombre'}
              </h1>
              <p style={{ color:'rgba(255,255,255,.75)', fontSize:'.85rem', fontWeight:600, margin:'0 0 .5rem' }}>
                {profile.position || 'Asesor Inmobiliario'}
              </p>
              {profile.location && (
                <p style={{ color:'rgba(255,255,255,.55)', fontSize:'.78rem', margin:0, fontWeight:500 }}>
                  📍 {profile.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── CUERPO BLANCO ─────────────────────────────────────────────── */}
        <div style={{ background:BLANCO, borderRadius:'0 0 24px 24px', boxShadow:'0 20px 60px rgba(0,0,0,.15)', overflow:'hidden' }}>

          {/* Bio */}
          {profile.bio && (
            <div style={{ padding:'1.25rem 1.5rem 0', borderBottom:`1px solid ${GRIS_BD}` }}>
              <p style={{ color:GRIS_T, fontSize:'.85rem', lineHeight:1.65, fontStyle:'italic', margin:0, paddingBottom:'1.25rem' }}>
                "{profile.bio}"
              </p>
            </div>
          )}

          {/* Empresa */}
          {profile.company && (
            <div style={{ padding:'.75rem 1.5rem', borderBottom:`1px solid ${GRIS_BD}`, display:'flex', alignItems:'center', gap:'.6rem' }}>
              <span style={{ fontSize:'1rem' }}>🏢</span>
              <span style={{ fontSize:'.88rem', fontWeight:700, color:NEGRO }}>{profile.company}</span>
              {profile.license && <span style={{ marginLeft:'auto', fontSize:'.72rem', color:GRIS_T, fontWeight:600, background:GRIS_BG, borderRadius:999, padding:'2px 8px' }}>Lic. {profile.license}</span>}
            </div>
          )}

          {/* ── 4 BOTONES DE ACCIÓN ──────────────────────────────────────── */}
          <div style={{ padding:'1.25rem 1.25rem .75rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.65rem' }}>

              {/* WhatsApp */}
              {wa && (
                <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hola ${profile.name || ''}, vi tu tarjeta digital en Propiedades en Chiapas.`)}`}
                  target="_blank" rel="noreferrer"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.85rem', borderRadius:14, background:VERDEWA, color:BLANCO, textDecoration:'none', fontWeight:800, fontSize:'.88rem', boxShadow:'0 4px 12px rgba(37,211,102,.35)', transition:'opacity .2s' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.848L.057 23.743a.75.75 0 0 0 .921.921l5.895-1.465A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 0 1-4.95-1.355l-.355-.213-3.681.915.93-3.594-.233-.371A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
                  WhatsApp
                </a>
              )}

              {/* Llamar */}
              {(profile.phone || profile.whatsapp) && (
                <a href={`tel:${profile.phone || profile.whatsapp}`}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.85rem', borderRadius:14, background:MARINO, color:BLANCO, textDecoration:'none', fontWeight:800, fontSize:'.88rem', boxShadow:`0 4px 12px rgba(26,26,110,.3)`, transition:'opacity .2s' }}>
                  📞 Llamar
                </a>
              )}

              {/* Email */}
              {profile.email && (
                <a href={`mailto:${profile.email}?subject=Consulta desde tu tarjeta digital&body=Hola ${profile.name || ''}, te contacto desde tu tarjeta digital en Propiedades en Chiapas.`}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.85rem', borderRadius:14, background:'#7B3FBE', color:BLANCO, textDecoration:'none', fontWeight:800, fontSize:'.88rem', boxShadow:'0 4px 12px rgba(123,63,190,.3)', transition:'opacity .2s' }}>
                  ✉️ Email
                </a>
              )}

              {/* Guardar contacto */}
              <button onClick={() => descargarVCard(profile)}
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.85rem', borderRadius:14, background:VERDE, color:BLANCO, border:'none', fontWeight:800, fontSize:'.88rem', cursor:'pointer', boxShadow:`0 4px 12px rgba(46,125,50,.3)`, transition:'opacity .2s' }}>
                📥 Guardar
              </button>
            </div>
          </div>

          {/* ── TABS: Info / Propiedades / QR ────────────────────────────── */}
          <div style={{ display:'flex', borderTop:`1px solid ${GRIS_BD}`, borderBottom:`1px solid ${GRIS_BD}`, marginTop:'.5rem' }}>
            {[
              { id:'info',  label:'Información' },
              { id:'props', label:`Propiedades${propiedades.length ? ` (${propiedades.length})` : ''}` },
              { id:'qr',    label:'QR & Compartir' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex:1, padding:'.85rem .5rem', border:'none', background:'none',
                fontWeight: tab===t.id ? 800 : 600,
                fontSize:'.75rem', cursor:'pointer',
                color: tab===t.id ? MARINO : GRIS_T,
                borderBottom: tab===t.id ? `2.5px solid ${MARINO}` : '2.5px solid transparent',
                transition:'all .2s',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB: INFORMACIÓN ─────────────────────────────────────────── */}
          {tab === 'info' && (
            <div style={{ padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'.85rem', animation:'fade-in .3s ease' }}>

              {/* Redes sociales */}
              {rrssActivas.length > 0 && (
                <div>
                  <p style={{ fontSize:'.72rem', fontWeight:800, color:GRIS_T, textTransform:'uppercase', letterSpacing:'.06em', margin:'0 0 .75rem' }}>Redes sociales</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'.6rem' }}>
                    {rrssActivas.map(r => {
                      const val = profile[r.key];
                      const url = r.prefix ? `${r.prefix}${val.replace(/^@/,'')}` : val;
                      return (
                        <a key={r.key} href={url} target="_blank" rel="noreferrer"
                          style={{ display:'flex', alignItems:'center', gap:'.4rem', padding:'.55rem .9rem', borderRadius:10, background:r.bg+'15', border:`1px solid ${r.bg}33`, color:r.bg, fontWeight:700, fontSize:'.8rem', textDecoration:'none', transition:'all .2s' }}>
                          <span>{r.icon}</span> {r.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Links personalizados */}
              {profile.custom_links?.length > 0 && (
                <div>
                  <p style={{ fontSize:'.72rem', fontWeight:800, color:GRIS_T, textTransform:'uppercase', letterSpacing:'.06em', margin:'0 0 .75rem' }}>Links de interés</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
                    {profile.custom_links.map((l, i) => (
                      <a key={i} href={l.url} target="_blank" rel="noreferrer"
                        style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.7rem 1rem', borderRadius:12, background:GRIS_BG, border:`1px solid ${GRIS_BD}`, color:MARINO, fontWeight:700, fontSize:'.85rem', textDecoration:'none' }}>
                        <span>🔗</span> {l.label || l.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Si no hay nada */}
              {rrssActivas.length === 0 && !profile.custom_links?.length && (
                <p style={{ color:GRIS_T, fontSize:'.85rem', textAlign:'center', padding:'1rem 0' }}>
                  Sin redes configuradas aún.
                </p>
              )}
            </div>
          )}

          {/* ── TAB: PROPIEDADES ─────────────────────────────────────────── */}
          {tab === 'props' && (
            <div style={{ padding:'1rem 1rem 1.25rem', animation:'fade-in .3s ease' }}>
              {loadingProps ? (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', gap:'.75rem', color:GRIS_T }}>
                  <div style={{ width:22, height:22, border:`2.5px solid ${GRIS_BD}`, borderTopColor:MARINO, borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
                  <span style={{ fontSize:'.85rem', fontWeight:600 }}>Cargando propiedades...</span>
                </div>
              ) : propiedades.length === 0 ? (
                <div style={{ textAlign:'center', padding:'2rem', color:GRIS_T }}>
                  <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>🏠</div>
                  <p style={{ fontSize:'.85rem', fontWeight:600 }}>Sin propiedades activas aún.</p>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
                  {propiedades.map(p => (
                    <div key={p.id} style={{
                      display:'flex', gap:'.85rem', alignItems:'center',
                      background:GRIS_BG, borderRadius:14, overflow:'hidden',
                      border:`1px solid ${GRIS_BD}`, cursor:'pointer',
                      transition:'box-shadow .2s',
                    }}>
                      {/* Imagen */}
                      <div style={{ width:80, height:74, flexShrink:0, background:`linear-gradient(135deg,${MARINO},#3730a3)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>
                        {p.featured_image_url
                          ? <img src={p.featured_image_url} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                          : '🏠'
                        }
                      </div>
                      {/* Info */}
                      <div style={{ flex:1, padding:'.6rem .75rem .6rem 0', minWidth:0 }}>
                        <p style={{ fontWeight:800, fontSize:'.82rem', color:NEGRO, margin:'0 0 .2rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.title}</p>
                        <p style={{ color:MARINO, fontWeight:900, fontSize:'.88rem', margin:'0 0 .2rem' }}>{FMT(p.price)}</p>
                        <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap' }}>
                          <span style={{ background:`${MARINO}18`, color:MARINO, borderRadius:6, padding:'1px 7px', fontSize:'.68rem', fontWeight:700 }}>{p.operation_type || 'Venta'}</span>
                          {p.municipality && <span style={{ background:`${VERDE}15`, color:VERDE, borderRadius:6, padding:'1px 7px', fontSize:'.68rem', fontWeight:700 }}>📍 {p.municipality}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  <a href="/" style={{ display:'block', textAlign:'center', padding:'.75rem', background:MARINO, color:BLANCO, borderRadius:12, fontWeight:800, fontSize:'.85rem', textDecoration:'none', marginTop:'.25rem' }}>
                    Ver todas las propiedades →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: QR & COMPARTIR ──────────────────────────────────────── */}
          {tab === 'qr' && (
            <div style={{ padding:'1.5rem', textAlign:'center', animation:'fade-in .3s ease' }}>
              {/* QR */}
              <div style={{ display:'inline-block', background:BLANCO, border:`2px solid ${GRIS_BD}`, borderRadius:20, padding:'1rem', boxShadow:'0 4px 20px rgba(0,0,0,.08)', marginBottom:'1rem' }}>
                <img src={qrUrl} alt="QR Code" style={{ width:180, height:180, display:'block', borderRadius:10 }}/>
              </div>
              <p style={{ color:GRIS_T, fontSize:'.8rem', fontWeight:600, marginBottom:'1.25rem', lineHeight:1.5 }}>
                Escanea para abrir esta tarjeta<br/>o comparte el link directamente
              </p>

              {/* Link copiable */}
              <div style={{ display:'flex', alignItems:'center', background:GRIS_BG, border:`1px solid ${GRIS_BD}`, borderRadius:12, padding:'.6rem .75rem', marginBottom:'1rem', gap:'.5rem' }}>
                <span style={{ flex:1, fontSize:'.75rem', color:GRIS_T, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', textAlign:'left' }}>{cardUrl}</span>
                <button onClick={copiarLink} style={{ background: copied ? VERDE : MARINO, color:BLANCO, border:'none', borderRadius:8, padding:'.4rem .85rem', fontSize:'.75rem', fontWeight:800, cursor:'pointer', flexShrink:0, transition:'background .2s' }}>
                  {copied ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>

              {/* Botones compartir */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.65rem' }}>
                <button onClick={compartirWA}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.85rem', borderRadius:14, background:VERDEWA, color:BLANCO, border:'none', fontWeight:800, fontSize:'.85rem', cursor:'pointer', boxShadow:'0 4px 12px rgba(37,211,102,.3)', animation:'pulse-wa 2.5s ease infinite' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.848L.057 23.743a.75.75 0 0 0 .921.921l5.895-1.465A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 0 1-4.95-1.355l-.355-.213-3.681.915.93-3.594-.233-.371A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
                  WhatsApp
                </button>
                <button onClick={compartirIG}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.85rem', borderRadius:14, background:'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color:BLANCO, border:'none', fontWeight:800, fontSize:'.85rem', cursor:'pointer', boxShadow:'0 4px 12px rgba(220,39,67,.3)' }}>
                  📸 Instagram
                </button>
              </div>
              <p style={{ color:GRIS_T, fontSize:'.72rem', marginTop:'.75rem' }}>
                Instagram: copia el link y pégalo en tu bio o stories
              </p>
            </div>
          )}

          {/* Marca de agua */}
          <div style={{ padding:'.75rem', borderTop:`1px solid ${GRIS_BD}`, textAlign:'center' }}>
            <a href="/" style={{ color:GRIS_T, fontSize:'.68rem', fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', textDecoration:'none', opacity:.6 }}>
              PROPIEDADES EN CHIAPAS
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

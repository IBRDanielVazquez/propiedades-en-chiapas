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
const NEGRO   = '#1E293B';

// ── WhatsApp fallback si no hay asesor ────────────────────────────────────────
const WA_FALLBACK = '529612466204';

// ── Keyframes ─────────────────────────────────────────────────────────────────
const KF = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse-wa {
    0%   { box-shadow: 0 0 0 0 rgba(37,211,102,.55); }
    70%  { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
  }
`;

// ── Formateadores ─────────────────────────────────────────────────────────────
const FMT_PRECIO = (n) =>
  n ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
    : 'Precio a consultar';

const FMT_M2 = (n) => (n ? `${Number(n).toLocaleString('es-MX')} m²` : '—');

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function PropertyDetail({ propertyId }) {
  const [property,    setProperty]    = useState(null);
  const [agent,       setAgent]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [notFound,    setNotFound]    = useState(false);
  const [activeImg,   setActiveImg]   = useState(0);
  const [copied,      setCopied]      = useState(false);
  const [showAllAmen, setShowAllAmen] = useState(false);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  // ── Cargar propiedad y asesor ────────────────────────────────────────────
  useEffect(() => {
    if (!propertyId) { setNotFound(true); setLoading(false); return; }

    const fetchData = async () => {
      try {
        // 1. Buscar propiedad
        const { data: prop, error: propError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .eq('active', true)
          .single();

        if (propError || !prop) { setNotFound(true); setLoading(false); return; }
        setProperty(prop);

        // Registrar vista (fire-and-forget)
        supabase.from('properties').update({ views: (prop.views || 0) + 1 }).eq('id', prop.id).then(() => {});

        // 2. Buscar asesor
        if (prop.user_id) {
          const { data: agentData } = await supabase
            .from('users')
            .select('id,name,email,phone,whatsapp,position,company,bio,avatar_url,slug')
            .eq('id', prop.user_id)
            .eq('active', true)
            .single();
          setAgent(agentData || null);
        }
      } catch (err) {
        console.error('Error cargando propiedad:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyId]);

  // ── Todas las imágenes (featured + gallery) ─────────────────────────────
  const allImages = property
    ? [
        property.featured_image_url,
        ...(Array.isArray(property.images) ? property.images : []),
      ].filter(Boolean)
    : [];

  // ── WhatsApp ─────────────────────────────────────────────────────────────
  const waNumber = agent
    ? (agent.whatsapp || agent.phone || '').replace(/\D/g, '')
    : WA_FALLBACK;

  const waMensaje = encodeURIComponent(
    `Hola, me interesa ${property?.title || 'esta propiedad'} que vi en Propiedades en Chiapas.\n${pageUrl}`
  );

  const compartirWA = () =>
    window.open(`https://wa.me/${waNumber}?text=${waMensaje}`, '_blank');

  const compartirFB = () =>
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank');

  const copiarLink = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const volver = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  };

  // ─────────────────────────────────────────────────────────────────────────
  // ESTADOS DE CARGA
  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{KF}</style>
        <div style={{ minHeight:'100vh', background:GRIS_BG, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem' }}>
          <div style={{ width:40, height:40, border:`3px solid ${GRIS_BD}`, borderTopColor:MARINO, borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
          <p style={{ color:GRIS_T, fontWeight:600, fontSize:'.95rem', fontFamily:'Inter,sans-serif' }}>Cargando propiedad...</p>
        </div>
      </>
    );
  }

  if (notFound || !property) {
    return (
      <>
        <style>{KF}</style>
        <div style={{ minHeight:'100vh', background:GRIS_BG, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', textAlign:'center', fontFamily:'Inter,sans-serif' }}>
          <div>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>🏚️</div>
            <h1 style={{ color:NEGRO, fontSize:'1.6rem', fontWeight:800, margin:'0 0 .5rem' }}>Propiedad no encontrada</h1>
            <p style={{ color:GRIS_T, marginBottom:'1.5rem' }}>Es posible que ya no esté disponible o el enlace sea incorrecto.</p>
            <button onClick={volver} style={{ padding:'.75rem 2rem', background:MARINO, color:BLANCO, border:'none', borderRadius:12, fontWeight:800, fontSize:'.95rem', cursor:'pointer' }}>
              ← Volver al portal
            </button>
          </div>
        </div>
      </>
    );
  }

  const amenities = Array.isArray(property.amenities) ? property.amenities : [];
  const amenMostrar = showAllAmen ? amenities : amenities.slice(0, 8);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER PRINCIPAL
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{KF}</style>

      {/* ── OG Tags dinámicos ──────────────────────────────────────────── */}
      <Helmet>
        <title>{property.title} | Propiedades en Chiapas</title>
        <meta name="description" content={property.description?.slice(0, 155) || `${property.type} en ${property.municipality}, Chiapas. ${FMT_PRECIO(property.price)}`} />

        <meta property="og:title"       content={`${property.title} — ${FMT_PRECIO(property.price)}`} />
        <meta property="og:description" content={`${property.type} en ${property.municipality}, Chiapas. ${property.bedrooms ? `${property.bedrooms} recámaras · ` : ''}${FMT_PRECIO(property.price)}`} />
        <meta property="og:image"       content={property.featured_image_url || 'https://propiedadesenchiapas.com/og-default.jpg'} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={pageUrl} />
        <meta property="og:site_name"   content="Propiedades en Chiapas" />

        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={property.title} />
        <meta name="twitter:description" content={`${FMT_PRECIO(property.price)} · ${property.municipality}, Chiapas`} />
        <meta name="twitter:image"       content={property.featured_image_url || 'https://propiedadesenchiapas.com/og-default.jpg'} />

        <meta name="theme-color" content={MARINO} />
      </Helmet>

      <div style={{ minHeight:'100vh', background:GRIS_BG, fontFamily:"'Inter','Segoe UI',sans-serif", animation:'fade-in .4s ease' }}>

        {/* ════════════════════════════════════════════════════════════════
            BARRA SUPERIOR STICKY
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ position:'sticky', top:0, zIndex:100, background:BLANCO, borderBottom:`1px solid ${GRIS_BD}`, boxShadow:'0 1px 12px rgba(0,0,0,.06)' }}>
          <div style={{ maxWidth:900, margin:'0 auto', padding:'.75rem 1rem', display:'flex', alignItems:'center', gap:'.75rem' }}>
            {/* Botón volver */}
            <button onClick={volver} style={{ display:'flex', alignItems:'center', gap:'.4rem', background:GRIS_BG, border:`1px solid ${GRIS_BD}`, borderRadius:10, padding:'.5rem .9rem', fontWeight:700, fontSize:'.82rem', color:NEGRO, cursor:'pointer', flexShrink:0 }}>
              ← Volver
            </button>

            {/* Título truncado */}
            <p style={{ flex:1, fontWeight:700, fontSize:'.88rem', color:NEGRO, margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {property.title}
            </p>

            {/* Botones compartir */}
            <div style={{ display:'flex', gap:'.5rem', flexShrink:0 }}>
              <button onClick={copiarLink} title="Copiar link" style={{ width:36, height:36, borderRadius:9, background: copied ? VERDE : GRIS_BG, border:`1px solid ${GRIS_BD}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem', transition:'background .2s' }}>
                {copied ? '✓' : '🔗'}
              </button>
              <button onClick={compartirWA} title="Compartir WhatsApp" style={{ width:36, height:36, borderRadius:9, background:VERDEWA, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.848L.057 23.743a.75.75 0 0 0 .921.921l5.895-1.465A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 0 1-4.95-1.355l-.355-.213-3.681.915.93-3.594-.233-.371A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
              </button>
              <button onClick={compartirFB} title="Compartir Facebook" style={{ width:36, height:36, borderRadius:9, background:'#1877F2', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem', color:BLANCO, fontWeight:900 }}>
                f
              </button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            CONTENIDO CENTRAL
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ maxWidth:900, margin:'0 auto', padding:'0 0 6rem' }}>

          {/* ── GALERÍA DE IMÁGENES ────────────────────────────────────── */}
          <div style={{ background:NEGRO, position:'relative' }}>
            {/* Imagen principal */}
            <div style={{ width:'100%', aspectRatio:'16/9', maxHeight:480, overflow:'hidden', position:'relative' }}>
              {allImages.length > 0 ? (
                <img
                  key={activeImg}
                  src={allImages[activeImg]}
                  alt={`${property.title} — foto ${activeImg + 1}`}
                  style={{ width:'100%', height:'100%', objectFit:'cover', animation:'fade-in .35s ease' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=900'; }}
                />
              ) : (
                <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, #0D0D4A, ${MARINO})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem' }}>🏠</div>
              )}

              {/* Badge operación */}
              <div style={{ position:'absolute', top:12, left:12, background: property.operation_type === 'Renta' ? '#0284c7' : VERDE, color:BLANCO, borderRadius:8, padding:'5px 12px', fontSize:'.8rem', fontWeight:800, boxShadow:'0 2px 8px rgba(0,0,0,.3)' }}>
                {property.operation_type || 'Venta'}
              </div>

              {/* Contador fotos */}
              {allImages.length > 1 && (
                <div style={{ position:'absolute', bottom:12, right:12, background:'rgba(0,0,0,.6)', color:BLANCO, borderRadius:8, padding:'4px 10px', fontSize:'.78rem', fontWeight:700, backdropFilter:'blur(4px)' }}>
                  📷 {activeImg + 1} / {allImages.length}
                </div>
              )}

              {/* Flechas navegación */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => (i - 1 + allImages.length) % allImages.length)}
                    style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,.5)', color:BLANCO, border:'none', width:38, height:38, borderRadius:'50%', fontSize:'1.1rem', cursor:'pointer', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center' }}
                  >‹</button>
                  <button
                    onClick={() => setActiveImg(i => (i + 1) % allImages.length)}
                    style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,.5)', color:BLANCO, border:'none', width:38, height:38, borderRadius:'50%', fontSize:'1.1rem', cursor:'pointer', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center' }}
                  >›</button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {allImages.length > 1 && (
              <div style={{ display:'flex', gap:6, padding:'8px 10px', overflowX:'auto', background:'rgba(0,0,0,.4)', scrollbarWidth:'none' }}>
                {allImages.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{ flexShrink:0, width:60, height:44, borderRadius:6, overflow:'hidden', cursor:'pointer', border: i === activeImg ? `2.5px solid ${VERDEWA}` : '2.5px solid transparent', transition:'border-color .2s', opacity: i === activeImg ? 1 : .65 }}
                  >
                    <img src={img} alt={`miniatura ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=120'; }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── TÍTULO + PRECIO ────────────────────────────────────────── */}
          <div style={{ padding:'1.5rem 1.25rem 1rem', background:BLANCO, borderBottom:`1px solid ${GRIS_BD}` }}>
            <h1 style={{ fontSize:'1.5rem', fontWeight:900, color:NEGRO, margin:'0 0 .5rem', lineHeight:1.2 }}>
              {property.title}
            </h1>
            <p style={{ color:GRIS_T, fontSize:'.9rem', margin:'0 0 1rem' }}>
              📍 {[property.colony, property.municipality].filter(Boolean).join(', ')}{property.municipality ? ', Chiapas' : ''}
            </p>
            <div style={{ display:'flex', alignItems:'baseline', gap:'.75rem', flexWrap:'wrap' }}>
              <span style={{ fontSize:'2rem', fontWeight:900, color:MARINO, lineHeight:1 }}>
                {FMT_PRECIO(property.price)}
              </span>
              {property.price_suffix && (
                <span style={{ color:GRIS_T, fontSize:'.88rem', fontWeight:600 }}>{property.price_suffix}</span>
              )}
            </div>
          </div>

          {/* ── SPECS RÁPIDOS ──────────────────────────────────────────── */}
          {(property.bedrooms || property.bathrooms || property.garages || property.size_m2 || property.size_construction_m2 || property.size_land_m2) && (
            <div style={{ background:BLANCO, borderBottom:`1px solid ${GRIS_BD}`, padding:'1rem 1.25rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(80px, 1fr))', gap:'.75rem' }}>
                {property.bedrooms > 0 && <SpecChip icon="🛏️" valor={property.bedrooms} label="Recámaras" />}
                {property.bathrooms > 0 && <SpecChip icon="🚿" valor={property.bathrooms} label="Baños" />}
                {property.garages > 0  && <SpecChip icon="🚗" valor={property.garages}   label="Cajones" />}
                {(property.size_construction_m2 || property.size_m2) && (
                  <SpecChip icon="📐" valor={FMT_M2(property.size_construction_m2 || property.size_m2)} label="Construcción" />
                )}
                {property.size_land_m2 && (
                  <SpecChip icon="🗺️" valor={FMT_M2(property.size_land_m2)} label="Terreno" />
                )}
                {property.floors > 1 && <SpecChip icon="🏗️" valor={property.floors} label="Pisos" />}
              </div>
            </div>
          )}

          {/* ── DESCRIPCIÓN ────────────────────────────────────────────── */}
          {property.description && (
            <div style={{ background:BLANCO, borderBottom:`1px solid ${GRIS_BD}`, padding:'1.5rem 1.25rem' }}>
              <h2 style={{ fontSize:'1.05rem', fontWeight:800, color:NEGRO, margin:'0 0 .85rem', paddingBottom:'.5rem', borderBottom:`2px solid ${GRIS_BD}` }}>
                Descripción
              </h2>
              <p style={{ color:GRIS_T, lineHeight:1.75, fontSize:'.92rem', whiteSpace:'pre-wrap', margin:0 }}>
                {property.description}
              </p>
            </div>
          )}

          {/* ── FICHA TÉCNICA DETALLADA ─────────────────────────────────── */}
          <div style={{ background:BLANCO, borderBottom:`1px solid ${GRIS_BD}`, padding:'1.5rem 1.25rem' }}>
            <h2 style={{ fontSize:'1.05rem', fontWeight:800, color:NEGRO, margin:'0 0 1rem', paddingBottom:'.5rem', borderBottom:`2px solid ${GRIS_BD}` }}>
              Ficha Técnica
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'.5rem' }}>
              {[
                { label:'Tipo de propiedad', valor: property.type },
                { label:'Operación',         valor: property.operation_type },
                { label:'Estado',            valor: property.status },
                { label:'Municipio',         valor: property.municipality },
                { label:'Colonia/Zona',      valor: property.colony },
                { label:'Código postal',     valor: property.postal_code },
                { label:'Año de construcción', valor: property.year_built },
                { label:'Amueblado',         valor: property.furnished ? 'Sí' : property.furnished === false ? 'No' : null },
                { label:'Cuarto de servicio', valor: property.maid_room ? 'Sí' : property.maid_room === false ? 'No' : null },
              ].filter(row => row.valor).map(row => (
                <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'.5rem .75rem', background:GRIS_BG, borderRadius:8, fontSize:'.85rem' }}>
                  <span style={{ color:GRIS_T, fontWeight:600 }}>{row.label}</span>
                  <span style={{ color:NEGRO, fontWeight:700 }}>{row.valor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── AMENIDADES ─────────────────────────────────────────────── */}
          {amenities.length > 0 && (
            <div style={{ background:BLANCO, borderBottom:`1px solid ${GRIS_BD}`, padding:'1.5rem 1.25rem' }}>
              <h2 style={{ fontSize:'1.05rem', fontWeight:800, color:NEGRO, margin:'0 0 1rem', paddingBottom:'.5rem', borderBottom:`2px solid ${GRIS_BD}` }}>
                Amenidades
              </h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem' }}>
                {amenMostrar.map(am => (
                  <span key={am} style={{ background:`${VERDE}14`, border:`1px solid ${VERDE}33`, color:VERDE, borderRadius:8, padding:'5px 12px', fontSize:'.82rem', fontWeight:700 }}>
                    ✓ {am}
                  </span>
                ))}
              </div>
              {amenities.length > 8 && (
                <button onClick={() => setShowAllAmen(v => !v)} style={{ marginTop:'.75rem', background:'none', border:`1px solid ${GRIS_BD}`, borderRadius:8, padding:'.45rem 1rem', fontSize:'.82rem', fontWeight:700, color:MARINO, cursor:'pointer' }}>
                  {showAllAmen ? 'Ver menos ↑' : `Ver todas (${amenities.length}) ↓`}
                </button>
              )}
            </div>
          )}

          {/* ── MUNICIPIO (mapa referencial) ────────────────────────────── */}
          {property.municipality && (
            <div style={{ background:BLANCO, borderBottom:`1px solid ${GRIS_BD}`, padding:'1.5rem 1.25rem' }}>
              <h2 style={{ fontSize:'1.05rem', fontWeight:800, color:NEGRO, margin:'0 0 .75rem', paddingBottom:'.5rem', borderBottom:`2px solid ${GRIS_BD}` }}>
                Ubicación
              </h2>
              <div style={{ background:GRIS_BG, border:`1px solid ${GRIS_BD}`, borderRadius:12, padding:'1rem', display:'flex', alignItems:'center', gap:'1rem', marginBottom:'.75rem' }}>
                <div style={{ width:48, height:48, background:`linear-gradient(135deg,${MARINO},#3730a3)`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>📍</div>
                <div>
                  <p style={{ fontWeight:800, color:NEGRO, margin:0, fontSize:'.95rem' }}>{property.municipality}, Chiapas</p>
                  {property.colony && <p style={{ color:GRIS_T, margin:'2px 0 0', fontSize:'.85rem' }}>{property.colony}</p>}
                </div>
              </div>
              {/* Iframe de mapa por municipio */}
              <div style={{ borderRadius:12, overflow:'hidden', border:`1px solid ${GRIS_BD}`, height:240 }}>
                <iframe
                  title={`Mapa ${property.municipality}`}
                  width="100%"
                  height="240"
                  style={{ border:'none', display:'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${property.municipality}, Chiapas, México`)}&output=embed&zoom=11`}
                />
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              TARJETA DEL ASESOR
          ════════════════════════════════════════════════════════════ */}
          <div style={{ margin:'0', background:BLANCO, borderBottom:`1px solid ${GRIS_BD}`, padding:'1.5rem 1.25rem' }}>
            <h2 style={{ fontSize:'1.05rem', fontWeight:800, color:NEGRO, margin:'0 0 1rem', paddingBottom:'.5rem', borderBottom:`2px solid ${GRIS_BD}` }}>
              Contactar al Asesor
            </h2>

            <div style={{ display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1.25rem' }}>
              {/* Foto asesor */}
              <div style={{ width:64, height:64, borderRadius:'50%', border:`3px solid ${VERDE}`, flexShrink:0, overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,.12)' }}>
                {agent?.avatar_url ? (
                  <img src={agent.avatar_url} alt={agent.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                ) : (
                  <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${MARINO},#3730a3)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem' }}>
                    👤
                  </div>
                )}
              </div>

              {/* Datos */}
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontWeight:900, color:NEGRO, margin:'0 0 .2rem', fontSize:'1rem' }}>
                  {agent?.name || 'Asesor Propiedades en Chiapas'}
                </p>
                <p style={{ color:GRIS_T, margin:'0 0 .2rem', fontSize:'.85rem', fontWeight:600 }}>
                  {agent?.position || 'Asesor Inmobiliario'}
                </p>
                {agent?.company && (
                  <p style={{ color:MARINO, margin:0, fontSize:'.82rem', fontWeight:700 }}>🏢 {agent.company}</p>
                )}
              </div>
            </div>

            {/* Bio del asesor */}
            {agent?.bio && (
              <p style={{ color:GRIS_T, fontSize:'.85rem', lineHeight:1.65, fontStyle:'italic', margin:'0 0 1.25rem', padding:'.75rem 1rem', background:GRIS_BG, borderRadius:10, borderLeft:`3px solid ${VERDE}` }}>
                "{agent.bio}"
              </p>
            )}

            {/* Botones de contacto */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.65rem' }}>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${waNumber}?text=${waMensaje}`}
                target="_blank" rel="noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.9rem', borderRadius:14, background:VERDEWA, color:BLANCO, textDecoration:'none', fontWeight:800, fontSize:'.9rem', boxShadow:'0 4px 14px rgba(37,211,102,.35)', animation:'pulse-wa 2.5s ease infinite' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.848L.057 23.743a.75.75 0 0 0 .921.921l5.895-1.465A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 0 1-4.95-1.355l-.355-.213-3.681.915.93-3.594-.233-.371A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
                WhatsApp
              </a>

              {/* Llamar */}
              {(agent?.phone || agent?.whatsapp) && (
                <a href={`tel:${agent.phone || agent.whatsapp}`}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.9rem', borderRadius:14, background:MARINO, color:BLANCO, textDecoration:'none', fontWeight:800, fontSize:'.9rem', boxShadow:`0 4px 14px rgba(26,26,110,.3)` }}>
                  📞 Llamar
                </a>
              )}

              {/* Email */}
              {agent?.email && (
                <a href={`mailto:${agent.email}?subject=Consulta sobre ${property.title}&body=Hola, me interesa ${property.title}. ${pageUrl}`}
                  style={{ gridColumn: agent?.phone || agent?.whatsapp ? 'auto' : 'span 2', display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.9rem', borderRadius:14, background:'#7B3FBE', color:BLANCO, textDecoration:'none', fontWeight:800, fontSize:'.9rem', boxShadow:'0 4px 14px rgba(123,63,190,.3)' }}>
                  ✉️ Enviar email
                </a>
              )}

              {/* Ver tarjeta digital */}
              {agent?.slug && (
                <a href={`/card/${agent.slug}`}
                  style={{ gridColumn:'span 2', display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.75rem', borderRadius:14, background:GRIS_BG, border:`1px solid ${GRIS_BD}`, color:MARINO, textDecoration:'none', fontWeight:700, fontSize:'.85rem' }}>
                  👤 Ver perfil completo del asesor →
                </a>
              )}
            </div>
          </div>

          {/* ── BOTONES COMPARTIR (bottom) ───────────────────────────────── */}
          <div style={{ background:BLANCO, padding:'1.25rem 1.25rem 2rem' }}>
            <h2 style={{ fontSize:'.88rem', fontWeight:800, color:GRIS_T, textTransform:'uppercase', letterSpacing:'.06em', margin:'0 0 .85rem' }}>Compartir propiedad</h2>
            <div style={{ display:'flex', gap:'.65rem', flexWrap:'wrap' }}>
              <button onClick={compartirWA}
                style={{ flex:1, minWidth:140, display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.85rem', borderRadius:12, background:VERDEWA, color:BLANCO, border:'none', fontWeight:800, fontSize:'.88rem', cursor:'pointer' }}>
                💬 WhatsApp
              </button>
              <button onClick={compartirFB}
                style={{ flex:1, minWidth:140, display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.85rem', borderRadius:12, background:'#1877F2', color:BLANCO, border:'none', fontWeight:800, fontSize:'.88rem', cursor:'pointer' }}>
                👥 Facebook
              </button>
              <button onClick={() => window.print()}
                style={{ flex:1, minWidth:140, display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem', padding:'.85rem', borderRadius:12, background:GRIS_BG, color:NEGRO, border:`1px solid ${GRIS_BD}`, fontWeight:800, fontSize:'.88rem', cursor:'pointer' }}>
                🖨️ Imprimir
              </button>
            </div>
          </div>

        </div>{/* /contenido central */}

        {/* ── BOTÓN FLOTANTE WHATSAPP ─────────────────────────────────── */}
        <a
          href={`https://wa.me/${waNumber}?text=${waMensaje}`}
          target="_blank" rel="noreferrer"
          style={{
            position:'fixed', bottom:24, right:20, zIndex:999,
            width:58, height:58, borderRadius:'50%',
            background:VERDEWA, color:BLANCO,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 6px 24px rgba(37,211,102,.5)',
            animation:'pulse-wa 2.5s ease infinite',
            textDecoration:'none', fontSize:'1.5rem',
          }}
          title="Consultar por WhatsApp"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.848L.057 23.743a.75.75 0 0 0 .921.921l5.895-1.465A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 0 1-4.95-1.355l-.355-.213-3.681.915.93-3.594-.233-.371A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
        </a>

      </div>{/* /container */}
    </>
  );
}

// ── Chip de especificación ────────────────────────────────────────────────────
function SpecChip({ icon, valor, label }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.25rem', background:GRIS_BG, border:`1px solid ${GRIS_BD}`, borderRadius:12, padding:'.7rem .5rem', textAlign:'center' }}>
      <span style={{ fontSize:'1.3rem', lineHeight:1 }}>{icon}</span>
      <span style={{ fontWeight:900, color:NEGRO, fontSize:'.95rem' }}>{valor}</span>
      <span style={{ color:GRIS_T, fontSize:'.7rem', fontWeight:600 }}>{label}</span>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../supabaseClient';
import { SAMPLE_PROPERTIES } from '../data/sampleData';
import chiapasData from '../data/chiapasLocations.json';
import PropertyCard from './PropertyCard';
import Navbar from './Navbar';

// ── Constantes ────────────────────────────────────────────────────────────────
const MUNICIPALITIES = Object.keys(chiapasData).sort();

const TIPOS = [
  'Casa', 'Departamento', 'Terreno', 'Lote Residencial',
  'Local Comercial', 'Bodega', 'Oficina', 'Rancho',
  'Quinta', 'Nave Industrial', 'Edificio', 'Desarrollo',
];

const CATEGORIAS = [
  { nombre: 'Casas',        filtro: 'casa',          emoji: '🏠' },
  { nombre: 'Departamentos',filtro: 'departamento',   emoji: '🏢' },
  { nombre: 'Terrenos',     filtro: 'terreno',        emoji: '🌿' },
  { nombre: 'Locales',      filtro: 'local comercial',emoji: '🏪' },
  { nombre: 'Bodegas',      filtro: 'bodega',         emoji: '🏭' },
  { nombre: 'Ranchos',      filtro: 'rancho',         emoji: '🐄' },
  { nombre: 'Quintas',      filtro: 'quinta',         emoji: '🌳' },
  { nombre: 'Oficinas',     filtro: 'oficina',        emoji: '💼' },
];

const PRECIOS = [
  { label: 'Hasta $500K',  max: 500000 },
  { label: 'Hasta $1M',    max: 1000000 },
  { label: 'Hasta $2M',    max: 2000000 },
  { label: 'Hasta $5M',    max: 5000000 },
  { label: 'Más de $5M',   max: 99999999 },
];

const FMT = (n) => new Intl.NumberFormat('es-MX', {
  style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
}).format(n);

// ── Keyframes ─────────────────────────────────────────────────────────────────
const KF = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-wa {
    0%   { box-shadow: 0 0 0 0 rgba(37,211,102,.6); }
    70%  { box-shadow: 0 0 0 16px rgba(37,211,102,0); }
    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
  }
  @keyframes count-up {
    from { opacity: 0; transform: scale(.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @media (max-width: 768px) {
    .home-hero-title { font-size: 2rem !important; }
    .search-box      { flex-direction: column !important; border-radius: 16px !important; }
    .search-btn      { border-radius: 12px !important; width: 100% !important; }
    .stats-row       { grid-template-columns: 1fr 1fr !important; }
    .cats-row        { grid-template-columns: repeat(4,1fr) !important; }
    .props-grid      { grid-template-columns: 1fr !important; }
    .cta-row         { flex-direction: column !important; text-align: center !important; }
  }
`;

// ── Componente principal ──────────────────────────────────────────────────────
export default function Home({ session }) {
  // Búsqueda
  const [busqueda,  setBusqueda]  = useState('');
  const [tipo,      setTipo]      = useState('');
  const [municipio, setMunicipio] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  // Datos
  const [propiedades, setPropiedades] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [stats,       setStats]       = useState({ propiedades: 0, municipios: 0, asesores: 0 });
  const [statsLoad,   setStatsLoad]   = useState(true);

  // UI
  const [categoriaActiva, setCategoriaActiva] = useState('');
  const [buscando,        setBuscando]        = useState(false);
  const [resultados,      setResultados]      = useState(null); // null = sin búsqueda activa
  const [selectedProperty, setSelectedProperty] = useState(null);

  // ── Cargar stats en vivo ────────────────────────────────────────────────────
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [rProps, rAsesores] = await Promise.all([
          supabase.from('properties').select('municipality', { count: 'exact' }).eq('active', true)
            .not('title', 'ilike', '%Premium en %')
            .not('title', 'ilike', 'Residencia Casa Premier%')
            .not('title', 'ilike', 'Fraccionamiento Master%')
            .not('title', 'ilike', 'Lotes de Inversión Premium%')
            .not('title', 'ilike', 'Lote Comercial Estratégico%'),
          supabase.from('users').select('id', { count: 'exact' }).eq('active', true),
        ]);

        const totalProps  = rProps.count  || 0;
        const totalAsesores = rAsesores.count || 0;
        const munis = new Set((rProps.data || []).map(p => p.municipality).filter(Boolean));

        setStats({ propiedades: totalProps, municipios: munis.size, asesores: totalAsesores });
      } catch {
        setStats({ propiedades: 120, municipios: 18, asesores: 45 });
      } finally {
        setStatsLoad(false);
      }
    };
    fetchStats();
  }, []);

  // ── Cargar 6 propiedades destacadas ────────────────────────────────────────
  useEffect(() => {
    const fetchPropiedades = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('active', true)
          .not('title', 'ilike', '%Premium en %')
          .not('title', 'ilike', 'Residencia Casa Premier%')
          .not('title', 'ilike', 'Fraccionamiento Master%')
          .not('title', 'ilike', 'Lotes de Inversión Premium%')
          .not('title', 'ilike', 'Lote Comercial Estratégico%')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        setPropiedades(data || []);
      } catch {
        setPropiedades([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPropiedades();
  }, []);

  // ── Buscar con filtros ──────────────────────────────────────────────────────
  const buscar = useCallback(async () => {
    setBuscando(true);
    try {
      let query = supabase.from('properties').select('*').eq('active', true)
        .not('title', 'ilike', '%Premium en %')
        .not('title', 'ilike', 'Residencia Casa Premier%')
        .not('title', 'ilike', 'Fraccionamiento Master%')
        .not('title', 'ilike', 'Lotes de Inversión Premium%')
        .not('title', 'ilike', 'Lote Comercial Estratégico%');

      if (busqueda.trim()) {
        query = query.or(
          `title.ilike.%${busqueda}%,municipality.ilike.%${busqueda}%,colony.ilike.%${busqueda}%`
        );
      }
      if (tipo)      query = query.ilike('type', `%${tipo}%`);
      if (municipio) query = query.eq('municipality', municipio);
      if (precioMax) query = query.lte('price', parseFloat(precioMax));

      query = query.order('created_at', { ascending: false }).limit(24);

      const { data, error } = await query;
      if (error) throw error;

      // Fallback a sample data con filtros locales
      const lista = data?.length
        ? data
        : [];

      setResultados(lista);
    } catch {
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  }, [busqueda, tipo, municipio, precioMax]);

  // Buscar al seleccionar categoría
  const seleccionarCategoria = (filtro) => {
    const nuevo = categoriaActiva === filtro ? '' : filtro;
    setCategoriaActiva(nuevo);
    setTipo(nuevo);
    // Disparar búsqueda con el nuevo tipo
    setTimeout(() => buscar(), 0);
  };

  const limpiarBusqueda = () => {
    setBusqueda(''); setTipo(''); setMunicipio(''); setPrecioMax('');
    setCategoriaActiva(''); setResultados(null);
  };

  const propsMostradas = resultados ?? propiedades;
  const hayBusqueda = busqueda || tipo || municipio || precioMax;

  return (
    <>
      <style>{KF}</style>

      {/* ── OG / SEO ─────────────────────────────────────────────────────── */}
      <Helmet>
        <title>Propiedades en Chiapas — Casas, Terrenos y Más</title>
        <meta name="description" content="Encuentra casas, terrenos, departamentos y locales comerciales en Chiapas. Más de 100 propiedades activas. Portal inmobiliario #1 en Chiapas." />
        <meta property="og:title" content="Propiedades en Chiapas — Casas, Terrenos y Más" />
        <meta property="og:description" content="Portal inmobiliario #1 en Chiapas. Casas, terrenos, departamentos y más. Busca y contacta directamente al asesor." />
        <meta property="og:image" content="https://propiedadesenchiapas.com/og-portal.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://propiedadesenchiapas.com" />
        <meta property="og:site_name" content="Propiedades en Chiapas" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Propiedades en Chiapas" />
        <meta name="twitter:description" content="Portal inmobiliario #1. Casas, terrenos, departamentos en todo Chiapas." />
        <meta name="twitter:image" content="https://propiedadesenchiapas.com/og-portal.jpg" />
        <meta name="theme-color" content="#0D0D4A" />
      </Helmet>

      <div style={{ fontFamily:"'Inter','Segoe UI',sans-serif", color:'#1e293b', background:'#fff', overflowX:'hidden' }}>

        <Navbar session={session} />

        {/* ══════════════════════════════════════════════════════════════
            HERO FULLSCREEN
        ══════════════════════════════════════════════════════════════ */}
        <section style={{
          background:'linear-gradient(135deg,#0D0D4A 0%,#1A1A6E 60%,#2a2a8a 100%)',
          minHeight:'100vh', display:'flex', alignItems:'center',
          justifyContent:'center', position:'relative', overflow:'hidden',
          padding:'7rem 1.5rem 5rem',
        }}>
          {/* Orbes decorativos */}
          <div style={{ position:'absolute',top:'-120px',right:'-120px',width:'550px',height:'550px',borderRadius:'50%',background:'rgba(46,125,50,.07)',pointerEvents:'none' }}/>
          <div style={{ position:'absolute',bottom:'-80px',left:'-80px',width:'400px',height:'400px',borderRadius:'50%',background:'rgba(201,168,76,.05)',pointerEvents:'none' }}/>
          {/* Patrón puntos */}
          <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.04,pointerEvents:'none' }}>
            <defs>
              <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#fff"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </svg>

          <div style={{ maxWidth:860, width:'100%', position:'relative', zIndex:1, textAlign:'center', animation:'fadeUp .7s ease both' }}>
            {/* Badge */}
            <div style={{ display:'inline-flex',alignItems:'center',gap:'.5rem',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:999,padding:'.4rem 1.1rem',marginBottom:'1.75rem' }}>
              <span style={{ width:8,height:8,borderRadius:'50%',background:'#4ade80',display:'inline-block',boxShadow:'0 0 6px #4ade80' }}/>
              <span style={{ color:'rgba(255,255,255,.85)',fontSize:'.78rem',fontWeight:700,letterSpacing:'.05em',textTransform:'uppercase' }}>Portal #1 de propiedades en Chiapas</span>
            </div>

            {/* Título */}
            <h1 className="home-hero-title" style={{ color:'#fff',fontSize:'clamp(2.2rem,5vw,3.5rem)',fontWeight:900,lineHeight:1.08,letterSpacing:'-.03em',margin:'0 0 1rem' }}>
              Encuentra tu propiedad ideal<br/>
              <span style={{ color:'#34d399' }}>en cualquier rincón de Chiapas</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,.65)',fontSize:'1.05rem',lineHeight:1.65,maxWidth:540,margin:'0 auto 2.5rem' }}>
              Casas, terrenos, locales y más. Más de {stats.propiedades || '100'} propiedades activas en {stats.municipios || '18'} municipios.
            </p>

            {/* ── BUSCADOR ── */}
            <div className="search-box" style={{
              display:'flex', background:'#fff', borderRadius:18,
              boxShadow:'0 20px 60px rgba(0,0,0,.35)',
              overflow:'hidden', maxWidth:780, margin:'0 auto',
            }}>
              {/* Texto libre */}
              <div style={{ flex:2, display:'flex', alignItems:'center', gap:'.5rem', padding:'.9rem 1.25rem', borderRight:'1px solid #f1f5f9' }}>
                <span style={{ fontSize:'1.1rem', flexShrink:0 }}>🔍</span>
                <input
                  type="text" placeholder="Colonia, municipio o tipo..."
                  value={busqueda} onChange={e => setBusqueda(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && buscar()}
                  style={{ border:'none',outline:'none',width:'100%',fontSize:'.95rem',color:'#1e293b',fontWeight:500,background:'transparent' }}
                />
              </div>

              {/* Municipio */}
              <div style={{ flex:1.2, borderRight:'1px solid #f1f5f9' }}>
                <select value={municipio} onChange={e => setMunicipio(e.target.value)}
                  style={{ width:'100%',height:'100%',border:'none',outline:'none',padding:'.9rem 1rem',fontSize:'.88rem',color: municipio ? '#1e293b' : '#9ca3af',fontWeight:600,background:'transparent',cursor:'pointer' }}>
                  <option value="">📍 Municipio</option>
                  {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Precio */}
              <div style={{ flex:1, borderRight:'1px solid #f1f5f9' }}>
                <select value={precioMax} onChange={e => setPrecioMax(e.target.value)}
                  style={{ width:'100%',height:'100%',border:'none',outline:'none',padding:'.9rem 1rem',fontSize:'.88rem',color: precioMax ? '#1e293b' : '#9ca3af',fontWeight:600,background:'transparent',cursor:'pointer' }}>
                  <option value="">💰 Precio</option>
                  {PRECIOS.map(p => <option key={p.max} value={p.max}>{p.label}</option>)}
                </select>
              </div>

              {/* Botón buscar */}
              <button className="search-btn" onClick={buscar} disabled={buscando} style={{
                background:'#2E7D32', color:'#fff', border:'none',
                padding:'.9rem 1.75rem', fontWeight:800, fontSize:'.95rem',
                cursor: buscando ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', gap:'.5rem', flexShrink:0,
              }}>
                {buscando
                  ? <div style={{ width:18,height:18,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }}/>
                  : '→'
                }
                {!buscando && <span>Buscar</span>}
              </button>
            </div>

            {/* Tags rápidos */}
            <div style={{ display:'flex',gap:'.6rem',justifyContent:'center',flexWrap:'wrap',marginTop:'1.25rem' }}>
              {['Casa en Tuxtla','Terreno en San Cristóbal','Departamento','Local Comercial'].map(tag => (
                <button key={tag} onClick={() => { setBusqueda(tag); setTimeout(buscar,0); }}
                  style={{ background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',color:'rgba(255,255,255,.8)',borderRadius:999,padding:'.35rem .9rem',fontSize:'.78rem',fontWeight:600,cursor:'pointer',transition:'all .2s' }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            STATS EN VIVO
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ background:'#f8fafc',borderBottom:'1px solid #e2e8f0',padding:'2.5rem 1.5rem' }}>
          <div style={{ maxWidth:900,margin:'0 auto' }}>
            <div className="stats-row" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',textAlign:'center' }}>
              {[
                { label:'Propiedades activas', val: statsLoad ? '…' : stats.propiedades.toLocaleString('es-MX'), icon:'🏠' },
                { label:'Municipios con oferta', val: statsLoad ? '…' : stats.municipios.toLocaleString('es-MX'), icon:'📍' },
                { label:'Asesores registrados', val: statsLoad ? '…' : stats.asesores.toLocaleString('es-MX'),   icon:'👤' },
              ].map(s => (
                <div key={s.label} style={{ padding:'1.5rem 1rem',background:'#fff',borderRadius:16,border:'1px solid #e2e8f0',boxShadow:'0 2px 8px rgba(0,0,0,.04)',animation:'count-up .6s ease both' }}>
                  <div style={{ fontSize:'1.75rem',marginBottom:'.4rem' }}>{s.icon}</div>
                  <div style={{ fontSize:'2rem',fontWeight:900,color:'#1A1A6E',lineHeight:1,marginBottom:'.3rem' }}>{s.val}</div>
                  <div style={{ fontSize:'.82rem',color:'#64748b',fontWeight:600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            CATEGORÍAS
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding:'4rem 1.5rem 2rem',background:'#fff' }}>
          <div style={{ maxWidth:1100,margin:'0 auto' }}>
            <div style={{ textAlign:'center',marginBottom:'2.5rem' }}>
              <h2 style={{ fontSize:'clamp(1.5rem,3vw,2rem)',fontWeight:900,letterSpacing:'-.02em',margin:'0 0 .5rem' }}>
                ¿Qué tipo de propiedad buscas?
              </h2>
              <p style={{ color:'#64748b',fontSize:'.95rem' }}>Selecciona una categoría para filtrar</p>
            </div>

            <div className="cats-row" style={{ display:'grid',gridTemplateColumns:'repeat(8,1fr)',gap:'1rem' }}>
              {CATEGORIAS.map(cat => (
                <button key={cat.nombre} onClick={() => seleccionarCategoria(cat.filtro)}
                  style={{
                    background: categoriaActiva === cat.filtro ? '#1A1A6E' : '#f8fafc',
                    border: `2px solid ${categoriaActiva === cat.filtro ? '#1A1A6E' : '#e2e8f0'}`,
                    borderRadius:14, padding:'1.1rem .5rem', cursor:'pointer',
                    display:'flex', flexDirection:'column', alignItems:'center', gap:'.5rem',
                    transition:'all .2s',
                    boxShadow: categoriaActiva === cat.filtro ? '0 4px 16px rgba(26,26,110,.25)' : 'none',
                  }}>
                  <span style={{ fontSize:'1.6rem',lineHeight:1 }}>{cat.emoji}</span>
                  <span style={{ fontSize:'.72rem',fontWeight:700,color: categoriaActiva === cat.filtro ? '#fff' : '#475569',textAlign:'center',lineHeight:1.3 }}>
                    {cat.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            PROPIEDADES DESTACADAS / RESULTADOS
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding:'2rem 1.5rem 5rem',background:'#fff' }}>
          <div style={{ maxWidth:1100,margin:'0 auto' }}>

            {/* Cabecera de sección */}
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.75rem',flexWrap:'wrap',gap:'1rem' }}>
              <div>
                <h2 style={{ fontSize:'clamp(1.3rem,2.5vw,1.7rem)',fontWeight:900,letterSpacing:'-.02em',margin:'0 0 .25rem' }}>
                  {resultados !== null
                    ? `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''}`
                    : 'Propiedades destacadas'}
                </h2>
                <p style={{ color:'#64748b',fontSize:'.88rem',margin:0 }}>
                  {resultados !== null
                    ? (municipio ? `en ${municipio}` : 'en todo Chiapas')
                    : 'Las más recientes en el portal'}
                </p>
              </div>
              {hayBusqueda && (
                <button onClick={limpiarBusqueda} style={{ background:'#fee2e2',color:'#dc2626',border:'1px solid #fca5a5',borderRadius:999,padding:'.4rem 1rem',fontSize:'.82rem',fontWeight:700,cursor:'pointer' }}>
                  ✕ Limpiar búsqueda
                </button>
              )}
            </div>

            {/* Grid de propiedades */}
            {loading && resultados === null ? (
              <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'5rem',gap:'1rem',color:'#94a3b8' }}>
                <div style={{ width:36,height:36,border:'3px solid #e2e8f0',borderTopColor:'#1A1A6E',borderRadius:'50%',animation:'spin .8s linear infinite' }}/>
                <p style={{ fontWeight:600 }}>Cargando propiedades...</p>
              </div>
            ) : propsMostradas.length === 0 ? (
              <div style={{ textAlign:'center',padding:'4rem',color:'#94a3b8' }}>
                <div style={{ fontSize:'2.5rem',marginBottom:'.75rem' }}>🔍</div>
                <h3 style={{ fontWeight:700,color:'#475569',marginBottom:'.5rem' }}>No encontramos propiedades</h3>
                <p style={{ fontSize:'.9rem' }}>Intenta con otros filtros o amplía la búsqueda.</p>
                <button onClick={limpiarBusqueda} style={{ marginTop:'1rem',background:'#1A1A6E',color:'#fff',border:'none',borderRadius:10,padding:'.75rem 1.75rem',fontWeight:700,cursor:'pointer' }}>
                  Ver todas las propiedades
                </button>
              </div>
            ) : (
              <>
                <div className="props-grid" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem' }}>
                  {propsMostradas.map(p => (
                    <PropertyCard key={p.id} property={p} onClick={() => setSelectedProperty(p)} />
                  ))}
                </div>

                {/* Ver más */}
                {resultados === null && (
                  <div style={{ textAlign:'center',marginTop:'3rem' }}>
                    <button onClick={() => { setResultados(null); buscar(); }}
                      style={{ background:'#f8fafc',border:'2px solid #e2e8f0',borderRadius:12,padding:'.9rem 2.5rem',fontWeight:800,fontSize:'.97rem',color:'#1A1A6E',cursor:'pointer',transition:'all .2s' }}>
                      Ver todas las propiedades →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            CTA ASESORES
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ background:'linear-gradient(135deg,#0D0D4A,#1A1A6E)',padding:'5rem 1.5rem' }}>
          <div style={{ maxWidth:900,margin:'0 auto' }}>
            <div className="cta-row" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',gap:'2rem',flexWrap:'wrap' }}>
              <div style={{ flex:1 }}>
                <span style={{ background:'rgba(52,211,153,.15)',color:'#34d399',border:'1px solid rgba(52,211,153,.3)',borderRadius:999,padding:'.3rem .9rem',fontSize:'.75rem',fontWeight:800,letterSpacing:'.05em',textTransform:'uppercase',display:'inline-block',marginBottom:'1rem' }}>
                  Para asesores
                </span>
                <h2 style={{ color:'#fff',fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:900,letterSpacing:'-.02em',margin:'0 0 .75rem',lineHeight:1.15 }}>
                  ¿Eres asesor inmobiliario?<br/>
                  <span style={{ color:'#34d399' }}>Crea tu tarjeta digital gratis</span>
                </h2>
                <p style={{ color:'rgba(255,255,255,.65)',fontSize:'1rem',lineHeight:1.6,margin:'0',maxWidth:480 }}>
                  Publica propiedades, genera fichas técnicas y comparte tu perfil en Instagram y WhatsApp. 14 días gratis, sin tarjeta de crédito.
                </p>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:'1rem',alignItems:'flex-start' }}>
                <a href="/asesores" style={{
                  background:'#2E7D32',color:'#fff',textDecoration:'none',
                  borderRadius:14,padding:'1rem 2.5rem',fontWeight:900,fontSize:'1rem',
                  boxShadow:'0 4px 20px rgba(46,125,50,.45)',
                  display:'inline-block',transition:'opacity .2s',
                }}>
                  Empezar 14 días gratis →
                </a>
                <span style={{ color:'rgba(255,255,255,.4)',fontSize:'.78rem',fontWeight:500 }}>
                  Sin tarjeta de crédito · Cancela cuando quieras
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding:'2rem 1.5rem',borderTop:'1px solid #e2e8f0',background:'#f7f7f7' }}>
          <div style={{ maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem',fontSize:'.88rem',color:'#94a3b8' }}>
            <div>© 2026 Propiedades Chiapas, Inc. · Privacidad · Términos</div>
            <div style={{ display:'flex',gap:'1rem',fontWeight:600,color:'#64748b' }}>
              <span>🌐 Español (MX)</span>
              <span>$ MXN</span>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Botón WhatsApp flotante ──────────────────────────────────────── */}
      <a href="https://wa.me/529612466204" target="_blank" rel="noreferrer"
        title="¿Tienes dudas? Escríbenos"
        style={{
          position:'fixed',bottom:'1.75rem',right:'1.75rem',zIndex:9000,
          width:56,height:56,borderRadius:'50%',
          background:'#25D366',display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 4px 16px rgba(37,211,102,.5)',
          animation:'pulse-wa 2.5s ease infinite',textDecoration:'none',
        }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.848L.057 23.743a.75.75 0 0 0 .921.921l5.895-1.465A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 0 1-4.95-1.355l-.355-.213-3.681.915.93-3.594-.233-.371A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
        </svg>
      </a>

      {/* ── Modal ficha técnica ──────────────────────────────────────────── */}
      {selectedProperty && (
        <div onClick={e => { if (e.target === e.currentTarget) setSelectedProperty(null); }}
          style={{ position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem' }}>
          <div style={{ background:'#fff',width:'100%',maxWidth:740,maxHeight:'90vh',overflowY:'auto',borderRadius:16,position:'relative' }}>
            <button onClick={() => setSelectedProperty(null)}
              style={{ position:'absolute',top:12,right:12,background:'#f1f5f9',border:'none',width:34,height:34,borderRadius:'50%',cursor:'pointer',fontSize:'1.1rem',zIndex:10 }}>✕</button>

            <div style={{ padding:'2rem' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',borderBottom:'2px solid #f1f5f9',paddingBottom:'1.25rem',marginBottom:'1.25rem',flexWrap:'wrap',gap:'1rem' }}>
                <div>
                  <h2 style={{ fontSize:'1.5rem',fontWeight:800,color:'#1e293b',margin:'0 0 .3rem',lineHeight:1.2 }}>{selectedProperty.title}</h2>
                  <p style={{ color:'#64748b' }}>📍 {selectedProperty.colony}, {selectedProperty.municipality}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'1.6rem',fontWeight:900,color:'#1A1A6E' }}>{FMT(selectedProperty.price)}</div>
                  <span style={{ background:'#e0f2fe',color:'#0369a1',borderRadius:8,padding:'3px 10px',fontSize:'.82rem',fontWeight:700 }}>{selectedProperty.operation_type}</span>
                </div>
              </div>

              {selectedProperty.featured_image_url && (
                <img src={selectedProperty.featured_image_url} alt={selectedProperty.title}
                  style={{ width:'100%',height:280,objectFit:'cover',borderRadius:12,marginBottom:'1.25rem' }}/>
              )}

              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:'.75rem',marginBottom:'1.25rem' }}>
                {[
                  { l:'Tipo',          v: selectedProperty.type },
                  { l:'Construcción',  v: `${selectedProperty.size_construction_m2 || selectedProperty.size_m2 || '—'} m²` },
                  { l:'Terreno',       v: `${selectedProperty.size_land_m2 || selectedProperty.size_m2 || '—'} m²` },
                  { l:'Recámaras',     v: selectedProperty.bedrooms || '—' },
                  { l:'Baños',         v: selectedProperty.bathrooms || '—' },
                  { l:'Cajones',       v: selectedProperty.garages || '—' },
                ].map(d => (
                  <div key={d.l} style={{ background:'#f8fafc',borderRadius:10,padding:'.75rem',textAlign:'center' }}>
                    <div style={{ fontSize:'.72rem',color:'#94a3b8',fontWeight:700,marginBottom:.2+'rem',textTransform:'uppercase' }}>{d.l}</div>
                    <div style={{ fontWeight:800,color:'#1e293b',fontSize:'.95rem' }}>{d.v}</div>
                  </div>
                ))}
              </div>

              {selectedProperty.description && (
                <p style={{ color:'#475569',lineHeight:1.65,fontSize:'.92rem',whiteSpace:'pre-wrap' }}>{selectedProperty.description}</p>
              )}
            </div>

            <div style={{ display:'flex',gap:'.75rem',padding:'1.25rem 2rem',background:'#f8fafc',borderTop:'1px solid #e2e8f0',borderRadius:'0 0 16px 16px',position:'sticky',bottom:0 }}>
              <button onClick={() => window.print()}
                style={{ flex:1,padding:'.9rem',background:'#1e293b',color:'#fff',border:'none',borderRadius:10,fontWeight:700,cursor:'pointer' }}>
                📄 Imprimir / PDF
              </button>
              <a href={`https://wa.me/529612466204?text=${encodeURIComponent(`Hola, vi la propiedad "${selectedProperty.title}" y quiero más información.`)}`}
                target="_blank" rel="noreferrer"
                style={{ flex:1,padding:'.9rem',background:'#25D366',color:'#fff',borderRadius:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:'.4rem',textDecoration:'none' }}>
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

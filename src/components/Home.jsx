import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Search, Heart, MapPin, Maximize, SlidersHorizontal,
  Compass, MessageCircle, User, Bell,
} from 'lucide-react';
import { supabase } from '../supabaseClient';

// ─── Constantes ───────────────────────────────────────────────────────────────
const SHOW_STATS = false;

// Categorías del diseño premium → filtro real sobre campo "type"
const CATEGORIES = [
  { id: 'todas',        label: 'Todas',      emoji: '✦',  filtro: null },
  { id: 'casas',        label: 'Casas',      emoji: '🏡', filtro: 'casa' },
  { id: 'terrenos',     label: 'Terrenos',   emoji: '🌳', filtro: 'terreno' },
  { id: 'departamentos',label: 'Deptos',     emoji: '🏢', filtro: 'departamento' },
  { id: 'comercial',    label: 'Comercial',  emoji: '🏪', filtro: 'local' },
  { id: 'campestre',    label: 'Campestre',  emoji: '⛰️',  filtro: 'rancho' },
  { id: 'quintas',      label: 'Quintas',    emoji: '🌿', filtro: 'quinta' },
  { id: 'bodegas',      label: 'Bodegas',    emoji: '🏭', filtro: 'bodega' },
];

// Ciudades reales en la BD
const CITIES_DB = [
  'Berriozábal',
  'Chiapa de Corzo',
  'Ocozocoautla de Espinosa',
  'San Cristóbal de las Casas',
  'Tapachula',
  'Tuxtla Gutiérrez',
];

// Filtros de precio
const PRECIOS = [
  { label: 'Hasta $500K',  max: 500000 },
  { label: 'Hasta $1M',    max: 1000000 },
  { label: 'Hasta $2M',    max: 2000000 },
  { label: 'Hasta $5M',    max: 5000000 },
  { label: 'Más de $5M',   max: 99999999 },
];

// Filtros de título que no deben mostrarse en el portal público
const EXCLUDE_TITLES = [
  '%Premium en %',
  'Residencia Casa Premier%',
  'Fraccionamiento Master%',
  'Lotes de Inversión Premium%',
  'Lote Comercial Estratégico%',
];

const peso = (n) =>
  n === 0 ? 'Consultar' : '$' + Number(n).toLocaleString('es-MX');

// ─── Estilos ─────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');

  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes rise   { to { opacity:1; transform:none; } }
  @keyframes pulse-wa {
    0%   { box-shadow: 0 0 0 0 rgba(37,211,102,.6); }
    70%  { box-shadow: 0 0 0 16px rgba(37,211,102,0); }
    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
  }

  .pec-root {
    --bg:#F7F4EE; --card:#FFFFFF; --ink:#1B1A17;
    --muted:#6E6A60; --line:#E7E2D7;
    --green:#15433A; --green-soft:#1F5A4C;
    --amber:#C8862B; --amber-soft:#E0A94A;
    font-family:'Manrope',sans-serif;
    color:var(--ink);
    background:var(--bg);
    min-height:100%;
    -webkit-font-smoothing:antialiased;
  }
  .pec-root * { box-sizing:border-box; }
  .serif { font-family:'Fraunces',serif; }

  .pec-shell { max-width:1180px; margin:0 auto; padding:0 18px 120px; }

  /* ── Header ── */
  .pec-top {
    position:sticky; top:0; z-index:30;
    background:rgba(247,244,238,0.82);
    backdrop-filter:saturate(160%) blur(14px);
    padding:16px 18px 10px;
    border-bottom:1px solid var(--line);
  }
  .pec-top-row {
    max-width:1180px; margin:0 auto;
    display:flex; align-items:center; justify-content:space-between; gap:14px;
  }
  .pec-brand { display:flex; align-items:center; gap:10px; }
  .pec-logo {
    width:38px; height:38px; border-radius:12px;
    background:linear-gradient(145deg,var(--green),var(--green-soft));
    display:grid; place-items:center; color:#fff; font-weight:800;
    box-shadow:0 6px 16px rgba(21,67,58,.25);
  }
  .pec-brand h1 { font-size:15px; font-weight:800; letter-spacing:-.2px; line-height:1.05; margin:0; }
  .pec-brand span { font-size:11px; color:var(--muted); font-weight:600; }
  .pec-iconbtn {
    width:42px; height:42px; border-radius:50%; border:1px solid var(--line);
    background:var(--card); display:grid; place-items:center; cursor:pointer;
    transition:transform .15s ease, box-shadow .2s ease;
  }
  .pec-iconbtn:hover { transform:translateY(-1px); box-shadow:0 8px 18px rgba(0,0,0,.06); }

  /* ── Search ── */
  .pec-search-wrap {
    max-width:1180px; margin:14px auto 0;
    background:var(--card); border:1px solid var(--line); border-radius:999px;
    padding:6px 6px 6px 20px;
    box-shadow:0 10px 30px rgba(27,26,23,.07);
    display:flex; align-items:center; gap:10px;
    transition:box-shadow .2s ease;
  }
  .pec-search-wrap:hover { box-shadow:0 14px 34px rgba(27,26,23,.11); }
  .pec-search-input {
    flex:1; border:none; outline:none; background:transparent;
    font-family:'Manrope',sans-serif; font-size:14px; font-weight:600; color:var(--ink);
  }
  .pec-search-input::placeholder { color:var(--muted); }
  .pec-search-sel {
    border:none; outline:none; background:transparent;
    font-family:'Manrope',sans-serif; font-size:13px; font-weight:600; color:var(--muted);
    cursor:pointer; padding:0 8px; border-left:1px solid var(--line); height:32px;
  }
  .pec-search-go {
    width:42px; height:42px; border-radius:50%; flex:none; border:none; cursor:pointer;
    background:linear-gradient(145deg,var(--amber),var(--amber-soft));
    display:grid; place-items:center; color:#fff;
    box-shadow:0 6px 16px rgba(200,134,43,.35);
    transition:transform .15s ease;
  }
  .pec-search-go:hover { transform:scale(1.07); }

  /* ── Categories ── */
  .pec-cats {
    display:flex; gap:10px; overflow-x:auto; padding:18px 2px 8px;
    scrollbar-width:none; -webkit-overflow-scrolling:touch;
  }
  .pec-cats::-webkit-scrollbar { display:none; }
  .pec-cat {
    flex:none; display:flex; align-items:center; gap:8px;
    padding:9px 16px; border-radius:999px; border:1px solid var(--line);
    background:var(--card); font-size:13px; font-weight:700; color:var(--muted);
    cursor:pointer; transition:all .18s ease; white-space:nowrap;
  }
  .pec-cat:hover { border-color:#cfc8b8; color:var(--ink); }
  .pec-cat.on {
    background:var(--green); border-color:var(--green); color:#fff;
    box-shadow:0 8px 20px rgba(21,67,58,.22);
  }

  .pec-h2 { font-size:22px; font-weight:600; letter-spacing:-.4px; margin:20px 0 2px; }
  .pec-sub { font-size:13px; color:var(--muted); margin:0 0 16px; }

  /* ── Grid ── */
  .pec-grid { display:grid; grid-template-columns:1fr; gap:26px; }
  @media(min-width:640px)  { .pec-grid { grid-template-columns:1fr 1fr; gap:24px; } }
  @media(min-width:980px)  { .pec-grid { grid-template-columns:1fr 1fr 1fr; } }

  .pec-card {
    cursor:pointer; opacity:0; transform:translateY(14px);
    animation:rise .55s cubic-bezier(.2,.7,.2,1) forwards;
  }

  .pec-media {
    position:relative; border-radius:20px; overflow:hidden; aspect-ratio:4/3.2;
    background:#e9e4d8; box-shadow:0 14px 30px rgba(27,26,23,.10);
  }
  .pec-media img {
    width:100%; height:100%; object-fit:cover; display:block;
    transition:transform .6s cubic-bezier(.2,.7,.2,1);
  }
  .pec-card:hover .pec-media img { transform:scale(1.06); }

  /* Placeholder sin foto */
  .pec-placeholder {
    width:100%; height:100%; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:10px;
    background:linear-gradient(145deg,#1F5A4C,#15433A);
    color:rgba(255,255,255,.7); font-size:13px; font-weight:700;
    letter-spacing:.5px;
  }
  .pec-placeholder span { font-size:2.5rem; }

  .pec-fav {
    position:absolute; top:12px; right:12px; width:36px; height:36px;
    border-radius:50%; border:none; background:rgba(255,255,255,.82);
    backdrop-filter:blur(6px); display:grid; place-items:center;
    cursor:pointer; transition:transform .15s ease;
  }
  .pec-fav:active { transform:scale(.88); }

  .pec-badge {
    position:absolute; top:12px; left:12px; padding:6px 12px; border-radius:999px;
    background:rgba(27,26,23,.78); backdrop-filter:blur(6px); color:#fff;
    font-size:11px; font-weight:800; letter-spacing:.3px; text-transform:uppercase;
  }
  .pec-badge-dev {
    position:absolute; top:12px; left:12px; padding:6px 12px; border-radius:999px;
    background:rgba(21,67,58,.88); backdrop-filter:blur(6px); color:#a7f3d0;
    font-size:11px; font-weight:800; letter-spacing:.3px; text-transform:uppercase;
  }

  .pec-info { padding:12px 4px 0; }
  .pec-info .r1 { display:flex; justify-content:space-between; align-items:start; gap:10px; }
  .pec-zone { display:flex; align-items:center; gap:5px; font-size:13px; color:var(--muted); font-weight:600; }
  .pec-title { font-size:15.5px; font-weight:700; letter-spacing:-.2px; margin:3px 0 0; line-height:1.25; }
  .pec-type  { display:inline-block; margin-top:5px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.5px; color:var(--amber); }
  .pec-specs { display:flex; gap:14px; margin-top:9px; font-size:12.5px; color:var(--muted); font-weight:600; }
  .pec-specs span { display:flex; align-items:center; gap:5px; }
  .pec-price { margin-top:11px; font-size:18px; font-weight:800; letter-spacing:-.3px; }
  .pec-price small { font-size:12.5px; font-weight:600; color:var(--muted); }

  /* ── Banner promo ── */
  .pec-banner {
    margin:40px 0 20px;
    background:linear-gradient(135deg,var(--green) 0%,var(--green-soft) 100%);
    border-radius:24px; padding:40px 32px;
    display:flex; align-items:center; justify-content:space-between; gap:24px;
    flex-wrap:wrap;
    box-shadow:0 20px 40px rgba(21,67,58,.25);
  }
  .pec-banner-text h2 {
    font-size:clamp(1.3rem,3vw,1.9rem); font-weight:700;
    color:#fff; margin:0 0 .5rem; letter-spacing:-.4px; line-height:1.2;
  }
  .pec-banner-text p { color:rgba(255,255,255,.7); font-size:14px; margin:0; line-height:1.6; }
  .pec-banner-btn {
    background:var(--amber); color:#fff; border:none; border-radius:999px;
    padding:14px 28px; font-family:'Manrope',sans-serif; font-size:14px;
    font-weight:800; cursor:pointer; text-decoration:none; display:inline-block;
    box-shadow:0 8px 20px rgba(200,134,43,.4); white-space:nowrap;
    transition:transform .15s ease, box-shadow .2s ease;
    flex:none;
  }
  .pec-banner-btn:hover { transform:translateY(-2px); box-shadow:0 12px 28px rgba(200,134,43,.5); }

  /* ── Footer ── */
  .pec-footer {
    background:#fff; border-top:1px solid var(--line); padding:24px 18px;
  }
  .pec-footer-inner {
    max-width:1180px; margin:0 auto;
    display:flex; justify-content:space-between; align-items:center;
    flex-wrap:wrap; gap:12px;
    font-size:13px; color:var(--muted); font-weight:600;
  }
  .pec-footer a { color:var(--muted); text-decoration:none; }
  .pec-footer a:hover { color:var(--green); }

  /* ── Bottom nav (mobile) ── */
  .pec-nav {
    position:fixed; bottom:0; left:0; right:0; z-index:40;
    background:rgba(255,255,255,.9); backdrop-filter:blur(16px);
    border-top:1px solid var(--line); display:flex; justify-content:space-around;
    padding:9px 8px calc(9px + env(safe-area-inset-bottom));
  }
  .pec-navi {
    display:flex; flex-direction:column; align-items:center; gap:3px;
    font-size:10.5px; font-weight:700; color:var(--muted);
    background:none; border:none; cursor:pointer;
    padding:4px 14px; border-radius:12px; transition:color .15s ease;
  }
  .pec-navi.on { color:var(--green); }
  @media(min-width:980px) { .pec-nav { display:none; } }

  /* ── Loading spinner ── */
  .pec-spinner {
    width:36px; height:36px; border-radius:50%;
    border:3px solid var(--line); border-top-color:var(--green);
    animation:spin .8s linear infinite;
  }

  /* ── Clear btn ── */
  .pec-clear-btn {
    background:#fee2e2; color:#dc2626; border:1px solid #fca5a5;
    border-radius:999px; padding:.35rem 1rem; font-size:.8rem; font-weight:700;
    cursor:pointer; transition:opacity .15s;
  }
  .pec-clear-btn:hover { opacity:.8; }

  /* ── WhatsApp flotante ── */
  .wa-btn {
    position:fixed; bottom:5rem; right:1.5rem; z-index:9000;
    width:54px; height:54px; border-radius:50%;
    background:#25D366; display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 16px rgba(37,211,102,.5);
    animation:pulse-wa 2.5s ease infinite; text-decoration:none;
  }
  @media(min-width:980px) { .wa-btn { bottom:1.75rem; right:1.75rem; } }
`;

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Home({ session }) {
  // Filtros
  const [query,         setQuery]         = useState('');
  const [municipio,     setMunicipio]     = useState('');
  const [precioMax,     setPrecioMax]     = useState('');
  const [catActiva,     setCatActiva]     = useState('todas');

  // Datos
  const [propiedades,   setPropiedades]   = useState([]);
  const [resultados,    setResultados]    = useState(null); // null = vista inicial
  const [loading,       setLoading]       = useState(true);
  const [buscando,      setBuscando]      = useState(false);

  // UI
  const [favs,          setFavs]          = useState({});
  const [loaded,        setLoaded]        = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const toggleFav = (id, e) => {
    e.stopPropagation();
    setFavs(f => ({ ...f, [id]: !f[id] }));
  };

  // ── Excluir títulos de prueba ────────────────────────────────────────────────
  const applyExclusions = (q) => {
    EXCLUDE_TITLES.forEach(t => {
      q = q.not('title', 'ilike', t);
    });
    return q;
  };

  // ── Carga inicial: 9 propiedades destacadas ──────────────────────────────────
  useEffect(() => {
    const fetchPropiedades = async () => {
      setLoading(true);
      try {
        let q = supabase
          .from('properties')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(9);
        q = applyExclusions(q);
        const { data, error } = await q;
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

  // ── Buscar con filtros ───────────────────────────────────────────────────────
  const buscar = useCallback(async (overrideType) => {
    setBuscando(true);
    try {
      let q = supabase.from('properties').select('*').eq('active', true);
      q = applyExclusions(q);

      if (query.trim()) {
        q = q.or(`title.ilike.%${query}%,city.ilike.%${query}%,address.ilike.%${query}%`);
      }

      // Tipo por categoría activa o override
      const tipo = overrideType !== undefined ? overrideType : (() => {
        const cat = CATEGORIES.find(c => c.id === catActiva);
        return cat?.filtro || null;
      })();
      if (tipo) q = q.ilike('type', `%${tipo}%`);

      if (municipio) q = q.eq('city', municipio);
      if (precioMax) q = q.lte('price', parseFloat(precioMax));

      q = q.order('created_at', { ascending: false }).limit(24);
      const { data, error } = await q;
      if (error) throw error;
      setResultados(data || []);
    } catch {
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  }, [query, catActiva, municipio, precioMax]);

  // ── Seleccionar categoría ────────────────────────────────────────────────────
  const seleccionarCat = (catId) => {
    const nuevo = catActiva === catId ? 'todas' : catId;
    setCatActiva(nuevo);
    const cat = CATEGORIES.find(c => c.id === nuevo);
    setTimeout(() => buscar(cat?.filtro || null), 0);
  };

  // ── Limpiar ──────────────────────────────────────────────────────────────────
  const limpiar = () => {
    setQuery(''); setMunicipio(''); setPrecioMax('');
    setCatActiva('todas'); setResultados(null);
  };

  const propsMostradas = resultados ?? propiedades;
  const hayFiltros = query || municipio || precioMax || catActiva !== 'todas';

  // ── Render card ──────────────────────────────────────────────────────────────
  const renderCard = (p, i) => {
    const tieneImagen = !!p.featured_image_url;
    const esDev = !!p.landing_slug;

    return (
      <article
        key={p.id}
        className="pec-card"
        style={{ animationDelay: loaded ? `${i * 70}ms` : '0ms' }}
        onClick={() => window.location.href = `/propiedad/${p.id}`}
      >
        <div className="pec-media">
          {tieneImagen ? (
            <img src={p.featured_image_url} alt={p.title} loading="lazy" />
          ) : (
            <div className="pec-placeholder">
              <span>🏠</span>
              Sin foto aún
            </div>
          )}

          {/* Badge: desarrollo (verde) o tipo destacado (oscuro) */}
          {esDev ? (
            <div className="pec-badge-dev">Ver desarrollo</div>
          ) : null}

          <button
            className="pec-fav"
            onClick={(e) => toggleFav(p.id, e)}
            aria-label="Guardar en favoritos"
          >
            <Heart
              size={18}
              fill={favs[p.id] ? '#C8862B' : 'none'}
              color={favs[p.id] ? '#C8862B' : '#1B1A17'}
              strokeWidth={2.2}
            />
          </button>
        </div>

        <div className="pec-info">
          <div className="r1">
            <div>
              <div className="pec-zone">
                <MapPin size={13} />
                {p.city || 'Chiapas'}
              </div>
              <h3 className="pec-title">{p.title}</h3>
              {p.type && <span className="pec-type">{p.type}</span>}
            </div>
          </div>

          <div className="pec-specs">
            {p.size_m2 && (
              <span><Maximize size={14} /> {p.size_m2} m²</span>
            )}
          </div>

          <div className="pec-price">
            {peso(p.price || 0)}{' '}
            {p.price > 0 && (
              <small>{p.price_suffix || 'MXN'}</small>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <>
      <style>{STYLES}</style>

      <Helmet>
        <title>Propiedades en Chiapas — Casas, Terrenos y Más</title>
        <meta name="description" content="Encuentra casas, terrenos, departamentos y locales comerciales en Chiapas. Portal inmobiliario #1 en Chiapas." />
        <meta property="og:title" content="Propiedades en Chiapas — Casas, Terrenos y Más" />
        <meta property="og:description" content="Portal inmobiliario #1 en Chiapas. Casas, terrenos, departamentos y más." />
        <meta property="og:image" content="https://propiedadesenchiapas.com/og-portal.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://propiedadesenchiapas.com" />
        <meta property="og:site_name" content="Propiedades en Chiapas" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Propiedades en Chiapas" />
        <meta name="twitter:description" content="Portal inmobiliario #1. Casas, terrenos, departamentos en todo Chiapas." />
        <meta name="twitter:image" content="https://propiedadesenchiapas.com/og-portal.jpg" />
        <meta name="theme-color" content="#15433A" />
      </Helmet>

      <div className="pec-root">

        {/* ── Header ── */}
        <header className="pec-top">
          <div className="pec-top-row">
            <div className="pec-brand">
              <div className="pec-logo serif">P</div>
              <div>
                <h1>Propiedades en Chiapas</h1>
                <span>Encuentra tu lugar</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="pec-iconbtn" aria-label="Notificaciones"><Bell size={18} /></button>
              <button
                className="pec-iconbtn"
                aria-label="Iniciar sesión"
                onClick={() => window.location.href = '/crm'}
              >
                <User size={18} />
              </button>
            </div>
          </div>

          {/* ── Buscador ── */}
          <div className="pec-search-wrap">
            <Search size={18} strokeWidth={2.4} color="var(--muted)" />
            <input
              className="pec-search-input"
              placeholder="¿Dónde quieres vivir? Colonia, municipio..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscar()}
            />
            <select
              className="pec-search-sel"
              value={municipio}
              onChange={e => setMunicipio(e.target.value)}
              aria-label="Filtrar por ciudad"
            >
              <option value="">📍 Ciudad</option>
              {CITIES_DB.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              className="pec-search-sel"
              value={precioMax}
              onChange={e => setPrecioMax(e.target.value)}
              aria-label="Filtrar por precio"
            >
              <option value="">💰 Precio</option>
              {PRECIOS.map(p => <option key={p.max} value={p.max}>{p.label}</option>)}
            </select>
            <button className="pec-search-go" onClick={() => buscar()} aria-label="Buscar">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </header>

        <div className="pec-shell">

          {/* ── Categorías ── */}
          <div className="pec-cats" role="list">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={'pec-cat' + (catActiva === c.id ? ' on' : '')}
                onClick={() => seleccionarCat(c.id)}
                role="listitem"
              >
                <span>{c.emoji}</span>
                {c.label}
              </button>
            ))}
          </div>

          {/* ── Cabecera de sección ── */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
            <div>
              <h2 className="pec-h2 serif">
                {resultados !== null
                  ? `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''}`
                  : 'Propiedades destacadas'}
              </h2>
              <p className="pec-sub">
                {resultados !== null
                  ? (municipio ? `en ${municipio}` : 'en todo Chiapas')
                  : `${propsMostradas.length} lugares en Chiapas`}
              </p>
            </div>
            {hayFiltros && (
              <button className="pec-clear-btn" onClick={limpiar}>
                ✕ Limpiar filtros
              </button>
            )}
          </div>

          {/* ── Grid propiedades ── */}
          {loading && resultados === null ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'5rem', gap:'1rem', color:'var(--muted)' }}>
              <div className="pec-spinner" />
              <p style={{ fontWeight:600, fontSize:14 }}>Cargando propiedades...</p>
            </div>
          ) : buscando ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'4rem', gap:'1rem', color:'var(--muted)' }}>
              <div className="pec-spinner" />
              <p style={{ fontWeight:600, fontSize:14 }}>Buscando...</p>
            </div>
          ) : propsMostradas.length === 0 ? (
            <div style={{ textAlign:'center', padding:'4rem', color:'var(--muted)' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>🔍</div>
              <h3 style={{ fontWeight:700, marginBottom:'.5rem', color:'var(--ink)' }}>No encontramos propiedades</h3>
              <p style={{ fontSize:14 }}>Intenta con otros filtros o amplía la búsqueda.</p>
              <button onClick={limpiar}
                style={{ marginTop:'1rem', background:'var(--green)', color:'#fff', border:'none',
                  borderRadius:10, padding:'.75rem 1.75rem', fontWeight:700, cursor:'pointer',
                  fontFamily:'Manrope,sans-serif' }}>
                Ver todas las propiedades
              </button>
            </div>
          ) : (
            <div className="pec-grid">
              {propsMostradas.map((p, i) => renderCard(p, i))}
            </div>
          )}

          {/* ── Banner promo asesores ── */}
          <div className="pec-banner">
            <div className="pec-banner-text">
              <h2 className="serif">¿Eres asesor inmobiliario?<br />Crea tu tarjeta digital gratis</h2>
              <p>Publica propiedades, genera fichas técnicas y comparte tu perfil.<br />14 días gratis, sin tarjeta de crédito.</p>
            </div>
            <a href="/asesores" className="pec-banner-btn">
              Empezar 14 días gratis →
            </a>
          </div>

        </div>

        {/* ── Footer ── */}
        <footer className="pec-footer">
          <div className="pec-footer-inner">
            <div>
              © 2026 Propiedades Chiapas, Inc. ·{' '}
              <a href="/asesores">Regístrate</a> ·{' '}
              <a href="/crm">Iniciar sesión</a>
            </div>
            <div style={{ display:'flex', gap:'1rem' }}>
              <span>🌐 Español (MX)</span>
              <span>$ MXN</span>
            </div>
          </div>
        </footer>

        {/* ── Bottom nav — app feel (mobile) ── */}
        <nav className="pec-nav" aria-label="Navegación principal">
          <button className="pec-navi on"><Compass size={21} /> Explorar</button>
          <button className="pec-navi"><Heart size={21} /> Favoritos</button>
          <button className="pec-navi"><MessageCircle size={21} /> Mensajes</button>
          <button className="pec-navi" onClick={() => window.location.href = '/crm'}>
            <User size={21} /> Perfil
          </button>
        </nav>

        {/* ── WhatsApp flotante ── */}
        <a
          href="https://wa.me/529612466204"
          target="_blank"
          rel="noreferrer"
          className="wa-btn"
          title="¿Tienes dudas? Escríbenos"
          aria-label="Contactar por WhatsApp"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.848L.057 23.743a.75.75 0 0 0 .921.921l5.895-1.465A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 0 1-4.95-1.355l-.355-.213-3.681.915.93-3.594-.233-.371A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
          </svg>
        </a>

      </div>
    </>
  );
}

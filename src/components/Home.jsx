import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Search, Heart, MapPin, Bed, Bath, Maximize, ArrowRight,
  Home as HomeIcon, Building2, Trees, Store, Warehouse, Beef,
  TreePine, Briefcase, Sparkles,
} from 'lucide-react';
import { supabase } from '../supabaseClient';

// ─── Constantes ────────────────────────────────────────────────────────────────
const SHOW_STATS = false; // mantenido por compatibilidad futura

// Categorías: id = valor exacto del campo "type" en la BD
const CATEGORIES = [
  { id: 'todas',        label: 'Todas',        Icon: Sparkles   },
  { id: 'casa',         label: 'Casas',        Icon: HomeIcon   },
  { id: 'departamento', label: 'Departamentos',Icon: Building2  },
  { id: 'terreno',      label: 'Terrenos',     Icon: Trees      },
  { id: 'local',        label: 'Locales',      Icon: Store      },
  { id: 'bodega',       label: 'Bodegas',      Icon: Warehouse  },
  { id: 'rancho',       label: 'Ranchos',      Icon: Beef       },
  { id: 'quinta',       label: 'Quintas',      Icon: TreePine   },
  { id: 'oficina',      label: 'Oficinas',     Icon: Briefcase  },
];

// Títulos de prueba a excluir del portal público
const EXCLUDE_TITLES = [
  '%Premium en %',
  'Residencia Casa Premier%',
  'Fraccionamiento Master%',
  'Lotes de Inversión Premium%',
  'Lote Comercial Estratégico%',
];

const peso = (n) =>
  n === 0 ? 'Consultar' : '$' + Number(n).toLocaleString('es-MX');

// ─── Estilos (HomePEC exacto: azul índigo + esmeralda, sin barra inferior) ────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes rise { to { opacity:1; transform:none; } }
  @keyframes spin  { to { transform:rotate(360deg); } }
  @keyframes pulse-wa {
    0%   { box-shadow:0 0 0 0 rgba(37,211,102,.6); }
    70%  { box-shadow:0 0 0 16px rgba(37,211,102,0); }
    100% { box-shadow:0 0 0 0 rgba(37,211,102,0); }
  }

  .pec {
    --ink:#0B1B3A;
    --indigo:#13287A;
    --indigo-2:#1E3A9B;
    --emerald:#0E9F6E;
    --emerald-2:#10B981;
    --amber:#E8A33D;
    --bg:#F6F8FC;
    --card:#FFFFFF;
    --muted:#5C6B8A;
    --line:#E4EAF4;
    font-family:'Plus Jakarta Sans',sans-serif;
    color:var(--ink); background:var(--bg); min-height:100%;
    -webkit-font-smoothing:antialiased;
  }
  .pec * { box-sizing:border-box; margin:0; padding:0; }
  .disp  { font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; }

  /* ── Header ── */
  .pec-hd {
    position:sticky; top:0; z-index:50;
    background:rgba(246,248,252,.85);
    backdrop-filter:saturate(180%) blur(16px);
    border-bottom:1px solid var(--line);
  }
  .pec-hd-in {
    max-width:1200px; margin:0 auto; padding:14px 18px;
    display:flex; align-items:center; justify-content:space-between; gap:12px;
  }
  .pec-logo { display:flex; align-items:center; gap:10px; min-width:0; }
  .pec-mark {
    width:40px; height:40px; border-radius:12px; flex:none;
    background:linear-gradient(145deg,var(--indigo),var(--indigo-2));
    display:grid; place-items:center;
    box-shadow:0 8px 20px rgba(19,40,122,.28);
    position:relative; overflow:hidden;
  }
  .pec-mark::after {
    content:''; position:absolute; inset:0;
    background:radial-gradient(circle at 70% 20%,rgba(16,185,129,.6),transparent 60%);
  }
  .pec-mark svg { position:relative; z-index:1; }
  .pec-logo b   { font-size:15px; font-weight:800; letter-spacing:-.3px; line-height:1; white-space:nowrap; }
  .pec-logo small {
    display:block; font-size:10.5px; color:var(--emerald);
    font-weight:700; letter-spacing:.6px; text-transform:uppercase; margin-top:2px;
  }
  .pec-login {
    flex:none; border:1.5px solid var(--indigo); color:var(--indigo);
    background:transparent; font-weight:700; font-size:13.5px;
    padding:9px 18px; border-radius:999px; cursor:pointer; transition:.18s;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .pec-login:hover { background:var(--indigo); color:#fff; }

  /* ── Hero ── */
  .pec-hero {
    position:relative; overflow:hidden;
    background:linear-gradient(160deg,var(--ink) 0%,var(--indigo) 55%,var(--indigo-2) 100%);
    color:#fff; padding:54px 18px 64px;
  }
  .pec-hero::before {
    content:''; position:absolute; top:-30%; right:-10%;
    width:520px; height:520px; border-radius:50%;
    background:radial-gradient(circle,rgba(16,185,129,.35),transparent 65%);
    filter:blur(10px);
  }
  .pec-hero::after {
    content:''; position:absolute; inset:0; opacity:.06;
    background-image:radial-gradient(circle at 1px 1px,#fff 1px,transparent 0);
    background-size:26px 26px;
  }
  .pec-hero-in { max-width:920px; margin:0 auto; position:relative; z-index:2; text-align:center; }
  .pec-pill {
    display:inline-flex; align-items:center; gap:7px;
    background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.18);
    padding:7px 15px; border-radius:999px;
    font-size:12px; font-weight:700; letter-spacing:.4px; margin-bottom:22px;
  }
  .pec-pill i {
    width:7px; height:7px; border-radius:50%;
    background:var(--emerald-2); box-shadow:0 0 0 4px rgba(16,185,129,.25);
  }
  .pec-hero h1 { font-size:clamp(30px,6vw,52px); line-height:1.05; font-weight:700; letter-spacing:-1px; }
  .pec-hero h1 span {
    color:transparent;
    background:linear-gradient(100deg,var(--emerald-2),#6EE7B7);
    -webkit-background-clip:text; background-clip:text;
  }
  .pec-hero p { margin:16px auto 0; max-width:520px; font-size:15.5px; line-height:1.5; color:rgba(255,255,255,.78); }

  /* ── Search ── */
  .pec-search {
    max-width:760px; margin:30px auto 0; background:#fff; border-radius:20px;
    padding:8px; display:flex; align-items:center; gap:6px;
    box-shadow:0 24px 60px rgba(7,15,40,.35); position:relative; z-index:2;
  }
  .pec-search .field { flex:1; display:flex; align-items:center; gap:11px; padding:12px 16px; min-width:0; }
  .pec-search input {
    border:none; outline:none; font-family:inherit; font-size:15px; font-weight:600;
    color:var(--ink); width:100%; background:transparent;
  }
  .pec-search input::placeholder { color:#9AA7BF; font-weight:500; }
  .pec-search .btn {
    flex:none; background:linear-gradient(145deg,var(--emerald),var(--emerald-2));
    color:#fff; border:none; font-family:inherit; font-weight:800; font-size:14.5px;
    padding:14px 26px; border-radius:14px; cursor:pointer;
    display:flex; align-items:center; gap:8px;
    box-shadow:0 8px 20px rgba(14,159,110,.4); transition:.18s;
  }
  .pec-search .btn:hover { transform:translateY(-1px); box-shadow:0 12px 26px rgba(14,159,110,.5); }
  .pec-search .btn span { display:none; }
  @media(min-width:560px) { .pec-search .btn span { display:inline; } }

  /* ── Categories ── */
  .pec-wrap { max-width:1200px; margin:0 auto; padding:0 18px 90px; }
  .pec-cats { display:flex; gap:9px; overflow-x:auto; padding:22px 0 6px; scrollbar-width:none; }
  .pec-cats::-webkit-scrollbar { display:none; }
  .pec-cat {
    flex:none; display:flex; align-items:center; gap:8px; padding:10px 16px;
    border-radius:14px; border:1.5px solid var(--line); background:#fff;
    font-size:13px; font-weight:700; color:var(--muted);
    cursor:pointer; transition:.16s; white-space:nowrap;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .pec-cat:hover { border-color:#B9C6E0; color:var(--ink); transform:translateY(-1px); }
  .pec-cat.on { background:var(--indigo); border-color:var(--indigo); color:#fff; box-shadow:0 8px 18px rgba(19,40,122,.25); }

  /* ── Section heads ── */
  .pec-shead { display:flex; align-items:end; justify-content:space-between; gap:12px; margin:34px 0 18px; }
  .pec-shead h2 { font-size:clamp(20px,4vw,27px); font-weight:700; letter-spacing:-.5px; line-height:1.1; }
  .pec-shead p  { font-size:13px; color:var(--muted); margin-top:4px; }

  /* ── Grid + Cards ── */
  .pec-grid { display:grid; grid-template-columns:1fr; gap:24px; }
  @media(min-width:560px) { .pec-grid { grid-template-columns:1fr 1fr; } }
  @media(min-width:920px) { .pec-grid { grid-template-columns:1fr 1fr 1fr; } }

  .card {
    cursor:pointer; opacity:0; transform:translateY(16px);
    animation:rise .5s cubic-bezier(.2,.7,.2,1) forwards;
  }
  @keyframes rise { to { opacity:1; transform:none; } }
  .card-media {
    position:relative; border-radius:18px; overflow:hidden; aspect-ratio:4/3.1;
    background:#dde5f2; box-shadow:0 12px 28px rgba(11,27,58,.10);
  }
  .card-media img {
    width:100%; height:100%; object-fit:cover;
    transition:transform .7s cubic-bezier(.2,.7,.2,1);
  }
  .card:hover .card-media img { transform:scale(1.07); }
  .card-ph {
    position:absolute; inset:0; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:8px;
    background:linear-gradient(145deg,#1E3A9B,#13287A); color:rgba(255,255,255,.7);
  }
  .card-ph span { font-size:12px; font-weight:700; letter-spacing:.4px; }
  .card-fav {
    position:absolute; top:11px; right:11px; width:36px; height:36px;
    border-radius:50%; border:none; background:rgba(255,255,255,.85);
    backdrop-filter:blur(6px); display:grid; place-items:center;
    cursor:pointer; transition:.15s;
  }
  .card-fav:active { transform:scale(.86); }
  .card-tags {
    position:absolute; top:11px; left:11px;
    display:flex; gap:6px; flex-wrap:wrap; max-width:75%;
  }
  .tag {
    padding:6px 11px; border-radius:999px; font-size:10.5px;
    font-weight:800; letter-spacing:.3px; text-transform:uppercase;
    backdrop-filter:blur(6px);
  }
  .tag-feat { background:rgba(232,163,61,.95); color:#3A2400; }
  .tag-land { background:rgba(14,159,110,.95); color:#fff; }
  .card-body  { padding:13px 4px 0; }
  .card-zone  { display:flex; align-items:center; gap:5px; font-size:12.5px; color:var(--muted); font-weight:600; }
  .card-title { font-size:16px; font-weight:700; letter-spacing:-.3px; margin-top:3px; }
  .card-specs {
    display:flex; gap:13px; margin-top:9px;
    font-size:12.5px; color:var(--muted); font-weight:600; flex-wrap:wrap;
  }
  .card-specs span { display:flex; align-items:center; gap:5px; }
  .card-foot {
    display:flex; align-items:baseline; justify-content:space-between;
    gap:8px; margin-top:12px; padding-top:12px; border-top:1px solid var(--line);
  }
  .card-price b     { font-size:19px; font-weight:800; letter-spacing:-.4px; }
  .card-price small { font-size:12px; color:var(--muted); font-weight:600; margin-left:4px; }
  .card-go {
    flex:none; width:34px; height:34px; border-radius:10px;
    background:var(--bg); display:grid; place-items:center;
    color:var(--indigo); transition:.16s;
  }
  .card:hover .card-go { background:var(--indigo); color:#fff; }

  /* ── Spinner / estados ── */
  .pec-spinner {
    width:36px; height:36px; border-radius:50%;
    border:3px solid var(--line); border-top-color:var(--emerald);
    animation:spin .8s linear infinite;
  }

  /* ── Promo banner ── */
  .promo {
    display:flex; align-items:center; justify-content:space-between;
    gap:22px; flex-wrap:wrap; margin-top:48px; padding:34px 32px;
    border-radius:24px; text-decoration:none; color:#fff;
    position:relative; overflow:hidden; cursor:pointer;
    background:linear-gradient(125deg,var(--ink) 0%,var(--indigo) 60%,var(--emerald) 160%);
    box-shadow:0 24px 50px rgba(11,27,58,.30);
    transition:transform .25s ease, box-shadow .25s ease;
  }
  .promo:hover { transform:translateY(-3px); box-shadow:0 32px 64px rgba(11,27,58,.40); }
  .promo-glow {
    position:absolute; top:-60%; right:-5%; width:420px; height:420px;
    border-radius:50%; pointer-events:none;
    background:radial-gradient(circle,rgba(16,185,129,.5),transparent 65%);
  }
  .promo::after {
    content:''; position:absolute; inset:0; opacity:.06; pointer-events:none;
    background-image:radial-gradient(circle at 1px 1px,#fff 1px,transparent 0);
    background-size:24px 24px;
  }
  .promo-content { position:relative; z-index:2; min-width:0; }
  .promo-badge {
    display:inline-flex; align-items:center; gap:7px;
    background:rgba(16,185,129,.22); border:1px solid rgba(16,185,129,.4);
    color:#A7F3D0; padding:6px 13px; border-radius:999px;
    font-size:11.5px; font-weight:800; letter-spacing:.4px;
    text-transform:uppercase; margin-bottom:14px;
  }
  .promo-content h3 { font-size:clamp(21px,3.6vw,30px); line-height:1.12; font-weight:700; letter-spacing:-.5px; }
  .promo-content h3 span {
    color:transparent;
    background:linear-gradient(100deg,var(--emerald-2),#6EE7B7);
    -webkit-background-clip:text; background-clip:text;
  }
  .promo-content p { margin-top:11px; font-size:14.5px; color:rgba(255,255,255,.8); }
  .promo-content p b { color:#fff; font-weight:800; }
  .promo-cta {
    position:relative; z-index:2; flex:none;
    display:flex; align-items:center; gap:9px;
    background:#fff; color:var(--indigo); font-weight:800; font-size:15px;
    padding:15px 26px; border-radius:14px; white-space:nowrap;
    transition:gap .2s ease;
  }
  .promo:hover .promo-cta { gap:14px; }
  @media(max-width:560px) {
    .promo { padding:28px 22px; }
    .promo-cta { width:100%; justify-content:center; }
  }

  /* ── Footer ── */
  .pec-ft { background:var(--ink); color:rgba(255,255,255,.6); padding:40px 18px; }
  .pec-ft-in {
    max-width:1200px; margin:0 auto;
    display:flex; flex-direction:column; align-items:center;
    text-align:center; gap:16px;
  }
  .pec-ft-brand { display:flex; flex-direction:column; align-items:center; }
  .pec-ft b     { color:#fff; font-size:14px; font-weight:800; }
  .pec-ft .login-ft {
    color:rgba(255,255,255,.8); font-weight:700; text-decoration:none; font-size:14px;
    border:1.5px solid rgba(255,255,255,.2); padding:10px 26px;
    border-radius:999px; transition:.18s;
  }
  .pec-ft .login-ft:hover { color:#fff; border-color:#fff; background:rgba(255,255,255,.08); }

  /* ── WhatsApp flotante ── */
  .wa-btn {
    position:fixed; bottom:1.75rem; right:1.5rem; z-index:9000;
    width:54px; height:54px; border-radius:50%;
    background:#25D366; display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 16px rgba(37,211,102,.5);
    animation:pulse-wa 2.5s ease infinite; text-decoration:none;
  }
`;

// ─── Componente Card (separado igual que HomePEC) ─────────────────────────────
function Card({ p, i, fav, onFav, loaded }) {
  const tieneImagen = !!p.featured_image_url;
  const esDev      = !!p.landing_slug;

  return (
    <article
      className="card"
      style={{ animationDelay: loaded ? `${i * 60}ms` : '0ms' }}
      onClick={() => window.location.href = `/propiedad/${p.id}`}
    >
      <div className="card-media">
        {tieneImagen ? (
          <img
            src={p.featured_image_url}
            alt={p.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="card-ph">
            <HomeIcon size={40} strokeWidth={1.6} />
            <span>Sin foto aún</span>
          </div>
        )}

        <div className="card-tags">
          {esDev && <span className="tag tag-land">Ver desarrollo</span>}
        </div>

        <button
          className="card-fav"
          onClick={(e) => { e.stopPropagation(); onFav(p.id); }}
          aria-label="Guardar en favoritos"
        >
          <Heart
            size={17}
            fill={fav ? '#E8A33D' : 'none'}
            color={fav ? '#E8A33D' : '#0B1B3A'}
            strokeWidth={2.3}
          />
        </button>
      </div>

      <div className="card-body">
        <div className="card-zone"><MapPin size={13} /> {p.city || 'Chiapas'}</div>
        <h3 className="card-title">{p.title}</h3>
        <div className="card-specs">
          {p.bedrooms  > 0 && <span><Bed size={14} /> {p.bedrooms} rec</span>}
          {p.bathrooms > 0 && <span><Bath size={14} /> {p.bathrooms} baños</span>}
          {p.size_m2        && <span><Maximize size={14} /> {p.size_m2} m²</span>}
        </div>
        <div className="card-foot">
          <div className="card-price">
            <b>{peso(p.price || 0)}</b>
            {p.price > 0 && <small>{p.price_suffix || 'MXN'}</small>}
          </div>
          <div className="card-go"><ArrowRight size={17} strokeWidth={2.5} /></div>
        </div>
      </div>
    </article>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Home({ session }) {
  const [active,      setActive]      = useState('todas');
  const [q,           setQ]           = useState('');
  const [favs,        setFavs]        = useState({});
  const [loaded,      setLoaded]      = useState(false);

  // Datos Supabase
  const [propiedades, setPropiedades] = useState([]);
  const [resultados,  setResultados]  = useState(null); // null = vista inicial sin búsqueda activa
  const [loading,     setLoading]     = useState(true);
  const [buscando,    setBuscando]    = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  const toggleFav = (id) => setFavs(f => ({ ...f, [id]: !f[id] }));

  // ── Excluir propiedades de prueba ──────────────────────────────────────────
  const applyExclusions = (query) => {
    EXCLUDE_TITLES.forEach(t => { query = query.not('title', 'ilike', t); });
    return query;
  };

  // ── Carga inicial: 9 propiedades (active=true) ────────────────────────────
  useEffect(() => {
    const fetchPropiedades = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('properties')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(9);
        query = applyExclusions(query);
        const { data, error } = await query;
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

  // ── Buscar con filtros ────────────────────────────────────────────────────
  const buscar = useCallback(async (overrideType) => {
    setBuscando(true);
    try {
      let query = supabase.from('properties').select('*').eq('active', true);
      query = applyExclusions(query);

      if (q.trim()) {
        query = query.or(`title.ilike.%${q}%,city.ilike.%${q}%,address.ilike.%${q}%`);
      }

      const tipo = overrideType !== undefined
        ? overrideType
        : (active !== 'todas' ? active : null);
      if (tipo) query = query.ilike('type', `%${tipo}%`);

      query = query.order('created_at', { ascending: false }).limit(24);
      const { data, error } = await query;
      if (error) throw error;
      setResultados(data || []);
    } catch {
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  }, [q, active]);

  // ── Seleccionar categoría ─────────────────────────────────────────────────
  const seleccionarCat = (catId) => {
    const nuevo = active === catId ? 'todas' : catId;
    setActive(nuevo);
    const tipo = nuevo !== 'todas' ? nuevo : null;
    setTimeout(() => buscar(tipo), 0);
  };

  // ── Limpiar filtros ───────────────────────────────────────────────────────
  const limpiar = () => {
    setQ(''); setActive('todas'); setResultados(null);
  };

  const propsMostradas = resultados ?? propiedades;
  const hayFiltros     = q || active !== 'todas';

  // Sección "destacadas" — propiedades que aparecen primero (las primeras 3)
  // cuando no hay búsqueda activa y está en "todas"
  const destacadas = (!hayFiltros && resultados === null)
    ? propsMostradas.slice(0, 3)
    : [];
  const restantes  = (!hayFiltros && resultados === null)
    ? propsMostradas.slice(3)
    : propsMostradas;

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
        <meta name="theme-color" content="#13287A" />
      </Helmet>

      <div className="pec">

        {/* ── Header ── */}
        <header className="pec-hd">
          <div className="pec-hd-in">
            <div className="pec-logo">
              <div className="pec-mark">
                <HomeIcon size={20} color="#fff" strokeWidth={2.4} />
              </div>
              <div>
                <b>Propiedades en Chiapas</b>
                <small>Portal inmobiliario</small>
              </div>
            </div>
            <button
              className="pec-login"
              onClick={() => window.location.href = '/crm'}
            >
              Iniciar sesión
            </button>
          </div>
        </header>

        {/* ── Hero + Buscador ── */}
        <section className="pec-hero">
          <div className="pec-hero-in">
            <div className="pec-pill"><i />PORTAL #1 DE PROPIEDADES EN CHIAPAS</div>
            <h1 className="disp">
              Encuentra tu propiedad ideal<br />
              <span>en cualquier rincón de Chiapas</span>
            </h1>
            <p>Casas, terrenos, locales y desarrollos. Las mejores propiedades, con los asesores de confianza de tu región.</p>
          </div>

          <div className="pec-search">
            <div className="field">
              <Search size={20} color="#13287A" strokeWidth={2.4} />
              <input
                placeholder="Colonia, municipio o tipo de propiedad…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && buscar()}
              />
            </div>
            <button className="btn" onClick={() => buscar()}>
              <Search size={17} strokeWidth={2.8} />
              <span>Buscar</span>
            </button>
          </div>
        </section>

        {/* ── Contenido principal ── */}
        <div className="pec-wrap">

          {/* Categorías */}
          <div className="pec-cats" role="list">
            {CATEGORIES.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={'pec-cat' + (active === id ? ' on' : '')}
                onClick={() => seleccionarCat(id)}
                role="listitem"
              >
                <Icon size={16} strokeWidth={2.3} /> {label}
              </button>
            ))}
          </div>

          {/* Estados de carga */}
          {(loading && resultados === null) ? (
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
              <button
                onClick={limpiar}
                style={{
                  marginTop:'1rem', background:'var(--indigo)', color:'#fff',
                  border:'none', borderRadius:10, padding:'.75rem 1.75rem',
                  fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                }}
              >
                Ver todas las propiedades
              </button>
            </div>
          ) : (
            <>
              {/* Destacadas — solo vista inicial sin filtros */}
              {destacadas.length > 0 && (
                <>
                  <div className="pec-shead">
                    <div>
                      <h2 className="disp">Destacadas</h2>
                      <p>Las propiedades del momento</p>
                    </div>
                    {hayFiltros && (
                      <button
                        style={{ background:'none', border:'none', color:'var(--indigo)', fontWeight:700, fontSize:13, cursor:'pointer' }}
                        onClick={limpiar}
                      >
                        ✕ Limpiar
                      </button>
                    )}
                  </div>
                  <div className="pec-grid">
                    {destacadas.map((p, i) => (
                      <Card key={p.id} p={p} i={i} fav={favs[p.id]} onFav={toggleFav} loaded={loaded} />
                    ))}
                  </div>
                </>
              )}

              {/* Todas / filtradas */}
              <div className="pec-shead">
                <div>
                  <h2 className="disp">
                    {resultados !== null
                      ? `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''}`
                      : active !== 'todas'
                        ? CATEGORIES.find(c => c.id === active)?.label
                        : 'Todas las propiedades'}
                  </h2>
                  <p>
                    {resultados !== null
                      ? `encontrado${resultados.length !== 1 ? 's' : ''} en Chiapas`
                      : `${propsMostradas.length} propiedad${propsMostradas.length !== 1 ? 'es' : ''} disponible${propsMostradas.length !== 1 ? 's' : ''}`}
                  </p>
                </div>
                {hayFiltros && resultados !== null && (
                  <button
                    style={{ background:'none', border:'none', color:'var(--indigo)', fontWeight:700, fontSize:13, cursor:'pointer' }}
                    onClick={limpiar}
                  >
                    ✕ Limpiar
                  </button>
                )}
              </div>
              <div className="pec-grid">
                {(resultados !== null ? resultados : restantes).map((p, i) => (
                  <Card key={p.id} p={p} i={i} fav={favs[p.id]} onFav={toggleFav} loaded={loaded} />
                ))}
              </div>
            </>
          )}

          {/* ── Banner promo → /asesores ── */}
          <a className="promo" href="/asesores">
            <div className="promo-glow" />
            <div className="promo-content">
              <div className="promo-badge">
                <Sparkles size={14} strokeWidth={2.5} /> Para asesores inmobiliarios
              </div>
              <h3 className="disp">
                Crea tu tarjeta digital y publica<br />
                tu primera propiedad <span>gratis</span>
              </h3>
              <p>Prueba todo el sistema <b>14 días sin costo</b>. Sin tarjeta, sin compromiso.</p>
            </div>
            <div className="promo-cta">
              Empezar gratis <ArrowRight size={18} strokeWidth={2.6} />
            </div>
          </a>

        </div>

        {/* ── Footer: solo Iniciar sesión, centrado ── */}
        <footer className="pec-ft">
          <div className="pec-ft-in">
            <div className="pec-ft-brand">
              <b>Propiedades en Chiapas</b>
              <div style={{ marginTop:6, fontSize:13 }}>El portal inmobiliario de Chiapas</div>
            </div>
            <a className="login-ft" href="/crm">Iniciar sesión</a>
          </div>
        </footer>

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

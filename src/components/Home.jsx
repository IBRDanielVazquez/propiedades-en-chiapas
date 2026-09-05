import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, Heart, MapPin, Bed, Bath, Maximize, ArrowRight,
  Home as HomeIcon, Building2, Trees, Store, Warehouse, Beef,
  TreePine, Briefcase, Sparkles, Car, ChevronLeft, ChevronRight,
  TrendingUp, AlertTriangle,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import logo from '../assets/logo-pec.png';
import DevelopmentCard from './DevelopmentCard';
import DevelopmentDetailModal from './DevelopmentDetailModal';
import { DESARROLLOS } from '../data/desarrollos';

// ─── Constantes ────────────────────────────────────────────────────────────────
const SHOW_STATS = false;  // mantenido por compatibilidad futura
const INITIAL_LIMIT = 9;   // tamaño de página de la vista inicial (sin filtros)
const SEARCH_LIMIT  = 24;  // tamaño de página de resultados con filtro/búsqueda activa
const LOAD_MORE_STEP = 9;  // cuánto crece cada "Ver más"
const FAVS_KEY = 'pec_favs'; // localStorage: favoritos persistentes

// Formatea precios en pesos mexicanos, sin decimales.
const peso = (n) => new Intl.NumberFormat('es-MX', {
  style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
}).format(n || 0);

// Títulos de prueba a excluir del catálogo público. Vacío a propósito: al recuperar
// este archivo de un conflicto de merge no se localizó la lista original de títulos
// de prueba — si Daniel sabe cuáles son, agregarlos aquí (ej. ['Prueba', 'Test XYZ']).
const EXCLUDE_TITLES = [];

const CATEGORIES = [
  { id: 'todas',        label: 'Todas',         Icon: Sparkles   },
  { id: 'terreno',      label: 'Terrenos',       Icon: Trees      },
  { id: 'casa',         label: 'Casas',          Icon: HomeIcon   },
  { id: 'departamento', label: 'Departamentos',  Icon: Building2  },
  { id: 'local',        label: 'Locales',        Icon: Store      },
  { id: 'bodega',       label: 'Bodegas',        Icon: Warehouse  },
  { id: 'rancho',       label: 'Ranchos',        Icon: Beef       },
  { id: 'quinta',       label: 'Quintas',        Icon: TreePine   },
  { id: 'oficina',      label: 'Oficinas',       Icon: Briefcase  },
];

const STYLES = `
  /* La fuente Plus Jakarta Sans ya se precarga desde index.html (<link> en <head>) —
     aquí ya no se importa para no bloquear el primer render. */

  @keyframes rise { to { opacity:1; transform:none; } }
  @keyframes spin  { to { transform:rotate(360deg); } }
  @keyframes pulse-wa {
    0%   { box-shadow:0 0 0 0 rgba(37,211,102,.6); }
    70%  { box-shadow:0 0 0 16px rgba(37,211,102,0); }
    100% { box-shadow:0 0 0 0 rgba(37,211,102,0); }
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

  .pec {
    /* Paleta derivada del logo oficial: azul marino + acero, verde, violeta y rojo del techo/ventanas */
    --ink:#0A0838;
    --indigo:#0E0A78;
    --indigo-2:#4682B4;
    --emerald:#0B6B0E;
    --emerald-2:#1FAE3B;
    --violet:#8B54F3;
    --red:#B23A3D;
    --bg:#F6F8FC;
    --card:#FFFFFF;
    --muted:#5C6B8A;
    --line:#E4EAF4;
    font-family:'Plus Jakarta Sans',sans-serif;
    color:var(--ink); background:var(--bg); min-height:100%;
    -webkit-font-smoothing:antialiased;
  }
  .pec * { box-sizing:border-box; margin:0; padding:0; }

  .pec-hd {
    position:sticky; top:0; z-index:100;
    background:rgba(255,255,255,0.96); backdrop-filter:blur(12px);
    border-bottom:1px solid var(--line);
  }
  .pec-hd-in {
    max-width:1440px; margin:0 auto; padding:.75rem 1.5rem;
    display:flex; align-items:center; justify-content:space-between; gap:16px;
  }
  .pec-logo { display:flex; align-items:center; gap:10px; min-width:0; }
  .pec-logo-img { height:40px; width:auto; display:block; }
  @media(min-width:560px) { .pec-logo-img { height:48px; } }
  .pec-login {
    flex:none; border:1.5px solid var(--indigo); color:var(--indigo);
    background:transparent; font-weight:700; font-size:13.5px;
    padding:9px 18px; border-radius:999px; cursor:pointer; transition:.18s;
    font-family:'Plus Jakarta Sans',sans-serif;
    text-decoration:none; display:inline-block;
  }
  .pec-login:hover { border-color:var(--ink); background:#f8fafc; }

  .pec-cats-wrap {
    position:sticky; top:65px; background:rgba(255,255,255,0.96); backdrop-filter:blur(10px);
    z-index:99; border-bottom:1px solid var(--line); padding:.6rem 0;
  }

  .pec-hero {
    position:relative; overflow:hidden;
    background:linear-gradient(135deg,var(--ink) 0%,var(--indigo) 100%);
    padding:56px 20px 46px; color:#fff;
  }
  .pec-hero::before {
    content:''; position:absolute; top:-30%; right:-10%;
    width:520px; height:520px; border-radius:50%;
    background:radial-gradient(circle,rgba(139,84,243,.32),transparent 65%);
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
    background:var(--violet); box-shadow:0 0 0 4px rgba(139,84,243,.25);
  }
  .pec-hero h1 { font-size:clamp(30px,6vw,52px); line-height:1.05; font-weight:700; letter-spacing:-1px; }
  .pec-hero h1 span {
    color:transparent;
    background:linear-gradient(100deg,var(--emerald-2),#84D293);
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
    flex:none; background:linear-gradient(145deg,var(--emerald),#17822C);
    color:#fff; border:none; font-family:inherit; font-weight:800; font-size:14.5px;
    padding:14px 26px; border-radius:14px; cursor:pointer;
    display:flex; align-items:center; gap:8px;
    box-shadow:0 8px 20px rgba(31,174,59,.4); transition:.18s;
  }
  /* Nota: el fondo sólido del botón usa un verde más oscuro que --emerald-2 (no la variable)
     para que el texto blanco cumpla contraste AA (4.5:1) — el verde vivo se queda para
     degradados/decoración donde no hay texto encima. */
  .pec-search .btn:hover { transform:translateY(-1px); box-shadow:0 12px 26px rgba(31,174,59,.5); }
  .pec-search .btn span { display:none; }
  @media(min-width:560px) { .pec-search .btn span { display:inline; } }

  /* ── Categories ── */
  .pec-cats { display:flex; gap:9px; overflow-x:auto; padding:22px 0 6px; scrollbar-width:none; }
  .pec-cats::-webkit-scrollbar { display:none; }
  .pec-cat-ios {
    flex:none; display:flex; align-items:center; gap:8px;
    padding:8px 18px; border-radius:30px; border:1px solid #e2e8f0;
    background:#f8fafc; color:#64748b; font-size:13px; font-weight:700;
    cursor:pointer; transition:all .18s ease; font-family:inherit;
    box-shadow:0 1px 2px rgba(0,0,0,.02);
  }
  .pec-cat-ios:hover { background:#f1f5f9; color:#1e293b; border-color:#cbd5e1; }
  .pec-cat-ios.on {
    background:#1e293b; color:#ffffff; border-color:#1e293b;
    box-shadow:0 2px 8px rgba(30,41,59,.25);
  }

  .pec-wrap { max-width:1200px; margin:0 auto; padding:0 18px 90px; }
  .pec-toolbar {
    display:flex; align-items:center; justify-content:space-between;
    gap:10px; margin:22px 0 18px; flex-wrap:wrap;
  }
  .pec-count { font-size:.92rem; color:var(--muted); }
  .pec-count b { color:var(--ink); font-weight:800; }
  .pec-clear-btn {
    background:none; border:1.5px solid var(--line); color:var(--ink);
    font-size:.82rem; font-weight:700; padding:6px 14px; border-radius:999px;
    cursor:pointer; font-family:inherit; transition:.16s; display:flex; align-items:center; gap:5px;
  }
  .pec-clear-btn:hover { border-color:var(--ink); }

  .pec-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
    gap:2rem 1.5rem;
  }

  .card {
    cursor:pointer; opacity:0; transform:translateY(16px);
    animation:rise .5s cubic-bezier(.2,.7,.2,1) forwards;
  }
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
    background:linear-gradient(145deg,var(--indigo-2),var(--indigo)); color:rgba(255,255,255,.7);
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
    display:flex; gap:6px; flex-wrap:wrap; max-width:82%;
  }
  .tag {
    padding:6px 11px; border-radius:999px; font-size:10.5px;
    font-weight:800; letter-spacing:.3px; text-transform:uppercase;
    backdrop-filter:blur(6px);
  }
  .tag-feat { background:rgba(178,58,61,.95); color:#fff; }
  .tag-land { background:rgba(31,174,59,.95); color:#fff; }
  .tag-venta { background:rgba(14,10,120,.92); color:#fff; }
  .tag-renta { background:rgba(139,84,243,.92); color:#fff; }
  .tag-pop   { background:rgba(178,58,61,.92); color:#fff; display:flex; align-items:center; gap:4px; }

  /* ── Carrusel de fotos en la tarjeta (usa properties.images[] real) ── */
  .card-nav {
    position:absolute; top:50%; transform:translateY(-50%);
    width:28px; height:28px; border-radius:50%; border:none;
    background:rgba(255,255,255,.85); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; opacity:0; transition:.15s; z-index:2; padding:0;
  }
  .card:hover .card-nav { opacity:1; }
  .card-nav.prev { left:9px; }
  .card-nav.next { right:9px; }
  .card-nav:hover { background:#fff; }
  .card-dots {
    position:absolute; bottom:9px; left:0; right:0;
    display:flex; justify-content:center; gap:4px; z-index:2;
  }
  .card-dots i {
    width:5px; height:5px; border-radius:50%;
    background:rgba(255,255,255,.55); transition:.15s; display:block;
  }
  .card-dots i.on { background:#fff; width:14px; border-radius:3px; }

  /* ── Chips de amenidades (properties.amenities[] real) ── */
  .card-amens { display:flex; flex-wrap:wrap; gap:5px; margin-top:8px; }
  .card-amens span {
    font-size:10.5px; font-weight:700; padding:4px 9px; border-radius:999px;
    background:var(--bg); color:var(--muted); border:1px solid var(--line);
  }

  /* ── Botón "Ver más" ── */
  .pec-more { display:flex; justify-content:center; margin-top:30px; }
  .pec-more button {
    background:#fff; border:1.5px solid var(--line); color:var(--ink);
    font-weight:700; font-size:14px; padding:12px 30px; border-radius:999px;
    cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:.16s;
  }
  .pec-more button:hover:not(:disabled) { border-color:var(--indigo); color:var(--indigo); }
  .pec-more button:disabled { opacity:.6; cursor:default; }

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
    width:32px; height:32px; border-radius:50%;
    border:3px solid var(--line); border-top-color:var(--indigo);
    animation:spin .8s linear infinite;
  }

  .pec-empty { text-align:center; padding:5rem 1rem; color:var(--muted); animation:fadeUp .3s ease; }
  .pec-empty-emoji { font-size:3rem; margin-bottom:.75rem; }
  .pec-empty h3 { font-size:1.2rem; font-weight:700; margin-bottom:.5rem; color:var(--ink); }

  .wa-btn {
    position:fixed; bottom:1.75rem; right:1.5rem; z-index:9000;
    width:54px; height:54px; border-radius:50%;
    background:#25D366; display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 16px rgba(37,211,102,.5);
    animation:pulse-wa 2.5s ease infinite; text-decoration:none;
  }

  .pec-ft { background:#1e293b; color:rgba(255,255,255,.6); padding:2.5rem 1.5rem; margin-top:3rem; }
  .pec-ft-in {
    max-width:1440px; margin:0 auto;
    display:flex; flex-direction:column; align-items:center; text-align:center; gap:1rem;
  }
  .pec-ft b { color:#fff; font-size:14px; font-weight:800; }
  .pec-ft .login-ft {
    color:rgba(255,255,255,.85); font-weight:700; text-decoration:none; font-size:14px;
    border:1.5px solid rgba(255,255,255,.25); padding:10px 26px; border-radius:999px; transition:.18s;
    background:transparent; cursor:pointer; font-family:inherit;
  }
  .pec-ft .login-ft:hover { color:#fff; border-color:#fff; background:rgba(255,255,255,.1); }
  .pec-ft .privacy-ft { color:rgba(255,255,255,.4); font-size:12px; text-decoration:none; transition:.18s; }
  .pec-ft .privacy-ft:hover { color:rgba(255,255,255,.75); }

  @media(max-width:768px) {
    .pec-hd-in { padding:.6rem 1rem; gap:8px; }
    .pec-wrap { padding:0 14px 70px; }
    .pec-grid { grid-template-columns:1fr; gap:1.5rem; }
    .pec-login { display:none; }
  }
  @media(min-width:560px) and (max-width:920px) {
    .pec-grid { grid-template-columns:1fr 1fr; }
  }
`;

// ─── Componente Card ────────────────────────────────────────────────────────────
function Card({ propiedad, i, fav, onFav, loaded, popular }) {
  const navigate = useNavigate();
  const esDev = !!propiedad.landing_slug;

  // Fotos reales: usa el arreglo images[] si existe; si no, cae a featured_image_url.
  const fotos = (Array.isArray(propiedad.images) && propiedad.images.length > 0)
    ? propiedad.images
    : (propiedad.featured_image_url ? [propiedad.featured_image_url] : []);
  const [imgIdx, setImgIdx] = useState(0);
  const tieneVarias = fotos.length > 1;

  const irA = (idx, e) => {
    e.stopPropagation();
    setImgIdx((idx + fotos.length) % fotos.length);
  };

  const amenidades = Array.isArray(propiedad.amenities) ? propiedad.amenities.filter(Boolean) : [];

  return (
    <article
      className="card"
      style={{ animationDelay: loaded ? `${i * 60}ms` : '0ms' }}
      onClick={() => navigate('/propiedad/' + propiedad.id)}
    >
      <div className="card-media">
        {fotos.length > 0 ? (
          <img
            src={fotos[imgIdx]}
            alt={propiedad.title}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="card-ph">
            <HomeIcon size={40} strokeWidth={1.6} />
            <span>Sin foto aún</span>
          </div>
        )}

        {tieneVarias && (
          <>
            <button className="card-nav prev" onClick={(e) => irA(imgIdx - 1, e)} aria-label="Foto anterior">
              <ChevronLeft size={16} color="#0A0838" strokeWidth={2.6} />
            </button>
            <button className="card-nav next" onClick={(e) => irA(imgIdx + 1, e)} aria-label="Foto siguiente">
              <ChevronRight size={16} color="#0A0838" strokeWidth={2.6} />
            </button>
            <div className="card-dots">
              {fotos.map((_, idx) => <i key={idx} className={idx === imgIdx ? 'on' : ''} />)}
            </div>
          </>
        )}

        <div className="card-tags">
          {esDev && <span className="tag tag-land">Ver desarrollo</span>}
          {propiedad.operation_type === 'Renta' && <span className="tag tag-renta">Renta</span>}
          {propiedad.operation_type === 'Venta' && <span className="tag tag-venta">Venta</span>}
          {popular && (
            <span className="tag tag-pop"><TrendingUp size={10} strokeWidth={3} /> Popular</span>
          )}
        </div>

        <button
          className="card-fav"
          onClick={(e) => { e.stopPropagation(); onFav(propiedad.id); }}
          aria-label={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          aria-pressed={!!fav}
        >
          <Heart
            size={17}
            fill={fav ? '#B23A3D' : 'none'}
            color={fav ? '#B23A3D' : '#0A0838'}
            strokeWidth={2.3}
          />
        </button>
      </div>

      <div className="card-body">
        <div className="card-zone"><MapPin size={13} /> {propiedad.city || propiedad.municipality || 'Chiapas'}</div>
        <h3 className="card-title">{propiedad.title}</h3>
        <div className="card-specs">
          {propiedad.bedrooms  > 0 && <span><Bed size={14} /> {propiedad.bedrooms} rec</span>}
          {propiedad.bathrooms > 0 && <span><Bath size={14} /> {propiedad.bathrooms} baños</span>}
          {propiedad.size_m2        && <span><Maximize size={14} /> {propiedad.size_m2} m²</span>}
          {propiedad.garages   > 0 && <span><Car size={14} /> {propiedad.garages} autos</span>}
        </div>
        {amenidades.length > 0 && (
          <div className="card-amens">
            {amenidades.slice(0, 3).map((a) => <span key={a}>{a}</span>)}
            {amenidades.length > 3 && <span>+{amenidades.length - 3} más</span>}
          </div>
        )}
        <div className="card-foot">
          <div className="card-price">
            <b>{peso(propiedad.price || 0)}</b>
            {propiedad.price > 0 && <small>{propiedad.price_suffix || 'MXN'}</small>}
          </div>
          <div className="card-go"><ArrowRight size={17} strokeWidth={2.5} /></div>
        </div>
      </div>
    </article>
  );
}

// ─── Componente principal ───────────────────────────────────────────────────────
export default function Home({ session }) {
  const navigate = useNavigate();
  const [active,      setActive]      = useState('todas');
  const [q,           setQ]           = useState('');
  const [favs,        setFavs]        = useState(() => {
    try { return JSON.parse(localStorage.getItem(FAVS_KEY) || '{}'); } catch { return {}; }
  });
  const [loaded,      setLoaded]      = useState(false);
  const [selectedDev, setSelectedDev] = useState(null);

  // Datos Supabase
  const [propiedades, setPropiedades] = useState([]);
  const [resultados,  setResultados]  = useState(null); // null = vista inicial sin búsqueda activa
  const [loading,     setLoading]     = useState(true);
  const [buscando,    setBuscando]    = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetchError,  setFetchError]  = useState(false); // error real de Supabase (vista inicial)
  const [searchError, setSearchError] = useState(false); // error real de Supabase (búsqueda/filtro)

  // Paginación: "Ver más" crece el límite y vuelve a pedir esa página completa
  // (más simple y confiable que ir acumulando páginas con .range(), y con el volumen
  // de propiedades de este portal el costo extra de red es insignificante).
  const [limit,       setLimit]       = useState(INITIAL_LIMIT);
  const [searchLimit, setSearchLimit] = useState(SEARCH_LIMIT);
  const [hasMore,     setHasMore]     = useState(true);
  const [resHasMore,  setResHasMore]  = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  const toggleFav = (id) => setFavs(f => {
    const next = { ...f, [id]: !f[id] };
    try { localStorage.setItem(FAVS_KEY, JSON.stringify(next)); } catch { /* localStorage no disponible, no es crítico */ }
    return next;
  });

  // ── Excluir propiedades de prueba ──────────────────────────────────────────
  const applyExclusions = (query) => {
    EXCLUDE_TITLES.forEach(t => { query = query.not('title', 'ilike', t); });
    return query;
  };

  // ── Carga inicial: crece con "limit" cuando se pide "Ver más" ──────────────
  useEffect(() => {
    const fetchPropiedades = async () => {
      if (limit === INITIAL_LIMIT) setLoading(true); else setLoadingMore(true);
      try {
        let query = supabase
          .from('properties')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(limit);
        query = applyExclusions(query);
        const { data, error } = await query;
        if (error) throw error;
        setPropiedades(data || []);
        setHasMore((data || []).length === limit);
        setFetchError(false);
      } catch {
        setPropiedades([]);
        setFetchError(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchPropiedades();
  }, [limit]);

  // ── Buscar con filtros (useLimit: pasa un número mayor para "Ver más") ─────
  const buscar = useCallback(async (overrideType, useLimit) => {
    const esMas = typeof useLimit === 'number';
    const lim = esMas ? useLimit : SEARCH_LIMIT;
    if (esMas) setLoadingMore(true); else setBuscando(true);
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('active', true);

      // Nota: se busca por título/municipio/dirección (columnas confirmadas en el
      // esquema real); "city" no se usa como filtro porque no existe garantizado en
      // la tabla — sí se usa como fallback de visualización en la tarjeta.
      if (q.trim()) {
        query = query.or(`title.ilike.%${q}%,municipality.ilike.%${q}%,address.ilike.%${q}%`);
      }

      const tipo = overrideType !== undefined
        ? overrideType
        : (active !== 'todas' ? active : null);
      if (tipo) query = query.ilike('type', `%${tipo}%`);

      query = applyExclusions(query);
      query = query.order('created_at', { ascending: false }).limit(lim);
      const { data, error } = await query;
      if (error) throw error;
      setResultados(data || []);
      setSearchLimit(lim);
      setResHasMore((data || []).length === lim);
      setSearchError(false);
    } catch {
      if (!esMas) setResultados([]);
      setSearchError(true);
    } finally {
      setBuscando(false);
      setLoadingMore(false);
    }
  }, [q, active]);

  const seleccionarCat = (catId) => {
    const next = active === catId ? 'todas' : catId;
    setActive(next);
    buscar(next === 'todas' ? null : next);
  };

  // ── Limpiar filtros ─────────────────────────────────────────────────────────
  const limpiar = () => {
    setQ(''); setActive('todas'); setResultados(null);
    setSearchLimit(SEARCH_LIMIT); setResHasMore(true);
  };

  const hayFiltros = !!q || active !== 'todas';

  // ── Desarrollos y fichas estáticas (landings reales de Hostinger migradas) ──
  const desarrollosFiltrados = useMemo(() => {
    const list = Array.isArray(DESARROLLOS) ? DESARROLLOS : [];
    let statusMap = {};
    try {
      const saved = localStorage.getItem('pec_static_landings_status');
      if (saved) statusMap = JSON.parse(saved);
    } catch { /* no-op */ }

    const term = q.trim().toLowerCase();
    return list.filter(dev => {
      if (statusMap[`sys-${dev.slug}`] === false || statusMap[dev.id] === false) return false;
      const matchesCat = active === 'todas' || dev.tipo === active;
      const matchesSearch = !term
        || (dev.titulo && dev.titulo.toLowerCase().includes(term))
        || (dev.ciudad && dev.ciudad.toLowerCase().includes(term))
        || (dev.descripcion && dev.descripcion.toLowerCase().includes(term));
      return matchesCat && matchesSearch;
    });
  }, [active, q]);

  // Lista de propiedades que se muestra en pantalla en este momento.
  const propsMostradas = resultados !== null ? resultados : propiedades;

  // "Popular" honesto: top 3 por vistas reales del lote actual, y solo si de
  // verdad tiene vistas — nunca se inventa un badge cuando todo está en 0.
  const popularIds = useMemo(() => {
    const conVistas = propsMostradas.filter(p => (p.views || 0) > 0);
    const top = [...conVistas].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
    return new Set(top.map(p => p.id));
  }, [propsMostradas]);

  const showError = resultados !== null ? searchError : fetchError;
  const puedeVerMas = resultados !== null ? resHasMore : hasMore;
  const verMas = () => {
    if (resultados !== null) buscar(active !== 'todas' ? active : null, searchLimit + LOAD_MORE_STEP);
    else setLimit(l => l + LOAD_MORE_STEP);
  };

  const totalItemsCount = desarrollosFiltrados.length + propsMostradas.length;

  // JSON-LD (schema.org) — construido solo con datos reales ya cargados en pantalla.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: propsMostradas.slice(0, 20).map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `https://propiedadesenchiapas.com/propiedad/${p.id}`,
      name: p.title,
    })),
  };

  return (
    <>
      <style>{STYLES}</style>
      <Helmet>
        <title>Propiedades en Chiapas — Casas, Terrenos y Desarrollos</title>
        <meta name="description" content="Encuentra casas, terrenos, desarrollos y locales comerciales en Chiapas. Portal inmobiliario #1 de Chiapas." />
        <meta property="og:title" content="Propiedades en Chiapas — Casas, Terrenos y Desarrollos" />
        <meta property="og:description" content="Encuentra casas, terrenos, desarrollos y locales comerciales en Chiapas. Portal inmobiliario #1." />
        <meta property="og:image" content="https://propiedadesenchiapas.com/og-portal.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://propiedadesenchiapas.com" />
        <meta property="og:site_name" content="Propiedades en Chiapas" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Propiedades en Chiapas" />
        <meta name="twitter:description" content="Portal inmobiliario #1. Casas, terrenos, departamentos en todo Chiapas." />
        <meta name="twitter:image" content="https://propiedadesenchiapas.com/og-portal.jpg" />
        <meta name="theme-color" content="#0E0A78" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="pec">

        {selectedDev && (
          <DevelopmentDetailModal dev={selectedDev} onClose={() => setSelectedDev(null)} />
        )}

        {/* ── Header ── */}
        <header className="pec-hd">
          <div className="pec-hd-in">
            <div className="pec-logo">
              <img src={logo} alt="Propiedades en Chiapas" className="pec-logo-img" />
            </div>
            <button className="pec-login" onClick={() => navigate('/crm')}>Iniciar sesión</button>
          </div>
        </header>

        {/* ── Hero + Buscador ── */}
        <section className="pec-hero">
          <div className="pec-hero-in">
            <div className="pec-pill"><i />PORTAL #1 DE PROPIEDADES EN CHIAPAS</div>
            <h1>
              Encuentra tu propiedad ideal<br />
              <span>en cualquier rincón de Chiapas</span>
            </h1>
            <p>Casas, terrenos, locales y desarrollos. Las mejores propiedades, con los asesores de confianza de tu región.</p>
          </div>

          <div className="pec-search">
            <div className="field">
              <Search size={20} color="#0E0A78" strokeWidth={2.4} />
              <label htmlFor="pec-search-input" style={{ position:'absolute', width:1, height:1, overflow:'hidden', clip:'rect(0 0 0 0)', whiteSpace:'nowrap' }}>
                Buscar propiedades por colonia, municipio o tipo
              </label>
              <input
                id="pec-search-input"
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
          <nav className="pec-cats-wrap" aria-label="Filtrar categorías">
            <div className="pec-cats" role="list">
              {CATEGORIES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  className={'pec-cat-ios' + (active === id ? ' on' : '')}
                  onClick={() => seleccionarCat(id)}
                  role="listitem"
                  aria-pressed={active === id}
                >
                  <Icon size={16} strokeWidth={2.2} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="pec-toolbar">
            <p className="pec-count">
              <b>{totalItemsCount.toLocaleString('es-MX')}</b> {hayFiltros ? 'resultados encontrados' : 'opciones disponibles en Chiapas'}
            </p>
            {hayFiltros && (
              <button className="pec-clear-btn" onClick={limpiar}>
                <X size={14} /> Limpiar filtros
              </button>
            )}
          </div>

          {/* Desarrollos y fichas destacadas (landings reales) */}
          {desarrollosFiltrados.length > 0 && (
            <section aria-label="Desarrollos y fichas destacadas" style={{ marginBottom: '2.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize:'1.15rem', fontWeight:800, color:'var(--ink)', letterSpacing:'-.3px' }}>
                  Desarrollos &amp; Fichas Destacadas
                </h2>
                <p style={{ fontSize:'.85rem', color:'var(--muted)', marginTop:2 }}>
                  Haz clic en cualquier tarjeta para abrir su ficha inmobiliaria completa
                </p>
              </div>
              <div className="pec-grid">
                {desarrollosFiltrados.map(dev => (
                  <DevelopmentCard key={dev.id} dev={dev} onClick={() => setSelectedDev(dev)} />
                ))}
              </div>
            </section>
          )}

          {/* Estados de carga / propiedades */}
          {showError ? (
            <div style={{ textAlign:'center', padding:'4rem', color:'var(--muted)' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'.75rem' }}>
                <AlertTriangle size={40} color="var(--red)" strokeWidth={1.6} />
              </div>
              <h3 style={{ fontWeight:700, marginBottom:'.5rem', color:'var(--ink)' }}>No pudimos cargar las propiedades</h3>
              <p style={{ fontSize:14 }}>Hubo un problema de conexión con el servidor. Intenta recargar la página en un momento.</p>
            </div>
          ) : (loading && resultados === null) ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'5rem', gap:'1rem', color:'var(--muted)' }}>
              <div className="pec-spinner" />
              <p style={{ fontWeight:600, fontSize:14 }}>Cargando propiedades...</p>
            </div>
          ) : buscando ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'4rem', gap:'1rem', color:'var(--muted)' }}>
              <div className="pec-spinner" />
              <p style={{ fontWeight:600, fontSize:14 }}>Buscando...</p>
            </div>
          ) : (propsMostradas.length === 0 && desarrollosFiltrados.length === 0) ? (
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
          ) : propsMostradas.length > 0 ? (
            <>
              <div className="pec-grid">
                {propsMostradas.map((p, i) => (
                  <Card key={p.id} propiedad={p} i={i} fav={favs[p.id]} onFav={toggleFav} loaded={loaded} popular={popularIds.has(p.id)} />
                ))}
              </div>

              {puedeVerMas && (
                <div className="pec-more">
                  <button onClick={verMas} disabled={loadingMore}>
                    {loadingMore ? 'Cargando...' : 'Ver más propiedades'}
                  </button>
                </div>
              )}
            </>
          ) : null}

        </div>

        <footer className="pec-ft">
          <div className="pec-ft-in">
            <div>
              <b>Propiedades en Chiapas</b>
              <div style={{ marginTop:6, fontSize:13 }}>El portal inmobiliario #1 de Chiapas</div>
            </div>
            <button className="login-ft" onClick={() => navigate('/crm')}>Iniciar sesión</button>
            <a className="privacy-ft" href="/privacidad">Aviso de Privacidad</a>
          </div>
        </footer>

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

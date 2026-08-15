import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Search, X,
  Home as HomeIcon, Building2, Trees, Store, Warehouse, Beef,
  TreePine, Briefcase, Sparkles, ChevronDown,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import PropertyCard from './PropertyCard';
import DevelopmentCard from './DevelopmentCard';
import { DESARROLLOS } from '../data/desarrollos';

const PAGE_SIZE = 24;

const CATEGORIES = [
  { id: 'todas',        label: 'Todas',         Icon: Sparkles   },
  { id: 'casa',         label: 'Casas',          Icon: HomeIcon   },
  { id: 'departamento', label: 'Departamentos',  Icon: Building2  },
  { id: 'terreno',      label: 'Terrenos',       Icon: Trees      },
  { id: 'local',        label: 'Locales',        Icon: Store      },
  { id: 'bodega',       label: 'Bodegas',        Icon: Warehouse  },
  { id: 'rancho',       label: 'Ranchos',        Icon: Beef       },
  { id: 'quinta',       label: 'Quintas',        Icon: TreePine   },
  { id: 'oficina',      label: 'Oficinas',       Icon: Briefcase  },
];

const EXCLUDE_TITLES = [
  '%Premium en %',
  'Residencia Casa Premier%',
  'Fraccionamiento Master%',
  'Lotes de Inversión Premium%',
  'Lote Comercial Estratégico%',
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes spin    { to { transform:rotate(360deg); } }
  @keyframes pulse-wa {
    0%   { box-shadow:0 0 0 0 rgba(37,211,102,.6); }
    70%  { box-shadow:0 0 0 16px rgba(37,211,102,0); }
    100% { box-shadow:0 0 0 0 rgba(37,211,102,0); }
  }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  .pec {
    --ink:#222222;
    --primary:#1A365D;
    --primary-hover:#12284C;
    --bg:#ffffff;
    --muted:#717171;
    --line:#dddddd;
    --emerald:#10b981;
    font-family:'Plus Jakarta Sans','Inter',sans-serif;
    color:var(--ink); background:var(--bg); min-height:100%;
    -webkit-font-smoothing:antialiased;
  }
  .pec * { box-sizing:border-box; margin:0; padding:0; }
  .pec-hd {
    position:sticky; top:0; z-index:100;
    background:white; border-bottom:1px solid var(--line);
  }
  .pec-hd-in {
    max-width:1440px; margin:0 auto; padding:1rem 1.5rem;
    display:flex; align-items:center; justify-content:space-between; gap:12px;
  }
  .pec-logo { display:flex; align-items:center; gap:10px; min-width:0; text-decoration:none; color:inherit; }
  .pec-mark {
    width:36px; height:36px; border-radius:10px; flex:none;
    background:linear-gradient(145deg,var(--primary),#1E3A9B);
    display:grid; place-items:center;
  }
  .pec-logo b { font-size:14px; font-weight:800; letter-spacing:-.3px; white-space:nowrap; }
  .pec-logo small { display:block; font-size:10px; color:var(--emerald); font-weight:700; letter-spacing:.6px; text-transform:uppercase; margin-top:1px; }
  .pec-pill-wrap { flex:1; max-width:480px; margin:0 auto; }
  .pec-search-pill {
    display:flex; align-items:center;
    border:1px solid var(--line); border-radius:40px;
    padding:.45rem .45rem .45rem 1.1rem;
    box-shadow:0 1px 2px rgba(0,0,0,.08),0 4px 12px rgba(0,0,0,.05);
    background:white; transition:box-shadow .2s;
  }
  .pec-search-pill:focus-within { box-shadow:0 2px 4px rgba(0,0,0,.18); }
  .pec-search-pill input {
    flex:1; border:none; outline:none; font-family:inherit;
    font-size:.9rem; font-weight:600; color:var(--ink); background:transparent; min-width:0;
  }
  .pec-search-pill input::placeholder { color:var(--muted); font-weight:500; }
  .pec-search-pill-btn {
    background:var(--primary); color:white; border:none; border-radius:50%;
    width:34px; height:34px; display:flex; align-items:center; justify-content:center;
    cursor:pointer; flex:none; transition:background .2s;
  }
  .pec-search-pill-btn:hover { background:var(--primary-hover); }
  .pec-login {
    flex:none; border:1.5px solid var(--line); color:var(--ink);
    background:transparent; font-weight:700; font-size:13px;
    padding:8px 16px; border-radius:999px; cursor:pointer; transition:.18s;
    font-family:inherit; white-space:nowrap;
  }
  .pec-login:hover { border-color:var(--ink); }
  .pec-cats-wrap {
    position:sticky; top:69px; background:white; z-index:99;
    border-bottom:1px solid var(--line); padding:.75rem 0;
  }
  .pec-cats {
    max-width:1440px; margin:0 auto; padding:0 1.5rem;
    display:flex; gap:2rem; overflow-x:auto; scrollbar-width:none;
  }
  .pec-cats::-webkit-scrollbar { display:none; }
  .pec-cat {
    flex:none; display:flex; flex-direction:column; align-items:center; gap:.4rem;
    color:var(--muted); cursor:pointer; min-width:max-content; transition:color .2s;
    border-bottom:2px solid transparent; padding-bottom:.5rem;
    background:none; border-top:none; border-left:none; border-right:none; font-family:inherit;
  }
  .pec-cat:hover { color:var(--ink); border-bottom-color:var(--ink); }
  .pec-cat.on    { color:var(--ink); border-bottom-color:var(--ink); }
  .pec-cat span  { font-size:.8rem; font-weight:600; }
  .pec-wrap { max-width:1440px; margin:0 auto; padding:1.5rem 1.5rem 6rem; }
  .pec-toolbar {
    display:flex; align-items:center; justify-content:space-between;
    gap:10px; margin-bottom:1.25rem; flex-wrap:wrap;
  }
  .pec-count { font-size:.95rem; color:var(--muted); }
  .pec-count b { color:var(--ink); font-weight:700; }
  .pec-clear-btn {
    background:none; border:1.5px solid var(--line); color:var(--ink);
    font-size:.85rem; font-weight:700; padding:6px 14px; border-radius:999px;
    cursor:pointer; font-family:inherit; transition:.16s; display:flex; align-items:center; gap:5px;
  }
  .pec-clear-btn:hover { border-color:var(--ink); }
  .pec-grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
    gap:2rem 1.5rem;
  }
  .pec-spinner {
    width:36px; height:36px; border-radius:50%;
    border:3px solid var(--line); border-top-color:var(--primary);
    animation:spin .8s linear infinite;
  }
  .pec-load-more {
    background:white; color:var(--ink);
    border:1.5px solid var(--ink); border-radius:999px;
    font-size:.9rem; font-weight:700; padding:12px 32px;
    cursor:pointer; font-family:inherit; transition:.2s;
    display:flex; align-items:center; gap:8px;
  }
  .pec-load-more:hover { background:var(--ink); color:white; }
  .pec-load-more:disabled { opacity:.6; cursor:not-allowed; }
  .pec-empty { text-align:center; padding:5rem 1rem; color:var(--muted); animation:fadeUp .4s ease; }
  .pec-empty-emoji { font-size:3rem; margin-bottom:.75rem; }
  .pec-empty h3 { font-size:1.2rem; font-weight:700; margin-bottom:.5rem; color:var(--ink); }
  .wa-btn {
    position:fixed; bottom:1.75rem; right:1.5rem; z-index:9000;
    width:54px; height:54px; border-radius:50%;
    background:#25D366; display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 16px rgba(37,211,102,.5);
    animation:pulse-wa 2.5s ease infinite; text-decoration:none;
  }
  .pec-ft { background:#222; color:rgba(255,255,255,.6); padding:2.5rem 1.5rem; }
  .pec-ft-in {
    max-width:1440px; margin:0 auto;
    display:flex; flex-direction:column; align-items:center; text-align:center; gap:1rem;
  }
  .pec-ft b { color:#fff; font-size:14px; font-weight:800; }
  .pec-ft .login-ft {
    color:rgba(255,255,255,.8); font-weight:700; text-decoration:none; font-size:14px;
    border:1.5px solid rgba(255,255,255,.2); padding:10px 26px; border-radius:999px; transition:.18s;
  }
  .pec-ft .login-ft:hover { color:#fff; border-color:#fff; background:rgba(255,255,255,.08); }
  .pec-ft .privacy-ft { color:rgba(255,255,255,.4); font-size:12px; text-decoration:none; transition:.18s; }
  .pec-ft .privacy-ft:hover { color:rgba(255,255,255,.75); }
  @media(max-width:768px) {
    .pec-hd-in { padding:.8rem 1rem; gap:8px; }
    .pec-logo small { display:none; }
    .pec-pill-wrap { max-width:none; }
    .pec-cats { padding:0 1rem; gap:1.5rem; }
    .pec-wrap { padding:1rem 1rem 5rem; }
    .pec-grid { grid-template-columns:1fr; gap:1.5rem; }
    .pec-login { display:none; }
  }
  @media(min-width:560px) and (max-width:920px) {
    .pec-grid { grid-template-columns:1fr 1fr; }
  }
`;

const applyExclusions = (query) => {
  EXCLUDE_TITLES.forEach(t => { query = query.not('title', 'ilike', t); });
  return query;
};

export default function Home({ session }) {
  const navigate = useNavigate();
  const [active,      setActive]      = useState('todas');
  const [q,           setQ]           = useState('');
  const [qInput,      setQInput]      = useState('');
  const [propiedades, setPropiedades] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(0);
  const [hasMore,     setHasMore]     = useState(true);

  const buildQuery = useCallback((from, to) => {
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('active', true)
      .order('created_at', { ascending: false })
      .range(from, to);
    query = applyExclusions(query);
    if (q.trim()) {
      query = query.or(`title.ilike.%${q}%,city.ilike.%${q}%,address.ilike.%${q}%`);
    }
    if (active !== 'todas') {
      query = query.ilike('type', `%${active}%`);
    }
    return query;
  }, [q, active]);

  useEffect(() => {
    const fetchInit = async () => {
      setLoading(true);
      try {
        const { data, error, count } = await buildQuery(0, PAGE_SIZE - 1);
        if (error) throw error;
        setPropiedades(data || []);
        setTotal(count || 0);
        setPage(0);
        setHasMore((data?.length || 0) >= PAGE_SIZE);
      } catch {
        setPropiedades([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInit();
  }, [buildQuery]);

  const cargarMas = async () => {
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to   = from + PAGE_SIZE - 1;
    setLoadingMore(true);
    try {
      const { data, error } = await buildQuery(from, to);
      if (error) throw error;
      setPropiedades(prev => [...prev, ...(data || [])]);
      setPage(nextPage);
      setHasMore((data?.length || 0) >= PAGE_SIZE);
    } catch {
      // silencioso
    } finally {
      setLoadingMore(false);
    }
  };

  const buscar = () => setQ(qInput.trim());

  const seleccionarCat = (catId) => {
    setActive(prev => prev === catId ? 'todas' : catId);
    setQ(''); setQInput('');
  };

  const limpiar = () => { setQ(''); setQInput(''); setActive('todas'); };

  const hayFiltros = q || active !== 'todas';

  return (
    <>
      <style>{STYLES}</style>
      <Helmet>
        <title>Propiedades en Chiapas — Casas, Terrenos y Más</title>
        <meta name="description" content="Encuentra casas, terrenos, departamentos y locales en Chiapas. Portal inmobiliario #1." />
        <meta property="og:title" content="Propiedades en Chiapas" />
        <meta property="og:description" content="Portal inmobiliario #1 en Chiapas." />
        <meta property="og:image" content="https://propiedadesenchiapas.com/og-portal.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://propiedadesenchiapas.com" />
        <meta name="theme-color" content="#1A365D" />
      </Helmet>

      <div className="pec">

        <header className="pec-hd">
          <div className="pec-hd-in">
            <a className="pec-logo" href="/">
              <div className="pec-mark">
                <HomeIcon size={18} color="#fff" strokeWidth={2.4} />
              </div>
              <div>
                <b>Propiedades en Chiapas</b>
                <small>Portal Inmobiliario</small>
              </div>
            </a>

            <div className="pec-pill-wrap">
              <div className="pec-search-pill">
                <input
                  id="search-input"
                  placeholder="Busca por colonia, municipio o tipo…"
                  value={qInput}
                  onChange={e => setQInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && buscar()}
                  aria-label="Buscar propiedades"
                />
                {qInput && (
                  <button
                    onClick={() => { setQInput(''); setQ(''); }}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'#717171', padding:'0 6px', lineHeight:0, display:'flex', alignItems:'center' }}
                    aria-label="Limpiar búsqueda"
                  >
                    <X size={15} />
                  </button>
                )}
                <button className="pec-search-pill-btn" onClick={buscar} aria-label="Buscar">
                  <Search size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <button className="pec-login" onClick={() => navigate('/crm')}>
              Iniciar sesión
            </button>
          </div>
        </header>

        <nav className="pec-cats-wrap" aria-label="Filtrar por tipo">
          <div className="pec-cats">
            {CATEGORIES.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={'pec-cat' + (active === id ? ' on' : '')}
                onClick={() => seleccionarCat(id)}
                aria-pressed={active === id}
              >
                <Icon size={22} strokeWidth={1.8} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="pec-wrap">
          {!loading && (
            <div className="pec-toolbar">
              <p className="pec-count">
                {hayFiltros
                  ? <><b>{total.toLocaleString('es-MX')}</b> propiedad{total !== 1 ? 'es' : ''} encontrada{total !== 1 ? 's' : ''}</>
                  : <><b>{total.toLocaleString('es-MX')}</b> propiedades disponibles en Chiapas</>
                }
              </p>
              {hayFiltros && (
                <button className="pec-clear-btn" onClick={limpiar}>
                  <X size={14} /> Limpiar filtros
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'6rem 1rem', gap:'1rem', color:'#717171' }}>
              <div className="pec-spinner" />
              <p style={{ fontWeight:600, fontSize:14 }}>Cargando propiedades...</p>
            </div>
          ) : (
            <>
              {/* ── Sección Desarrollos: solo visible sin filtros activos ── */}
              {!hayFiltros && (
                <section aria-label="Desarrollos destacados" style={{ marginBottom: '2.5rem' }}>
                  <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:12, marginBottom:'1rem' }}>
                    <div>
                      <h2 style={{ fontSize:'1.1rem', fontWeight:700, color:'#222', letterSpacing:'-.3px' }}>Desarrollos</h2>
                      <p style={{ fontSize:'.85rem', color:'#717171', marginTop:2 }}>Proyectos con financiamiento directo</p>
                    </div>
                  </div>
                  <div className="pec-grid">
                    {DESARROLLOS.map(dev => (
                      <DevelopmentCard
                        key={dev.id}
                        dev={dev}
                        onClick={() => navigate('/' + dev.slug)}
                      />
                    ))}
                  </div>
                  {/* Separador */}
                  <div style={{ borderTop:'1px solid #dddddd', margin:'2.5rem 0 0', paddingTop:'2rem' }}>
                    <h2 style={{ fontSize:'1.1rem', fontWeight:700, color:'#222', letterSpacing:'-.3px', marginBottom:4 }}>Propiedades individuales</h2>
                    <p style={{ fontSize:'.85rem', color:'#717171' }}>{total.toLocaleString('es-MX')} propiedades disponibles</p>
                  </div>
                </section>
              )}

              {/* ── Grid de propiedades ── */}
              {propiedades.length === 0 && hayFiltros ? (
                <div className="pec-empty">
                  <div className="pec-empty-emoji">🔍</div>
                  <h3>No encontramos propiedades</h3>
                  <p style={{ fontSize:14, marginBottom:'1.25rem' }}>Intenta con otros filtros o amplía la búsqueda.</p>
                  <button
                    onClick={limpiar}
                    style={{ background:'#222', color:'#fff', border:'none', borderRadius:999, padding:'12px 28px', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}
                  >
                    Ver todas las propiedades
                  </button>
                </div>
              ) : (
                <>
                  <div className="pec-grid" id="properties-grid">
                    {propiedades.map((p) => (
                      <PropertyCard
                        key={p.id}
                        property={p}
                        onClick={() => navigate('/propiedad/' + p.id)}
                      />
                    ))}
                  </div>

                  {hasMore && (
                    <div style={{ display:'flex', justifyContent:'center', marginTop:'3rem' }}>
                      <button
                        className="pec-load-more"
                        onClick={cargarMas}
                        disabled={loadingMore}
                        aria-label="Cargar más propiedades"
                      >
                        {loadingMore ? (
                          <>
                            <div className="pec-spinner" style={{ width:20, height:20, borderWidth:2 }} />
                            Cargando…
                          </>
                        ) : (
                          <>
                            <ChevronDown size={18} strokeWidth={2.5} />
                            Mostrar más propiedades
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {!hasMore && propiedades.length > 0 && (
                    <p style={{ textAlign:'center', color:'#717171', fontSize:13, marginTop:'2.5rem', fontWeight:500 }}>
                      Mostrando las {propiedades.length} propiedades disponibles
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </main>

        <footer className="pec-ft">
          <div className="pec-ft-in">
            <div>
              <b>Propiedades en Chiapas</b>
              <div style={{ marginTop:6, fontSize:13 }}>El portal inmobiliario de Chiapas</div>
            </div>
            <a className="login-ft" href="/crm">Iniciar sesión</a>
            <a className="privacy-ft" href="/aviso-de-privacidad">Aviso de Privacidad</a>
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

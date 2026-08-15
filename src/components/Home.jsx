import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import DevelopmentDetailModal from './DevelopmentDetailModal';
import { DESARROLLOS } from '../data/desarrollos';

const PAGE_SIZE = 24;

const CATEGORY_DEFINITIONS = [
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
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes pulse-wa {
    0%   { box-shadow:0 0 0 0 rgba(37,211,102,.6); }
    70%  { box-shadow:0 0 0 16px rgba(37,211,102,0); }
    100% { box-shadow:0 0 0 0 rgba(37,211,102,0); }
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

  .pec {
    --ink:#1e293b;
    --primary:#1A365D;
    --primary-hover:#12284C;
    --bg:#ffffff;
    --muted:#64748b;
    --line:#e2e8f0;
    --emerald:#10b981;
    font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif;
    color:var(--ink); background:var(--bg); min-height:100vh;
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
  .pec-logo { display:flex; align-items:center; gap:10px; text-decoration:none; color:inherit; flex:none; }
  .pec-mark {
    width:38px; height:38px; border-radius:12px; flex:none;
    background:linear-gradient(145deg,var(--primary),#1E3A9B);
    display:grid; place-items:center; box-shadow:0 4px 12px rgba(26,54,93,.2);
  }
  .pec-logo b { font-size:15px; font-weight:800; letter-spacing:-.3px; white-space:nowrap; }
  .pec-logo small { display:block; font-size:10px; color:var(--emerald); font-weight:700; letter-spacing:.6px; text-transform:uppercase; margin-top:1px; }

  .pec-pill-wrap { flex:1; max-width:460px; margin:0 auto; }
  .pec-search-pill {
    display:flex; align-items:center;
    border:1px solid var(--line); border-radius:40px;
    padding:.35rem .35rem .35rem 1.1rem;
    box-shadow:0 1px 3px rgba(0,0,0,.06),0 4px 12px rgba(0,0,0,.03);
    background:white; transition:all .2s;
  }
  .pec-search-pill:focus-within { border-color:var(--primary); box-shadow:0 2px 10px rgba(26,54,93,.15); }
  .pec-search-pill input {
    flex:1; border:none; outline:none; font-family:inherit;
    font-size:.88rem; font-weight:600; color:var(--ink); background:transparent; min-width:0;
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
    padding:8px 18px; border-radius:999px; cursor:pointer; transition:.18s;
    font-family:inherit; white-space:nowrap;
  }
  .pec-login:hover { border-color:var(--ink); background:#f8fafc; }

  .pec-cats-wrap {
    position:sticky; top:65px; background:rgba(255,255,255,0.96); backdrop-filter:blur(10px);
    z-index:99; border-bottom:1px solid var(--line); padding:.6rem 0;
  }
  .pec-cats {
    max-width:1440px; margin:0 auto; padding:0 1.5rem;
    display:flex; gap:.6rem; overflow-x:auto; scrollbar-width:none;
    -webkit-overflow-scrolling:touch;
  }
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

  .pec-wrap { max-width:1440px; margin:0 auto; padding:1.5rem 1.5rem 6rem; }
  .pec-toolbar {
    display:flex; align-items:center; justify-content:space-between;
    gap:10px; margin-bottom:1.5rem; flex-wrap:wrap;
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

  .pec-spinner {
    width:32px; height:32px; border-radius:50%;
    border:3px solid var(--line); border-top-color:var(--primary);
    animation:spin .8s linear infinite;
  }

  .pec-load-more {
    background:white; color:var(--ink);
    border:1.5px solid var(--ink); border-radius:999px;
    font-size:.9rem; font-weight:700; padding:12px 32px;
    cursor:pointer; font-family:inherit; transition:.2s;
    display:flex; align-items:center; gap:8px; margin:0 auto;
  }
  .pec-load-more:hover { background:var(--ink); color:white; }
  .pec-load-more:disabled { opacity:.6; cursor:not-allowed; }

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
  }
  .pec-ft .login-ft:hover { color:#fff; border-color:#fff; background:rgba(255,255,255,.1); }
  .pec-ft .privacy-ft { color:rgba(255,255,255,.4); font-size:12px; text-decoration:none; transition:.18s; }
  .pec-ft .privacy-ft:hover { color:rgba(255,255,255,.75); }

  @media(max-width:768px) {
    .pec-hd-in { padding:.6rem 1rem; gap:8px; }
    .pec-logo small { display:none; }
    .pec-pill-wrap { max-width:none; }
    .pec-cats { padding:0 1rem; gap:.4rem; }
    .pec-cat-ios { padding:6px 14px; font-size:12px; }
    .pec-wrap { padding:1rem 1rem 5rem; }
    .pec-grid { grid-template-columns:1fr; gap:1.5rem; }
    .pec-login { display:none; }
  }
  @media(min-width:560px) and (max-width:920px) {
    .pec-grid { grid-template-columns:1fr 1fr; }
  }
`;

export default function Home({ session }) {
  const navigate = useNavigate();
  const [active,      setActive]      = useState('todas');
  const [q,           setQ]           = useState('');
  const [qInput,      setQInput]      = useState('');
  const [propiedades, setPropiedades] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [dbTotal,     setDbTotal]     = useState(0);
  const [page,        setPage]        = useState(0);
  const [hasMore,     setHasMore]     = useState(false);
  const [selectedDev, setSelectedDev] = useState(null);

  // Consulta Supabase ultra-segura
  const buildQuery = useCallback((from, to) => {
    try {
      let query = supabase
        .from('properties')
        .select('id, title, price, city, municipality, address, type, bedrooms, bathrooms, size_m2, featured_image_url, amenities, status, created_at', { count: 'exact' })
        .eq('active', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (q.trim()) {
        query = query.or(`title.ilike.%${q}%,city.ilike.%${q}%,address.ilike.%${q}%`);
      }
      if (active !== 'todas') {
        query = query.ilike('type', `%${active}%`);
      }
      return query;
    } catch {
      return null;
    }
  }, [q, active]);

  useEffect(() => {
    let isMounted = true;
    const fetchInit = async () => {
      try {
        const query = buildQuery(0, PAGE_SIZE - 1);
        if (!query) return;
        
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 1500)
        );

        const { data, error, count } = await Promise.race([query, timeoutPromise]).catch((err) => {
          console.error('[Supabase Query Error]:', err);
          return { data: [], error: null, count: 0 };
        });
        
        if (error) {
          console.error('[Supabase REST Error]:', error);
          throw error;
        }
        if (isMounted && Array.isArray(data)) {
          setPropiedades(data);
          setDbTotal(count || 0);
          setPage(0);
          setHasMore(data.length >= PAGE_SIZE);
        }
      } catch (err) {
        console.error('[Home Load Fallback]: Utilizando catálogo local estático.', err);
        if (isMounted) {
          setPropiedades([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchInit();
    return () => { isMounted = false; };
  }, [buildQuery]);

  const cargarMas = async () => {
    const nextPage = page + 1;
    const from = nextPage * PAGE_SIZE;
    const to   = from + PAGE_SIZE - 1;
    setLoadingMore(true);
    try {
      const query = buildQuery(from, to);
      if (!query) return;
      const { data, error } = await query;
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

  // Desarrollos de la lista estática (Garantizados 100%)
  const desarrollosFiltrados = useMemo(() => {
    const list = Array.isArray(DESARROLLOS) ? DESARROLLOS : [];
    
    let statusMap = {};
    try {
      const saved = localStorage.getItem('pec_static_landings_status');
      if (saved) statusMap = JSON.parse(saved);
    } catch {}

    return list.filter(dev => {
      if (statusMap[`sys-${dev.slug}`] === false || statusMap[dev.id] === false) {
        return false;
      }
      const matchesCat = active === 'todas' || dev.tipo === active;
      const matchesSearch = !q.trim() || 
        (dev.titulo && dev.titulo.toLowerCase().includes(q.toLowerCase())) || 
        (dev.ciudad && dev.ciudad.toLowerCase().includes(q.toLowerCase())) ||
        (dev.descripcion && dev.descripcion.toLowerCase().includes(q.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [active, q]);

  // Conteo de elementos por categoría
  const categoryCounts = useMemo(() => {
    const list = desarrollosFiltrados;
    const counts = { todas: dbTotal + list.length };

    list.forEach(d => {
      const t = d.tipo || 'terreno';
      counts[t] = (counts[t] || 0) + 1;
    });

    propiedades.forEach(p => {
      const t = (p.type || '').toLowerCase();
      if (t.includes('casa')) counts['casa'] = (counts['casa'] || 0) + 1;
      else if (t.includes('terreno')) counts['terreno'] = (counts['terreno'] || 0) + 1;
      else if (t.includes('departamento')) counts['departamento'] = (counts['departamento'] || 0) + 1;
      else if (t.includes('local')) counts['local'] = (counts['local'] || 0) + 1;
      else if (t.includes('bodega')) counts['bodega'] = (counts['bodega'] || 0) + 1;
      else if (t.includes('rancho')) counts['rancho'] = (counts['rancho'] || 0) + 1;
      else if (t.includes('quinta')) counts['quinta'] = (counts['quinta'] || 0) + 1;
      else if (t.includes('oficina')) counts['oficina'] = (counts['oficina'] || 0) + 1;
    });

    return counts;
  }, [dbTotal, propiedades, desarrollosFiltrados]);

  // Ocultar botones de categoría que NO tengan elementos
  const availableCategories = useMemo(() => {
    return CATEGORY_DEFINITIONS.filter(cat => {
      if (cat.id === 'todas') return true;
      return (categoryCounts[cat.id] || 0) > 0;
    });
  }, [categoryCounts]);

  const totalItemsCount = desarrollosFiltrados.length + propiedades.length;

  return (
    <>
      <style>{STYLES}</style>
      <Helmet>
        <title>Propiedades en Chiapas — Casas, Terrenos y Desarrollos</title>
        <meta name="description" content="Encuentra casas, terrenos, desarrollos y locales comerciales en Chiapas. Portal inmobiliario #1 de Chiapas." />
        <meta property="og:title" content="Propiedades en Chiapas" />
        <meta property="og:description" content="Portal inmobiliario #1 en Chiapas." />
        <meta property="og:image" content="https://propiedadesenchiapas.com/og-portal.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://propiedadesenchiapas.com" />
        <meta name="theme-color" content="#1A365D" />
      </Helmet>

      <div className="pec">

        {/* Modal de Ficha Inmobiliaria Completa */}
        {selectedDev && (
          <DevelopmentDetailModal
            dev={selectedDev}
            onClose={() => setSelectedDev(null)}
          />
        )}

        {/* Header Compacto Airbnb */}
        <header className="pec-hd">
          <div className="pec-hd-in">
            <a className="pec-logo" href="/">
              <div className="pec-mark">
                <HomeIcon size={19} color="#fff" strokeWidth={2.4} />
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
                  placeholder="Busca por colonia, municipio, desarrollo..."
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

        {/* Categorías Tipo iOS */}
        <nav className="pec-cats-wrap" aria-label="Filtrar categorías">
          <div className="pec-cats">
            {availableCategories.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={'pec-cat-ios' + (active === id ? ' on' : '')}
                onClick={() => seleccionarCat(id)}
                aria-pressed={active === id}
              >
                <Icon size={16} strokeWidth={2.2} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Contenido Principal */}
        <main className="pec-wrap">
          <div className="pec-toolbar">
            <p className="pec-count">
              {hayFiltros
                ? <><b>{totalItemsCount.toLocaleString('es-MX')}</b> resultados encontrados</>
                : <><b>{(dbTotal + desarrollosFiltrados.length).toLocaleString('es-MX')}</b> opciones disponibles en Chiapas</>
              }
            </p>
            {hayFiltros && (
              <button className="pec-clear-btn" onClick={limpiar}>
                <X size={14} /> Limpiar filtros
              </button>
            )}
          </div>

          {/* ── Grid de Desarrollos e Inmuebles ── */}
          {desarrollosFiltrados.length > 0 && (
            <section aria-label="Desarrollos y Landings" style={{ marginBottom: '2.5rem' }}>
              <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:12, marginBottom:'1rem' }}>
                <div>
                  <h2 style={{ fontSize:'1.15rem', fontWeight:800, color:'#1e293b', letterSpacing:'-.3px' }}>
                    Desarrollos & Fichas Destacadas
                  </h2>
                  <p style={{ fontSize:'.85rem', color:'#64748b', marginTop:2 }}>
                    Haz clic en cualquier tarjeta para abrir su ficha inmobiliaria completa
                  </p>
                </div>
              </div>

              <div className="pec-grid">
                {desarrollosFiltrados.map(dev => (
                  <DevelopmentCard
                    key={dev.id}
                    dev={dev}
                    onClick={() => setSelectedDev(dev)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── Grid de Propiedades Individuales de DB ── */}
          {propiedades.length > 0 && (
            <section aria-label="Propiedades">
              {desarrollosFiltrados.length > 0 && (
                <div style={{ borderTop:'1px solid #e2e8f0', margin:'2rem 0 1.5rem', paddingTop:'1.5rem' }}>
                  <h2 style={{ fontSize:'1.15rem', fontWeight:800, color:'#1e293b', letterSpacing:'-.3px', marginBottom:4 }}>
                    Propiedades Individuales
                  </h2>
                  <p style={{ fontSize:'.85rem', color:'#64748b' }}>
                    {dbTotal.toLocaleString('es-MX')} propiedades activas en Chiapas
                  </p>
                </div>
              )}

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
                        <div className="pec-spinner" style={{ width:18, height:18, borderWidth:2 }} />
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
            </section>
          )}
        </main>

        <footer className="pec-ft">
          <div className="pec-ft-in">
            <div>
              <b>Propiedades en Chiapas</b>
              <div style={{ marginTop:6, fontSize:13 }}>El portal inmobiliario #1 de Chiapas</div>
            </div>
            <a className="login-ft" href="/crm">Iniciar sesión</a>
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

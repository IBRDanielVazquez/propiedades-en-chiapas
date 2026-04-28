import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PropertyCard from './components/PropertyCard';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { supabase } from './supabaseClient';
import { SAMPLE_PROPERTIES } from './data/sampleData';
import chiapasData from './data/chiapasLocations.json';

export default function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDashboard, setIsDashboard] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todas');

  // Filters
  const [filterOp, setFilterOp] = useState('Todas');
  const [filterMuni, setFilterMuni] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');

  const municipalities = Object.keys(chiapasData).sort();

  const categories = [
    { name: 'Todas',                    filter: '',                    icon: 'M16 2.5L2 12h3v14h7v-8h8v8h7V12h3z' },
    { name: 'Casas',                    filter: 'casa',                icon: 'M16 2.5L2 12h3v14h7v-8h8v8h7V12h3z' },
    { name: 'Departamentos',            filter: 'departamento',        icon: 'M4 2v28h24V2zm6 24H8v-2h2zm0-4H8v-2h2zm0-4H8v-2h2zm0-4H8v-2h2zm0-4H8V8h2zm6 16h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2zm6 16h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2z' },
    { name: 'Lotes Residenciales',      filter: 'lote residencial',    icon: 'M2 14v16h28V14z M6 26v-4h4v4z M14 26v-6h4v6z M22 26v-8h4v8z M16 2L2 12h28z' },
    { name: 'Terrenos Comerciales',     filter: 'terreno comercial',   icon: 'M2 14v16h28V14z M6 26v-4h4v4z M14 26v-6h4v6z M22 26v-8h4v8z' },
    { name: 'Terrenos Agrícolas',       filter: 'agrícola',            icon: 'M16 2L2 12h28z M16 26v-8' },
    { name: 'Bodegas',                  filter: 'bodega',              icon: 'M4 4v24h24V4zm6 20H8v-4h2zm0-8H8v-4h2zm8 8h-2v-4h2zm0-8h-2v-4h2zm8 8h-2v-4h2zm0-8h-2v-4h2z' },
    { name: 'Locales Comerciales',      filter: 'local comercial',     icon: 'M2 10v18h28V10l-14-6-14 6zm6 14H6v-6h2v6zm6 0h-2v-8h2v8zm6 0h-2v-6h2v6zm6 0h-2v-8h2v8z' },
    { name: 'Oficinas',                 filter: 'oficina',             icon: 'M6 2v28h20V2zm4 24H8v-2h2zm0-4H8v-2h2zm0-4H8v-2h2zm0-4H8V8h2zm8 12h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2z' },
    { name: 'Edificios',                filter: 'edificio',            icon: 'M8 2v28h16V2zm4 24h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2zm4 12h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2z' },
    { name: 'Ranchos',                  filter: 'rancho',              icon: 'M2 20h28v4H2z M6 10h20v8H6z M16 2l6 6H10z' },
    { name: 'Quintas',                  filter: 'quinta',              icon: 'M16 4A12 12 0 1 0 28 16 12 12 0 0 0 16 4zm0 22A10 10 0 1 1 26 16 10 10 0 0 1 16 26z' },
    { name: 'Naves Industriales',       filter: 'nave industrial',     icon: 'M2 12l6-6v6l6-6v6l6-6v6l6-6v20H2z' },
    { name: 'Desarrollos en Preventa',  filter: 'desarrollo',          icon: 'M16 2l14 10h-4v16H6V12H2L16 2zm-4 16h8v4h-8v-4z' }
  ];

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data && data.length > 0 ? data : SAMPLE_PROPERTIES.filter(p => p.active));
    } catch (err) {
      console.warn('Portal: usando sample data', err.message);
      setProperties(SAMPLE_PROPERTIES.filter(p => p.active));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.location.pathname.includes('/nuevo')) setIsDashboard(true);
  }, []);

  if (isLogin) return <Login onLoginSuccess={() => { setIsLogin(false); setIsDashboard(true); }} onBack={() => setIsLogin(false)} />;
  if (isDashboard) return <Dashboard onLogout={() => setIsDashboard(false)} />;

  // ── Filtered properties ──────────────────────────────────────────────────
  const applyFilters = (list) => list.filter(p => {
    const cat = categories.find(c => c.name === activeCategory);
    if (cat?.filter && !p.type?.toLowerCase().includes(cat.filter)) return false;
    if (filterOp !== 'Todas' && p.operation_type !== filterOp) return false;
    if (filterMuni && p.municipality !== filterMuni) return false;
    if (filterPriceMax && p.price > parseFloat(filterPriceMax)) return false;
    return true;
  });

  const filteredProperties = applyFilters(properties);
  const hasFilters = filterOp !== 'Todas' || filterMuni || filterPriceMax;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Navbar onLogin={() => setIsLogin(true)} />

      {/* Categories Bar */}
      <div className="categories-wrapper container">
        <div className="categories-scroll">
          {categories.map(cat => (
            <div
              key={cat.name}
              className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '24px', width: '24px', fill: 'currentcolor' }}>
                <path d={cat.icon}></path>
              </svg>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────────── */}
      <div style={{
        background: '#ffffff', borderBottom: '1px solid #e2e8f0',
        padding: '0.65rem 0', position: 'sticky', top: '135px', zIndex: 98
      }}>
        <div className="container" style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {['Todas', 'Venta', 'Renta'].map(op => (
            <button key={op} onClick={() => setFilterOp(op)} style={{
              padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s',
              background: filterOp === op ? 'var(--primary)' : '#f1f5f9',
              color: filterOp === op ? '#ffffff' : '#475569',
              border: filterOp === op ? '1px solid var(--primary)' : '1px solid #e2e8f0'
            }}>{op}</button>
          ))}

          <select value={filterMuni} onChange={e => setFilterMuni(e.target.value)} style={{
            padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid #e2e8f0',
            fontSize: '0.8rem', fontWeight: '600', color: '#475569', background: '#f1f5f9', cursor: 'pointer', outline: 'none'
          }}>
            <option value="">📍 Municipio</option>
            {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', borderRadius: '20px', padding: '0.35rem 0.75rem', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>💰 Máx.</span>
            <input
              type="number"
              placeholder="Sin límite"
              value={filterPriceMax}
              onChange={e => setFilterPriceMax(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '90px', fontSize: '0.8rem', outline: 'none', color: '#1e293b', fontWeight: '600' }}
            />
          </div>

          {hasFilters && (
            <button onClick={() => { setFilterOp('Todas'); setFilterMuni(''); setFilterPriceMax(''); }} style={{
              padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
              cursor: 'pointer', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5'
            }}>✕ Limpiar</button>
          )}

          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>
            {filteredProperties.length} propiedad{filteredProperties.length !== 1 ? 'es' : ''}
          </span>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main className="container" style={{ paddingBottom: '6rem' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem', gap: '1rem', color: 'var(--text-muted)' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontWeight: '600', fontSize: '1rem' }}>Buscando lugares increíbles...</p>
          </div>
        ) : activeCategory === 'Todas' && !hasFilters ? (
          categories.slice(1).map(cat => {
            const catProps = properties.filter(p => p.type?.toLowerCase().includes(cat.filter));
            if (catProps.length === 0) return null;
            return (
              <div key={cat.name} className="category-section">
                <h2>{cat.name}</h2>
                <div className="properties-slider">
                  {catProps.map(property => <PropertyCard key={property.id} property={property} />)}
                </div>
              </div>
            );
          })
        ) : (
          <div className="properties-grid">
            {filteredProperties.length > 0
              ? filteredProperties.map(property => <PropertyCard key={property.id} property={property} />)
              : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
                  <h3>No encontramos propiedades con estos filtros.</h3>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Intenta ampliar la búsqueda.</p>
                </div>
              )
            }
          </div>
        )}
      </main>

      {/* Floating Map Button */}
      <button className="floating-map-btn">
        Mostrar mapa
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}>
          <path d="M31.2 5.6l-9.5-3.4c-.4-.1-.9-.1-1.3 0l-8.9 3.2-8.4-3.2c-.8-.3-1.7.3-1.7 1.2v20c0 .6.4 1.1 1 1.2l9.5 3.4c.4.1.9.1 1.3 0l8.9-3.2 8.4 3.2c.8.3 1.7-.3 1.7-1.2v-20c0-.6-.4-1.1-1-1.2zM12 26.5l-8-3V4.8l8 3v18.7zm10-1.8l-8 2.9V8.8l8-2.9v18.8zm8 3l-6-2.3V6.7l6 2.3v18.7z"></path>
        </svg>
      </button>

      {/* Footer */}
      <footer style={{ padding: '2rem', borderTop: '1px solid var(--border-color)', background: '#f7f7f7', marginTop: '2rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <div>&copy; 2026 Propiedades Chiapas, Inc. · Privacidad · Términos</div>
          <div style={{ display: 'flex', gap: '1rem', fontWeight: '500', color: 'var(--text-main)' }}>
            <span>🌐 Español (MX)</span>
            <span>$ MXN</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

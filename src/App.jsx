import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PropertyCard from './components/PropertyCard';
import PropertyTable from './components/PropertyTable';
import Dashboard from './components/Dashboard';
import { supabase } from './supabaseClient';

export default function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDashboard, setIsDashboard] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Casas');

  const categories = [
    { name: 'Casas', filter: 'casa', icon: 'M16 2.5L2 12h3v14h7v-8h8v8h7V12h3z' },
    { name: 'Departamentos', filter: 'departamento', icon: 'M4 2v28h24V2zm6 24H8v-2h2zm0-4H8v-2h2zm0-4H8v-2h2zm0-4H8v-2h2zm0-4H8V8h2zm6 16h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2zm6 16h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2z' },
    { name: 'Lotes Residenciales', filter: 'lote residencial', icon: 'M2 14v16h28V14z M6 26v-4h4v4z M14 26v-6h4v6z M22 26v-8h4v8z M16 2L2 12h28z' },
    { name: 'Terrenos Comerciales', filter: 'terreno comercial', icon: 'M2 14v16h28V14z M6 26v-4h4v4z M14 26v-6h4v6z M22 26v-8h4v8z' },
    { name: 'Terrenos Agrícolas/Ejidales', filter: 'agrícola', icon: 'M16 2L2 12h28z M16 26v-8' },
    { name: 'Bodegas', filter: 'bodega', icon: 'M4 4v24h24V4zm6 20H8v-4h2zm0-8H8v-4h2zm8 8h-2v-4h2zm0-8h-2v-4h2zm8 8h-2v-4h2zm0-8h-2v-4h2z' },
    { name: 'Locales Comerciales', filter: 'local comercial', icon: 'M2 10v18h28V10l-14-6-14 6zm6 14H6v-6h2v6zm6 0h-2v-8h2v8zm6 0h-2v-6h2v6zm6 0h-2v-8h2v8z' },
    { name: 'Oficinas', filter: 'oficina', icon: 'M6 2v28h20V2zm4 24H8v-2h2zm0-4H8v-2h2zm0-4H8v-2h2zm0-4H8V8h2zm8 12h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2z' },
    { name: 'Edificios', filter: 'edificio', icon: 'M8 2v28h16V2zm4 24h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2zm4 12h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2z' },
    { name: 'Ranchos', filter: 'rancho', icon: 'M2 20h28v4H2z M6 10h20v8H6z M16 2l6 6H10z' },
    { name: 'Quintas', filter: 'quinta', icon: 'M16 4A12 12 0 1 0 28 16 12 12 0 0 0 16 4zm0 22A10 10 0 1 1 26 16 10 10 0 0 1 16 26z' },
    { name: 'Naves Industriales', filter: 'nave industrial', icon: 'M2 12l6-6v6l6-6v6l6-6v6l6-6v20H2z' },
    { name: 'Desarrollos en Preventa', filter: 'desarrollo', icon: 'M16 2l14 10h-4v16H6V12H2L16 2zm-4 16h8v4h-8v-4z' }
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isDashboard) {
    return <Dashboard onLogout={() => setIsDashboard(false)} />;
  }

  const activeCategoryData = categories.find(c => c.name === activeCategory);
  
  const filteredProperties = properties.filter(p => {
    if (!activeCategoryData || !activeCategoryData.filter) return true;
    return p.type.toLowerCase().includes(activeCategoryData.filter);
  });

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Navbar onLogin={() => setIsDashboard(true)} />
      
      {/* Categories Bar (Sticky) */}
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

      <main className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <h2>Buscando lugares increíbles...</h2>
          </div>
        ) : (
          <div className="properties-grid">
            {filteredProperties.length > 0 ? (
              filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <h3>No encontramos propiedades en esta categoría.</h3>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Map Button */}
      <button className="floating-map-btn">
        Mostrar mapa 
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}><path d="M31.2 5.6l-9.5-3.4c-.4-.1-.9-.1-1.3 0l-8.9 3.2-8.4-3.2c-.8-.3-1.7.3-1.7 1.2v20c0 .6.4 1.1 1 1.2l9.5 3.4c.4.1.9.1 1.3 0l8.9-3.2 8.4 3.2c.8.3 1.7-.3 1.7-1.2v-20c0-.6-.4-1.1-1-1.2zM12 26.5l-8-3V4.8l8 3v18.7zm10-1.8l-8 2.9V8.8l8-2.9v18.8zm8 3l-6-2.3V6.7l6 2.3v18.7z"></path></svg>
      </button>

      {/* Minimalist Footer */}
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

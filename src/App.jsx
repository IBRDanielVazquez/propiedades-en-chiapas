import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Filters from './components/Filters';
import PropertyCard from './components/PropertyCard';
import PropertyTable from './components/PropertyTable';
import Dashboard from './components/Dashboard';
import { supabase } from './supabaseClient';
import './index.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isDashboard, setIsDashboard] = useState(false); // To toggle CRM View
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [isDashboard]); // Re-fetch when returning from dashboard

  async function fetchProperties() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredProperties = properties.filter(prop => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (prop.title && prop.title.toLowerCase().includes(searchLower)) || 
                          (prop.city && prop.city.toLowerCase().includes(searchLower)) || 
                          (prop.type && prop.type.toLowerCase().includes(searchLower));
    const matchesStatus = statusFilter === 'all' || prop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const developments = [...new Set(properties.filter(p => p.type).map(p => p.type))]; // Updated to filter by type for now

  if (isDashboard) {
    return <Dashboard onLogout={() => setIsDashboard(false)} />;
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Navbar onLogin={() => setIsDashboard(true)} />
      
      {/* Hero Section (Map Placeholder) */}
      <section className="hero-section">
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Search Properties, City or Development..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="search-input" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="all">All Status</option>
            <option value="Disponible">Disponible</option>
            <option value="Vendido">Vendido</option>
          </select>
          <button className="btn-primary">Search Properties</button>
        </div>
      </section>

      <main className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>El portal inmobiliario de Chiapas</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Compra, vende e invierte con asesoría profesional y difusión estratégica.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Propiedades recientes</h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ 
                background: viewMode === 'grid' ? 'var(--primary)' : 'var(--card-bg)', 
                color: viewMode === 'grid' ? 'white' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
                padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer'
              }}
            >
              Grid
            </button>
            <button 
              onClick={() => setViewMode('table')}
              style={{ 
                background: viewMode === 'table' ? 'var(--primary)' : 'var(--card-bg)', 
                color: viewMode === 'table' ? 'white' : 'var(--text-main)',
                border: '1px solid var(--border-color)',
                padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer'
              }}
            >
              List
            </button>
          </div>
        </div>

        <div className="properties-grid">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'white', gridColumn: '1 / -1' }}>Cargando propiedades desde Supabase...</div>
          ) : filteredProperties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'white', gridColumn: '1 / -1' }}>No hay propiedades que coincidan con tu búsqueda.</div>
          ) : viewMode === 'grid' ? (
            filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1' }}>
              <PropertyTable properties={filteredProperties} />
            </div>
          )}
        </div>
      </main>

      <footer style={{ marginTop: '4rem', padding: '4rem 2rem', background: '#222222', color: 'white' }}>
        <div className="container" style={{ padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>PROPIEDADES CHIAPAS</h3>
            <p style={{ color: '#aaa', lineHeight: '1.6' }}>
              El portal inmobiliario más exclusivo. <br/>Tu CRM de confianza.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'white' }}>Enlaces Rápidos</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: '#aaa', cursor: 'pointer' }}>Desarrollos en Preventa</span>
              <span style={{ color: '#aaa', cursor: 'pointer' }}>Propiedades VIP</span>
              <span style={{ color: '#aaa', cursor: 'pointer' }}>Acceso a Asesores</span>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'white' }}>Contacto</h4>
            <p style={{ color: '#aaa' }}>contacto@propiedadesenchiapas.com</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '4rem', color: '#666', fontSize: '0.9rem', borderTop: '1px solid #444', paddingTop: '2rem' }}>
          &copy; 2026 Propiedades Chiapas. Desarrollado con tecnología de Antigravity.
        </div>
      </footer>
    </div>
  );
}

export default App;

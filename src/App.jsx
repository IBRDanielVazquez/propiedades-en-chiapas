import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PropertyCard from './components/PropertyCard';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { supabase } from './supabaseClient';
import { SAMPLE_PROPERTIES, SAMPLE_USERS } from './data/sampleData';
import chiapasData from './data/chiapasLocations.json';
import DigitalCard from './components/DigitalCard';
import LandingCaptacion from './components/LandingCaptacion';
import Home from './components/Home';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER PRINCIPAL — sin hooks, solo pathname
// Orden de prioridad: /asesores → /card/:id → /crm|/dashboard → /
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  // REGLA 1 — /asesores: siempre público, sin importar sesión
  if (path === '/asesores') {
    return (
      <HelmetProvider>
        <LandingCaptacion />
      </HelmetProvider>
    );
  }

  // REGLA 3 — /card/:id: siempre público
  if (path.startsWith('/card/')) {
    const userId = path.split('/card/')[1] || '';
    return (
      <HelmetProvider>
        <CardRoute userId={userId} />
      </HelmetProvider>
    );
  }

  // REGLA 2 — /crm y /dashboard: con auth (Dashboard o Login)
  if (path.startsWith('/crm') || path.startsWith('/dashboard')) {
    return (
      <HelmetProvider>
        <CrmRoute />
      </HelmetProvider>
    );
  }

  // REGLA 4 — /: siempre portal público (Home)
  return (
    <HelmetProvider>
      <Home />
    </HelmetProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RUTA: /card/:id — Tarjeta digital pública
// ─────────────────────────────────────────────────────────────────────────────
function CardRoute({ userId }) {
  const [cardProfile, setCardProfile]       = useState(null);
  const [cardProfileLoading, setLoading]    = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const fetchCardProfile = async () => {
      try {
        let query = supabase.from('users').select('*');
        // UUID tiene más de 30 caracteres; si no, buscar por slug
        query = userId.length > 30
          ? query.eq('id', userId)
          : query.eq('slug', userId);

        const { data } = await query.single();
        if (data) {
          setCardProfile(data);
        } else {
          setCardProfile(SAMPLE_USERS.find(u => u.id === userId) || null);
        }
      } catch {
        setCardProfile(SAMPLE_USERS.find(u => u.id === userId) || null);
      } finally {
        setLoading(false);
      }
    };

    fetchCardProfile();
  }, [userId]);

  // Cargando
  if (cardProfileLoading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
          <div style={{ width:'40px', height:'40px', border:'3px solid rgba(255,255,255,0.2)', borderTopColor:'#38bdf8', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
          <p style={{ color:'#94a3b8', fontSize:'0.9rem', fontWeight:'500' }}>Cargando Tarjeta Digital...</p>
        </div>
      </div>
    );
  }

  // No encontrado
  if (!cardProfile) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', color:'#fff', padding:'2rem', textAlign:'center' }}>
        <div>
          <span style={{ fontSize:'3rem' }}>🚫</span>
          <h2 style={{ fontSize:'1.5rem', fontWeight:'800', marginTop:'1rem' }}>Tarjeta No Encontrada</h2>
          <p style={{ color:'#94a3b8', marginTop:'0.5rem' }}>El enlace no pertenece a un asesor registrado.</p>
        </div>
      </div>
    );
  }

  // Verificación demo 14 días
  const daysDiff = (Date.now() - new Date(cardProfile.created_at || Date.now())) / 86400000;
  if (daysDiff > 14 && (!cardProfile.plan || cardProfile.plan === 'starter') && cardProfile.id !== 'u0') {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', color:'#fff', padding:'2rem', textAlign:'center' }}>
        <div>
          <span style={{ fontSize:'4rem' }}>⏳</span>
          <h2 style={{ fontSize:'1.8rem', fontWeight:'800', marginTop:'1rem' }}>Demo Expirada</h2>
          <p style={{ color:'#94a3b8', marginTop:'0.5rem', maxWidth:'400px', margin:'0.5rem auto' }}>
            El periodo de prueba de 14 días ha concluido.<br/>
            Contacta a administración para reactivarla.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <Helmet>
        <title>{cardProfile.name} | Tarjeta Digital</title>
        <meta name="description" content={cardProfile.bio || `Tarjeta digital de ${cardProfile.name} en Propiedades en Chiapas`} />
        <meta property="og:title" content={`${cardProfile.name} | Asesor Inmobiliario`} />
        <meta property="og:description" content={cardProfile.company || 'Propiedades en Chiapas'} />
        <meta property="og:image" content={cardProfile.avatar_url || 'https://propiedadesenchiapas.com/logo.png'} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <DigitalCard profile={cardProfile} plan={{ id: cardProfile.plan || 'starter' }} isPublished={true} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RUTA: /crm y /dashboard — Auth-gated: Dashboard o Login
// ─────────────────────────────────────────────────────────────────────────────
function CrmRoute() {
  const [session,      setSession]      = useState(null);
  const [authLoading,  setAuthLoading]  = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const checkAllowlist = async (sess) => {
      if (!sess) {
        setSession(null);
        setAuthLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, active, plan')
          .eq('email', sess.user.email.toLowerCase())
          .single();

        if (error) {
          // Usuario nuevo: registrar automáticamente con plan starter
          await supabase.from('users').insert({
            email:      sess.user.email.toLowerCase(),
            name:       sess.user.user_metadata?.full_name || 'Nuevo Asesor',
            avatar_url: sess.user.user_metadata?.avatar_url || '',
            plan:       'starter',
            active:     true,
            created_at: new Date().toISOString(),
          });
        } else if (!data.active) {
          // Cuenta desactivada por administrador
          await supabase.auth.signOut();
          setSession(null);
          setAccessDenied(true);
          setAuthLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Allowlist error:', err.message);
      }

      setSession(sess);
      setAccessDenied(false);
      setAuthLoading(false);
    };

    // Sesión existente al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAllowlist(session);
    });

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!sess) {
        setSession(null);
        setAuthLoading(false);
      } else {
        checkAllowlist(sess);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cargando sesión
  if (authLoading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
          <div style={{ width:'40px', height:'40px', border:'3px solid rgba(255,255,255,0.2)', borderTopColor:'#38bdf8', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
          <p style={{ color:'#94a3b8', fontSize:'0.9rem', fontWeight:'500' }}>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Acceso denegado
  if (accessDenied) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a', padding:'1.5rem' }}>
        <div style={{ background:'#fff', borderRadius:'20px', padding:'2.5rem', maxWidth:'400px', width:'100%', textAlign:'center', boxShadow:'0 25px 50px rgba(0,0,0,0.4)' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🚫</div>
          <h2 style={{ fontSize:'1.4rem', fontWeight:'800', color:'#1e293b', marginBottom:'0.75rem' }}>Acceso No Autorizado</h2>
          <p style={{ color:'#64748b', fontSize:'0.9rem', lineHeight:'1.6', marginBottom:'1.5rem' }}>
            Tu cuenta no tiene permiso para acceder al CRM.<br/>
            Contacta al administrador para solicitar acceso.
          </p>
          <button
            onClick={() => { window.location.href = '/'; }}
            className="btn-primary"
            style={{ padding:'0.75rem 2rem', borderRadius:'10px', fontSize:'0.9rem' }}
          >
            Volver al portal
          </button>
        </div>
      </div>
    );
  }

  // Con sesión → Dashboard
  if (session) {
    return (
      <Dashboard
        session={session}
        onLogout={async () => {
          await supabase.auth.signOut();
          setSession(null);
          window.location.href = '/';
        }}
      />
    );
  }

  // Sin sesión → Login
  return (
    <Login onBack={() => { window.location.href = '/'; }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RUTA: / — Portal público de propiedades
// ─────────────────────────────────────────────────────────────────────────────
function PortalRoute() {
  const [properties,      setProperties]      = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [agentDetails,    setAgentDetails]    = useState(null);

  // Filtros
  const [filterOp,       setFilterOp]       = useState('Todas');
  const [filterMuni,     setFilterMuni]     = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

  const municipalities = Object.keys(chiapasData).sort();

  const categories = [
    { name: 'Todas',                   filter: '',                   icon: 'M16 2.5L2 12h3v14h7v-8h8v8h7V12h3z' },
    { name: 'Casas',                   filter: 'casa',               icon: 'M16 2.5L2 12h3v14h7v-8h8v8h7V12h3z' },
    { name: 'Departamentos',           filter: 'departamento',       icon: 'M4 2v28h24V2zm6 24H8v-2h2zm0-4H8v-2h2zm0-4H8v-2h2zm0-4H8v-2h2zm0-4H8V8h2zm6 16h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2zm6 16h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2z' },
    { name: 'Lotes Residenciales',     filter: 'lote residencial',   icon: 'M2 14v16h28V14z M6 26v-4h4v4z M14 26v-6h4v6z M22 26v-8h4v8z M16 2L2 12h28z' },
    { name: 'Terrenos Comerciales',    filter: 'terreno comercial',  icon: 'M2 14v16h28V14z M6 26v-4h4v4z M14 26v-6h4v6z M22 26v-8h4v8z' },
    { name: 'Terrenos Agrícolas',      filter: 'agrícola',           icon: 'M16 2L2 12h28z M16 26v-8' },
    { name: 'Bodegas',                 filter: 'bodega',             icon: 'M4 4v24h24V4zm6 20H8v-4h2zm0-8H8v-4h2zm8 8h-2v-4h2zm0-8h-2v-4h2zm8 8h-2v-4h2zm0-8h-2v-4h2z' },
    { name: 'Locales Comerciales',     filter: 'local comercial',    icon: 'M2 10v18h28V10l-14-6-14 6zm6 14H6v-6h2v6zm6 0h-2v-8h2v8zm6 0h-2v-6h2v6zm6 0h-2v-8h2v8z' },
    { name: 'Oficinas',                filter: 'oficina',            icon: 'M6 2v28h20V2zm4 24H8v-2h2zm0-4H8v-2h2zm0-4H8v-2h2zm0-4H8V8h2zm8 12h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2z' },
    { name: 'Edificios',               filter: 'edificio',           icon: 'M8 2v28h16V2zm4 24h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2zm4 12h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2V8h2z' },
    { name: 'Ranchos',                 filter: 'rancho',             icon: 'M2 20h28v4H2z M6 10h20v8H6z M16 2l6 6H10z' },
    { name: 'Quintas',                 filter: 'quinta',             icon: 'M16 4A12 12 0 1 0 28 16 12 12 0 0 0 16 4zm0 22A10 10 0 1 1 26 16 10 10 0 0 1 16 26z' },
    { name: 'Naves Industriales',      filter: 'nave industrial',    icon: 'M2 12l6-6v6l6-6v6l6-6v6l6-6v20H2z' },
    { name: 'Desarrollos en Preventa', filter: 'desarrollo',         icon: 'M16 2l14 10h-4v16H6V12H2L16 2zm-4 16h8v4h-8v-4z' },
  ];

  // Cargar datos del agente al abrir modal ficha
  useEffect(() => {
    if (!selectedProperty) { setAgentDetails(null); return; }
    const fetch = async () => {
      try {
        const { data } = await supabase.from('users').select('*').eq('id', selectedProperty.user_id).single();
        setAgentDetails(data || SAMPLE_USERS.find(u => u.id === selectedProperty.user_id));
      } catch {
        setAgentDetails(SAMPLE_USERS.find(u => u.id === selectedProperty.user_id));
      }
    };
    fetch();
  }, [selectedProperty]);

  // Cargar propiedades
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setProperties(data?.length > 0 ? data : SAMPLE_PROPERTIES.filter(p => p.active));
      } catch (err) {
        console.warn('Portal: usando sample data', err.message);
        setProperties(SAMPLE_PROPERTIES.filter(p => p.active));
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filtros
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
      <Navbar />

      {/* ── Modal Ficha Técnica ── */}
      {selectedProperty && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="ficha-tecnica-modal" style={{ background: '#fff', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', position: 'relative' }}>
            <button onClick={() => setSelectedProperty(null)} className="no-print" style={{ position: 'absolute', top: '15px', right: '15px', background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', zIndex: 10 }}>✕</button>

            <div id="ficha-imprimible" style={{ padding: '2.5rem 2rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.5rem', lineHeight: '1.2' }}>{selectedProperty.title}</h1>
                  <p style={{ color: '#64748b', fontSize: '1rem' }}>📍 {selectedProperty.colony}, {selectedProperty.municipality}</p>
                </div>
                <div style={{ textAlign: 'right', minWidth: '150px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0284c7' }}>
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(selectedProperty.price)}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>{selectedProperty.price_suffix}</div>
                  <span style={{ display: 'inline-block', padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', marginTop: '0.5rem' }}>
                    {selectedProperty.operation_type}
                  </span>
                </div>
              </div>

              {/* Imagen principal */}
              <img src={selectedProperty.featured_image_url} alt={selectedProperty.title} style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />

              {/* Detalles y amenidades */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Detalles Principales</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <li><strong>Tipo:</strong> {selectedProperty.type}</li>
                    <li><strong>Construcción:</strong> {selectedProperty.size_construction_m2 || selectedProperty.size_m2} m²</li>
                    <li><strong>Terreno:</strong> {selectedProperty.size_land_m2 || selectedProperty.size_m2} m²</li>
                    <li><strong>Habitaciones:</strong> {selectedProperty.bedrooms}</li>
                    <li><strong>Baños:</strong> {selectedProperty.bathrooms}</li>
                    <li><strong>Estacionamiento:</strong> {selectedProperty.garages} cajones</li>
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Amenidades</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedProperty.amenities?.map(am => (
                      <span key={am} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem', color: '#475569' }}>✓ {am}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Descripción</h3>
                <p style={{ color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedProperty.description}</p>
              </div>

              {/* Info asesor para imprimir */}
              <div className="print-agent-info" style={{ display: 'none', marginTop: '3rem', borderTop: '2px solid #0284c7', paddingTop: '1.5rem', breakInside: 'avoid' }}>
                <h3 style={{ marginBottom: '1rem', color: '#0284c7' }}>Información de Contacto</h3>
                {agentDetails && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <img src={agentDetails.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} alt={agentDetails.name} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>{agentDetails.name}</h4>
                      <p style={{ margin: '4px 0', color: '#64748b' }}>{agentDetails.company || agentDetails.position}</p>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#0284c7' }}>WhatsApp: {agentDetails.whatsapp || agentDetails.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones acción */}
            <div className="no-print" style={{ display: 'flex', gap: '1rem', padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderRadius: '0 0 16px 16px', position: 'sticky', bottom: 0 }}>
              <button
                onClick={() => window.print()}
                style={{ flex: 1, padding: '1rem', background: '#1e293b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                📄 Descargar PDF / Imprimir
              </button>
              <a
                href={`https://wa.me/${agentDetails?.whatsapp?.replace(/\D/g,'') || ''}?text=${encodeURIComponent(`Hola, vi la propiedad "${selectedProperty.title}" en Propiedades en Chiapas y quiero más información.`)}`}
                target="_blank" rel="noreferrer"
                style={{ flex: 1, padding: '1rem', background: '#25D366', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}
              >
                💬 Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Barra de categorías */}
      <div className="categories-wrapper container">
        <div className="categories-scroll">
          {categories.map(cat => (
            <div
              key={cat.name}
              className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.name)}
            >
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '24px', width: '24px', fill: 'currentcolor' }}>
                <path d={cat.icon} />
              </svg>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Barra de filtros */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.65rem 0', position: 'sticky', top: '135px', zIndex: 98 }}>
        <div className="container" style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {['Todas', 'Venta', 'Renta'].map(op => (
            <button key={op} onClick={() => setFilterOp(op)} style={{
              padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s',
              background: filterOp === op ? 'var(--primary)' : '#f1f5f9',
              color:      filterOp === op ? '#ffffff' : '#475569',
              border:     filterOp === op ? '1px solid var(--primary)' : '1px solid #e2e8f0',
            }}>{op}</button>
          ))}

          <select value={filterMuni} onChange={e => setFilterMuni(e.target.value)} style={{ padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: '600', color: '#475569', background: '#f1f5f9', cursor: 'pointer', outline: 'none' }}>
            <option value="">📍 Municipio</option>
            {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', borderRadius: '20px', padding: '0.35rem 0.75rem', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>💰 Máx.</span>
            <input
              type="number" placeholder="Sin límite" value={filterPriceMax}
              onChange={e => setFilterPriceMax(e.target.value)}
              style={{ border: 'none', background: 'transparent', width: '90px', fontSize: '0.8rem', outline: 'none', color: '#1e293b', fontWeight: '600' }}
            />
          </div>

          {hasFilters && (
            <button onClick={() => { setFilterOp('Todas'); setFilterMuni(''); setFilterPriceMax(''); }} style={{ padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
              ✕ Limpiar
            </button>
          )}

          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>
            {filteredProperties.length} propiedad{filteredProperties.length !== 1 ? 'es' : ''}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
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
                  {catProps.map(property => <PropertyCard key={property.id} property={property} onClick={() => setSelectedProperty(property)} />)}
                </div>
              </div>
            );
          })
        ) : (
          <div className="properties-grid">
            {filteredProperties.length > 0
              ? filteredProperties.map(property => <PropertyCard key={property.id} property={property} onClick={() => setSelectedProperty(property)} />)
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

      {/* Botón mapa flotante */}
      <button className="floating-map-btn">
        Mostrar mapa
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}>
          <path d="M31.2 5.6l-9.5-3.4c-.4-.1-.9-.1-1.3 0l-8.9 3.2-8.4-3.2c-.8-.3-1.7.3-1.7 1.2v20c0 .6.4 1.1 1 1.2l9.5 3.4c.4.1.9.1 1.3 0l8.9-3.2 8.4 3.2c.8.3 1.7-.3 1.7-1.2v-20c0-.6-.4-1.1-1-1.2zM12 26.5l-8-3V4.8l8 3v18.7zm10-1.8l-8 2.9V8.8l8-2.9v18.8zm8 3l-6-2.3V6.7l6 2.3v18.7z" />
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

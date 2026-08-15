import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Home from './components/Home';
import DigitalCard from './components/DigitalCard';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import LandingCaptacion from './components/LandingCaptacion';
import LandingViewer from './components/LandingViewer';
import BellaVistaLanding from './modules/developments/bella-vista/BellaVistaLanding';
import RiojaLanding from './modules/developments/rioja/RiojaLanding';
import Rioja360TourPage from './modules/developments/rioja/Rioja360TourPage';
import AvisoPrivacidad from './components/AvisoPrivacidad';
import PropertyDetail from './components/PropertyDetail';
import LeadsDashboard from './components/LeadsDashboard';
import NotFound from './components/NotFound';

const Tour360Editor = lazy(() => import('./modules/developments/rioja/components/Tour360Editor'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('PEC ErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif', padding:'2rem', textAlign:'center', background:'#f8fafc', color:'#1e293b' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🏡</div>
          <h2 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:'.5rem' }}>Propiedades en Chiapas</h2>
          <p style={{ color:'#64748b', marginBottom:'1.5rem', maxWidth:400 }}>Cargando portal. Haz clic abajo para recargar la vista.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ background:'#1A365D', color:'#fff', border:'none', borderRadius:20, padding:'10px 24px', fontWeight:700, cursor:'pointer' }}
          >
            🔄 Recargar Portal
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => {};

    // Salvaguarda: Descongelar pantalla en máximo 500ms
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 500);

    try {
      if (supabase?.auth?.getSession) {
        supabase.auth.getSession()
          .then((res) => {
            if (res?.data?.session) {
              setSession(res.data.session);
            }
          })
          .catch(() => {})
          .finally(() => {
            clearTimeout(safetyTimer);
            setLoading(false);
          });
      } else {
        clearTimeout(safetyTimer);
        setLoading(false);
      }

      if (supabase?.auth?.onAuthStateChange) {
        const authRes = supabase.auth.onAuthStateChange((_event, sess) => {
          setSession(sess || null);
        });
        if (authRes?.data?.subscription?.unsubscribe) {
          unsub = () => authRes.data.subscription.unsubscribe();
        }
      }
    } catch {
      clearTimeout(safetyTimer);
      setLoading(false);
    }

    return () => {
      clearTimeout(safetyTimer);
      try { unsub(); } catch {}
    };
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' }}>
        <div style={{ width:'36px', height:'36px', border:'3px solid rgba(255,255,255,0.2)', borderTopColor:'#38bdf8', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Routes>
          <Route path="/card/:slug" element={<DigitalCard />} />
          <Route path="/l/:slug" element={<LandingViewer />} />
          <Route path="/asesores" element={<LandingCaptacion />} />
          <Route path="/bella-vista" element={<BellaVistaLanding />} />
          <Route path="/bella-vista-ocozocoautla" element={<BellaVistaLanding />} />
          <Route path="/rioja" element={<RiojaLanding />} />
          <Route path="/rioja/360" element={<Rioja360TourPage />} />
          <Route path="/rioja/360/editor" element={<Rioja360EditorRoute />} />
          <Route path="/privacidad" element={<AvisoPrivacidad />} />
          <Route path="/propiedad/:id" element={<PropertyDetail />} />
          <Route path="/preview/leads-crm" element={<LeadsPreviewRoute />} />
          <Route path="/crm/*" element={<CRMRoute session={session} />} />
          <Route path="/" element={<Home session={session} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

function LeadsPreviewRoute() {
  const isMobile = window.innerWidth < 768;
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: isMobile ? '1rem' : '2rem' }}>
      <LeadsDashboard
        forcePreview
        isMobile={isMobile}
        currentUser={{ id: 'preview-admin', name: 'Admin demo', plan: 'admin' }}
      />
    </div>
  );
}

function Rioja360EditorRoute() {
  const isAllowed = import.meta.env.DEV || 
                    window.location.hostname.includes('localhost') || 
                    window.location.hostname.includes('vercel.app') || 
                    window.location.search.toLowerCase().includes('edit360');
                    
  if (!isAllowed) {
    return <NotFound />;
  }
  
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080a08', color: '#c3a479', fontFamily: 'Outfit, sans-serif' }}>
        Cargando mesa de edición 360°...
      </div>
    }>
      <Tour360Editor />
    </Suspense>
  );
}

function CRMRoute({ session }) {
  const isReset = window.location.hash.includes('access_token');
  if (!session || isReset) return <Login onBack={() => window.location.href = '/'} />;
  return (
    <Dashboard 
      session={session} 
      onLogout={async () => {
        try { await supabase.auth.signOut(); } catch {}
        window.location.href = '/';
      }} 
    />
  );
}

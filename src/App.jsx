import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { supabase } from './supabaseClient';
import Home from './components/Home';
import DigitalCard from './components/DigitalCard';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import LandingCaptacion from './components/LandingCaptacion';
import LandingViewer from './components/LandingViewer';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' }}>
        <div style={{ width:'40px', height:'40px', border:'3px solid rgba(255,255,255,0.2)', borderTopColor:'#38bdf8', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const path = window.location.pathname;

  const renderView = () => {
    // Digital Card (Public)
    if (path.startsWith('/card/')) return <DigitalCard />;

    // Landing Pages dinámicas (Public) — /l/:slug
    if (path.startsWith('/l/')) {
      const slug = path.replace('/l/', '').replace(/\/$/, '');
      return <LandingViewer slug={slug} />;
    }

    // Asesores Landing (Public)
    if (path === '/asesores') return <LandingCaptacion />;
    
    // Dashboard (Protected)
    if (path.startsWith('/dashboard') || path.startsWith('/crm')) {
      if (!session) return <Login onBack={() => window.location.href = '/'} />;
      return (
        <Dashboard 
          session={session} 
          onLogout={async () => {
            await supabase.auth.signOut();
            window.location.href = '/';
          }} 
        />
      );
    }

    // Default: Home Page (Public)
    return <Home session={session} />;
  };

  return (
    <HelmetProvider>
      {renderView()}
    </HelmetProvider>
  );
}

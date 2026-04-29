import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ onBack }) {
  const [loading, setLoading]     = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [mode, setMode]           = useState('google'); // 'google' | 'email'

  // Escuchar el callback de Google OAuth
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        // El chequeo de allowlist lo maneja App.jsx
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Login con Google ──────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' } // fuerza selección de cuenta
      }
    });
    if (error) {
      setErrorMsg('Error al conectar con Google. Intenta de nuevo.');
      setLoading(false);
    }
    // Si no hay error, el browser redirige a Google — el loading se mantiene
  };

  // ── Login con Email / Password ────────────────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login')) {
        setErrorMsg('Correo o contraseña incorrectos.');
      } else if (error.message.includes('Email not confirmed')) {
        setErrorMsg('Confirma tu correo antes de ingresar.');
      } else {
        setErrorMsg('Error al iniciar sesión. Intenta de nuevo.');
      }
      setLoading(false);
    }
    // Si éxito → App.jsx detecta el cambio de sesión y verifica allowlist
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1a3a5c 100%)',
      padding: '1.5rem'
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '24px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
        maxWidth: '420px',
        width: '100%'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <svg viewBox="0 0 24 24" style={{ display: 'block', height: '48px', width: '48px', fill: 'var(--primary)', margin: '0 auto 1rem auto' }}>
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.7l7 6.3v9h-4v-6H9v6H5v-9l7-6.3z" />
          </svg>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px' }}>
            Acceso CRM
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.4rem' }}>
            Exclusivo para asesores autorizados
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div style={{
            background: '#fee2e2', color: '#dc2626',
            padding: '0.85rem 1rem', borderRadius: '10px',
            fontSize: '0.88rem', marginBottom: '1.25rem',
            fontWeight: '500', border: '1px solid #fca5a5'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ── Modo Google ──────────────────────────────────────────────── */}
        {mode === 'google' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                padding: '0.95rem', borderRadius: '12px', border: '1px solid #e2e8f0',
                background: loading ? '#f8fafc' : '#ffffff', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem', fontWeight: '700', color: '#1e293b',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if (!loading) e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
            >
              {loading ? (
                <div style={{ width: '22px', height: '22px', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                /* Google G SVG */
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {loading ? 'Redirigiendo a Google...' : 'Continuar con Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500' }}>o</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            <button
              onClick={() => setMode('email')}
              style={{
                padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0',
                background: '#f8fafc', cursor: 'pointer', fontSize: '0.88rem',
                fontWeight: '600', color: '#475569'
              }}
            >
              ✉️ Ingresar con email y contraseña
            </button>
          </div>
        )}

        {/* ── Modo Email ───────────────────────────────────────────────── */}
        {mode === 'email' && (
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.88rem', fontWeight: '600', color: '#334155' }}>
                Correo Electrónico
              </label>
              <input
                type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="asesor@propiedadesenchiapas.com"
                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.88rem', fontWeight: '600', color: '#334155' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.85rem 3rem 0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#94a3b8' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ padding: '0.95rem', fontSize: '0.95rem', borderRadius: '10px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {loading
                ? <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Verificando...</>
                : '🔐 Ingresar'}
            </button>
            <button type="button" onClick={() => { setMode('google'); setErrorMsg(''); }}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
              ← Volver a Google
            </button>
          </form>
        )}

        {/* Footer */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
          <button onClick={onBack}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}>
            ← Volver al portal público
          </button>
        </div>
        <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            🔒 Acceso restringido · Solo asesores autorizados
          </span>
        </div>
      </div>
    </div>
  );
}

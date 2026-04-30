import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ onBack }) {
  const [loading, setLoading]     = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [mode, setMode]           = useState('magic-link'); // 'magic-link' | 'email' | 'google'
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // ── Login con Magic Link ───────────────────────────────────────────────────
  const handleMagicLinkLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Por favor ingresa tu correo electrónico.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setMagicLinkSent(false);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) throw error;
      setMagicLinkSent(true);
    } catch (err) {
      console.error('Magic Link error:', err);
      setErrorMsg('No se pudo enviar el enlace mágico. Verifica que tu correo esté registrado.');
    } finally {
      setLoading(false);
    }
  };


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

  // ── Crear Cuenta (Registro) ────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setErrorMsg('Este correo ya está registrado. Intenta iniciar sesión.');
      } else {
        // En muchos casos Supabase auto-loguea si no requiere confirmación, o envía correo.
        alert('¡Cuenta creada exitosamente! Tu Demo de 14 Días ha comenzado.');
        setMode('email'); // Volver a login por si requiere confirmación o para que inicie
      }
      setLoading(false);
    }
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
            {mode === 'register' ? 'Nueva Tarjeta Digital' : 'Acceso CRM'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.4rem' }}>
            {mode === 'register' ? 'Crea tu cuenta y obtén 14 días gratis' : 'Exclusivo para asesores autorizados'}
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

        {/* ── Formulario Compartido (Login / Registro) ────────────────────────── */}
        <form onSubmit={mode === 'register' ? handleSignUp : handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.88rem', fontWeight: '600', color: '#334155' }}>
              Correo Electrónico
            </label>
            <input
              type="email" required autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="asesor@tucorreo.com"
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
                type={showPass ? 'text' : 'password'} required autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
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
            {mode === 'register' && (
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Mínimo 6 caracteres.</p>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn-primary"
            style={{ padding: '0.95rem', fontSize: '0.95rem', borderRadius: '10px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {loading
              ? <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Cargando...</>
              : mode === 'register' ? '🚀 Iniciar Demo Gratis' : '🔐 Ingresar'}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          {mode === 'email' ? (
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              ¿No tienes cuenta?{' '}
              <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>
                Crea tu Tarjeta Digital
              </button>
            </p>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => setMode('email')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>
                Inicia Sesión
              </button>
            </p>
          )}
        </div>

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

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ onLoginSuccess, onBack }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      // Mensajes amigables en español
      if (error.message.includes('Invalid login')) {
        setErrorMsg('Correo o contraseña incorrectos.');
      } else if (error.message.includes('Email not confirmed')) {
        setErrorMsg('Confirma tu correo antes de ingresar. Revisa tu bandeja de entrada.');
      } else if (error.message.includes('Too many requests')) {
        setErrorMsg('Demasiados intentos. Espera unos minutos e intenta de nuevo.');
      } else {
        setErrorMsg('Error al iniciar sesión. Intenta de nuevo.');
      }
      setLoading(false);
      return;
    }

    // Éxito — Supabase guarda la sesión automáticamente
    onLoginSuccess();
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      padding: '1.5rem'
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        maxWidth: '420px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', height: '48px', width: '48px', fill: 'var(--primary)', margin: '0 auto 1rem auto' }}>
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.7l7 6.3v9h-4v-6H9v6H5v-9l7-6.3z" />
          </svg>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px' }}>
            Acceso CRM
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Exclusivo para agentes de Propiedades en Chiapas
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div style={{
            background: '#fee2e2', color: '#dc2626',
            padding: '0.85rem 1rem', borderRadius: '10px',
            fontSize: '0.88rem', marginBottom: '1.5rem',
            fontWeight: '500', border: '1px solid #fca5a5'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', fontWeight: '600', color: '#334155' }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="agente@propiedadesenchiapas.com"
              style={{
                width: '100%', padding: '0.85rem 1rem',
                borderRadius: '10px', border: '1px solid #e2e8f0',
                fontSize: '0.95rem', outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.88rem', fontWeight: '600', color: '#334155' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '0.85rem 3rem 0.85rem 1rem',
                  borderRadius: '10px', border: '1px solid #e2e8f0',
                  fontSize: '0.95rem', outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', fontSize: '1.1rem',
                  color: '#94a3b8', padding: '0'
                }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              padding: '0.95rem', fontSize: '1rem',
              borderRadius: '10px', marginTop: '0.25rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            {loading
              ? <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Iniciando sesión...</>
              : '🔐 Ingresar al CRM'
            }
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none', color: '#64748b',
              fontSize: '0.88rem', cursor: 'pointer', textDecoration: 'underline'
            }}
          >
            ← Volver al portal público
          </button>
        </div>

        {/* Security badge */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            🔒 Sesión encriptada con Supabase Auth
          </span>
        </div>
      </div>
    </div>
  );
}

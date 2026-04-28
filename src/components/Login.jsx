import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Login({ onLoginSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const testUsers = [
    { email: 'admin@propiedadesenchiapas.com', pass: 'Chiapas2026!' },
    { email: 'admin@crmestate.com', pass: '123456' },
    { email: 'vendedor1@propiedadesenchiapas.com', pass: 'Ventas2026!' },
    { email: 'vendedor2@propiedadesenchiapas.com', pass: 'Ventas2026!' },
    { email: 'daniel@propiedadesenchiapas.com', pass: 'Daniel2026!' },
    { email: 'pruebas@propiedadesenchiapas.com', pass: 'Pruebas2026!' },
    { email: 'test@test.com', pass: '123456' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Hardcoded auth for demo to bypass "Email not confirmed" Supabase restriction
    const foundUser = testUsers.find(u => u.email === email.toLowerCase() && u.pass === password);

    setTimeout(() => {
      if (foundUser) {
        onLoginSuccess();
      } else {
        setErrorMsg('Credenciales incorrectas o usuario no registrado.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f7f7',
      padding: '1.5rem'
    }}>
      <div style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '40px', width: '40px', fill: 'var(--primary)', margin: '0 auto 1rem auto' }}>
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.7l7 6.3v9h-4v-6H9v6H5v-9l7-6.3z" />
          </svg>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Acceso CRM</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Exclusivo para agentes de Propiedades en Chiapas</p>
        </div>

        {errorMsg && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '0.8rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>Correo Electrónico</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agente@propiedadesenchiapas.com" 
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '1rem'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{
              padding: '0.9rem',
              fontSize: '1rem',
              borderRadius: '8px',
              marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        <button 
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            marginTop: '1.5rem',
            width: '100%',
            cursor: 'pointer',
            textAlign: 'center',
            textDecoration: 'underline'
          }}
        >
          Volver al portal público
        </button>
      </div>
    </div>
  );
}

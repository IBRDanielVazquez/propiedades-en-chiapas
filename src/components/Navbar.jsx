import React from 'react';

export default function Navbar({ session }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0', height: '70px',
      display: 'flex', alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <svg viewBox="0 0 24 24" style={{ height: '32px', width: '32px', fill: '#1A1A6E' }}>
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.7l7 6.3v9h-4v-6H9v6H5v-9l7-6.3z" />
          </svg>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A6E', letterSpacing: '-0.5px' }}>
            PROPIEDADES EN CHIAPAS
          </span>
        </a>

        {/* Links */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/asesores" style={{ fontSize: '0.9rem', fontWeight: '700', color: '#475569', textDecoration: 'none' }}>
            Para Asesores
          </a>
          {session ? (
            <a href="/dashboard" style={{
              background: '#1A1A6E', color: '#fff', padding: '0.6rem 1.25rem',
              borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700', textDecoration: 'none'
            }}>
              👤 Mi Cuenta
            </a>
          ) : (
            <a href="/dashboard" style={{
              border: '2px solid #1A1A6E', color: '#1A1A6E', padding: '0.6rem 1.25rem',
              borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700', textDecoration: 'none'
            }}>
              Iniciar Sesión
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

import React from 'react';

export default function Navbar() {
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1A1A6E', letterSpacing: '-0.5px', lineHeight: '1.1' }}>
              PROPIEDADES EN CHIAPAS
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Portal Inmobiliario
            </span>
          </div>
        </a>
      </div>
    </nav>
  );
}


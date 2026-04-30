import React from 'react';

export default function Navbar({ onLogin }) {
  return (
    <nav className="navbar">
      <div className="container navbar-content" style={{ justifyContent: 'center' }}>
        {/* Left: Logo Only */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)', textDecoration: 'none' }}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '32px', width: '32px', fill: 'currentcolor' }}>
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.7l7 6.3v9h-4v-6H9v6H5v-9l7-6.3z" />
          </svg>
          <h2 className="logo-text" style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>Propiedades Chiapas</h2>
        </a>
      </div>
    </nav>
  );
}

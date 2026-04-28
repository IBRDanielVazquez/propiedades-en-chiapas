import React from 'react';

export default function Navbar({ onLogin }) {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)' }}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '32px', width: '32px', fill: 'currentcolor' }}>
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.7l7 6.3v9h-4v-6H9v6H5v-9l7-6.3z" />
          </svg>
          <h2 className="logo-text" style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>Propiedades Chiapas</h2>
        </div>
        
        {/* Center: Search Pill */}
        <div className="search-pill">
          <div className="search-pill-text">Cualquier lugar</div>
          <div className="search-pill-text hide-mobile" style={{ paddingLeft: '1rem' }}>Cualquier tipo</div>
          <div className="search-pill-sub">Añade filtros</div>
          <button className="search-pill-btn">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentcolor', strokeWidth: '5.33333', overflow: 'visible' }}><g fill="none"><path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path></g></svg>
          </button>
        </div>

        {/* Right: User Menu */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span onClick={onLogin} className="host-btn-text hover-bg" style={{ fontSize: '0.95rem', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', transition: 'background 0.2s' }}>Acceso CRM</span>
          <button 
            onClick={onLogin}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              padding: '0.3rem 0.3rem 0.3rem 0.8rem', 
              border: '1px solid var(--border-color)', 
              borderRadius: '30px', background: 'white', cursor: 'pointer', transition: 'box-shadow 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 3, overflow: 'visible' }}><g fill="none" fillRule="nonzero"><path d="m2 16h28"></path><path d="m2 24h28"></path><path d="m2 8h28"></path></g></svg>
            <div style={{ background: '#717171', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}><path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path></svg>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}

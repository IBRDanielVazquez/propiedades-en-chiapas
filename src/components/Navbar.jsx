import React from 'react';

export default function Navbar({ onLogin }) {
  return (
    <nav style={{ 
      background: 'var(--card-bg)',
      padding: '1rem 3rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>PROPIEDADES CHIAPAS</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <span className="nav-link">Home</span>
        <span className="nav-link">Properties</span>
        <span className="nav-link">Agents</span>
        <span className="nav-link">Contact</span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <button 
        onClick={onLogin}
        className="btn-primary"
        style={{ padding: '0.5rem 1.5rem' }}
        >
          Acceso CRM
        </button>
      </div>
    </nav>
  );
}

// NotFound.jsx — componente 404 con noindex
// Usar como ruta catch-all en el router: path="*"

import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Página no encontrada | Propiedades en Chiapas';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  return (
    <main style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '8px' }}>404</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '32px', color: '#666' }}>
        Esta página no existe o fue movida.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '12px 28px',
          background: '#B8924A',
          color: '#fff',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: '600',
        }}
      >
        Volver al inicio
      </Link>
    </main>
  );
}

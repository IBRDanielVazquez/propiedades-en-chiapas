import React from 'react';

export default function PropertyCard({ property }) {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  return (
    <div className="property-card">
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img src={property.featured_image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80'} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '5px' }}>
          <span style={{ background: '#10b981', color: 'white', padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>Featured</span>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
          <span style={{ background: 'var(--primary)', color: 'white', padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{property.type.toUpperCase()}</span>
          <span style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{property.status}</span>
        </div>
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'white', fontWeight: '600', fontSize: '0.85rem', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          📍 {property.city}
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>{property.title}</h3>
        <p style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1rem' }}>{formatter.format(property.price)} {property.price_suffix || ''}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {property.description || 'Increíble propiedad ubicada en la mejor zona de Chiapas. Ideal para vivir o como inversión con alta plusvalía.'}
        </p>
      </div>

      <div className="card-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span>🛏️</span> <span>{property.bedrooms || 0}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span>🛁</span> <span>{property.bathrooms || 0}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span>📐</span> <span>{property.size_m2 || 0} m²</span>
        </div>
      </div>
    </div>
  );
}

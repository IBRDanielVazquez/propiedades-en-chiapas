import React from 'react';

export default function PropertyManager({ properties, onToggleActive, onEdit, onDelete, plan }) {
  const formatPrice = (price) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

  if (properties.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏗️</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Sin propiedades publicadas</h3>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          {plan === 'starter' ? 'Tu plan Starter solo incluye Tarjeta Digital. Actualiza para publicar propiedades.' : 'Agrega tu primera propiedad desde el menú lateral.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {properties.map(prop => (
        <div key={prop.id} style={{
          display: 'flex', gap: '1.25rem', background: '#ffffff', borderRadius: '14px', padding: '1.25rem',
          border: prop.active ? '1px solid #e2e8f0' : '1px solid #fca5a5',
          opacity: prop.active ? 1 : 0.7, transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ width: '160px', height: '110px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={prop.featured_image_url} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>{prop.title}</h3>
                <span style={{
                  fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px',
                  background: prop.active ? '#dcfce7' : '#fee2e2',
                  color: prop.active ? '#166534' : '#991b1b'
                }}>
                  {prop.active ? 'ACTIVA' : 'INACTIVA'}
                </span>
                <span style={{
                  fontSize: '0.65rem', fontWeight: '600', padding: '2px 8px', borderRadius: '6px',
                  background: prop.operation_type === 'Venta' ? '#dbeafe' : '#fef3c7',
                  color: prop.operation_type === 'Venta' ? '#1e40af' : '#92400e'
                }}>
                  {prop.operation_type}
                </span>
                {plan === 'admin' && prop.user_id && (
                  <span style={{
                    fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px',
                    background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1'
                  }}>
                    👤 {prop.user_id.slice(0, 8)}…
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0' }}>{prop.type} · {prop.city} · {prop.size_m2}m²</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0284c7', margin: 0 }}>
                {formatPrice(prop.price)} {prop.price_suffix}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>👁 {prop.views || 0} vistas</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📩 {prop.leads || 0} leads</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => onToggleActive(prop.id)} style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer',
                  background: prop.active ? '#fef2f2' : '#f0fdf4',
                  color: prop.active ? '#dc2626' : '#16a34a',
                  border: prop.active ? '1px solid #fca5a5' : '1px solid #86efac'
                }}>
                  {prop.active ? '⏸ Desactivar' : '▶ Activar'}
                </button>
                <button onClick={() => onEdit(prop)} style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer',
                  background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe'
                }}>
                  ✏️ Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

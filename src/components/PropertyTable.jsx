import React from 'react';

const statusColors = {
  disponible: 'var(--success)',
  apartado: 'var(--warning)',
  vendido: 'var(--danger)'
};

export default function PropertyTable({ properties }) {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  return (
    <div className="glass" style={{ overflowX: 'auto', padding: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <th style={{ padding: '1rem' }}>MANZANA / LOTE</th>
            <th style={{ padding: '1rem' }}>DESARROLLO</th>
            <th style={{ padding: '1rem' }}>TAMAÑO</th>
            <th style={{ padding: '1rem' }}>PRECIO / M²</th>
            <th style={{ padding: '1rem' }}>TOTAL</th>
            <th style={{ padding: '1rem' }}>ESTADO</th>
            <th style={{ padding: '1rem' }}>CARACTERÍSTICAS</th>
            <th style={{ padding: '1rem' }}>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {properties.map(prop => (
            <tr key={prop.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem' }}>
              <td style={{ padding: '1rem', fontWeight: '600' }}>
                <span style={{ color: 'var(--primary)' }}>{prop.manzana}</span> - {prop.lote}
              </td>
              <td style={{ padding: '1rem' }}>{prop.development}</td>
              <td style={{ padding: '1rem' }}>{prop.area} m²</td>
              <td style={{ padding: '1rem' }}>{formatter.format(prop.price_m2)}</td>
              <td style={{ padding: '1rem', fontWeight: '700' }}>{formatter.format(prop.price_total)}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ 
                  color: statusColors[prop.status], 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${statusColors[prop.status]}`
                }}>
                  {prop.status.toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {prop.features.map((f, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </td>
              <td style={{ padding: '1rem' }}>
                <button 
                  onClick={() => {
                    const text = `🏡 *${prop.development}*\n📍 ${prop.manzana} - ${prop.lote}\n📏 Tamaño: ${prop.area} m²\n💰 Precio: ${formatter.format(prop.price_total)}\n✨ Características: ${prop.features.join(', ')}\n✅ Estado: ${prop.status.toUpperCase()}`;
                    navigator.clipboard.writeText(text);
                    alert('Detalles copiados al portapapeles');
                  }}
                  className="glass"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', color: 'var(--primary)', border: '1px solid var(--primary)' }}
                >
                  Copiar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

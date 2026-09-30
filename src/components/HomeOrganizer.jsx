import { useEffect, useState } from 'react';

const CATEGORIES = [
  ['terreno', 'Terrenos'],
  ['casa', 'Casas'],
  ['departamento', 'Departamentos'],
  ['local', 'Locales'],
  ['bodega', 'Bodegas'],
  ['rancho', 'Ranchos'],
  ['quinta', 'Quintas'],
  ['oficina', 'Oficinas']
];

export default function HomeOrganizer({ properties, onReorder, onUpdate }) {
  const [ordered, setOrdered] = useState([]);
  const [draggedId, setDraggedId] = useState(null);

  useEffect(() => {
    setOrdered([...properties].sort((a, b) => (a.home_order || 9999) - (b.home_order || 9999)));
  }, [properties]);

  const dropOn = async targetId => {
    if (!draggedId || draggedId === targetId) return;
    const next = [...ordered];
    const from = next.findIndex(item => item.id === draggedId);
    const to = next.findIndex(item => item.id === targetId);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const normalized = next.map((item, index) => ({ ...item, home_order: index + 1 }));
    setOrdered(normalized);
    setDraggedId(null);
    await onReorder(normalized);
  };

  const visible = ordered.filter(item => item.show_on_home !== false);
  const hidden = ordered.filter(item => item.show_on_home === false);

  const renderCard = property => (
    <article
      key={property.id}
      draggable
      onDragStart={() => setDraggedId(property.id)}
      onDragOver={event => event.preventDefault()}
      onDrop={() => dropOn(property.id)}
      style={{
        display: 'grid', gridTemplateColumns: '36px 92px minmax(180px, 1fr) 180px auto auto',
        alignItems: 'center', gap: '0.85rem', padding: '0.85rem', background: '#fff',
        border: draggedId === property.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
        borderRadius: '12px', opacity: property.show_on_home === false ? 0.6 : 1
      }}
    >
      <button type="button" aria-label={`Mover ${property.title}`} title="Arrastra para cambiar el orden" style={{ border: 'none', background: '#f1f5f9', borderRadius: '8px', padding: '0.6rem 0', cursor: 'grab', color: '#64748b', fontSize: '1rem' }}>⠿</button>
      <img src={property.featured_image_url || property.images?.[0]} alt="" style={{ width: '92px', height: '62px', objectFit: 'cover', borderRadius: '8px', background: '#e2e8f0' }} />
      <div style={{ minWidth: 0 }}>
        <strong style={{ display: 'block', color: '#1e293b', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{property.title}</strong>
        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Posición {property.home_order || '—'}</span>
      </div>
      <select value={property.home_category || 'terreno'} onChange={event => onUpdate(property.id, { home_category: event.target.value })} className="form-input" style={{ height: '42px', fontSize: '0.78rem' }}>
        {CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem', fontWeight: '700', color: '#475569', whiteSpace: 'nowrap' }}>
        <input type="checkbox" checked={!!property.is_featured} onChange={event => onUpdate(property.id, { is_featured: event.target.checked })} /> Destacada
      </label>
      <button type="button" onClick={() => onUpdate(property.id, { show_on_home: property.show_on_home === false })} style={{ border: 'none', borderRadius: '8px', padding: '0.65rem 0.8rem', cursor: 'pointer', fontWeight: '700', fontSize: '0.72rem', background: property.show_on_home === false ? '#dcfce7' : '#fef2f2', color: property.show_on_home === false ? '#166534' : '#991b1b' }}>
        {property.show_on_home === false ? 'Mostrar' : 'Ocultar'}
      </button>
    </article>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ padding: '1rem 1.15rem', borderRadius: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', fontSize: '0.84rem' }}>
        Arrastra las tarjetas para ordenar el Home. Estos controles sólo cambian presentación, categoría y visibilidad; no modifican textos, precios, imágenes ni landings.
      </div>

      <section>
        <h2 style={{ marginBottom: '0.8rem', fontSize: '1rem', color: '#1e293b' }}>Visibles en el Home ({visible.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>{visible.map(renderCard)}</div>
      </section>

      {hidden.length > 0 && (
        <section>
          <h2 style={{ marginBottom: '0.8rem', fontSize: '1rem', color: '#64748b' }}>Ocultas del Home ({hidden.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>{hidden.map(renderCard)}</div>
        </section>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AgencyManager() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    // Para no romper si la tabla no existe, intentamos leerla
    const { data, error } = await supabase.from('agencies').select('*');
    if (!error && data) {
      setAgencies(data);
    } else {
      // Fallback: extraer agencias únicas del campo 'company' de los usuarios
      const { data: users } = await supabase.from('users').select('company');
      const uniqueAgencies = [...new Set(users?.map(u => u.company).filter(Boolean))];
      setAgencies(uniqueAgencies.map((name, i) => ({ id: i, name, memberCount: users.filter(u => u.company === name).length })));
    }
    setLoading(false);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b' }}>Gestión de Agencias</h1>
        <p style={{ color: '#64748b' }}>Administra las inmobiliarias y grupos registrados en el portal.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {agencies.map(agency => (
          <div key={agency.id} style={{
            background: '#fff', borderRadius: '16px', padding: '1.5rem',
            border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: '700' }}>{agency.name}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{agency.memberCount || 0} asesores activos</p>
            <button style={{
              marginTop: '1rem', width: '100%', padding: '0.65rem', borderRadius: '10px',
              background: '#f1f5f9', border: 'none', color: '#1A1A6E', fontWeight: '700', cursor: 'pointer'
            }}>Ver detalles</button>
          </div>
        ))}
      </div>

      {agencies.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>No se encontraron agencias registradas.</p>
        </div>
      )}
    </div>
  );
}

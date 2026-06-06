import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AgencyManager() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('agencies')
          .select('*')
          .order('name');
        setAgencies(data || []);
      } catch (err) {
        console.warn('AgencyManager load error:', err.message);
        setAgencies([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { data, error } = await supabase
        .from('agencies')
        .insert({ name: form.name.trim(), slug })
        .select()
        .single();
      if (error) throw error;
      setAgencies(prev => [...prev, data]);
      setForm({ name: '', slug: '' });
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (agency) => {
    const newActive = !agency.active;
    setAgencies(prev => prev.map(a => a.id === agency.id ? { ...a, active: newActive } : a));
    await supabase.from('agencies').update({ active: newActive }).eq('id', agency.id);
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
      Cargando agencias...
    </div>
  );

  return (
    <div style={{ padding: '0' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
          🏢 Agencias
        </h1>
        <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
          {agencies.length} agencias
        </span>
      </div>

      {/* Formulario nueva agencia */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontWeight: '800', marginBottom: '1rem', fontSize: '1rem' }}>Nueva Agencia</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Nombre de la agencia"
            className="form-input"
            style={{ flex: 1, minWidth: '200px' }}
          />
          <input
            type="text"
            value={form.slug}
            onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
            placeholder="Slug (opcional)"
            className="form-input"
            style={{ flex: 1, minWidth: '150px' }}
          />
          <button
            onClick={save}
            disabled={saving || !form.name.trim()}
            className="btn-primary"
            style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Guardando...' : '+ Agregar'}
          </button>
        </div>
      </div>

      {/* Lista de agencias */}
      {agencies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
          <p style={{ fontWeight: '600' }}>No hay agencias registradas</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {agencies.map(agency => (
            <div key={agency.id} style={{
              background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0',
              padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                <p style={{ fontWeight: '700', margin: 0, color: '#1e293b' }}>{agency.name}</p>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>/{agency.slug}</p>
              </div>
              <button
                onClick={() => toggleActive(agency)}
                style={{
                  padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem',
                  background: agency.active ? '#d1fae5' : '#fee2e2',
                  color: agency.active ? '#065f46' : '#991b1b'
                }}
              >
                {agency.active ? 'Activa' : 'Inactiva'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

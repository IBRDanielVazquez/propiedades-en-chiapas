import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { PLANS } from '../data/plans';

const EMPTY_USER = {
  name: '',
  email: '',
  role: '', // position
  phone: '',
  whatsapp: '',
  agency: '', // company
  bio: '',
  photo_url: '', // avatar_url
  instagram: '',
  facebook: '',
  tiktok: '',
  youtube: '',
  linkedin: '',
  website: '',
  plan: 'basic',
  active: true,
};

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_USER);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.warn('Error loading users:', err.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const saveUser = async () => {
    if (!form.name || !form.email) {
      alert('Nombre y Email son obligatorios');
      return;
    }
    setIsSaving(true);
    try {
      let saved;
      if (editingUser) {
        const { data, error } = await supabase
          .from('users').update(form).eq('id', editingUser.id).select().single();
        if (error) throw error;
        saved = data;
        setUsers(prev => prev.map(u => u.id === saved.id ? saved : u));
      } else {
        const { data, error } = await supabase
          .from('users').insert(form).select().single();
        if (error) throw error;
        saved = data;
        setUsers(prev => [saved, ...prev]);
      }
      setShowForm(false);
      alert(editingUser ? '¡Asesor actualizado!' : '¡Asesor creado exitosamente!');
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (user) => {
    const newActive = !user.active;
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: newActive } : u));
    try {
      await supabase.from('users').update({ active: newActive }).eq('id', user.id);
    } catch (err) {
      console.warn('Toggle user persist failed:', err.message);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.agency?.toLowerCase().includes(search.toLowerCase())
  );

  const planStats = Object.entries(PLANS).map(([key, plan]) => ({
    ...plan,
    count: users.filter(u => u.plan === key).length
  }));

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b' }}>Gestión de Asesores</h1>
          <p style={{ color: '#64748b' }}>Administra el equipo y sus niveles de acceso.</p>
        </div>
        <button onClick={() => { setEditingUser(null); setForm(EMPTY_USER); setShowForm(true); }} className="btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '10px' }}>
          ➕ Agregar Asesor
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {planStats.map(plan => (
          <div key={plan.id} style={{ background: '#fff', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem' }}>{plan.icon}</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>{plan.count}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>{plan.name}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar por nombre, email o agencia..." className="form-input" style={{ maxWidth: '400px' }} />
      </div>

      {isLoading ? (
        <p>Cargando equipo...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(user => (
            <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#fff', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e2e8f0', opacity: user.active ? 1 : 0.6 }}>
              <img src={user.photo_url || 'https://via.placeholder.com/60'} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700' }}>{user.name}</span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#e2e8f0' }}>{user.plan}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0' }}>{user.role} · {user.agency || 'Independiente'}</p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{user.email}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => { setEditingUser(user); setForm(user); setShowForm(true); }} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => toggleActive(user)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>{user.active ? 'Desactivar' : 'Activar'}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '16px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingUser ? 'Editar Asesor' : 'Nuevo Asesor'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="form-input" />
              <input type="text" placeholder="Cargo (e.g. Team Leader)" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="form-input" />
              <input type="text" placeholder="Agencia (e.g. IBR)" value={form.agency} onChange={e => setForm({...form, agency: e.target.value})} className="form-input" />
              <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} className="form-input">
                {Object.entries(PLANS).map(([key, p]) => <option key={key} value={key}>{p.name}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={saveUser} disabled={isSaving} className="btn-primary" style={{ flex: 1 }}>{isSaving ? 'Guardando...' : 'Guardar'}</button>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

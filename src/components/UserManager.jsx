import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { SAMPLE_USERS, PLANS } from '../data/sampleData';

const EMPTY_USER = {
  name: '',
  email: '',
  position: '',
  phone: '',
  whatsapp: '',
  company: '',
  license: '',
  location: '',
  bio: '',
  avatar_url: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  youtube: '',
  linkedin: '',
  website: '',
  portfolio_url: '',
  plan: 'basic',
  active: true,

};

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = creando nuevo
  const [form, setForm] = useState(EMPTY_USER);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');

  // ── Cargar usuarios ────────────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data && data.length > 0 ? data : SAMPLE_USERS);
    } catch (err) {
      console.warn('Supabase users no disponible, usando sample data:', err.message);
      setUsers(SAMPLE_USERS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openNew = () => {
    setEditingUser(null);
    setForm(EMPTY_USER);
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ ...user });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const saveUser = async () => {
    if (!form.name || !form.email) {
      alert('El Nombre y el Email son obligatorios.');
      return;
    }
    setIsSaving(true);
    try {
      let saved;
      if (editingUser) {
        // Update
        try {
          const { data, error } = await supabase
            .from('users').update(form).eq('id', editingUser.id).select().single();
          if (error) throw error;
          saved = data;
        } catch { saved = { ...form, id: editingUser.id }; }
        setUsers(prev => prev.map(u => u.id === saved.id ? saved : u));
      } else {
        // Insert
        try {
          const { data, error } = await supabase
            .from('users').insert(form).select().single();
          if (error) throw error;
          saved = data;
        } catch { saved = { ...form, id: `u_local_${Date.now()}` }; }
        setUsers(prev => [saved, ...prev]);
      }
      setShowForm(false);
      alert(editingUser ? '¡Asesor actualizado!' : '¡Asesor creado exitosamente!');
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

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.company?.toLowerCase().includes(search.toLowerCase())
  );

  const planStats = Object.entries(PLANS).map(([key, plan]) => ({
    ...plan,
    count: users.filter(u => u.plan === key).length
  }));

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-1px' }}>
            Gestión de Asesores
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
            Administra cuentas, planes y accesos de todos los usuarios del CRM.
          </p>
        </div>
        <button onClick={openNew} className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.9rem' }}>
          ➕ Nuevo Asesor
        </button>
      </div>

      {/* Plan Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {planStats.map(plan => (
          <div key={plan.id} style={{
            background: '#ffffff', borderRadius: '12px', padding: '1rem 1.25rem',
            border: `1px solid #e2e8f0`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', gap: '0.25rem'
          }}>
            <span style={{ fontSize: '1.25rem' }}>{plan.icon}</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{plan.count}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>{plan.name}</span>
          </div>
        ))}
        <div style={{
          background: '#0f172a', borderRadius: '12px', padding: '1rem 1.25rem',
          display: 'flex', flexDirection: 'column', gap: '0.25rem'
        }}>
          <span style={{ fontSize: '1.25rem' }}>👥</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>{users.length}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' }}>Total Usuarios</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Buscar por nombre, email o empresa..."
          className="form-input"
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '3rem', color: '#64748b' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span>Cargando asesores...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(user => {
            const plan = PLANS[user.plan] || PLANS.starter;
            return (
              <div key={user.id} style={{
                display: 'flex', alignItems: 'center', gap: '1.25rem',
                background: '#ffffff', borderRadius: '14px', padding: '1.25rem',
                border: user.active ? '1px solid #e2e8f0' : '1px solid #fca5a5',
                opacity: user.active ? 1 : 0.65,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                flexWrap: 'wrap'
              }}>
                {/* Avatar */}
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=80'}
                  alt={user.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `3px solid ${plan.color}` }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{user.name}</span>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px',
                      background: plan.color + '22', color: plan.color, border: `1px solid ${plan.color}44`
                    }}>
                      {plan.icon} {plan.name}
                    </span>
                    {!user.active && (
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', background: '#fee2e2', color: '#991b1b' }}>
                        INACTIVO
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0' }}>
                    {user.position} {user.company ? `· ${user.company}` : ''}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    ✉️ {user.email} {user.phone ? `· 📞 ${user.phone}` : ''}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => openEdit(user)} style={{
                    padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600',
                    background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', cursor: 'pointer'
                  }}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => toggleActive(user)} style={{
                    padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600',
                    background: user.active ? '#fef2f2' : '#f0fdf4',
                    color: user.active ? '#dc2626' : '#16a34a',
                    border: user.active ? '1px solid #fca5a5' : '1px solid #86efac',
                    cursor: 'pointer'
                  }}>
                    {user.active ? '⏸ Desactivar' : '▶ Activar'}
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👤</div>
              <p style={{ fontWeight: '600' }}>No se encontraron asesores</p>
            </div>
          )}
        </div>
      )}

      {/* ── Modal / Form ─────────────────────────────────────────────────────── */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '20px', padding: '2.5rem',
            width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
                {editingUser ? '✏️ Editar Asesor' : '➕ Nuevo Asesor'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{
                background: '#f1f5f9', border: 'none', borderRadius: '8px',
                padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '1rem', color: '#64748b'
              }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                { label: 'Nombre Completo *', name: 'name', type: 'text' },
                { label: 'Email *', name: 'email', type: 'email' },
                { label: 'Cargo / Posición', name: 'position', type: 'text' },
                { label: 'Empresa / Inmobiliaria', name: 'company', type: 'text' },
                { label: 'Teléfono', name: 'phone', type: 'text' },
                { label: 'WhatsApp', name: 'whatsapp', type: 'text' },
                { label: 'Licencia / Certificación', name: 'license', type: 'text' },
                { label: 'Municipio', name: 'location', type: 'text' },
                { label: '📸 Instagram', name: 'instagram', type: 'text' },
                { label: '👥 Facebook', name: 'facebook', type: 'text' },
                { label: '🎵 TikTok', name: 'tiktok', type: 'text' },
                { label: '▶️ YouTube', name: 'youtube', type: 'text' },
                { label: '💼 LinkedIn', name: 'linkedin', type: 'text' },
                { label: '🌐 Sitio Web', name: 'website', type: 'text' },
                { label: '📂 Link Portafolio / PDF', name: 'portfolio_url', type: 'text' },
              ].map(field => (
                <div key={field.name}>
                  <label className="form-label">{field.label}</label>
                  <input type={field.type} name={field.name} value={form[field.name] || ''} onChange={handleChange} className="form-input" />
                </div>
              ))}


              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Plan de Suscripción</label>
                <select name="plan" value={form.plan} onChange={handleChange} className="form-select">
                  {Object.entries(PLANS).map(([key, plan]) => (
                    <option key={key} value={key}>{plan.icon} {plan.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">URL Foto de Perfil</label>
                <input type="text" name="avatar_url" value={form.avatar_url || ''} onChange={handleChange} className="form-input" placeholder="https://..." />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Biografía</label>
                <textarea name="bio" value={form.bio || ''} onChange={handleChange} className="form-textarea" style={{ height: '80px', resize: 'vertical' }} placeholder="Trayectoria y especialidad del asesor..." />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="active" id="active-check" checked={form.active} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: '#0284c7' }} />
                <label htmlFor="active-check" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b', cursor: 'pointer' }}>
                  Cuenta Activa
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
              <button onClick={() => setShowForm(false)} style={{
                padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#f1f5f9',
                color: '#475569', border: 'none', cursor: 'pointer', fontWeight: '600'
              }}>
                Cancelar
              </button>
              <button onClick={saveUser} disabled={isSaving} className="btn-primary"
                style={{ padding: '0.75rem 2rem', borderRadius: '8px', opacity: isSaving ? 0.7 : 1 }}>
                {isSaving ? 'Guardando...' : (editingUser ? 'Guardar Cambios' : 'Crear Asesor')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

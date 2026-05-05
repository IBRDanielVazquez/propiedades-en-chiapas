import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const EMPTY = { title: '', slug: '', html_content: '', active: true };

const toSlug = (text) =>
  text.toLowerCase().trim()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-');

export default function LandingManager() {
  const [landings, setLandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'editor'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('landings')
      .select('id, slug, title, active, views, created_at, updated_at')
      .order('created_at', { ascending: false });
    setLandings(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setPreview(false);
    setView('editor');
  };

  const openEdit = async (landing) => {
    const { data } = await supabase.from('landings').select('*').eq('id', landing.id).single();
    setEditing(data);
    setForm(data);
    setPreview(false);
    setView('editor');
  };

  const handleTitle = (val) => {
    setForm(f => ({
      ...f,
      title: val,
      slug: editing ? f.slug : toSlug(val),
    }));
  };

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      alert('El título y el slug son obligatorios.');
      return;
    }
    if (!form.html_content.trim()) {
      alert('Pega el código HTML de tu landing.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from('landings').update({
          title: form.title,
          slug: form.slug,
          html_content: form.html_content,
          active: form.active,
        }).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('landings').insert({
          title: form.title,
          slug: form.slug,
          html_content: form.html_content,
          active: form.active,
        });
        if (error) throw error;
      }
      await load();
      setView('list');
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (landing) => {
    const newActive = !landing.active;
    setLandings(prev => prev.map(l => l.id === landing.id ? { ...l, active: newActive } : l));
    await supabase.from('landings').update({ active: newActive }).eq('id', landing.id);
  };

  const deleteLanding = async (landing) => {
    if (!confirm(`¿Eliminar "${landing.title}"? Esta acción no se puede deshacer.`)) return;
    await supabase.from('landings').delete().eq('id', landing.id);
    setLandings(prev => prev.filter(l => l.id !== landing.id));
  };

  const copyUrl = (slug) => {
    const url = `${window.location.origin}/l/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(slug);
    setTimeout(() => setCopied(''), 2000);
  };

  const KF = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  `;

  // ── EDITOR ────────────────────────────────────────────────────────────────
  if (view === 'editor') {
    return (
      <>
        <style>{KF}</style>
        <div style={{ animation: 'fadeIn .3s ease' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap' }}>
            <button onClick={() => setView('list')} style={{ background:'#f1f5f9', border:'none', borderRadius:8, padding:'.5rem 1rem', cursor:'pointer', fontWeight:700, color:'#64748b' }}>
              ← Volver
            </button>
            <h1 style={{ fontSize:'1.75rem', fontWeight:900, color:'#1e293b', margin:0 }}>
              {editing ? 'Editar Landing' : 'Nueva Landing'}
            </h1>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:'1.5rem', alignItems:'start' }}>
            {/* Sidebar config */}
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'1.5rem' }}>
                <label style={{ fontSize:'.78rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:'.4rem' }}>Título</label>
                <input
                  value={form.title}
                  onChange={e => handleTitle(e.target.value)}
                  placeholder="Ej: Sima Park - Octubre 2026"
                  style={{ width:'100%', border:'1px solid #e2e8f0', borderRadius:8, padding:'.7rem', fontSize:'.95rem', boxSizing:'border-box' }}
                />
              </div>

              <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'1.5rem' }}>
                <label style={{ fontSize:'.78rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'.04em', display:'block', marginBottom:'.4rem' }}>Slug (URL)</label>
                <div style={{ display:'flex', alignItems:'center', gap:'.4rem', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, padding:'.5rem .75rem' }}>
                  <span style={{ color:'#94a3b8', fontSize:'.8rem', flexShrink:0 }}>/l/</span>
                  <input
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s/g,'-') }))}
                    placeholder="mi-landing"
                    style={{ border:'none', background:'transparent', outline:'none', width:'100%', fontSize:'.88rem', fontWeight:700, color:'#1e293b' }}
                  />
                </div>
                {form.slug && (
                  <div style={{ marginTop:'.5rem', fontSize:'.75rem', color:'#64748b' }}>
                    URL: <strong>{window.location.origin}/l/{form.slug}</strong>
                  </div>
                )}
              </div>

              <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontWeight:700, fontSize:'.9rem' }}>Publicada</span>
                <button
                  onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  style={{
                    width:48, height:28, borderRadius:14, border:'none', cursor:'pointer',
                    background: form.active ? '#22c55e' : '#e2e8f0',
                    position:'relative', transition:'background .2s'
                  }}
                >
                  <span style={{
                    position:'absolute', top:3, left: form.active ? 22 : 3,
                    width:22, height:22, borderRadius:'50%', background:'#fff',
                    transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)'
                  }}/>
                </button>
              </div>

              <div style={{ display:'flex', gap:'.75rem' }}>
                <button
                  onClick={() => setPreview(p => !p)}
                  style={{ flex:1, padding:'.85rem', background:'#f8fafc', border:'2px solid #e2e8f0', borderRadius:12, fontWeight:700, cursor:'pointer', fontSize:'.88rem' }}
                >
                  {preview ? '💻 Editor' : '👁 Preview'}
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  style={{ flex:1, padding:'.85rem', background:'#1A1A6E', color:'#fff', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer', fontSize:'.88rem' }}
                >
                  {saving ? '...' : '💾 Guardar'}
                </button>
              </div>
            </div>

            {/* Editor / Preview */}
            <div style={{ background:'#fff', borderRadius:16, border:'1px solid #e2e8f0', overflow:'hidden', minHeight:600 }}>
              {preview ? (
                <iframe
                  srcDoc={form.html_content || '<p style="padding:2rem;color:#94a3b8">Pega tu código HTML para ver el preview...</p>'}
                  style={{ width:'100%', height:700, border:'none', display:'block' }}
                  sandbox="allow-scripts allow-same-origin"
                  title="Preview landing"
                />
              ) : (
                <div style={{ height:'100%' }}>
                  <div style={{ padding:'.75rem 1rem', background:'#0f172a', display:'flex', alignItems:'center', gap:'.5rem' }}>
                    <span style={{ width:12, height:12, borderRadius:'50%', background:'#ef4444', display:'inline-block' }}/>
                    <span style={{ width:12, height:12, borderRadius:'50%', background:'#f59e0b', display:'inline-block' }}/>
                    <span style={{ width:12, height:12, borderRadius:'50%', background:'#22c55e', display:'inline-block' }}/>
                    <span style={{ marginLeft:'.5rem', color:'#94a3b8', fontSize:'.78rem', fontWeight:600 }}>index.html</span>
                  </div>
                  <textarea
                    value={form.html_content}
                    onChange={e => setForm(f => ({ ...f, html_content: e.target.value }))}
                    placeholder={'<!DOCTYPE html>\n<html>\n<head>\n  <title>Mi Landing</title>\n</head>\n<body>\n  <!-- Pega aquí tu código HTML completo -->\n</body>\n</html>'}
                    spellCheck={false}
                    style={{
                      width:'100%', height:640, border:'none', outline:'none',
                      padding:'1.25rem', fontSize:'.82rem', lineHeight:1.6,
                      fontFamily:'\'Fira Code\',\'Cascadia Code\',Consolas,monospace',
                      background:'#1e293b', color:'#e2e8f0',
                      resize:'vertical', boxSizing:'border-box',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── LISTA ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{KF}</style>
      <div style={{ animation: 'fadeIn .3s ease' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontSize:'2rem', fontWeight:900, color:'#1e293b', margin:'0 0 .25rem' }}>Landing Pages</h1>
            <p style={{ color:'#64748b', margin:0 }}>Pega código HTML y publica en segundos.</p>
          </div>
          <button
            onClick={openNew}
            style={{ background:'#1A1A6E', color:'#fff', border:'none', borderRadius:12, padding:'.85rem 1.75rem', fontWeight:800, cursor:'pointer', fontSize:'.95rem' }}
          >
            + Nueva Landing
          </button>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}>
            <div style={{ width:32, height:32, border:'3px solid #e2e8f0', borderTopColor:'#1A1A6E', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
          </div>
        ) : landings.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:16, border:'2px dashed #e2e8f0', padding:'5rem 2rem', textAlign:'center' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🚀</div>
            <h3 style={{ fontWeight:800, color:'#1e293b', marginBottom:'.5rem' }}>Sin landing pages aún</h3>
            <p style={{ color:'#64748b', marginBottom:'1.5rem' }}>Crea tu primera landing pegando el código HTML.</p>
            <button onClick={openNew} style={{ background:'#1A1A6E', color:'#fff', border:'none', borderRadius:10, padding:'.85rem 2rem', fontWeight:700, cursor:'pointer' }}>
              + Nueva Landing
            </button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {landings.map(landing => (
              <div key={landing.id} style={{
                background:'#fff', borderRadius:14, border:'1px solid #e2e8f0',
                padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:'1.25rem',
                opacity: landing.active ? 1 : 0.65, boxShadow:'0 2px 8px rgba(0,0,0,.04)'
              }}>
                {/* Estado */}
                <div style={{
                  width:10, height:10, borderRadius:'50%', flexShrink:0,
                  background: landing.active ? '#22c55e' : '#94a3b8',
                  boxShadow: landing.active ? '0 0 6px #22c55e' : 'none'
                }}/>

                {/* Info */}
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, color:'#1e293b', fontSize:'1rem', marginBottom:'.2rem' }}>{landing.title}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'.5rem', flexWrap:'wrap' }}>
                    <code style={{ fontSize:'.75rem', color:'#64748b', background:'#f8fafc', padding:'2px 8px', borderRadius:6 }}>
                      /l/{landing.slug}
                    </code>
                    <span style={{ fontSize:'.75rem', color:'#94a3b8' }}>👁 {landing.views} vistas</span>
                    <span style={{ fontSize:'.75rem', color:'#94a3b8' }}>
                      {new Date(landing.updated_at).toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div style={{ display:'flex', gap:'.5rem', alignItems:'center', flexShrink:0 }}>
                  <button
                    onClick={() => copyUrl(landing.slug)}
                    style={{ padding:'6px 14px', borderRadius:8, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#475569', fontWeight:700, fontSize:'.75rem', cursor:'pointer' }}
                  >
                    {copied === landing.slug ? '✅ Copiado' : '🔗 URL'}
                  </button>
                  <a
                    href={`/l/${landing.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding:'6px 14px', borderRadius:8, border:'1px solid #bfdbfe', background:'#eff6ff', color:'#2563eb', fontWeight:700, fontSize:'.75rem', textDecoration:'none' }}
                  >
                    Ver →
                  </a>
                  <button
                    onClick={() => toggleActive(landing)}
                    style={{ padding:'6px 14px', borderRadius:8, fontSize:'.75rem', fontWeight:700, cursor:'pointer', border: landing.active ? '1px solid #fca5a5' : '1px solid #86efac', background: landing.active ? '#fef2f2' : '#f0fdf4', color: landing.active ? '#dc2626' : '#16a34a' }}
                  >
                    {landing.active ? 'Pausar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => openEdit(landing)}
                    style={{ padding:'6px 14px', borderRadius:8, border:'1px solid #c7d2fe', background:'#eef2ff', color:'#4338ca', fontWeight:700, fontSize:'.75rem', cursor:'pointer' }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => deleteLanding(landing)}
                    style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #fca5a5', background:'#fff', color:'#dc2626', fontWeight:700, fontSize:'.75rem', cursor:'pointer' }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

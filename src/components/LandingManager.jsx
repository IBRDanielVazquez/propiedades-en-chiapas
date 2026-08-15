import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const EMPTY = { title: '', slug: '', html_content: '', active: true, tag: 'Dinámica' };

// Landings del sistema y estáticas
const SYSTEM_LANDINGS = [
  {
    id: 'sys-bella-vista',
    title: 'Bella Vista Ocozocoautla (React App)',
    slug: 'bella-vista',
    url: '/bella-vista',
    tag: 'Desarrollo',
    type: 'system',
    active: true,
    views: '—',
  },
  {
    id: 'sys-rioja',
    title: 'Rioja Berriozábal (+ Tour 360°)',
    slug: 'rioja',
    url: '/rioja',
    tag: 'Desarrollo',
    type: 'system',
    active: true,
    views: '—',
  },
  {
    id: 'sys-bella-vista-pagos',
    title: 'Bella Vista Ocozocoautla (Terrenos en Pagos)',
    slug: 'bella-vista-terrenos-en-ocozocoautla-en-pagos',
    url: '/bella-vista-terrenos-en-ocozocoautla-en-pagos',
    tag: 'Desarrollo',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-la-canada',
    title: 'La Cañada Desarrollo Eco-Campestre',
    slug: 'la-canada-desarrollo-eco-campestre',
    url: '/la-canada-desarrollo-eco-campestre',
    tag: 'Desarrollo',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-monte-olivos',
    title: 'Monte de los Olivos (Berriozábal)',
    slug: 'monte-de-los-olivos',
    url: '/monte-de-los-olivos',
    tag: 'Desarrollo',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-valle-campestre',
    title: 'Valle Campestre – Prototipo ARECA (Casas)',
    slug: 'valle-campestre',
    url: '/valle-campestre',
    tag: 'Desarrollo',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-quinta-berriozabal',
    title: 'Quinta en Berriozábal',
    slug: 'quinta-en-berriozabal',
    url: '/quinta-en-berriozabal',
    tag: 'Desarrollo',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-cuauhtli',
    title: 'Cuauhtli Terrenos en Venta (El Jobo)',
    slug: 'cuauhtli-terrenos-en-venta-en-el-jobo',
    url: '/cuauhtli-terrenos-en-venta-en-el-jobo',
    tag: 'Desarrollo',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-el-higo-copoya',
    title: 'El Higo Copoya (Terrenos 10×20)',
    slug: 'el-higo-copoya-terrenos-10x20-en-copoya',
    url: '/el-higo-copoya-terrenos-10x20-en-copoya',
    tag: 'Desarrollo',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-sima-park',
    title: 'La Sima Park (Ocozocoautla)',
    slug: 'la-sima-park-terrenos-en-ocozocoautla',
    url: '/la-sima-park-terrenos-en-ocozocoautla',
    tag: 'Desarrollo',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-montecristo',
    title: 'Fraccionamiento Montecristo',
    slug: 'fraccionamiento-montecristo',
    url: '/fraccionamiento-montecristo',
    tag: 'Desarrollo',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-colinas-campestre',
    title: 'Colinas del Campestre',
    slug: 'colinas-del-campestre',
    url: '/colinas-del-campestre',
    tag: 'Desarrollo',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-asesores-general',
    title: 'Reclutamiento de Asesores Inmobiliarios',
    slug: 'asesores',
    url: '/asesores',
    tag: 'Asesor',
    type: 'system',
    active: true,
    views: '—',
  },
  {
    id: 'sys-carmen-jimenez',
    title: 'Carmen Jiménez – Asesora IBR',
    slug: 'carmen-jimenez-asesor-inmobiliario-de-ibr',
    url: '/carmen-jimenez-asesor-inmobiliario-de-ibr',
    tag: 'Asesor',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-luis-garcia',
    title: 'Luis García – Asesor IBR',
    slug: 'luis-garcia-asesor-inmobiliario-de-ibr',
    url: '/luis-garcia-asesor-inmobiliario-de-ibr',
    tag: 'Asesor',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-lupyta-mendoza',
    title: 'Lupyta Mendoza – Asesora IBR',
    slug: 'lupyta-mendoza-asesor-inmobiliario-ibr',
    url: '/lupyta-mendoza-asesor-inmobiliario-ibr',
    tag: 'Asesor',
    type: 'static',
    active: true,
    views: '—',
  },
  {
    id: 'sys-plantillas-venta',
    title: 'Sube de Nivel tus Ventas (Plantillas)',
    slug: 'landings',
    url: '/landings',
    tag: 'Plantilla',
    type: 'static',
    active: true,
    views: '—',
  },
];

const toSlug = (text) =>
  text.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-');

const getTagColor = (tag) => {
  switch (tag?.toLowerCase()) {
    case 'desarrollo':
      return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
    case 'asesor':
      return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
    case 'plantilla':
      return { bg: '#f3e8ff', color: '#7e22ce', border: '#e9d5ff' };
    case 'dinámica':
    case 'dinamica':
      return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' };
    default:
      return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };
  }
};

export default function LandingManager() {
  const [landings, setLandings] = useState([]);
  const [staticState, setStaticState] = useState(() => {
    try {
      const saved = localStorage.getItem('pec_static_landings_status');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'editor'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState('');
  const [filterTag, setFilterTag] = useState('todas');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('landings')
        .select('id, slug, title, active, views, created_at, updated_at')
        .order('created_at', { ascending: false });

      const dynamicLandings = (data || []).map(l => ({
        ...l,
        tag: 'Dinámica',
        type: 'dynamic',
        url: `/l/${l.slug}`,
      }));

      setLandings(dynamicLandings);
    } catch {
      setLandings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveStaticStatus = (newStatus) => {
    setStaticState(newStatus);
    try {
      localStorage.setItem('pec_static_landings_status', JSON.stringify(newStatus));
    } catch {}
  };

  const toggleStaticActive = (id) => {
    const current = staticState[id] !== undefined ? staticState[id] : true;
    saveStaticStatus({ ...staticState, [id]: !current });
  };

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setPreview(false);
    setView('editor');
  };

  const openEdit = async (landing) => {
    if (landing.type !== 'dynamic') return;
    const { data } = await supabase.from('landings').select('*').eq('id', landing.id).single();
    setEditing(data);
    setForm({ ...data, tag: 'Dinámica' });
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

  const toggleDynamicActive = async (landing) => {
    const newActive = !landing.active;
    setLandings(prev => prev.map(l => l.id === landing.id ? { ...l, active: newActive } : l));
    await supabase.from('landings').update({ active: newActive }).eq('id', landing.id);
  };

  const deleteLanding = async (landing) => {
    if (!confirm(`¿Eliminar "${landing.title}"? Esta acción no se puede deshacer.`)) return;
    await supabase.from('landings').delete().eq('id', landing.id);
    setLandings(prev => prev.filter(l => l.id !== landing.id));
  };

  const copyUrl = (url, key) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const allList = [
    ...SYSTEM_LANDINGS.map(item => ({
      ...item,
      active: staticState[item.id] !== undefined ? staticState[item.id] : true,
    })),
    ...landings,
  ];

  const filteredList = allList.filter(item => {
    const matchesTag = filterTag === 'todas' || item.tag.toLowerCase() === filterTag.toLowerCase();
    const matchesSearch = !search.trim() || 
      item.title.toLowerCase().includes(search.toLowerCase()) || 
      item.slug.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

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
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap' }}>
            <button onClick={() => setView('list')} style={{ background:'#f1f5f9', border:'none', borderRadius:8, padding:'.5rem 1rem', cursor:'pointer', fontWeight:700, color:'#64748b' }}>
              ← Volver
            </button>
            <h1 style={{ fontSize:'1.75rem', fontWeight:900, color:'#1e293b', margin:0 }}>
              {editing ? 'Editar Landing Dinámica' : 'Nueva Landing HTML'}
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
                  placeholder="Ej: Sima Park - Promoción Especial"
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
                <span style={{ fontWeight:700, fontSize:'.9rem' }}>Etiqueta</span>
                <span style={{
                  fontSize:'.75rem', fontWeight:800, padding:'4px 10px', borderRadius:20,
                  background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0'
                }}>
                  🏷️ Dinámica
                </span>
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

  // ── LISTA CON ETIQUETAS Y BOTONES DE ACTIVAR / DESACTIVAR ──────────────────
  return (
    <>
      <style>{KF}</style>
      <div style={{ animation: 'fadeIn .3s ease' }}>
        
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontSize:'2rem', fontWeight:900, color:'#1e293b', margin:'0 0 .25rem' }}>
              Landing Pages ({allList.length})
            </h1>
            <p style={{ color:'#64748b', margin:0 }}>
              Gestión centralizada de landings con etiquetas y control de activación.
            </p>
          </div>
          <button
            onClick={openNew}
            style={{ background:'#1A1A6E', color:'#fff', border:'none', borderRadius:12, padding:'.85rem 1.75rem', fontWeight:800, cursor:'pointer', fontSize:'.95rem' }}
          >
            + Nueva Landing HTML
          </button>
        </div>

        {/* Toolbar: Filtros por Etiqueta y Buscador */}
        <div style={{
          display:'flex', gap:'1rem', alignItems:'center', justifyContent:'space-between',
          marginBottom:'1.5rem', flexWrap:'wrap', background:'#fff', padding:'1rem 1.25rem',
          borderRadius:14, border:'1px solid #e2e8f0'
        }}>
          {/* Categorías por Etiqueta */}
          <div style={{ display:'flex', gap:'.5rem', overflowX:'auto' }}>
            {[
              { id: 'todas', label: `Todas (${allList.length})` },
              { id: 'desarrollo', label: '🏡 Desarrollos' },
              { id: 'asesor', label: '👤 Asesores' },
              { id: 'dinámica', label: '⚡ Dinámicas HTML' },
              { id: 'plantilla', label: '📄 Plantillas' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterTag(tab.id)}
                style={{
                  padding:'6px 14px', borderRadius:20, border:'none', cursor:'pointer',
                  fontSize:'.82rem', fontWeight:700,
                  background: filterTag === tab.id ? '#1e293b' : '#f1f5f9',
                  color: filterTag === tab.id ? '#fff' : '#64748b',
                  transition:'all .15s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Buscador */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Buscar por nombre o URL..."
            style={{
              padding:'6px 14px', borderRadius:20, border:'1px solid #cbd5e1',
              fontSize:'.82rem', width:240, outline:'none', background:'#fafafa'
            }}
          />
        </div>

        {/* Lista de Landings */}
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'4rem' }}>
            <div style={{ width:32, height:32, border:'3px solid #e2e8f0', borderTopColor:'#1A1A6E', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
          </div>
        ) : filteredList.length === 0 ? (
          <div style={{ background:'#fff', borderRadius:16, border:'2px dashed #e2e8f0', padding:'4rem 2rem', textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>🔍</div>
            <h3 style={{ fontWeight:800, color:'#1e293b', marginBottom:'.25rem' }}>No hay landings en esta categoría</h3>
            <p style={{ color:'#64748b', fontSize:'.9rem' }}>Intenta cambiar el filtro o la búsqueda.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
            {filteredList.map(item => {
              const tagStyle = getTagColor(item.tag);
              const isActive = item.active;

              return (
                <div
                  key={item.id}
                  style={{
                    background: '#fff', borderRadius: 14,
                    border: '1px solid #e2e8f0', padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                    opacity: isActive ? 1 : 0.6,
                    boxShadow: '0 2px 6px rgba(0,0,0,.03)',
                    transition: 'all .2s'
                  }}
                >
                  {/* Punto Indicador de Estado */}
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: isActive ? '#22c55e' : '#94a3b8',
                    boxShadow: isActive ? '0 0 6px #22c55e' : 'none'
                  }} />

                  {/* Info Principal */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.25rem' }}>
                      <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.98rem' }}>
                        {item.title}
                      </span>
                      {/* ETIQUETA / BADGE */}
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 800, padding: '2px 9px', borderRadius: 12,
                        background: tagStyle.bg, color: tagStyle.color, border: `1px solid ${tagStyle.border}`,
                        whiteSpace: 'nowrap'
                      }}>
                        🏷️ {item.tag}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
                      <code style={{ fontSize: '.75rem', color: '#64748b', background: '#f8fafc', padding: '2px 8px', borderRadius: 6 }}>
                        {item.url}
                      </code>
                      <span style={{ fontSize: '.75rem', color: '#94a3b8' }}>
                        {item.type === 'dynamic' ? `👁 ${item.views} vistas` : `⚡ Integrada`}
                      </span>
                    </div>
                  </div>

                  {/* Acciones: Botón Activar/Desactivar + Ver + Copiar + Editar */}
                  <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexShrink: 0 }}>
                    {/* Botón COPIAR URL */}
                    <button
                      onClick={() => copyUrl(item.url, item.id)}
                      style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: '.75rem', cursor: 'pointer' }}
                    >
                      {copied === item.id ? '✅ Copiado' : '🔗 URL'}
                    </button>

                    {/* Botón VER LANDING */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #bfdbfe', background: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '.75rem', textDecoration: 'none' }}
                    >
                      Ver →
                    </a>

                    {/* BOTÓN ACTIVAR / DESACTIVAR */}
                    <button
                      onClick={() => {
                        if (item.type === 'dynamic') {
                          toggleDynamicActive(item);
                        } else {
                          toggleStaticActive(item.id);
                        }
                      }}
                      style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: '.75rem', fontWeight: 800, cursor: 'pointer',
                        border: isActive ? '1px solid #fca5a5' : '1px solid #86efac',
                        background: isActive ? '#fef2f2' : '#f0fdf4',
                        color: isActive ? '#dc2626' : '#16a34a',
                        transition: 'all .15s'
                      }}
                    >
                      {isActive ? '🔴 Desactivar' : '🟢 Activar'}
                    </button>

                    {/* EDITAR / ELIMINAR solo para dinámicas */}
                    {item.type === 'dynamic' && (
                      <>
                        <button
                          onClick={() => openEdit(item)}
                          style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4338ca', fontWeight: 700, fontSize: '.75rem', cursor: 'pointer' }}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => deleteLanding(item)}
                          style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', fontWeight: 700, fontSize: '.75rem', cursor: 'pointer' }}
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

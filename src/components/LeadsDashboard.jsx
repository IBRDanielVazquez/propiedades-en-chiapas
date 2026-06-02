import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  ArrowRight,
  Building2,
  CalendarClock,
  Database,
  Download,
  Filter,
  Inbox,
  Mail,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  UserRound
} from 'lucide-react';

const PROJECT_LABELS = {
  'bella-vista-ocozocoautla': 'Bella Vista Ocozocoautla',
  'bella-vista': 'Bella Vista Ocozocoautla',
  'la-sima-park': 'La Sima Park',
  'fraccionamiento-montecristo': 'Fraccionamiento Montecristo',
  'cuauhtli': 'Cuauhtli El Jobo',
  portal: 'Portal general'
};

const SAMPLE_LEADS = [
  {
    id: 'preview-1',
    name: 'Mariana López',
    phone: '961 234 5678',
    email: 'mariana@email.com',
    message: 'Esta semana',
    source: 'bella-vista-landing',
    source_project: 'bella-vista-ocozocoautla',
    landing_section: 'formulario',
    utm_source: 'facebook',
    utm_medium: 'cpc',
    utm_campaign: 'preventa-junio',
    created_at: new Date().toISOString(),
    previewOnly: true
  },
  {
    id: 'preview-2',
    name: 'Carlos Méndez',
    phone: '967 888 1212',
    email: '',
    message: 'Solo quiero información',
    source: 'whatsapp-float',
    source_project: 'bella-vista-ocozocoautla',
    landing_section: 'whatsapp',
    utm_source: 'instagram',
    utm_medium: 'bio',
    utm_campaign: 'organico',
    created_at: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
    previewOnly: true
  },
  {
    id: 'preview-3',
    name: 'Ana Sofía Ruiz',
    phone: '961 555 4040',
    email: 'ana.sofia@email.com',
    message: 'La próxima semana',
    source: 'portal',
    source_project: 'la-sima-park',
    landing_section: 'agenda',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    previewOnly: true
  }
];

const getProjectLabel = (project) => PROJECT_LABELS[project] || cleanLabel(project || 'portal');

function cleanLabel(value) {
  return String(value || 'Portal general')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizePhone(phone = '') {
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `52${digits}`;
  return digits;
}

function formatTime(dateValue) {
  if (!dateValue) return 'Sin fecha';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function sameDay(dateValue, now = new Date()) {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  return date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
}

function getLeadStage(lead) {
  if (lead.visit_date) return { label: 'Visita agendada', color: '#2563eb', bg: '#dbeafe' };
  if (lead.phone) return { label: 'Nuevo lead', color: '#15803d', bg: '#dcfce7' };
  return { label: 'Por completar', color: '#b45309', bg: '#fef3c7' };
}

function csvEscape(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export default function LeadsDashboard({ currentUser, isMobile = false, forcePreview = false }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const isAdmin = currentUser?.plan === 'admin';

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    if (forcePreview) {
      setLeads([]);
      setSelectedId(SAMPLE_LEADS[0].id);
      setLoading(false);
      return;
    }
    try {
      const columns = [
        'id',
        'name',
        'email',
        'phone',
        'message',
        'source',
        'created_at',
        'user_id',
        'property_id',
        'source_project',
        'profile_type',
        'landing_section',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'ad_id',
        'visit_date',
        'first_response_min'
      ].join(',');

      let query = supabase
        .from('leads')
        .select(columns)
        .order('created_at', { ascending: false })
        .limit(250);

      if (!isAdmin && currentUser?.id) {
        query = query.eq('user_id', currentUser.id);
      }

      const { data, error } = await query;
      if (error) throw error;

      setLeads(data || []);
      if (data?.[0]) setSelectedId(data[0].id);
    } catch (error) {
      setErrorMsg(error.message || 'No se pudieron cargar los leads.');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, forcePreview, isAdmin]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const displayLeads = leads.length ? leads : SAMPLE_LEADS;
  const isPreviewMode = forcePreview || (!loading && leads.length === 0);

  const projects = useMemo(() => {
    const unique = Array.from(new Set(displayLeads.map((lead) => lead.source_project || 'portal')));
    return unique.sort((a, b) => getProjectLabel(a).localeCompare(getProjectLabel(b), 'es'));
  }, [displayLeads]);

  const filteredLeads = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return displayLeads.filter((lead) => {
      const matchesProject = projectFilter === 'all' || (lead.source_project || 'portal') === projectFilter;
      const haystack = [lead.name, lead.phone, lead.email, lead.message, getProjectLabel(lead.source_project)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesProject && (!query || haystack.includes(query));
    });
  }, [displayLeads, projectFilter, searchTerm]);

  const selectedLead = filteredLeads.find((lead) => lead.id === selectedId) || filteredLeads[0] || displayLeads[0];

  const stats = useMemo(() => {
    const source = leads.length ? leads : SAMPLE_LEADS;
    const today = source.filter((lead) => sameDay(lead.created_at)).length;
    const withPhone = source.filter((lead) => Boolean(lead.phone)).length;
    const uniqueProjects = new Set(source.map((lead) => lead.source_project || 'portal')).size;
    return { total: source.length, today, withPhone, uniqueProjects };
  }, [leads]);

  const exportCsv = () => {
    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.phone,
      lead.email,
      getProjectLabel(lead.source_project),
      lead.message,
      lead.source,
      lead.utm_source,
      lead.utm_medium,
      lead.utm_campaign,
      lead.created_at
    ]);
    const header = ['Nombre', 'Telefono', 'Email', 'Desarrollo', 'Mensaje', 'Fuente', 'UTM source', 'UTM medium', 'UTM campaign', 'Fecha'];
    const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${projectFilter === 'all' ? 'todos' : projectFilter}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const whatsappUrl = selectedLead?.phone
    ? `https://wa.me/${normalizePhone(selectedLead.phone)}?text=${encodeURIComponent(`Hola ${selectedLead.name || ''}, soy de Propiedades en Chiapas. Vi que dejaste tus datos para ${getProjectLabel(selectedLead.source_project)}. ¿Te puedo apoyar con más información?`)}`
    : '';

  return (
    <div style={{ animation: 'fadeIn 0.25s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <p style={{ margin: '0 0 0.45rem', color: '#0284c7', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.78rem' }}>
            CRM de prospectos
          </p>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: 'clamp(1.85rem, 4vw, 3rem)', letterSpacing: '-0.04em', fontWeight: 900 }}>
            Leads por desarrollo
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.55rem', maxWidth: '720px', lineHeight: 1.6 }}>
            Cada formulario entra como ficha: datos, origen, desarrollo, campaña y acción rápida para contactar.
          </p>
        </div>
        <button
          onClick={exportCsv}
          style={{
            border: '1px solid #cbd5e1',
            background: '#fff',
            color: '#0f172a',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          <Download size={18} />
          Exportar CSV
        </button>
      </div>

      {isPreviewMode && (
        <div style={{
          marginBottom: '1rem',
          padding: '1rem 1.15rem',
          borderRadius: '14px',
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          color: '#9a3412',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          <Database size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong>Vista de previsualización.</strong> Aún no hay leads visibles para esta cuenta o las políticas privadas no los exponen a este usuario. La pantalla muestra datos demo para validar cómo se vendería y operaría el módulo.
          </div>
        </div>
      )}

      {errorMsg && (
        <div style={{
          marginBottom: '1rem',
          padding: '1rem 1.15rem',
          borderRadius: '14px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b'
        }}>
          {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <Metric title="Leads totales" value={stats.total} icon={<Inbox size={21} />} />
        <Metric title="Entraron hoy" value={stats.today} icon={<CalendarClock size={21} />} />
        <Metric title="Con WhatsApp" value={stats.withPhone} icon={<MessageCircle size={21} />} />
        <Metric title="Desarrollos" value={stats.uniqueProjects} icon={<Building2 size={21} />} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(330px, 0.95fr) minmax(360px, 1.25fr)',
        gap: '1rem',
        alignItems: 'start'
      }}>
        <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(15,23,42,0.06)' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'grid', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nombre, teléfono o desarrollo"
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem 0.85rem 2.7rem',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#475569', fontWeight: 800 }}>
              <Filter size={17} />
              <select
                value={projectFilter}
                onChange={(event) => {
                  setProjectFilter(event.target.value);
                  setSelectedId('');
                }}
                style={{
                  flex: 1,
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '0.8rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  background: '#fff'
                }}
              >
                <option value="all">Todos los desarrollos</option>
                {projects.map((project) => (
                  <option key={project} value={project}>{getProjectLabel(project)}</option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ maxHeight: '660px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>Cargando leads...</div>
            ) : filteredLeads.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No hay leads con esos filtros.</div>
            ) : filteredLeads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                selected={selectedLead?.id === lead.id}
                onClick={() => setSelectedId(lead.id)}
              />
            ))}
          </div>
        </section>

        <LeadDetail lead={selectedLead} whatsappUrl={whatsappUrl} />
      </div>

      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
        gap: '1rem'
      }}>
        <ProcessCard title="1. Captura" text="Landing, WhatsApp o formulario guardan el lead con desarrollo y campaña." />
        <ProcessCard title="2. Seguimiento" text="El asesor entra a su dashboard privado y ve solo los leads asignados." />
        <ProcessCard title="3. Reporte" text="Admin puede filtrar por desarrollo, asesor, fecha y exportar si hace falta." />
      </div>
    </div>
  );
}

function Metric({ title, value, icon }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1rem',
      boxShadow: '0 12px 28px rgba(15,23,42,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0284c7' }}>
        {icon}
        <span style={{ fontSize: '0.74rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>{title}</span>
      </div>
      <div style={{ marginTop: '0.7rem', fontSize: '2rem', lineHeight: 1, fontWeight: 900, color: '#0f172a' }}>{value}</div>
    </div>
  );
}

function LeadRow({ lead, selected, onClick }) {
  const stage = getLeadStage(lead);
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        border: 0,
        borderBottom: '1px solid #e2e8f0',
        background: selected ? '#f0f9ff' : '#fff',
        padding: '1rem',
        cursor: 'pointer',
        textAlign: 'left'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <UserRound size={17} color="#0284c7" />
            <strong style={{ color: '#0f172a', fontSize: '1rem' }}>{lead.name || 'Sin nombre'}</strong>
          </div>
          <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>{getProjectLabel(lead.source_project)}</p>
        </div>
        <span style={{ flexShrink: 0, borderRadius: '999px', padding: '0.35rem 0.55rem', background: stage.bg, color: stage.color, fontSize: '0.74rem', fontWeight: 900 }}>
          {stage.label}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', color: '#64748b', marginTop: '0.75rem', flexWrap: 'wrap', fontSize: '0.86rem' }}>
        <span>{lead.phone || 'Sin WhatsApp'}</span>
        <span>{formatTime(lead.created_at)}</span>
      </div>
    </button>
  );
}

function LeadDetail({ lead, whatsappUrl }) {
  if (!lead) return null;
  const stage = getLeadStage(lead);
  const fields = [
    ['Nombre', lead.name || 'Sin nombre'],
    ['WhatsApp', lead.phone || 'Sin teléfono'],
    ['Correo', lead.email || 'No capturado'],
    ['Desarrollo', getProjectLabel(lead.source_project)],
    ['Interés / cuándo', lead.message || 'No especificado'],
    ['Fuente', lead.source || 'portal'],
    ['Sección', lead.landing_section || 'formulario'],
    ['Campaña', [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(' / ') || 'Sin UTM']
  ];

  return (
    <section style={{
      background: '#0f172a',
      color: '#e2e8f0',
      borderRadius: '22px',
      overflow: 'hidden',
      boxShadow: '0 24px 70px rgba(15,23,42,0.22)'
    }}>
      <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #0f172a, #164e63)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <p style={{ margin: 0, color: '#67e8f9', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 900, fontSize: '0.76rem' }}>Ficha del lead</p>
            <h2 style={{ margin: '0.45rem 0 0', color: '#fff', fontSize: 'clamp(1.7rem, 3vw, 2.45rem)', lineHeight: 1, fontWeight: 900 }}>
              {lead.name || 'Prospecto sin nombre'}
            </h2>
          </div>
          <span style={{ borderRadius: '999px', padding: '0.4rem 0.7rem', background: stage.bg, color: stage.color, fontWeight: 900, fontSize: '0.78rem' }}>
            {stage.label}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener" style={actionButtonStyle('#22c55e', '#fff')}>
              <MessageCircle size={18} />
              WhatsApp
            </a>
          )}
          {lead.phone && (
            <a href={`tel:${normalizePhone(lead.phone)}`} style={actionButtonStyle('#e0f2fe', '#075985')}>
              <Phone size={18} />
              Llamar
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`} style={actionButtonStyle('#fef3c7', '#92400e')}>
              <Mail size={18} />
              Email
            </a>
          )}
        </div>
      </div>

      <div style={{ padding: '1.25rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.85rem', color: '#bae6fd', fontWeight: 900 }}>
            <ShieldCheck size={18} />
            Formulario lleno
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.85rem' }}>
            {fields.map(([label, value]) => (
              <div key={label} style={{ background: 'rgba(15,23,42,0.55)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p style={{ margin: '0 0 0.35rem', color: '#94a3b8', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 900 }}>{label}</p>
                <strong style={{ color: '#fff', fontSize: '0.98rem', lineHeight: 1.35 }}>{value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          {['Lead capturado', 'Enviar WhatsApp en menos de 5 min', 'Agendar visita', 'Marcar lote de interés'].map((item, index) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: index === 0 ? '#86efac' : '#cbd5e1' }}>
              <span style={{ width: 28, height: 28, borderRadius: '999px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: index === 0 ? '#14532d' : 'rgba(255,255,255,0.08)', fontWeight: 900 }}>
                {index + 1}
              </span>
              <span style={{ fontWeight: 800 }}>{item}</span>
              {index < 3 && <ArrowRight size={16} style={{ marginLeft: 'auto', color: '#64748b' }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessCard({ title, text }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem' }}>
      <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '1.05rem' }}>{title}</h3>
      <p style={{ margin: '0.5rem 0 0', color: '#64748b', lineHeight: 1.55 }}>{text}</p>
    </div>
  );
}

function actionButtonStyle(background, color) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.75rem 0.9rem',
    borderRadius: '999px',
    background,
    color,
    textDecoration: 'none',
    fontWeight: 900
  };
}

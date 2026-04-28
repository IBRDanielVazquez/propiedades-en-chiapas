import React from 'react';

export default function AnalyticsView({ analytics, plan }) {
  if (!plan.features.includes('analytics')) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Analytics no disponible</h3>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Actualiza al plan Premium para acceder a estadísticas completas.</p>
        <button style={{ marginTop: '1.5rem', padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}>
          👑 Actualizar a Premium
        </button>
      </div>
    );
  }

  const barMax = Math.max(...analytics.monthlyViews.map(m => m.views), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        {[
          { label: 'Propiedades', value: analytics.totalProperties, icon: '🏠', color: '#0284c7', bg: '#e0f2fe' },
          { label: 'Activas', value: analytics.activeProperties, icon: '✅', color: '#16a34a', bg: '#dcfce7' },
          { label: 'Vistas Totales', value: analytics.totalViews.toLocaleString(), icon: '👁', color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Leads Captados', value: analytics.totalLeads, icon: '📩', color: '#ea580c', bg: '#fff7ed' }
        ].map((kpi, i) => (
          <div key={i} style={{
            background: '#ffffff', borderRadius: '14px', padding: '1.5rem',
            border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{kpi.label}</span>
              <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{kpi.icon}</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Conversion + Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.25rem' }}>📈 Vistas Mensuales</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', height: '140px' }}>
            {analytics.monthlyViews.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#0284c7' }}>{m.views}</span>
                <div style={{
                  width: '100%', borderRadius: '8px 8px 0 0',
                  background: 'linear-gradient(180deg, #38bdf8, #0284c7)',
                  height: `${Math.max((m.views / barMax) * 120, 8)}px`,
                  transition: 'height 0.5s ease'
                }} />
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.25rem' }}>🎯 Conversión</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px' }}>
            <div style={{ fontSize: '3rem', fontWeight: '900', background: 'linear-gradient(135deg, #0284c7, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {analytics.conversionRate}%
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>Tasa de conversión vista → lead</p>
          </div>
        </div>
      </div>

      {/* Top Property */}
      {analytics.topProperty && (
        <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '14px', padding: '1.75rem', color: '#f8fafc' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>🏆 Propiedad más vista</h3>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <img src={analytics.topProperty.featured_image_url} alt="" style={{ width: '100px', height: '70px', borderRadius: '10px', objectFit: 'cover' }} />
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>{analytics.topProperty.title}</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.25rem 0' }}>{analytics.topProperty.views} vistas · {analytics.topProperty.leads} leads</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

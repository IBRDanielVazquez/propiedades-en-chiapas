export const PLANS = {
  admin:     { id: 'admin',     name: 'Administrador CRM',          maxProperties: 9999, features: ['all_access', 'manage_users', 'tarjeta_digital', 'card_preview', 'card_publish', 'propiedades_ilimitadas', 'landing', 'analytics'], color: '#ef4444', icon: '⚡' },
  developer: { id: 'developer', name: 'Desarrollador / Constructor', maxProperties: 999,  features: ['tarjeta_digital', 'card_preview', 'card_publish', 'propiedades_ilimitadas', 'landing', 'analytics', 'developments'], color: '#f59e0b', icon: '🏗️' },
  starter:   { id: 'starter',   name: 'Starter',                    maxProperties: 1,    features: ['tarjeta_digital', 'card_preview', 'una_propiedad', 'landing'], color: '#64748b', icon: '💳' },
  basic:     { id: 'basic',     name: 'Básico',                     maxProperties: 5,    features: ['tarjeta_digital', 'card_preview', 'card_publish', 'una_propiedad', 'landing'], color: '#0284c7', icon: '🏠' },
  premium:   { id: 'premium',   name: 'Premium',                    maxProperties: 999,  features: ['tarjeta_digital', 'card_preview', 'card_publish', 'propiedades_ilimitadas', 'landing', 'analytics'], color: '#7c3aed', icon: '👑' }
};

export const generateAnalytics = (userId, properties) => {
  const userProps = properties.filter(p => p.user_id === userId);
  const totalViews = userProps.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLeads = userProps.reduce((sum, p) => sum + (p.leads || 0), 0);

  return {
    views: totalViews,
    leads: totalLeads,
    conversion: totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : 0,
    topProperty: userProps.sort((a, b) => (b.views || 0) - (a.views || 0))[0]?.title || 'N/A'
  };
};

// Subscription Plans
export const PLANS = {
  admin:     { id: 'admin',     name: 'Administrador CRM',          maxProperties: 9999, features: ['all_access', 'manage_users', 'tarjeta_digital', 'card_preview', 'card_publish', 'propiedades_ilimitadas', 'landing', 'analytics'], color: '#ef4444', icon: '⚡' },
  developer: { id: 'developer', name: 'Desarrollador / Constructor', maxProperties: 999,  features: ['tarjeta_digital', 'card_preview', 'card_publish', 'propiedades_ilimitadas', 'landing', 'analytics', 'developments'], color: '#f59e0b', icon: '🏗️' },
  starter:   { id: 'starter',   name: 'Starter',                    maxProperties: 1,    features: ['tarjeta_digital', 'card_preview', 'una_propiedad', 'landing'], color: '#64748b', icon: '💳' },
  basic:     { id: 'basic',     name: 'Básico',                     maxProperties: 5,    features: ['tarjeta_digital', 'card_preview', 'card_publish', 'una_propiedad', 'landing'], color: '#0284c7', icon: '🏠' },
  premium:   { id: 'premium',   name: 'Premium',                    maxProperties: 999,  features: ['tarjeta_digital', 'card_preview', 'card_publish', 'propiedades_ilimitadas', 'landing', 'analytics'], color: '#7c3aed', icon: '👑' }
};

export const SAMPLE_USERS = [
  {
    id: 'u0',
    name: 'Daniel (Project Manager)',
    email: 'admin@crmestate.com',
    position: 'Administrador del CRM',
    phone: '961 000 0000',
    whatsapp: '9610000000',
    company: 'CRM Estate Global',
    license: 'MASTER-ADMIN',
    location: 'TUXTLA GUTIERREZ',
    bio: 'Administrador general y director de proyectos inmobiliarios en el CRM.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    linkedin: '',
    website: '',
    plan: 'admin'
  },
  {
    id: 'u1',
    name: 'Daniel Vázquez',
    email: 'daniel@propiedadesenchiapas.com',
    position: 'Asesor Inmobiliario Senior',
    phone: '961 123 4567',
    email: 'capacitacionparapymes@gmail.com',
    role: 'Premium',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    slug: 'daniel-vazquez',
    phone: '9612466204',
    whatsapp: '5219612466204',
    agency: 'Independiente'
  },
  {
    id: '5efd0207-17cf-4315-81a2-e3d903e48328',
    name: 'Carmen Jiménez',
    email: 'carmen@propiedadesenchiapas.com',
    role: 'Premium',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    slug: 'carmen-jimenez',
    phone: '9610000001',
    whatsapp: '5219610000001',
    agency: 'Independiente'
  },
  {
    id: '215637a9-5d6a-4e18-953f-510cfca9cd7f',
    name: 'Lupyta Mendoza',
    email: 'lupyta@propiedadesenchiapas.com',
    role: 'Premium',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    slug: 'lupyta-mendoza',
    phone: '9610000002',
    whatsapp: '5219610000002',
    agency: 'Independiente'
  },
  {
    id: 'fa0858cc-fab2-49d6-977f-9c5ec2186409',
    name: 'Luis García',
    email: 'luis@propiedadesenchiapas.com',
    role: 'Premium',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    slug: 'luis-garcia',
    phone: '9610000003',
    whatsapp: '5219610000003',
    agency: 'Independiente'
  }
];

export const SAMPLE_PROPERTIES = [
  {
    id: 'real-1',
    user_id: '731ce118-d513-4c21-bda5-4b15ef017ecc',
    title: 'Residencia Casa Premier',
    description: 'Casa de diseño contemporáneo con acabados residenciales, seguridad 24/7 y espacios amplios. Entrega inmediata. Aceptamos créditos Infonavit, Fovissste y Bancarios.',
    type: 'Casa',
    price: 2450000,
    price_suffix: 'Trato Directo',
    bedrooms: 3,
    bathrooms: 2.5,
    garages: 2,
    municipality: 'Tuxtla Gutiérrez',
    colony: 'Zona Exclusiva',
    featured_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    active: true,
    views: 0,
    leads: 0
  },
  {
    id: 'real-2',
    user_id: '5efd0207-17cf-4315-81a2-e3d903e48328',
    title: 'Fraccionamiento Master - Lotes Residenciales',
    description: 'El macroproyecto residencial privado más importante de Chiapas. Lotes urbanizados con Casa Club, acceso controlado. Sin revisión de buró. Financiamiento directo.',
    type: 'Lote Residencial',
    price: 4900,
    price_suffix: 'Mensualidades desde',
    size_m2: 160,
    municipality: 'Chiapa de Corzo',
    colony: 'Zona Metropolitana',
    featured_image_url: 'https://propiedadesenchiapas.com/landings/images/hero_fraccionamiento_maestro_chiapas_1772843166514.png',
    active: true,
    views: 0,
    leads: 0
  },
  {
    id: 'real-3',
    user_id: '215637a9-5d6a-4e18-953f-510cfca9cd7f',
    title: 'Lotes de Inversión Premium',
    description: 'Invierte en lotes comerciales y residenciales de alta plusvalía en Chiapas. Enganche cero, mensualidades desde $3,500 MXN. Certeza jurídica garantizada.',
    type: 'Lote Residencial',
    price: 3500,
    price_suffix: 'Mensualidades desde',
    municipality: 'Tuxtla Gutiérrez',
    colony: 'Alta Plusvalía',
    featured_image_url: 'https://propiedadesenchiapas.com/landings/images/hero_terrenos_chiapas_slate_1772843210730.png',
    active: true,
    views: 0,
    leads: 0
  },
  {
    id: 'real-4',
    user_id: 'fa0858cc-fab2-49d6-977f-9c5ec2186409',
    title: 'Lote Comercial Estratégico',
    description: 'Lote con uso de suelo comercial en zona de alto flujo. Ideal para locales o plaza pequeña. Enganche cero y planes de financiamiento.',
    type: 'Local Comercial',
    price: 8500,
    price_suffix: 'Mensualidades desde',
    municipality: 'Tuxtla Gutiérrez',
    colony: 'Zona Comercial',
    featured_image_url: 'https://propiedadesenchiapas.com/landings/images/lote_comercial_chiapas_slider_1772842904623.png',
    active: true,
    views: 0,
    leads: 0
  }
];

export const generateAnalytics = (userId, allProps = null) => {
  const propsToUse = allProps || SAMPLE_PROPERTIES;
  const userProps = propsToUse.filter(p => p.user_id === userId);
  const totalViews = userProps.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalLeads = userProps.reduce((sum, p) => sum + (p.leads || 0), 0);
  const activeCount = userProps.filter(p => p.active).length;
  return {
    totalProperties: userProps.length,
    activeProperties: activeCount,
    totalViews,
    totalLeads,
    conversionRate: totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : '0.0',
    monthlyViews: [
      { month: 'Ene', views: Math.floor(totalViews * 0.6) },
      { month: 'Feb', views: Math.floor(totalViews * 0.75) },
      { month: 'Mar', views: Math.floor(totalViews * 0.9) },
      { month: 'Abr', views: totalViews },
    ],
    topProperty: userProps.sort((a, b) => (b.views || 0) - (a.views || 0))[0] || null
  };
};

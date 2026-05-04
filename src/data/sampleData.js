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
    id: 'u1',
    name: 'Daniel Vázquez',
    email: 'capacitacionparapymes@gmail.com',
    position: 'Asesor Inmobiliario Senior',
    phone: '9612466204',
    whatsapp: '5219612466204',
    role: 'Premium',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    slug: 'daniel-vazquez',
    agency: 'Independiente',
    plan: 'admin'
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
    agency: 'Independiente',
    plan: 'premium'
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
    agency: 'Independiente',
    plan: 'premium'
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
    agency: 'Independiente',
    plan: 'premium'
  }
];

export const SAMPLE_PROPERTIES = [
  {
    id: 'dev-1',
    title: 'Desarrollo Colinas del Campestre',
    description: 'Lotes residenciales exclusivos con alta plusvalía en Tuxtla Gutiérrez. Servicios subterráneos y áreas verdes.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 850000,
    price_suffix: 'MXN',
    size_m2: 120,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    municipality: 'Tuxtla Gutiérrez',
    featured_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600',
    active: true,
    views: 0,
    leads: 0
  },
  {
    id: 'dev-2',
    title: 'Cuauhtli - Terrenos en El Jobo',
    description: 'Terrenos residenciales en El Jobo. Clima fresco y vista panorámica.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 450000,
    price_suffix: 'MXN',
    size_m2: 200,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    municipality: 'Tuxtla Gutiérrez',
    featured_image_url: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&q=80&w=600',
    active: true,
    views: 0,
    leads: 0
  },
  {
    id: 'dev-3',
    title: 'El Higo Copoya - Terrenos 10x20',
    description: 'Terrenos en Copoya de 10x20 metros. Excelente ubicación.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 350000,
    price_suffix: 'MXN',
    size_m2: 200,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    municipality: 'Tuxtla Gutiérrez',
    featured_image_url: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&q=80&w=600',
    active: true,
    views: 0,
    leads: 0
  },
  {
    id: 'dev-4',
    title: 'Fraccionamiento Montecristo',
    description: 'Fraccionamiento exclusivo con seguridad y amenidades.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 950000,
    price_suffix: 'MXN',
    size_m2: 150,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    municipality: 'Tuxtla Gutiérrez',
    featured_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
    active: true,
    views: 0,
    leads: 0
  },
  {
    id: 'dev-5',
    title: 'La Cañada - Eco Campestre',
    description: 'Desarrollo ecológico campestre en Berriozábal.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 600000,
    price_suffix: 'MXN',
    size_m2: 300,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    municipality: 'Berriozábal',
    featured_image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600',
    active: true,
    views: 0,
    leads: 0
  },
  {
    id: 'dev-6',
    title: 'Sima Park - Ocozocoautla',
    description: 'Oportunidad de inversión en terrenos residenciales.',
    type: 'Lote Residencial',
    status: 'Disponible',
    price: 250000,
    price_suffix: 'MXN',
    size_m2: 150,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    municipality: 'Ocozocoautla',
    featured_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600',
    active: true,
    views: 0,
    leads: 0
  }
];

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

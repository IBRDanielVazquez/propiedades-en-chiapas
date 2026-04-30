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
    whatsapp: '961 123 4567',
    company: 'Chiapas Premium Real Estate',
    license: 'LIC-CH-78291',
    location: 'TUXTLA GUTIERREZ',
    bio: 'Especialista en desarrollo inmobiliario premium con más de 8 años de experiencia en Chiapas.',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    plan: 'premium'
  },
  {
    id: 'u2',
    name: 'María Fernanda López',
    email: 'maria@inmochis.com',
    position: 'Directora Comercial',
    phone: '961 987 6543',
    whatsapp: '961 987 6543',
    company: 'InmoChis Bienes Raíces',
    license: 'LIC-CH-45120',
    location: 'SAN CRISTOBAL DE LAS CASAS',
    bio: 'Directora con 12 años en el mercado inmobiliario de Los Altos de Chiapas.',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    plan: 'basic'
  },
  {
    id: 'u3',
    name: 'Roberto Martínez',
    email: 'roberto@terrenoschiapas.mx',
    position: 'Asesor Independiente',
    phone: '961 555 1234',
    whatsapp: '961 555 1234',
    company: '',
    license: '',
    location: 'TAPACHULA',
    bio: 'Nuevo en el ramo inmobiliario, buscando crecer con mi tarjeta digital.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    plan: 'starter'
  },
  {
    id: 'u4',
    name: 'Grupo Constructor Alfa',
    email: 'contacto@constructoraalfa.com',
    position: 'Desarrollador Inmobiliario',
    phone: '961 234 5678',
    whatsapp: '961 234 5678',
    company: 'Desarrollos Alfa Chiapas',
    license: 'CONST-CH-992',
    location: 'TUXTLA GUTIERREZ',
    bio: 'Construcción y comercialización de macroproyectos habitacionales.',
    avatar_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300',
    plan: 'developer'
  }
];

export const SAMPLE_PROPERTIES = [
  // Daniel (u1) - Premium - 5 properties
  { id: 'p1', user_id: 'u1', title: 'Lote Premium en Celebria Residencial', description: 'Lote residencial premium en el exclusivo desarrollo Celebria.', operation_type: 'Venta', price: 1850000, price_suffix: '', status: 'Disponible', type: 'Lote Residencial', size_m2: 250, bedrooms: 0, bathrooms: 0, garages: 0, municipality: 'TUXTLA GUTIERREZ', colony: 'CELEBRIA', featured_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600', active: true, views: 342, leads: 12 },
  { id: 'p2', user_id: 'u1', title: 'Casa Moderna en Fraccionamiento Los Laureles', description: 'Casa nueva con acabados de lujo, alberca y jardín privado.', operation_type: 'Venta', price: 4500000, price_suffix: '', status: 'Disponible', type: 'Casa', size_m2: 320, bedrooms: 4, bathrooms: 3, garages: 2, municipality: 'TUXTLA GUTIERREZ', colony: 'LOS LAURELES', featured_image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600', active: true, views: 587, leads: 23 },
  { id: 'p3', user_id: 'u1', title: 'Departamento Vista al Cañón del Sumidero', description: 'Departamento con vista panorámica al Cañón, piso 12.', operation_type: 'Renta', price: 18000, price_suffix: '/ mes', status: 'Disponible', type: 'Departamento', size_m2: 120, bedrooms: 2, bathrooms: 2, garages: 1, municipality: 'TUXTLA GUTIERREZ', colony: 'CENTRO', featured_image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600', active: true, views: 201, leads: 8 },
  { id: 'p4', user_id: 'u1', title: 'Bodega Industrial Zona Sur', description: 'Bodega de 800m² con acceso a carretera principal.', operation_type: 'Renta', price: 45000, price_suffix: '/ mes', status: 'Apartado', type: 'Bodega', size_m2: 800, bedrooms: 0, bathrooms: 2, garages: 0, municipality: 'TUXTLA GUTIERREZ', colony: 'ZONA INDUSTRIAL', featured_image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600', active: false, views: 95, leads: 3 },
  { id: 'p5', user_id: 'u1', title: 'Terreno Comercial Libramiento Norte', description: 'Terreno en esquina ideal para plaza comercial.', operation_type: 'Venta', price: 12000000, price_suffix: '', status: 'Disponible', type: 'Terreno Comercial', size_m2: 2500, bedrooms: 0, bathrooms: 0, garages: 0, municipality: 'TUXTLA GUTIERREZ', colony: 'LIBRAMIENTO NORTE', featured_image_url: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=600', active: true, views: 156, leads: 5 },
  // María (u2) - Basic - 1 property
  { id: 'p6', user_id: 'u2', title: 'Cabaña Rústica en San Cristóbal', description: 'Hermosa cabaña de madera con chimenea y vista al bosque.', operation_type: 'Venta', price: 3200000, price_suffix: '', status: 'Disponible', type: 'Casa', size_m2: 180, bedrooms: 3, bathrooms: 2, garages: 1, municipality: 'SAN CRISTOBAL DE LAS CASAS', colony: 'CENTRO', featured_image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600', active: true, views: 423, leads: 15 },
  // Roberto (u3) - Starter - 0 properties (solo tarjeta)
  // Grupo Constructor Alfa (u4) - Developer - 2 properties
  { id: 'p7', user_id: 'u4', title: 'Macroproyecto Residencial "Las Ceibas"', description: 'Venta de casas en preventa en macroproyecto sustentable.', operation_type: 'Venta', price: 2100000, price_suffix: '', status: 'Disponible', type: 'Casa', size_m2: 150, bedrooms: 3, bathrooms: 2.5, garages: 2, municipality: 'TUXTLA GUTIERREZ', colony: 'ZONA NORTE', featured_image_url: 'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&q=80&w=600', active: true, views: 922, leads: 56 },
  { id: 'p8', user_id: 'u4', title: 'Torre Departamental Alfa Centauro', description: 'Departamentos inteligentes de lujo con amenidades completas.', operation_type: 'Venta', price: 3450000, price_suffix: '', status: 'Disponible', type: 'Departamento', size_m2: 110, bedrooms: 2, bathrooms: 2, garages: 2, municipality: 'TUXTLA GUTIERREZ', colony: 'LOMAS DEL VALLE', featured_image_url: 'https://images.unsplash.com/photo-1545324418-f1a3ac15c974?auto=format&fit=crop&q=80&w=600', active: true, views: 785, leads: 34 }
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

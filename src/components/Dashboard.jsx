import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import chiapasData from '../data/chiapasLocations.json';
import { SAMPLE_USERS, SAMPLE_PROPERTIES, PLANS, generateAnalytics } from '../data/sampleData';
import PropertyManager from './PropertyManager';
import AnalyticsView from './AnalyticsView';
import UserManager from './UserManager';
import AgencyManager from './AgencyManager';
import DigitalCard from './DigitalCard';

export default function Dashboard({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState('description');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // ── Detección de móvil ──
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Multi-user & Permissions State (GoHighLevel Multi-Tenant Architecture)
  const [activeUserId, setActiveUserId] = useState('u0'); // Master Admin default
  const [adminUserFilter, setAdminUserFilter] = useState('all');
  const [allProperties, setAllProperties] = useState([]);

  // ── Cargar propiedades desde Supabase al montar ──────────────────────────
  const loadProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .not('title', 'ilike', '%Premium en %')
        .not('title', 'ilike', 'Residencia Casa Premier%')
        .not('title', 'ilike', 'Fraccionamiento Master%')
        .not('title', 'ilike', 'Lotes de Inversión Premium%')
        .not('title', 'ilike', 'Lote Comercial Estratégico%')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setAllProperties(data);
      }
    } catch (err) {
      console.warn('Error loading properties:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadProperties(); }, [loadProperties]);

  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email.toLowerCase())
          .single();

        if (data) {
          setCurrentUserData(data);
          setAgentProfile({
            ...data,
            whatsapp:  data.whatsapp  || '',
            instagram: data.instagram || '',
            facebook:  data.facebook  || '',
            tiktok:    data.tiktok    || '',
            youtube:   data.youtube   || '',
            linkedin:  data.linkedin  || '',
            website:   data.website   || '',
            palette_id: data.palette_id || 'oro_elegante',
            logo_url:   data.logo_url   || '',
            slug:       data.slug       || ''
          });
        }
      } catch (err) {
        console.warn('Error fetching Supabase profile:', err.message);
      }
    };

    fetchUserProfile();
  }, [session]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (currentUserData?.plan === 'admin') {
      const fetchUsers = async () => {
        const { data } = await supabase.from('users').select('*').order('name');
        if (data) setUsers(data);
      };
      fetchUsers();
    }
  }, [currentUserData]);

  const currentUser = currentUserData || { name: 'Cargando...', plan: 'starter' };
  const userPlan = PLANS[currentUser.plan] || PLANS['starter'];

  
  // Visibility Scope
  const userProperties = currentUser.plan === 'admin'
    ? (adminUserFilter === 'all' ? allProperties : allProperties.filter(p => p.user_id === adminUserFilter))
    : allProperties.filter(p => p.user_id === currentUser.id);

  const analyticsData = generateAnalytics(currentUser.id, allProperties);

  // Property Form State
  const [property, setProperty] = useState({
    title: '',
    description: '',
    operation_type: 'Venta', // Venta o Renta
    price: '',
    price_suffix: '',
    status: 'Disponible',
    type: 'Casa',
    size_m2: '',
    size_land_m2: '',
    size_construction_m2: '',
    year_built: '',
    floors: '',
    furnished: false,
    maid_room: false,
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    municipality: '',
    colony: '',
    postal_code: '',
    featured_image_url: '',
    map_url: '',
    images: [],

    amenities: []
  });

  const [currentView, setCurrentView] = useState('properties'); // 'properties', 'add-property', 'profile', 'analytics', 'users'
  
  const [agentProfile, setAgentProfile] = useState({
    ...currentUser,
    instagram: currentUser.instagram || '',
    facebook:  currentUser.facebook  || '',
    tiktok:    currentUser.tiktok    || '',
    youtube:   currentUser.youtube   || '',
    linkedin:  currentUser.linkedin  || '',
    website:   currentUser.website   || '',
    palette_id: currentUser.palette_id || 'oro_elegante',
    logo_url:   currentUser.logo_url   || '',
    slug:       currentUser.slug       || ''
  });

  // Helper: overlay de feature bloqueada
  const LockedOverlay = ({ feature, label }) => {
    const isLocked = !userPlan.features.includes(feature);
    if (!isLocked) return null;
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        background: 'rgba(248,250,252,0.88)', backdropFilter: 'blur(3px)',
        borderRadius: '16px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
      }}>
        <div style={{ fontSize: '2.5rem' }}>🔒</div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>{label}</h3>
        <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', maxWidth: '240px', margin: 0 }}>
          Disponible desde el plan Básico. Actualiza para desbloquear.
        </p>
        <button style={{
          background: 'linear-gradient(135deg, #7c3aed, #0284c7)', color: '#ffffff',
          border: 'none', borderRadius: '10px', padding: '0.65rem 1.5rem',
          fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.25rem'
        }}>
          💳 Actualizar Plan
        </button>
      </div>
    );
  };

  const saveProfile = async () => {
    setIsSaving(true);
    const generatedSlug = agentProfile.slug || agentProfile.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: agentProfile.name,
          slug: generatedSlug,
          position: agentProfile.position,
          phone: agentProfile.phone,
          whatsapp: agentProfile.whatsapp,
          company: agentProfile.company,
          license: agentProfile.license,
          location: agentProfile.location,
          bio: agentProfile.bio,
          avatar_url: agentProfile.avatar_url,
          instagram: agentProfile.instagram,
          facebook: agentProfile.facebook,
          tiktok: agentProfile.tiktok,
          youtube: agentProfile.youtube,
          linkedin: agentProfile.linkedin,
          website: agentProfile.website,
          portfolio_url: agentProfile.portfolio_url,
          palette_id: agentProfile.palette_id,
          logo_url: agentProfile.logo_url,
          slug: generatedSlug
        })

        .eq('email', currentUser.email);

      if (error) throw error;
      alert("¡Perfil de Asesor Actualizado Exitosamente!");
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      alert("Error al actualizar el perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const [imagePreview, setImagePreview] = useState(null);

  const propertyTypes = [
    'Casa', 'Departamento', 'Lote Residencial', 'Terreno Comercial', 
    'Terreno Agrícola/Ejidal', 'Bodega', 'Local Comercial', 'Oficina', 
    'Edificio', 'Rancho', 'Quinta', 'Nave Industrial', 'Desarrollo en Preventa'
  ];

  const [enabledCategories, setEnabledCategories] = useState([
    'Todas', 'Casas', 'Departamentos', 'Lotes Residenciales', 
    'Terreno Comercial', 'Terreno Agrícola', 'Bodegas', 'Locales Comerciales', 
    'Oficinas', 'Edificios', 'Ranchos', 'Quintas', 'Naves Industriales', 
    'Desarrollos en Preventa'
  ]);
  const [amenities, setAmenities] = useState([
    'Alberca', 'Seguridad 24/7', 'Jardín', 'Cocina Integral', 'Terraza', 
    'Aire Acondicionado', 'Gimnasio', 'Elevador', 'Cisterna', 'Gas Estacionario', 
    'Cuarto de Servicio', 'Mascotas Permitidas', 'Bodega Privada', 'Estacionamiento Visitas'
  ]);


  const [newAmenity, setNewAmenity] = useState('');



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProperty(prev => {
      const newState = { 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      };

      if (name === 'operation_type') {
        newState.price_suffix = value === 'Renta' ? '/ mes' : '';
      }
      if (name === 'municipality') {
        newState.postal_code = '';
        newState.colony = '';
      }
      if (name === 'postal_code') {
        newState.colony = '';
      }
      return newState;
    });
  };

  const handleAmenityToggle = (amenity) => {
    setProperty(prev => {
      const alreadySelected = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: alreadySelected 
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (!files || files.length === 0) return;

    const currentPhotosCount = property.images ? property.images.length : 0;
    const availableSlots = 15 - currentPhotosCount;

    if (availableSlots <= 0) {
      alert("Has alcanzado el límite máximo de 15 fotos por propiedad.");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);

    filesToProcess.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProperty(prev => {
            const updatedImages = [...(prev.images || []), event.target.result];
            // If it's the first image, make it the featured_image
            const featured = prev.featured_image_url || event.target.result;
            return { 
              ...prev, 
              images: updatedImages,
              featured_image_url: featured
            };
          });
          setImagePreview(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });

    if (files.length > availableSlots) {
      alert(`Sólo se agregaron ${availableSlots} fotos. El límite es 15.`);
    }
  };

  const handleAvatarDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAgentProfile(prev => ({ ...prev, avatar_url: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAgentProfile(prev => ({ ...prev, logo_url: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProperty = async () => {
    if (!property.title || !property.price) {
      alert("Por favor llena al menos el Título y el Precio.");
      return;
    }

    if (!property.featured_image_url && (!property.images || property.images.length === 0)) {
      alert("Es obligatorio incluir al menos una Foto Principal para dar de alta el inmueble.");
      return;
    }

    const isEditing = !!property.id;
    if (!isEditing && userProperties.length >= userPlan.maxProperties) {
      alert(`Tu plan "${userPlan.name}" permite un máximo de ${userPlan.maxProperties} propiedades. ¡Actualiza tu plan!`);
      return;
    }
    
    setIsSaving(true);
    try {
      const payload = {
        user_id: (currentUser.plan === 'admin' && adminUserFilter !== 'all') ? adminUserFilter : currentUser.id,
        title: property.title,
        description: property.description,
        operation_type: property.operation_type,
        price: parseFloat(property.price),
        price_suffix: property.price_suffix,
        status: property.status,
        type: property.type,
        size_m2: parseFloat(property.size_m2 || property.size_construction_m2 || 0),
        size_land_m2: parseFloat(property.size_land_m2 || 0),
        size_construction_m2: parseFloat(property.size_construction_m2 || 0),
        year_built: parseInt(property.year_built) || null,
        floors: parseInt(property.floors) || null,
        furnished: property.furnished || false,
        maid_room: property.maid_room || false,
        bedrooms: parseInt(property.bedrooms) || 0,
        bathrooms: parseFloat(property.bathrooms) || 0,
        garages: parseInt(property.garages) || 0,
        municipality: property.municipality,
        colony: property.colony,
        postal_code: property.postal_code,
        featured_image_url: property.featured_image_url || (property.images && property.images[0]) || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600',
        images: property.images || [],
        amenities: property.amenities || [],
        map_url: property.map_url || '',
        active: true,

        views: property.views || 0,
        leads: property.leads || 0
      };

      // ── Intentar guardar en Supabase ─────────────────────────────────────
      let savedProp = null;
      try {
        if (isEditing) {
          const { data, error } = await supabase
            .from('properties')
            .update(payload)
            .eq('id', property.id)
            .select()
            .single();
          if (error) throw error;
          savedProp = data;
        } else {
          const { data, error } = await supabase
            .from('properties')
            .insert(payload)
            .select()
            .single();
          if (error) throw error;
          savedProp = data;
        }
      } catch (sbError) {
        console.warn('Supabase write failed, guardando localmente:', sbError.message);
        // Fallback local
        savedProp = { ...payload, id: property.id || `p_local_${Date.now()}` };
      }

      // ── Actualizar estado local ──────────────────────────────────────────
      setAllProperties(prev =>
        isEditing
          ? prev.map(p => p.id === savedProp.id ? savedProp : p)
          : [savedProp, ...prev]
      );

      alert(isEditing ? "¡Propiedad actualizada exitosamente!" : "¡Propiedad creada exitosamente!");
      
      // Reset form
      setProperty({
        title: '', description: '', operation_type: 'Venta', price: '', price_suffix: '',
        status: 'Disponible', type: 'Casa', size_m2: '', size_land_m2: '', size_construction_m2: '',
        year_built: '', floors: '', furnished: false, maid_room: false,
        bedrooms: 0, bathrooms: 0, garages: 0,
        municipality: '', colony: '', postal_code: '',
        featured_image_url: '', images: [], amenities: []
      });
      setImagePreview(null);
      setCurrentView('properties');
      setActiveTab('description');
    } catch (error) {
      console.error('Error saving property:', error.message);
      alert("Error al guardar: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (propId) => {
    const target = allProperties.find(p => p.id === propId);
    if (!target) return;
    const newActive = !target.active;

    // Optimistic UI update
    setAllProperties(prev => prev.map(p => p.id === propId ? { ...p, active: newActive } : p));

    // Persist in Supabase
    try {
      const { error } = await supabase
        .from('properties')
        .update({ active: newActive })
        .eq('id', propId);
      if (error) throw error;
    } catch (err) {
      console.warn('Toggle persist failed (local only):', err.message);
    }
  };

  const handleEditProperty = (prop) => {
    setProperty({ ...prop });
    setCurrentView('add-property');
  };

  const tabs = [
    { id: 'description', label: '1. Descripción' },
    { id: 'price', label: '2. Precio' },
    { id: 'media', label: '3. Fotos y Video' },
    { id: 'details', label: '4. Detalles' },
    { id: 'location', label: '5. Ubicación' },
    { id: 'amenities', label: '6. Amenidades' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: '#0f172a', padding: '2.5rem 0', display: 'flex', flexDirection: 'column', color: '#f8fafc' }}>
        <div style={{ padding: '0 2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '32px', width: '32px', fill: '#38bdf8' }}>
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.7l7 6.3v9h-4v-6H9v6H5v-9l7-6.3z" />
          </svg>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px' }}>CRM Estate</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>Propiedades en Chiapas</p>
          </div>
        </div>

        {/* GoHighLevel Style Switchers */}
        <div style={{ padding: '0 1rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', paddingLeft: '1rem', display: 'block', marginBottom: '0.5rem' }}>
              🔑 Rol de Acceso
            </label>
            <select 
              value={activeUserId} 
              onChange={(e) => {
                const uid = e.target.value;
                setActiveUserId(uid);
                setAdminUserFilter('all');
                setCurrentView(uid === 'u0' ? 'properties' : 'profile'); 
              }}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#1e293b', 
                color: '#f8fafc', border: '1px solid #334155', fontWeight: '600', fontSize: '0.85rem'
              }}
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({PLANS[u.plan]?.name || 'Starter'})
                </option>
              ))}
            </select>
          </div>

          {currentUser.plan === 'admin' && (
            <div>
              <label style={{ fontSize: '0.7rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', paddingLeft: '1rem', display: 'block', marginBottom: '0.5rem' }}>
                🏢 Cuenta / Asesor (Sub-Account)
              </label>
              <select 
                value={adminUserFilter} 
                onChange={(e) => setAdminUserFilter(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '10px', background: '#0f172a', 
                  color: '#38bdf8', border: '1px solid #38bdf8', fontWeight: '600', fontSize: '0.85rem'
                }}
              >
                <option value="all">Todas las Cuentas</option>
                {users.filter(u => u.id !== currentUser.id).map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          {/* 1. Profile / Tarjeta Digital (All tiers) */}
          <button 
            onClick={() => setCurrentView('profile')}
            style={{ 
              textAlign: 'left', padding: '0.85rem 1.25rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: currentView === 'profile' ? '#1e293b' : 'transparent', 
              color: currentView === 'profile' ? '#38bdf8' : '#94a3b8', 
              fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' 
            }}
          >
            <span>💳</span> Mi Tarjeta Digital
          </button>

          {/* 2. My Properties (Basic + Premium + Admin) */}
          {(userPlan.features.includes('una_propiedad') || userPlan.features.includes('propiedades_ilimitadas') || currentUser.plan === 'admin') && (
            <button 
              onClick={() => setCurrentView('properties')}
              style={{ 
                textAlign: 'left', padding: '0.85rem 1.25rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: currentView === 'properties' ? '#1e293b' : 'transparent', 
                color: currentView === 'properties' ? '#38bdf8' : '#94a3b8', 
                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' 
              }}
            >
              <span>🏠</span> {currentUser.plan === 'admin' ? 'Ver Propiedades CRM' : 'Mis Propiedades'} ({userProperties.length})
            </button>
          )}

          {/* 3. Add Property (Basic + Premium + Admin) */}
          {(userPlan.features.includes('una_propiedad') || userPlan.features.includes('propiedades_ilimitadas') || currentUser.plan === 'admin') && (
            <button 
              onClick={() => setCurrentView('add-property')}
              style={{ 
                textAlign: 'left', padding: '0.85rem 1.25rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: currentView === 'add-property' ? '#1e293b' : 'transparent', 
                color: currentView === 'add-property' ? '#38bdf8' : '#94a3b8', 
                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' 
              }}
            >
              <span>➕</span> Agregar Propiedad
            </button>
          )}

          {/* 4. Gestión de Asesores (solo Admin) */}
          {currentUser.plan === 'admin' && (
            <button 
              onClick={() => setCurrentView('users')}
              style={{ 
                textAlign: 'left', padding: '0.85rem 1.25rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: currentView === 'users' ? '#1e293b' : 'transparent', 
                color: currentView === 'users' ? '#38bdf8' : '#94a3b8', 
                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' 
              }}
            >
              <span>👥</span> Gestión de Asesores
            </button>
          )}

          {/* 4.5 Gestión de Agencias (solo Admin) */}
          {currentUser.plan === 'admin' && (
            <button 
              onClick={() => setCurrentView('agencies')}
              style={{ 
                textAlign: 'left', padding: '0.85rem 1.25rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: currentView === 'agencies' ? '#1e293b' : 'transparent', 
                color: currentView === 'agencies' ? '#38bdf8' : '#94a3b8', 
                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' 
              }}
            >
              <span>🏢</span> Gestión de Agencias
            </button>
          )}

          {/* 4.6 Gestión de Categorías (solo Admin) */}


          {/* 5. Analytics (Premium + Admin) */}
          {(userPlan.features.includes('analytics') || currentUser.plan === 'admin') && (
            <button 
              onClick={() => setCurrentView('analytics')}
              style={{ 
                textAlign: 'left', padding: '0.85rem 1.25rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: currentView === 'analytics' ? '#1e293b' : 'transparent', 
                color: currentView === 'analytics' ? '#38bdf8' : '#94a3b8', 
                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' 
              }}
            >
              <span>📊</span> {currentUser.plan === 'admin' ? 'Estadísticas Globales' : 'Estadísticas'}
            </button>
          )}
        </nav>

        <div style={{ marginTop: 'auto', padding: '0 1rem' }}>
          {session?.user?.email && (
            <div style={{ padding: '0.75rem 1.25rem', marginBottom: '0.5rem', background: 'rgba(56,189,248,0.08)', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.2)' }}>
              <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sesión activa</p>
              <p style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '600', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.user.email}</p>
            </div>
          )}
          <button onClick={onLogout} style={{ width: '100%', textAlign: 'left', padding: '0.85rem 1.25rem', borderRadius: '12px', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: isMobile ? '1rem' : '2.5rem', overflowY: 'auto', paddingBottom: isMobile ? '80px' : '2.5rem' }}>

        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1rem', color: '#64748b' }}>
              <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '1rem', fontWeight: '600' }}>Cargando datos...</span>
            </div>
          )}

          {currentView === 'properties' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-1px' }}>
                    {currentUser.plan === 'admin' ? 'Consola Maestra' : 'Mis Propiedades'}
                  </h1>
                </div>
                <button onClick={() => setCurrentView('add-property')} className="btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '10px' }}>
                  ➕ Nueva Propiedad
                </button>
              </div>
              <PropertyManager properties={userProperties} onToggleActive={handleToggleActive} onEdit={handleEditProperty} plan={userPlan.id} />
            </div>
          )}

          {currentView === 'add-property' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' }}>{property.id ? 'Editar' : 'Nueva'} Propiedad</h1>
              <div className="dashboard-card" style={{ padding: isMobile ? '1rem' : '2rem' }}>
                {/* Tabs simplifies here for brevity but assumes full implementation exists in PropertyManager or similar */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', padding: '0.5rem' }}>
                  {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === tab.id ? '#1A1A6E' : '#f1f5f9', color: activeTab === tab.id ? '#fff' : '#64748b', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {tab.label.split('. ')[1]}
                    </button>
                  ))}
                </div>
                {/* Simplified content blocks for Add Property */}
                {activeTab === 'description' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <input type="text" name="title" value={property.title} onChange={handleInputChange} placeholder="Título" className="form-input" />
                    <textarea name="description" value={property.description} onChange={handleInputChange} placeholder="Descripción" className="form-textarea" style={{ height: '150px' }} />
                  </div>
                )}
                {/* ... other tabs would go here ... */}
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={saveProperty} className="btn-primary" style={{ padding: '1rem 2rem' }}>Guardar Propiedad</button>
                </div>
              </div>
            </div>
          )}

          {currentView === 'profile' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              {/* Profile Sub-Tabs Navigation (Hidden on Mobile as we use Bottom Nav) */}
              {!isMobile && (
                <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  {['description', 'properties', 'leads', 'analytics'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '1rem 0.5rem', border: 'none', background: 'none', borderBottom: activeTab === tab ? '2px solid #1A1A6E' : 'none', color: activeTab === tab ? '#1A1A6E' : '#94a3b8', fontWeight: '700', cursor: 'pointer', textTransform: 'capitalize' }}>
                      {tab === 'description' ? 'Perfil' : tab}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'description' && (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr', gap: '2.5rem' }}>
                  {/* Left: Preview */}
                  <div>
                    <h3 style={{ marginBottom: '1rem', fontWeight: '800' }}>Previsualización</h3>
                    <DigitalCard profile={agentProfile} plan={userPlan} />
                  </div>
                  {/* Right: Form */}
                  <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Editar Datos</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <input type="text" value={agentProfile.name} onChange={e => setAgentProfile(p => ({ ...p, name: e.target.value }))} className="form-input" placeholder="Nombre" style={{ height: '48px' }} />
                      <input type="text" value={agentProfile.position} onChange={e => setAgentProfile(p => ({ ...p, position: e.target.value }))} className="form-input" placeholder="Cargo" style={{ height: '48px' }} />
                      <textarea value={agentProfile.bio} onChange={e => setAgentProfile(p => ({ ...p, bio: e.target.value }))} className="form-textarea" placeholder="Biografía" style={{ minHeight: '120px' }} />
                      <button onClick={saveProfile} className="btn-primary" style={{ height: '52px' }}>Guardar Perfil</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'properties' && <PropertyManager properties={userProperties} onToggleActive={handleToggleActive} onEdit={handleEditProperty} plan={userPlan.id} />}
              {activeTab === 'analytics' && <AnalyticsView analytics={analyticsData} plan={userPlan} />}
              {activeTab === 'leads' && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '3rem' }}>📩</span>
                  <h3 style={{ marginTop: '1rem', fontWeight: '800' }}>Gestión de Leads</h3>
                  <p style={{ color: '#64748b' }}>Historial de prospectos para tus propiedades.</p>
                </div>
              )}
            </div>
          )}

          {currentView === 'users' && currentUser.plan === 'admin' && <UserManager />}
          {currentView === 'agencies' && currentUser.plan === 'admin' && <AgencyManager />}
          {currentView === 'categories' && currentUser.plan === 'admin' && (
            <div style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontWeight: '800' }}>Categorías</h3>
              <p>Módulo administrativo de categorías.</p>
            </div>
          )}
          {currentView === 'analytics' && <AnalyticsView analytics={analyticsData} plan={userPlan} />}
        </div>
      </main>

      {/* ── BOTTOM NAVIGATION MÓVIL (Fija) ── */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          height: '65px', background: '#ffffff', borderTop: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}>
          {[
            { id: 'profile', sub: 'description', label: 'Inicio', icon: '🏠' },
            { id: 'properties', sub: '', label: 'Propiedades', icon: '🏢' },
            { id: 'profile', sub: 'leads', label: 'Leads', icon: '📩' },
            { id: 'profile', sub: 'description', label: 'Perfil', icon: '👤' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentView(item.id);
                if (item.sub) setActiveTab(item.sub);
              }}
              style={{
                background: 'none', border: 'none', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '4px', cursor: 'pointer',
                color: (currentView === item.id && (item.sub === '' || activeTab === item.sub)) ? '#1A1A6E' : '#94a3b8'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: '800' }}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}



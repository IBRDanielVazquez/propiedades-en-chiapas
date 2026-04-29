import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import chiapasData from '../data/chiapasLocations.json';
import { SAMPLE_USERS, SAMPLE_PROPERTIES, PLANS, generateAnalytics } from '../data/sampleData';
import PropertyManager from './PropertyManager';
import AnalyticsView from './AnalyticsView';
import UserManager from './UserManager';
import DigitalCard from './DigitalCard';

export default function Dashboard({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState('description');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setAllProperties(data);
      } else {
        // Sin datos en Supabase → usar sample data de demostración
        setAllProperties(SAMPLE_PROPERTIES);
      }
    } catch (err) {
      console.warn('Supabase no disponible, usando sample data:', err.message);
      setAllProperties(SAMPLE_PROPERTIES);
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
          });
        }
      } catch (err) {
        console.warn('Error fetching Supabase profile:', err.message);
      }
    };

    fetchUserProfile();
  }, [session]);

  const currentUser = currentUserData || SAMPLE_USERS.find(u => u.id === activeUserId) || SAMPLE_USERS[0];
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
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: agentProfile.name,
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
          website: agentProfile.website
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
              {SAMPLE_USERS.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({PLANS[u.plan].name})
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
                {SAMPLE_USERS.filter(u => u.id !== 'u0').map(u => (
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

          {/* 4.5 Gestión de Categorías (solo Admin) */}
          {currentUser.plan === 'admin' && (
            <button 
              onClick={() => setCurrentView('categories')}
              style={{ 
                textAlign: 'left', padding: '0.85rem 1.25rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: currentView === 'categories' ? '#1e293b' : 'transparent', 
                color: currentView === 'categories' ? '#38bdf8' : '#94a3b8', 
                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' 
              }}
            >
              <span>📂</span> Habilitar Categorías
            </button>
          )}


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

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1rem', color: '#64748b' }}>
              <div style={{ width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '1rem', fontWeight: '600' }}>Cargando propiedades...</span>
            </div>
          )}
          
          {currentView === 'properties' && (
            <div style={{ animation: 'fadeIn 0.3s ease', position: 'relative' }}>
              <LockedOverlay feature="una_propiedad" label="Publicar Propiedades" />
              <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-1px' }}>
                    {currentUser.plan === 'admin' ? 'Consola Maestra de Propiedades' : 'Mis Propiedades'}
                  </h1>
                  <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
                    {currentUser.plan === 'admin' 
                      ? 'Supervisión y control maestro de todos los activos inmobiliarios registrados.' 
                      : 'Administra el inventario de inmuebles asignado a tu cuenta.'}
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('add-property')}
                  className="btn-primary"
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.9rem', display: userPlan.maxProperties > 0 ? 'block' : 'none' }}
                >
                  ➕ Nueva Propiedad
                </button>
              </div>
              <PropertyManager 
                properties={userProperties} 
                onToggleActive={handleToggleActive} 
                onEdit={handleEditProperty}
                plan={userPlan.id}
              />
            </div>
          )}

          {currentView === 'add-property' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-1px' }}>
                  {property.id ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}
                </h1>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Rellena los campos controlados para dar de alta una propiedad en el portal.</p>
              </div>

              <div className="dashboard-card">
            {/* Tabs (Horizontal Workflow) */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '0.4rem', gap: '0.25rem', marginBottom: '3rem', overflowX: 'auto' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: '1',
                    padding: '0.75rem 1rem',
                    background: activeTab === tab.id ? '#ffffff' : 'transparent',
                    color: activeTab === tab.id ? '#1e293b' : '#64748b',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: activeTab === tab.id ? '700' : '500',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label.split('. ')[1]}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              {activeTab === 'description' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label">Título de la Propiedad</label>
                    <input type="text" name="title" value={property.title} onChange={handleInputChange} placeholder="Ej. Lote Residencial en Celebria" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Descripción Completa</label>
                    <textarea name="description" value={property.description} onChange={handleInputChange} placeholder="Describe las ventajas, el entorno, amenidades y detalles clave de la oferta..." className="form-textarea" style={{ height: '180px', resize: 'vertical' }}></textarea>
                  </div>
                </div>
              )}

              {activeTab === 'price' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label">Tipo de Operación</label>
                    <select name="operation_type" value={property.operation_type} onChange={handleInputChange} className="form-select">
                      <option value="Venta">Venta</option>
                      <option value="Renta">Renta</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Precio (MXN)</label>
                    <input type="number" name="price" value={property.price} onChange={handleInputChange} placeholder="Ej. 1500000" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Sufijo del Precio</label>
                    <input type="text" name="price_suffix" value={property.price_suffix} onChange={handleInputChange} placeholder="Ej. / mes" className="form-input" disabled={property.operation_type === 'Venta'} />
                  </div>
                  <div>
                    <label className="form-label">Estado actual</label>
                    <select name="status" value={property.status} onChange={handleInputChange} className="form-select">
                      <option>Disponible</option>
                      <option>Apartado</option>
                      <option>Vendido</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Categoría de Propiedad</label>
                    <select name="type" value={property.type} onChange={handleInputChange} className="form-select">
                      <option value="">-- Selecciona el Tipo --</option>
                      {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <label className="form-label">Cargar Fotografías del Inmueble (Límite: 15)</label>
                  
                  {/* Drag and Drop Zone */}
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '12px',
                      padding: '3rem 2rem',
                      textAlign: 'center',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    <input 
                      type="file" 
                      id="file-upload" 
                      accept="image/*" 
                      multiple
                      onChange={handleFileDrop} 
                      style={{ display: 'none' }} 
                    />
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📸</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>Arrastra y suelta tus imágenes aquí</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Puedes seleccionar varias imágenes a la vez (Máx. 15).</p>
                  </div>

                  {/* Photo Gallery with selection for Main Photo */}
                  {property.images && property.images.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <label className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>
                        Galería ({property.images.length}/15 fotos)
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                        {property.images.map((img, idx) => {
                          const isFeatured = property.featured_image_url === img;
                          return (
                            <div key={idx} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: isFeatured ? '3px solid #0284c7' : '1px solid #e2e8f0', aspectRatio: '1/1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                              <img src={img} alt={`Foto ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              
                              {/* Main Badge */}
                              {isFeatured && (
                                <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#0284c7', color: '#ffffff', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>
                                  Principal
                                </span>
                              )}

                              {/* Action Buttons Overlay */}
                              <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(15, 23, 42, 0.75)', padding: '4px', display: 'flex', justifyContent: 'space-around', opacity: '0.9' }}>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setProperty(prev => ({ ...prev, featured_image_url: img })); }}
                                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                                  title="Marcar como Principal"
                                >
                                  ⭐
                                </button>
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setProperty(prev => {
                                      const updated = prev.images.filter((_, i) => i !== idx);
                                      const newFeatured = prev.featured_image_url === img ? (updated[0] || '') : prev.featured_image_url;
                                      return { ...prev, images: updated, featured_image_url: newFeatured };
                                    });
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: '1rem' }}>
                    <label className="form-label">O usa un link directo para la Foto Principal (URL)</label>
                    <input type="text" name="featured_image_url" value={property.featured_image_url} onChange={handleInputChange} placeholder="https://images.unsplash.com/photo-..." className="form-input" />
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                    <div>
                      <label className="form-label">Superficie Terreno (m²)</label>
                      <input type="number" name="size_land_m2" value={property.size_land_m2} onChange={handleInputChange} placeholder="Ej. 300" className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Superficie Const. (m²)</label>
                      <input type="number" name="size_construction_m2" value={property.size_construction_m2} onChange={handleInputChange} placeholder="Ej. 250" className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Año Construcción</label>
                      <input type="number" name="year_built" value={property.year_built} onChange={handleInputChange} placeholder="Ej. 2024" className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Niveles / Pisos</label>
                      <input type="number" name="floors" value={property.floors} onChange={handleInputChange} placeholder="Ej. 2" className="form-input" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <div>
                      <label className="form-label">Habitaciones</label>
                      <input type="number" name="bedrooms" value={property.bedrooms} onChange={handleInputChange} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Baños completos</label>
                      <input type="number" name="bathrooms" value={property.bathrooms} onChange={handleInputChange} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Estacionamientos</label>
                      <input type="number" name="garages" value={property.garages} onChange={handleInputChange} className="form-input" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input type="checkbox" name="furnished" checked={property.furnished} onChange={handleInputChange} style={{ width: '18px', height: '18px', accentColor: '#0284c7' }} />
                      <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>Totalmente Amueblado</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input type="checkbox" name="maid_room" checked={property.maid_room} onChange={handleInputChange} style={{ width: '18px', height: '18px', accentColor: '#0284c7' }} />
                      <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>Incluye Cuarto de Servicio</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>📍 Ubicación Controlada (SEPOMEX)</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    <div>
                      <label className="form-label">Municipio</label>
                      <select name="municipality" value={property.municipality} onChange={handleInputChange} className="form-select">
                        <option value="">-- Selecciona Municipio --</option>
                        {Object.keys(chiapasData).sort().map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className="form-label">Código Postal</label>
                      <select name="postal_code" value={property.postal_code} onChange={handleInputChange} disabled={!property.municipality} className="form-select">
                        <option value="">-- Selecciona CP --</option>
                        {property.municipality && chiapasData[property.municipality] && Object.keys(chiapasData[property.municipality]).map(cp => <option key={cp} value={cp}>{cp}</option>)}
                      </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Colonia / Fraccionamiento</label>
                      <select name="colony" value={property.colony} onChange={handleInputChange} disabled={!property.postal_code} className="form-select">
                        <option value="">-- Selecciona Colonia --</option>
                        {property.postal_code && chiapasData[property.municipality] && chiapasData[property.municipality][property.postal_code] && chiapasData[property.municipality][property.postal_code].sort().map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'amenities' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>🎯 Características y Amenidades</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Selecciona todas las ventajas que incluye esta propiedad para sumarlas a la ficha:</p>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                    gap: '1rem',
                    background: '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {amenities.map(amenity => (
                      <label 
                        key={amenity} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px', 
                          padding: '0.75rem', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          background: property.amenities.includes(amenity) ? '#e0f2fe' : '#ffffff',
                          border: property.amenities.includes(amenity) ? '1px solid #38bdf8' : '1px solid #e2e8f0',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={property.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: '#0284c7',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '0.9rem', fontWeight: property.amenities.includes(amenity) ? '600' : '500', color: '#1e293b' }}>
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <input 
                      type="text" 
                      value={newAmenity} 
                      onChange={(e) => setNewAmenity(e.target.value)} 
                      placeholder="Ej. Roof Garden, Vigilancia con Dron, etc." 
                      className="form-input" 
                      style={{ flex: 1, margin: 0 }}
                    />
                    <button 
                      onClick={() => {
                        if (newAmenity.trim()) {
                          const clean = newAmenity.trim();
                          if (!amenities.includes(clean)) {
                            setAmenities(prev => [...prev, clean]);
                          }
                          // Automatically toggle it as selected
                          if (!property.amenities.includes(clean)) {
                            setProperty(prev => ({ ...prev, amenities: [...prev.amenities, clean] }));
                          }
                          setNewAmenity('');
                        }
                      }}
                      className="btn-primary"
                      style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem' }}
                    >
                      ➕ Agregar Otro
                    </button>
                  </div>
                </div>
              )}

              {/* Guardar Button */}
              <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                <button 
                  onClick={saveProperty}
                  disabled={isSaving}
                  className="btn-primary" 
                  style={{ padding: '1rem 3rem', opacity: isSaving ? 0.7 : 1, fontSize: '1rem', borderRadius: '10px', boxShadow: '0 10px 15px -3px rgba(26, 54, 93, 0.2)' }}
                >
                  {isSaving ? 'Guardando...' : 'Guardar y Publicar'}
                </button>
              </div>
            </div>
            </div>
            </div>
          )}

          {currentView === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-1px' }}>Mi Perfil de Asesor</h1>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Personaliza tus datos y previsualiza tu Tarjeta Digital interactiva.</p>
              </div>

              {/* ── Tarjeta Digital ── */}
              {userPlan.features.includes('card_preview') && (
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.25rem' }}>
                    🪩 Tu Tarjeta Digital Interactiva
                  </h2>
                  <DigitalCard
                    profile={agentProfile}
                    plan={userPlan}
                    isPublished={userPlan.features.includes('card_publish')}
                  />
                  
                  {/* Link Personalizado Estilo GoHighLevel */}
                  <div style={{ 
                    marginTop: '1.5rem', background: '#f8fafc', padding: '1.25rem', 
                    borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', 
                    flexDirection: 'column', gap: '0.5rem' 
                  }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>
                      🔗 Tu Enlace Personalizado:
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        readOnly 
                        value={`${window.location.origin}/card/${agentProfile.id || 'usr'}`} 
                        style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#ffffff', color: '#1e293b', fontWeight: '600' }}
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/card/${agentProfile.id || 'usr'}`);
                          alert('¡Enlace copiado al portapapeles!');
                        }}
                        style={{ padding: '0.65rem 1rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                </div>
              )}


              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem', alignItems: 'start' }}>
                
                {/* 1. WP Residence Style Agent Card Preview */}
                <div style={{ 
                  background: '#ffffff', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  boxShadow: '0 15px 30px -10px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                    <img 
                      src={agentProfile.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'} 
                      alt={agentProfile.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <span style={{ 
                      position: 'absolute', 
                      bottom: '15px', 
                      right: '15px', 
                      background: userPlan.color, 
                      color: '#ffffff', 
                      padding: '0.35rem 0.75rem', 
                      borderRadius: '30px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                    }}>
                      {userPlan.icon} Plan {userPlan.name}
                    </span>
                  </div>
                  
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>{agentProfile.name}</h3>
                    <p style={{ color: '#0284c7', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{agentProfile.position}</p>
                    
                    {agentProfile.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                        <span>📍</span> {agentProfile.location}
                      </div>
                    )}

                    {agentProfile.bio && (
                      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid #f1f5f9' }}>
                        "{agentProfile.bio}"
                      </p>
                    )}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                        <span>🏢</span> <strong>{agentProfile.company}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                        <span>📞</span> {agentProfile.phone}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                        <span>💬</span> WhatsApp: {agentProfile.whatsapp}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#475569' }}>
                        <span>✉️</span> {agentProfile.email}
                      </div>
                    </div>
                    
                    {agentProfile.license && (
                      <div style={{ marginTop: '1.25rem', padding: '0.5rem', background: '#f1f5f9', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px' }}>
                        REGISTRO: {agentProfile.license}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Customization Form */}
                <div style={{ 
                  background: '#ffffff', 
                  borderRadius: '16px', 
                  padding: '2rem', 
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>Editar Información</h2>
                  
                  {/* Drag and Drop Zone for Avatar */}
                  <div>
                    <label className="form-label">Subir Foto de Perfil (Arrastra y Suelta)</label>
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleAvatarDrop}
                      style={{
                        border: '2px dashed #cbd5e1',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginBottom: '1rem'
                      }}
                      onClick={() => document.getElementById('avatar-upload').click()}
                    >
                      <input 
                        type="file" 
                        id="avatar-upload" 
                        accept="image/*" 
                        onChange={handleAvatarDrop} 
                        style={{ display: 'none' }} 
                      />
                      <span style={{ fontSize: '1.5rem' }}>👤</span>
                      <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>Arrastra tu foto o haz clic aquí.</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                    <div>
                      <label className="form-label">Nombre Completo</label>
                      <input 
                        type="text" 
                        value={agentProfile.name} 
                        onChange={(e) => setAgentProfile(prev => ({ ...prev, name: e.target.value }))} 
                        className="form-input" 
                      />
                    </div>
                    <div>
                      <label className="form-label">Cargo / Posición</label>
                      <input 
                        type="text" 
                        value={agentProfile.position} 
                        onChange={(e) => setAgentProfile(prev => ({ ...prev, position: e.target.value }))} 
                        className="form-input" 
                      />
                    </div>
                    <div>
                      <label className="form-label">Teléfono Oficina</label>
                      <input 
                        type="text" 
                        value={agentProfile.phone} 
                        onChange={(e) => setAgentProfile(prev => ({ ...prev, phone: e.target.value }))} 
                        className="form-input" 
                      />
                    </div>
                    <div>
                      <label className="form-label">WhatsApp Directo</label>
                      <input 
                        type="text" 
                        value={agentProfile.whatsapp} 
                        onChange={(e) => setAgentProfile(prev => ({ ...prev, whatsapp: e.target.value }))} 
                        className="form-input" 
                      />
                    </div>
                    <div>
                      <label className="form-label">Ubicación / Municipio</label>
                      <select 
                        value={agentProfile.location} 
                        onChange={(e) => setAgentProfile(prev => ({ ...prev, location: e.target.value }))} 
                        className="form-select"
                      >
                        <option value="">-- Selecciona Municipio --</option>
                        {Object.keys(chiapasData).sort().map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Licencia / Certificación</label>
                      <input 
                        type="text" 
                        value={agentProfile.license} 
                        onChange={(e) => setAgentProfile(prev => ({ ...prev, license: e.target.value }))} 
                        className="form-input" 
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Inmobiliaria / Empresa</label>
                      <input 
                        type="text" 
                        value={agentProfile.company} 
                        onChange={(e) => setAgentProfile(prev => ({ ...prev, company: e.target.value }))} 
                        className="form-input" 
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Correo Electrónico</label>
                      <input 
                        type="email" 
                        value={agentProfile.email} 
                        onChange={(e) => setAgentProfile(prev => ({ ...prev, email: e.target.value }))} 
                        className="form-input" 
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Descripción Breve / Biografía</label>
                      <textarea 
                        value={agentProfile.bio} 
                        onChange={(e) => setAgentProfile(prev => ({ ...prev, bio: e.target.value }))} 
                        placeholder="Cuenta brevemente tu trayectoria y especialidad..." 
                        className="form-textarea" 
                        style={{ height: '100px', resize: 'vertical' }}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">O usa un link para tu Foto</label>
                      <input 
                        type="text" 
                        value={agentProfile.avatar_url || ''} 
                        onChange={(e) => setAgentProfile(prev => ({ ...prev, avatar_url: e.target.value }))} 
                        placeholder="https://images.unsplash.com/photo-..." 
                        className="form-input" 
                      />
                    </div>

                    {/* ── Redes Sociales ── */}
                    <div style={{ gridColumn: '1 / -1', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                      <label className="form-label" style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>
                        📱 Redes Sociales
                      </label>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
                        Aparecen en el reverso de tu Tarjeta Digital. Solo escribe tu usuario (sin @).
                      </p>
                    </div>
                    {[
                      { key: 'whatsapp',  label: '💬 WhatsApp',  placeholder: '9611234567 (número completo)' },
                      { key: 'instagram', label: '📸 Instagram',  placeholder: 'tu_usuario' },
                      { key: 'facebook',  label: '👥 Facebook',   placeholder: 'tu_pagina_o_usuario' },
                      { key: 'tiktok',    label: '🎵 TikTok',    placeholder: 'tu_usuario' },
                      { key: 'youtube',   label: '▶️ YouTube',   placeholder: 'tu_canal' },
                      { key: 'linkedin',  label: '💼 LinkedIn',   placeholder: 'tu_perfil' },
                      { key: 'website',   label: '🌐 Sitio Web',  placeholder: 'https://tuweb.com' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="form-label">{field.label}</label>
                        <input
                          type="text"
                          value={agentProfile[field.key] || ''}
                          onChange={e => setAgentProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="form-input"
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button 
                      onClick={saveProfile} 
                      disabled={isSaving}
                      className="btn-primary" 
                      style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', borderRadius: '8px' }}
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'categories' && currentUser.plan === 'admin' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-1px' }}>
                  📂 Habilitar Categorías del Portal
                </h1>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
                  Controla cuáles categorías de inmuebles se encuentran activas para los clientes en el buscador del portal principal.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                  📁 Categorías Disponibles
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    'Todas', 'Casas', 'Departamentos', 'Lotes Residenciales', 
                    'Terreno Comercial', 'Terreno Agrícola', 'Bodegas', 'Locales Comerciales', 
                    'Oficinas', 'Edificios', 'Ranchos', 'Quintas', 'Naves Industriales', 
                    'Desarrollos en Preventa'
                  ].map(cat => (
                    <label 
                      key={cat} 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '0.85rem', 
                        borderRadius: '10px', border: enabledCategories.includes(cat) ? '1px solid #38bdf8' : '1px solid #e2e8f0', 
                        background: enabledCategories.includes(cat) ? '#f0f9ff' : '#ffffff', cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={enabledCategories.includes(cat)}
                        onChange={() => {
                          setEnabledCategories(prev => 
                            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                          );
                        }}
                        style={{ width: '18px', height: '18px', accentColor: '#0284c7', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: enabledCategories.includes(cat) ? '600' : '500', color: '#1e293b' }}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => alert("¡Configuración de categorías guardada correctamente!")}
                    className="btn-primary"
                    style={{ padding: '0.75rem 2.5rem', borderRadius: '10px', fontSize: '0.95rem' }}
                  >
                    💾 Guardar Configuración
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentView === 'users' && currentUser.plan === 'admin' && (
            <UserManager />
          )}

          {currentView === 'analytics' && (
            <div style={{ animation: 'fadeIn 0.3s ease', position: 'relative' }}>
              <LockedOverlay feature="analytics" label="Estadísticas de Rendimiento" />
              <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-1px' }}>
                  {currentUser.plan === 'admin' ? 'Rendimiento Global del CRM' : 'Estadísticas de Rendimiento'}
                </h1>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
                  {currentUser.plan === 'admin' 
                    ? 'Monitorea el impacto, leads y conversiones del ecosistema completo.' 
                    : 'Monitorea el impacto y conversión de tus propiedades publicadas.'}
                </p>
              </div>
              <AnalyticsView analytics={analyticsData} plan={userPlan} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

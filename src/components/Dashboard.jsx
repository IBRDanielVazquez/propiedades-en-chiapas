import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import chiapasData from '../data/chiapasLocations.json';
import { PLANS, generateAnalytics } from '../data/plans';
import LandingManager from './LandingManager';
import PropertyManager from './PropertyManager';
import AnalyticsView from './AnalyticsView';
import UserManager from './UserManager';
import AgencyManager from './AgencyManager';
import DigitalCard from './DigitalCard';
import LeadsDashboard from './LeadsDashboard';
import HomeOrganizer from './HomeOrganizer';

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

  const currentUser = currentUserData || { name: 'Cargando...', plan: 'starter' };
  const userPlan = PLANS[currentUser.plan] || PLANS['starter'];

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

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error || !data) {
          // Sesión huérfana — usuario eliminado de public.users
          await supabase.auth.signOut();
          window.location.href = '/crm';
          return;
        }

        setCurrentUserData(data);
        setAgentProfile({
          ...data,
          role:       data.role       || data.position  || '',
          agency:     data.agency     || data.company   || '',
          photo_url:  data.photo_url  || data.avatar_url || '',
          whatsapp:   data.whatsapp   || '',
          instagram:  data.instagram  || '',
          facebook:   data.facebook   || '',
          tiktok:     data.tiktok     || '',
          youtube:    data.youtube    || '',
          linkedin:   data.linkedin   || '',
          website:    data.website    || '',
          palette_id: data.palette_id || 'oro_elegante',
          logo_url:   data.logo_url   || '',
          slug:       data.slug       || ''
        });
      } catch (err) {
        await supabase.auth.signOut();
        window.location.href = '/crm';
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
    video_urls: [],
    amenities: [],
    features: [],
    template_key: 'desarrollo',
    landing_slug: '',
    canonical_key: '',
    headline: '',
    subheadline: '',
    tagline: '',
    content_sections: []
  });

  const [currentView, setCurrentView] = useState(() => (
    window.location.pathname.includes('/crm/leads') ? 'leads' : 'landings'
  )); // vista inicial para admin

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
          role: agentProfile.role || agentProfile.position,
          phone: agentProfile.phone,
          whatsapp: agentProfile.whatsapp,
          agency: agentProfile.agency || agentProfile.company,
          bio: agentProfile.bio,
          photo_url: agentProfile.photo_url || agentProfile.avatar_url,
          instagram: agentProfile.instagram,
          facebook: agentProfile.facebook,
          tiktok: agentProfile.tiktok,
          youtube: agentProfile.youtube,
          linkedin: agentProfile.linkedin,
          website: agentProfile.website,
          palette_id: agentProfile.palette_id,
          logo_url: agentProfile.logo_url
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
  const [newImageUrl, setNewImageUrl] = useState('');

  const updateContentSection = (index, field, value) => {
    setProperty(prev => ({
      ...prev,
      content_sections: (prev.content_sections || []).map((section, sectionIndex) => (
        sectionIndex === index ? { ...section, [field]: value } : section
      ))
    }));
  };

  const addContentSection = () => {
    setProperty(prev => ({
      ...prev,
      content_sections: [...(prev.content_sections || []), { title: 'Nueva sección', body: '' }]
    }));
  };

  const removeContentSection = index => {
    setProperty(prev => ({
      ...prev,
      content_sections: (prev.content_sections || []).filter((_, sectionIndex) => sectionIndex !== index)
    }));
  };

  const applySelectedTemplate = () => {
    const source = userProperties.find(item => item.template_key === property.template_key && item.id !== property.id);
    if (!source) {
      alert('Selecciona una plantilla de una propiedad existente.');
      return;
    }
    const shouldApply = window.confirm(
      `Se copiarán la estructura, textos, imágenes, videos, amenidades y características de “${source.title}”. Podrás editarlos antes de guardar. ¿Continuar?`
    );
    if (!shouldApply) return;
    setProperty(prev => ({
      ...prev,
      headline: source.headline || '',
      subheadline: source.subheadline || '',
      tagline: source.tagline || '',
      images: [...(source.images || [])],
      video_urls: [...(source.video_urls || [])],
      amenities: [...(source.amenities || [])],
      features: [...(source.features || [])],
      content_sections: (source.content_sections || []).map(section => ({ ...section })),
      featured_image_url: source.featured_image_url || source.images?.[0] || ''
    }));
  };



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

  const addCustomAmenity = () => {
    const amenity = newAmenity.trim();
    if (!amenity) return;
    if (!amenities.includes(amenity)) setAmenities(prev => [...prev, amenity]);
    setProperty(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) ? prev.amenities : [...prev.amenities, amenity]
    }));
    setNewAmenity('');
  };

  const addImageUrl = () => {
    const imageUrl = newImageUrl.trim();
    if (!imageUrl) return;
    if ((property.images || []).length >= 15) {
      alert('Has alcanzado el límite máximo de 15 fotos por propiedad.');
      return;
    }
    setProperty(prev => ({
      ...prev,
      images: [...(prev.images || []), imageUrl],
      featured_image_url: prev.featured_image_url || imageUrl
    }));
    setNewImageUrl('');
  };

  const removeImage = (imageUrl) => {
    setProperty(prev => {
      const images = (prev.images || []).filter(image => image !== imageUrl);
      return {
        ...prev,
        images,
        featured_image_url: prev.featured_image_url === imageUrl ? (images[0] || '') : prev.featured_image_url
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
      const generatedSlug = (property.landing_slug || property.title)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      const selectedCover = property.featured_image_url || (property.images && property.images[0]) || '';
      const orderedImages = [
        selectedCover,
        ...(property.images || []).filter(image => image && image !== selectedCover)
      ].filter(Boolean);
      const payload = {
        user_id: isEditing
          ? (property.user_id || currentUser.id)
          : ((currentUser.plan === 'admin' && adminUserFilter !== 'all') ? adminUserFilter : currentUser.id),
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
        featured_image_url: selectedCover || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600',
        images: orderedImages,
        video_urls: property.video_urls || [],
        amenities: property.amenities || [],
        features: property.features || [],
        template_key: property.template_key || 'desarrollo',
        landing_slug: generatedSlug,
        canonical_key: property.canonical_key || generatedSlug,
        headline: property.headline || '',
        subheadline: property.subheadline || '',
        tagline: property.tagline || '',
        content_sections: property.content_sections || [],
        map_url: property.map_url || '',
        active: true,

        views: property.views || 0,
        leads: property.leads || 0
      };

      // ── Guardar en Supabase ──────────────────────────────────────────────
      let savedProp = null;
      if (isEditing) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', property.id);
        if (updateError) throw updateError;

        // Leer nuevamente evita el falso error PGRST116 de `.single()` sobre la
        // respuesta vacía del UPDATE y confirma que el cambio sí quedó persistido.
        const { data, error: reloadError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', property.id)
          .maybeSingle();
        if (reloadError) throw reloadError;
        if (!data) throw new Error('Supabase no devolvió la propiedad actualizada. Revisa los permisos de edición.');
        const savedImages = Array.isArray(data.images) ? data.images : [];
        if (
          data.featured_image_url !== payload.featured_image_url ||
          JSON.stringify(savedImages) !== JSON.stringify(payload.images)
        ) {
          throw new Error('Supabase no confirmó los cambios de imágenes. La edición no fue aplicada.');
        }
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
        featured_image_url: '', map_url: '', images: [], video_urls: [], amenities: [], features: [],
        template_key: 'desarrollo', landing_slug: '', canonical_key: '', headline: '', subheadline: '', tagline: '', content_sections: []
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

  const updateHomePresentation = async (propId, changes) => {
    setAllProperties(prev => prev.map(item => item.id === propId ? { ...item, ...changes } : item));
    const { error } = await supabase.from('properties').update(changes).eq('id', propId);
    if (error) {
      await loadProperties();
      alert(`No se pudo actualizar el Home: ${error.message}`);
    }
  };

  const reorderHomeProperties = async orderedProperties => {
    setAllProperties(prev => prev.map(item => {
      const ordered = orderedProperties.find(candidate => candidate.id === item.id);
      return ordered ? { ...item, home_order: ordered.home_order } : item;
    }));
    const results = await Promise.all(orderedProperties.map(item => (
      supabase.from('properties').update({ home_order: item.home_order }).eq('id', item.id)
    )));
    const failed = results.find(result => result.error);
    if (failed) {
      await loadProperties();
      alert(`No se pudo guardar el orden: ${failed.error.message}`);
    }
  };

  const handleEditProperty = (prop) => {
    setProperty({
      ...property,
      ...prop,
      images: Array.isArray(prop.images) ? prop.images : [],
      video_urls: Array.isArray(prop.video_urls) ? prop.video_urls : [],
      amenities: Array.isArray(prop.amenities) ? prop.amenities : [],
      features: Array.isArray(prop.features) ? prop.features : [],
      content_sections: Array.isArray(prop.content_sections) ? prop.content_sections : []
    });
    setImagePreview(prop.featured_image_url || null);
    setActiveTab('description');
    setCurrentView('add-property');
  };

  const tabs = [
    { id: 'description', label: '1. Descripción' },
    { id: 'price', label: '2. Precio' },
    { id: 'media', label: '3. Fotografías' },
    { id: 'details', label: '4. Detalles' },
    { id: 'location', label: '5. Ubicación' },
    { id: 'amenities', label: '6. Amenidades' },
    { id: 'content', label: '7. Contenido y plantilla' }
  ];

  const municipalityOptions = Object.keys(chiapasData);
  const postalCodeOptions = property.municipality && chiapasData[property.municipality]
    ? Object.keys(chiapasData[property.municipality])
    : [];
  const colonyOptions = property.municipality && property.postal_code
    ? (chiapasData[property.municipality]?.[property.postal_code] || [])
    : [];
  const formGridStyle = { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: '1.25rem' };
  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.45rem' };
  const labelStyle = { fontSize: '0.82rem', fontWeight: '700', color: '#334155' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#0f172a', padding: '2rem 0', display: 'flex', flexDirection: 'column', color: '#f8fafc', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg viewBox="0 0 24 24" style={{ height: '30px', width: '30px', fill: '#38bdf8', flexShrink: 0 }}>
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.7l7 6.3v9h-4v-6H9v6H5v-9l7-6.3z" />
          </svg>
          <div>
            <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>CRM Estate</h2>
            <p style={{ color: '#475569', fontSize: '0.72rem', margin: 0 }}>Propiedades en Chiapas</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0 0.75rem', flex: 1 }}>
          {[
            { view: 'landings',     icon: '🚀', label: 'Landing Pages',      admin: true },
            { view: 'home-layout',   icon: '↕️', label: 'Organizar Home',     admin: true },
            { view: 'leads',        icon: '📩', label: 'Leads',              admin: false },
            { view: 'properties',   icon: '🏠', label: `Propiedades (${userProperties.length})`, admin: false },
            { view: 'add-property', icon: '➕', label: 'Agregar Propiedad',   admin: false },
            { view: 'users',        icon: '👥', label: 'Asesores',            admin: true },
            { view: 'agencies',     icon: '🏢', label: 'Agencias',            admin: true },
            { view: 'analytics',    icon: '📊', label: 'Estadísticas',        admin: false },
            { view: 'profile',      icon: '💳', label: 'Mi Tarjeta Digital',  admin: false },
          ].filter(item => !item.admin || currentUser.plan === 'admin').map(item => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              style={{
                textAlign: 'left', padding: '0.8rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: currentView === item.view ? '#1e293b' : 'transparent',
                color: currentView === item.view ? '#38bdf8' : '#94a3b8',
                fontWeight: '600', fontSize: '0.88rem',
                display: 'flex', alignItems: 'center', gap: '10px',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
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
                {activeTab === 'description' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Título de la propiedad *</label>
                      <input type="text" name="title" value={property.title} onChange={handleInputChange} placeholder="Ej. Casa en Residencial Campestre" className="form-input" />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Descripción completa</label>
                      <textarea name="description" value={property.description} onChange={handleInputChange} placeholder="Describe los espacios, acabados, entorno y ventajas de la propiedad" className="form-textarea" style={{ minHeight: '180px' }} />
                    </div>
                    <div style={formGridStyle}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Frase principal de la tarjeta</label>
                        <input type="text" name="headline" value={property.headline || ''} onChange={handleInputChange} placeholder="Mensaje principal" className="form-input" />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Frase secundaria</label>
                        <input type="text" name="subheadline" value={property.subheadline || ''} onChange={handleInputChange} placeholder="Complemento del mensaje" className="form-input" />
                      </div>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Llamado o frase comercial</label>
                      <input type="text" name="tagline" value={property.tagline || ''} onChange={handleInputChange} placeholder="Ej. Invierte hoy y asegura tu patrimonio" className="form-input" />
                    </div>
                    <div style={formGridStyle}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Tipo de propiedad</label>
                        <select name="type" value={property.type} onChange={handleInputChange} className="form-input">
                          {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Estado comercial</label>
                        <select name="status" value={property.status} onChange={handleInputChange} className="form-input">
                          {['Disponible', 'Apartada', 'Vendida', 'Rentada', 'En preventa'].map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'price' && (
                  <div style={formGridStyle}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Operación</label>
                      <select name="operation_type" value={property.operation_type} onChange={handleInputChange} className="form-input">
                        <option value="Venta">Venta</option>
                        <option value="Renta">Renta</option>
                      </select>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Precio en MXN *</label>
                      <input type="number" min="0" step="1" name="price" value={property.price} onChange={handleInputChange} placeholder="2500000" className="form-input" />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Texto después del precio</label>
                      <input type="text" name="price_suffix" value={property.price_suffix} onChange={handleInputChange} placeholder="Ej. / mes, negociable" className="form-input" />
                    </div>
                  </div>
                )}

                {activeTab === 'media' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: '#eff6ff', color: '#1e40af', fontSize: '0.82rem', fontWeight: '600' }}>
                      Contenido cargado: {(property.images || []).length} imágenes y {(property.video_urls || []).length} videos.
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Agregar fotografía desde una dirección web</label>
                      <div style={{ display: 'flex', gap: '0.75rem', flexDirection: isMobile ? 'column' : 'row' }}>
                        <input type="url" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="https://..." className="form-input" style={{ flex: 1 }} />
                        <button type="button" onClick={addImageUrl} className="btn-primary" style={{ padding: '0.75rem 1.25rem' }}>Agregar foto</button>
                      </div>
                    </div>
                    <label onDragOver={e => e.preventDefault()} onDrop={handleFileDrop} style={{ border: '2px dashed #cbd5e1', borderRadius: '14px', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', color: '#475569' }}>
                      <input type="file" accept="image/*" multiple onChange={handleFileDrop} style={{ display: 'none' }} />
                      <strong>Arrastra fotografías aquí o pulsa para seleccionarlas</strong>
                      <div style={{ fontSize: '0.78rem', marginTop: '0.4rem', color: '#94a3b8' }}>Hasta 15 imágenes. Marca una como portada.</div>
                    </label>
                    {(property.images || []).length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '1rem' }}>
                        {property.images.map((image, index) => (
                          <div key={`${image}-${index}`} style={{ border: property.featured_image_url === image ? '3px solid #0284c7' : '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                            <img src={image} alt={`Fotografía ${index + 1}`} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} />
                            <div style={{ display: 'flex', gap: '0.35rem', padding: '0.5rem' }}>
                              <button type="button" onClick={() => setProperty(prev => ({ ...prev, featured_image_url: image }))} style={{ flex: 1, border: 'none', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer', background: property.featured_image_url === image ? '#e0f2fe' : '#f1f5f9', color: '#0369a1', fontSize: '0.7rem', fontWeight: '700' }}>
                                {property.featured_image_url === image ? '✓ Portada' : 'Usar portada'}
                              </button>
                              <button type="button" onClick={() => removeImage(image)} aria-label="Eliminar fotografía" style={{ border: 'none', borderRadius: '6px', padding: '0.4rem 0.6rem', cursor: 'pointer', background: '#fef2f2', color: '#dc2626' }}>×</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Videos (una dirección por línea)</label>
                      <textarea
                        value={(property.video_urls || []).join('\n')}
                        onChange={e => setProperty(prev => ({ ...prev, video_urls: e.target.value.split('\n').map(value => value.trim()).filter(Boolean) }))}
                        placeholder="https://.../video.mp4 o enlace de YouTube"
                        className="form-textarea"
                        style={{ minHeight: '120px' }}
                      />
                    </div>
                    {(property.video_urls || []).map((videoUrl, index) => (
                      <div key={`${videoUrl}-${index}`} style={{ padding: '0.8rem 1rem', border: '1px solid #e2e8f0', borderRadius: '10px', overflowWrap: 'anywhere', fontSize: '0.78rem', color: '#475569' }}>
                        🎬 {videoUrl}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'details' && (
                  <div style={formGridStyle}>
                    {[
                      ['size_m2', 'Superficie mostrada en la tarjeta (m²)', 'number'],
                      ['size_land_m2', 'Superficie de terreno (m²)', 'number'],
                      ['size_construction_m2', 'Superficie de construcción (m²)', 'number'],
                      ['bedrooms', 'Recámaras', 'number'],
                      ['bathrooms', 'Baños', 'number'],
                      ['garages', 'Estacionamientos', 'number'],
                      ['year_built', 'Año de construcción', 'number'],
                      ['floors', 'Niveles', 'number']
                    ].map(([name, label, type]) => (
                      <div key={name} style={fieldStyle}>
                        <label style={labelStyle}>{label}</label>
                        <input type={type} min="0" step={name === 'bathrooms' ? '0.5' : '1'} name={name} value={property[name]} onChange={handleInputChange} className="form-input" />
                      </div>
                    ))}
                    <label style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                      <input type="checkbox" name="furnished" checked={property.furnished} onChange={handleInputChange} /> Amueblada
                    </label>
                    <label style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                      <input type="checkbox" name="maid_room" checked={property.maid_room} onChange={handleInputChange} /> Cuarto de servicio
                    </label>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div style={formGridStyle}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Municipio</label>
                      <select name="municipality" value={property.municipality} onChange={handleInputChange} className="form-input">
                        <option value="">Selecciona un municipio</option>
                        {municipalityOptions.map(municipality => <option key={municipality} value={municipality}>{municipality}</option>)}
                      </select>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Código postal</label>
                      <select name="postal_code" value={property.postal_code} onChange={handleInputChange} className="form-input" disabled={!property.municipality}>
                        <option value="">Selecciona un código postal</option>
                        {postalCodeOptions.map(postalCode => <option key={postalCode} value={postalCode}>{postalCode}</option>)}
                      </select>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Colonia</label>
                      <select name="colony" value={property.colony} onChange={handleInputChange} className="form-input" disabled={!property.postal_code}>
                        <option value="">Selecciona una colonia</option>
                        {colonyOptions.map((colony, index) => <option key={`${colony}-${index}`} value={colony}>{colony}</option>)}
                      </select>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Enlace de Google Maps</label>
                      <input type="url" name="map_url" value={property.map_url} onChange={handleInputChange} placeholder="https://maps.google.com/..." className="form-input" />
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
                      {amenities.map(amenity => (
                        <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.85rem', border: property.amenities.includes(amenity) ? '1px solid #38bdf8' : '1px solid #e2e8f0', borderRadius: '10px', background: property.amenities.includes(amenity) ? '#f0f9ff' : '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}>
                          <input type="checkbox" checked={property.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} />
                          {amenity}
                        </label>
                      ))}
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Agregar una amenidad personalizada</label>
                      <div style={{ display: 'flex', gap: '0.75rem', flexDirection: isMobile ? 'column' : 'row' }}>
                        <input type="text" value={newAmenity} onChange={e => setNewAmenity(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomAmenity(); } }} placeholder="Ej. Paneles solares" className="form-input" style={{ flex: 1 }} />
                        <button type="button" onClick={addCustomAmenity} className="btn-primary" style={{ padding: '0.75rem 1.25rem' }}>Agregar amenidad</button>
                      </div>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Características y beneficios de la tarjeta (uno por línea)</label>
                      <textarea
                        value={(property.features || []).join('\n')}
                        onChange={e => setProperty(prev => ({ ...prev, features: e.target.value.split('\n').map(value => value.trim()).filter(Boolean) }))}
                        placeholder="Escritura pública\nEntrega inmediata\nSin buró de crédito"
                        className="form-textarea"
                        style={{ minHeight: '180px' }}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={formGridStyle}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Plantilla visual</label>
                        <select name="template_key" value={property.template_key || 'desarrollo'} onChange={handleInputChange} className="form-input">
                          <option value="desarrollo">Plantilla general de desarrollo</option>
                          {[...new Set(userProperties.map(item => item.template_key).filter(Boolean))].map(template => (
                            <option key={template} value={template}>{template.replaceAll('-', ' ')}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ ...fieldStyle, justifyContent: 'flex-end' }}>
                        <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.8rem' }}>
                          {(property.content_sections || []).length} secciones cargadas desde la landing.
                        </div>
                      </div>
                    </div>
                    {!property.id && (
                      <button type="button" onClick={applySelectedTemplate} style={{ padding: '0.9rem 1rem', borderRadius: '10px', border: '1px solid #0284c7', background: '#eff6ff', color: '#0369a1', fontWeight: '800', cursor: 'pointer' }}>
                        Copiar contenido completo de esta plantilla
                      </button>
                    )}
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Ruta pública de la landing</label>
                      <input
                        type="text"
                        name="landing_slug"
                        value={property.landing_slug || ''}
                        onChange={handleInputChange}
                        placeholder="nombre-del-desarrollo"
                        className="form-input"
                      />
                      <small style={{ color: '#64748b' }}>Se conserva al editar. Para una propiedad nueva se genera desde el título.</small>
                    </div>

                    {(property.content_sections || []).map((section, index) => (
                      <div key={`${section.title}-${index}`} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <strong style={{ color: '#64748b', fontSize: '0.76rem', minWidth: '72px' }}>Sección {index + 1}</strong>
                          <input value={section.title || ''} onChange={e => updateContentSection(index, 'title', e.target.value)} className="form-input" placeholder="Título de la sección" style={{ flex: 1 }} />
                          <button type="button" onClick={() => removeContentSection(index)} aria-label={`Eliminar sección ${index + 1}`} style={{ border: 'none', borderRadius: '8px', padding: '0.65rem 0.8rem', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontWeight: '700' }}>×</button>
                        </div>
                        <textarea value={section.body || ''} onChange={e => updateContentSection(index, 'body', e.target.value)} className="form-textarea" placeholder="Texto, frases y puntos de esta sección" style={{ minHeight: '130px' }} />
                      </div>
                    ))}

                    <button type="button" onClick={addContentSection} style={{ padding: '0.9rem', borderRadius: '10px', border: '1px dashed #0284c7', background: '#f0f9ff', color: '#0369a1', fontWeight: '700', cursor: 'pointer' }}>
                      + Agregar sección de contenido
                    </button>
                  </div>
                )}
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={saveProperty} disabled={isSaving} className="btn-primary" style={{ padding: '1rem 2rem', opacity: isSaving ? 0.65 : 1 }}>
                    {isSaving ? 'Guardando...' : 'Guardar Propiedad'}
                  </button>
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
                      <input type="text" value={agentProfile.role} onChange={e => setAgentProfile(p => ({ ...p, role: e.target.value }))} className="form-input" placeholder="Cargo (e.g. Asesor Premium)" style={{ height: '48px' }} />
                      <input type="text" value={agentProfile.agency} onChange={e => setAgentProfile(p => ({ ...p, agency: e.target.value }))} className="form-input" placeholder="Agencia (e.g. IBR)" style={{ height: '48px' }} />
                      <textarea value={agentProfile.bio} onChange={e => setAgentProfile(p => ({ ...p, bio: e.target.value }))} className="form-textarea" placeholder="Biografía" style={{ minHeight: '120px' }} />
                      <button onClick={saveProfile} className="btn-primary" style={{ height: '52px' }}>{isSaving ? 'Guardando...' : 'Guardar Perfil'}</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'properties' && <PropertyManager properties={userProperties} onToggleActive={handleToggleActive} onEdit={handleEditProperty} plan={userPlan.id} />}
              {activeTab === 'analytics' && <AnalyticsView analytics={analyticsData} plan={userPlan} />}
              {activeTab === 'leads' && <LeadsDashboard currentUser={currentUser} isMobile={isMobile} />}
            </div>
          )}

          {currentView === 'users' && currentUser.plan === 'admin' && <UserManager />}
          {currentView === 'agencies' && currentUser.plan === 'admin' && <AgencyManager />}
          {currentView === 'landings' && currentUser.plan === 'admin' && <LandingManager />}
          {currentView === 'home-layout' && currentUser.plan === 'admin' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.4rem' }}>Organizar Home</h1>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Ordena, categoriza, destaca u oculta tarjetas sin editar su información.</p>
              <HomeOrganizer properties={allProperties} onReorder={reorderHomeProperties} onUpdate={updateHomePresentation} />
            </div>
          )}
          {currentView === 'leads' && <LeadsDashboard currentUser={currentUser} isMobile={isMobile} />}
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
            { id: 'leads', sub: '', label: 'Leads', icon: '📩' },
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

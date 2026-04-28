import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import chiapasData from '../data/chiapasLocations.json';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('description');
  const [isSaving, setIsSaving] = useState(false);
  
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
    amenities: []
  });

  const [currentView, setCurrentView] = useState('add-property'); // 'add-property' or 'profile'
  
  const [agentProfile, setAgentProfile] = useState({
    name: 'Daniel Vázquez',
    position: 'Asesor Inmobiliario Senior',
    phone: '961 123 4567',
    whatsapp: '961 123 4567',
    email: 'daniel@propiedadesenchiapas.com',
    company: 'Chiapas Premium Real Estate',
    license: 'LIC-CH-78291',
    location: 'TUXTLA GUTIERREZ',
    bio: 'Especialista en desarrollo inmobiliario premium con más de 8 años de experiencia en el mercado de Chiapas.',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'
  });

  const [imagePreview, setImagePreview] = useState(null);

  const propertyTypes = [
    'Casa', 'Departamento', 'Lote Residencial', 'Terreno Comercial', 
    'Terreno Agrícola/Ejidal', 'Bodega', 'Local Comercial', 'Oficina', 
    'Edificio', 'Rancho', 'Quinta', 'Nave Industrial', 'Desarrollo en Preventa'
  ];

  const amenitiesList = [
    'Alberca', 'Seguridad 24/7', 'Jardín', 'Cocina Integral', 'Terraza', 
    'Aire Acondicionado', 'Gimnasio', 'Elevador', 'Cisterna', 'Gas Estacionario', 
    'Cuarto de Servicio', 'Mascotas Permitidas', 'Bodega Privada', 'Estacionamiento Visitas'
  ];



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
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        // Emulate an upload by saving the base64 to featured_image_url
        setProperty(prev => ({ ...prev, featured_image_url: event.target.result }));
      };
      reader.readAsDataURL(file);
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
    
    setIsSaving(true);
    try {
      // Formatter for extra details
      let detailsString = '';
      if (property.operation_type) detailsString += `\n- Operación: ${property.operation_type}`;
      if (property.size_land_m2) detailsString += `\n- Terreno: ${property.size_land_m2} m²`;
      if (property.size_construction_m2) detailsString += `\n- Construcción: ${property.size_construction_m2} m²`;
      if (property.year_built) detailsString += `\n- Año de constr.: ${property.year_built}`;
      if (property.floors) detailsString += `\n- Niveles: ${property.floors}`;
      if (property.furnished) detailsString += `\n- Amueblado: Sí`;
      if (property.maid_room) detailsString += `\n- Cuarto de Servicio: Sí`;

      let finalDescription = property.description;
      if (detailsString) {
        finalDescription += `\n\nFicha Técnica del Inmueble:${detailsString}`;
      }
      if (property.amenities.length > 0) {
        finalDescription += `\n\nCaracterísticas y Amenidades:\n- ${property.amenities.join('\n- ')}`;
      }

      // We use size_construction_m2 or land_m2 for size_m2 in core DB depending on what's available
      const sizeDB = property.size_construction_m2 || property.size_land_m2 || 0;

      const { data, error } = await supabase
        .from('properties')
        .insert([{
          title: property.title,
          description: finalDescription,
          price: parseFloat(property.price),
          price_suffix: property.price_suffix,
          status: property.status,
          type: property.type,
          size_m2: sizeDB ? parseFloat(sizeDB) : null,
          bedrooms: parseInt(property.bedrooms) || 0,
          bathrooms: parseInt(property.bathrooms) || 0,
          garages: parseInt(property.garages) || 0,
          city: property.municipality, 
          featured_image_url: property.featured_image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600'
        }]);

      if (error) throw error;
      alert("¡Propiedad guardada exitosamente en la Base de Datos!");
      
      // Reset form
      setProperty({
        title: '', description: '', operation_type: 'Venta', price: '', price_suffix: '', status: 'Disponible', type: 'Casa', size_m2: '', size_land_m2: '', size_construction_m2: '', year_built: '', floors: '', furnished: false, maid_room: false, bedrooms: 0, bathrooms: 0, garages: 0, municipality: '', colony: '', postal_code: '', featured_image_url: '', amenities: []
      });
      setImagePreview(null);
      setActiveTab('description');
    } catch (error) {
      console.error('Error saving property:', error.message);
      alert("Error al guardar: " + error.message);
    } finally {
      setIsSaving(false);
    }
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
        <div style={{ padding: '0 2rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '32px', width: '32px', fill: '#38bdf8' }}>
            <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.7l7 6.3v9h-4v-6H9v6H5v-9l7-6.3z" />
          </svg>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px' }}>CRM Estate</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '2px' }}>Propiedades en Chiapas</p>
          </div>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 1rem' }}>
          <button 
            onClick={() => setCurrentView('add-property')}
            style={{ 
              textAlign: 'left', 
              padding: '0.85rem 1.25rem', 
              borderRadius: '12px', 
              background: currentView === 'add-property' ? '#1e293b' : 'transparent', 
              color: currentView === 'add-property' ? '#38bdf8' : '#94a3b8', 
              fontWeight: '600', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}
          >
            <span>➕</span> Agregar Propiedad
          </button>
          
          <button 
            onClick={() => setCurrentView('profile')}
            style={{ 
              textAlign: 'left', 
              padding: '0.85rem 1.25rem', 
              borderRadius: '12px', 
              background: currentView === 'profile' ? '#1e293b' : 'transparent', 
              color: currentView === 'profile' ? '#38bdf8' : '#94a3b8', 
              fontWeight: '600', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}
          >
            <span>👤</span> Mi Perfil
          </button>

          <button style={{ textAlign: 'left', padding: '0.85rem 1.25rem', borderRadius: '12px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}>
            🏠 Mis Propiedades
          </button>
          <button style={{ textAlign: 'left', padding: '0.85rem 1.25rem', borderRadius: '12px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}>
            📩 Mensajes / Leads
          </button>
        </nav>

        <div style={{ marginTop: 'auto', padding: '0 1rem' }}>
          <button onClick={onLogout} style={{ width: '100%', textAlign: 'left', padding: '0.85rem 1.25rem', borderRadius: '12px', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          {currentView === 'add-property' ? (
            <>
              <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-1px' }}>Agregar Nueva Propiedad</h1>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Rellena los campos controlados para dar de alta una propiedad en el portal.</p>
              </div>

              <div className="dashboard-card">
            {/* Tabs (Horizontal Workflow) */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '0.4rem', gap: '0.25rem', marginBottom: '3rem', overflowX: 'auto' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
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
                  <label className="form-label">Cargar Fotografía Principal</label>
                  
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
                      onChange={handleFileDrop} 
                      style={{ display: 'none' }} 
                    />
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📸</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>Arrastra y suelta tu imagen aquí</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>O haz clic para explorar tus archivos locales.</p>
                  </div>

                  {/* Dynamic Frontend Uniform Crop Preview */}
                  {imagePreview && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <label className="form-label">Previsualización (Ajuste Uniforme / Recorte Responsivo)</label>
                      <div style={{ 
                        width: '100%', 
                        maxWidth: '400px',
                        aspectRatio: '4 / 3', 
                        overflow: 'hidden', 
                        borderRadius: '16px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0'
                      }}>
                        <img 
                          src={imagePreview} 
                          alt="Previsualización" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>* Así se recortará y mostrará la foto en el catálogo del portal.</p>
                    </div>
                  )}

                  <div style={{ marginTop: '1rem' }}>
                    <label className="form-label">O usa un link directo (URL)</label>
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
                        {property.municipality && Object.keys(chiapasData[property.municipality]).map(cp => <option key={cp} value={cp}>{cp}</option>)}
                      </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Colonia / Fraccionamiento</label>
                      <select name="colony" value={property.colony} onChange={handleInputChange} disabled={!property.postal_code} className="form-select">
                        <option value="">-- Selecciona Colonia --</option>
                        {property.postal_code && chiapasData[property.municipality][property.postal_code].sort().map(col => <option key={col} value={col}>{col}</option>)}
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
                    {amenitiesList.map(amenity => (
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
          </>
          ) : (
            /* Profile View (WP Residence style Agent Card) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-1px' }}>Mi Perfil de Asesor</h1>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>Personaliza tus datos de contacto y branding de inmobiliaria.</p>
              </div>

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
                      background: '#38bdf8', 
                      color: '#ffffff', 
                      padding: '0.35rem 0.75rem', 
                      borderRadius: '30px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700' 
                    }}>
                      ASESOR VERIFICADO
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
                        value={agentProfile.avatar_url} 
                        onChange={(e) => setAgentProfile(prev => ({ ...prev, avatar_url: e.target.value }))} 
                        placeholder="https://images.unsplash.com/photo-..." 
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    <button 
                      onClick={() => alert("¡Perfil de Asesor Actualizado Exitosamente!")} 
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
        </div>
      </main>
    </div>
  );
}

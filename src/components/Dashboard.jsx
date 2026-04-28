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
    price: '',
    price_suffix: '',
    status: 'Disponible',
    type: 'Lote',
    size_m2: '',
    bedrooms: 0,
    size_m2: '',
    bedrooms: 0,
    bathrooms: 0,
    garages: 0,
    municipality: '',
    colony: '',
    postal_code: '',
    featured_image_url: ''
  });

  const propertyTypes = [
    'Casa', 'Departamento', 'Lote Residencial', 'Terreno Comercial', 
    'Terreno Agrícola/Ejidal', 'Bodega', 'Local Comercial', 'Oficina', 
    'Edificio', 'Rancho', 'Quinta', 'Nave Industrial'
  ];



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty(prev => {
      const newState = { ...prev, [name]: value };
      // Reset dependent fields if municipality changes
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

  const saveProperty = async () => {
    if (!property.title || !property.price) {
      alert("Por favor llena al menos el Título y el Precio.");
      return;
    }
    
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([{
          title: property.title,
          description: property.description,
          price: parseFloat(property.price),
          price_suffix: property.price_suffix,
          status: property.status,
          type: property.type,
          size_m2: property.size_m2 ? parseFloat(property.size_m2) : null,
          bedrooms: parseInt(property.bedrooms),
          bathrooms: parseInt(property.bathrooms),
          garages: parseInt(property.garages),
          city: property.municipality, // mapped back to city for backwards compatibility in DB
          featured_image_url: property.featured_image_url
        }]);

      if (error) throw error;
      alert("¡Propiedad guardada exitosamente en la Base de Datos!");
      // Reset form
      setProperty({
        title: '', description: '', price: '', price_suffix: '', status: 'Disponible', type: 'Casa', size_m2: '', bedrooms: 0, bathrooms: 0, garages: 0, municipality: '', colony: '', postal_code: '', featured_image_url: ''
      });
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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'rgba(10, 14, 20, 0.95)', borderRight: '1px solid var(--glass-border)', padding: '2rem 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 2rem', marginBottom: '3rem' }}>
          <h2 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: '700' }}>CRM ESTATE</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Propiedades Chiapas</p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          <button className="sidebar-link active" style={{ textAlign: 'left', padding: '1rem', borderRadius: '8px', background: 'var(--primary)', color: 'black', fontWeight: '600' }}>
            + Agregar Propiedad
          </button>
          <button className="sidebar-link" style={{ textAlign: 'left', padding: '1rem', borderRadius: '8px', color: 'white', background: 'transparent' }}>
            Mis Propiedades
          </button>
          <button className="sidebar-link" style={{ textAlign: 'left', padding: '1rem', borderRadius: '8px', color: 'white', background: 'transparent' }}>
            Mensajes / Leads
          </button>
        </nav>

        <div style={{ marginTop: 'auto', padding: '0 1rem' }}>
          <button onClick={onLogout} style={{ width: '100%', textAlign: 'left', padding: '1rem', borderRadius: '8px', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', fontWeight: '600' }}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Agregar Nueva Propiedad</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Rellena los datos para publicarla en el portal y guardarla en la base de datos.</p>

          <div className="glass" style={{ padding: '2rem' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem', overflowX: 'auto' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'transparent',
                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                    borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                    fontWeight: activeTab === tab.id ? '700' : '500',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content" style={{ animation: 'fadeIn 0.4s ease' }}>
              {activeTab === 'description' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Título de la Propiedad</label>
                    <input type="text" name="title" value={property.title} onChange={handleInputChange} placeholder="Ej. Lote Residencial en Celebria" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Descripción Completa</label>
                    <textarea name="description" value={property.description} onChange={handleInputChange} placeholder="Describe las ventajas, entorno..." style={{ width: '100%', height: '150px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', padding: '1rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
                  </div>
                </div>
              )}

              {activeTab === 'price' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Precio (MXN)</label>
                    <input type="number" name="price" value={property.price} onChange={handleInputChange} placeholder="Ej. 1500000" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Sufijo (Opcional)</label>
                    <input type="text" name="price_suffix" value={property.price_suffix} onChange={handleInputChange} placeholder="Ej. / mes" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Estado</label>
                    <select name="status" value={property.status} onChange={handleInputChange} style={{ width: '100%' }}>
                      <option>Disponible</option>
                      <option>Apartado</option>
                      <option>Vendido</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tipo de Propiedad</label>
                    <select name="type" value={property.type} onChange={handleInputChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white' }}>
                      <option value="">-- Selecciona el Tipo --</option>
                      {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>URL de Imagen Principal</label>
                    <input type="text" name="featured_image_url" value={property.featured_image_url} onChange={handleInputChange} placeholder="https://..." style={{ width: '100%' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Próximamente conectaremos el módulo para subir fotos arrastrando.</p>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Superficie (m2)</label>
                    <input type="number" name="size_m2" value={property.size_m2} onChange={handleInputChange} style={{ width: '100%' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Ubicación Controlada</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Municipio</label>
                        <select name="municipality" value={property.municipality} onChange={handleInputChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white' }}>
                          <option value="">-- Selecciona Municipio --</option>
                          {Object.keys(chiapasData).sort().map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Código Postal</label>
                        <select name="postal_code" value={property.postal_code} onChange={handleInputChange} disabled={!property.municipality} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: property.municipality ? 'white' : '#f0f0f0' }}>
                          <option value="">-- Selecciona CP --</option>
                          {property.municipality && Object.keys(chiapasData[property.municipality]).map(cp => <option key={cp} value={cp}>{cp}</option>)}
                        </select>
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Colonia / Fraccionamiento</label>
                        <select name="colony" value={property.colony} onChange={handleInputChange} disabled={!property.postal_code} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: property.postal_code ? 'white' : '#f0f0f0' }}>
                          <option value="">-- Selecciona Colonia --</option>
                          {property.postal_code && chiapasData[property.municipality][property.postal_code].sort().map(col => <option key={col} value={col}>{col}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Guardar Button */}
              <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={saveProperty}
                  disabled={isSaving}
                  className="btn-primary" 
                  style={{ padding: '1rem 3rem', opacity: isSaving ? 0.7 : 1 }}
                >
                  {isSaving ? 'Guardando...' : 'Guardar y Publicar Propiedad'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

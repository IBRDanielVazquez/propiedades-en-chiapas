import { useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, ChevronDown, Mail, User, ShieldCheck, Eye, DollarSign, Calendar, Layers, Home, Sparkles, Compass, Users } from 'lucide-react';
import { riojaConfig } from './content/rioja.config';
import { rioja360Tour } from './content/rioja-360.config';
import { riojaPhotos } from './content/rioja-fotos.config';
import RiojaGallery from './components/RiojaGallery';
import './styles/rioja.css';

const Tour360 = lazy(() => import('./components/Tour360'));

export default function RiojaLanding() {
  const [openFaq, setOpenFaq] = useState(null);
  const [show360, setShow360] = useState(false);

  const handleWhatsApp = () => {
    window.open(riojaConfig.contact.whatsappLink, '_blank');
  };

  const scrollToContacto = () => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="rioja-wrapper">
      <Helmet>
        <title>Terrenos en Berriozabal Rioja desde 1000 pesos mensuales</title>
        <meta name="description" content="Terrenos en Berriozabal Rioja desde 1000 pesos mensuales. Desarrollo de lotes campestres con Escritura Pública y pagos accesibles." />
        <meta property="og:title" content="Terrenos en Berriozabal Rioja desde 1000 pesos mensuales" />
        <meta property="og:description" content="Terrenos en Berriozabal Rioja desde 1000 pesos mensuales. Desarrollo de lotes campestres con Escritura Pública y pagos accesibles." />
        <link rel="canonical" href="https://propiedadesenchiapas.com/rioja" />
      </Helmet>

      {/* 1. Hero Premium */}
      <header className="rioja-hero">
        <div className="rioja-hero-content rioja-container">
          <h1 className="rioja-title rioja-title-hero">{riojaConfig.name}</h1>
          <p className="rioja-subtitle">{riojaConfig.mainMessage}</p>

          <div className="rioja-hero-finance-card">
            <div className="rioja-price-header">
              <DollarSign size={28} className="rioja-price-icon" />
              <div>
                <span className="rioja-price-title">Precio de Contado</span>
                <h3 className="rioja-price-main">{riojaConfig.financials.totalPrice}</h3>
              </div>
            </div>
            
            <div className="rioja-divider"></div>

            <div className="rioja-grid-2-2">
              <div className="rioja-finance-item-new">
                <Calendar size={18} />
                <div>
                  <span className="rioja-finance-lbl">Enganche</span>
                  <span className="rioja-finance-val">{riojaConfig.financials.downPayment}</span>
                </div>
              </div>
              <div className="rioja-finance-item-new highlight">
                <DollarSign size={18} />
                <div>
                  <span className="rioja-finance-lbl">Quincenal</span>
                  <span className="rioja-finance-val">{riojaConfig.financials.biweeklyPayment}</span>
                </div>
              </div>
              <div className="rioja-finance-item-new">
                <ShieldCheck size={18} />
                <div>
                  <span className="rioja-finance-lbl">Apartado</span>
                  <span className="rioja-finance-val">{riojaConfig.financials.reservation}</span>
                </div>
              </div>
              <div className="rioja-finance-item-new">
                <Layers size={18} />
                <div>
                  <span className="rioja-finance-lbl">Medidas</span>
                  <span className="rioja-finance-val">10x20 m (200 m²)</span>
                </div>
              </div>
            </div>

            <div className="rioja-hero-buttons">
              <button onClick={handleWhatsApp} className="rioja-btn rioja-btn-whatsapp-new">
                <Phone size={18} /> Preguntar por WhatsApp
              </button>
              <button onClick={scrollToContacto} className="rioja-btn rioja-btn-primary-new">
                Agendar Visita
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Problema / Aspiración */}
      <section className="rioja-section">
        <div className="rioja-container rioja-text-center">
          <span className="rioja-section-label">Tu Patrimonio</span>
          <h2 className="rioja-title rioja-section-title">Deja de pagar renta</h2>
          <p className="rioja-text-large">
            {riojaConfig.concept}
          </p>
        </div>
      </section>

      {/* Inserted Landscape Image Break */}
      {riojaPhotos && riojaPhotos.length > 0 && (
        <div className="rioja-image-break">
          <img src={riojaPhotos[0].url} alt="Desarrollo Rioja Panorámica" loading="lazy" />
        </div>
      )}

      {/* 3 & 4. Características Principales */}
      <section className="rioja-section rioja-section-dark">
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label" style={{ color: 'var(--rioja-gold)' }}>El Desarrollo</span>
            <h2 className="rioja-title rioja-section-title" style={{ color: 'var(--rioja-white)' }}>Características Principales</h2>
          </div>
          
          <div className="rioja-grid-features">
            <div className="rioja-feature-card-new">
              <Layers className="rioja-feature-icon" />
              <div>
                <span className="rioja-feat-lbl">Lotes de</span>
                <span className="rioja-feat-val">10 x 20 metros</span>
              </div>
            </div>
            <div className="rioja-feature-card-new">
              <Home className="rioja-feature-icon" />
              <div>
                <span className="rioja-feat-lbl">Superficie de</span>
                <span className="rioja-feat-val">200 m²</span>
              </div>
            </div>
            <div className="rioja-feature-card-new">
              <ShieldCheck className="rioja-feature-icon" />
              <div>
                <span className="rioja-feat-lbl">Seguridad Jurídica</span>
                <span className="rioja-feat-val">Escritura Pública</span>
              </div>
            </div>
            <div className="rioja-feature-card-new">
              <Compass className="rioja-feature-icon" />
              <div>
                <span className="rioja-feat-lbl">Zona Establecida</span>
                <span className="rioja-feat-val">Construcciones Cercanas</span>
              </div>
            </div>
            <div className="rioja-feature-card-new">
              <Sparkles className="rioja-feature-icon" />
              <div>
                <span className="rioja-feat-lbl">Construcción</span>
                <span className="rioja-feat-val">Cuando tú lo desees</span>
              </div>
            </div>
            <div className="rioja-feature-card-new">
              <MapPin className="rioja-feature-icon" />
              <div>
                <span className="rioja-feat-lbl">Ubicación</span>
                <span className="rioja-feat-val">Berriozábal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 & 6. Diferenciador y Ubicación */}
      <section className="rioja-section">
        <div className="rioja-container">
          <div className="rioja-grid-2 rioja-align-stretch">
            <div className="rioja-flex-column">
              <span className="rioja-section-label" style={{ textAlign: 'left' }}>Diferenciador</span>
              <h2 className="rioja-title" style={{ fontSize: '2.3rem', marginBottom: '20px' }}>{riojaConfig.differentiator.title}</h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--rioja-text-light)', marginBottom: '30px', lineHeight: '1.6' }}>
                {riojaConfig.differentiator.text}
              </p>
              
              <h3 className="rioja-title" style={{ fontSize: '1.7rem', marginTop: '20px', marginBottom: '15px' }}>Ubicación Estratégica</h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--rioja-text-light)', marginBottom: '25px', lineHeight: '1.6' }}>
                {riojaConfig.location.description}
              </p>

              <div className="rioja-location-details-card">
                <div className="rioja-loc-item">
                  <MapPin size={18} />
                  <span><strong>Municipio:</strong> Berriozábal</span>
                </div>
                <div className="rioja-loc-item">
                  <Compass size={18} />
                  <span><strong>Referencia:</strong> Zona en crecimiento constante</span>
                </div>
                <div className="rioja-loc-item">
                  <Home size={18} />
                  <span><strong>Zona Habitada:</strong> Construcciones a los alrededores</span>
                </div>
                <div className="rioja-loc-item">
                  <ShieldCheck size={18} />
                  <span><strong>Acceso:</strong> Listo para conectar servicios</span>
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <a href={riojaConfig.location.mapUrl} target="_blank" rel="noreferrer" className="rioja-btn rioja-btn-outline-new">
                  <MapPin size={18} /> Abrir en Google Maps
                </a>
              </div>
            </div>
            
            <div className="rioja-map-wrapper">
              <div className="rioja-map-container-new">
                <iframe 
                   src={riojaConfig.location.mapEmbed}
                   width="100%" 
                   height="100%" 
                   style={{ border: 0 }} 
                   allowFullScreen="" 
                   loading="lazy" 
                   referrerPolicy="no-referrer-when-downgrade"
                   title="Ubicación RIOJA"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 & 8. Beneficios Visores */}
      <section className="rioja-section rioja-section-benefits" style={{ backgroundColor: '#fcfaf6' }}>
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Ventajas</span>
            <h2 className="rioja-title rioja-section-title">¿Por qué invertir en RIOJA?</h2>
          </div>

          <div className="rioja-grid-benefits-new">
            <div className="rioja-benefit-card-new">
              <div className="rioja-benefit-header">
                <Sparkles size={22} />
                <h4>Construye a tu ritmo</h4>
              </div>
              <p>Sin plazos forzosos de construcción, inicia tu proyecto cuando estés listo.</p>
            </div>
            <div className="rioja-benefit-card-new">
              <div className="rioja-benefit-header">
                <Home size={22} />
                <h4>Tu terreno será tuyo</h4>
              </div>
              <p>Propiedad privada delimitada y lista para ser heredada o habitada.</p>
            </div>
            <div className="rioja-benefit-card-new">
              <div className="rioja-benefit-header">
                <ShieldCheck size={22} />
                <h4>Seguridad Jurídica</h4>
              </div>
              <p>Todos los lotes cuentan con Escritura Pública debidamente registrada.</p>
            </div>
            <div className="rioja-benefit-card-new">
              <div className="rioja-benefit-header">
                <DollarSign size={22} />
                <h4>Pagos accesibles</h4>
              </div>
              <p>Enganche mínimo y cómodas mensualidades al alcance de tu presupuesto.</p>
            </div>
            <div className="rioja-benefit-card-new">
              <div className="rioja-benefit-header">
                <MapPin size={22} />
                <h4>Excelente ubicación</h4>
              </div>
              <p>Localizado de manera estratégica en el municipio de Berriozábal.</p>
            </div>
            <div className="rioja-benefit-card-new">
              <div className="rioja-benefit-header">
                <Compass size={22} />
                <h4>Zona habitacional</h4>
              </div>
              <p>Desarrollo rodeado de viviendas y comunidades con movimiento diario.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Break Image 2 */}
      {riojaPhotos && riojaPhotos.length > 1 && (
        <div className="rioja-image-break">
          <img src={riojaPhotos[1].url} alt="Entorno Natural Rioja" loading="lazy" />
        </div>
      )}

      {/* Perfiles de Compradores */}
      <section className="rioja-section" style={{ backgroundColor: '#fdfaf6' }}>
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Perfiles</span>
            <h2 className="rioja-title rioja-section-title">¿Para quién es Rioja?</h2>
            <p className="rioja-text-large" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Un espacio diseñado para adaptarse a diferentes visiones y planes de vida.
            </p>
          </div>

          <div className="rioja-grid-profiles">
            <div className="rioja-profile-card">
              <Users size={22} className="rioja-profile-icon" />
              <h4>Familias</h4>
              <p>Que actualmente pagan renta y desean construir un hogar propio paso a paso.</p>
            </div>
            <div className="rioja-profile-card">
              <Home size={22} className="rioja-profile-icon" />
              <h4>Constructores</h4>
              <p>Personas con el deseo de edificar su residencia a su completo gusto y ritmo.</p>
            </div>
            <div className="rioja-profile-card">
              <Sparkles size={22} className="rioja-profile-icon" />
              <h4>Jóvenes</h4>
              <p>Emprendedores y visionarios que buscan iniciar su patrimonio a edad temprana.</p>
            </div>
            <div className="rioja-profile-card">
              <User size={22} className="rioja-profile-icon" />
              <h4>Trabajadores</h4>
              <p>Con ingresos estables que prefieren invertir en tierra firme y segura.</p>
            </div>
            <div className="rioja-profile-card">
              <Compass size={22} className="rioja-profile-icon" />
              <h4>Visionarios</h4>
              <p>Quienes deciden invertir hoy en el desarrollo de la zona para el mañana.</p>
            </div>
            <div className="rioja-profile-card">
              <DollarSign size={22} className="rioja-profile-icon" />
              <h4>Inversionistas</h4>
              <p>Personas que buscan alta plusvalía resguardando su capital en terrenos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Recorrido 360° */}
      <section className="rioja-section rioja-section-360">
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Experiencia Inmersiva</span>
            <h2 className="rioja-title rioja-section-title">Explora RIOJA en 360°</h2>
            <p className="rioja-text-large" style={{ maxWidth: '700px', margin: '0 auto' }}>
              Recorre el desarrollo desde cualquier lugar. Arrastra para mirar en todas las direcciones.
            </p>
          </div>

          <div className="rioja-360-preview-grid">
            {rioja360Tour.slice(0, 6).map((scene) => (
              <button
                key={scene.id}
                className="rioja-360-preview-card"
                onClick={() => setShow360(true)}
                aria-label={`Ver ${scene.title} en 360°`}
              >
                <img src={scene.thumb} alt={scene.title} loading="lazy" />
                <div className="rioja-360-preview-overlay">
                  <Eye size={28} />
                  <span>{scene.title}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="rioja-flex-center" style={{ marginTop: '40px' }}>
            <button
              onClick={() => setShow360(true)}
              className="rioja-btn rioja-btn-primary"
              style={{ fontSize: '1.1rem', padding: '18px 40px' }}
            >
              <Eye size={22} /> Iniciar Recorrido 360°
            </button>
          </div>
        </div>
      </section>

      {show360 && (
        <Suspense fallback={
          <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Outfit, sans-serif' }}>
            Cargando recorrido...
          </div>
        }>
          <Tour360 onClose={() => setShow360(false)} />
        </Suspense>
      )}

      {/* 9.5 Galería de Fotos Profesional (Carrusel Snap Scroll Inmersivo) */}
      <section className="rioja-section rioja-section-gallery" style={{ paddingBottom: '80px' }}>
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Galería Exclusiva</span>
            <h2 className="rioja-title rioja-section-title">El Desarrollo en Detalles</h2>
            <p className="rioja-text-large" style={{ maxWidth: '700px', margin: '0 auto' }}>
              Desliza horizontalmente para explorar fotografías reales de RIOJA. Toca cualquier imagen para abrir el visor.
            </p>
          </div>
        </div>
        
        <RiojaGallery />
      </section>

      {/* 10. FAQ */}
      <section className="rioja-section" style={{ backgroundColor: 'var(--rioja-white)' }}>
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Dudas</span>
            <h2 className="rioja-title rioja-section-title">Preguntas Frecuentes</h2>
          </div>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {riojaConfig.faq.map((item, index) => (
              <div key={index} className="rioja-faq-item">
                <div 
                  className="rioja-faq-q"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {item.q}
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0)', 
                      transition: 'transform 0.3s ease' 
                    }} 
                  />
                </div>
                {openFaq === index && (
                  <div className="rioja-faq-a">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Formulario Local y Contacto */}
      <section id="contacto" className="rioja-section rioja-section-dark">
        <div className="rioja-container">
          <div className="rioja-grid-2">
            <div>
              <h2 className="rioja-title" style={{ fontSize: '3rem', color: 'var(--rioja-white)' }}>Da el primer paso</h2>
              <p className="rioja-text-large" style={{ color: 'var(--rioja-crema)', margin: '0 0 40px 0', textAlign: 'left' }}>
                Agenda tu visita y conoce personalmente el desarrollo.
              </p>
              
              <div style={{ marginBottom: '30px' }}>
                <button onClick={handleWhatsApp} className="rioja-btn rioja-btn-whatsapp" style={{ width: '100%', padding: '20px', fontSize: '1.2rem' }}>
                  <Phone size={24} /> Contactar por WhatsApp
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--rioja-gold)' }}>
                <Phone size={24} />
                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Llamadas: {riojaConfig.contact.phone}</span>
              </div>
            </div>
            
            <div className="rioja-form-container">
              <h3 className="rioja-title" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '30px' }}>Solicitar Información</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert("Mensaje enviado exitosamente. En breve un asesor te contactará."); }}>
                <div className="rioja-input-group">
                  <label className="rioja-label">Nombre completo</label>
                  <div style={{ position: 'relative' }}>
                    <User size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: '#999' }} />
                    <input type="text" className="rioja-input" placeholder="Ingresa tu nombre" style={{ paddingLeft: '45px' }} required />
                  </div>
                </div>
                
                <div className="rioja-input-group">
                  <label className="rioja-label">Teléfono / WhatsApp</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: '#999' }} />
                    <input type="tel" className="rioja-input" placeholder="Tu número de contacto" style={{ paddingLeft: '45px' }} required />
                  </div>
                </div>

                <div className="rioja-input-group">
                  <label className="rioja-label">Correo electrónico (Opcional)</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: '#999' }} />
                    <input type="email" className="rioja-input" placeholder="tucorreo@ejemplo.com" style={{ paddingLeft: '45px' }} />
                  </div>
                </div>

                <div className="rioja-input-group">
                  <label className="rioja-label">Ciudad de residencia</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: '#999' }} />
                    <input type="text" className="rioja-input" placeholder="¿De dónde nos visitas?" style={{ paddingLeft: '45px' }} required />
                  </div>
                </div>
                
                <div className="rioja-checkbox-group">
                  <input type="checkbox" id="privacidad" required style={{ marginTop: '3px' }} />
                  <label htmlFor="privacidad">
                    Acepto el aviso de privacidad y consiento el tratamiento de mis datos personales para recibir información de RIOJA.
                  </label>
                </div>
                
                <button type="submit" className="rioja-btn rioja-btn-primary" style={{ width: '100%' }}>
                  Enviar mis datos
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CTA Final */}
      <section className="rioja-section rioja-text-center">
        <div className="rioja-container">
          <h2 className="rioja-title" style={{ fontSize: '3.5rem', maxWidth: '800px', margin: '0 auto 40px' }}>
            "{riojaConfig.finalCta}"
          </h2>
          <button onClick={handleWhatsApp} className="rioja-btn rioja-btn-primary" style={{ fontSize: '1.2rem', padding: '20px 40px' }}>
            WhatsApp de Ventas
          </button>
        </div>
      </section>

      {/* 13. Footer PEC */}
      <footer className="rioja-footer">
        <div className="rioja-container">
          <div className="rioja-footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: 'var(--rioja-white)' }}>
                <ShieldCheck size={28} color="var(--rioja-gold)" />
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>PEC</span>
              </div>
              <p>Propiedades en Chiapas.</p>
              <p>Comercialización Oficial del Desarrollo Rioja.</p>
            </div>
            
            <div>
              <div className="rioja-footer-title">Contacto RIOJA</div>
              <a href={`tel:${riojaConfig.contact.phone}`} className="rioja-footer-link">Llamadas: {riojaConfig.contact.phone}</a>
              <a href={riojaConfig.contact.whatsappLink} target="_blank" rel="noreferrer" className="rioja-footer-link">WhatsApp de Ventas</a>
            </div>
            
            <div>
              <div className="rioja-footer-title">Legal</div>
              <a href="/" className="rioja-footer-link">Sitio Principal PEC</a>
              <a href="/privacidad" className="rioja-footer-link">Aviso de Privacidad</a>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', borderTop: '1px solid #333', paddingTop: '30px', marginTop: '20px' }}>
            &copy; {new Date().getFullYear()} Rioja. Todos los derechos reservados.
          </div>
        </div>
      </footer>
      {/* Floating WhatsApp Button */}
      <a 
        href={riojaConfig.contact.whatsappLink} 
        target="_blank" 
        rel="noreferrer" 
        className="rioja-whatsapp-floating"
        aria-label="Contactar por WhatsApp"
      >
        <Phone size={24} />
      </a>
    </div>
  );
}

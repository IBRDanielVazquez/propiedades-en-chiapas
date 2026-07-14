import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Phone, ChevronDown, ShieldCheck, Eye, DollarSign, Calendar, Layers, Home, Sparkles, Compass, Users, User } from 'lucide-react';
import { riojaConfig } from './content/rioja.config';
import { riojaPhotos } from './content/rioja-fotos.config';
import RiojaGallery from './components/RiojaGallery';
import './styles/rioja.css';

export default function RiojaLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSection, setActiveSection] = useState('inicio');

  // Hook para auto-scrollear de forma suave a las secciones con hash (ej: /rioja#financiamiento)
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(id);
        }
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'financiamiento', '360', 'galeria', 'informacion'];
      const scrollPos = window.scrollY + 250;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsApp = () => {
    window.open(riojaConfig.contact.whatsappLink, '_blank');
  };

  const handleWhatsAppFinancing = () => {
    window.open("https://wa.link/02846w?text=Hola,%20quiero%20conocer%20el%20plan%20de%20financiamiento%20de%20RIOJA%20con%20enganche%20de%20$3,000%20y%20pagos%20de%20$1,000%20quincenales.", '_blank');
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="rioja-wrapper">
      <Helmet>
        <title>RIOJA | Terrenos en Berriozábal con Escritura Pública</title>
        <meta name="description" content="Conoce RIOJA, un desarrollo ubicado en Berriozábal con terrenos de 200 m², escritura pública, financiamiento accesible y recorrido virtual 360°." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_MX" />
        <meta property="og:url" content="https://www.propiedadesenchiapas.com/rioja/" />
        <meta property="og:title" content="RIOJA | Terrenos en Berriozábal con Escritura Pública" />
        <meta property="og:description" content="Descubre RIOJA, un desarrollo con lotes de 200 m², financiamiento accesible y recorrido virtual 360° para conocer el proyecto como si estuvieras ahí." />
        <meta property="og:image" content="https://www.propiedadesenchiapas.com/rioja/og-image-1200x630.jpg" />
        <meta property="og:image:secure_url" content="https://www.propiedadesenchiapas.com/rioja/og-image-1200x630.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="RIOJA Terrenos en Berriozábal" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.propiedadesenchiapas.com/rioja/" />
        <meta name="twitter:title" content="RIOJA | Terrenos en Berriozábal con Escritura Pública" />
        <meta name="twitter:description" content="Descubre RIOJA, un desarrollo con lotes de 200 m², financiamiento accesible y recorrido virtual 360°." />
        <meta name="twitter:image" content="https://www.propiedadesenchiapas.com/rioja/og-image-1200x630.jpg" />

        <link rel="canonical" href="https://www.propiedadesenchiapas.com/rioja/" />

        {/* Schema structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgency",
            "name": "RIOJA Desarrollo Inmobiliario",
            "image": "https://www.propiedadesenchiapas.com/rioja/og-image-1200x630.jpg",
            "@id": "https://www.propiedadesenchiapas.com/rioja/#development",
            "url": "https://www.propiedadesenchiapas.com/rioja/",
            "telephone": "9611000055",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Berriozábal",
              "addressRegion": "Chiapas",
              "addressCountry": "MX"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 16.767086,
              "longitude": -93.245738
            },
            "description": "Desarrollo inmobiliario premium de lotes campestres de 200 m2 con financiamiento directo y facilidades de pago en Berriozábal, Chiapas.",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "MXN",
              "lowPrice": "228000",
              "highPrice": "228000",
              "offerCount": "10",
              "price": "228000"
            }
          })}
        </script>
      </Helmet>

      {/* 1. SECCIÓN INICIO (Identificador: inicio) */}
      <div id="inicio">
        {/* Hero Premium (Rediseñado - Luminoso, Campestre y Editorial) */}
        <header className="rioja-hero-new" style={{ backgroundImage: `url(${riojaPhotos[0].url})` }}>
          <div className="rioja-hero-new-overlay"></div>
          <div className="rioja-hero-new-content rioja-container">
            <span className="rioja-hero-new-tag">Terrenos en Berriozábal</span>
            <h1 className="rioja-hero-new-title">{riojaConfig.name}</h1>
            <p className="rioja-hero-new-subtitle">Comienza hoy el patrimonio que será tuyo para siempre.</p>
            <div className="rioja-hero-new-badge">Desde $1,000 quincenales</div>
            
            <div className="rioja-hero-new-actions">
              <button onClick={() => scrollToSection('financiamiento')} className="rioja-btn-hero-primary">
                Ver Financiamiento
              </button>
              <button onClick={() => navigate('/rioja/360')} className="rioja-btn-hero-secondary">
                Explorar en 360°
              </button>
            </div>
          </div>
        </header>

        {/* Resumen de 4 Características Principales */}
        <section className="rioja-section rioja-section-dark" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
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
                <Sparkles className="rioja-feature-icon" />
                <div>
                  <span className="rioja-feat-lbl">Construcción</span>
                  <span className="rioja-feat-val">Construye a tu ritmo</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="rioja-visual-divider" />

      {/* 2. SECCIÓN FINANCIAMIENTO (Identificador: financiamiento) */}
      <section id="financiamiento" className="rioja-section" style={{ paddingTop: '80px' }}>
        <div className="rioja-container rioja-text-center">
          <span className="rioja-section-label">Patrimonio Inmediato</span>
          <h2 className="rioja-title rioja-section-title">Deja de pagar renta</h2>
          <p className="rioja-text-large" style={{ marginBottom: '40px' }}>
            {riojaConfig.concept}
          </p>

          <div className="rioja-hero-finance-card" style={{ margin: '0 auto 40px' }}>
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
              <button onClick={handleWhatsAppFinancing} className="rioja-btn rioja-btn-whatsapp-new" style={{ width: '100%' }}>
                <Phone size={18} /> Solicitar Financiamiento
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="rioja-visual-divider" />

      {/* 3. SECCIÓN RECORRIDO 360° (Identificador: 360) */}
      <section id="360" className="rioja-section rioja-section-360" style={{ paddingTop: '80px' }}>
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Experiencia Inmersiva</span>
            <h2 className="rioja-title rioja-section-title">Explora RIOJA en 360°</h2>
          </div>

          <div 
            className="rioja-360-visual-portal" 
            style={{ backgroundImage: `url('/rioja/360/rioja-360-01.webp')` }}
            onClick={() => navigate('/rioja/360')}
          >
            <div className="rioja-360-visual-overlay"></div>
            <div className="rioja-360-visual-content">
              <div className="rioja-360-visual-icon">
                <Eye size={30} />
              </div>
              <h3>Recorre RIOJA como si estuvieras aquí</h3>
              <p>Presiona el botón de abajo para iniciar la visita interactiva por todo el desarrollo.</p>
              <button 
                onClick={(e) => { e.stopPropagation(); navigate('/rioja/360'); }}
                className="rioja-btn rioja-btn-primary"
                style={{ width: 'auto', padding: '16px 36px', fontSize: '1rem', fontWeight: 600 }}
              >
                INICIAR RECORRIDO 360°
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="rioja-visual-divider" />

      {/* 4. SECCIÓN GALERÍA (Identificador: galeria) */}
      <section id="galeria" className="rioja-section rioja-section-gallery" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
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

      <div className="rioja-visual-divider" />

      {/* 5. SECCIÓN INFORMACIÓN (Identificador: informacion) */}
      <div id="informacion" style={{ paddingTop: '40px' }}>
        {/* Ubicación y Mapa */}
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

        <div className="rioja-visual-divider" />

        {/* Beneficios */}
        <section className="rioja-section rioja-section-benefits" style={{ backgroundColor: '#fcfaf6' }}>
          <div className="rioja-container">
            <div className="rioja-text-center rioja-mb-40">
              <span className="rioja-section-label">Ventajas</span>
              <h2 className="rioja-title rioja-section-title">¿Por qué invertir en RIOJA?</h2>
            </div>

            <div className="rioja-grid-benefits-new">
              <div className="rioja-benefit-card-new">
                <div className="rioja-benefit-icon-wrapper">
                  <Compass size={24} />
                </div>
                <h4 className="rioja-benefit-title">Alta plusvalía</h4>
                <p>Zona de acelerado crecimiento y desarrollo de valor en Berriozábal.</p>
              </div>
              <div className="rioja-benefit-card-new">
                <div className="rioja-benefit-icon-wrapper">
                  <Sparkles size={24} />
                </div>
                <h4 className="rioja-benefit-title">Entorno campestre</h4>
                <p>Aire limpio, vegetación abundante y microclima fresco de la región.</p>
              </div>
              <div className="rioja-benefit-card-new">
                <div className="rioja-benefit-icon-wrapper">
                  <MapPin size={24} />
                </div>
                <h4 className="rioja-benefit-title">Fácil conectividad</h4>
                <p>Acceso vial rápido a la carretera principal y minutos del centro urbano.</p>
              </div>
              <div className="rioja-benefit-card-new">
                <div className="rioja-benefit-icon-wrapper">
                  <Home size={24} />
                </div>
                <h4 className="rioja-benefit-title">Patrimonio heredable</h4>
                <p>Propiedad privada libre de gravamen lista para asegurar tu futuro.</p>
              </div>
              <div className="rioja-benefit-card-new">
                <div className="rioja-benefit-icon-wrapper">
                  <Users size={24} />
                </div>
                <h4 className="rioja-benefit-title">Zona habitada</h4>
                <p>Construcciones activas y familias viviendo permanentemente en los alrededores.</p>
              </div>
              <div className="rioja-benefit-card-new">
                <div className="rioja-benefit-icon-wrapper">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="rioja-benefit-title">Desarrollo seguro</h4>
                <p>Lotes delimitados listos para planificar y construir tu proyecto de vida.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="rioja-visual-divider" />

        {/* Perfiles de Comprador */}
        <section className="rioja-section" style={{ backgroundColor: '#fdfaf6' }}>
          <div className="rioja-container">
            <div className="rioja-text-center rioja-mb-40">
              <span className="rioja-section-label">Perfiles</span>
              <h2 className="rioja-title rioja-section-title">¿Para quién es Rioja?</h2>
            </div>

            <div className="rioja-grid-profiles">
              <div className="rioja-profile-card">
                <Users size={20} className="rioja-profile-icon" />
                <h4>Familias</h4>
                <p>Desean construir un hogar propio paso a paso.</p>
              </div>
              <div className="rioja-profile-card">
                <Home size={20} className="rioja-profile-icon" />
                <h4>Constructores</h4>
                <p>Buscan edificar su casa a su completo gusto.</p>
              </div>
              <div className="rioja-profile-card">
                <Sparkles size={20} className="rioja-profile-icon" />
                <h4>Jóvenes</h4>
                <p>Visionarios iniciando su patrimonio.</p>
              </div>
              <div className="rioja-profile-card">
                <User size={20} className="rioja-profile-icon" />
                <h4>Trabajadores</h4>
                <p>Invierten en tierra firme y de alta plusvalía.</p>
              </div>
              <div className="rioja-profile-card">
                <Compass size={20} className="rioja-profile-icon" />
                <h4>Visionarios</h4>
                <p>Aprovechan la plusvalía de la zona.</p>
              </div>
              <div className="rioja-profile-card">
                <DollarSign size={20} className="rioja-profile-icon" />
                <h4>Inversionistas</h4>
                <p>Resguardan capital en bienes raíces seguros.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="rioja-visual-divider" />

        {/* FAQ */}
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

        {/* Visual Divider */}
        <div className="rioja-visual-divider" />

        {/* 11. Contacto Rápido Directo (Sin Formulario) */}
        <section id="contacto" className="rioja-section rioja-section-dark" style={{ margin: '40px 0 0 0' }}>
          <div className="rioja-container rioja-text-center">
            <h2 className="rioja-title" style={{ fontSize: '2.6rem', color: 'var(--rioja-white)', marginBottom: '15px' }}>Da el primer paso</h2>
            <p className="rioja-text-large" style={{ color: 'var(--rioja-crema)', margin: '0 auto 35px', maxWidth: '600px' }}>
              Agenda tu visita guiada al desarrollo o habla directamente con uno de nuestros asesores oficiales.
            </p>
            
            <div className="rioja-hero-actions" style={{ justifyContent: 'center' }}>
              <button onClick={handleWhatsApp} className="rioja-btn rioja-btn-whatsapp-new" style={{ width: '100%', maxWidth: '380px', padding: '16px 36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Phone size={18} /> Contactar por WhatsApp
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* iOS-Style Floating Dock Navigation */}
      <nav className="rioja-ios-dock">
        <button 
          className={`rioja-dock-item ${activeSection === 'inicio' ? 'active' : ''}`}
          onClick={() => scrollToSection('inicio')}
          aria-label="Inicio"
        >
          <Home size={20} />
          <span>Inicio</span>
        </button>
        <button 
          className={`rioja-dock-item ${activeSection === 'financiamiento' ? 'active' : ''}`}
          onClick={() => scrollToSection('financiamiento')}
          aria-label="Financiamiento"
        >
          <DollarSign size={20} />
          <span>Precio</span>
        </button>
        <button 
          className={`rioja-dock-item ${activeSection === '360' ? 'active' : ''}`}
          onClick={() => navigate('/rioja/360')}
          aria-label="360°"
        >
          <Eye size={20} />
          <span>360°</span>
        </button>
        <button 
          className={`rioja-dock-item ${activeSection === 'galeria' ? 'active' : ''}`}
          onClick={() => scrollToSection('galeria')}
          aria-label="Galería"
        >
          <Layers size={20} />
          <span>Galería</span>
        </button>
        <button 
          className={`rioja-dock-item ${activeSection === 'informacion' ? 'active' : ''}`}
          onClick={() => scrollToSection('informacion')}
          aria-label="Ubicación"
        >
          <MapPin size={20} />
          <span>Ubicación</span>
        </button>
      </nav>
    </div>
  );
}

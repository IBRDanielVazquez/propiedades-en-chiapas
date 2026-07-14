import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MapPin, Phone, ChevronDown, ShieldCheck, Eye, DollarSign, Calendar, Layers, Home, Sparkles, Compass, Users, User, Wallet, Hammer 
} from 'lucide-react';
import { riojaConfig } from './content/rioja.config';
import { riojaPhotos } from './content/rioja-fotos.config';
import RiojaGallery from './components/RiojaGallery';
import './styles/rioja.css';

export default function RiojaLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSection, setActiveSection] = useState('inicio');

  // Auto-scroll a secciones según hash de la URL
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

      {/* 1. HERO PRINCIPAL (85-95 svh, Comercial y de Alto Impacto) */}
      <div id="inicio">
        <header className="rioja-hero-new" style={{ backgroundImage: `url(${riojaPhotos[0].url})` }}>
          <div className="rioja-hero-new-overlay"></div>
          <div className="rioja-hero-new-content rioja-container">
            <span className="rioja-hero-new-tag">Terrenos cerca de Tuxtla</span>
            
            <h1 className="rioja-hero-new-title">
              TU TERRENO PROPIO POR SOLO $1,000 QUINCENALES
            </h1>
            
            <p className="rioja-hero-new-subtitle">
              Lotes de 10 × 20 metros con Escritura Pública, zona habitada y libertad para construir a tu ritmo.
            </p>

            {/* Tarjeta Flotante Compacta de Pago visible inmediatamente */}
            <div className="rioja-hero-float-card">
              $1,000
              <span>Quincenales</span>
            </div>
            
            <div className="rioja-hero-new-actions">
              <button onClick={() => scrollToSection('financiamiento')} className="rioja-btn-hero-primary">
                QUIERO CONOCER RIOJA
              </button>
              <button onClick={() => scrollToSection('informacion')} className="rioja-btn-hero-secondary">
                VER UBICACIÓN
              </button>
            </div>
          </div>

          {/* Mouse scroll indicator */}
          <div className="rioja-scroll-indicator">
            <span>Scroll</span>
            <div className="rioja-scroll-indicator-mouse">
              <div className="rioja-scroll-indicator-wheel"></div>
            </div>
          </div>
        </header>

        {/* 2. BANDA COMERCIAL INMEDIATA (Alto Contraste Amarillo) */}
        <section className="rioja-info-band">
          <div className="rioja-container">
            <div className="rioja-info-band-grid">
              <div className="rioja-info-band-item">
                200 m²
                <span>Superficie Total</span>
              </div>
              <div className="rioja-info-band-item">
                10 × 20 m
                <span>Medidas de Lote</span>
              </div>
              <div className="rioja-info-band-item">
                ESCRITURA PÚBLICA
                <span>Seguridad Jurídica</span>
              </div>
              <div className="rioja-info-band-item">
                PUEDES CONSTRUIR
                <span>Libertad de Obra</span>
              </div>
              <div className="rioja-info-band-item">
                CERCA DE TUXTLA
                <span>Ubicación Clave</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. BENEFICIOS RÁPIDOS (Tarjetas Blancas con Borde Fuerte) */}
        <section className="rioja-section rioja-section-crema">
          <div className="rioja-container">
            <div className="rioja-text-center rioja-mb-40">
              <span className="rioja-section-label">El Desarrollo</span>
              <h2 className="rioja-title rioja-section-title">TODO LO QUE NECESITAS PARA COMENZAR TU PATRIMONIO</h2>
            </div>
            
            <div className="rioja-grid-features">
              <div className="rioja-feature-card-new">
                <ShieldCheck className="rioja-feature-icon" size={24} />
                <h3 className="rioja-feature-title-new">Escritura Pública</h3>
                <p className="rioja-feature-desc-new">Seguridad legal completa para proteger tu inversión.</p>
              </div>
              <div className="rioja-feature-card-new">
                <DollarSign className="rioja-feature-icon" size={24} />
                <h3 className="rioja-feature-title-new">Pagos accesibles</h3>
                <p className="rioja-feature-desc-new">Mensualidades quincenales cómodas y enganche mínimo.</p>
              </div>
              <div className="rioja-feature-card-new">
                <Hammer className="rioja-feature-icon" size={24} />
                <h3 className="rioja-feature-title-new">Construcción permitida</h3>
                <p className="rioja-feature-desc-new">Puedes comenzar a edificar cuando tú lo decidas.</p>
              </div>
              <div className="rioja-feature-card-new">
                <Home className="rioja-feature-icon" size={24} />
                <h3 className="rioja-feature-title-new">Zona con viviendas cercanas</h3>
                <p className="rioja-feature-desc-new">Desarrollo con vida y construcciones vecinas habitadas.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="rioja-visual-divider" />

      {/* 4. FILOSOFÍA DE COMPRA (Línea de Progreso con Números Amarillos Gigantes) */}
      <section className="rioja-section rioja-section-dark">
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Hitos de Compra</span>
            <h2 className="rioja-title rioja-section-title">EL CAMINO HACIA TU PROPIO PATRIMONIO</h2>
          </div>
          
          <div className="rioja-story-progression">
            <div className="rioja-progression-step">
              <div className="rioja-progression-num">01</div>
              <h4>DEJA DE RENTAR</h4>
              <p>Convierte el dinero de la renta en una inversión que sí construye futuro.</p>
            </div>
            <div className="rioja-progression-step">
              <div className="rioja-progression-num">02</div>
              <h4>COMPRA CON FACILIDADES</h4>
              <p>Aparta con $1,000 y comienza con un enganche de solo $3,000.</p>
            </div>
            <div className="rioja-progression-step">
              <div className="rioja-progression-num">03</div>
              <h4>CONSTRUYE A TU RITMO</h4>
              <p>Diseña y levanta tu hogar cuando tú decidas.</p>
            </div>
            <div className="rioja-progression-step">
              <div className="rioja-progression-num">04</div>
              <h4>ASEGURA TU LEGADO</h4>
              <p>Recibe seguridad jurídica mediante Escritura Pública.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="rioja-visual-divider" />

      {/* 5. PLAN DE FINANCIAMIENTO (Gran Tarjeta Central Inmobiliaria) */}
      <section id="financiamiento" className="rioja-section">
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Planes de Pago</span>
            <h2 className="rioja-title rioja-section-title">UN PLAN REAL PARA PERSONAS REALES</h2>
            <p className="rioja-text-large">
              Comienza con poco y construye algo que será tuyo para siempre.
            </p>
          </div>

          <div className="rioja-finance-large-card">
            <span className="rioja-finance-price-lbl">Inversión Quincenal</span>
            <h3 className="rioja-finance-price-huge">
              $1,000 <span>MXN</span>
            </h3>
            <span className="rioja-finance-sub-huge">CADA QUINCENA</span>

            <div className="rioja-finance-clean-grid">
              <div className="rioja-finance-clean-item">
                <span className="rioja-finance-clean-lbl">Precio Financiado</span>
                <div className="rioja-finance-clean-val">$228,000 MXN</div>
              </div>
              <div className="rioja-finance-clean-item">
                <span className="rioja-finance-clean-lbl">Enganche Requerido</span>
                <div className="rioja-finance-clean-val">$3,000 MXN</div>
              </div>
              <div className="rioja-finance-clean-item">
                <span className="rioja-finance-clean-lbl">Apartado de Lote</span>
                <div className="rioja-finance-clean-val">$1,000 MXN</div>
              </div>
              <div className="rioja-finance-clean-item">
                <span className="rioja-finance-clean-lbl">Superficie Terreno</span>
                <div className="rioja-finance-clean-val">200 m² (10x20m)</div>
              </div>
            </div>

            <button onClick={handleWhatsAppFinancing} className="rioja-btn-hero-primary">
              SOLICITAR INFORMACIÓN
            </button>
            <button onClick={handleWhatsApp} className="rioja-btn-hero-secondary">
              HABLAR CON UN ASESOR
            </button>
          </div>
        </div>
      </section>

      <div className="rioja-visual-divider" />

      {/* 6. RECORRIDO VIRTUAL 360° (Cinematográfico, Portada Inmersiva) */}
      <section id="360" className="rioja-section rioja-section-crema">
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Visita Remota</span>
            <h2 className="rioja-title rioja-section-title">ENTRA A RIOJA ANTES DE VISITARLO</h2>
          </div>

          <div 
            className="rioja-360-visual-portal" 
            style={{ backgroundImage: `url('/rioja/360/rioja-360-01.webp')` }}
            onClick={() => navigate('/rioja/360')}
          >
            <div className="rioja-360-visual-overlay"></div>
            <div className="rioja-360-visual-content">
              <span className="rioja-360-badge">RECORRIDO VIRTUAL 360°</span>
              <div className="rioja-360-visual-icon">
                <Eye size={36} />
              </div>
              <h3>Entra a RIOJA antes de visitarlo</h3>
              <p>Recorre el desarrollo, observa el entorno, conoce sus accesos y descubre dónde puede comenzar tu próximo patrimonio.</p>
              
              <div className="rioja-360-buttons">
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/rioja/360'); }}
                  className="rioja-btn-hero-primary"
                >
                  INICIAR RECORRIDO 360°
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); scrollToSection('galeria'); }}
                  className="rioja-btn-hero-secondary"
                >
                  VER GALERÍA
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="rioja-visual-divider" />

      {/* 7. GALERÍA REAL (Fondo Crema) */}
      <section id="galeria" className="rioja-section rioja-section-gallery">
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Galería Exclusiva</span>
            <h2 className="rioja-title rioja-section-title">CONOCE RIOJA EN DETALLE</h2>
            <p className="rioja-text-large">
              Imágenes reales del desarrollo, su entorno y las construcciones cercanas.
            </p>
          </div>
        </div>
        
        <RiojaGallery />
      </section>

      <div className="rioja-visual-divider" />

      {/* 8. DIFERENCIADOR (2 Columnas, Borde Lateral Verde Grueso) */}
      <section className="rioja-section">
        <div className="rioja-container">
          <div className="rioja-grid-2">
            <div className="rioja-dif-img-wrapper">
              <img src={riojaPhotos[1].url} alt="Casas en Berriozábal" loading="lazy" />
            </div>
            
            <div className="rioja-diferenciador-card">
              <span className="rioja-dif-label">MÁS QUE UN TERRENO</span>
              <h2>UNA ZONA DONDE YA PUEDES CONSTRUIR</h2>
              <p>
                RIOJA no se encuentra aislado. En sus alrededores ya existen viviendas, familias y movimiento diario. Esto te permite invertir con mayor confianza y comenzar a construir cuando lo decidas.
              </p>
              
              <div className="rioja-dif-highlights">
                <div className="rioja-dif-item">
                  <ShieldCheck size={20} />
                  <span>Construcciones cercanas</span>
                </div>
                <div className="rioja-dif-item">
                  <Home size={20} />
                  <span>Zona habitada</span>
                </div>
                <div className="rioja-dif-item">
                  <Sparkles size={20} />
                  <span>Libertad para construir</span>
                </div>
                <div className="rioja-dif-item">
                  <Compass size={20} />
                  <span>Crecimiento constante</span>
                </div>
                <div className="rioja-dif-item">
                  <MapPin size={20} />
                  <span>Cercanía con Tuxtla</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="rioja-visual-divider" />

      {/* 9. UBICACIÓN (Fondo Verde Oscuro con Mapa de 340px alto min) */}
      <section id="informacion" className="rioja-section rioja-section-dark">
        <div className="rioja-container">
          <div className="rioja-grid-2 rioja-align-stretch">
            <div className="rioja-flex-column">
              <span className="rioja-section-label">Geolocalización</span>
              <h2 className="rioja-title" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
                CERCA DE TUXTLA, CERCA DE TODO LO QUE IMPORTA
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', marginBottom: '30px', lineHeight: '1.5' }}>
                Ubicado estratégicamente en Berriozábal, rodeado de construcciones activas y conectividad vial rápida para que puedas trasladarte a Tuxtla Gutiérrez en minutos.
              </p>

              <div className="rioja-location-details-card">
                <div className="rioja-loc-item">
                  <MapPin size={20} />
                  <span><strong>Municipio</strong>Berriozábal, Chiapas</span>
                </div>
                <div className="rioja-loc-item">
                  <Compass size={20} />
                  <span><strong>Zona de desarrollo</strong>Crecimiento acelerado</span>
                </div>
                <div className="rioja-loc-item">
                  <Home size={20} />
                  <span><strong>Infraestructura</strong>Casas construidas alrededor</span>
                </div>
                <div className="rioja-loc-item">
                  <ShieldCheck size={20} />
                  <span><strong>Servicios</strong>Acceso listo para conectar</span>
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <a href={riojaConfig.location.mapUrl} target="_blank" rel="noreferrer" className="rioja-btn-hero-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} /> ABRIR EN GOOGLE MAPS
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

      {/* 10. VENTAJAS (6 Tarjetas Sólidas con Fondos Alternados) */}
      <section className="rioja-section">
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Inversión Segura</span>
            <h2 className="rioja-title rioja-section-title">¿POR QUÉ INVERTIR EN RIOJA?</h2>
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
              <h4 className="rioja-benefit-title">Libertad para construir</h4>
              <p>Lotes delimitados listos para planificar y construir tu proyecto de vida.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="rioja-visual-divider" />

      {/* 11. PERFILES DE COMPRADOR (3 Tarjetas Grandes con Imagen) */}
      <section className="rioja-section rioja-section-crema">
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Perfiles</span>
            <h2 className="rioja-title rioja-section-title">¿Para quién es Rioja?</h2>
          </div>

          <div className="rioja-grid-profiles">
            <div className="rioja-profile-card">
              <div className="rioja-profile-img-wrapper">
                <img src={riojaPhotos[5].url} alt="Familias" loading="lazy" />
              </div>
              <div className="rioja-profile-body">
                <h4>FAMILIAS</h4>
                <p>Para quienes desean dejar de rentar y construir un hogar propio paso a paso en un ambiente campestre y seguro.</p>
                <button onClick={handleWhatsApp} className="rioja-btn-profile-short">QUIERO MÁS INFO</button>
              </div>
            </div>
            
            <div className="rioja-profile-card">
              <div className="rioja-profile-img-wrapper">
                <img src={riojaPhotos[6].url} alt="Jóvenes y Trabajadores" loading="lazy" />
              </div>
              <div className="rioja-profile-body">
                <h4>JÓVENES Y TRABAJADORES</h4>
                <p>Para quienes quieren comenzar a consolidar su patrimonio con mensualidades quincenales cómodas y enganche bajo.</p>
                <button onClick={handleWhatsApp} className="rioja-btn-profile-short">QUIERO MÁS INFO</button>
              </div>
            </div>

            <div className="rioja-profile-card">
              <div className="rioja-profile-img-wrapper">
                <img src={riojaPhotos[7].url} alt="Inversionistas" loading="lazy" />
              </div>
              <div className="rioja-profile-body">
                <h4>INVERSIONISTAS</h4>
                <p>Para quienes buscan resguardar y multiplicar su capital a través de tierra firme de alta plusvalía garantizada.</p>
                <button onClick={handleWhatsApp} className="rioja-btn-profile-short">QUIERO MÁS INFO</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="rioja-visual-divider" />

      {/* 12. PREGUNTAS FRECUENTES (Fondo Claro y Acordeones Fáciles de Tocar) */}
      <section className="rioja-section">
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label">Dudas</span>
            <h2 className="rioja-title rioja-section-title">Preguntas Frecuentes</h2>
          </div>
          
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div className="rioja-faq-item">
              <div className="rioja-faq-q" onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}>
                ¿Dónde está ubicado?
                <ChevronDown size={22} style={{ transform: openFaq === 0 ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </div>
              {openFaq === 0 && (
                <div className="rioja-faq-a">
                  En el municipio de Berriozábal, Chiapas, en una zona campestre con crecimiento constante y construcciones habitadas alrededor.
                </div>
              )}
            </div>

            <div className="rioja-faq-item">
              <div className="rioja-faq-q" onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}>
                ¿Cuenta con Escritura Pública?
                <ChevronDown size={22} style={{ transform: openFaq === 1 ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </div>
              {openFaq === 1 && (
                <div className="rioja-faq-a">
                  Sí, todos los terrenos se entregan con Escritura Pública debidamente registrada, otorgándote seguridad jurídica patrimonial total.
                </div>
              )}
            </div>

            <div className="rioja-faq-item">
              <div className="rioja-faq-q" onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}>
                ¿Puedo construir de inmediato?
                <ChevronDown size={22} style={{ transform: openFaq === 2 ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </div>
              {openFaq === 2 && (
                <div className="rioja-faq-a">
                  Totalmente. Al adquirir tu lote puedes planificar e iniciar la obra cuando lo desees, ya hay vida y construcciones activas a los alrededores.
                </div>
              )}
            </div>

            <div className="rioja-faq-item">
              <div className="rioja-faq-q" onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}>
                ¿Cuáles son las medidas?
                <ChevronDown size={22} style={{ transform: openFaq === 3 ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </div>
              {openFaq === 3 && (
                <div className="rioja-faq-a">
                  Lotes estándar de 10 metros de frente por 20 metros de fondo, equivalentes a una superficie total de 200 m².
                </div>
              )}
            </div>

            <div className="rioja-faq-item">
              <div className="rioja-faq-q" onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}>
                ¿Cuánto debo dar de enganche?
                <ChevronDown size={22} style={{ transform: openFaq === 4 ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </div>
              {openFaq === 4 && (
                <div className="rioja-faq-a">
                  El enganche es sumamente accesible, de únicamente $3,000 pesos mexicanos.
                </div>
              )}
            </div>

            <div className="rioja-faq-item">
              <div className="rioja-faq-q" onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}>
                ¿Con cuánto puedo apartar?
                <ChevronDown size={22} style={{ transform: openFaq === 5 ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </div>
              {openFaq === 5 && (
                <div className="rioja-faq-a">
                  Puedes asegurar la ubicación de tu lote campestre con un apartado de solo $1,000 pesos.
                </div>
              )}
            </div>

            <div className="rioja-faq-item">
              <div className="rioja-faq-q" onClick={() => setOpenFaq(openFaq === 6 ? null : 6)}>
                ¿Cuál es el precio financiado?
                <ChevronDown size={22} style={{ transform: openFaq === 6 ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </div>
              {openFaq === 6 && (
                <div className="rioja-faq-a">
                  El precio de adquisición financiado es de $228,000 pesos mexicanos, con abonos cómodos de $1,000 quincenales.
                </div>
              )}
            </div>

            <div className="rioja-faq-item">
              <div className="rioja-faq-q" onClick={() => setOpenFaq(openFaq === 7 ? null : 7)}>
                ¿Cómo puedo agendar una visita?
                <ChevronDown size={22} style={{ transform: openFaq === 7 ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </div>
              {openFaq === 7 && (
                <div className="rioja-faq-a">
                  Puedes agendar una visita guiada directamente haciendo clic en el botón de WhatsApp del menú inferior o llamándonos al 961 100 0055.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Divider */}
      <div className="rioja-visual-divider" />

      {/* 13. CIERRE COMERCIAL (Alto Impacto con Imagen & Datos Resumen) */}
      <section id="contacto" className="rioja-section rioja-section-dark" style={{ backgroundImage: `url(${riojaPhotos[0].url})` }}>
        <div className="rioja-container rioja-text-center">
          <h2>COMIENZA HOY EL PATRIMONIO QUE SERÁ TUYO PARA SIEMPRE</h2>
          
          <div className="rioja-cierre-details">
            <span className="rioja-cierre-badge">10 × 20 metros</span>
            <span className="rioja-cierre-badge">Escritura Pública</span>
            <span className="rioja-cierre-badge">$1,000 quincenales</span>
            <span className="rioja-cierre-badge">Apartado: $1,000</span>
            <span className="rioja-cierre-badge">Enganche: $3,000</span>
            <span className="rioja-cierre-badge">Financiado: $228,000</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={handleWhatsApp} className="rioja-btn rioja-btn-whatsapp-new">
              QUIERO AGENDAR MI VISITA
            </button>
          </div>
        </div>
      </section>

      {/* 14. MENÚ INFERIOR TIPO iOS (Barra Fija Semitransparente) */}
      <nav className="rioja-ios-dock">
        <button 
          className={`rioja-dock-item ${activeSection === 'inicio' ? 'active' : ''}`}
          onClick={() => scrollToSection('inicio')}
          aria-label="Inicio"
        >
          <Home size={22} />
          <span>Inicio</span>
        </button>
        <button 
          className={`rioja-dock-item ${activeSection === 'informacion' ? 'active' : ''}`}
          onClick={() => scrollToSection('informacion')}
          aria-label="Ubicación"
        >
          <MapPin size={22} />
          <span>Ubicación</span>
        </button>
        <button 
          className={`rioja-dock-item ${activeSection === 'financiamiento' ? 'active' : ''}`}
          onClick={() => scrollToSection('financiamiento')}
          aria-label="Planes"
        >
          <DollarSign size={22} />
          <span>Planes</span>
        </button>
        <button 
          className={`rioja-dock-item ${activeSection === 'galeria' ? 'active' : ''}`}
          onClick={() => scrollToSection('galeria')}
          aria-label="Galería"
        >
          <Layers size={22} />
          <span>Galería</span>
        </button>
        <button 
          className="rioja-dock-item contact-whatsapp-dock"
          onClick={handleWhatsApp}
          aria-label="WhatsApp"
        >
          <Phone size={22} />
          <span>WhatsApp</span>
        </button>
      </nav>
    </div>
  );
}

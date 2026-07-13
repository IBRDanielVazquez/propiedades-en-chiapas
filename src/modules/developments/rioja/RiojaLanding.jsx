import { useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, CheckCircle, ChevronDown, Mail, User, ShieldCheck, Eye } from 'lucide-react';
import { riojaConfig } from './content/rioja.config';
import { rioja360Tour } from './content/rioja-360.config';
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
            <div className="rioja-grid-4">
              <div className="rioja-finance-item">
                <div className="rioja-finance-label">Precio Total</div>
                <div className="rioja-finance-price">{riojaConfig.financials.totalPrice}</div>
              </div>
              <div className="rioja-finance-item">
                <div className="rioja-finance-label">Enganche</div>
                <div className="rioja-finance-value">{riojaConfig.financials.downPayment}</div>
              </div>
              <div className="rioja-finance-item">
                <div className="rioja-finance-label">Quincenal</div>
                <div className="rioja-finance-value" style={{ color: '#25D366' }}>
                  {riojaConfig.financials.biweeklyPayment}
                </div>
              </div>
              <div className="rioja-finance-item">
                <div className="rioja-finance-label">Apartado</div>
                <div className="rioja-finance-value">{riojaConfig.financials.reservation}</div>
              </div>
            </div>

            <div className="rioja-flex-center rioja-mt-40">
              <button onClick={handleWhatsApp} className="rioja-btn rioja-btn-whatsapp">
                <Phone size={20} /> Hablar por WhatsApp
              </button>
              <button onClick={scrollToContacto} className="rioja-btn rioja-btn-primary">
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

      {/* 3 & 4. Características y Beneficios */}
      <section className="rioja-section rioja-section-dark">
        <div className="rioja-container">
          <div className="rioja-text-center rioja-mb-40">
            <span className="rioja-section-label" style={{ color: 'var(--rioja-gold)' }}>El Desarrollo</span>
            <h2 className="rioja-title rioja-section-title" style={{ color: 'var(--rioja-white)' }}>Características Principales</h2>
          </div>
          
          <div className="rioja-grid-3 rioja-mb-40">
            {riojaConfig.features.map((feat, index) => (
              <div key={index} className="rioja-feature-card">
                <div className="rioja-feature-title">{feat.label}</div>
                <div className="rioja-feature-value">{feat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 & 6. Diferenciador y Ubicación */}
      <section className="rioja-section">
        <div className="rioja-container">
          <div className="rioja-grid-2">
            <div>
              <span className="rioja-section-label" style={{ textAlign: 'left' }}>Diferenciador</span>
              <h2 className="rioja-title" style={{ fontSize: '2.5rem' }}>{riojaConfig.differentiator.title}</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--rioja-text-light)', marginBottom: '30px' }}>
                {riojaConfig.differentiator.text}
              </p>
              <h3 className="rioja-title" style={{ fontSize: '1.8rem', marginTop: '40px' }}>Ubicación</h3>
              <p style={{ fontSize: '1.1rem', color: 'var(--rioja-text-light)', marginBottom: '30px' }}>
                {riojaConfig.location.description}
              </p>
              <a href={riojaConfig.location.mapUrl} target="_blank" rel="noreferrer" className="rioja-btn rioja-btn-outline">
                <MapPin size={20} /> Abrir en Google Maps
              </a>
            </div>
            
            <div className="rioja-map-container">
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
      </section>

      {/* 7 & 8. Para quién es y Beneficios */}
      <section className="rioja-section" style={{ backgroundColor: '#f5f0e6' }}>
        <div className="rioja-container">
          <div className="rioja-grid-2">
            <div>
              <span className="rioja-section-label" style={{ textAlign: 'left' }}>Beneficios</span>
              <h2 className="rioja-title" style={{ fontSize: '2.5rem', marginBottom: '30px' }}>¿Por qué invertir aquí?</h2>
              <div>
                {riojaConfig.benefits.map((benefit, index) => (
                  <div key={index} className="rioja-benefit-item">
                    <CheckCircle className="rioja-icon" size={24} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <span className="rioja-section-label" style={{ textAlign: 'left' }}>Perfiles</span>
              <h2 className="rioja-title" style={{ fontSize: '2.5rem', marginBottom: '30px' }}>¿Para quién es Rioja?</h2>
              <div className="rioja-grid-2" style={{ gap: '20px' }}>
                {riojaConfig.targetAudience.map((target, index) => (
                  <div key={index} className="rioja-target-card">
                    <div className="rioja-target-title">{target.title}</div>
                    <div className="rioja-target-desc">{target.desc}</div>
                  </div>
                ))}
              </div>
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
          <button onClick={scrollToContacto} className="rioja-btn rioja-btn-primary" style={{ fontSize: '1.2rem', padding: '20px 40px' }}>
            Agenda tu visita hoy
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
    </div>
  );
}

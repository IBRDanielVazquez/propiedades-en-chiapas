import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, CalendarCheck, Compass, FileCheck2, House, Info, MapPin, Map, MessageCircle, Ruler, X } from 'lucide-react';
import FormularioAgenda from './FormularioAgenda';
import GaleriaCascadas from './GaleriaCascadas';
import { dispararEvento } from '../../../lib/tracking';
import './cascadas.css';

const PHONE = '529612466204';
const messages = {
  general: 'Hola, vi Cascadas del Sur. Quiero información sobre los terrenos y las condiciones vigentes.',
  price: 'Hola, vi la opción de 200 m² de Cascadas del Sur. ¿Me confirman el precio y las condiciones vigentes?',
  plan: 'Hola, quiero conocer el Master Plan y las ubicaciones disponibles en Cascadas del Sur.',
  location: 'Hola, ¿me comparten la ubicación para conocer Cascadas del Sur?',
  amenities: 'Hola, quisiera saber qué amenidades de Cascadas del Sur están disponibles actualmente.',
  visit: 'Hola, quiero agendar una visita a Cascadas del Sur. ¿Qué horarios tienen disponibles?',
};

const nav = [
  ['inicio', 'Inicio', House],
  ['plano', 'Plano', Map],
  ['explorar', 'Explorar', Compass],
  ['ubicacion', 'Ubicación', MapPin],
  ['informacion', 'Información', Info],
];

function track(name, detail = {}) {
  dispararEvento(name, detail);
}

function WhatsApp({ intent, children, className = '' }) {
  return (
    <a
      className={className}
      href={`https://wa.me/${PHONE}?text=${encodeURIComponent(messages[intent])}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => { track('whatsapp_click', { intent }); dispararEvento('Contact', { canal: 'whatsapp', intent }); }}
    >
      {children}
    </a>
  );
}

function SectionHeading({ eyebrow, title, children }) {
  return <div className="cds-section-heading"><span className="cds-eyebrow">{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}

export default function CascadasLanding() {
  const [active, setActive] = useState('inicio');
  const [faq, setFaq] = useState(-1);
  const [showPlan, setShowPlan] = useState(false);
  const [agendaVisible, setAgendaVisible] = useState(false);

  useEffect(() => {
    const ids = nav.map(([id]) => id);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-18% 0px -60% 0px', threshold: [0, .25, .5] });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    dispararEvento('ViewContent', { content_name: 'Cascadas del Sur', content_type: 'desarrollo' });
  }, []);

  useEffect(() => {
    const el = document.getElementById('agenda');
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setAgendaVisible(entry.isIntersecting),
      { rootMargin: '0px 0px -25% 0px', threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showPlan) return undefined;
    const close = (event) => { if (event.key === 'Escape') setShowPlan(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [showPlan]);

  const go = (id) => {
    track('navigation_click', { section: id });
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const faqs = [
    ['¿Qué superficie tienen los terrenos?', 'La superficie estándar comunicada es de 200 m² (10 × 20 m). También existen lotes de mayor superficie; consulta cuáles están disponibles.'],
    ['¿Cuentan con escritura?', 'Sí. El proyecto comunica escritura pública. Un asesor puede explicarte el proceso y la documentación correspondiente al lote de tu interés.'],
    ['¿Hay financiamiento?', 'Sí. La lista comercial del 07/08/2026 documenta una opción de 200 m² con enganche de $25,000 y 80 mensualidades. Las condiciones dependen del lote y deben confirmarse antes de tomar una decisión.'],
    ['¿Puedo visitar antes de comprar?', 'Sí. Las visitas se programan previamente por WhatsApp.'],
    ['¿Qué infraestructura se comunica?', 'Factibilidad de luz, calles de material mejorado y sistema de dren pluvial. No se comunica que cuente con todos los servicios.'],
  ];

  return (
    <div className="cds-page">
      <Helmet>
        <title>Terrenos en Berriozábal | Cascadas del Sur Residencial</title>
        <meta name="description" content="Conoce Cascadas del Sur Residencial: terrenos en Berriozábal, superficie, escritura pública, ubicación general, financiamiento y visitas." />
        <link rel="canonical" href="https://www.propiedadesenchiapas.com/cascadas-del-sur/" />
        <meta property="og:title" content="Cascadas del Sur Residencial | Terrenos en Berriozábal" />
        <meta property="og:description" content="Conoce los terrenos, opciones comerciales y forma de visitar Cascadas del Sur Residencial." />
        <meta property="og:url" content="https://www.propiedadesenchiapas.com/cascadas-del-sur/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Propiedades en Chiapas" />
        <meta property="og:locale" content="es_MX" />
        <meta property="og:image" content="https://www.propiedadesenchiapas.com/cascadas/og-cascadas.jpg" />
        <meta property="og:image:secure_url" content="https://www.propiedadesenchiapas.com/cascadas/og-cascadas.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Vista aérea de Cascadas del Sur Residencial, Berriozábal, Chiapas" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cascadas del Sur Residencial | Terrenos de 200 m² en Berriozábal" />
        <meta name="twitter:description" content="Recorrido 360°, galería y master plan. Terrenos de 200 m² con escritura pública en el corredor Tuxtla – Berriozábal." />
        <meta name="twitter:image" content="https://www.propiedadesenchiapas.com/cascadas/og-cascadas.jpg" />
        <link rel="canonical" href="https://www.propiedadesenchiapas.com/cascadas-del-sur/" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'RealEstateListing',
          name: 'Cascadas del Sur Residencial',
          description: 'Terrenos residenciales de 200 m² con escritura pública, acceso controlado, factibilidad de luz y dren pluvial, en el corredor Tuxtla Gutiérrez – Berriozábal, Chiapas.',
          url: 'https://www.propiedadesenchiapas.com/cascadas-del-sur/',
          image: 'https://www.propiedadesenchiapas.com/cascadas/og-cascadas.jpg',
          telephone: '+529612466204',
          address: { '@type': 'PostalAddress', addressLocality: 'Berriozábal', addressRegion: 'Chiapas', addressCountry: 'MX' }
        })}</script>
      </Helmet>

      <header className="cds-header">
        <a className="cds-brand" href="#inicio" aria-label="Cascadas del Sur Residencial, ir al inicio"><strong>CASCADAS DEL SUR</strong><small>RESIDENCIAL</small></a>
        <nav className="cds-desktop-nav" aria-label="Secciones principales">{nav.map(([id, label]) => <button key={id} type="button" onClick={() => go(id)}>{label}</button>)}</nav>
        <button type="button" className="cds-header-cta" onClick={() => go('agenda')}>Agendar visita <ArrowRight size={16} /></button>
      </header>

      <main>
        <section id="inicio" className="cds-hero cds-section">
          <div className="cds-hero-inner">
            <div className="cds-hero-copy">
              <span className="cds-eyebrow">BERRIOZÁBAL, CHIAPAS</span>
              <h1>Terrenos residenciales para dar el siguiente paso.</h1>
              <p>Cascadas del Sur se ubica en el corredor Tuxtla–Berriozábal. Conoce el desarrollo, revisa las opciones documentadas y agenda una visita antes de elegir tu terreno.</p>
              <div className="cds-actions"><button type="button" className="cds-button cds-button-primary" onClick={() => go('agenda')}>Agenda tu visita <ArrowRight size={18} /></button><button type="button" className="cds-button cds-button-quiet" onClick={() => go('informacion')}>Ver precio y financiamiento</button></div>
              <div className="cds-hero-note">Superficie estándar de 200 m² · Escritura pública</div>
            </div>
            <div className="cds-hero-panel" aria-label="Resumen del desarrollo"><span>01 / CASCADAS DEL SUR</span><div className="cds-hero-panel-content"><span className="cds-overline">TU TERRENO, TU PRÓXIMO PROYECTO</span><strong>200 <small>m²</small></strong><p>Superficie estándar comunicada<br />10 × 20 m</p></div><span className="cds-panel-bottom">Berriozábal · Chiapas</span></div>
          </div>
        </section>

        <section className="cds-facts cds-wrap" aria-label="Datos principales">
          <div><Ruler size={22} /><strong>Desde 200 m²</strong><span>Superficie estándar 10 × 20 m</span></div>
          <div><FileCheck2 size={22} /><strong>Escritura pública</strong><span>Información documentada del proyecto</span></div>
          <div><MapPin size={22} /><strong>Acceso carretero</strong><span>Desde la carretera Tuxtla–Berriozábal</span></div>
        </section>

        <section id="explorar" className="cds-section cds-wrap cds-explore">
          <SectionHeading eyebrow="CONOCE EL PROYECTO" title="Una vista clara antes de visitarlo">El material visual se integrará aquí cuando estén aprobadas las fotografías, el video y las panorámicas del desarrollo. Mientras tanto, puedes revisar toda la información disponible.</SectionHeading>
          <div className="cds-media-grid">
            <div className="cds-media-card"><span className="cds-card-number">01</span><h3>Fotografías del desarrollo</h3><p>Espacio preparado para imágenes reales, identificadas y ordenadas por tema.</p><span className="cds-coming">Material pendiente</span></div>
            <div className="cds-media-card"><span className="cds-card-number">02</span><h3>Video del recorrido</h3><p>Se incorporará con portada y reproducción por toque cuando exista una versión aprobada.</p><span className="cds-coming">Material pendiente</span></div>
            <div className="cds-media-card"><span className="cds-card-number">03</span><h3>Experiencia 360°</h3><p>El acceso al recorrido se habilitará cuando las panorámicas reales estén listas.</p><span className="cds-coming">Material pendiente</span></div>
          </div>
        </section>

        <section id="plano" className="cds-section cds-plan"><div className="cds-wrap cds-split"><div><SectionHeading eyebrow="MASTER PLAN" title="Explora cómo se organiza el desarrollo">El plano oficial podrá consultarse aquí cuando esté aprobado. La disponibilidad y las condiciones de cada lote deben confirmarse con un asesor.</SectionHeading><WhatsApp intent="plan" className="cds-button cds-button-primary">Pedir información del plano <ArrowRight size={18} /></WhatsApp></div><div className="cds-plan-card"><span>PLANO GENERAL</span><div className="cds-plan-symbol" aria-hidden="true"><Map size={64} strokeWidth={1} /></div><p>El Master Plan oficial se integrará en esta sección.</p><button type="button" onClick={() => { setShowPlan(true); track('masterplan_open'); }}>Ver estado del plano</button></div></div></section>

        <section id="ubicacion" className="cds-section cds-wrap cds-location"><div className="cds-split"><div><SectionHeading eyebrow="UBICACIÓN" title="En el corredor Tuxtla–Berriozábal">Cascadas del Sur se ubica en Berriozábal, Chiapas, con acceso desde la carretera Tuxtla–Berriozábal. Solicita la ubicación exacta para planear tu visita.</SectionHeading><WhatsApp intent="location" className="cds-button cds-button-primary">Pedir ubicación <ArrowRight size={18} /></WhatsApp></div><div className="cds-location-card"><span>REFERENCIA DE ZONA</span><div className="cds-route"><span>Tuxtla</span><i /><span>Cascadas del Sur</span><i /><span>Berriozábal</span></div><p>Mapa orientativo. La ruta exacta se comparte al programar la visita.</p></div></div></section>

        <section id="informacion" className="cds-section cds-info"><div className="cds-wrap"><SectionHeading eyebrow="OPCIONES COMERCIALES" title="Entiende el punto de partida">Referencia documentada en lista de precios del 07/08/2026. Confirma precio, lote y condiciones vigentes antes de decidir.</SectionHeading><div className="cds-pricing"><div className="cds-price-main"><span>OPCIÓN DOCUMENTADA · 200 m²</span><strong>$370,000 <small>MXN</small></strong><p>Precio de referencia de la lista comercial del 07/08/2026. Disponibilidad por confirmar.</p><WhatsApp intent="price" className="cds-button cds-button-primary">Confirmar precio y disponibilidad <ArrowRight size={18} /></WhatsApp></div><div className="cds-price-details"><div><span>Enganche documentado</span><strong>$25,000</strong></div><div><span>Saldo documentado</span><strong>$345,000</strong></div><div><span>Plan documentado</span><strong>80 mensualidades de $4,312.50</strong></div><p>Esta es una opción específica; otras ubicaciones, superficies y condiciones dependen del lote. No se ofrece aquí una simulación ni selección libre de plazos.</p></div></div></div></section>

        <section className="cds-section cds-wrap cds-trust"><SectionHeading eyebrow="INFORMACIÓN PARA DECIDIR" title="Lo que sabemos del proyecto">Estos datos proceden de la documentación del desarrollo. Un asesor puede aclarar su aplicación al lote que te interese.</SectionHeading><div className="cds-trust-grid"><article><FileCheck2 /><h3>Escritura pública</h3><p>Es la condición jurídica comunicada para los terrenos.</p></article><article><Ruler /><h3>Superficie</h3><p>La medida estándar es 200 m², equivalentes a 10 × 20 m. Existen superficies mayores.</p></article><article><MapPin /><h3>Infraestructura documentada</h3><p>Factibilidad de luz, calles de material mejorado y sistema de dren pluvial.</p></article></div></section>

        <section className="cds-section cds-amenities"><div className="cds-wrap"><SectionHeading eyebrow="ESPACIOS DEL DESARROLLO" title="Espacios contemplados para disfrutar">La documentación menciona estas amenidades. Consulta cuáles están disponibles actualmente antes de planear su uso.</SectionHeading><div className="cds-amenity-list">{['Camping', 'Senderismo', 'Ciclismo de montaña', 'Juegos infantiles', 'Resbaladilla gigante', 'Parque de mascotas', 'Mesas y asadores', 'Terraza mirador', 'Áreas de descanso'].map((item) => <span key={item}>{item}</span>)}</div><WhatsApp intent="amenities" className="cds-text-link">Consultar estado de amenidades <ArrowRight size={17} /></WhatsApp></div></section>

        <section className="cds-section cds-wrap cds-faq"><SectionHeading eyebrow="PREGUNTAS FRECUENTES" title="Respuestas antes de visitar" /><div className="cds-faq-list">{faqs.map(([question, answer], index) => <div className="cds-faq-item" key={question}><button type="button" aria-expanded={faq === index} onClick={() => { setFaq(faq === index ? -1 : index); track('faq_expand', { question: index }); }}><span>{question}</span><span aria-hidden="true">{faq === index ? '−' : '+'}</span></button>{faq === index && <p>{answer}</p>}</div>)}</div></section>

        <GaleriaCascadas />

        <FormularioAgenda />

        <section className="cds-final"><div className="cds-wrap"><span className="cds-eyebrow">SIGUIENTE PASO</span><h2>Conócelo en persona.</h2><p>Cuéntanos qué tipo de terreno buscas. Te ayudamos a revisar las opciones vigentes y a programar una visita.</p><div className="cds-actions cds-actions-center"><button type="button" className="cds-button cds-button-light" onClick={() => go('agenda')}>Agendar una visita <CalendarCheck size={18} /></button><WhatsApp intent="visit" className="cds-button cds-button-ghost">Prefiero WhatsApp <MessageCircle size={18} /></WhatsApp></div></div></section>
      </main>

      <footer className="cds-footer"><div className="cds-wrap"><div><strong>CASCADAS DEL SUR</strong><span>RESIDENCIAL · BERRIOZÁBAL, CHIAPAS</span></div><div><a href="/privacidad/">Aviso de privacidad</a><WhatsApp intent="general">WhatsApp: 961 246 6204</WhatsApp></div></div></footer>

      <nav className="cds-bottom-nav" aria-label="Navegación de Cascadas del Sur">{nav.map(([id, label, Icon]) => <button type="button" key={id} className={`${active === id ? 'active' : ''} ${id === 'explorar' ? 'featured' : ''}`} aria-label={label} aria-current={active === id ? 'page' : undefined} onClick={() => go(id)}><Icon size={21} strokeWidth={1.8} /><span>{label}</span></button>)}</nav>

      <div className={`cds-float-cta ${agendaVisible ? 'oculto' : ''}`} aria-hidden={agendaVisible}>
        <button type="button" className="cds-float-main" onClick={() => go('agenda')} tabIndex={agendaVisible ? -1 : 0}>
          <CalendarCheck size={18} /> Agendar visita
        </button>
        <WhatsApp intent="visit" className="cds-float-wa" aria-label="Escribir por WhatsApp"><MessageCircle size={20} /></WhatsApp>
      </div>

      {showPlan && <div className="cds-modal" role="dialog" aria-modal="true" aria-labelledby="cds-modal-title" onClick={() => setShowPlan(false)}><div className="cds-modal-content" onClick={(event) => event.stopPropagation()}><button type="button" className="cds-modal-close" onClick={() => setShowPlan(false)} aria-label="Cerrar"><X size={20} /></button><Map size={44} /><h2 id="cds-modal-title">Master Plan pendiente</h2><p>Publicaremos el plano cuando esté aprobado. Mientras tanto, solicita a un asesor la información vigente de las ubicaciones disponibles.</p><WhatsApp intent="plan" className="cds-button cds-button-primary">Solicitar el plano <ArrowRight size={18} /></WhatsApp></div></div>}
    </div>
  );
}

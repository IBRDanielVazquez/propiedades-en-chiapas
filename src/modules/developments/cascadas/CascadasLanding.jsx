import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Armchair, Bike, CalendarCheck, Compass, Dog, FileCheck2, Flame, Footprints, House, Info, MapPin, Map, MessageCircle, Mountain, Ruler, Tent, ToyBrick, Waves, X } from 'lucide-react';
import FormularioAgenda from './FormularioAgenda';
import GaleriaCascadas from './GaleriaCascadas';
import PlanoZoom from './PlanoZoom';
import { dispararEvento } from '../../../lib/tracking';
import './cascadas.css';

const AMENIDADES = [
  ['Camping', Tent], ['Senderismo', Footprints], ['Ciclismo de montaña', Bike],
  ['Juegos infantiles', ToyBrick], ['Resbaladilla gigante', Waves],
  ['Parque de mascotas', Dog], ['Mesas y asadores', Flame],
  ['Terraza mirador', Mountain], ['Áreas de descanso', Armchair],
];

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
        <title>Terrenos de 200 m² en Berriozábal | Cascadas del Sur</title>
        <meta name="description" content="Terrenos residenciales desde 200 m² en Berriozábal, Chiapas, con escritura pública y financiamiento. Explora fotos, recorrido 360° y agenda una visita." />
        <link rel="canonical" href="https://www.propiedadesenchiapas.com/cascadas-del-sur/" />
        <meta property="og:title" content="Terrenos de 200 m² en Berriozábal | Cascadas del Sur" />
        <meta property="og:description" content="Escritura pública, financiamiento y recorrido 360°. Conoce el desarrollo y consulta las condiciones vigentes." />
        <meta property="og:url" content="https://www.propiedadesenchiapas.com/cascadas-del-sur/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Propiedades en Chiapas" />
        <meta property="og:locale" content="es_MX" />
        <meta property="og:image" content="https://www.propiedadesenchiapas.com/cascadas/og-cascadas.jpg" />
        <meta property="og:image:secure_url" content="https://www.propiedadesenchiapas.com/cascadas/og-cascadas.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Terrenos en Cascadas del Sur Residencial, Berriozábal, Chiapas" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terrenos de 200 m² en Berriozábal | Cascadas del Sur" />
        <meta name="twitter:description" content="Escritura pública, financiamiento y recorrido 360°. Conoce el desarrollo y consulta las condiciones vigentes." />
        <meta name="twitter:image" content="https://www.propiedadesenchiapas.com/cascadas/og-cascadas.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Cascadas del Sur Residencial',
          description: 'Terrenos residenciales desde 200 m² con escritura pública y opciones de financiamiento en Berriozábal, Chiapas.',
          url: 'https://www.propiedadesenchiapas.com/cascadas-del-sur/',
          image: 'https://www.propiedadesenchiapas.com/cascadas/og-cascadas.jpg',
          telephone: '+529612466204',
          address: { '@type': 'PostalAddress', addressLocality: 'Berriozábal', addressRegion: 'Chiapas', addressCountry: 'MX' }
        })}</script>
      </Helmet>

      <header className="cds-header">
        <a className="cds-brand" href="#inicio" aria-label="Cascadas del Sur Residencial, ir al inicio"><img src="/cascadas/logo-cascadas-transparente.png" alt="Cascadas del Sur Residencial" width="1536" height="1024" /></a>
        <nav className="cds-desktop-nav" aria-label="Secciones principales">{nav.map(([id, label]) => <button key={id} type="button" onClick={() => go(id)}>{label}</button>)}</nav>
        <button type="button" className="cds-header-cta" onClick={() => go('agenda')}>Agendar visita <ArrowRight size={16} /></button>
      </header>

      <main>
        <section id="inicio" className="cds-hero cds-section">
          <div className="cds-hero-inner">
            <div className="cds-hero-copy">
              <span className="cds-eyebrow">ÚLTIMOS 50 LOTES · BERRIOZÁBAL, CHIAPAS</span>
              <h1>Tu próximo patrimonio empieza con 200 m².</h1>
              <p>Terrenos residenciales con escritura pública, financiamiento y espacios para disfrutar al aire libre, en el corredor Tuxtla–Berriozábal.</p>
              <div className="cds-actions"><button type="button" className="cds-button cds-button-primary" onClick={() => go('explorar')}>Explorar el desarrollo <ArrowRight size={18} /></button><button type="button" className="cds-button cds-button-quiet" onClick={() => go('informacion')}>Ver cómo comprar</button></div>
              <div className="cds-hero-note">Desde $370,000 · Enganche desde $25,000 · Hasta 80 mensualidades</div>
            </div>
            <div className="cds-hero-panel" aria-label="Resumen del desarrollo"><span>¿QUÉ ESTÁS COMPRANDO?</span><div className="cds-hero-panel-content"><span className="cds-overline">UN LOTE RESIDENCIAL CON ESCRITURA PÚBLICA</span><strong>200 <small>m²</small></strong><p>Medida estándar de 10 × 20 m<br />para construir cuando tú decidas.</p></div><span className="cds-panel-bottom">Corredor Tuxtla–Berriozábal</span></div>
          </div>
        </section>

        <section className="cds-facts cds-wrap" aria-label="Guía para conocer Cascadas del Sur">
          <div><FileCheck2 size={22} /><strong>Empieza con certeza</strong><span>Terrenos con escritura pública.</span></div>
          <div><Compass size={22} /><strong>Conoce antes de elegir</strong><span>Fotos reales, video, recorrido 360° y master plan.</span></div>
          <div><Ruler size={22} /><strong>Decide con números claros</strong><span>200 m² desde $370,000 en la opción de entrada.</span></div>
        </section>

        <section id="explorar" className="cds-section cds-wrap cds-explore">
          <SectionHeading eyebrow="CONOCE EL PROYECTO" title="Una vista clara antes de visitarlo">Fotografías, video aéreo y recorrido 360° del desarrollo tal como está hoy. Todo el material fue capturado en sitio.</SectionHeading>
          <GaleriaCascadas />
        </section>

        <section id="plano" className="cds-section cds-plan"><div className="cds-wrap cds-split"><div><SectionHeading eyebrow="MASTER PLAN" title="Encuentra tu lugar dentro de Cascadas del Sur">Explora la distribución de vialidades, terrenos y áreas comunes. Si una zona llama tu atención, un asesor puede ayudarte a revisar las ubicaciones disponibles.</SectionHeading><WhatsApp intent="plan" className="cds-button cds-button-primary">Consultar ubicaciones disponibles <ArrowRight size={18} /></WhatsApp><p className="cds-plan-nota">Disponibilidad comunicada: últimos 50 lotes. La ubicación y condiciones se confirman con un asesor.</p></div><PlanoZoom src="/cascadas/masterplan.webp" srcMovil="/cascadas/masterplan-movil.webp" ancho={3253} alto={4719} alt="Master plan de Cascadas del Sur Residencial con vialidades, lotes y amenidades" etiqueta="Ver master plan" /></div></section>

        <section id="ubicacion" className="cds-section cds-wrap cds-location"><div className="cds-split"><div><SectionHeading eyebrow="UBICACIÓN" title="En el corredor Tuxtla–Berriozábal">Cascadas del Sur se encuentra en Berriozábal y cuenta con acceso desde la carretera Tuxtla–Berriozábal. Consulta el plano o recibe la ubicación para visitarlo.</SectionHeading><WhatsApp intent="location" className="cds-button cds-button-primary">Recibir ubicación para llegar <ArrowRight size={18} /></WhatsApp></div><PlanoZoom src="/cascadas/plano-ubicacion.webp" srcMovil="/cascadas/plano-ubicacion-movil.webp" ancho={1800} alto={1200} alt="Plano de ubicación de Cascadas del Sur entre Berriozábal y Tuxtla Gutiérrez" etiqueta="Ver plano de ubicación" /></div></section>

        <section id="informacion" className="cds-section cds-info"><div className="cds-wrap"><SectionHeading eyebrow="UNA FORMA REAL DE EMPEZAR" title="Hazlo tuyo desde $25,000 de enganche">Una opción clara para comenzar a construir patrimonio con un terreno residencial de 200 m² y pagos definidos.</SectionHeading><div className="cds-pricing"><div className="cds-price-main"><span>ENGANCHE DOCUMENTADO</span><strong>$25,000 <small>MXN</small></strong><p>Opción de entrada correspondiente a un terreno de 200 m². Precio y disponibilidad se confirman antes de iniciar.</p><WhatsApp intent="price" className="cds-button cds-button-primary">Consultar esta opción <ArrowRight size={18} /></WhatsApp></div><div className="cds-price-details"><div><span>Precio del terreno</span><strong>$370,000</strong></div><div><span>Superficie</span><strong>200 m² · 10 × 20 m</strong></div><div><span>Plan documentado</span><strong>80 pagos de $4,312.50</strong></div><p>Referencia de la lista comercial del 07/08/2026. Existen otras ubicaciones, superficies y condiciones según el lote.</p></div></div></div></section>

        <section className="cds-section cds-wrap cds-trust"><SectionHeading eyebrow="CERTEZA PARA TU COMPRA" title="Bases claras para construir patrimonio">Un terreno con documentación, medidas definidas e infraestructura comunicada dentro de un desarrollo residencial.</SectionHeading><div className="cds-trust-grid"><article><span>01</span><FileCheck2 /><h3>Escritura pública</h3><p>Certeza jurídica documentada para los terrenos.</p></article><article><span>02</span><Ruler /><h3>Desde 200 m²</h3><p>Medida estándar de 10 × 20 m, además de terrenos con superficies mayores.</p></article><article><span>03</span><MapPin /><h3>Infraestructura</h3><p>Factibilidad de luz, calles de material mejorado y sistema de dren pluvial.</p></article><article><span>04</span><Compass /><h3>Últimos 50 lotes</h3><p>Disponibilidad comunicada actualmente para Cascadas del Sur.</p></article></div></section>

        <section className="cds-section cds-amenities"><div className="cds-wrap"><SectionHeading eyebrow="NATURALEZA, CONVIVENCIA Y MOVIMIENTO" title="Amenidades para disfrutar el desarrollo">Espacios contemplados para compartir en familia, recorrer el entorno y disfrutar actividades al aire libre.</SectionHeading><div className="cds-amenity-list">{AMENIDADES.map(([nombre, Icono]) => <article key={nombre}><span><Icono size={24} strokeWidth={1.7} aria-hidden="true" /></span><strong>{nombre}</strong></article>)}</div><WhatsApp intent="amenities" className="cds-text-link">Consultar avance de las amenidades <ArrowRight size={17} /></WhatsApp></div></section>

        <section className="cds-section cds-wrap cds-faq"><SectionHeading eyebrow="ANTES DE DAR EL SIGUIENTE PASO" title="Resuelve tus dudas principales">Aquí respondemos lo básico. Para elegir un terreno específico, confirma ubicación, disponibilidad y condiciones con un asesor.</SectionHeading><div className="cds-faq-list">{faqs.map(([question, answer], index) => <div className="cds-faq-item" key={question}><button type="button" aria-expanded={faq === index} onClick={() => { setFaq(faq === index ? -1 : index); track('faq_expand', { question: index }); }}><span>{question}</span><span aria-hidden="true">{faq === index ? '−' : '+'}</span></button>{faq === index && <p>{answer}</p>}</div>)}</div></section>

        <FormularioAgenda />

        <section className="cds-final"><div className="cds-wrap"><span className="cds-eyebrow">YA CONOCES LO ESENCIAL</span><h2>Ahora recórrelo y decide con calma.</h2><p>En la visita podrás conocer el entorno, ubicar las zonas que te interesan y revisar con un asesor las opciones vigentes.</p><div className="cds-actions cds-actions-center"><button type="button" className="cds-button cds-button-light" onClick={() => go('agenda')}>Quiero conocer Cascadas del Sur <CalendarCheck size={18} /></button><WhatsApp intent="visit" className="cds-button cds-button-ghost">Primero quiero resolver una duda <MessageCircle size={18} /></WhatsApp></div></div></section>
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

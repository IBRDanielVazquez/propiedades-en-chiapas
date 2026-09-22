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
  general: 'Hola, me interesa Cascadas del Sur. Quiero conocer los terrenos disponibles.',
  price: 'Hola, quiero hacer mío un terreno de 200 m² en Cascadas del Sur. ¿Me ayudan a comenzar?',
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
    ['¿Desde qué tamaño puedo elegir mi terreno?', 'Tenemos lotes desde 200 m², con medidas de 10 × 20 m. También hay superficies mayores para quienes buscan más espacio.'],
    ['¿Mi terreno cuenta con escritura pública?', 'Sí. Los terrenos cuentan con escritura pública, para que construyas tu patrimonio con certeza jurídica.'],
    ['¿Cómo puedo pagarlo?', 'Puedes comenzar con $25,000 de enganche. Para un terreno de 200 m², el plan contempla 80 mensualidades de $4,312.50. El precio es de $370,000.'],
    ['¿Puedo conocer Cascadas del Sur antes de decidir?', 'Claro. Agenda una visita para recorrer el desarrollo, conocer el entorno y resolver tus dudas directamente con un asesor.'],
    ['¿Qué incluye el desarrollo?', 'Cascadas del Sur contempla factibilidad de luz, calles de material mejorado y sistema de dren pluvial.'],
  ];

  return (
    <div className="cds-page">
      <Helmet>
        <title>Terrenos de 200 m² en Berriozábal | Cascadas del Sur</title>
        <link rel="icon" type="image/png" href="/cascadas/favicon.png" />
        <link rel="apple-touch-icon" href="/cascadas/apple-touch-icon.png" />
        <meta name="description" content="Terrenos residenciales desde 200 m² en Berriozábal, Chiapas, con escritura pública y financiamiento. Explora fotos, recorrido 360° y agenda una visita." />
        <link rel="canonical" href="https://www.propiedadesenchiapas.com/cascadas-del-sur/" />
        <meta property="og:title" content="Terrenos de 200 m² en Berriozábal | Cascadas del Sur" />
        <meta property="og:description" content="Un terreno propio en Berriozábal desde 200 m². Escritura pública, financiamiento y recorrido 360° de Cascadas del Sur." />
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
        <meta name="twitter:description" content="Un terreno propio en Berriozábal desde 200 m². Escritura pública, financiamiento y recorrido 360° de Cascadas del Sur." />
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
              <h1>El espacio donde puede comenzar lo que sigue.</h1>
              <p>Un terreno propio abre la posibilidad de construir a tu tiempo, crear un lugar para tu familia y convertir una decisión de hoy en patrimonio. Cascadas del Sur reúne naturaleza, planeación residencial y una forma accesible de empezar.</p>
              <div className="cds-actions"><button type="button" className="cds-button cds-button-primary" onClick={() => go('explorar')}>Conocer Cascadas del Sur <ArrowRight size={18} /></button><button type="button" className="cds-button cds-button-quiet" onClick={() => go('informacion')}>Descubrir cómo hacerlo mío</button></div>
              <div className="cds-hero-note">Desde $370,000 · Enganche desde $25,000 · Hasta 80 mensualidades</div>
            </div>
            <div className="cds-hero-panel" aria-label="Resumen del desarrollo"><span>UN LUGAR PROPIO</span><div className="cds-hero-panel-content"><span className="cds-overline">PARA CONSTRUIR PATRIMONIO A TU MANERA</span><strong>200 <small>m²</small></strong><p>10 × 20 m para imaginar, planear<br />y construir cuando tú decidas.</p></div><span className="cds-panel-bottom">Escritura pública · Berriozábal</span></div>
          </div>
        </section>

        <section className="cds-facts cds-wrap" aria-label="Guía para conocer Cascadas del Sur">
          <div><FileCheck2 size={22} /><strong>Patrimonio con certeza</strong><span>Tu terreno cuenta con escritura pública.</span></div>
          <div><Compass size={22} /><strong>Naturaleza para disfrutar</strong><span>Un desarrollo con espacios contemplados para convivir al aire libre.</span></div>
          <div><Ruler size={22} /><strong>Una forma posible de comenzar</strong><span>Lotes desde 200 m² por $370,000.</span></div>
        </section>

        <section id="explorar" className="cds-section cds-wrap cds-explore">
          <SectionHeading eyebrow="CONOCE EL PROYECTO" title="Una vista clara antes de visitarlo">Comienza con el video aéreo; después recorre las fotografías y explora el desarrollo en 360°. Todo el material fue capturado en sitio.</SectionHeading>
          <GaleriaCascadas />
        </section>

        <section id="plano" className="cds-section cds-plan"><div className="cds-wrap cds-split"><div><SectionHeading eyebrow="MASTER PLAN" title="Imagina tu lugar dentro de Cascadas del Sur">Cada terreno forma parte de una visión más amplia: vialidades, espacios comunes y naturaleza alrededor. Recorre el plano y descubre en qué parte del desarrollo te gustaría comenzar tu historia.</SectionHeading><WhatsApp intent="plan" className="cds-button cds-button-primary">Encontrar mi lugar <ArrowRight size={18} /></WhatsApp><p className="cds-plan-nota">Quedan 50 lotes. Elige la ubicación que mejor acompañe el proyecto que tienes en mente.</p></div><PlanoZoom src="/cascadas/masterplan.webp" srcMovil="/cascadas/masterplan-movil.webp" ancho={3253} alto={4719} alt="Master plan de Cascadas del Sur Residencial con vialidades, lotes y amenidades" etiqueta="Ver master plan" /></div></section>

        <section id="ubicacion" className="cds-section cds-wrap cds-location"><div className="cds-split"><div><SectionHeading eyebrow="UBICACIÓN" title="Naturaleza en el corredor Tuxtla–Berriozábal">Cascadas del Sur se encuentra en Berriozábal, con acceso desde la carretera Tuxtla–Berriozábal. Un entorno para respirar distinto sin perder conexión con la zona que mueve tu vida.</SectionHeading><WhatsApp intent="location" className="cds-button cds-button-primary">Quiero conocer el camino <ArrowRight size={18} /></WhatsApp></div><PlanoZoom src="/cascadas/plano-ubicacion.webp" srcMovil="/cascadas/plano-ubicacion-movil.webp" ancho={1800} alto={1200} alt="Plano de ubicación de Cascadas del Sur entre Berriozábal y Tuxtla Gutiérrez" etiqueta="Ver plano de ubicación" /></div></section>

        <section id="informacion" className="cds-section cds-info"><div className="cds-wrap"><SectionHeading eyebrow="UNA FORMA CLARA DE EMPEZAR" title="Tu terreno puede comenzar hoy">Un espacio de 200 m² para construir patrimonio, con un enganche accesible y un plan de pagos definido.</SectionHeading><div className="cds-pricing"><div className="cds-price-main"><span>COMIENZA CON</span><strong>$25,000 <small>MXN</small></strong><p>de enganche para dar el primer paso hacia tu terreno propio.</p><WhatsApp intent="price" className="cds-button cds-button-primary">Quiero conocer el plan <ArrowRight size={18} /></WhatsApp></div><div className="cds-price-details"><div className="cds-price-from"><span>TERRENOS DESDE</span><strong>$370,000 <small>MXN</small></strong></div><div><span>El espacio para tu proyecto</span><strong>200 m² · 10 × 20 m</strong></div><div><span>Un plan para avanzar a tu ritmo</span><strong>80 pagos de $4,312.50</strong></div><p>Hay lotes de mayor superficie y distintas ubicaciones con otros precios.</p></div></div></div></section>

        <section className="cds-section cds-wrap cds-trust"><SectionHeading eyebrow="PATRIMONIO SOBRE BASES FIRMES" title="La tranquilidad también forma parte de la decisión">Elegir un terreno significa pensar en el futuro. Por eso Cascadas del Sur reúne elementos concretos que aportan certeza desde el inicio.</SectionHeading><div className="cds-trust-grid"><article><span>01</span><FileCheck2 /><h3>Escritura pública</h3><p>Tu terreno cuenta con certeza jurídica para construir patrimonio sobre bases firmes.</p></article><article><span>02</span><Ruler /><h3>Espacio para tu proyecto</h3><p>Lotes desde 200 m², con medidas de 10 × 20 m.</p></article><article><span>03</span><MapPin /><h3>Un desarrollo planeado</h3><p>Factibilidad de luz, calles de material mejorado y sistema de dren pluvial.</p></article><article><span>04</span><Compass /><h3>Tu momento para elegir</h3><p>Quedan 50 lotes para encontrar el lugar que mejor encaje con tu proyecto.</p></article></div></section>

        <section className="cds-section cds-amenities"><div className="cds-wrap"><SectionHeading eyebrow="LA VIDA TAMBIÉN SUCEDE AFUERA" title="Un entorno para crear recuerdos">Caminar entre la naturaleza, compartir una tarde en familia, salir en bicicleta o simplemente detenerse a mirar el paisaje. Las amenidades contempladas hacen del desarrollo un lugar para disfrutar, además de invertir.</SectionHeading><div className="cds-amenity-list">{AMENIDADES.map(([nombre, Icono]) => <article key={nombre}><span><Icono size={24} strokeWidth={1.7} aria-hidden="true" /></span><strong>{nombre}</strong></article>)}</div><WhatsApp intent="amenities" className="cds-text-link">Quiero conocer esta experiencia <ArrowRight size={17} /></WhatsApp></div></section>

        <section className="cds-section cds-wrap cds-faq"><SectionHeading eyebrow="CLARIDAD PARA DECIDIR" title="Cuando el futuro importa, cada respuesta cuenta">Aquí tienes respuestas directas sobre tu terreno, la escritura pública, el plan de pagos y la experiencia de conocer el desarrollo.</SectionHeading><div className="cds-faq-list">{faqs.map(([question, answer], index) => <div className="cds-faq-item" key={question}><button type="button" aria-expanded={faq === index} onClick={() => { setFaq(faq === index ? -1 : index); track('faq_expand', { question: index }); }}><span>{question}</span><span aria-hidden="true">{faq === index ? '−' : '+'}</span></button>{faq === index && <p>{answer}</p>}</div>)}</div></section>

        <FormularioAgenda />

        <section className="cds-final"><div className="cds-wrap"><span className="cds-eyebrow">TODO GRAN PROYECTO EMPIEZA CON UN PRIMER PASO</span><h2>Ven a imaginar tu historia aquí.</h2><p>Recorre el desarrollo, siente el entorno y descubre cuál de las ubicaciones disponibles puede convertirse en tu próximo patrimonio.</p><div className="cds-actions cds-actions-center"><button type="button" className="cds-button cds-button-light" onClick={() => go('agenda')}>Quiero vivir la experiencia <CalendarCheck size={18} /></button><WhatsApp intent="visit" className="cds-button cds-button-ghost">Hablar con un asesor <MessageCircle size={18} /></WhatsApp></div></div></section>
      </main>

      <footer className="cds-footer"><div className="cds-wrap"><div><strong>CASCADAS DEL SUR</strong><span>RESIDENCIAL · BERRIOZÁBAL, CHIAPAS</span></div><div className="cds-footer-links"><a href="/privacidad/">Aviso de privacidad</a><nav className="cds-social" aria-label="Redes sociales y contacto"><a href="https://www.facebook.com/Cascadas.del.Sur.Residencial" target="_blank" rel="noopener noreferrer" aria-label="Cascadas del Sur en Facebook"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="M18 2h-3c-3.3 0-5 1.8-5 5v3H7v4h3v8h4v-8h3l.5-4H14V7c0-.8.2-1 1-1h3V2z" /></svg></a><a href="https://www.instagram.com/cascadas_del_sur_residencial" target="_blank" rel="noopener noreferrer" aria-label="Cascadas del Sur en Instagram"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" /></svg></a><WhatsApp intent="general" className="cds-social-whatsapp"><MessageCircle size={18} strokeWidth={1.8} /><span className="cds-sr-only">WhatsApp de Cascadas del Sur</span></WhatsApp></nav></div></div></footer>

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

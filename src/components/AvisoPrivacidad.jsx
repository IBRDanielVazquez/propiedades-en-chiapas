import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Home as HomeIcon, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';

// ─── Estilos (coherentes con el sistema azul índigo + esmeralda del Home) ──────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ap {
    --ink:      #0B1B3A;
    --indigo:   #13287A;
    --indigo-2: #1E3A9B;
    --emerald:  #0E9F6E;
    --emerald-2:#10B981;
    --bg:       #F6F8FC;
    --card:     #FFFFFF;
    --muted:    #5C6B8A;
    --line:     #E4EAF4;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--ink);
    background: var(--bg);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  .ap * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Header ── */
  .ap-hd {
    position: sticky; top: 0; z-index: 50;
    background: rgba(246,248,252,.88);
    backdrop-filter: saturate(180%) blur(16px);
    border-bottom: 1px solid var(--line);
  }
  .ap-hd-in {
    max-width: 860px; margin: 0 auto; padding: 14px 18px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .ap-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--ink); }
  .ap-mark {
    width: 38px; height: 38px; border-radius: 11px; flex: none;
    background: linear-gradient(145deg, var(--indigo), var(--indigo-2));
    display: grid; place-items: center;
    box-shadow: 0 6px 16px rgba(19,40,122,.24);
    position: relative; overflow: hidden;
  }
  .ap-mark::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 70% 20%, rgba(16,185,129,.6), transparent 60%);
  }
  .ap-mark svg { position: relative; z-index: 1; }
  .ap-logo b   { font-size: 14.5px; font-weight: 800; letter-spacing: -.3px; }
  .ap-logo small {
    display: block; font-size: 10px; color: var(--emerald);
    font-weight: 700; letter-spacing: .5px; text-transform: uppercase; margin-top: 2px;
  }
  .ap-back {
    display: flex; align-items: center; gap: 7px;
    font-size: 13px; font-weight: 700; color: var(--indigo);
    text-decoration: none; border: 1.5px solid var(--indigo);
    padding: 8px 16px; border-radius: 999px; transition: .18s;
  }
  .ap-back:hover { background: var(--indigo); color: #fff; }

  /* ── Hero ── */
  .ap-hero {
    background: linear-gradient(160deg, var(--ink) 0%, var(--indigo) 55%, var(--indigo-2) 100%);
    color: #fff; padding: 56px 18px 52px; position: relative; overflow: hidden;
  }
  .ap-hero::before {
    content: ''; position: absolute; top: -30%; right: -10%;
    width: 480px; height: 480px; border-radius: 50%;
    background: radial-gradient(circle, rgba(16,185,129,.3), transparent 65%);
    filter: blur(10px);
  }
  .ap-hero::after {
    content: ''; position: absolute; inset: 0; opacity: .05;
    background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0);
    background-size: 24px 24px;
  }
  .ap-hero-in {
    max-width: 860px; margin: 0 auto; position: relative; z-index: 2;
    display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
  }
  .ap-hero-icon {
    width: 60px; height: 60px; border-radius: 18px; flex: none;
    background: rgba(16,185,129,.2); border: 1.5px solid rgba(16,185,129,.4);
    display: grid; place-items: center;
  }
  .ap-hero-text h1 { font-size: clamp(24px, 5vw, 36px); font-weight: 800; letter-spacing: -.6px; }
  .ap-hero-text p  { margin-top: 8px; font-size: 14.5px; color: rgba(255,255,255,.75); }

  /* ── Contenido ── */
  .ap-body {
    max-width: 860px; margin: 0 auto;
    padding: 40px 18px 80px;
    animation: fadeUp .5s ease both;
  }

  /* ── Tarjeta de sección ── */
  .ap-section {
    background: var(--card); border: 1px solid var(--line);
    border-radius: 20px; padding: 30px 28px; margin-bottom: 20px;
    box-shadow: 0 4px 20px rgba(11,27,58,.05);
  }
  .ap-section-title {
    display: flex; align-items: center; gap: 11px;
    font-size: 16.5px; font-weight: 800; letter-spacing: -.3px; color: var(--indigo);
    margin-bottom: 16px; padding-bottom: 14px;
    border-bottom: 1.5px solid var(--line);
  }
  .ap-section-num {
    width: 28px; height: 28px; border-radius: 8px; flex: none;
    background: linear-gradient(145deg, var(--indigo), var(--indigo-2));
    display: grid; place-items: center;
    font-size: 12px; font-weight: 800; color: #fff;
  }
  .ap-section p  { font-size: 14.5px; line-height: 1.7; color: #3A4A65; margin-bottom: 12px; }
  .ap-section p:last-child { margin-bottom: 0; }
  .ap-section ul { padding-left: 1.2rem; margin-bottom: 12px; }
  .ap-section li { font-size: 14.5px; line-height: 1.7; color: #3A4A65; margin-bottom: 6px; }
  .ap-section li:last-child { margin-bottom: 0; }
  .ap-section b  { color: var(--ink); font-weight: 700; }

  /* ── Destacado ARCO ── */
  .ap-arco {
    background: linear-gradient(135deg, rgba(14,159,110,.08), rgba(16,185,129,.05));
    border: 1.5px solid rgba(14,159,110,.25);
    border-radius: 14px; padding: 18px 20px; margin-top: 14px;
  }
  .ap-arco p { color: var(--ink) !important; font-size: 14px !important; }
  .ap-arco a { color: var(--emerald); font-weight: 700; text-decoration: none; }
  .ap-arco a:hover { text-decoration: underline; }

  /* ── Email chip ── */
  .ap-email {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(19,40,122,.07); border: 1px solid rgba(19,40,122,.15);
    padding: 7px 14px; border-radius: 999px;
    font-size: 13.5px; font-weight: 700; color: var(--indigo);
    text-decoration: none; margin-top: 8px;
    transition: .18s;
  }
  .ap-email:hover { background: var(--indigo); color: #fff; }

  /* ── Footer ── */
  .ap-ft {
    background: var(--ink); color: rgba(255,255,255,.55);
    padding: 36px 18px; text-align: center;
  }
  .ap-ft-in { max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .ap-ft b   { color: #fff; font-size: 14px; font-weight: 800; }
  .ap-ft a   { color: rgba(255,255,255,.55); font-size: 13px; text-decoration: none; transition: .18s; }
  .ap-ft a:hover { color: #fff; }
  .ap-ft-links { display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; }
`;

// ─── Componente principal ──────────────────────────────────────────────────────
export default function AvisoPrivacidad() {
  const FECHA = '22 de mayo de 2026';

  return (
    <>
      <style>{STYLES}</style>

      <Helmet>
        <title>Aviso de Privacidad — Propiedades en Chiapas</title>
        <meta name="description" content="Aviso de Privacidad de Propiedades en Chiapas conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://propiedadesenchiapas.com/privacidad" />
      </Helmet>

      <div className="ap">

        {/* ── Header ── */}
        <header className="ap-hd">
          <div className="ap-hd-in">
            <a href="/" className="ap-logo">
              <div className="ap-mark">
                <HomeIcon size={19} color="#fff" strokeWidth={2.4} />
              </div>
              <div>
                <b>Propiedades en Chiapas</b>
                <small>Portal inmobiliario</small>
              </div>
            </a>
            <a href="/" className="ap-back">
              <ArrowLeft size={15} strokeWidth={2.8} /> Inicio
            </a>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="ap-hero">
          <div className="ap-hero-in">
            <div className="ap-hero-icon">
              <ShieldCheck size={30} color="#10B981" strokeWidth={2} />
            </div>
            <div className="ap-hero-text">
              <h1>Aviso de Privacidad</h1>
              <p>Ley Federal de Protección de Datos Personales en Posesión de los Particulares · Última actualización: {FECHA}</p>
            </div>
          </div>
        </section>

        {/* ── Cuerpo ── */}
        <main className="ap-body" id="aviso-privacidad-contenido">

          {/* 1. Identidad y domicilio del responsable */}
          <section className="ap-section" aria-labelledby="sec-responsable">
            <div className="ap-section-title" id="sec-responsable">
              <span className="ap-section-num">1</span>
              Identidad y domicilio del Responsable
            </div>
            <p>
              <b>Propiedades en Chiapas</b>, operado por <b>IBR Agencia Digital</b> (en adelante,
              «el Responsable»), es una plataforma digital inmobiliaria con presencia en el estado
              de Chiapas, México. Con fundamento en lo dispuesto por la <b>Ley Federal de Protección
              de Datos Personales en Posesión de los Particulares (LFPDPPP)</b>, su Reglamento y los
              Lineamientos del Aviso de Privacidad, el Responsable pone a disposición del titular
              el presente Aviso de Privacidad.
            </p>
            <p>
              <b>Sitio web:</b> <a href="https://propiedadesenchiapas.com" style={{ color:'var(--emerald)', fontWeight:700 }}>propiedadesenchiapas.com</a><br />
              <b>Correo de contacto:</b>{' '}
              <a href="mailto:contacto@propiedadesenchiapas.com" style={{ color:'var(--emerald)', fontWeight:700 }}>
                contacto@propiedadesenchiapas.com
              </a>
            </p>
          </section>

          {/* 2. Datos personales recabados */}
          <section className="ap-section" aria-labelledby="sec-datos">
            <div className="ap-section-title" id="sec-datos">
              <span className="ap-section-num">2</span>
              Datos personales que se recaban
            </div>
            <p>
              El Responsable podrá recabar los siguientes datos personales, de acuerdo con el tipo
              de usuario:
            </p>
            <p><b>De personas interesadas en propiedades (visitantes y compradores/rentadores):</b></p>
            <ul>
              <li>Nombre completo</li>
              <li>Correo electrónico</li>
              <li>Número de teléfono o celular</li>
              <li>Mensaje o comentario de contacto</li>
            </ul>
            <p><b>De asesores inmobiliarios (usuarios del CRM):</b></p>
            <ul>
              <li>Nombre completo</li>
              <li>Correo electrónico</li>
              <li>Número de teléfono o celular</li>
              <li>Fotografía de perfil (opcional)</li>
              <li>Información profesional: zona de trabajo, especialidad, redes sociales profesionales</li>
            </ul>
            <p>
              <b>Datos sensibles:</b> El Responsable <b>no recaba</b> datos personales sensibles en
              los términos del artículo 3, fracción VI de la LFPDPPP.
            </p>
          </section>

          {/* 3. Finalidades del tratamiento */}
          <section className="ap-section" aria-labelledby="sec-finalidades">
            <div className="ap-section-title" id="sec-finalidades">
              <span className="ap-section-num">3</span>
              Finalidades del tratamiento
            </div>
            <p><b>Finalidades primarias</b> (necesarias para la relación jurídica):</p>
            <ul>
              <li>Gestionar el registro, autenticación y administración de cuentas de asesores inmobiliarios en la plataforma CRM.</li>
              <li>Facilitar el contacto entre personas interesadas en propiedades y los asesores correspondientes.</li>
              <li>Publicar y gestionar listados de propiedades en el portal público.</li>
              <li>Brindar soporte técnico y atención a solicitudes de los usuarios.</li>
            </ul>
            <p><b>Finalidades secundarias</b> (puedes oponerte en cualquier momento):</p>
            <ul>
              <li>Envío de información sobre nuevas propiedades, promociones o actualizaciones del servicio.</li>
              <li>Análisis estadístico del uso del sitio para mejorar la experiencia del usuario.</li>
              <li>Comunicaciones de mercadotecnia relacionadas con el sector inmobiliario en Chiapas.</li>
            </ul>
            <p>
              Si no deseas que tus datos sean tratados para las finalidades secundarias, puedes
              manifestarlo enviando un correo a{' '}
              <a href="mailto:contacto@propiedadesenchiapas.com" style={{ color:'var(--emerald)', fontWeight:700 }}>
                contacto@propiedadesenchiapas.com
              </a>.
            </p>
          </section>

          {/* 4. Derechos ARCO */}
          <section className="ap-section" aria-labelledby="sec-arco">
            <div className="ap-section-title" id="sec-arco">
              <span className="ap-section-num">4</span>
              Derechos ARCO y cómo ejercerlos
            </div>
            <p>
              Como titular de tus datos personales, tienes derecho a ejercer en cualquier momento
              los siguientes derechos, conforme al <b>Capítulo IV de la LFPDPPP</b>:
            </p>
            <ul>
              <li><b>Acceso:</b> Conocer qué datos personales tenemos de ti y cómo los usamos.</li>
              <li><b>Rectificación:</b> Solicitar la corrección de tus datos si son inexactos o incompletos.</li>
              <li><b>Cancelación:</b> Pedir la eliminación de tus datos cuando consideres que no son necesarios para la finalidad del tratamiento.</li>
              <li><b>Oposición:</b> Oponerte al tratamiento de tus datos para finalidades específicas.</li>
            </ul>
            <div className="ap-arco">
              <p>
                Para ejercer tus derechos ARCO, envía un correo a:
              </p>
              <a href="mailto:contacto@propiedadesenchiapas.com" className="ap-email">
                <Mail size={15} strokeWidth={2.4} />
                contacto@propiedadesenchiapas.com
              </a>
              <p style={{ marginTop: 12 }}>
                Tu solicitud debe incluir: nombre completo, descripción clara del derecho que deseas
                ejercer y, en su caso, documentos que acrediten tu identidad o representación legal.
                Atenderemos tu solicitud en un plazo máximo de <b>20 días hábiles</b> conforme a la ley.
              </p>
            </div>
          </section>

          {/* 5. Cookies y tecnologías de rastreo */}
          <section className="ap-section" aria-labelledby="sec-cookies">
            <div className="ap-section-title" id="sec-cookies">
              <span className="ap-section-num">5</span>
              Uso de cookies y tecnologías de rastreo
            </div>
            <p>
              Este sitio web puede utilizar <b>cookies</b> y otras tecnologías de seguimiento para
              mejorar la experiencia del usuario y analizar el comportamiento en el portal.
              Las tecnologías que se encuentran o podrán activarse incluyen:
            </p>
            <ul>
              <li>
                <b>Google Analytics 4 (GA4):</b> Herramienta de análisis de tráfico web de Google LLC.
                Recopila datos de sesión, páginas visitadas y eventos de interacción de forma
                anonimizada. Puedes optar por no participar mediante la extensión de inhabilitación
                de Google Analytics para navegadores disponible en{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer noopener" style={{ color:'var(--emerald)', fontWeight:700 }}>
                  tools.google.com/dlpage/gaoptout
                </a>.
              </li>
              <li>
                <b>Meta Pixel (Facebook Pixel):</b> Herramienta de seguimiento de conversiones de
                Meta Platforms, Inc. Permite medir la efectividad de anuncios publicitarios. Los
                datos recopilados se rigen por la política de privacidad de Meta. Puedes gestionar
                tus preferencias en{' '}
                <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noreferrer noopener" style={{ color:'var(--emerald)', fontWeight:700 }}>
                  facebook.com/privacy/policy
                </a>.
              </li>
            </ul>
            <p>
              Puedes deshabilitar las cookies desde la configuración de tu navegador. Ten en cuenta
              que deshabilitar cookies puede afectar la funcionalidad del sitio.
            </p>
          </section>

          {/* 6. Transferencias de datos */}
          <section className="ap-section" aria-labelledby="sec-transferencias">
            <div className="ap-section-title" id="sec-transferencias">
              <span className="ap-section-num">6</span>
              Transferencias de datos personales
            </div>
            <p>
              El Responsable podrá compartir tus datos personales con los siguientes terceros, en la
              medida estrictamente necesaria para prestar el servicio:
            </p>
            <ul>
              <li>
                <b>Supabase, Inc.:</b> Proveedor de infraestructura de base de datos y autenticación
                en la nube (backend as a service). Los datos se almacenan en servidores con medidas
                de seguridad técnicas y organizativas adecuadas.
              </li>
              <li>
                <b>Proveedor de hosting:</b> Servicio de alojamiento del sitio web y entrega de
                contenidos.
              </li>
            </ul>
            <p>
              Estas transferencias se realizan exclusivamente con proveedores de servicios que
              actúan como <b>encargados del tratamiento</b> y no para finalidades propias distintas.
              El Responsable no vende, renta ni comparte datos personales con terceros con fines
              comerciales ajenos a la plataforma.
            </p>
            <p>
              En casos requeridos por ley o autoridad competente, los datos podrán ser divulgados
              conforme al artículo 37 de la LFPDPPP, sin requerir consentimiento del titular.
            </p>
          </section>

          {/* 7. Cambios al aviso */}
          <section className="ap-section" aria-labelledby="sec-cambios">
            <div className="ap-section-title" id="sec-cambios">
              <span className="ap-section-num">7</span>
              Cambios al Aviso de Privacidad
            </div>
            <p>
              El Responsable se reserva el derecho de modificar el presente Aviso de Privacidad en
              cualquier momento para reflejar cambios en sus prácticas de manejo de datos, en la
              legislación aplicable o en los servicios ofrecidos.
            </p>
            <p>
              Cualquier modificación relevante será notificada a través del sitio web{' '}
              <a href="https://propiedadesenchiapas.com/privacidad" style={{ color:'var(--emerald)', fontWeight:700 }}>
                propiedadesenchiapas.com/privacidad
              </a>. Se recomienda revisar periódicamente esta página. El uso continuado del sitio
              después de la publicación de cambios constituye la aceptación de dichos cambios.
            </p>
          </section>

          {/* 8. Fecha de actualización */}
          <section className="ap-section" aria-labelledby="sec-fecha">
            <div className="ap-section-title" id="sec-fecha">
              <span className="ap-section-num">8</span>
              Fecha de última actualización
            </div>
            <p>
              El presente Aviso de Privacidad fue revisado y actualizado por última vez el{' '}
              <b>{FECHA}</b>.
            </p>
            <p>
              Para cualquier duda o aclaración relacionada con el tratamiento de tus datos
              personales, contacta al Responsable en:
            </p>
            <a href="mailto:contacto@propiedadesenchiapas.com" className="ap-email">
              <Mail size={15} strokeWidth={2.4} />
              contacto@propiedadesenchiapas.com
            </a>
          </section>

        </main>

        {/* ── Footer ── */}
        <footer className="ap-ft">
          <div className="ap-ft-in">
            <b>Propiedades en Chiapas</b>
            <div className="ap-ft-links">
              <a href="/">Inicio</a>
              <a href="/privacidad" aria-current="page" style={{ color: 'rgba(255,255,255,.85)' }}>Aviso de Privacidad</a>
              <a href="/asesores">Para asesores</a>
            </div>
            <span style={{ fontSize: 12 }}>
              © {new Date().getFullYear()} Propiedades en Chiapas · IBR Agencia Digital · Chiapas, México
            </span>
          </div>
        </footer>

      </div>
    </>
  );
}

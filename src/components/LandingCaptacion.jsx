import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../supabaseClient';

// ── Paleta de colores ────────────────────────────────────────────────────────
const C = {
  verde:       '#064e3b',
  verdeOsc:    '#022c22',
  verdeMed:    '#065f46',
  verdeClaro:  '#10b981',
  verdeAcento: '#34d399',
  blanco:      '#ffffff',
  grisClaro:   '#f0fdf4',
  grisTexto:   '#475569',
  grisOsc:     '#1e293b',
  border:      '#d1fae5',
  dorado:      '#f59e0b',
};

// ── Estilos reutilizables ─────────────────────────────────────────────────────
const S = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' },
  btnPrimario: {
    display: 'inline-block', background: C.verdeClaro, color: C.blanco,
    border: 'none', borderRadius: '12px', padding: '1rem 2.5rem',
    fontWeight: '800', fontSize: '1.05rem', cursor: 'pointer',
    transition: 'all 0.2s', letterSpacing: '-0.01em',
    boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
  },
  btnSecundario: {
    display: 'inline-block', background: 'transparent', color: C.blanco,
    border: `2px solid rgba(255,255,255,0.4)`, borderRadius: '12px',
    padding: '0.9rem 2rem', fontWeight: '700', fontSize: '1rem',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  badge: {
    display: 'inline-block', background: 'rgba(52,211,153,0.15)',
    color: C.verdeAcento, border: '1px solid rgba(52,211,153,0.3)',
    borderRadius: '999px', padding: '0.35rem 1rem',
    fontSize: '0.82rem', fontWeight: '700', letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
};

// ── Datos de la página ────────────────────────────────────────────────────────
const BENEFICIOS = [
  {
    icon: '🏠',
    titulo: 'Portal de Propiedades',
    desc: 'Publica tus inmuebles y llega a miles de compradores en Chiapas con fotos profesionales y ficha técnica descargable.',
  },
  {
    icon: '📇',
    titulo: 'Tarjeta Digital Profesional',
    desc: 'Tu tarjeta de presentación digital con enlace propio, foto, redes y WhatsApp. Compártela en segundos desde el celular.',
  },
  {
    icon: '📊',
    titulo: 'CRM Inmobiliario',
    desc: 'Gestiona clientes, propiedades activas, visitas y seguimientos desde un panel intuitivo, sin hojas de cálculo.',
  },
  {
    icon: '📈',
    titulo: 'Analíticas en Tiempo Real',
    desc: 'Saber cuántas personas ven tus propiedades, de dónde vienen y qué buscan para tomar mejores decisiones.',
  },
  {
    icon: '🔔',
    titulo: 'Alertas por WhatsApp',
    desc: 'Recibe notificaciones instantáneas cuando un cliente contacta alguna de tus propiedades.',
  },
  {
    icon: '🤝',
    titulo: 'Red de Asesores IBR',
    desc: 'Colabora con otros asesores para co-propiedades y comparte comisiones dentro de la plataforma.',
  },
];

const PASOS = [
  { num: '01', titulo: 'Regístrate gratis', desc: 'Crea tu cuenta con tu correo. Sin tarjeta de crédito, sin compromiso.' },
  { num: '02', titulo: 'Configura tu perfil', desc: 'Agrega tu foto, datos de contacto y crea tu tarjeta digital en minutos.' },
  { num: '03', titulo: 'Publica propiedades', desc: 'Sube tus inmuebles con fotos, descripción y precio. El portal hace el resto.' },
];

const PLANES = [
  {
    id: 'mensual',
    nombre: 'Mensual',
    precio: '$399',
    periodo: '/ mes',
    ahorro: null,
    destacado: false,
    features: [
      'Propiedades ilimitadas',
      'Tarjeta digital profesional',
      'CRM completo',
      'Analíticas básicas',
      'Soporte por WhatsApp',
    ],
  },
  {
    id: 'anual',
    nombre: 'Anual',
    precio: '$3,499',
    periodo: '/ año',
    ahorro: 'Ahorra $1,289 · 2 meses gratis',
    destacado: true,
    features: [
      'Todo lo del plan mensual',
      'Analíticas avanzadas + exportar',
      'Posición prioritaria en búsquedas',
      'Personalización de tarjeta digital',
      'Soporte prioritario 7 días',
    ],
  },
];

const TESTIMONIOS = [
  {
    nombre: 'Mariela Hernández',
    cargo: 'Asesora Independiente · Tuxtla Gutiérrez',
    avatar: 'MH',
    texto: '"En mi primer mes publiqué 8 propiedades y cerré 2 ventas. La tarjeta digital me ahorra explicar quién soy a cada cliente."',
    estrellas: 5,
  },
  {
    nombre: 'Carlos Domínguez',
    cargo: 'Agente · IBR Inmobiliaria · San Cristóbal',
    avatar: 'CD',
    texto: '"El CRM es sencillo pero completo. Ya no pierdo clientes porque me olvido de hacer seguimiento. Vale cada peso."',
    estrellas: 5,
  },
  {
    nombre: 'Sofía Ruiz',
    cargo: 'Broker · Tapachula',
    avatar: 'SR',
    texto: '"El plan anual es el mejor negocio que hice este año. Me posiciona primero en Chiapas y el soporte responde en minutos."',
    estrellas: 5,
  },
];

const FAQS = [
  {
    q: '¿Necesito conocimientos técnicos para usar la plataforma?',
    a: 'No. Si sabes usar WhatsApp, sabes usar nuestra plataforma. Todo está diseñado para ser simple y rápido.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí. En el plan mensual cancelas en cualquier momento sin penalizaciones. En el plan anual, tu acceso se mantiene hasta el vencimiento.',
  },
  {
    q: '¿Cuántas propiedades puedo publicar?',
    a: 'Ilimitadas. No ponemos techo a tu inventario porque queremos que crezcas sin restricciones.',
  },
  {
    q: '¿Qué pasa después de los 14 días gratis?',
    a: 'Te avisamos 3 días antes de que termine el periodo de prueba. Si eliges no suscribirte, tu cuenta queda en modo lectura.',
  },
  {
    q: '¿Mis clientes ven mi información de contacto?',
    a: 'Sí. Cada propiedad muestra tu foto, nombre, WhatsApp y enlace a tu tarjeta digital. Eres tú quien cierra la venta.',
  },
];

// ── Componente principal ──────────────────────────────────────────────────────
export default function LandingCaptacion() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState('mensual');
  const [faqAbierta, setFaqAbierta] = useState(null);

  // Estado del formulario OTP
  const [paso, setPaso] = useState(1); // 1 = email, 2 = código OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const abrirModal = (planId) => {
    setPlanSeleccionado(planId);
    setModalAbierto(true);
    setPaso(1);
    setEmail('');
    setOtp('');
    setMensaje({ tipo: '', texto: '' });
  };

  // Paso 1 — enviar OTP al correo
  const enviarOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });

    if (error) {
      setMensaje({ tipo: 'error', texto: 'No pudimos enviar el código. Verifica el correo e intenta de nuevo.' });
    } else {
      setMensaje({ tipo: 'ok', texto: `Código enviado a ${email}. Revisa tu bandeja de entrada y spam.` });
      setPaso(2);
    }
    setCargando(false);
  };

  // Paso 2 — verificar OTP
  const verificarOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setCargando(true);
    setMensaje({ tipo: '', texto: '' });

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp.trim(),
      type: 'email',
    });

    if (error) {
      setMensaje({ tipo: 'error', texto: 'Código incorrecto o expirado. Vuelve a intentarlo.' });
    } else {
      setMensaje({ tipo: 'ok', texto: '¡Listo! Bienvenido a Propiedades en Chiapas. Redirigiendo...' });
      setTimeout(() => { window.location.href = '/crm'; }, 1500);
    }
    setCargando(false);
  };

  return (
    <>
      {/* ── OG / SEO Tags ─────────────────────────────────────────────── */}
      <Helmet>
        <title>Únete como Asesor Inmobiliario · Propiedades en Chiapas</title>
        <meta name="description" content="Publica propiedades, obtén tu tarjeta digital y gestiona clientes con el CRM inmobiliario #1 en Chiapas. 14 días gratis. Desde $399 MXN/mes." />
        <meta property="og:title" content="Crece como Asesor Inmobiliario en Chiapas — 14 días gratis" />
        <meta property="og:description" content="Portal de propiedades + Tarjeta Digital + CRM. Todo lo que necesitas para vender más. Desde $399 MXN/mes." />
        <meta property="og:image" content="https://propiedadesenchiapas.com/og-asesores.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://propiedadesenchiapas.com/asesores" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Crece como Asesor Inmobiliario en Chiapas" />
        <meta name="twitter:description" content="14 días gratis. Portal + CRM + Tarjeta Digital. Desde $399 MXN/mes." />
        <meta name="twitter:image" content="https://propiedadesenchiapas.com/og-asesores.jpg" />
      </Helmet>

      <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", color: C.grisOsc, background: C.blanco }}>

        {/* ════════════════════════════════════════════════════════════════
            NAVBAR
        ════════════════════════════════════════════════════════════════ */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 200,
          background: C.verdeOsc, borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '0.85rem 0',
        }}>
          <div style={{ ...S.container, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '8px',
                background: C.verdeClaro, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
              }}>🏡</div>
              <span style={{ color: C.blanco, fontWeight: '800', fontSize: '1rem', letterSpacing: '-0.02em' }}>
                Propiedades <span style={{ color: C.verdeAcento }}>Chiapas</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <a href="/" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', fontWeight: '600', textDecoration: 'none' }}>
                Ver propiedades
              </a>
              <button
                onClick={() => abrirModal('mensual')}
                style={{ ...S.btnPrimario, padding: '0.6rem 1.4rem', fontSize: '0.88rem', borderRadius: '8px' }}
              >
                Empezar gratis
              </button>
            </div>
          </div>
        </nav>

        {/* ════════════════════════════════════════════════════════════════
            HERO
        ════════════════════════════════════════════════════════════════ */}
        <section style={{
          background: `linear-gradient(135deg, ${C.verdeOsc} 0%, ${C.verdeMed} 60%, #0a7c52 100%)`,
          padding: '6rem 0 7rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decoración de fondo */}
          <div style={{
            position: 'absolute', top: '-80px', right: '-80px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'rgba(16,185,129,0.08)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-100px', left: '-100px',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'rgba(52,211,153,0.06)', pointerEvents: 'none',
          }} />

          <div style={{ ...S.container, position: 'relative', textAlign: 'center' }}>
            <span style={S.badge}>✦ Plataforma #1 para asesores en Chiapas</span>

            <h1 style={{
              color: C.blanco, fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: '900', lineHeight: '1.1', marginTop: '1.5rem',
              letterSpacing: '-0.03em', maxWidth: '800px', margin: '1.5rem auto 0',
            }}>
              Vende más propiedades<br />
              <span style={{ color: C.verdeAcento }}>con las herramientas correctas</span>
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.78)', fontSize: '1.15rem',
              maxWidth: '580px', margin: '1.5rem auto 0', lineHeight: '1.65',
              fontWeight: '400',
            }}>
              Portal de propiedades + Tarjeta Digital profesional + CRM inmobiliario.
              Todo lo que un asesor en Chiapas necesita, en un solo lugar.
            </p>

            {/* Prueba social rápida */}
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              gap: '0.5rem', marginTop: '1.75rem',
            }}>
              <div style={{ display: 'flex' }}>
                {['A','B','C','D'].map((l, i) => (
                  <div key={l} style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: `hsl(${140 + i * 25}, 55%, 42%)`,
                    border: '2px solid rgba(255,255,255,0.3)',
                    marginLeft: i === 0 ? 0 : '-8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', color: C.blanco, fontWeight: '700',
                  }}>{l}</div>
                ))}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', fontWeight: '500' }}>
                +120 asesores activos ya en la plataforma
              </span>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2.5rem' }}>
              <button onClick={() => abrirModal('mensual')} style={S.btnPrimario}>
                Empieza gratis 14 días →
              </button>
              <button
                onClick={() => document.getElementById('precios').scrollIntoView({ behavior: 'smooth' })}
                style={S.btnSecundario}
              >
                Ver planes y precios
              </button>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginTop: '1rem' }}>
              Sin tarjeta de crédito · Cancela cuando quieras
            </p>

            {/* Mockup visual simplificado */}
            <div style={{
              marginTop: '4rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px',
              padding: '1.5rem',
              maxWidth: '780px',
              margin: '4rem auto 0',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
                {['#ff5f57','#febc2e','#28c840'].map(c => (
                  <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Propiedades activas', val: '247', icon: '🏠' },
                  { label: 'Asesores registrados', val: '124', icon: '👥' },
                  { label: 'Contactos este mes', val: '1,842', icon: '💬' },
                ].map(item => (
                  <div key={item.label} style={{
                    background: 'rgba(255,255,255,0.07)', borderRadius: '12px',
                    padding: '1rem', textAlign: 'left',
                  }}>
                    <div style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{item.icon}</div>
                    <div style={{ color: C.blanco, fontSize: '1.6rem', fontWeight: '800', lineHeight: 1 }}>{item.val}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            BENEFICIOS
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '6rem 0', background: C.blanco }}>
          <div style={S.container}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ ...S.badge, background: '#f0fdf4', color: C.verdeMed, border: `1px solid ${C.border}` }}>
                Herramientas
              </span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '800',
                marginTop: '1rem', letterSpacing: '-0.02em', color: C.grisOsc,
              }}>
                Todo lo que necesitas para <span style={{ color: C.verdeMed }}>vender más</span>
              </h2>
              <p style={{ color: C.grisTexto, fontSize: '1.05rem', maxWidth: '500px', margin: '0.75rem auto 0', lineHeight: '1.6' }}>
                Diseñado específicamente para asesores inmobiliarios en Chiapas.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}>
              {BENEFICIOS.map((b) => (
                <div key={b.titulo} style={{
                  background: C.grisClaro, borderRadius: '16px',
                  padding: '2rem 1.75rem',
                  border: `1px solid ${C.border}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: C.blanco, border: `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', marginBottom: '1.25rem',
                    boxShadow: '0 2px 8px rgba(6,78,59,0.08)',
                  }}>
                    {b.icon}
                  </div>
                  <h3 style={{ fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.5rem', color: C.grisOsc }}>
                    {b.titulo}
                  </h3>
                  <p style={{ color: C.grisTexto, fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            CÓMO FUNCIONA
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '6rem 0', background: C.grisClaro, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
          <div style={S.container}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ ...S.badge, background: '#f0fdf4', color: C.verdeMed, border: `1px solid ${C.border}` }}>
                Proceso
              </span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '800',
                marginTop: '1rem', letterSpacing: '-0.02em',
              }}>
                Empieza a vender en <span style={{ color: C.verdeMed }}>3 pasos</span>
              </h2>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem', position: 'relative',
            }}>
              {PASOS.map((paso, i) => (
                <div key={paso.num} style={{ textAlign: 'center', padding: '0 1rem' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: C.verde, color: C.blanco,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', fontWeight: '900', margin: '0 auto 1.25rem',
                    boxShadow: '0 4px 20px rgba(6,78,59,0.25)',
                  }}>
                    {paso.num}
                  </div>
                  <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{paso.titulo}</h3>
                  <p style={{ color: C.grisTexto, fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>{paso.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button onClick={() => abrirModal('mensual')} style={S.btnPrimario}>
                Crear mi cuenta gratis →
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            PRECIOS
        ════════════════════════════════════════════════════════════════ */}
        <section id="precios" style={{ padding: '6rem 0', background: C.blanco }}>
          <div style={S.container}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span style={{ ...S.badge, background: '#f0fdf4', color: C.verdeMed, border: `1px solid ${C.border}` }}>
                Planes
              </span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '800',
                marginTop: '1rem', letterSpacing: '-0.02em',
              }}>
                Invierte menos de lo que ganas <span style={{ color: C.verdeMed }}>en una comisión</span>
              </h2>
              <p style={{ color: C.grisTexto, maxWidth: '480px', margin: '0.75rem auto 0', lineHeight: '1.6' }}>
                14 días gratis para probar todo sin compromisos.
              </p>
            </div>

            <div style={{
              display: 'flex', gap: '1.5rem', justifyContent: 'center',
              flexWrap: 'wrap', alignItems: 'stretch',
            }}>
              {PLANES.map((plan) => (
                <div key={plan.id} style={{
                  width: '100%', maxWidth: '380px', borderRadius: '20px',
                  padding: '2.5rem 2rem',
                  background: plan.destacado ? C.verde : C.blanco,
                  border: plan.destacado ? 'none' : `2px solid ${C.border}`,
                  boxShadow: plan.destacado ? '0 20px 50px rgba(6,78,59,0.3)' : '0 2px 12px rgba(0,0,0,0.06)',
                  position: 'relative', overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                }}>
                  {plan.destacado && (
                    <div style={{
                      position: 'absolute', top: '1.25rem', right: '-2rem',
                      background: C.dorado, color: '#1e0', padding: '0.3rem 3rem',
                      fontSize: '0.75rem', fontWeight: '800', transform: 'rotate(35deg)',
                      color: C.verdeOsc, letterSpacing: '0.05em',
                    }}>
                      MÁS POPULAR
                    </div>
                  )}

                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{
                      fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: plan.destacado ? C.verdeAcento : C.verdeMed,
                      marginBottom: '0.5rem',
                    }}>
                      {plan.nombre}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                      <span style={{
                        fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.03em',
                        color: plan.destacado ? C.blanco : C.grisOsc,
                      }}>
                        {plan.precio}
                      </span>
                      <span style={{
                        color: plan.destacado ? 'rgba(255,255,255,0.55)' : C.grisTexto,
                        fontSize: '0.95rem',
                      }}>
                        {plan.periodo}
                      </span>
                    </div>
                    {plan.ahorro && (
                      <span style={{
                        display: 'inline-block', marginTop: '0.5rem',
                        background: 'rgba(52,211,153,0.2)', color: C.verdeAcento,
                        borderRadius: '999px', padding: '0.25rem 0.75rem',
                        fontSize: '0.78rem', fontWeight: '700',
                      }}>
                        {plan.ahorro}
                      </span>
                    )}
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', flex: 1 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
                        padding: '0.55rem 0',
                        borderBottom: `1px solid ${plan.destacado ? 'rgba(255,255,255,0.08)' : C.border}`,
                        fontSize: '0.92rem',
                        color: plan.destacado ? 'rgba(255,255,255,0.88)' : C.grisTexto,
                      }}>
                        <span style={{ color: C.verdeAcento, fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => abrirModal(plan.id)}
                    style={{
                      width: '100%', padding: '1rem',
                      borderRadius: '12px', border: 'none',
                      fontWeight: '800', fontSize: '1rem', cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: plan.destacado ? C.verdeAcento : C.verde,
                      color: plan.destacado ? C.verdeOsc : C.blanco,
                      boxShadow: plan.destacado ? '0 4px 14px rgba(52,211,153,0.4)' : 'none',
                    }}
                  >
                    Empezar 14 días gratis
                  </button>

                  <p style={{
                    textAlign: 'center', marginTop: '0.75rem',
                    fontSize: '0.78rem',
                    color: plan.destacado ? 'rgba(255,255,255,0.4)' : '#94a3b8',
                  }}>
                    Sin tarjeta de crédito
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            TESTIMONIOS
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '6rem 0', background: C.grisClaro, borderTop: `1px solid ${C.border}` }}>
          <div style={S.container}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{ ...S.badge, background: '#f0fdf4', color: C.verdeMed, border: `1px solid ${C.border}` }}>
                Testimonios
              </span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: '800',
                marginTop: '1rem', letterSpacing: '-0.02em',
              }}>
                Asesores que ya están <span style={{ color: C.verdeMed }}>vendiendo más</span>
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '1.5rem',
            }}>
              {TESTIMONIOS.map((t) => (
                <div key={t.nombre} style={{
                  background: C.blanco, borderRadius: '16px',
                  padding: '2rem 1.75rem',
                  border: `1px solid ${C.border}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                    {Array.from({ length: t.estrellas }).map((_, i) => (
                      <span key={i} style={{ color: C.dorado, fontSize: '1rem' }}>★</span>
                    ))}
                  </div>
                  <p style={{ color: C.grisTexto, fontSize: '0.95rem', lineHeight: '1.65', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                    {t.texto}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: C.verde, color: C.blanco,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '800', fontSize: '0.85rem', flexShrink: 0,
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: 0, color: C.grisOsc }}>{t.nombre}</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: 0 }}>{t.cargo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            FAQ
        ════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '6rem 0', background: C.blanco }}>
          <div style={{ ...S.container, maxWidth: '720px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{ ...S.badge, background: '#f0fdf4', color: C.verdeMed, border: `1px solid ${C.border}` }}>
                FAQ
              </span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: '800',
                marginTop: '1rem', letterSpacing: '-0.02em',
              }}>
                Preguntas frecuentes
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {FAQS.map((faq, i) => (
                <div key={i} style={{
                  border: `1px solid ${C.border}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: faqAbierta === i ? C.grisClaro : C.blanco,
                  transition: 'background 0.2s',
                }}>
                  <button
                    onClick={() => setFaqAbierta(faqAbierta === i ? null : i)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '1.1rem 1.5rem',
                      background: 'none', border: 'none', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <span style={{ fontWeight: '700', fontSize: '0.97rem', color: C.grisOsc, lineHeight: '1.4' }}>
                      {faq.q}
                    </span>
                    <span style={{
                      color: C.verdeMed, fontSize: '1.2rem', fontWeight: '700',
                      flexShrink: 0, transition: 'transform 0.2s',
                      transform: faqAbierta === i ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}>
                      +
                    </span>
                  </button>
                  {faqAbierta === i && (
                    <div style={{ padding: '0 1.5rem 1.25rem', color: C.grisTexto, fontSize: '0.92rem', lineHeight: '1.65' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            CTA FINAL
        ════════════════════════════════════════════════════════════════ */}
        <section style={{
          background: `linear-gradient(135deg, ${C.verdeOsc} 0%, ${C.verdeMed} 100%)`,
          padding: '6rem 0', textAlign: 'center',
        }}>
          <div style={S.container}>
            <h2 style={{
              color: C.blanco, fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: '900', letterSpacing: '-0.03em',
              maxWidth: '700px', margin: '0 auto',
            }}>
              Tu siguiente cierre empieza<br />
              <span style={{ color: C.verdeAcento }}>con el portal correcto</span>
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem',
              maxWidth: '460px', margin: '1.25rem auto 0', lineHeight: '1.6',
            }}>
              Únete a los asesores que ya usan Propiedades en Chiapas.
              14 días gratis, sin tarjeta de crédito.
            </p>
            <div style={{ marginTop: '2.5rem' }}>
              <button onClick={() => abrirModal('anual')} style={{
                ...S.btnPrimario,
                fontSize: '1.1rem', padding: '1.1rem 3rem',
                background: C.verdeAcento, color: C.verdeOsc,
                boxShadow: '0 6px 24px rgba(52,211,153,0.4)',
              }}>
                Comenzar 14 días gratis →
              </button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '1rem' }}>
              Sin tarjeta de crédito · Cancela cuando quieras
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════════════════════════ */}
        <footer style={{ background: C.verdeOsc, padding: '2rem 0' }}>
          <div style={{
            ...S.container,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '0.75rem',
          }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              © 2026 Propiedades en Chiapas · Todos los derechos reservados
            </span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacidad', 'Términos', 'Contacto'].map(l => (
                <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '500' }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MODAL DE REGISTRO — OTP
      ════════════════════════════════════════════════════════════════ */}
      {modalAbierto && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setModalAbierto(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(2,44,34,0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
          }}
        >
          <div style={{
            background: C.blanco, borderRadius: '24px',
            width: '100%', maxWidth: '440px',
            padding: '2.5rem 2rem',
            boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
            position: 'relative',
          }}>
            {/* Cerrar */}
            <button
              onClick={() => setModalAbierto(false)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: '#f1f5f9', border: 'none', width: '32px', height: '32px',
                borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', color: '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>

            {/* Encabezado */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: C.grisClaro, border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', margin: '0 auto 1rem',
              }}>
                🏡
              </div>
              <h3 style={{ fontWeight: '800', fontSize: '1.3rem', marginBottom: '0.4rem', color: C.grisOsc }}>
                {paso === 1 ? 'Crea tu cuenta gratis' : 'Verifica tu correo'}
              </h3>
              <p style={{ color: C.grisTexto, fontSize: '0.9rem', lineHeight: '1.5' }}>
                {paso === 1
                  ? `Plan ${planSeleccionado === 'anual' ? 'Anual · $3,499 MXN' : 'Mensual · $399 MXN'} · 14 días gratis`
                  : `Ingresa el código de 6 dígitos que enviamos a ${email}`}
              </p>
            </div>

            {/* Indicador de pasos */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '1.75rem', justifyContent: 'center' }}>
              {[1, 2].map(n => (
                <div key={n} style={{
                  height: '4px', flex: 1, borderRadius: '4px',
                  background: n <= paso ? C.verdeClaro : '#e2e8f0',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            {/* Formulario paso 1 — Email */}
            {paso === 1 && (
              <form onSubmit={enviarOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.4rem', color: C.grisOsc }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: '100%', padding: '0.85rem 1rem',
                      border: `1.5px solid ${C.border}`, borderRadius: '10px',
                      fontSize: '1rem', color: C.grisOsc, outline: 'none',
                      transition: 'border-color 0.2s', boxSizing: 'border-box',
                      background: C.blanco,
                    }}
                    onFocus={e => e.target.style.borderColor = C.verdeClaro}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>

                {mensaje.texto && (
                  <div style={{
                    padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500',
                    background: mensaje.tipo === 'error' ? '#fef2f2' : '#f0fdf4',
                    color: mensaje.tipo === 'error' ? '#dc2626' : C.verdeMed,
                    border: `1px solid ${mensaje.tipo === 'error' ? '#fecaca' : C.border}`,
                  }}>
                    {mensaje.texto}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  style={{
                    ...S.btnPrimario, width: '100%', textAlign: 'center',
                    opacity: cargando ? 0.65 : 1,
                    cursor: cargando ? 'not-allowed' : 'pointer',
                  }}
                >
                  {cargando ? 'Enviando código...' : 'Enviar código de acceso →'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                  Al registrarte aceptas nuestros{' '}
                  <a href="#" style={{ color: C.verdeMed, textDecoration: 'none', fontWeight: '600' }}>Términos</a>
                  {' '}y{' '}
                  <a href="#" style={{ color: C.verdeMed, textDecoration: 'none', fontWeight: '600' }}>Privacidad</a>.
                </p>
              </form>
            )}

            {/* Formulario paso 2 — OTP */}
            {paso === 2 && (
              <form onSubmit={verificarOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.4rem', color: C.grisOsc }}>
                    Código de verificación (6 dígitos)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '100%', padding: '0.85rem 1rem',
                      border: `1.5px solid ${C.border}`, borderRadius: '10px',
                      fontSize: '1.6rem', letterSpacing: '0.4em', textAlign: 'center',
                      color: C.grisOsc, outline: 'none', transition: 'border-color 0.2s',
                      boxSizing: 'border-box', fontWeight: '700',
                    }}
                    onFocus={e => e.target.style.borderColor = C.verdeClaro}
                    onBlur={e => e.target.style.borderColor = C.border}
                    autoFocus
                  />
                </div>

                {mensaje.texto && (
                  <div style={{
                    padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500',
                    background: mensaje.tipo === 'error' ? '#fef2f2' : '#f0fdf4',
                    color: mensaje.tipo === 'error' ? '#dc2626' : C.verdeMed,
                    border: `1px solid ${mensaje.tipo === 'error' ? '#fecaca' : C.border}`,
                  }}>
                    {mensaje.texto}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargando || otp.length < 6}
                  style={{
                    ...S.btnPrimario, width: '100%', textAlign: 'center',
                    opacity: (cargando || otp.length < 6) ? 0.55 : 1,
                    cursor: (cargando || otp.length < 6) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {cargando ? 'Verificando...' : 'Verificar y entrar →'}
                </button>

                <button
                  type="button"
                  onClick={() => { setPaso(1); setOtp(''); setMensaje({ tipo: '', texto: '' }); }}
                  style={{
                    background: 'none', border: 'none', color: C.grisTexto,
                    fontSize: '0.85rem', cursor: 'pointer', padding: '0.25rem',
                    textDecoration: 'underline', textUnderlineOffset: '2px',
                  }}
                >
                  ← Cambiar correo
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

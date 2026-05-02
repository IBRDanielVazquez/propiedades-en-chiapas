import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../supabaseClient';

// ── Paleta ────────────────────────────────────────────────────────────────────
const C = {
  marino:    '#1A1A6E',
  marinoOsc: '#0D0D4A',
  verde:     '#2E7D32',
  verdeBt:   '#25D366',
  morado:    '#7B3FBE',
  dorado:    '#C9A84C',
  blanco:    '#FFFFFF',
  negro:     '#0A0A0A',
  grisClaro: '#F5F5F5',
  grisTexto: '#6B7280',
  grisOsc:   '#374151',
};

// ── Keyframes inyectados en el DOM ────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(46,125,50,0.55); }
    70%  { box-shadow: 0 0 0 14px rgba(46,125,50,0); }
    100% { box-shadow: 0 0 0 0 rgba(46,125,50,0); }
  }
  @keyframes pulse-badge {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .85; transform: scale(1.03); }
  }
  @keyframes float-card {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50%       { transform: translateY(-14px) rotate(-2deg); }
  }
  @keyframes blink-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes pulse-wa {
    0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.6); }
    70%  { box-shadow: 0 0 0 18px rgba(37,211,102,0); }
    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @media (max-width: 768px) {
    .hero-grid    { grid-template-columns: 1fr !important; }
    .three-col    { grid-template-columns: 1fr !important; }
    .two-col      { grid-template-columns: 1fr !important; }
    .four-col     { grid-template-columns: 1fr 1fr !important; }
    .plans-grid   { grid-template-columns: 1fr !important; }
    .hide-mobile  { display: none !important; }
    .navbar-links { display: none !important; }
    .ficha-grid   { grid-template-columns: 1fr !important; }
    .specs-grid   { grid-template-columns: 1fr 1fr !important; }
  }
`;

// ── Ícono WhatsApp SVG ────────────────────────────────────────────────────────
const WAIcon = ({ size = 28, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.848L.057 23.743a.75.75 0 0 0 .921.921l5.895-1.465A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 0 1-4.95-1.355l-.355-.213-3.681.915.93-3.594-.233-.371A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

// ── Patrón SVG de casas (fondo hero) ─────────────────────────────────────────
const HousePattern = () => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.05, pointerEvents:'none' }}
    xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="houses" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M40 10 L10 34 L16 34 L16 62 L36 62 L36 46 L44 46 L44 62 L64 62 L64 34 L70 34 Z"
          fill="none" stroke="#ffffff" strokeWidth="1.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#houses)"/>
  </svg>
);

// ── Mockup tarjeta digital SVG ────────────────────────────────────────────────
const CardMockup = ({ small = false }) => {
  const w = small ? 280 : 340;
  const h = small ? 480 : 580;
  return (
    <div style={{
      width: w, background: C.blanco, borderRadius: 20,
      boxShadow: `0 30px 80px rgba(13,13,74,0.45), 0 0 0 1px rgba(255,255,255,0.1)`,
      overflow: 'hidden', flexShrink: 0,
      animation: small ? 'none' : 'float-card 4s ease-in-out infinite',
    }}>
      {/* Header marino */}
      <div style={{ background: `linear-gradient(135deg, ${C.marinoOsc}, ${C.marino})`, padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
        <div style={{ width:28, height:28, background: C.verde, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>🏡</div>
        <span style={{ color:C.blanco, fontWeight:800, fontSize:'0.85rem', letterSpacing:'-0.01em' }}>Propiedades <span style={{color:'#34d399'}}>Chiapas</span></span>
      </div>
      {/* Perfil */}
      <div style={{ padding:'1.5rem', textAlign:'center', borderBottom:`1px solid #f1f5f9` }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:`linear-gradient(135deg,${C.marino},${C.morado})`, margin:'0 auto 0.75rem', display:'flex', alignItems:'center', justifyContent:'center', color:C.blanco, fontWeight:800, fontSize:'1.3rem', border:`3px solid #e2e8f0` }}>CM</div>
        <p style={{ fontWeight:800, color:C.negro, fontSize:'1rem', margin:'0 0 0.2rem' }}>Carlos Mendoza</p>
        <p style={{ color:C.grisTexto, fontSize:'0.78rem', margin:0 }}>Asesor Inmobiliario · Chiapas</p>
      </div>
      {/* Botones contacto */}
      <div style={{ padding:'1rem 1.25rem', display:'flex', gap:'0.5rem' }}>
        {[
          { label:'WhatsApp', bg:'#25D366', icon:'💬' },
          { label:'Llamar',   bg: C.marino,  icon:'📞' },
          { label:'Email',    bg: C.morado,  icon:'✉️' },
        ].map(b => (
          <div key={b.label} style={{ flex:1, background:b.bg, borderRadius:8, padding:'0.5rem 0', textAlign:'center', cursor:'pointer' }}>
            <div style={{ fontSize:'0.9rem' }}>{b.icon}</div>
            <div style={{ color:C.blanco, fontSize:'0.62rem', fontWeight:700, marginTop:2 }}>{b.label}</div>
          </div>
        ))}
      </div>
      {/* Mini propiedades */}
      <div style={{ padding:'0 1.25rem 1rem' }}>
        <p style={{ fontWeight:700, fontSize:'0.75rem', color:C.grisOsc, marginBottom:'0.5rem' }}>MIS PROPIEDADES</p>
        {[
          { titulo:'Casa en Las Palmas', precio:'$2,500,000' },
          { titulo:'Terreno en Copoya',  precio:'$850,000' },
        ].map(p => (
          <div key={p.titulo} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:C.grisClaro, borderRadius:8, padding:'0.5rem 0.75rem', marginBottom:'0.4rem' }}>
            <span style={{ fontSize:'0.72rem', color:C.grisOsc, fontWeight:600 }}>{p.titulo}</span>
            <span style={{ fontSize:'0.72rem', color:C.marino, fontWeight:800 }}>{p.precio}</span>
          </div>
        ))}
      </div>
      {/* QR simulado */}
      <div style={{ padding:'0.75rem 1.25rem 1.25rem', textAlign:'center', borderTop:`1px solid #f1f5f9` }}>
        <div style={{ width:56, height:56, margin:'0 auto 0.4rem', background:`repeating-conic-gradient(${C.negro} 0% 25%, ${C.blanco} 0% 50%) 0 0 / 6px 6px`, borderRadius:4 }}/>
        <p style={{ color:C.grisTexto, fontSize:'0.65rem', margin:0 }}>Escanea para ver mi perfil</p>
      </div>
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────
export default function LandingCaptacion() {
  const [scrolled,    setScrolled]    = useState(false);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [planSel,     setPlanSel]     = useState('starter');
  const [faqOpen,     setFaqOpen]     = useState(null);
  const [paso,        setPaso]        = useState(1);
  const [email,       setEmail]       = useState('');
  const [otp,         setOtp]         = useState('');
  const [loading,     setLoading]     = useState(false);
  const [msg,         setMsg]         = useState({ tipo:'', texto:'' });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const abrirModal = (plan = 'starter') => {
    setPlanSel(plan); setModalOpen(true); setPaso(1);
    setEmail(''); setOtp(''); setMsg({ tipo:'', texto:'' });
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });

  // OTP paso 1
  const enviarOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true); setMsg({ tipo:'', texto:'' });
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });
    if (error) setMsg({ tipo:'error', texto:'No pudimos enviar el código. Verifica tu correo.' });
    else { setMsg({ tipo:'ok', texto:`Código enviado a ${email}. Revisa tu bandeja.` }); setPaso(2); }
    setLoading(false);
  };

  // OTP paso 2
  const verificarOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setLoading(true); setMsg({ tipo:'', texto:'' });
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: otp.trim(),
      type: 'email',
    });
    if (error) setMsg({ tipo:'error', texto:'Código incorrecto o expirado. Intenta de nuevo.' });
    else { setMsg({ tipo:'ok', texto:'¡Listo! Bienvenido. Redirigiendo...' }); setTimeout(() => { window.location.href = '/crm'; }, 1500); }
    setLoading(false);
  };

  const PLANES = [
    {
      id: 'starter',
      badge: 'EMPIEZA GRATIS', badgeColor: C.marino,
      nombre: 'STARTER',
      gratis: '14 días GRATIS',
      precio: '$150', periodo: 'MXN / mes',
      nota: null,
      borde: C.marino,
      btnBg: C.marino, btnColor: C.blanco,
      btnLabel: 'Empezar 14 días gratis →',
      destacado: false,
      features: [
        'Tarjeta digital profesional',
        '1 propiedad con ficha técnica completa',
        'QR personalizado',
        'Link único para Instagram y WhatsApp',
        'Perfil en catálogo de Chiapas',
        'Soporte por WhatsApp',
      ],
    },
    {
      id: 'semestral',
      badge: '⭐ AHORRA $300 AL AÑO', badgeColor: C.dorado,
      nombre: 'SEMESTRAL',
      gratis: null,
      precio: '$100', periodo: 'MXN / mes',
      nota: 'Cobro semestral: $600 MXN cada 6 meses',
      notaVerde: 'El favorito de los asesores activos',
      borde: C.dorado,
      btnBg: C.verde, btnColor: C.blanco,
      btnLabel: 'Elegir semestral →',
      destacado: true,
      features: [
        'Todo lo del plan Starter',
        'Propiedades ilimitadas',
        'Analíticas de visitas',
        'Posición destacada en búsquedas',
        'Soporte prioritario',
      ],
    },
    {
      id: 'anual',
      badge: 'MEJOR PRECIO', badgeColor: C.morado,
      nombre: 'ANUAL',
      gratis: null,
      precio: '$800', periodo: 'MXN / año',
      nota: 'Equivale a solo $66/mes · 2 meses gratis vs mensual',
      borde: C.morado,
      btnBg: C.morado, btnColor: C.blanco,
      btnLabel: 'Mejor valor →',
      destacado: false,
      features: [
        'Todo incluido sin límites',
        'Analíticas avanzadas + exportar',
        'Primera posición en búsquedas',
        'Personalización completa de tarjeta',
        'Soporte prioritario 7 días',
      ],
    },
  ];

  const FAQS = [
    { q:'¿Necesito saber de tecnología para usarlo?', a:'No. Si sabes usar WhatsApp, sabes usar esto. En 10 minutos tienes tu tarjeta lista y tus propiedades publicadas.' },
    { q:'¿Funciona para Instagram y WhatsApp?', a:'Sí, está diseñado específicamente para compartir en redes. Tu ficha técnica y tarjeta son perfectas para stories, mensajes directos y tu bio.' },
    { q:'¿Puedo cancelar cuando quiera?', a:'Sí, sin penalizaciones ni letras pequeñas. Cancelas desde tu perfil y listo. Tu acceso continúa hasta el vencimiento del periodo pagado.' },
    { q:'¿Mi perfil aparece en Google?', a:'Sí. Tu tarjeta digital y propiedades están optimizadas para SEO local en Chiapas. Cuando alguien busca "propiedades en Tuxtla" puedes aparecer.' },
    { q:'¿Qué pasa después de los 14 días gratis?', a:'Decides si continuar. Si eliges el plan Starter son solo $150/mes. El Semestral te sale a $100/mes. Sin sorpresas ni cobros automáticos.' },
  ];

  return (
    <>
      {/* Keyframes */}
      <style>{KEYFRAMES}</style>

      {/* ── OG / SEO ─────────────────────────────────────────────────── */}
      <Helmet>
        <title>Tarjeta Digital Inmobiliaria · Propiedades en Chiapas</title>
        <meta name="description" content="La tarjeta digital que cierra ventas. Portal de propiedades + ficha técnica + CRM. 14 días gratis. Desde $150 MXN/mes. Plataforma #1 para asesores en Chiapas." />
        <meta property="og:title" content="La tarjeta digital que cierra ventas · Propiedades en Chiapas" />
        <meta property="og:description" content="Tarjeta digital profesional + ficha técnica + CRM inmobiliario. 14 días gratis. Desde $150 MXN/mes." />
        <meta property="og:image" content="https://propiedadesenchiapas.com/og-asesores.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://propiedadesenchiapas.com/asesores" />
        <meta property="og:site_name" content="Propiedades en Chiapas" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="La tarjeta digital que cierra ventas" />
        <meta name="twitter:description" content="14 días gratis. Tarjeta digital + ficha técnica + CRM. $150/mes." />
        <meta name="twitter:image" content="https://propiedadesenchiapas.com/og-asesores.jpg" />
        <meta property="og:whatsapp:title" content="¡Tu tarjeta digital lista en 10 minutos!" />
        <meta name="theme-color" content="#1A1A6E" />
      </Helmet>

      <div style={{ fontFamily:"'Inter','Segoe UI',sans-serif", color:C.negro, background:C.blanco, overflowX:'hidden' }}>

        {/* ══════════════════════════════════════════════════════════════
            NAVBAR
        ══════════════════════════════════════════════════════════════ */}
        <nav style={{
          position:'sticky', top:0, zIndex:300,
          background: scrolled ? 'rgba(255,255,255,0.97)' : C.blanco,
          borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
          transition:'all 0.3s', padding:'0.9rem 0',
        }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
            {/* Logo */}
            <a href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
              <div style={{ width:32, height:32, borderRadius:7, background:C.marino, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>🏡</div>
              <span style={{ fontWeight:800, fontSize:'1rem', color:C.negro, letterSpacing:'-0.02em' }}>
                Propiedades en <span style={{ color:C.verde }}>Chiapas</span>
              </span>
            </a>
            {/* Links centro */}
            <div className="navbar-links" style={{ display:'flex', gap:'1.75rem', alignItems:'center' }}>
              {[
                { label:'Ver propiedades', action:() => window.open('/','_blank') },
                { label:'Precios', action:() => scrollTo('precios') },
                { label:'Contacto', action:() => window.open('https://wa.me/529612466204','_blank') },
              ].map(l => (
                <button key={l.label} onClick={l.action} style={{
                  background:'none', border:'none', cursor:'pointer', fontWeight:600,
                  fontSize:'0.88rem', color:C.grisOsc, transition:'color 0.2s',
                  padding:0,
                }}>
                  {l.label}
                </button>
              ))}
            </div>
            {/* CTAs derecha */}
            <div style={{ display:'flex', gap:'0.6rem', alignItems:'center', flexShrink:0 }}>
              <a href="https://wa.me/529612466204" target="_blank" rel="noreferrer"
                style={{
                  display:'flex', alignItems:'center', gap:'0.4rem',
                  background:C.verdeBt, color:C.blanco,
                  borderRadius:9, padding:'0.55rem 1rem', textDecoration:'none',
                  fontWeight:700, fontSize:'0.82rem',
                }}>
                <WAIcon size={16}/> <span className="hide-mobile">WhatsApp</span>
              </a>
              <button onClick={() => abrirModal('starter')} style={{
                background:C.marino, color:C.blanco, border:'none',
                borderRadius:9, padding:'0.55rem 1.1rem', fontWeight:700,
                fontSize:'0.82rem', cursor:'pointer',
              }}>
                14 días gratis
              </button>
            </div>
          </div>
        </nav>

        {/* ══════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════ */}
        <section style={{
          background:`linear-gradient(135deg, ${C.marinoOsc} 0%, ${C.marino} 100%)`,
          minHeight:'100vh', position:'relative', overflow:'hidden',
          display:'flex', alignItems:'center', padding:'5rem 0 4rem',
        }}>
          <HousePattern />
          {/* Orbes decorativos */}
          <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'500px', height:'500px', borderRadius:'50%', background:'rgba(46,125,50,0.08)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:'rgba(123,63,190,0.06)', pointerEvents:'none' }}/>

          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 1.5rem', width:'100%', position:'relative', zIndex:1 }}>
            <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center' }}>

              {/* Columna texto */}
              <div style={{ animation:'fadeInUp 0.7s ease both' }}>
                {/* Badge animado */}
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:'0.4rem',
                  background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
                  borderRadius:999, padding:'0.4rem 1rem', marginBottom:'1.5rem',
                  animation:'pulse-badge 2.5s ease infinite',
                }}>
                  <span style={{ fontSize:'0.9rem' }}>⭐</span>
                  <span style={{ color:C.blanco, fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>
                    PLATAFORMA #1 PARA ASESORES EN CHIAPAS
                  </span>
                </div>

                <h1 style={{
                  color:C.blanco, fontSize:'clamp(2.2rem,4.5vw,3.4rem)',
                  fontWeight:900, lineHeight:1.1, letterSpacing:'-0.03em',
                  margin:'0 0 0.75rem',
                }}>
                  La tarjeta digital<br/>que cierra ventas
                </h1>
                <p style={{ color:C.verde, fontSize:'clamp(1rem,2vw,1.2rem)', fontWeight:700, margin:'0 0 1rem' }}>
                  Tu presencia profesional en Instagram, WhatsApp y Google
                </p>
                <p style={{ color:'rgba(255,255,255,0.72)', fontSize:'1.02rem', lineHeight:1.65, margin:'0 0 2rem', maxWidth:480 }}>
                  Tarjeta digital profesional + ficha técnica de propiedades + perfil optimizado para redes. Todo listo en 24 horas.
                </p>

                {/* Avatares */}
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'2rem' }}>
                  <div style={{ display:'flex' }}>
                    {['#2E7D32','#1A1A6E','#7B3FBE','#C9A84C'].map((bg, i) => (
                      <div key={i} style={{
                        width:34, height:34, borderRadius:'50%', background:bg,
                        border:'2.5px solid rgba(255,255,255,0.25)',
                        marginLeft: i === 0 ? 0 : -10,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        color:C.blanco, fontWeight:800, fontSize:'0.7rem',
                      }}>
                        {['M','C','S','L'][i]}
                      </div>
                    ))}
                  </div>
                  <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.88rem', fontWeight:600 }}>
                    +120 asesores activos en Chiapas
                  </span>
                </div>

                {/* Botones */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.85rem', marginBottom:'1rem' }}>
                  <button onClick={() => abrirModal('starter')} style={{
                    background:C.verde, color:C.blanco, border:'none',
                    borderRadius:12, padding:'1rem 2rem', fontWeight:800,
                    fontSize:'1rem', cursor:'pointer',
                    boxShadow:'0 4px 20px rgba(46,125,50,0.5)',
                    animation:'pulse-ring 2.5s ease infinite',
                  }}>
                    Empezar gratis 14 días →
                  </button>
                  <button onClick={() => scrollTo('demo-tarjeta')} style={{
                    background:'transparent', color:C.blanco,
                    border:'2px solid rgba(255,255,255,0.35)',
                    borderRadius:12, padding:'1rem 1.75rem', fontWeight:700,
                    fontSize:'1rem', cursor:'pointer', transition:'all 0.2s',
                  }}>
                    Ver ejemplo de tarjeta
                  </button>
                </div>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem' }}>
                  Sin tarjeta de crédito · Sin compromisos
                </p>
              </div>

              {/* Columna mockup */}
              <div className="hide-mobile" style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
                <CardMockup />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            BANNER URGENCIA
        ══════════════════════════════════════════════════════════════ */}
        <div style={{
          background:C.dorado, padding:'0.9rem 1.5rem',
          display:'flex', alignItems:'center', justifyContent:'center', gap:'0.6rem',
          textAlign:'center',
        }}>
          <span style={{ width:10, height:10, borderRadius:'50%', background:'#dc2626', display:'inline-block', animation:'blink-dot 1s ease infinite', flexShrink:0 }}/>
          <p style={{ color:C.negro, fontWeight:800, fontSize:'clamp(0.82rem,2vw,0.97rem)', margin:0 }}>
            🔥 14 DÍAS GRATIS · Después solo $150/mes · Solo 50 lugares disponibles
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN RRSS
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding:'6rem 0', background:C.blanco }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 1.5rem' }}>
            <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
              <span style={{ background:'#f0fdf4', color:C.verde, border:`1px solid #bbf7d0`, borderRadius:999, padding:'0.35rem 1rem', fontSize:'0.78rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                PRESENCIA DIGITAL
              </span>
              <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.5rem)', fontWeight:900, margin:'1rem 0 0.75rem', letterSpacing:'-0.02em', color:C.negro }}>
                Domina Instagram, WhatsApp y Google<br/>como asesor profesional
              </h2>
              <p style={{ color:C.grisTexto, fontSize:'1.02rem', maxWidth:520, margin:'0 auto', lineHeight:1.65 }}>
                Mientras otros siguen mandando fotos sueltas por WhatsApp, tú tienes todo profesional
              </p>
            </div>

            <div className="four-col" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.25rem' }}>
              {[
                { icon:'📱', titulo:'WhatsApp', desc:'Comparte tu ficha técnica en un clic. Tus clientes ven fotos, precio, ubicación y tus datos al instante.' },
                { icon:'📸', titulo:'Instagram', desc:'Contenido visual profesional de tus propiedades listo para publicar en stories y feed.' },
                { icon:'🔍', titulo:'Google', desc:'Tu perfil y propiedades indexados para aparecer cuando alguien busca propiedades en Chiapas.' },
                { icon:'🪪', titulo:'Tarjeta Digital', desc:'Un link con toda tu información profesional. Ponlo en tu bio y compártelo en cada mensaje.' },
              ].map(c => (
                <div key={c.titulo} style={{
                  background:C.grisClaro, borderRadius:16, padding:'1.75rem 1.5rem',
                  border:'1px solid #e5e7eb',
                }}>
                  <div style={{ width:48, height:48, background:C.blanco, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', marginBottom:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
                    {c.icon}
                  </div>
                  <h3 style={{ fontWeight:800, fontSize:'1rem', marginBottom:'0.5rem', color:C.negro }}>{c.titulo}</h3>
                  <p style={{ color:C.grisTexto, fontSize:'0.88rem', lineHeight:1.6, margin:0 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            DEMO TARJETA DIGITAL
        ══════════════════════════════════════════════════════════════ */}
        <section id="demo-tarjeta" style={{ padding:'6rem 0', background:C.marinoOsc }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 1.5rem' }}>
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
              <span style={{ background:'rgba(123,63,190,0.2)', color:'#c4b5fd', border:'1px solid rgba(123,63,190,0.35)', borderRadius:999, padding:'0.35rem 1rem', fontSize:'0.78rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                TU TARJETA DIGITAL
              </span>
              <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.5rem)', fontWeight:900, color:C.blanco, margin:'1rem 0 0.75rem', letterSpacing:'-0.02em' }}>
                Así se verá tu presencia profesional
              </h2>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'1rem', maxWidth:480, margin:'0 auto', lineHeight:1.6 }}>
                Perfecta para compartir en Instagram, WhatsApp y guardar en contactos
              </p>
            </div>

            <div style={{ display:'flex', justifyContent:'center', marginBottom:'2rem' }}>
              <CardMockup />
            </div>

            <p style={{ textAlign:'center', color:'rgba(255,255,255,0.5)', fontSize:'0.88rem', marginBottom:'1.75rem' }}>
              Tu tarjeta tendrá tu foto, tu información y tus propiedades reales
            </p>
            <div style={{ textAlign:'center' }}>
              <button onClick={() => abrirModal('starter')} style={{
                background:C.verde, color:C.blanco, border:'none',
                borderRadius:12, padding:'1rem 2.5rem', fontWeight:800,
                fontSize:'1rem', cursor:'pointer',
                boxShadow:'0 4px 20px rgba(46,125,50,0.4)',
              }}>
                Crear mi tarjeta gratis →
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FICHA TÉCNICA PREMIUM
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding:'6rem 0', background:C.grisClaro }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 1.5rem' }}>
            <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
              <span style={{ background:'#eff6ff', color:C.marino, border:`1px solid #bfdbfe`, borderRadius:999, padding:'0.35rem 1rem', fontSize:'0.78rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                FICHA TÉCNICA
              </span>
              <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.5rem)', fontWeight:900, margin:'1rem 0 0.75rem', letterSpacing:'-0.02em' }}>
                La presentación de propiedad<br/>más profesional de Chiapas
              </h2>
              <p style={{ color:C.grisTexto, fontSize:'1rem', maxWidth:520, margin:'0 auto', lineHeight:1.6 }}>
                Imprimible, compartible por WhatsApp y optimizada para Google y redes sociales
              </p>
            </div>

            <div className="ficha-grid" style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:'3rem', alignItems:'start' }}>
              {/* Mockup ficha */}
              <div style={{ background:C.blanco, borderRadius:20, overflow:'hidden', boxShadow:'0 20px 60px rgba(26,26,110,0.15)', border:`1px solid #e5e7eb` }}>
                {/* Imagen placeholder */}
                <div style={{ height:200, background:`linear-gradient(135deg,${C.marino},${C.morado})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:'3rem' }}>🏠</span>
                </div>
                <div style={{ padding:'1.5rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                    <div>
                      <p style={{ fontSize:'1.4rem', fontWeight:900, color:C.marino, margin:'0 0 0.2rem' }}>$2,500,000 MXN</p>
                      <h3 style={{ fontWeight:700, color:C.negro, margin:0, fontSize:'1rem' }}>Casa en Fraccionamiento Las Palmas</h3>
                    </div>
                    <span style={{ background:'#eff6ff', color:C.marino, borderRadius:8, padding:'0.3rem 0.6rem', fontSize:'0.75rem', fontWeight:700, flexShrink:0 }}>Venta</span>
                  </div>
                  {/* Specs */}
                  <div className="specs-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.5rem', marginBottom:'1rem' }}>
                    {[
                      { icon:'🛏', label:'3 Recámaras' },
                      { icon:'🚿', label:'2 Baños' },
                      { icon:'📐', label:'180 m²' },
                      { icon:'🚗', label:'2 Cajones' },
                    ].map(s => (
                      <div key={s.label} style={{ background:C.grisClaro, borderRadius:8, padding:'0.5rem 0.4rem', textAlign:'center' }}>
                        <div style={{ fontSize:'1rem' }}>{s.icon}</div>
                        <div style={{ fontSize:'0.65rem', fontWeight:700, color:C.grisOsc, marginTop:2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ color:C.grisTexto, fontSize:'0.82rem', lineHeight:1.55, marginBottom:'1rem' }}>
                    Hermosa casa en fraccionamiento privado, acabados de lujo, jardín amplio y alberca. Ubicación privilegiada.
                  </p>
                  {/* Mapa placeholder */}
                  <div style={{ height:80, background:`linear-gradient(135deg,#dbeafe,#eff6ff)`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem', color:C.marino, fontWeight:700, fontSize:'0.82rem' }}>
                    📍 Tuxtla Gutiérrez, Chiapas
                  </div>
                  {/* Agente */}
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', borderTop:'1px solid #f1f5f9', paddingTop:'1rem', marginBottom:'1rem' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg,${C.marino},${C.morado})`, display:'flex', alignItems:'center', justifyContent:'center', color:C.blanco, fontWeight:800, fontSize:'0.8rem', flexShrink:0 }}>CM</div>
                    <div>
                      <p style={{ fontWeight:700, fontSize:'0.85rem', margin:0 }}>Carlos Mendoza</p>
                      <p style={{ color:C.grisTexto, fontSize:'0.75rem', margin:0 }}>Asesor · 961 246 6204</p>
                    </div>
                  </div>
                  {/* Botones */}
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    {[{l:'💬 WhatsApp',bg:C.verdeBt},{l:'🖨 Imprimir',bg:C.marino},{l:'📄 PDF',bg:C.morado}].map(b => (
                      <div key={b.l} style={{ flex:1, background:b.bg, borderRadius:8, padding:'0.5rem 0', textAlign:'center', color:C.blanco, fontSize:'0.72rem', fontWeight:700, cursor:'pointer' }}>{b.l}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Beneficios */}
              <div>
                <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem', marginBottom:'2.5rem' }}>
                  {[
                    { t:'Lista en minutos', d:'Solo sube fotos y datos. La ficha técnica se genera automáticamente.' },
                    { t:'Perfecta para Instagram Stories y WhatsApp', d:'Formato vertical y horizontal. Lista para publicar sin editar.' },
                    { t:'Aparece en Google cuando buscan propiedades en Chiapas', d:'SEO local incorporado en cada ficha. Más visibilidad, más clientes.' },
                  ].map(b => (
                    <div key={b.t} style={{ display:'flex', gap:'1rem', alignItems:'flex-start' }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:'#f0fdf4', border:`2px solid ${C.verde}`, display:'flex', alignItems:'center', justifyContent:'center', color:C.verde, fontWeight:900, fontSize:'0.85rem', flexShrink:0, marginTop:2 }}>✓</div>
                      <div>
                        <h4 style={{ fontWeight:800, margin:'0 0 0.3rem', color:C.negro, fontSize:'0.97rem' }}>{b.t}</h4>
                        <p style={{ color:C.grisTexto, fontSize:'0.88rem', lineHeight:1.55, margin:0 }}>{b.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => abrirModal('starter')} style={{
                  background:C.marino, color:C.blanco, border:'none',
                  borderRadius:12, padding:'1rem 2rem', fontWeight:800,
                  fontSize:'1rem', cursor:'pointer', width:'100%',
                  boxShadow:'0 4px 20px rgba(26,26,110,0.3)',
                }}>
                  Crear mi ficha técnica →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            CÓMO FUNCIONA
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding:'6rem 0', background:C.blanco }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 1.5rem' }}>
            <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
              <span style={{ background:C.grisClaro, color:C.grisOsc, border:'1px solid #e5e7eb', borderRadius:999, padding:'0.35rem 1rem', fontSize:'0.78rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                PROCESO
              </span>
              <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.5rem)', fontWeight:900, margin:'1rem 0 0.75rem', letterSpacing:'-0.02em' }}>
                De cero a profesional en <span style={{ color:C.marino }}>3 pasos</span>
              </h2>
            </div>

            <div className="three-col" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2rem', marginBottom:'3rem' }}>
              {[
                { n:'01', t:'Regístrate gratis', d:'Solo tu nombre, email y WhatsApp. Sin tarjeta. En 2 minutos estás dentro.' },
                { n:'02', t:'Crea tu tarjeta digital', d:'Sube tu foto y datos. Tu tarjeta queda lista al instante para compartir en redes.' },
                { n:'03', t:'Publica tu propiedad', d:'Agrega fotos, precio y ubicación. La ficha técnica se genera automáticamente.' },
              ].map((p, i) => (
                <div key={p.n} style={{ textAlign:'center', padding:'0 1rem', position:'relative' }}>
                  {i < 2 && (
                    <div className="hide-mobile" style={{
                      position:'absolute', top:'2rem', left:'calc(50% + 2rem)',
                      width:'calc(100% - 4rem)', height:2,
                      background:'linear-gradient(to right, #e5e7eb, transparent)',
                    }}/>
                  )}
                  <div style={{
                    width:64, height:64, borderRadius:'50%',
                    background:C.marino, color:C.blanco,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:900, fontSize:'1.3rem', margin:'0 auto 1.25rem',
                    boxShadow:`0 4px 20px rgba(26,26,110,0.3)`, position:'relative', zIndex:1,
                  }}>
                    {p.n}
                  </div>
                  <h3 style={{ fontWeight:800, fontSize:'1.05rem', marginBottom:'0.5rem', color:C.negro }}>{p.t}</h3>
                  <p style={{ color:C.grisTexto, fontSize:'0.9rem', lineHeight:1.6, margin:0 }}>{p.d}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign:'center' }}>
              <button onClick={() => abrirModal('starter')} style={{
                background:C.verde, color:C.blanco, border:'none',
                borderRadius:12, padding:'1rem 2.5rem', fontWeight:800,
                fontSize:'1rem', cursor:'pointer',
                boxShadow:'0 4px 20px rgba(46,125,50,0.4)',
              }}>
                Crear mi tarjeta ahora →
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            TESTIMONIOS
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding:'6rem 0', background:C.grisClaro }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 1.5rem' }}>
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
              <span style={{ background:'#fef9ec', color:'#92400e', border:'1px solid #fde68a', borderRadius:999, padding:'0.35rem 1rem', fontSize:'0.78rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                TESTIMONIOS
              </span>
              <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.4rem)', fontWeight:900, margin:'1rem 0 0', letterSpacing:'-0.02em' }}>
                Asesores que ya están cerrando <span style={{ color:C.verde }}>más ventas</span>
              </h2>
            </div>

            <div className="three-col" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
              {[
                { av:'MH', n:'Mariela Hernández', c:'Asesora Independiente · Tuxtla Gutiérrez', color:C.verde,
                  t:'"En mi primer mes publiqué 8 propiedades y cerré 2 ventas. Mi tarjeta digital hace que los clientes me tomen en serio desde el primer mensaje."' },
                { av:'CD', n:'Carlos Domínguez', c:'Agente IBR · San Cristóbal de las Casas', color:C.marino,
                  t:'"Antes mandaba fotos sueltas por WhatsApp. Ahora mando mi link y los clientes ven todo: mis propiedades, mi teléfono y mis redes. Soy más profesional que agencias grandes."' },
                { av:'SR', n:'Sofía Ruiz', c:'Broker · Tapachula', color:C.morado,
                  t:'"La ficha técnica me ahorra 2 horas por propiedad. La mando por WhatsApp, la subo a Instagram y ya. Vale cada peso y más."' },
              ].map(t => (
                <div key={t.n} style={{ background:C.blanco, borderRadius:16, padding:'2rem 1.75rem', border:'1px solid #e5e7eb', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ display:'flex', gap:2, marginBottom:'1rem' }}>
                    {'★★★★★'.split('').map((s,i) => <span key={i} style={{ color:C.dorado, fontSize:'1.05rem' }}>{s}</span>)}
                  </div>
                  <p style={{ color:C.grisTexto, fontSize:'0.93rem', lineHeight:1.65, fontStyle:'italic', marginBottom:'1.5rem' }}>{t.t}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:t.color, color:C.blanco, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.82rem', flexShrink:0 }}>{t.av}</div>
                    <div>
                      <p style={{ fontWeight:700, fontSize:'0.88rem', margin:0, color:C.negro }}>{t.n}</p>
                      <p style={{ color:'#9ca3af', fontSize:'0.75rem', margin:0 }}>{t.c}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            PRECIOS
        ══════════════════════════════════════════════════════════════ */}
        <section id="precios" style={{ padding:'6rem 0', background:C.blanco }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 1.5rem' }}>
            <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
              <span style={{ background:C.grisClaro, color:C.grisOsc, border:'1px solid #e5e7eb', borderRadius:999, padding:'0.35rem 1rem', fontSize:'0.78rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                PRECIOS
              </span>
              <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.5rem)', fontWeight:900, margin:'1rem 0 0.75rem', letterSpacing:'-0.02em' }}>
                Invierte menos de lo que ganas<br/><span style={{ color:C.marino }}>en una comisión</span>
              </h2>
              <p style={{ color:C.grisTexto, fontSize:'1rem', maxWidth:440, margin:'0 auto', lineHeight:1.65 }}>
                14 días gratis para probar todo. Sin tarjeta de crédito.
              </p>
            </div>

            <div className="plans-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', alignItems:'stretch' }}>
              {PLANES.map(plan => (
                <div key={plan.id} style={{
                  borderRadius:20, padding:'2rem 1.75rem',
                  border: plan.destacado ? `2.5px solid ${plan.borde}` : `2px solid ${plan.borde}33`,
                  background: plan.destacado ? '#fffbeb' : C.blanco,
                  boxShadow: plan.destacado ? `0 20px 50px rgba(201,168,76,0.2)` : '0 2px 12px rgba(0,0,0,0.05)',
                  position:'relative', display:'flex', flexDirection:'column',
                }}>
                  {/* Badge */}
                  <div style={{
                    display:'inline-block', background:plan.badgeColor,
                    color: plan.id==='semestral' ? C.negro : C.blanco,
                    borderRadius:999, padding:'0.3rem 0.85rem',
                    fontSize:'0.72rem', fontWeight:800, letterSpacing:'0.05em',
                    marginBottom:'1.25rem', alignSelf:'flex-start',
                  }}>
                    {plan.badge}
                  </div>

                  <p style={{ fontWeight:800, color:C.grisOsc, fontSize:'0.85rem', letterSpacing:'0.06em', textTransform:'uppercase', margin:'0 0 0.35rem' }}>
                    {plan.nombre}
                  </p>
                  {plan.gratis && (
                    <p style={{ color:C.verde, fontWeight:800, fontSize:'1rem', margin:'0 0 0.25rem' }}>{plan.gratis}</p>
                  )}
                  <div style={{ display:'flex', alignItems:'baseline', gap:'0.25rem', marginBottom:'0.4rem' }}>
                    <span style={{ fontSize:'2.8rem', fontWeight:900, letterSpacing:'-0.03em', color:plan.borde }}>{plan.precio}</span>
                    <span style={{ color:C.grisTexto, fontSize:'0.9rem' }}>{plan.periodo}</span>
                  </div>
                  {plan.nota && <p style={{ color:C.grisTexto, fontSize:'0.78rem', margin:'0 0 0.5rem', lineHeight:1.4 }}>{plan.nota}</p>}
                  {plan.notaVerde && <p style={{ color:C.verde, fontSize:'0.8rem', fontWeight:700, margin:'0 0 1.25rem' }}>{plan.notaVerde}</p>}

                  <ul style={{ listStyle:'none', padding:0, margin:'1rem 0 1.75rem', flex:1, display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start', fontSize:'0.88rem', color:C.grisOsc, borderBottom:'1px solid #f1f5f9', paddingBottom:'0.55rem' }}>
                        <span style={{ color:C.verde, fontWeight:800, flexShrink:0 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>

                  <button onClick={() => abrirModal(plan.id)} style={{
                    width:'100%', padding:'0.95rem', border:'none',
                    borderRadius:12, fontWeight:800, fontSize:'0.97rem',
                    cursor:'pointer', background:plan.btnBg, color:plan.btnColor,
                    boxShadow:`0 4px 16px ${plan.btnBg}44`,
                    transition:'opacity 0.2s',
                  }}>
                    {plan.btnLabel}
                  </button>
                  <p style={{ textAlign:'center', fontSize:'0.74rem', color:'#9ca3af', margin:'0.65rem 0 0' }}>
                    Sin tarjeta de crédito
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ padding:'6rem 0', background:C.grisClaro }}>
          <div style={{ maxWidth:720, margin:'0 auto', padding:'0 1.5rem' }}>
            <div style={{ textAlign:'center', marginBottom:'3rem' }}>
              <span style={{ background:C.blanco, color:C.grisOsc, border:'1px solid #e5e7eb', borderRadius:999, padding:'0.35rem 1rem', fontSize:'0.78rem', fontWeight:800, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                FAQ
              </span>
              <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.4rem)', fontWeight:900, margin:'1rem 0 0', letterSpacing:'-0.02em' }}>
                Preguntas frecuentes
              </h2>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
              {FAQS.map((f, i) => (
                <div key={i} style={{
                  background: faqOpen===i ? C.blanco : C.blanco,
                  border:`1px solid ${faqOpen===i ? C.marino+'44' : '#e5e7eb'}`,
                  borderRadius:12, overflow:'hidden',
                  boxShadow: faqOpen===i ? `0 4px 20px rgba(26,26,110,0.08)` : 'none',
                  transition:'all 0.2s',
                }}>
                  <button onClick={() => setFaqOpen(faqOpen===i ? null : i)} style={{
                    width:'100%', textAlign:'left', padding:'1.1rem 1.5rem',
                    background:'none', border:'none', cursor:'pointer',
                    display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem',
                  }}>
                    <span style={{ fontWeight:700, fontSize:'0.95rem', color:C.negro, lineHeight:1.4 }}>❓ {f.q}</span>
                    <span style={{
                      color:C.marino, fontSize:'1.3rem', fontWeight:700, flexShrink:0,
                      transition:'transform 0.2s',
                      transform: faqOpen===i ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}>+</span>
                  </button>
                  {faqOpen===i && (
                    <div style={{ padding:'0 1.5rem 1.25rem', color:C.grisTexto, fontSize:'0.9rem', lineHeight:1.65, borderTop:'1px solid #f1f5f9' }}>
                      → {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            CTA FINAL
        ══════════════════════════════════════════════════════════════ */}
        <section style={{ background:`linear-gradient(135deg, ${C.marinoOsc} 0%, ${C.marino} 100%)`, padding:'6rem 0', textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-80px', left:'50%', transform:'translateX(-50%)', width:'600px', height:'300px', background:'rgba(46,125,50,0.07)', borderRadius:'50%', pointerEvents:'none' }}/>
          <div style={{ maxWidth:700, margin:'0 auto', padding:'0 1.5rem', position:'relative', zIndex:1 }}>
            <h2 style={{ color:C.blanco, fontSize:'clamp(1.9rem,4vw,3rem)', fontWeight:900, letterSpacing:'-0.03em', margin:'0 0 1rem', lineHeight:1.1 }}>
              Tu siguiente venta empieza<br/>con tu tarjeta digital
            </h2>
            <p style={{ color:'rgba(255,255,255,0.68)', fontSize:'1.05rem', lineHeight:1.6, maxWidth:480, margin:'0 auto 2.5rem' }}>
              Únete a los 120 asesores profesionales de Chiapas
            </p>
            <button onClick={() => abrirModal('starter')} style={{
              background:C.verde, color:C.blanco, border:'none',
              borderRadius:14, padding:'1.2rem 3.5rem', fontWeight:900,
              fontSize:'1.1rem', cursor:'pointer', letterSpacing:'0.01em',
              boxShadow:'0 6px 28px rgba(46,125,50,0.5)',
              animation:'pulse-ring 2.5s ease infinite',
            }}>
              EMPEZAR 14 DÍAS GRATIS →
            </button>
            <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.8rem', marginTop:'1rem' }}>
              Sin tarjeta de crédito · Sin compromisos · Cancela cuando quieras
            </p>
            <a href="https://wa.me/529612466204" target="_blank" rel="noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', marginTop:'1.5rem', color:'rgba(255,255,255,0.6)', fontSize:'0.88rem', textDecoration:'none', fontWeight:600 }}>
              <WAIcon size={18} color="rgba(255,255,255,0.6)"/>
              ¿Tienes dudas? Escríbenos: 961 246 6204
            </a>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════════════ */}
        <footer style={{ background:C.negro, padding:'2.5rem 0' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 1.5rem' }}>
            <div className="two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', alignItems:'center', marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                <div style={{ width:30, height:30, borderRadius:7, background:C.marino, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem' }}>🏡</div>
                <span style={{ fontWeight:800, color:C.blanco, fontSize:'0.95rem' }}>
                  Propiedades en <span style={{ color:C.verde }}>Chiapas</span>
                </span>
              </div>
              <div style={{ display:'flex', gap:'1.5rem', justifyContent:'flex-end', flexWrap:'wrap' }}>
                {['Privacidad','Términos','Contacto'].map(l => (
                  <a key={l} href="#" style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.85rem', textDecoration:'none', fontWeight:500 }}>{l}</a>
                ))}
                <a href="https://wa.me/529612466204" target="_blank" rel="noreferrer"
                  style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.85rem', textDecoration:'none', fontWeight:500 }}>
                  📞 961 246 6204
                </a>
              </div>
            </div>
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:'1.25rem', textAlign:'center' }}>
              <p style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.8rem', margin:0 }}>
                © 2026 Propiedades en Chiapas · Todos los derechos reservados
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          BOTÓN WHATSAPP FLOTANTE
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ position:'fixed', bottom:'1.75rem', right:'1.75rem', zIndex:9000 }}>
        <a href="https://wa.me/529612466204" target="_blank" rel="noreferrer"
          title="¿Tienes dudas? Escríbenos"
          style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            width:58, height:58, borderRadius:'50%',
            background:C.verdeBt, textDecoration:'none',
            boxShadow:'0 4px 16px rgba(37,211,102,0.5)',
            animation:'pulse-wa 2.5s ease infinite',
          }}>
          <WAIcon size={28}/>
        </a>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODAL REGISTRO — OTP
      ══════════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div
          onClick={e => { if (e.target===e.currentTarget) setModalOpen(false); }}
          style={{
            position:'fixed', inset:0, zIndex:9999,
            background:'rgba(10,10,42,0.8)', backdropFilter:'blur(8px)',
            display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem',
          }}
        >
          <div style={{
            background:C.blanco, borderRadius:24, width:'100%', maxWidth:440,
            padding:'2.5rem 2rem', position:'relative',
            boxShadow:'0 30px 80px rgba(0,0,0,0.4)',
            animation:'fadeInUp 0.35s ease both',
          }}>
            <button onClick={() => setModalOpen(false)} style={{
              position:'absolute', top:'1rem', right:'1rem',
              background:'#f1f5f9', border:'none', width:32, height:32,
              borderRadius:'50%', cursor:'pointer', fontSize:'1rem', color:'#64748b',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>✕</button>

            {/* Cabecera */}
            <div style={{ textAlign:'center', marginBottom:'2rem' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg,${C.marino},${C.morado})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', margin:'0 auto 1rem' }}>🏡</div>
              <h3 style={{ fontWeight:900, fontSize:'1.3rem', margin:'0 0 0.4rem', color:C.negro }}>
                {paso===1 ? 'Crea tu cuenta gratis' : 'Verifica tu correo'}
              </h3>
              <p style={{ color:C.grisTexto, fontSize:'0.88rem', lineHeight:1.5, margin:0 }}>
                {paso===1
                  ? `Plan ${planSel==='anual' ? 'Anual · $800 MXN/año' : planSel==='semestral' ? 'Semestral · $600 MXN' : 'Starter · 14 días gratis'}`
                  : `Ingresa el código de 6 dígitos enviado a ${email}`}
              </p>
            </div>

            {/* Barra progreso */}
            <div style={{ display:'flex', gap:6, marginBottom:'1.75rem' }}>
              {[1,2].map(n => (
                <div key={n} style={{ height:4, flex:1, borderRadius:4, background: n<=paso ? C.marino : '#e5e7eb', transition:'background 0.3s' }}/>
              ))}
            </div>

            {/* Paso 1 */}
            {paso===1 && (
              <form onSubmit={enviarOTP} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div>
                  <label style={{ display:'block', fontWeight:700, fontSize:'0.83rem', marginBottom:'0.4rem', color:C.negro }}>Correo electrónico</label>
                  <input type="email" required placeholder="tucorreo@ejemplo.com" value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width:'100%', padding:'0.85rem 1rem', border:`1.5px solid #e5e7eb`, borderRadius:10, fontSize:'1rem', color:C.negro, outline:'none', boxSizing:'border-box' }}
                    onFocus={e => e.target.style.borderColor=C.marino}
                    onBlur={e => e.target.style.borderColor='#e5e7eb'}
                  />
                </div>
                {msg.texto && (
                  <div style={{ padding:'0.75rem 1rem', borderRadius:8, fontSize:'0.84rem', fontWeight:600,
                    background: msg.tipo==='error' ? '#fef2f2' : '#f0fdf4',
                    color: msg.tipo==='error' ? '#dc2626' : C.verde,
                    border:`1px solid ${msg.tipo==='error' ? '#fecaca' : '#bbf7d0'}` }}>
                    {msg.texto}
                  </div>
                )}
                <button type="submit" disabled={loading} style={{
                  background:C.marino, color:C.blanco, border:'none',
                  borderRadius:12, padding:'1rem', fontWeight:800, fontSize:'1rem',
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.65 : 1,
                }}>
                  {loading ? 'Enviando código...' : 'Enviar código de acceso →'}
                </button>
                <p style={{ textAlign:'center', fontSize:'0.75rem', color:'#9ca3af', margin:0, lineHeight:1.5 }}>
                  Al registrarte aceptas nuestros{' '}
                  <a href="#" style={{ color:C.marino, fontWeight:600, textDecoration:'none' }}>Términos</a>
                  {' '}y{' '}
                  <a href="#" style={{ color:C.marino, fontWeight:600, textDecoration:'none' }}>Privacidad</a>.
                </p>
              </form>
            )}

            {/* Paso 2 */}
            {paso===2 && (
              <form onSubmit={verificarOTP} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div>
                  <label style={{ display:'block', fontWeight:700, fontSize:'0.83rem', marginBottom:'0.4rem', color:C.negro }}>Código de verificación (6 dígitos)</label>
                  <input
                    type="text" inputMode="numeric" maxLength={6} required
                    placeholder="123456" value={otp} autoFocus
                    onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
                    style={{ width:'100%', padding:'0.85rem 1rem', border:`1.5px solid #e5e7eb`, borderRadius:10, fontSize:'2rem', letterSpacing:'0.5em', textAlign:'center', color:C.negro, fontWeight:800, outline:'none', boxSizing:'border-box' }}
                    onFocus={e => e.target.style.borderColor=C.marino}
                    onBlur={e => e.target.style.borderColor='#e5e7eb'}
                  />
                </div>
                {msg.texto && (
                  <div style={{ padding:'0.75rem 1rem', borderRadius:8, fontSize:'0.84rem', fontWeight:600,
                    background: msg.tipo==='error' ? '#fef2f2' : '#f0fdf4',
                    color: msg.tipo==='error' ? '#dc2626' : C.verde,
                    border:`1px solid ${msg.tipo==='error' ? '#fecaca' : '#bbf7d0'}` }}>
                    {msg.texto}
                  </div>
                )}
                <button type="submit" disabled={loading || otp.length<6} style={{
                  background:C.marino, color:C.blanco, border:'none',
                  borderRadius:12, padding:'1rem', fontWeight:800, fontSize:'1rem',
                  cursor: (loading || otp.length<6) ? 'not-allowed' : 'pointer',
                  opacity: (loading || otp.length<6) ? 0.55 : 1,
                }}>
                  {loading ? 'Verificando...' : 'Verificar y entrar →'}
                </button>
                <button type="button" onClick={() => { setPaso(1); setOtp(''); setMsg({tipo:'',texto:''}); }}
                  style={{ background:'none', border:'none', color:C.grisTexto, fontSize:'0.84rem', cursor:'pointer', textDecoration:'underline', textUnderlineOffset:2 }}>
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

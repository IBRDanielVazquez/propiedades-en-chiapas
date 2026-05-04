import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../supabaseClient';

// --- CONFIG & DESIGN ---
const COLORS = {
  primary: '#1A1A6E',
  gold: '#C9A84C',
  whatsapp: '#25D366',
  verified: '#2E7D32',
  grayText: '#888',
  lightGray: '#f8fafc',
  white: '#FFFFFF',
  bio: '#444',
  shadow: 'rgba(0, 0, 0, 0.15)',
};

const FONTS = {
  serif: 'Georgia, serif',
  sans: 'system-ui, -apple-system, sans-serif',
};

// --- COMPONENTS ---
const IconWA = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const downloadVCard = (user) => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${user.name}
ORG:Propiedades en Chiapas
TITLE:${user.position || 'Asesor Inmobiliario'}
TEL;TYPE=CELL:+${user.whatsapp || user.phone || ''}
EMAIL:${user.email || ''}
URL:https://propiedadesenchiapas.com/card/${user.slug}
PHOTO;VALUE=URI:${user.avatar_url || ''}
END:VCARD`;
  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${user.slug || 'contacto'}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
};

export default function DigitalCard() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const slug = window.location.pathname.split('/card/')[1]?.split('/')[0] || '';
  const cardUrl = `https://propiedadesenchiapas.com/card/${slug}`;

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    if (!slug) { setLoading(false); return; }
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      let query = supabase.from('users').select('*').eq('active', true);
      if (isUUID) { query = query.or(`slug.eq.${slug},id.eq.${slug}`); }
      else { query = query.eq('slug', slug); }
      
      const { data: userData, error: userError } = await query.single();
      if (userError || !userData) { setLoading(false); return; }
      setUser(userData);

      const { data: propsData } = await supabase.from('properties')
        .select('*').eq('user_id', userData.id).eq('active', true).limit(3);
      setProperties(propsData || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.sans, color: COLORS.primary }}>Cargando Tarjeta Premium...</div>;
  if (!user) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.sans }}><h3>Asesor no encontrado</h3></div>;

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 10px' }}>
      <Helmet>
        <title>{user.name} | Propiedades en Chiapas</title>
        <meta name="description" content={user.bio || `Contacta a ${user.name}`} />
        <meta property="og:title" content={`${user.name} - Asesor Verificado`} />
        <meta property="og:image" content={user.avatar_url || ''} />
      </Helmet>

      {/* --- FLIP CARD SYSTEM --- */}
      <div style={{ width: '100%', maxWidth: 400, perspective: '1200px', marginBottom: 40 }}>
        <div style={{
          position: 'relative', width: '100%', height: '560px',
          transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: 'pointer'
        }} onClick={() => setIsFlipped(!isFlipped)}>
          
          {/* FRONT SIDE (Identity) */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            background: COLORS.white, borderRadius: 30, boxShadow: `0 15px 35px ${COLORS.shadow}`,
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ height: 140, background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>PROPIEDADES EN CHIAPAS</span>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: -60, padding: '0 20px 20px', flex: 1 }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                <img 
                  src={user.avatar_url || 'https://via.placeholder.com/120'} 
                  alt={user.name}
                  style={{ width: 120, height: 120, borderRadius: '50%', border: `4px solid ${COLORS.gold}`, objectFit: 'cover', background: '#fff' }}
                />
              </div>
              <h1 style={{ margin: '0 0 5px', fontSize: 28, fontWeight: 700, color: COLORS.primary, fontFamily: FONTS.serif }}>{user.name}</h1>
              <p style={{ margin: '0 0 8px', fontSize: 15, color: COLORS.grayText, fontStyle: 'italic' }}>{user.position || 'Asesor Inmobiliario'}</p>
              <div style={{ color: COLORS.verified, fontSize: 12, fontWeight: 700, marginBottom: 15 }}>✓ Asesor Verificado</div>
              <p style={{ fontSize: 14, color: COLORS.grayText }}>📍 {user.location || 'Chiapas, MX'}</p>
            </div>

            <div style={{ padding: '0 40px 40px', textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: COLORS.grayText, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Toca para ver biografía y propiedades ↻</p>
              <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
                 <a href={`tel:${user.phone}`} style={styles.iconCircle}>📞</a>
                 <a href={`mailto:${user.email}`} style={styles.iconCircle}>✉️</a>
                 <button onClick={(e) => { e.stopPropagation(); downloadVCard(user); }} style={styles.iconCircle}>💾</button>
              </div>
            </div>
          </div>

          {/* BACK SIDE (Data) */}
          <div style={{
            position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: COLORS.white, borderRadius: 30, boxShadow: `0 15px 35px ${COLORS.shadow}`,
            padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column'
          }}>
            <h3 style={{ color: COLORS.primary, borderBottom: `2px solid ${COLORS.gold}`, paddingBottom: 10, marginBottom: 15 }}>Biografía</h3>
            <p style={{ fontSize: 14, color: COLORS.bio, lineHeight: 1.6, margin: '0 0 25px' }}>{user.bio || 'Sin biografía disponible.'}</p>

            <h3 style={{ color: COLORS.primary, borderBottom: `2px solid ${COLORS.gold}`, paddingBottom: 10, marginBottom: 15 }}>Propiedades</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 25 }}>
              {properties.length > 0 ? properties.map(p => (
                <a key={p.id} href={`/propiedad/${p.id}`} style={{ textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'center', background: '#f8fafc', padding: 10, borderRadius: 12 }}>
                  <img src={p.featured_image_url || p.images?.[0]} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: COLORS.primary }}>${Number(p.price).toLocaleString()}</p>
                    <p style={{ margin: 0, fontSize: 11, color: COLORS.grayText }}>{p.title}</p>
                  </div>
                </a>
              )) : <p style={{ fontSize: 12, color: COLORS.grayText }}>No hay propiedades listadas.</p>}
            </div>

            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(cardUrl)}`} style={{ width: 100, height: 100 }} />
               <p style={{ fontSize: 11, color: COLORS.grayText, marginTop: 8 }}>Escanea para compartir</p>
            </div>
            <p style={{ fontSize: 11, color: COLORS.grayText, textAlign: 'center', marginTop: 15 }}>Toca para volver al frente ↻</p>
          </div>

        </div>
      </div>

      {/* FIXED FOOTER WITH MAIN CTA */}
      <div style={{ width: '100%', maxWidth: 400, padding: '0 20px' }}>
        <a 
          href={`https://wa.me/${user.whatsapp || user.phone}?text=Hola ${user.name}, vi tu tarjeta digital y me gustaría más información.`}
          target="_blank"
          style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            height: 60, background: COLORS.whatsapp, color: '#fff', borderRadius: 20,
            textDecoration: 'none', fontWeight: 700, fontSize: 18, boxShadow: '0 10px 20px rgba(37,211,102,0.3)'
          }}
        >
          <IconWA /> Escribir por WhatsApp
        </a>
        <p style={{ textAlign: 'center', marginTop: 25, fontSize: 12, color: '#ccc', fontWeight: 700, letterSpacing: 2 }}>PROPIEDADESENCHIAPAS.COM</p>
      </div>

    </div>
  );
}

const styles = {
  iconCircle: {
    width: 50, height: 50, borderRadius: '50%', background: '#f1f5f9', border: '1px solid #e2e8f0',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer',
    textDecoration: 'none', color: COLORS.primary
  }
};

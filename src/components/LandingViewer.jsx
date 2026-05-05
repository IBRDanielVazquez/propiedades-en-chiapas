import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function LandingViewer({ slug }) {
  const [html, setHtml] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('landings')
      .select('html_content, id, title')
      .eq('slug', slug)
      .eq('active', true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
          return;
        }
        setHtml(data.html_content);
        // Incrementar vistas
        supabase.rpc('increment_landing_views', { landing_id: data.id }).catch(() => {});
      });
  }, [slug]);

  if (notFound) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif', color:'#1e293b' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔍</div>
        <h1 style={{ fontWeight:900, marginBottom:'.5rem' }}>Página no encontrada</h1>
        <p style={{ color:'#64748b' }}>Esta landing no existe o no está disponible.</p>
        <a href="/" style={{ marginTop:'1.5rem', color:'#1A1A6E', fontWeight:700, textDecoration:'none' }}>← Volver al inicio</a>
      </div>
    );
  }

  if (!html) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' }}>
        <div style={{ width:36, height:36, border:'3px solid rgba(255,255,255,.2)', borderTopColor:'#38bdf8', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
        <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
      </div>
    );
  }

  // Renderiza el HTML completo en un iframe que ocupa toda la pantalla
  return (
    <iframe
      srcDoc={html}
      style={{ width:'100vw', height:'100vh', border:'none', display:'block' }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      title="Landing Page"
    />
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

// ─── Íconos inline ───────────────────────────────────────────────
const Icon = {
  back: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
  ),
  wa: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
  ),
  share: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  map: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  area: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3H3v18h18V3z"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
    </svg>
  ),
  type: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    </svg>
  ),
  tag: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  arrow: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  user: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

// ─── Formateador de precio ───────────────────────────────────────
const fmt = (n) =>
  n ? "$" + Number(n).toLocaleString("es-MX") : null;

// ─── Componente principal ────────────────────────────────────────
export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prop, setProp] = useState(null);
  const [asesor, setAsesor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("properties")
        .select("*, users(name, photo_url, whatsapp, phone, agency, role, slug)")
        .eq("id", id)
        .single();
      if (data) {
        setProp(data);
        setAsesor(data.users);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#F6F8FC" }}>
      <div className="pd-spin" />
    </div>
  );

  if (!prop) return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#F6F8FC" }}>
      <p style={{ color: "#5C6B8A", fontFamily: "Plus Jakarta Sans, sans-serif" }}>Propiedad no encontrada.</p>
    </div>
  );

  const waNumber = asesor?.whatsapp || "529612466204";
  const waMsg = encodeURIComponent(
    `Hola, me interesa la propiedad: ${prop.title}. ¿Podrías darme más información?`
  );
  const waUrl = `https://wa.me/${waNumber.replace(/\D/g, "")}?text=${waMsg}`;
  const pageUrl = window.location.href;

  return (
    <div className="pd-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .pd-root {
          --ink: #0B1B3A;
          --indigo: #13287A;
          --indigo2: #1E3A9B;
          --green: #0E9F6E;
          --green2: #10B981;
          --amber: #E8A33D;
          --bg: #F6F8FC;
          --card: #FFFFFF;
          --muted: #5C6B8A;
          --line: #E4EAF4;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: var(--ink);
          background: var(--bg);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
        .pd-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .disp { font-family: 'Clash Display', 'Plus Jakarta Sans', sans-serif; }

        /* Header sticky */
        .pd-hd {
          position: sticky; top: 0; z-index: 50;
          background: rgba(246,248,252,.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--line);
          padding: 12px 18px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .pd-back {
          display: flex; align-items: center; gap: 8px;
          background: none; border: 1.5px solid var(--line);
          color: var(--indigo); font-weight: 700; font-size: 13.5px;
          padding: 8px 14px; border-radius: 999px; cursor: pointer;
          transition: .16s; font-family: inherit;
        }
        .pd-back:hover { background: var(--indigo); color: #fff; border-color: var(--indigo); }
        .pd-hd-title {
          font-size: 14px; font-weight: 700; color: var(--ink);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          flex: 1; text-align: center;
        }
        .pd-share-btn {
          background: none; border: 1.5px solid var(--line);
          color: var(--muted); padding: 8px 10px; border-radius: 999px;
          cursor: pointer; display: grid; place-items: center; transition: .16s;
        }
        .pd-share-btn:hover { border-color: var(--indigo); color: var(--indigo); }

        /* Body */
        .pd-body { max-width: 900px; margin: 0 auto; padding: 0 16px 80px; }

        /* Hero image */
        .pd-hero {
          margin: 18px 0;
          border-radius: 22px; overflow: hidden;
          aspect-ratio: 16/9;
          background: linear-gradient(145deg, var(--indigo), var(--indigo2));
          position: relative;
          box-shadow: 0 20px 50px rgba(19,40,122,.15);
        }
        @media(min-width:640px){ .pd-hero { aspect-ratio: 16/8; } }
        .pd-hero img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .pd-hero-placeholder {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
          color: rgba(255,255,255,.5);
        }
        .pd-hero-placeholder svg { width: 52px; height: 52px; opacity: .4; }
        .pd-hero-placeholder span { font-size: 13px; font-weight: 600; }
        .pd-badge {
          position: absolute; top: 14px; left: 14px;
          background: rgba(255,255,255,.15); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,.25);
          color: #fff; font-size: 11px; font-weight: 800;
          letter-spacing: .5px; text-transform: uppercase;
          padding: 6px 13px; border-radius: 999px;
        }
        .pd-badge-land {
          background: rgba(16,185,129,.85); border-color: transparent;
        }

        /* Título y precio */
        .pd-title-row { margin: 22px 0 6px; }
        .pd-title { font-size: clamp(22px, 5vw, 32px); font-weight: 700; letter-spacing: -.5px; line-height: 1.1; }
        .pd-loc {
          display: flex; align-items: center; gap: 6px;
          color: var(--muted); font-size: 13.5px; font-weight: 600; margin-top: 8px;
        }
        .pd-price-block {
          margin: 20px 0;
          padding: 20px;
          background: linear-gradient(135deg, var(--indigo) 0%, var(--indigo2) 100%);
          border-radius: 18px;
          color: #fff;
          box-shadow: 0 12px 30px rgba(19,40,122,.2);
        }
        .pd-price-label { font-size: 12px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; opacity: .7; }
        .pd-price-val { font-size: clamp(28px, 6vw, 40px); font-weight: 800; letter-spacing: -1px; margin-top: 4px; }
        .pd-price-suffix { font-size: 14px; font-weight: 600; opacity: .8; margin-top: 3px; }

        /* Specs grid */
        .pd-specs {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
          margin: 18px 0;
        }
        @media(min-width:480px){ .pd-specs { grid-template-columns: repeat(3,1fr); } }
        .pd-spec {
          background: var(--card); border: 1px solid var(--line);
          border-radius: 14px; padding: 14px 12px;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          text-align: center;
        }
        .pd-spec-icon { color: var(--indigo); }
        .pd-spec-val { font-size: 14px; font-weight: 800; color: var(--ink); }
        .pd-spec-lbl { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .4px; }

        /* Sección */
        .pd-section { margin: 26px 0; }
        .pd-section-title { font-size: 17px; font-weight: 800; letter-spacing: -.3px; margin-bottom: 12px; }
        .pd-description {
          font-size: 15px; line-height: 1.75; color: #334166;
          white-space: pre-line;
        }

        /* CTA Ver desarrollo */
        .pd-cta-dev {
          display: flex; align-items: center; justify-content: space-between;
          background: linear-gradient(135deg, #0a2e1a, var(--green));
          color: #fff; padding: 18px 22px; border-radius: 18px;
          cursor: pointer; border: none; width: 100%; font-family: inherit;
          box-shadow: 0 10px 28px rgba(14,159,110,.3);
          transition: transform .2s, box-shadow .2s;
          margin: 20px 0; text-decoration: none;
        }
        .pd-cta-dev:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(14,159,110,.4); }
        .pd-cta-dev-text b { font-size: 16px; font-weight: 800; display: block; }
        .pd-cta-dev-text span { font-size: 12.5px; opacity: .8; margin-top: 2px; display: block; }

        /* Asesor */
        .pd-asesor {
          background: var(--card); border: 1px solid var(--line);
          border-radius: 20px; padding: 20px; margin: 20px 0;
        }
        .pd-asesor-head { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .pd-asesor-avatar {
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(145deg, var(--indigo), var(--indigo2));
          display: grid; place-items: center; color: #fff; flex: none;
          overflow: hidden;
        }
        .pd-asesor-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .pd-asesor-name { font-size: 16px; font-weight: 800; }
        .pd-asesor-role { font-size: 12.5px; color: var(--muted); font-weight: 600; margin-top: 2px; }
        .pd-asesor-agency { font-size: 12px; color: var(--green2); font-weight: 700; margin-top: 2px; }
        .pd-wa-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: #25D366; color: #fff;
          padding: 14px 20px; border-radius: 14px; border: none;
          font-size: 15px; font-weight: 800; cursor: pointer;
          width: 100%; font-family: inherit; text-decoration: none;
          box-shadow: 0 8px 20px rgba(37,211,102,.3); transition: .18s;
        }
        .pd-wa-btn:hover { background: #1da851; box-shadow: 0 12px 26px rgba(37,211,102,.4); }

        /* Compartir */
        .pd-share {
          margin: 20px 0;
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .pd-share-action {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px; border-radius: 14px; border: 1.5px solid var(--line);
          font-size: 13.5px; font-weight: 700; cursor: pointer;
          background: var(--card); color: var(--ink);
          font-family: inherit; transition: .16s; text-decoration: none;
        }
        .pd-share-action:hover { border-color: var(--indigo); color: var(--indigo); }
        .pd-share-action.wa { background: #25D366; color: #fff; border-color: #25D366; }
        .pd-share-action.wa:hover { background: #1da851; }

        /* Spinner */
        .pd-spin {
          width: 40px; height: 40px; border-radius: 50%;
          border: 3px solid var(--line);
          border-top-color: var(--indigo);
          animation: spin .8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <header className="pd-hd">
        <button className="pd-back" onClick={() => navigate(-1)}>
          <Icon.back /> Volver
        </button>
        <span className="pd-hd-title disp">{prop.title}</span>
        <button className="pd-share-btn" onClick={() => navigator.clipboard?.writeText(pageUrl)}>
          <Icon.share />
        </button>
      </header>

      <div className="pd-body">

        {/* Hero */}
        <div className="pd-hero">
          {prop.featured_image_url && !imgError ? (
            <img
              src={prop.featured_image_url}
              alt={prop.title}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="pd-hero-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              <span>Sin foto aún</span>
            </div>
          )}
          <div className={`pd-badge ${prop.landing_slug ? "pd-badge-land" : ""}`}>
            {prop.landing_slug ? "✦ Ver desarrollo" : prop.operation_type || "Venta"}
          </div>
        </div>

        {/* Título */}
        <div className="pd-title-row">
          <h1 className="pd-title disp">{prop.title}</h1>
          <div className="pd-loc">
            <Icon.map /> {prop.city || "Chiapas"}
          </div>
        </div>

        {/* Precio */}
        <div className="pd-price-block">
          <div className="pd-price-label">Precio</div>
          <div className="pd-price-val disp">{fmt(prop.price) || "Consultar"}</div>
          {prop.price_suffix && (
            <div className="pd-price-suffix">{prop.price_suffix}</div>
          )}
        </div>

        {/* Specs */}
        <div className="pd-specs">
          <div className="pd-spec">
            <span className="pd-spec-icon"><Icon.type /></span>
            <span className="pd-spec-val">{prop.type || "—"}</span>
            <span className="pd-spec-lbl">Tipo</span>
          </div>
          <div className="pd-spec">
            <span className="pd-spec-icon"><Icon.area /></span>
            <span className="pd-spec-val">{prop.size_m2 ? prop.size_m2 + " m²" : "—"}</span>
            <span className="pd-spec-lbl">Terreno</span>
          </div>
          <div className="pd-spec">
            <span className="pd-spec-icon"><Icon.tag /></span>
            <span className="pd-spec-val" style={{ color: "#10B981" }}>
              {prop.status || "Disponible"}
            </span>
            <span className="pd-spec-lbl">Estado</span>
          </div>
        </div>

        {/* Ver desarrollo completo */}
        {prop.landing_slug && (
          <a
            className="pd-cta-dev"
            href={`/${prop.landing_slug}`}
          >
            <div className="pd-cta-dev-text">
              <b>Ver desarrollo completo</b>
              <span>Planos, amenidades, galería y más</span>
            </div>
            <Icon.arrow />
          </a>
        )}

        {/* Descripción */}
        {prop.description && (
          <div className="pd-section">
            <h2 className="pd-section-title disp">Sobre esta propiedad</h2>
            <p className="pd-description">{prop.description}</p>
          </div>
        )}

        {/* Asesor */}
        <div className="pd-asesor">
          <div className="pd-asesor-head">
            <div className="pd-asesor-avatar">
              {asesor?.photo_url
                ? <img src={asesor.photo_url} alt={asesor.name} />
                : <Icon.user />
              }
            </div>
            <div>
              <div className="pd-asesor-name">{asesor?.name || "Asesor Inmobiliario"}</div>
              <div className="pd-asesor-role">{asesor?.role || "Asesor Inmobiliario"}</div>
              {asesor?.agency && (
                <div className="pd-asesor-agency">{asesor.agency}</div>
              )}
            </div>
          </div>
          <a className="pd-wa-btn" href={waUrl} target="_blank" rel="noopener noreferrer">
            <Icon.wa /> Contactar por WhatsApp
          </a>
        </div>

        {/* Compartir */}
        <div className="pd-section">
          <h2 className="pd-section-title disp">Compartir propiedad</h2>
          <div className="pd-share">
            <a
              className="pd-share-action wa"
              href={`https://wa.me/?text=${encodeURIComponent(prop.title + " - " + pageUrl)}`}
              target="_blank" rel="noopener noreferrer"
            >
              <Icon.wa /> WhatsApp
            </a>
            <button
              className="pd-share-action"
              onClick={() => navigator.clipboard?.writeText(pageUrl)}
            >
              <Icon.share /> Copiar link
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

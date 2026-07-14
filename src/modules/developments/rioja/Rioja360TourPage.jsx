import { useState, useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Compass, Share2, Phone, ArrowLeft, Eye, Sparkles, 
  MapPin, DollarSign, Layers, Home, Check
} from 'lucide-react';
import '../../developments/rioja/styles/rioja.css';

const Tour360 = lazy(() => import('./components/Tour360'));

export default function Rioja360TourPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Estado para controlar si el visor 360° está activo
  const tourActive = searchParams.get('tour') === '1';
  
  // Estado para el feedback de enlace copiado
  const [showToast, setShowToast] = useState(false);

  // Auto-scroll al tope al montar la portada
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tourActive]);

  // Mensajes de compartir
  const shareTitle = 'RIOJA | Recorrido virtual 360°';
  const shareText = 'Conoce RIOJA como si estuvieras ahí y descubre dónde puede comenzar tu patrimonio.';
  const shareUrl = 'https://www.propiedadesenchiapas.com/rioja/360';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.info('[Share] Cancelado o fallido:', error);
      }
    } else {
      // Fallback: Copiar enlace al portapapeles
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error('Error al copiar al portapapeles:', err);
      }
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Conoce RIOJA en un recorrido virtual 360° y explora el desarrollo como si estuvieras ahí: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const startTour = () => {
    setSearchParams({ tour: '1' });
  };

  const closeTour = () => {
    // Al cerrar, limpiamos los parámetros de búsqueda para volver a la portada
    setSearchParams({});
  };

  const goBackToLanding = () => {
    navigate('/rioja');
  };

  // Manejar dock de navegación
  const handleDockClick = (sectionId) => {
    navigate(`/rioja#${sectionId}`);
  };

  return (
    <div className="rioja-wrapper rioja-360-page-wrapper">
      <Helmet>
        <title>RIOJA 360° | Recorre el desarrollo como si estuvieras ahí</title>
        <meta name="description" content="Explora RIOJA en un recorrido virtual 360° y conoce su ubicación, accesos y entorno desde cualquier lugar." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.propiedadesenchiapas.com/rioja/360" />
        <meta property="og:title" content="RIOJA 360° | Recorre el desarrollo como si estuvieras ahí" />
        <meta property="og:description" content="Explora RIOJA en un recorrido virtual 360° y conoce su ubicación, accesos y entorno desde cualquier lugar." />
        <meta property="og:image" content="https://www.propiedadesenchiapas.com/rioja/og-image-360-1200x630.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.propiedadesenchiapas.com/rioja/360" />
        <meta name="twitter:title" content="RIOJA 360° | Recorrido Virtual" />
        <meta name="twitter:description" content="Explora RIOJA en un recorrido virtual 360° y conoce su ubicación, accesos y entorno." />
        <meta name="twitter:image" content="https://www.propiedadesenchiapas.com/rioja/og-image-360-1200x630.jpg" />

        <link rel="canonical" href="https://www.propiedadesenchiapas.com/rioja/360" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Renderizado condicional del visor 360 interactivo */}
      {tourActive ? (
        <Suspense fallback={
          <div style={{ position: 'fixed', inset: 0, background: '#141414', zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F7F1E8', fontFamily: 'Inter, sans-serif', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(247,241,232,0.1)', borderTopColor: '#B8924A', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#B8924A' }}>Cargando portal inmersivo RIOJA...</span>
          </div>
        }>
          <Tour360 onClose={closeTour} />
        </Suspense>
      ) : (
        <div 
          className="rioja-360-page-portal"
          style={{ backgroundImage: `url('/rioja/360/rioja-360-01.webp')` }}
        >
          {/* Overlay suave y luminoso */}
          <div className="rioja-360-page-overlay"></div>

          {/* Botón Atrás de alta fidelidad */}
          <button onClick={goBackToLanding} className="rioja-360-back-btn" aria-label="Volver a la página principal">
            <ArrowLeft size={18} />
            <span>Volver</span>
          </button>

          {/* Contenido emocional central */}
          <div className="rioja-360-page-content">
            <span className="rioja-360-page-badge">EXPERIENCIA INMERSIVA</span>
            <h1 className="rioja-360-page-headline">Explora RIOJA en 360°</h1>
            
            <p className="rioja-360-page-lead">
              No solo imagines tu próximo terreno. Recorre el lugar donde puede comenzar tu patrimonio.
            </p>
            
            <p className="rioja-360-page-subtext">
              Gira, explora y conoce RIOJA desde cualquier lugar, como si estuvieras ahí.
            </p>

            {/* Icono animado del visor 360 */}
            <div className="rioja-360-animated-sphere-wrapper" onClick={startTour}>
              <div className="rioja-360-animated-sphere">
                <Compass className="rioja-sphere-icon-spin" />
              </div>
              <span className="rioja-360-swipe-hint">Desliza para mirar a tu alrededor.</span>
            </div>

            {/* Acciones principales */}
            <div className="rioja-360-actions-grid">
              <button onClick={startTour} className="rioja-btn-enter-360">
                ENTRAR AL RECORRIDO 360°
              </button>
              
              <div className="rioja-360-secondary-actions">
                <button onClick={handleShare} className="rioja-btn-share-360">
                  <Share2 size={16} />
                  <span>COMPARTIR RECORRIDO</span>
                </button>
                <button onClick={handleWhatsAppShare} className="rioja-btn-whatsapp-share">
                  <Phone size={16} />
                  <span>Compartir por WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Menú inferior dock iOS-Style para navigation */}
          <nav className="rioja-ios-dock">
            <button className="rioja-dock-item" onClick={() => handleDockClick('inicio')} aria-label="Inicio">
              <Home size={20} />
              <span>Inicio</span>
            </button>
            <button className="rioja-dock-item" onClick={() => handleDockClick('financiamiento')} aria-label="Financiamiento">
              <DollarSign size={20} />
              <span>Precio</span>
            </button>
            <button className="rioja-dock-item active" aria-label="360°">
              <Eye size={20} />
              <span>360°</span>
            </button>
            <button className="rioja-dock-item" onClick={() => handleDockClick('galeria')} aria-label="Galería">
              <Layers size={20} />
              <span>Galería</span>
            </button>
            <button className="rioja-dock-item" onClick={() => handleDockClick('informacion')} aria-label="Ubicación">
              <MapPin size={20} />
              <span>Ubicación</span>
            </button>
          </nav>

          {/* Toast de confirmación de copia de enlace */}
          {showToast && (
            <div className="rioja-360-share-toast">
              <Check size={16} />
              <span>Enlace copiado</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

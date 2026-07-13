import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { riojaPhotos } from '../content/rioja-fotos.config';
import '../styles/rioja-gallery.css';

export default function RiojaGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse drag scroll handling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const openLightbox = (index) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % riojaPhotos.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? riojaPhotos.length - 1 : prev - 1));
  };

  // Handle swipe gestures in Lightbox
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide(e);
      } else {
        prevSlide(e);
      }
    }
  };

  return (
    <div className="rioja-gallery-section-wrapper">
      <div 
        className="rioja-gallery-scroll-container"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {riojaPhotos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="rioja-gallery-slide"
            onClick={() => openLightbox(index)}
          >
            <div className="rioja-gallery-image-wrapper">
              <img src={photo.url} alt={`Vista RIOJA ${index + 1}`} loading="lazy" />
              <div className="rioja-gallery-slide-overlay">
                <Maximize2 size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div 
          className="rioja-lightbox"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className="rioja-lightbox-close" onClick={closeLightbox} aria-label="Cerrar">
            <X size={28} />
          </button>

          <button className="rioja-lightbox-nav left" onClick={prevSlide} aria-label="Anterior">
            <ChevronLeft size={36} />
          </button>

          <div className="rioja-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={riojaPhotos[activeIndex].url} 
              alt={`Vista RIOJA ${activeIndex + 1}`} 
              className="rioja-lightbox-image" 
            />
          </div>

          <button className="rioja-lightbox-nav right" onClick={nextSlide} aria-label="Siguiente">
            <ChevronRight size={36} />
          </button>

          <div className="rioja-lightbox-counter">
            {activeIndex + 1} / {riojaPhotos.length}
          </div>
        </div>
      )}
    </div>
  );
}

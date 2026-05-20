import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { buildWhatsAppUrl } from '../lib/whatsapp';

export default function HeroCinematic({ onCTAButton, onWhatsAppClick }) {
  const whatsappUrl = buildWhatsAppUrl('hero');

  const handleAgendarClick = (e) => {
    if (onCTAButton) {
      e.preventDefault();
      onCTAButton();
    }
  };

  const handleWhatsApp = () => {
    if (onWhatsAppClick) {
      onWhatsAppClick('hero', 'hero');
    }
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center bg-[#14110E] overflow-hidden pt-24 pb-16">
      {/* Decorative premium radial gradients */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-[rgba(194,166,131,0.03)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] rounded-full bg-[rgba(194,166,131,0.02)] blur-[120px] pointer-events-none" />

      {/* Abstract luxurious background pattern or soft lights */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 filter sepia brightness-[0.3]" 
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600')` }} />
      <div className="absolute inset-0 bv-hero-overlay z-0" />

      <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
        <ScrollReveal delay={0.1}>
          <span className="inline-block px-4 py-1.5 rounded-full border border-[rgba(194,166,131,0.25)] bg-[rgba(194,166,131,0.06)] text-xs uppercase tracking-[0.3em] text-[#C2A683] font-bold mb-6">
            Lanzamiento Exclusivo · Propiedad Privada
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <h1 className="bv-title-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F4EFE6] leading-[1.1] mb-6">
            <span className="bv-gold-gradient">Bella Vista</span>
            <br />
            <span className="font-light text-3xl sm:text-5xl md:text-6xl">Ocozocoautla</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="bv-text-sans text-base sm:text-xl text-[rgba(244,239,230,0.75)] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Descubre el santuario residencial donde el lujo de la exclusividad y la paz de la naturaleza coexisten. Terrenos campestres de ensueño en el corazón de Chiapas.
          </p>
        </ScrollReveal>

        {/* Dynamic Buttons */}
        <ScrollReveal delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={handleAgendarClick}
              className="bv-btn-primary w-full sm:w-auto px-8 py-4 text-sm font-bold shadow-lg"
            >
              Agendar Recorrido Gratis
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsApp}
              className="bv-btn-secondary w-full sm:w-auto px-8 py-4 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 11.966.01c3.178 0 6.17 1.235 8.423 3.49 2.253 2.253 3.49 5.242 3.493 8.424-.007 6.554-5.344 11.89-11.913 11.89h-.005c-2.002-.001-3.959-.51-5.698-1.458L0 24zm6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c5.461 0 9.905-4.444 9.908-9.906.002-2.646-1.026-5.133-2.898-7.005A9.825 9.825 0 0011.968 1.98C6.507 1.98 2.06 6.425 2.057 11.887c-.001 2.01.528 3.977 1.529 5.727L2.615 21.3l3.777-.962z" />
              </svg>
              Hablar con un Asesor
            </a>
          </div>
        </ScrollReveal>

        {/* Feature Badges Container */}
        <ScrollReveal delay={0.5}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-[rgba(194,166,131,0.12)]">
            <div className="flex flex-col items-center">
              <span className="text-[#C2A683] text-2xl mb-2">🏞️</span>
              <span className="text-xs uppercase tracking-wider text-[rgba(244,239,230,0.5)] mb-1">Terrenos</span>
              <span className="font-semibold text-sm">Desde 200m²</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#C2A683] text-2xl mb-2">💵</span>
              <span className="text-xs uppercase tracking-wider text-[rgba(244,239,230,0.5)] mb-1">Cómodos Pagos</span>
              <span className="font-semibold text-sm">Desde $450/sem</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#C2A683] text-2xl mb-2">🛡️</span>
              <span className="text-xs uppercase tracking-wider text-[rgba(244,239,230,0.5)] mb-1">Certeza Jurídica</span>
              <span className="font-semibold text-sm">Propiedad Privada</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[#C2A683] text-2xl mb-2">💎</span>
              <span className="text-xs uppercase tracking-wider text-[rgba(244,239,230,0.5)] mb-1">Inversión Directa</span>
              <span className="font-semibold text-sm">Sin Buró de Crédito</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

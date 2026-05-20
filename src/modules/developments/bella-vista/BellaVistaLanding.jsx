import React from 'react';
import { useBellaVistaTracking } from './hooks/useBellaVistaTracking';
import './styles/tokens.css';
import './styles/fonts.css';
import './styles/bellavista.css';

// Importing Sections
import HeroCinematic from './sections/HeroCinematic';
import Manifiesto from './sections/Manifiesto';
import Amenidades from './sections/Amenidades';
import ExperienceReel from './sections/ExperienceReel';
import Inversion from './sections/Inversion';
import UbicacionMapa from './sections/UbicacionMapa';
import Testimonios from './sections/Testimonios';
import FAQ from './sections/FAQ';
import CTAFinal from './sections/CTAFinal';

// Importing Floating WhatsApp Button
import WhatsAppFloat from './components/WhatsAppFloat';

export default function BellaVistaLanding() {
  const { trackWhatsAppClick } = useBellaVistaTracking();

  const scrollToContact = () => {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bv-page min-h-screen text-[#F4EFE6] selection:bg-[#C2A683] selection:text-[#14110E] overflow-x-hidden">
      {/* Cinematic Hero Header */}
      <HeroCinematic 
        onCTAButton={scrollToContact} 
        onWhatsAppClick={trackWhatsAppClick} 
      />

      {/* Exclusivity Manifiesto */}
      <Manifiesto />

      {/* High-End Amenities */}
      <Amenidades />

      {/* Immersive Experience Carousel Reel */}
      <ExperienceReel />

      {/* Interactive Finance Simulator / Inversion */}
      <Inversion onCTAClick={scrollToContact} />

      {/* Strategic Location Details and Map */}
      <UbicacionMapa />

      {/* Premium Customer Testimonials */}
      <Testimonios />

      {/* Accordion FAQs */}
      <FAQ />

      {/* Lead Capture Form CRM */}
      <CTAFinal />

      {/* Floating Dynamic WhatsApp Button */}
      <WhatsAppFloat onClickTrack={trackWhatsAppClick} />
    </div>
  );
}

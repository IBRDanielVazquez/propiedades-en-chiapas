import React from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function UbicacionMapa() {
  const mapCoordinatesUrl = "https://maps.google.com/maps?q=Ocozocoautla%20de%20Espinosa%2C%20Chiapas&t=&z=13&ie=UTF8&iwloc=&output=embed";
  const externalGoogleMapsUrl = "https://www.google.com/maps/place/Ocozocoautla+de+Espinosa,+Chiapas/@16.7620163,-93.3853177,14z/";

  return (
    <section id="ubicacion" className="py-24 bg-[#1A1612] relative overflow-hidden">
      {/* Soft light effects */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-[rgba(194,166,131,0.015)] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text content on left */}
          <div className="lg:col-span-5 space-y-8">
            <ScrollReveal>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C2A683] font-bold">
                Conectividad y Naturaleza
              </span>
              <h2 className="bv-title-serif text-3xl md:text-5xl font-bold text-[#F4EFE6] mt-3 mb-6">
                Ubicación Estratégica
              </h2>
              <p className="bv-text-sans text-base text-[rgba(244,239,230,0.65)] leading-relaxed">
                Bella Vista está ubicado en el corredor campestre con mayor plusvalía de <strong>Ocozocoautla, Chiapas</strong>. Disfruta de un clima templado excepcional y una desconexión total del ruido urbano, manteniendo una conectividad envidiable.
              </p>
            </ScrollReveal>

            {/* Travel Times List */}
            <div className="space-y-4">
              <ScrollReveal delay={0.1}>
                <div className="flex items-center gap-4 bg-[rgba(26,22,18,0.3)] border border-[rgba(194,166,131,0.08)] p-4 rounded-xl">
                  <span className="text-2xl">🚗</span>
                  <div className="text-left">
                    <h4 className="font-semibold text-[#F4EFE6] text-sm">Tuxtla Gutiérrez</h4>
                    <p className="text-xs text-[rgba(244,239,230,0.5)]">A solo 25 minutos de la capital de Chiapas.</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="flex items-center gap-4 bg-[rgba(26,22,18,0.3)] border border-[rgba(194,166,131,0.08)] p-4 rounded-xl">
                  <span className="text-2xl">✈️</span>
                  <div className="text-left">
                    <h4 className="font-semibold text-[#F4EFE6] text-sm">Aeropuerto Internacional Ángel Albino Corzo</h4>
                    <p className="text-xs text-[rgba(244,239,230,0.5)]">Conexión aérea rápida a solo 40 minutos de distancia.</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex items-center gap-4 bg-[rgba(26,22,18,0.3)] border border-[rgba(194,166,131,0.08)] p-4 rounded-xl">
                  <span className="text-2xl">🌳</span>
                  <div className="text-left">
                    <h4 className="font-semibold text-[#F4EFE6] text-sm">Centro de Ocozocoautla (Pueblo Mágico)</h4>
                    <p className="text-xs text-[rgba(244,239,230,0.5)]">A escasos minutos de la gastronomía y cultura local.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.4}>
              <a
                href={externalGoogleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bv-btn-secondary inline-flex items-center justify-center px-6 py-3.5 text-xs uppercase tracking-wider font-bold gap-2 w-full sm:w-auto"
              >
                <span>Ver en Google Maps</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </a>
            </ScrollReveal>
          </div>

          {/* Interactive Map Frame on right */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={0.2}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[rgba(194,166,131,0.15)] bg-[rgba(26,22,18,0.5)] h-[350px] md:h-[480px] w-full">
                {/* Map iframe wrapped with premium filter */}
                <iframe
                  title="Bella Vista Ocozocoautla Map"
                  src={mapCoordinatesUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%) opacity(85%)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {/* Absolute overlay details */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#14110E]/90 backdrop-blur-md p-4 rounded-xl border border-[rgba(194,166,131,0.15)] text-left hidden sm:block">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#C2A683] tracking-widest">Desarrollo</span>
                      <h4 className="font-bold text-[#F4EFE6] text-sm">Bella Vista Ocozocoautla</h4>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-[#C2A683]/10 border border-[#C2A683]/20 text-[#C2A683] font-semibold">
                      Ubicación Verificada ✓
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

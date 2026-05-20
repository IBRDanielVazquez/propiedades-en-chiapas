/**
 * Amenidades — Landing Page Section
 * Módulo: developments/bella-vista/sections
 * Propósito: Listado y presentación visual de todas las amenidades exclusivas del desarrollo.
 */
import React from 'react';
import amenidadesData from '../content/amenidades.json';
import AmenidadCard from '../components/AmenidadCard';
import ScrollReveal from '../components/ScrollReveal';

export default function Amenidades() {
  return (
    <section id="amenidades" className="py-24 bg-[#1A1612] relative overflow-hidden">
      {/* Background soft golden glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(194,166,131,0.02)] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <ScrollReveal>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C2A683] font-bold">
            Tu estilo de vida campestre
          </span>
          <h2 className="bv-title-serif text-3xl md:text-5xl font-bold text-[#F4EFE6] mt-3 mb-6">
            Amenidades de Primer Nivel
          </h2>
          <p className="bv-text-sans text-base text-[rgba(244,239,230,0.65)] max-w-2xl mx-auto mb-16 leading-relaxed">
            Cada rincón de Bella Vista está planificado para convivir armónicamente con la flora y fauna local, ofreciendo comodidades premium que garantizan descanso, recreación y seguridad.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenidadesData.map((amenidad, idx) => (
            <ScrollReveal key={amenidad.id} delay={idx * 0.1}>
              <AmenidadCard
                icon={amenidad.icon}
                title={amenidad.title}
                description={amenidad.description}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

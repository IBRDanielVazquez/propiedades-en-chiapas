import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';

const REEL_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1000',
    tag: 'Estilo de Vida',
    title: 'Residencias en Armonía',
    desc: 'Arquitectura integrada con el paisaje boscoso y natural.'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000',
    tag: 'Naturaleza',
    title: 'Atardeceres Únicos',
    desc: 'La brisa fresca del valle y cielos despejados de Ocozocoautla.'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000',
    tag: 'Plusvalía',
    title: 'Inversión de Por Vida',
    desc: 'Crecimiento de plusvalía garantizado en una comunidad planificada.'
  }
];

export default function ExperienceReel() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="py-24 bg-[#14110E] relative overflow-hidden border-t border-[rgba(194,166,131,0.08)]">
      {/* Absolute luxury glow */}
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] rounded-full bg-[rgba(194,166,131,0.02)] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C2A683] font-bold">
              Experimenta Bella Vista
            </span>
            <h2 className="bv-title-serif text-3xl md:text-5xl font-bold text-[#F4EFE6] mt-3 mb-6">
              El Refugio que Mereces
            </h2>
            <p className="bv-text-sans text-base text-[rgba(244,239,230,0.65)] max-w-2xl mx-auto leading-relaxed">
              Descubre de manera visual la atmósfera, exclusividad y tranquilidad que rodea a cada lote campestre en Bella Vista. Un lugar proyectado para la plenitud.
            </p>
          </div>
        </ScrollReveal>

        {/* Large Interactive Cinematic Frame */}
        <ScrollReveal delay={0.2}>
          <div className="relative aspect-[16/9] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-[rgba(194,166,131,0.15)] group mb-8">
            {/* Image render with smooth animation */}
            <div className="absolute inset-0 bg-black">
              {REEL_IMAGES.map((img, idx) => (
                <div
                  key={img.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeIdx ? 'opacity-70 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
                  style={{
                    backgroundImage: `url('${img.url}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              ))}
            </div>

            {/* Premium vignette and bottom overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#14110E] via-transparent to-transparent opacity-90" />

            {/* Slide Information */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C2A683] text-[#14110E] text-[10px] uppercase font-bold tracking-widest mb-4">
                {REEL_IMAGES[activeIdx].tag}
              </span>
              <h3 className="bv-title-serif text-2xl md:text-4xl font-bold text-[#F4EFE6] mb-3">
                {REEL_IMAGES[activeIdx].title}
              </h3>
              <p className="bv-text-sans text-sm md:text-base text-[rgba(244,239,230,0.85)] max-w-lg font-light leading-relaxed">
                {REEL_IMAGES[activeIdx].desc}
              </p>
            </div>

            {/* Corner Indicators / Controls */}
            <div className="absolute top-6 right-6 flex gap-2">
              {REEL_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-10 h-1.5 rounded-full transition-all duration-300 ${idx === activeIdx ? 'bg-[#C2A683] w-14' : 'bg-white/30 hover:bg-white/50'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Thumbnail Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REEL_IMAGES.map((img, idx) => (
            <ScrollReveal key={img.id} delay={idx * 0.1}>
              <div
                onClick={() => setActiveIdx(idx)}
                className={`cursor-pointer rounded-2xl overflow-hidden border p-4 transition-all duration-400 ${idx === activeIdx ? 'bg-[rgba(194,166,131,0.06)] border-[#C2A683]' : 'bg-[rgba(26,22,18,0.3)] border-[rgba(194,166,131,0.12)] hover:border-[rgba(194,166,131,0.3)]'}`}
              >
                <div className="flex gap-4 items-center">
                  <div
                    className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url('${img.url}')` }}
                  />
                  <div className="text-left">
                    <span className="text-[10px] uppercase text-[#C2A683] font-bold tracking-widest">
                      {img.tag}
                    </span>
                    <h4 className="font-semibold text-[#F4EFE6] text-sm mt-0.5">
                      {img.title}
                    </h4>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

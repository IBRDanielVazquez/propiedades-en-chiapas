import React from 'react';
import testimoniosData from '../content/testimonios.json';
import ScrollReveal from '../components/ScrollReveal';

export default function Testimonios() {
  return (
    <section className="py-24 bg-[#14110E] relative overflow-hidden border-t border-[rgba(194,166,131,0.08)]">
      {/* Subtle gold decoration background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[rgba(194,166,131,0.015)] blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
        <ScrollReveal>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C2A683] font-bold">
            Opinión de nuestros miembros
          </span>
          <h2 className="bv-title-serif text-3xl md:text-5xl font-bold text-[#F4EFE6] mt-3 mb-16">
            Testimonios de Propietarios
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {testimoniosData.map((testimonio, idx) => (
            <ScrollReveal key={testimonio.id} delay={idx * 0.1}>
              <div className="bv-glass-card p-8 flex flex-col justify-between h-full group">
                <div className="space-y-6">
                  {/* Luxury Star Rating */}
                  <div className="flex gap-1 text-[#C2A683] text-sm">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  
                  <p className="bv-text-sans text-[15px] text-[rgba(244,239,230,0.85)] font-light leading-relaxed italic">
                    "{testimonio.text}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[rgba(194,166,131,0.08)] flex gap-4 items-center">
                  {/* Decorative Initials Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C2A683] to-[#8E714F] text-[#14110E] flex items-center justify-center font-bold text-sm">
                    {testimonio.name.split(' ').slice(-2).map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#F4EFE6] text-sm">
                      {testimonio.name}
                    </h4>
                    <span className="text-xs text-[#C2A683]/80 font-medium">
                      {testimonio.role}
                    </span>
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

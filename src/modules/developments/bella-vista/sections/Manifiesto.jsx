import React from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function Manifiesto() {
  return (
    <section className="py-24 bg-[#14110E] relative overflow-hidden flex items-center justify-center">
      {/* Background soft gold lights */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-[rgba(194,166,131,0.015)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[rgba(194,166,131,0.015)] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <ScrollReveal>
          <div className="border border-[rgba(194,166,131,0.2)] bg-[rgba(26,22,18,0.3)] backdrop-blur-md rounded-3xl p-10 md:p-16 text-center shadow-2xl relative">
            {/* Elegant corner details */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[rgba(194,166,131,0.4)]" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[rgba(194,166,131,0.4)]" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[rgba(194,166,131,0.4)]" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[rgba(194,166,131,0.4)]" />

            <span className="text-xs uppercase tracking-[0.3em] text-[#C2A683] font-bold block mb-8">
              Declaración de Visión
            </span>

            <h2 className="bv-title-serif text-3xl md:text-5xl font-bold tracking-tight text-[#F4EFE6] leading-tight mb-8">
              Un Legado de Paz,<br />
              <span className="bv-gold-gradient">Escrito en la Tierra</span>
            </h2>

            <div className="space-y-6 text-base md:text-lg text-[rgba(244,239,230,0.8)] font-light leading-relaxed max-w-2xl mx-auto text-justify md:text-center">
              <p>
                Creemos que el verdadero lujo no reside en lo ostentoso, sino en el silencio reparador de la mañana, en la majestuosidad de un horizonte despejado y en la certeza de estar construyendo un patrimonio eterno para quienes amamos.
              </p>
              <p>
                <strong>Bella Vista</strong> no es solo un desarrollo campestre; es el manifiesto de un estilo de vida que elige desconectarse del ruido cotidiano para reconectarse con lo esencial. Aquí, el aire puro, la brisa de Ocozocoautla y la exclusividad se fusionan para dar vida a tu refugio perfecto.
              </p>
              <p className="text-sm uppercase tracking-widest text-[#C2A683] font-semibold pt-4">
                — Bienvenue al origen del descanso.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function Inversion({ onCTAClick }) {
  const PRICE_PER_M2 = 1450; // $1,450 MXN per m2
  const DEFAULT_PERIOD_WEEKS = 312; // 6 Years (312 weeks)
  
  const [m2, setM2] = useState(200);
  const [enganchePercent, setEnganchePercent] = useState(10); // 10%

  // Calculations
  const totalPrice = m2 * PRICE_PER_M2;
  const enganche = Math.round(totalPrice * (enganchePercent / 100));
  const remainingPrice = totalPrice - enganche;
  const weeklyPayment = Math.round(remainingPrice / DEFAULT_PERIOD_WEEKS);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <section id="inversion" className="py-24 bg-[#1A1612] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-[rgba(194,166,131,0.02)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[rgba(194,166,131,0.01)] blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C2A683] font-bold">
              Una inversión inteligente y segura
            </span>
            <h2 className="bv-title-serif text-3xl md:text-5xl font-bold text-[#F4EFE6] mt-3 mb-6">
              Financiamiento a Tu Medida
            </h2>
            <p className="bv-text-sans text-base text-[rgba(244,239,230,0.65)] max-w-2xl mx-auto leading-relaxed">
              Adquiere tu terreno con financiamiento directo sin revisar buró de crédito. Simula tu plan y descubre lo accesible que es construir tu patrimonio hoy mismo.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Information grid */}
          <div className="lg:col-span-5 space-y-8">
            <ScrollReveal delay={0.1}>
              <div className="border-l-2 border-[#C2A683] pl-6 py-2">
                <h3 className="text-[#C2A683] text-xs uppercase tracking-widest font-bold mb-2">Comodidad Financiera</h3>
                <h4 className="bv-title-serif text-xl font-semibold text-[#F4EFE6] mb-2">Pagos desde $450 semanales</h4>
                <p className="text-sm text-[rgba(244,239,230,0.7)] font-light leading-relaxed">
                  Diseñado para no descapitalizarte. Sustituye gastos hormiga por tierra de alta plusvalía en una de las zonas campestres con mayor proyección de Ocozocoautla.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="border-l-2 border-[#C2A683] pl-6 py-2">
                <h3 className="text-[#C2A683] text-xs uppercase tracking-widest font-bold mb-2">Aprobación Inmediata</h3>
                <h4 className="bv-title-serif text-xl font-semibold text-[#F4EFE6] mb-2">Trato Directo, Sin Buró</h4>
                <p className="text-sm text-[rgba(244,239,230,0.7)] font-light leading-relaxed">
                  Sin papeleos engorrosos. Solo requieres tu identificación oficial y el enganche inicial para firmar tu contrato con absoluta certeza legal.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="border-l-2 border-[#C2A683] pl-6 py-2">
                <h3 className="text-[#C2A683] text-xs uppercase tracking-widest font-bold mb-2">Flexibilidad Total</h3>
                <h4 className="bv-title-serif text-xl font-semibold text-[#F4EFE6] mb-2">Sin Penalización por Pagos Anticipados</h4>
                <p className="text-sm text-[rgba(244,239,230,0.7)] font-light leading-relaxed">
                  Si deseas liquidar antes o realizar abonos a capital, puedes hacerlo libremente para reducir tu plazo original sin recargos adicionales.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Interactive Calculator */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={0.2}>
              <div className="border border-[rgba(194,166,131,0.15)] bg-[rgba(26,22,18,0.5)] backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl">
                <h3 className="bv-title-serif text-2xl font-bold text-[#F4EFE6] mb-8 text-center pb-4 border-b border-[rgba(194,166,131,0.1)]">
                  Simulador de Inversión Campestre
                </h3>

                {/* Size Slider */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-[rgba(244,239,230,0.85)]">
                      Dimensiones del Lote:
                    </label>
                    <span className="text-[#C2A683] font-bold text-lg">
                      {m2} m²
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="600"
                    step="50"
                    value={m2}
                    onChange={(e) => setM2(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-[rgba(244,239,230,0.1)] appearance-none cursor-pointer accent-[#C2A683]"
                  />
                  <div className="flex justify-between text-xs text-[rgba(244,239,230,0.4)] mt-1">
                    <span>200 m² (Estándar)</span>
                    <span>400 m²</span>
                    <span>600 m² (Premium)</span>
                  </div>
                </div>

                {/* Enganche Slider */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-[rgba(244,239,230,0.85)]">
                      Porcentaje de Enganche:
                    </label>
                    <span className="text-[#C2A683] font-bold text-lg">
                      {enganchePercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="5"
                    value={enganchePercent}
                    onChange={(e) => setEnganchePercent(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-[rgba(244,239,230,0.1)] appearance-none cursor-pointer accent-[#C2A683]"
                  />
                  <div className="flex justify-between text-xs text-[rgba(244,239,230,0.4)] mt-1">
                    <span>10% (Pago inicial bajo)</span>
                    <span>25%</span>
                    <span>40% (Mejor mensualidad)</span>
                  </div>
                </div>

                {/* Dynamic Results Grid */}
                <div className="grid grid-cols-2 gap-4 p-6 rounded-2xl bg-[rgba(20,17,14,0.7)] border border-[rgba(194,166,131,0.08)] mb-8">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-[rgba(244,239,230,0.4)] mb-1">Precio de Lista</span>
                    <span className="text-lg font-semibold text-[#F4EFE6]">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-[rgba(244,239,230,0.4)] mb-1">Enganche Inicial ({enganchePercent}%)</span>
                    <span className="text-lg font-semibold text-[#C2A683]">{formatCurrency(enganche)}</span>
                  </div>
                  <div className="col-span-2 pt-4 border-t border-[rgba(194,166,131,0.08)] flex justify-between items-center">
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-[rgba(244,239,230,0.4)] mb-1">Pago Semanal Estimado</span>
                      <span className="text-xs text-[rgba(244,239,230,0.45)]">Plazo de {DEFAULT_PERIOD_WEEKS / 52} años ({DEFAULT_PERIOD_WEEKS} semanas)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl md:text-3xl font-extrabold text-[#C2A683] block">
                        {formatCurrency(weeklyPayment)}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[#C2A683]/70 font-semibold">MXN / Semanal</span>
                    </div>
                  </div>
                </div>

                {/* Call to Action inside Simulator */}
                <button
                  onClick={onCTAClick}
                  className="bv-btn-primary w-full py-4 text-sm font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  Congelar Esta Simulación
                </button>
                <span className="block text-center text-[10px] text-[rgba(244,239,230,0.35)] mt-3">
                  *Precios y promociones sujetas a disponibilidad. Simulación meramente informativa de carácter ilustrativo.
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

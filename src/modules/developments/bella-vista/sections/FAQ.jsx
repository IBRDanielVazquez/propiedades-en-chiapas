/**
 * FAQ — Landing Page Section
 * Módulo: developments/bella-vista/sections
 * Propósito: Acordeón de preguntas y respuestas más frecuentes sobre el desarrollo.
 */
import React, { useState } from 'react';
import faqData from '../content/faq.json';
import ScrollReveal from '../components/ScrollReveal';

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-24 bg-[#14110E] border-t border-[rgba(194,166,131,0.08)]">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <ScrollReveal>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C2A683] font-bold">
            Resolviendo tus inquietudes
          </span>
          <h2 className="bv-title-serif text-3xl md:text-4xl font-bold text-[#F4EFE6] mt-3 mb-16">
            Preguntas Frecuentes
          </h2>
        </ScrollReveal>

        <div className="space-y-4 text-left">
          {faqData.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <ScrollReveal key={item.id} delay={idx * 0.1}>
                <div className="bv-faq-item">
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="bv-faq-trigger"
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span className={`bv-faq-icon text-2xl font-light ${isOpen ? 'open' : ''}`}>
                      +
                    </span>
                  </button>
                  <div className={`bv-faq-content ${isOpen ? 'open' : ''}`}>
                    <p className="pb-6 pr-8 text-[rgba(244,239,230,0.7)] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

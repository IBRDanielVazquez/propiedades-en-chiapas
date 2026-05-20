import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { createLead } from '../lib/leads';
import { useBellaVistaTracking } from '../hooks/useBellaVistaTracking';

export default function CTAFinal() {
  const { trackEvent, getUTMs } = useBellaVistaTracking();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: 'Deseo recibir más información sobre los lotes campestres y planes de financiamiento.',
  });

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'phone') {
      // Solo permitir dígitos y limitar a 10
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setStatus('error');
      setErrorMessage('El teléfono de contacto debe tener exactamente 10 dígitos numéricos.');
      return;
    }
    setStatus('loading');
    setErrorMessage('');

    try {
      const utms = getUTMs();
      const result = await createLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        section: 'cta_final',
        utms
      });

      if (result.error) {
        throw new Error(result.error.message || 'Error al guardar los datos.');
      }

      // Success
      setStatus('success');
      trackEvent('Lead', { 
        event_category: 'Form',
        event_label: 'CTA Final Success',
        value: 1
      });

      // Clear form
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: 'Deseo recibir más información sobre los lotes campestres y planes de financiamiento.',
      });
    } catch (err) {
      console.error('[CTAFinal] Submission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Hubo un error de conexión. Por favor intente más tarde.');
    }
  };

  return (
    <section id="contacto" className="py-24 bg-[#1A1612] relative overflow-hidden flex items-center justify-center">
      {/* Dynamic Background decorative lights */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[rgba(194,166,131,0.02)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[rgba(194,166,131,0.02)] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Informative column on the left */}
          <div className="lg:col-span-5 text-left space-y-6">
            <ScrollReveal>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C2A683] font-bold">
                Últimos lotes disponibles
              </span>
              <h2 className="bv-title-serif text-3xl md:text-5xl font-bold text-[#F4EFE6] mt-3">
                Asegura Tu Espacio
              </h2>
              <p className="bv-text-sans text-base text-[rgba(244,239,230,0.65)] leading-relaxed">
                Agenda hoy mismo una visita guiada gratuita de fin de semana o recibe una asesoría personalizada. Tu lote de ensueño en Bella Vista está a solo un clic.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <span className="text-[#C2A683] text-lg">✓</span>
                  <span className="text-sm text-[rgba(244,239,230,0.8)]">Precios congelados durante preventa</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#C2A683] text-lg">✓</span>
                  <span className="text-sm text-[rgba(244,239,230,0.8)]">Apartados desde $2,000 MXN</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#C2A683] text-lg">✓</span>
                  <span className="text-sm text-[rgba(244,239,230,0.8)]">Firma directa y certeza legal</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Form container on the right */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={0.2}>
              <div className="border border-[rgba(194,166,131,0.15)] bg-[rgba(26,22,18,0.5)] backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl">
                {status === 'success' ? (
                  <div className="text-center py-12 space-y-6">
                    <span className="text-5xl block animate-bounce">🎉</span>
                    <h3 className="bv-title-serif text-2xl font-bold text-[#C2A683]">
                      ¡Registro Exitoso!
                    </h3>
                    <p className="bv-text-sans text-sm text-[rgba(244,239,230,0.8)] max-w-sm mx-auto leading-relaxed">
                      Hemos recibido tus datos correctamente. Uno de nuestros asesores campestres premium se pondrá en contacto contigo de inmediato para brindarte los detalles.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="bv-btn-secondary px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                    >
                      Volver a registrar
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <h3 className="bv-title-serif text-2xl font-semibold text-[#F4EFE6] mb-4 text-center lg:text-left">
                      Solicitar Asesoría Premium
                    </h3>

                    <div className="flex flex-col">
                      <label className="text-xs uppercase tracking-wider text-[rgba(244,239,230,0.5)] mb-2 font-semibold">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej. Carlos Mendoza"
                        className="bv-input"
                        disabled={status === 'loading'}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-xs uppercase tracking-wider text-[rgba(244,239,230,0.5)] mb-2 font-semibold">
                          Teléfono de Contacto
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Ej. 961 123 4567"
                          className="bv-input"
                          disabled={status === 'loading'}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs uppercase tracking-wider text-[rgba(244,239,230,0.5)] mb-2 font-semibold">
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Ej. carlos@ejemplo.com"
                          className="bv-input"
                          disabled={status === 'loading'}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs uppercase tracking-wider text-[rgba(244,239,230,0.5)] mb-2 font-semibold">
                        Mensaje (Opcional)
                      </label>
                      <textarea
                        name="message"
                        rows="3"
                        value={formData.message}
                        onChange={handleChange}
                        className="bv-input resize-none"
                        disabled={status === 'loading'}
                      />
                    </div>

                    {status === 'error' && (
                      <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs leading-relaxed">
                        ⚠️ {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="bv-btn-primary w-full py-4 text-sm font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#14110E] border-t-transparent rounded-full animate-spin" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <span>Registrarme Ahora</span>
                      )}
                    </button>

                    <span className="block text-center text-[10px] text-[rgba(244,239,230,0.35)] mt-4">
                      Respetamos tus datos. Al registrarte aceptas nuestras Políticas de Privacidad.
                    </span>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

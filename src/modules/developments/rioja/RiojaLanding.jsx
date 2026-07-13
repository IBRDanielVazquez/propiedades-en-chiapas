import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Info, ArrowRight, CheckCircle, ChevronDown, Camera, Box, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import { riojaConfig } from './content/rioja.config';
import './styles/rioja.css';

export default function RiojaLanding() {
  const [openFaq, setOpenFaq] = useState(null);
  
  const scrollToContact = () => {
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToMap = () => {
    document.getElementById('ubicacion').scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${riojaConfig.whatsappNumber}?text=Hola, me interesa información sobre RIOJA.`, '_blank');
  };

  return (
    <div className="rioja-page">
      <Helmet>
        <title>{`${riojaConfig.name} | ${riojaConfig.subtitle}`}</title>
        <meta name="description" content={riojaConfig.description} />
        <meta property="og:title" content={`${riojaConfig.name} - Propiedades en Chiapas`} />
        <meta property="og:description" content={riojaConfig.description} />
        <link rel="canonical" href="https://propiedadesenchiapas.com/rioja" />
      </Helmet>

      {/* 1. Hero Section */}
      <header className="rioja-hero text-center text-white px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 text-sm font-semibold tracking-widest uppercase opacity-80">
            Un proyecto de PEC - Propiedades en Chiapas
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            {riojaConfig.name}
          </h1>
          <p className="text-xl md:text-3xl mb-10 font-light">
            {riojaConfig.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={scrollToContact} className="rioja-btn-primary">
              <Info size={20} /> Solicitar información
            </button>
            <button onClick={scrollToMap} className="rioja-btn-secondary">
              <MapPin size={20} /> Ver ubicación
            </button>
          </div>
          <div className="mt-8">
            <button onClick={handleWhatsApp} className="flex items-center justify-center gap-2 mx-auto text-green-400 hover:text-green-300 transition-colors">
              <Phone size={18} /> Contactar por WhatsApp
            </button>
          </div>
        </div>
      </header>

      {/* 2. Presentación del Proyecto */}
      <section className="rioja-section text-center">
        <h2 className="text-3xl font-bold mb-6">El Proyecto</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          {riojaConfig.description}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {riojaConfig.features.map((feature, idx) => (
            <div key={idx} className="rioja-card flex flex-col items-center">
              <CheckCircle size={32} className="text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900">{feature.label}</h3>
              <p className="text-gray-500">{feature.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Galería Placeholder */}
      <section className="rioja-section bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Galería</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((img) => (
            <div key={img} className="bg-gray-200 aspect-video rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-300 transition-colors cursor-pointer">
              <Camera size={48} className="mb-2 opacity-50" />
              <span>Imagen {img}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Recorridos 360 */}
      <section className="rioja-section">
        <h2 className="text-3xl font-bold text-center mb-10">Explora {riojaConfig.name} en 360°</h2>
        <div className="w-full bg-gray-900 rounded-xl aspect-video flex flex-col items-center justify-center text-white">
          <Box size={64} className="mb-4 opacity-50" />
          <p className="text-xl">Visor 360° / Kuula Placeholder</p>
          <p className="text-sm opacity-70 mt-2">Aquí se incrustará el recorrido virtual</p>
        </div>
      </section>

      {/* 6. Amenidades / Beneficios */}
      <section className="rioja-section bg-blue-900 text-white">
        <h2 className="text-3xl font-bold text-center mb-10">Amenidades y Beneficios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {riojaConfig.amenities.map((amenity, idx) => (
            <div key={idx} className="bg-blue-800 p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-3">{amenity.title}</h3>
              <p className="text-blue-200">{amenity.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Disponibilidad Demo */}
      <section className="rioja-section">
        <h2 className="text-3xl font-bold text-center mb-6">Disponibilidad (Demo)</h2>
        <p className="text-center text-gray-500 mb-10">Conoce el estatus de los lotes en tiempo real.</p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div> Disponible</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-500 rounded"></div> Apartado</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded"></div> Vendido</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-400 rounded"></div> Próxima etapa</div>
        </div>
        <div className="max-w-4xl mx-auto bg-gray-100 p-8 rounded-xl flex items-center justify-center min-h-[300px] border-2 border-dashed border-gray-300">
          <p className="text-gray-500">Masterplan Interactivo Placeholder</p>
        </div>
      </section>

      {/* 5. Ubicación */}
      <section id="ubicacion" className="rioja-section bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-6">Ubicación Estratégica</h2>
        <p className="text-center text-gray-600 mb-10">{riojaConfig.location.address}</p>
        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center">
           <iframe 
             src={riojaConfig.location.mapUrl}
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen="" 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
             title="Ubicación RIOJA"
           ></iframe>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="rioja-section max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-10">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {riojaConfig.faq.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
              <button 
                className="w-full text-left p-4 bg-white hover:bg-gray-50 flex justify-between items-center font-semibold text-gray-800"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                {item.q}
                <ChevronDown className={`transform transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-gray-50 text-gray-600 border-t border-gray-200">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Formulario & 11. CTA Final */}
      <section id="contacto" className="rioja-section bg-gray-900 text-white rounded-t-[3rem]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold mb-6">Da el primer paso</h2>
            <p className="text-gray-400 mb-8">Déjanos tus datos y un asesor especializado de PEC se pondrá en contacto contigo para brindarte toda la información que necesites sobre RIOJA.</p>
            <div className="space-y-4 mb-8">
              <button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold transition">
                <Phone size={20} /> Hablar por WhatsApp
              </button>
              <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 py-3 rounded-lg font-bold transition">
                <MapPin size={20} /> Agendar Visita al Desarrollo
              </button>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl text-gray-800 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-center">Solicitar Información</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative mb-4">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input type="text" placeholder="Nombre completo" className="rioja-input pl-10" required />
              </div>
              <div className="relative mb-4">
                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                <input type="tel" placeholder="Teléfono / WhatsApp" className="rioja-input pl-10" required />
              </div>
              <div className="relative mb-4">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input type="email" placeholder="Correo electrónico (Opcional)" className="rioja-input pl-10" />
              </div>
              <div className="relative mb-4">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input type="text" placeholder="Ciudad de residencia" className="rioja-input pl-10" required />
              </div>
              <div className="mb-4">
                <textarea placeholder="¿Tienes alguna duda en específico?" className="rioja-input min-h-[100px]"></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">Preferencia de contacto:</label>
                <select className="rioja-input">
                  <option>WhatsApp</option>
                  <option>Llamada telefónica</option>
                  <option>Correo electrónico</option>
                </select>
              </div>
              <div className="mb-6 flex items-start gap-2">
                <input type="checkbox" id="privacy" className="mt-1" required />
                <label htmlFor="privacy" className="text-xs text-gray-500">
                  Acepto el <a href="/privacidad" className="text-blue-600 underline">aviso de privacidad</a> y el tratamiento de mis datos personales.
                </label>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2">
                Enviar mensaje <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 text-center text-sm border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} />
            <span>Comercializado por PEC - Propiedades en Chiapas</span>
          </div>
          <div className="flex gap-4">
            <a href="/" className="hover:text-white transition-colors">Sitio Principal</a>
            <a href="/privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</a>
          </div>
        </div>
        <div className="mt-6 text-gray-600">
          © {new Date().getFullYear()} {riojaConfig.name}. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

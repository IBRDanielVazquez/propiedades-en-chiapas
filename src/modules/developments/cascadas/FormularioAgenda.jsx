import { useState } from 'react';
import { ArrowRight, CalendarCheck, MessageCircle } from 'lucide-react';
import { dispararEvento } from '../../../lib/tracking';

const PHONE = '529612466204';

const DIAS = [
  'Hoy mismo',
  'Mañana',
  'Este fin de semana',
  'Entre semana',
  'Aún no lo decido',
];

function soloDigitos(valor) {
  return valor.replace(/\D/g, '').slice(0, 10);
}

export default function FormularioAgenda({ onLeadSubmit }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dia, setDia] = useState(DIAS[2]);
  const [consiente, setConsiente] = useState(false);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const validar = () => {
    const nuevos = {};
    if (nombre.trim().length < 3) nuevos.nombre = 'Escribe tu nombre completo.';
    if (telefono.length !== 10) nuevos.telefono = 'Necesitamos 10 dígitos, con LADA.';
    if (!consiente) nuevos.consiente = 'Necesitamos tu autorización para contactarte.';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const enviar = () => {
    if (!validar()) return;

    const lead = {
      nombre: nombre.trim(),
      telefono,
      dia,
      desarrollo: 'Cascadas del Sur',
      origen: 'landing_cascadas_formulario',
      fecha: new Date().toISOString(),
    };

    dispararEvento('Lead', { content_name: 'Cascadas del Sur', origen: lead.origen });
    dispararEvento('Schedule', { content_name: 'Cascadas del Sur', dia });

    // Guardado en base de datos: lo conecta Antigravity cuando el backend esté activo.
    if (typeof onLeadSubmit === 'function') {
      try {
        onLeadSubmit(lead);
      } catch (error) {
        if (import.meta.env?.DEV) console.warn('[agenda] onLeadSubmit:', error);
      }
    }

    const mensaje =
      `Hola, soy ${lead.nombre}. Quiero agendar una visita a Cascadas del Sur.\n` +
      `Preferencia de día: ${dia}.\n` +
      `Mi WhatsApp: ${telefono}.`;

    const whatsappUrl = `https://wa.me/${PHONE}?text=${encodeURIComponent(mensaje)}`;
    window.dispatchEvent(new CustomEvent('pec:whatsapp', { detail: {
      url: whatsappUrl, nombre: lead.nombre, telefono: lead.telefono,
      desarrollo: lead.desarrollo, intencion: 'Agendar visita', preferencia: dia,
    } }));
    setEnviado(true);
    window.open(
      whatsappUrl,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <section id="agenda" className="cds-section cds-agenda">
      <div className="cds-wrap cds-agenda-inner">
        <div className="cds-agenda-copy">
          <span className="cds-eyebrow">AGENDA TU VISITA</span>
          <h2>Hay decisiones que se sienten mejor en persona.</h2>
          <p>
            Camina el desarrollo, conoce el entorno e imagina lo que podrías construir aquí. Dinos cuándo te gustaría visitarlo y un asesor te ayudará a preparar el recorrido.
          </p>
          <ul className="cds-agenda-list">
            <li><CalendarCheck size={18} /> Recorre el desarrollo y conoce su entorno</li>
            <li><MessageCircle size={18} /> Elige el momento que mejor te funcione</li>
          </ul>
        </div>

        <div className="cds-agenda-card">
          {enviado ? (
            <div className="cds-agenda-ok" role="status">
              <CalendarCheck size={34} />
              <h3>Listo, {nombre.trim().split(' ')[0]}</h3>
              <p>
                Abrimos WhatsApp con tus datos. Si no se abrió, escríbenos directo al
                961 246 6204 y te confirmamos el horario.
              </p>
              <button type="button" className="cds-button cds-button-quiet" onClick={() => setEnviado(false)}>
                Corregir mis datos
              </button>
            </div>
          ) : (
            <>
              <div className="cds-field">
                <label htmlFor="cds-nombre">Nombre</label>
                <input
                  id="cds-nombre"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  aria-invalid={Boolean(errores.nombre)}
                  aria-describedby={errores.nombre ? 'cds-error-nombre' : undefined}
                />
                {errores.nombre && <small id="cds-error-nombre" className="cds-error">{errores.nombre}</small>}
              </div>

              <div className="cds-field">
                <label htmlFor="cds-tel">WhatsApp</label>
                <input
                  id="cds-tel"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="961 123 4567"
                  value={telefono}
                  onChange={(event) => setTelefono(soloDigitos(event.target.value))}
                  aria-invalid={Boolean(errores.telefono)}
                  aria-describedby={errores.telefono ? 'cds-error-tel' : undefined}
                />
                {errores.telefono && <small id="cds-error-tel" className="cds-error">{errores.telefono}</small>}
              </div>

              <div className="cds-field">
                <label htmlFor="cds-dia">¿Cuándo te queda mejor?</label>
                <select id="cds-dia" value={dia} onChange={(event) => setDia(event.target.value)}>
                  {DIAS.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
                </select>
              </div>

              <label className="cds-consent" htmlFor="cds-consent">
                <input
                  id="cds-consent"
                  type="checkbox"
                  checked={consiente}
                  onChange={(event) => setConsiente(event.target.checked)}
                  aria-invalid={Boolean(errores.consiente)}
                />
                <span>
                  Autorizo que me contacten por WhatsApp y acepto el{' '}
                  <a href="/privacidad/" target="_blank" rel="noopener noreferrer">aviso de privacidad</a>.
                </span>
              </label>
              {errores.consiente && <small className="cds-error">{errores.consiente}</small>}

              <button type="button" className="cds-button cds-button-primary cds-agenda-submit" onClick={enviar}>
                Quiero conocerlo en persona <ArrowRight size={18} />
              </button>
              <small className="cds-agenda-nota">
                Un asesor de Propiedades en Chiapas continuará la conversación por WhatsApp.
              </small>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

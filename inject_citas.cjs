const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/ibr-dashboard/index.html';

let html = fs.readFileSync(file, 'utf8');

// 1. Modificar HTML del tab-leads usando Cheerio
const $ = cheerio.load(html, { decodeEntities: false });

$('#tab-leads').html(`
<div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold" style="color:#B8924A; font-family:'Cormorant Garamond', serif;">Citas Programadas</h2>
    <button id="btn-nueva-cita" onclick="abrirModalNuevaCita()" style="background:#B8924A; color:#141414; padding:8px 16px; border-radius:8px; font-weight:bold; border:none; cursor:pointer; font-size:14px; display:none;">+ Nueva Cita</button>
</div>
<div id="citas-admin-filter" class="mb-4 hidden">
    <select id="citas-asesor-select" onchange="renderCitasUI()" style="background:#1E1E1E; border:1px solid #333333; color:#F7F1E8; padding:12px; border-radius:8px; width:100%; outline:none; font-family:'Inter',sans-serif; font-size:14px;">
        <option value="Todos">Todos los Asesores</option>
        <option value="Daniel Vázquez">Daniel Vázquez</option>
        <option value="Lupyta Mendoza">Lupyta Mendoza</option>
        <option value="Carmen Jiménez">Carmen Jiménez</option>
        <option value="Luis García">Luis García</option>
    </select>
</div>
<div id="citas-status" style="color:#9E9E9E; text-align:center; padding:40px; font-size:14px; font-weight:500;">Cargando citas...</div>
<div id="citas-container" class="space-y-4"></div>

<!-- Modal Nueva Cita -->
<div id="modal-nueva-cita" class="hidden" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:99999; display:flex; justify-content:center; align-items:center; padding:16px;">
    <div style="background:#1E1E1E; border:1px solid #333333; border-radius:16px; width:100%; max-width:400px; padding:24px; color:#F7F1E8; position:relative; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
        <h3 style="color:#B8924A; font-family:'Cormorant Garamond', serif; font-size:24px; font-weight:bold; margin-bottom:16px;">Nueva Cita</h3>
        
        <div style="margin-bottom:12px;">
            <label style="display:block; font-size:12px; color:#9E9E9E; margin-bottom:4px;">Fecha y Hora</label>
            <input type="datetime-local" id="nc-fecha" style="width:100%; background:#2A2A2A; border:1px solid #333333; color:#F7F1E8; padding:10px; border-radius:8px; outline:none; color-scheme:dark;">
        </div>
        
        <div style="margin-bottom:12px;">
            <label style="display:block; font-size:12px; color:#9E9E9E; margin-bottom:4px;">Asesor</label>
            <select id="nc-asesor" style="width:100%; background:#2A2A2A; border:1px solid #333333; color:#F7F1E8; padding:10px; border-radius:8px; outline:none;">
                <option value="Daniel Vázquez">Daniel Vázquez</option>
                <option value="Lupyta Mendoza">Lupyta Mendoza</option>
                <option value="Carmen Jiménez">Carmen Jiménez</option>
                <option value="Luis García">Luis García</option>
            </select>
        </div>
        
        <div style="margin-bottom:12px;">
            <label style="display:block; font-size:12px; color:#9E9E9E; margin-bottom:4px;">Desarrollo</label>
            <input type="text" id="nc-desarrollo" placeholder="Ej. Bella Vista" style="width:100%; background:#2A2A2A; border:1px solid #333333; color:#F7F1E8; padding:10px; border-radius:8px; outline:none;">
        </div>
        
        <div style="margin-bottom:12px;">
            <label style="display:block; font-size:12px; color:#9E9E9E; margin-bottom:4px;">Nombre Prospecto</label>
            <input type="text" id="nc-nombre" placeholder="Nombre completo" style="width:100%; background:#2A2A2A; border:1px solid #333333; color:#F7F1E8; padding:10px; border-radius:8px; outline:none;">
        </div>
        
        <div style="margin-bottom:12px;">
            <label style="display:block; font-size:12px; color:#9E9E9E; margin-bottom:4px;">Teléfono</label>
            <input type="tel" id="nc-telefono" placeholder="10 dígitos" style="width:100%; background:#2A2A2A; border:1px solid #333333; color:#F7F1E8; padding:10px; border-radius:8px; outline:none;">
        </div>
        
        <div style="margin-bottom:20px;">
            <label style="display:block; font-size:12px; color:#9E9E9E; margin-bottom:4px;">Observaciones</label>
            <textarea id="nc-obs" rows="2" style="width:100%; background:#2A2A2A; border:1px solid #333333; color:#F7F1E8; padding:10px; border-radius:8px; outline:none; resize:none;"></textarea>
        </div>
        
        <div style="display:flex; gap:12px;">
            <button onclick="cerrarModalNuevaCita()" style="flex:1; background:#2A2A2A; color:#F7F1E8; padding:12px; border-radius:8px; border:none; font-weight:bold; cursor:pointer;">Cancelar</button>
            <button id="btn-submit-cita" onclick="guardarNuevaCita()" style="flex:1; background:#B8924A; color:#141414; padding:12px; border-radius:8px; border:none; font-weight:bold; cursor:pointer;">Guardar</button>
        </div>
    </div>
</div>

<!-- Modal Venta -->
<div id="modal-venta" class="hidden" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:99999; display:flex; justify-content:center; align-items:center; padding:16px;">
    <div style="background:#1E1E1E; border:1px solid #333333; border-radius:16px; width:100%; max-width:400px; padding:24px; color:#F7F1E8; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
        <h3 style="color:#B8924A; font-family:'Cormorant Garamond', serif; font-size:24px; font-weight:bold; margin-bottom:16px;">Registrar Venta</h3>
        <input type="hidden" id="mv-idcita">
        
        <div style="margin-bottom:12px;">
            <label style="display:block; font-size:12px; color:#9E9E9E; margin-bottom:4px;">Lote</label>
            <input type="text" id="mv-lote" placeholder="Ej. L-12 Mz-3" style="width:100%; background:#2A2A2A; border:1px solid #333333; color:#F7F1E8; padding:10px; border-radius:8px; outline:none;">
        </div>
        
        <div style="margin-bottom:12px;">
            <label style="display:block; font-size:12px; color:#9E9E9E; margin-bottom:4px;">Plan</label>
            <select id="mv-plan" style="width:100%; background:#2A2A2A; border:1px solid #333333; color:#F7F1E8; padding:10px; border-radius:8px; outline:none;">
                <option value="Contado">Contado</option>
                <option value="Financiado">Financiado</option>
                <option value="Enganche">Enganche</option>
            </select>
        </div>
        
        <div style="margin-bottom:20px;">
            <label style="display:block; font-size:12px; color:#9E9E9E; margin-bottom:4px;">Comentarios Adicionales</label>
            <textarea id="mv-comentarios" rows="3" style="width:100%; background:#2A2A2A; border:1px solid #333333; color:#F7F1E8; padding:10px; border-radius:8px; outline:none; resize:none;"></textarea>
        </div>
        
        <div style="display:flex; gap:12px;">
            <button onclick="cerrarModalVenta()" style="flex:1; background:#2A2A2A; color:#F7F1E8; padding:12px; border-radius:8px; border:none; font-weight:bold; cursor:pointer;">Cancelar</button>
            <button id="btn-submit-venta" onclick="guardarVenta()" style="flex:1; background:#3B82F6; color:#ffffff; padding:12px; border-radius:8px; border:none; font-weight:bold; cursor:pointer;">Confirmar Venta</button>
        </div>
    </div>
</div>
`);

let finalHtml = $.html();

// 2. Extraer y reemplazar el bloque JS anterior
// The previous code started with "let citasData = [];" and ended at "</script>"
const jsCode = `
let citasData = [];
let citasInterval = null;
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFN-TsGYuDedVD02o994sGiSBVCUcf0S4TzyGq7ABFiVc8btTCkrJt3ldt--eG_DpOPg/exec';

function loadCitasJSONP() {
    const status = document.getElementById('citas-status');
    const container = document.getElementById('citas-container');
    if(status && container.innerHTML === '') {
        status.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; gap:12px;"><div style="width:24px; height:24px; border:3px solid #333333; border-top-color:#B8924A; border-radius:50%; animation:spin 1s linear infinite;"></div><span>Sincronizando con Google Sheet...</span></div>';
    }
    
    const script = document.createElement('script');
    script.src = SCRIPT_URL + '?action=citas_sheet&callback=cbCitas&t=' + Date.now();
    script.onerror = function() {
        if(status) status.innerHTML = '<span style="color:#EF4444; font-weight:bold;">Error al conectar con el servidor</span>';
    };
    document.body.appendChild(script);
}

function cbCitas(data) {
    const status = document.getElementById('citas-status');
    if(!data) {
        if(status) status.innerHTML = '<span style="color:#EF4444; font-weight:bold;">Error al cargar citas</span>';
        return;
    }
    
    citasData = Array.isArray(data) ? data : (data.citas || data.datos || []);
    
    citasData = citasData.map(c => {
        return {
            id: c.id || c.idCita || '',
            fecha: c.fecha || c.date || '',
            hora: c.hora || c.time || '',
            nombre: c.nombre_cliente || c.prospecto_nombre || c.nombre || 'Sin nombre',
            telefono: c.telefono || c.prospecto_telefono || '',
            asesor: c.asesor || c.advisor || 'Sin asignar',
            desarrollo: c.desarrollo || '',
            estatus: c.estatus || 'Programada',
            observaciones: c.observaciones || ''
        };
    });
    
    citasData.sort((a,b) => {
        let da = new Date(a.fecha + (a.hora ? 'T' + a.hora : ''));
        let db = new Date(b.fecha + (b.hora ? 'T' + b.hora : ''));
        if(isNaN(da.getTime())) da = new Date(a.fecha);
        if(isNaN(db.getTime())) db = new Date(b.fecha);
        return db.getTime() - da.getTime(); 
    });

    renderCitasUI();
}

function renderCitasUI() {
    const isAd = typeof checkIsAdmin === 'function' ? checkIsAdmin(window.currentUser?.nombre || currentUser) : (window.currentUser?.rol === 'admin');
    const currentName = window.currentUser?.nombre || currentUser;
    
    const filterEl = document.getElementById('citas-admin-filter');
    const btnNueva = document.getElementById('btn-nueva-cita');
    if(!filterEl) return;
    
    if(isAd) {
        filterEl.classList.remove('hidden');
        if(btnNueva) btnNueva.style.display = 'block';
    } else {
        filterEl.classList.add('hidden');
        if(btnNueva) btnNueva.style.display = 'none';
    }

    let filtered = citasData;
    if(!isAd) {
        filtered = citasData.filter(c => c.asesor.trim().toLowerCase() === currentName.trim().toLowerCase());
    } else {
        const sel = document.getElementById('citas-asesor-select').value;
        if(sel !== 'Todos') {
            filtered = citasData.filter(c => c.asesor.trim().toLowerCase() === sel.trim().toLowerCase());
        }
    }

    const container = document.getElementById('citas-container');
    const status = document.getElementById('citas-status');

    if(filtered.length === 0) {
        status.innerHTML = 'Sin citas programadas';
        container.innerHTML = '';
        return;
    }

    status.innerHTML = '';
    
    let html = '';
    filtered.forEach(c => {
        let numStr = (c.telefono||'').replace(/\\D/g, '');
        let waBtn = '';
        if(numStr.length >= 10) {
            waBtn = \`<a href="https://wa.me/\${numStr}" target="_blank" style="background:#22C55E; color:#141414; padding:8px 16px; border-radius:8px; font-size:12px; font-weight:bold; text-decoration:none; display:inline-flex; align-items:center; gap:6px; box-shadow:0 2px 4px rgba(0,0,0,0.2);">💬 WhatsApp</a>\`;
        }

        let asesorTag = isAd ? \`<div style="font-size:10px; color:#9E9E9E; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; border-bottom:1px solid #333333; padding-bottom:6px; font-weight:bold;">👤 Asesor: \${c.asesor}</div>\` : '';
        
        let estatusColor = '#B8924A'; // Programada
        if(c.estatus === 'Realizada') estatusColor = '#22C55E';
        if(c.estatus === 'No asistió') estatusColor = '#EF4444';
        if(c.estatus === 'Venta') estatusColor = '#3B82F6';

        let badge = \`<span style="background:\${estatusColor}20; color:\${estatusColor}; border:1px solid \${estatusColor}; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold; text-transform:uppercase;">\${c.estatus}</span>\`;

        let actionBtns = '';
        if(!isAd && c.estatus === 'Programada') {
            actionBtns = \`
            <div style="display:flex; gap:8px; margin-top:16px; flex-wrap:wrap; border-top:1px solid #333333; padding-top:12px;">
                <button onclick="actualizarEstatusCita('\${c.id}', 'Realizada')" style="background:#22C55E20; border:1px solid #22C55E; color:#22C55E; padding:8px 12px; border-radius:8px; font-size:12px; font-weight:bold; cursor:pointer; flex:1;">✓ Realizada</button>
                <button onclick="actualizarEstatusCita('\${c.id}', 'No asistió')" style="background:#EF444420; border:1px solid #EF4444; color:#EF4444; padding:8px 12px; border-radius:8px; font-size:12px; font-weight:bold; cursor:pointer; flex:1;">✕ No asistió</button>
                <button onclick="abrirModalVenta('\${c.id}')" style="background:#3B82F620; border:1px solid #3B82F6; color:#3B82F6; padding:8px 12px; border-radius:8px; font-size:12px; font-weight:bold; cursor:pointer; flex:1;">💰 Venta</button>
            </div>
            \`;
        }

        html += \`
        <div style="background:#1E1E1E; border:1px solid #333333; padding:20px; border-radius:16px; color:#F7F1E8; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
            \${asesorTag}
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                <div style="flex:1; padding-right:12px;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                        <h3 style="font-family:'Cormorant Garamond', serif; font-size:22px; font-weight:bold; color:#F7F1E8; line-height:1.2;">\${c.nombre}</h3>
                        \${badge}
                    </div>
                    \${c.desarrollo ? \`<div style="color:#B8924A; font-size:13px; font-weight:bold; margin-bottom:4px;">🏗️ \${c.desarrollo}</div>\` : ''}
                    <div style="color:#9E9E9E; font-size:13px; font-weight:500;">📞 \${c.telefono || 'Sin teléfono'}</div>
                </div>
                <div style="text-align:right; min-width:90px;">
                    <div style="color:#B8924A; font-weight:bold; font-size:14px; margin-bottom:4px; font-family:'Inter', sans-serif;">📅 \${c.fecha}</div>
                    <div style="color:#9E9E9E; font-size:12px; font-weight:600;">⏰ \${c.hora}</div>
                </div>
            </div>
            \${c.observaciones ? \`<div style="color:#9E9E9E; font-size:12px; font-style:italic; margin-bottom:12px; padding:8px; background:#2A2A2A; border-radius:8px;">\${c.observaciones}</div>\` : ''}
            <div style="display:flex; justify-content:space-between; align-items:center;">
                \${waBtn ? \`<div>\${waBtn}</div>\` : '<div></div>'}
            </div>
            \${actionBtns}
        </div>
        \`;
    });
    container.innerHTML = html;
}

function abrirModalNuevaCita() {
    const m = document.getElementById('modal-nueva-cita');
    m.classList.remove('hidden');
    m.style.display = 'flex';
    document.getElementById('nc-fecha').value = '';
    document.getElementById('nc-desarrollo').value = '';
    document.getElementById('nc-nombre').value = '';
    document.getElementById('nc-telefono').value = '';
    document.getElementById('nc-obs').value = '';
}

function cerrarModalNuevaCita() {
    const m = document.getElementById('modal-nueva-cita');
    m.classList.add('hidden');
    m.style.display = 'none';
}

function guardarNuevaCita() {
    const btn = document.getElementById('btn-submit-cita');
    const fecha = document.getElementById('nc-fecha').value;
    const asesor = document.getElementById('nc-asesor').value;
    const desarrollo = document.getElementById('nc-desarrollo').value;
    const nombre = document.getElementById('nc-nombre').value;
    const telefono = document.getElementById('nc-telefono').value;
    const obs = document.getElementById('nc-obs').value;
    
    if(!fecha || !nombre) {
        alert('Fecha y Nombre son obligatorios');
        return;
    }
    
    btn.innerHTML = 'Guardando...';
    btn.disabled = true;
    
    const payload = {
        action: 'crear_cita',
        fecha_hora: fecha,
        asesor: asesor,
        desarrollo: desarrollo,
        prospecto_nombre: nombre,
        prospecto_telefono: telefono,
        observaciones: obs
    };
    
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    })
    .then(res => res.json())
    .then(res => {
        if(res.ok) {
            cerrarModalNuevaCita();
            loadCitasJSONP();
        } else {
            alert('Error: ' + res.mensaje);
        }
    })
    .catch(err => {
        alert('Error de conexión');
        console.error(err);
    })
    .finally(() => {
        btn.innerHTML = 'Guardar';
        btn.disabled = false;
    });
}

function actualizarEstatusCita(idCita, nuevoEstatus) {
    if(!confirm('¿Marcar cita como ' + nuevoEstatus + '?')) return;
    enviarActualizacionCita({
        action: 'actualizar_cita',
        id_cita: idCita,
        estatus: nuevoEstatus
    });
}

function abrirModalVenta(idCita) {
    const m = document.getElementById('modal-venta');
    m.classList.remove('hidden');
    m.style.display = 'flex';
    document.getElementById('mv-idcita').value = idCita;
    document.getElementById('mv-lote').value = '';
    document.getElementById('mv-comentarios').value = '';
}

function cerrarModalVenta() {
    const m = document.getElementById('modal-venta');
    m.classList.add('hidden');
    m.style.display = 'none';
}

function guardarVenta() {
    const idCita = document.getElementById('mv-idcita').value;
    const lote = document.getElementById('mv-lote').value;
    const plan = document.getElementById('mv-plan').value;
    const comentarios = document.getElementById('mv-comentarios').value;
    
    if(!lote) { alert('El lote es obligatorio'); return; }
    
    const btn = document.getElementById('btn-submit-venta');
    btn.innerHTML = 'Procesando...';
    btn.disabled = true;
    
    enviarActualizacionCita({
        action: 'actualizar_cita',
        id_cita: idCita,
        estatus: 'Venta',
        lote: lote,
        plan: plan,
        comentarios: comentarios
    }, function() {
        cerrarModalVenta();
        btn.innerHTML = 'Confirmar Venta';
        btn.disabled = false;
    }, function() {
        btn.innerHTML = 'Confirmar Venta';
        btn.disabled = false;
    });
}

function enviarActualizacionCita(payload, onSuccess, onError) {
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    })
    .then(res => res.json())
    .then(res => {
        if(res.ok) {
            if(onSuccess) onSuccess();
            loadCitasJSONP();
        } else {
            alert('Error: ' + res.mensaje);
            if(onError) onError();
        }
    })
    .catch(err => {
        alert('Error de conexión');
        console.error(err);
        if(onError) onError();
    });
}
`;

const startIndex = finalHtml.indexOf('let citasData = [];');
if(startIndex !== -1) {
    const endIndex = finalHtml.lastIndexOf('</script>');
    finalHtml = finalHtml.substring(0, startIndex) + jsCode + '\\n' + finalHtml.substring(endIndex);
}

fs.writeFileSync(file, finalHtml);
console.log("Integración de Citas Bidireccional completada.");

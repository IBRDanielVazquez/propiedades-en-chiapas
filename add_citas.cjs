const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/ibr-dashboard/index.html';

let html = fs.readFileSync(file, 'utf8');

// 1. DOM manipulation
const $ = cheerio.load(html, { decodeEntities: false });

$('#tab-leads').html(`
<div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold" style="color:#B8924A; font-family:'Cormorant Garamond', serif;">Citas Programadas</h2>
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
`);

let finalHtml = $.html();

// 2. JS Injection
const jsCode = `
let citasData = [];
let citasInterval = null;

function loadCitasJSONP() {
    const status = document.getElementById('citas-status');
    const container = document.getElementById('citas-container');
    if(status && container.innerHTML === '') {
        status.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; gap:12px;"><div style="width:24px; height:24px; border:3px solid #333333; border-top-color:#B8924A; border-radius:50%; animation:spin 1s linear infinite;"></div><span>Sincronizando con Google Calendar...</span></div><style>@keyframes spin { to { transform: rotate(360deg); } }</style>';
    }
    
    // Create script for JSONP
    const script = document.createElement('script');
    script.src = 'https://script.google.com/macros/s/AKfycbxfcqkCx8Xvx4MGCI1D99tlyCM7k1Z2ByW6LAChQraUPoLv646jaOx6g-ayuNk0XgrQUA/exec?action=citas&callback=cbCitas&t=' + Date.now();
    script.onerror = function() {
        if(status) status.innerHTML = '<span style="color:#EF4444; font-weight:bold;">Error al conectar con Google Calendar</span>';
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
            fecha: c.fecha || c.date || '',
            hora: c.hora || c.time || '',
            nombre: c.nombre_cliente || c.nombre || c.cliente || c.name || 'Sin nombre',
            telefono: c.telefono || c.phone || '',
            asesor: c.asesor || c.advisor || 'Sin asignar'
        };
    });
    
    citasData.sort((a,b) => {
        let da = new Date(a.fecha + 'T' + (a.hora || '00:00:00'));
        let db = new Date(b.fecha + 'T' + (b.hora || '00:00:00'));
        if(isNaN(da.getTime())) da = new Date(a.fecha);
        if(isNaN(db.getTime())) db = new Date(b.fecha);
        return db.getTime() - da.getTime(); 
    });

    renderCitasUI();
}

function renderCitasUI() {
    const isAd = esAdmin();
    const currentName = window.currentUser?.nombre || currentUser;
    
    const filterEl = document.getElementById('citas-admin-filter');
    if(!filterEl) return;
    
    if(isAd) {
        filterEl.classList.remove('hidden');
    } else {
        filterEl.classList.add('hidden');
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
            waBtn = \`<a href="https://wa.me/\${numStr}" target="_blank" style="background:#22C55E; color:#141414; padding:8px 16px; border-radius:8px; font-size:12px; font-weight:bold; text-decoration:none; display:inline-flex; align-items:center; gap:6px; box-shadow:0 2px 4px rgba(0,0,0,0.2); transition:transform 0.2s;">💬 Enviar WhatsApp</a>\`;
        }

        let asesorTag = isAd ? \`<div style="font-size:10px; color:#9E9E9E; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; border-bottom:1px solid #333333; padding-bottom:6px; font-weight:bold;">👤 Asesor: \${c.asesor}</div>\` : '';

        html += \`
        <div style="background:#1E1E1E; border:1px solid #333333; padding:20px; border-radius:16px; color:#F7F1E8; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
            \${asesorTag}
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
                <div style="flex:1; padding-right:12px;">
                    <h3 style="font-family:'Cormorant Garamond', serif; font-size:22px; font-weight:bold; color:#F7F1E8; margin-bottom:6px; line-height:1.2;">\${c.nombre}</h3>
                    <div style="color:#9E9E9E; font-size:13px; font-weight:500;">📞 \${c.telefono || 'Sin teléfono'}</div>
                </div>
                <div style="text-align:right; min-width:90px;">
                    <div style="color:#B8924A; font-weight:bold; font-size:14px; margin-bottom:4px; font-family:'Inter', sans-serif;">📅 \${c.fecha}</div>
                    <div style="color:#9E9E9E; font-size:12px; font-weight:600;">⏰ \${c.hora}</div>
                </div>
            </div>
            \${waBtn ? \`<div>\${waBtn}</div>\` : ''}
        </div>
        \`;
    });
    container.innerHTML = html;
}
`;

// Inject the JS code at the end of the script tag
finalHtml = finalHtml.replace('</script>', '\\n' + jsCode + '\\n</script>');

// Patch switchTab to trigger loadCitasJSONP
const hookCode = `
        if (targetId === 'leads') {
            loadCitasJSONP();
            if(!citasInterval) citasInterval = setInterval(loadCitasJSONP, 300000);
        } else {
            if(citasInterval) { clearInterval(citasInterval); citasInterval = null; }
        }
`;

// Find where switchTab is, and inject hook before setting display='block'
finalHtml = finalHtml.replace(
    "tab.style.display='block';",
    "tab.style.display='block';\\n" + hookCode
);

fs.writeFileSync(file, finalHtml);
console.log("Citas integradas exitosamente.");

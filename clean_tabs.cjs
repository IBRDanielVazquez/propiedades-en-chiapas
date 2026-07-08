const fs = require('fs');
const cheerio = require('cheerio');
const file = 'public/ibr-dashboard/index.html';

let html = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(html, { decodeEntities: false });

// 1. Reemplazar TODO el contenido de los tabs
$('.tab-content').html('<div style="padding:40px;text-align:center;color:#9E9E9E;">Próximamente</div>');

// 2. Modificar el bloque del script principal
let scripts = $('script').toArray();
let lastScript = $(scripts[scripts.length - 1]);
let scriptContent = lastScript.html();

// Buscar dónde empiezan los renders
let renderStart = scriptContent.indexOf('/* ================= RENDERERS ================= */');
let switchTabStart = scriptContent.indexOf('function switchTab(tabId) {');

if (switchTabStart !== -1 && renderStart !== -1) {
    // Cortamos antes de switchTab para reconstruirlo
    scriptContent = scriptContent.substring(0, switchTabStart);
    
    const newSwitchTab = `
    function switchTab(tabId) {
        let targetId = tabId;
        const nombreAsesor = window.currentUser?.nombre || JSON.parse(localStorage.getItem('ibr_session')||'{}').nombre || currentUser;
        const isCurrentlyAdmin = checkIsAdmin(nombreAsesor);
        
        if (tabId === 'resumen') targetId = isCurrentlyAdmin ? 'dashboard-admin' : 'leads';
        else if (tabId === 'proyectos') targetId = 'projects';
        else if (tabId === 'finanzas') targetId = 'finances';
        else if (tabId === 'comisiones' || tabId === 'lotes') targetId = 'lotes';
        
        if (!isCurrentlyAdmin) {
            const allowedTabs = ['leads', 'lotes'];
            if (!allowedTabs.includes(targetId)) { switchTab('leads'); return; }
        }
        
        document.querySelectorAll('.tab-content').forEach(t => {
            t.style.display='none';
            t.classList.remove('active');
        });
        
        const tab = document.getElementById('tab-'+targetId);
        if(tab) {
            tab.style.display='block';
            tab.classList.add('active');
        }
        
        document.querySelectorAll('#bottomNav button').forEach(btn => {
            const onclickAttr = btn.getAttribute('onclick') || '';
            if (onclickAttr.includes(\`'\${tabId}'\`) || (tabId === 'lotes' && onclickAttr.includes("'comisiones'"))) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function iniciarApp() {
        const session = JSON.parse(localStorage.getItem('ibr_session')||'{}');
        if(!session.rol) { 
            document.getElementById('loginScreen').style.display = 'flex';
            return; 
        }
        window.currentUser = session;
        const vistaPreview = sessionStorage.getItem('ibr_preview');
        let effectiveRol = session.rol;
        let effectiveName = session.nombre;
        if (vistaPreview && vistaPreview !== 'admin') {
            effectiveName = vistaPreview;
            effectiveRol = 'asesor';
        }
        
        const banner = document.getElementById('previewBanner');
        if (banner) {
            if (vistaPreview && vistaPreview !== 'admin') {
                banner.classList.remove('hidden');
                const nameSpan = document.getElementById('previewUserName');
                if (nameSpan) nameSpan.innerText = vistaPreview;
            } else {
                banner.classList.add('hidden');
            }
        }
        
        document.getElementById('APP_ADMIN').style.display = 'none';
        document.getElementById('APP_ASESOR').style.display = 'none';
        if(document.getElementById('loginScreen')) document.getElementById('loginScreen').style.display = 'none';
        
        if(effectiveRol === 'admin') {
            document.getElementById('APP_ADMIN').style.display = 'block';
            switchTab('resumen');
        } else {
            document.getElementById('APP_ADMIN').style.display = 'block';
            switchTab('leads');
        }
    }
    
    // Auto-init on load
    document.addEventListener('DOMContentLoaded', () => {
        if(localStorage.getItem('ibr_session')) {
            iniciarApp();
        } else {
            document.getElementById('loginScreen').style.display = 'flex';
        }
    });

    function logout() {
        localStorage.removeItem('ibr_session');
        localStorage.removeItem('ibr_token');
        location.reload();
    }
    `;

    lastScript.html(scriptContent + newSwitchTab);
}

fs.writeFileSync(file, $.html());
console.log("Limpieza completada.");

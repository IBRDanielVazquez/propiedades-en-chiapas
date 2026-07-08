    // USUARIOS definido más abajo (tokens nombre-apellido)



    
    const TARJETAS_DIGITALES = {
        "Lupyta Mendoza": "https://propiedadesenchiapas.com/lupyta-mendoza-asesor-inmobiliario-ibr/",
        "Carmen Jiménez": "https://propiedadesenchiapas.com/carmen-jimenez-asesor-inmobiliario-de-ibr/",
        "Luis García": "https://propiedadesenchiapas.com/luis-garcia-asesor-inmobiliario-de-ibr/",
        "Daniel Vázquez": "https://propiedadesenchiapas.com/daniel-vazquez/"
    };
    
    const DEFAULT_EXT = ["Walter Moguel", "Martín Altamirano", "Luisa Rodríguez", "Eduardo Méndez", "Arturo Coutiño", "Luis Miguel Coutiño", "Bernardo Cruz", "Antonio Ramírez", "Gabriel Zenteno", "Concepción Villarreal", "Eyra Fernández", "Koreicy López", "Vanessa Guzmán", "Sayani León", "Gabriela López", "Ángeles López", "Mario Ortega", "Javier Ballinas", "Manuel Hipólito", "Cecilia Ramírez"];

    const STATS_BELLA_VISTA = {
        total_vendidos: 193,
        ventas_ibr: 23,
        ventas_externas: 170,
        canceladas: 3,
        disponibles: 320,
        total_lotes: 513
    };

    const MANZANAS_DATA = [
        {m:1,  t:9,  v:4,  d:5},  {m:2,  t:20, v:20, d:0},  {m:3,  t:10, v:10, d:0},  {m:4,  t:3,  v:2,  d:1},
        {m:5,  t:22, v:22, d:0},  {m:6,  t:88, v:21, d:67}, {m:7,  t:13, v:12, d:1},  {m:8,  t:22, v:20, d:2},
        {m:9,  t:76, v:15, d:61}, {m:10, t:9,  v:7,  d:2},  {m:11, t:22, v:8,  d:14}, {m:12, t:22, v:8,  d:14},
        {m:13, t:17, v:8,  d:9},  {m:14, t:20, v:9,  d:11}, {m:15, t:20, v:3,  d:17}, {m:16, t:20, v:2,  d:18},
        {m:17, t:20, v:3,  d:17}, {m:18, t:20, v:2,  d:18}, {m:19, t:21, v:5,  d:16}, {m:20, t:20, v:0,  d:20},
        {m:21, t:20, v:0,  d:20}, {m:22, t:20, v:0,  d:20}
    ];

    const VENTAS_IBR_HISTORICAS = [
        {id:"VTA-030",lote:"BV-M05-L10",manzana:5,lote_num:10,asesor1:"Lupyta Mendoza",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-031",lote:"BV-M05-L11",manzana:5,lote_num:11,asesor1:"Lupyta Mendoza",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-032",lote:"BV-M05-L14",manzana:5,lote_num:14,asesor1:"Lupyta Mendoza",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-033",lote:"BV-M05-L15",manzana:5,lote_num:15,asesor1:"Lupyta Mendoza",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-058",lote:"BV-M08-L02",manzana:8,lote_num:2,asesor1:"Luis García",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-063",lote:"BV-M06-L09",manzana:6,lote_num:9,asesor1:"Luis García",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-064",lote:"BV-M06-L10",manzana:6,lote_num:10,asesor1:"Luis García",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-065",lote:"BV-M12-L13",manzana:12,lote_num:13,asesor1:"Daniel Vázquez",asesor2:"Carmen Jiménez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-088",lote:"BV-M07-L01",manzana:7,lote_num:1,asesor1:"Luis García",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-089",lote:"BV-M07-L02",manzana:7,lote_num:2,asesor1:"Luis García",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-120",lote:"BV-M13-L09",manzana:13,lote_num:9,asesor1:"Lupyta Mendoza",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-121",lote:"BV-M14-L12",manzana:14,lote_num:12,asesor1:"Carmen Jiménez",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-139",lote:"BV-M08-L07",manzana:8,lote_num:7,asesor1:"Lupyta Mendoza",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-144",lote:"BV-M14-L13",manzana:14,lote_num:13,asesor1:"Lupyta Mendoza",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-145",lote:"BV-M13-L07",manzana:13,lote_num:7,asesor1:"Lupyta Mendoza",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-146",lote:"BV-M13-L08",manzana:13,lote_num:8,asesor1:"Lupyta Mendoza",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-149",lote:"BV-M14-L19",manzana:14,lote_num:19,asesor1:"Carmen Jiménez",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-166",lote:"BV-M14-L20",manzana:14,lote_num:20,asesor1:"Carmen Jiménez",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-167",lote:"BV-M14-L03",manzana:14,lote_num:3,asesor1:"Carmen Jiménez",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-190",lote:"BV-M15-L11",manzana:15,lote_num:11,asesor1:"Lupyta Mendoza",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-194",lote:"BV-M09-L21",manzana:9,lote_num:21,asesor1:"Eduardo Méndez",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-195",lote:"BV-M09-L22",manzana:9,lote_num:22,asesor1:"Eduardo Méndez",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-196",lote:"BV-M09-L23",manzana:9,lote_num:23,asesor1:"Eduardo Méndez",asesor2:"Daniel Vázquez",proyecto:"Bella Vista Ocozocoautla",estatus:"Validada",comision_total_lote:10800,comision_asesor:5400,mensualidad:350,pagado:0,fecha_venta:""},
        {id:"VTA-BC1",lote:"BC-M03-L02",manzana:3,lote_num:2,asesor1:"Daniel Vázquez",asesor2:"",proyecto:"Bosques de Chapultepec",estatus:"Validada",comision_total_lote:31600,comision_asesor:31600,mensualidad:3500,pagado:0,fecha_venta:""},
        {id:"VTA-BC2",lote:"BC-M03-L03",manzana:3,lote_num:3,asesor1:"Daniel Vázquez",asesor2:"",proyecto:"Bosques de Chapultepec",estatus:"Validada",comision_total_lote:31600,comision_asesor:31600,mensualidad:3500,pagado:0,fecha_venta:""},
        {id:"VTA-BC3",lote:"BC-M03-L04",manzana:3,lote_num:4,asesor1:"Daniel Vázquez",asesor2:"",proyecto:"Bosques de Chapultepec",estatus:"Validada",comision_total_lote:31600,comision_asesor:31600,mensualidad:3500,pagado:0,fecha_venta:""},
        {id:"VTA-BC4",lote:"BC-M03-L10",manzana:3,lote_num:10,asesor1:"Daniel Vázquez",asesor2:"",proyecto:"Bosques de Chapultepec",estatus:"Validada",comision_total_lote:29808,comision_asesor:29808,mensualidad:3726,pagado:0,fecha_venta:""},
        {id:"VTA-BC5",lote:"BC-M03-L11",manzana:3,lote_num:11,asesor1:"Daniel Vázquez",asesor2:"",proyecto:"Bosques de Chapultepec",estatus:"Validada",comision_total_lote:29808,comision_asesor:29808,mensualidad:3726,pagado:0,fecha_venta:""},
        {id:"VTA-BC6",lote:"BC-M03-L12",manzana:3,lote_num:12,asesor1:"Daniel Vázquez",asesor2:"",proyecto:"Bosques de Chapultepec",estatus:"Validada",comision_total_lote:29808,comision_asesor:29808,mensualidad:3726,pagado:0,fecha_venta:""}
    ];

    /* ================= TOKENS DE ACCESO ================= */
    const TELEFONOS_EQUIPO = {
        "Daniel Vázquez": "9612466204",
        "Lupyta Mendoza": "9611171478",
        "Carmen Jiménez": "9616101816", 
        "Luis García": "9611769814"
    };

    const USUARIOS = {
        "Daniel-Vazquez": {nombre:"Daniel Vázquez", email:"realstatechiapas@gmail.com", rol:"admin", pin:"IBRDAVM1512"},
        "Lupyta-Mendoza": {nombre:"Lupyta Mendoza", email:"gabryelatgz@gmail.com", rol:"asesor", pin:"2001"},
        "Carmen-Jimenez": {nombre:"Carmen Jiménez", email:"jose0208.cj@gmail.com", rol:"asesor", pin:"3001"},
        "Luis-Garcia": {nombre:"Luis García", email:"lord.garcia.0205@gmail.com", rol:"asesor", pin:"4001"}
    };
    const IBR_USERS = Object.values(USUARIOS).map(u => ({
        name: u.nombre, role: u.rol === 'admin' ? "Team Leader" : "Asesor", type: u.rol === 'admin' ? "Admin" : "Asesor", email: u.email, link: TARJETAS_DIGITALES[u.nombre], lots: []
    }));
    const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000;
    const LOCKOUT_DURATION = 5 * 60 * 1000;
    const MAX_ATTEMPTS     = 3;
    let loginAttempts = 0;
    let lockoutUntil  = 0;
    let pendingToken  = null;



    /* ================= ROLES & PERMISOS ================= */
    const PERMISOS = {
        "Daniel Vázquez": "admin",
        "Lupyta Mendoza": "asesor",
        "Carmen Jiménez": "asesor",
        "Luis García": "asesor"
    };
    const ADMIN_TABS    = ['dashboard-admin','projects','leads','pagos','finances','config'];
    const ASESOR_TABS   = ['leads','lotes'];

    let originalUser = localStorage.getItem('ibr_user') || "Daniel Vázquez";
    let vistaComo = sessionStorage.getItem('ibr_preview');
    let currentUser = (vistaComo && vistaComo !== 'admin') ? vistaComo : originalUser;
    
    const checkIsAdmin = (user) => {
        if (!user) return false;
        let token = localStorage.getItem('ibr_token') || '';
        let sess = null;
        try {
            sess = JSON.parse(localStorage.getItem('ibr_session') || '{}');
        } catch(e) {}
        let rol = (sess && (sess.rol || sess.role)) || '';
        if (rol === 'admin') return true;
        if (user.toLowerCase().includes('daniel') || token.toLowerCase().includes('daniel')) return true;
        return PERMISOS[user] === 'admin';
    };

    let isAdmin = checkIsAdmin(currentUser);
    let esVerdaderoAdmin = checkIsAdmin(originalUser);

    const esAdmin = () => checkIsAdmin(currentUser);
    const esPropietario = (v) => v.asesor1 === currentUser || v.asesor2 === currentUser || v.adv === currentUser || v.adv2 === currentUser;
    const getVentasVisibles = () => esAdmin() ? getAllSales() : getAllSales().filter(esPropietario);
    const getLeadsVisibles = () => esAdmin() ? leads : leads.filter(l => {
        const asesorDelLead = l.advisor || l.asesor || '';
        return asesorDelLead === currentUser;
    });

    function guardTab(tabId) {
        // Admin tiene acceso a TODO — nunca mostrar Acceso Restringido
        if(esAdmin()) return false;
        let allowed = ASESOR_TABS;
        if(!allowed.includes(tabId)) {
            let fallback = 'dashboard-asesor';
            let fb = document.getElementById('tab-restricted');
            if(fb) {
                document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
                fb.classList.add('active');
                setTimeout(() => switchTab(fallback), 2000);
                return true;
            }
            switchTab(fallback);
            return true;
        }
        return false;
    }
    
    function normalizeLeads(arr) {
      if(!Array.isArray(arr)) return []
      return arr.map(l => {
        let tel = (l.telefono || l.phone || '').toString().replace(/\D/g,'');
        if (!tel && l.descripcion) {
          const m = l.descripcion.replace(/\+52/g, '').replace(/\D/g, '').match(/\d{10}/);
          if (m) tel = m[0];
        }
        return {
          id: l.id,
          name: l.nombre_cliente || l.titulo || l.name || 'Sin nombre',
          phone: tel,
          project: l.titulo || l.project || 'Sin proyecto',
          advisor: l.asesor || l.advisor || l.calendario || 'Sin asignar',
          date: l.fecha || l.date || '',
          time: l.hora || l.time || '',
          status: l.resultado || l.estatus || l.status || 'Programada',
          whatsapp: l.whatsapp || '',
          lastComment: l.descripcion || l.comentarios || ''
        }
      })
    }

    let extUsers = JSON.parse(localStorage.getItem('ibr_externos')) || DEFAULT_EXT;
    let leads = normalizeLeads(JSON.parse(localStorage.getItem('ibr_leads') || '[]'));
    let salesLocal = JSON.parse(localStorage.getItem('ibr_ventas')) || [];
    let salesUpdates = JSON.parse(localStorage.getItem('ibr_updates_ventas')) || {}; // { id: {com, obs} }
    let investments = JSON.parse(localStorage.getItem('ibr_inversiones')) || [];
    let payments = JSON.parse(localStorage.getItem('ibr_pagos')) || [];
    let clientPayments = JSON.parse(localStorage.getItem('ibr_cobros_clientes')) || [];

    // Initialize ibr_proyectos with all active and historical developments if not present or missing
    const defaultProyectos = [
      { id: "bella-vista", nombre: "Bella Vista Ocozocoautla", municipio: "Ocozocoautla", lotes_total: 513, vendidos: 193, disponibles: 320, cancelados: 3, ventas_ibr: 23, comision_base: 10800, comision_compartida: 5400, mensualidad_base: 700, mensualidad_compartida: 350, color: "#8B0000", activo: true },
      { id: "bosques-chapultepec", nombre: "Bosques de Chapultepec", municipio: "Chiapas", lotes_total: null, vendidos: 6, disponibles: null, cancelados: 0, ventas_ibr: 6, comision_base: 31600, comision_compartida: 31600, mensualidad_base: 3500, mensualidad_compartida: 3500, color: "#1D4ED8", activo: true },
      { id: "grand-mayan", nombre: "Grand Mayan", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#7C3AED", activo: true },
      { id: "don-clemente", nombre: "Don Clemente", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#EC4899", activo: true },
      { id: "las-animas", nombre: "Las Animas", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#F59E0B", activo: true },
      { id: "monte-misen", nombre: "Monte Misen", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#10B981", activo: true },
      { id: "san-antonio", nombre: "San Antonio", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#3B82F6", activo: true },
      { id: "hn-bosques-sayab", nombre: "HN Bosques de Sayab", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#6366F1", activo: true },
      { id: "orquidea-campestre", nombre: "Orquídea Campestre", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#8B5CF6", activo: true },
      { id: "sima-park", nombre: "Sima Park", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#A855F7", activo: true },
      { id: "el-arenal", nombre: "El Arenal", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#D946EF", activo: true },
      { id: "la-canada", nombre: "La Cañada", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#F43F5E", activo: true },
      { id: "cascadas-del-sur", nombre: "Cascadas del Sur", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#EF4444", activo: true },
      { id: "bosques-del-sur", nombre: "Bosques del Sur", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#06B6D4", activo: true },
      { id: "real-campestre", nombre: "Real Campestre", municipio: "Chiapas", lotes_total: null, vendidos: 0, disponibles: null, cancelados: 0, ventas_ibr: 0, comision_base: 10000, comision_compartida: 5000, color: "#0EA5E9", activo: true }
    ];

    let currentProyectos = JSON.parse(localStorage.getItem('ibr_proyectos') || '[]');
    defaultProyectos.forEach(dp => {
      if (!currentProyectos.some(p => p.id === dp.id || p.nombre === dp.nombre)) {
        currentProyectos.push(dp);
      }
    });
    localStorage.setItem('ibr_proyectos', JSON.stringify(currentProyectos));
    window.proyectoActivo = 'todos';


    let filterL = 'Todos';

    function saveFechaVenta(id, val) {
        let fechas = JSON.parse(localStorage.getItem('ibr_fechas_venta') || '{}');
        fechas[id] = val;
        localStorage.setItem('ibr_fechas_venta', JSON.stringify(fechas));
        showToast('✅ Fecha actualizada');
    }

    function getMisVentas(u) {
        let hist = VENTAS_IBR_HISTORICAS.filter(v => v.asesor1 === u || v.asesor2 === u).map(v => {
            let overrides = salesUpdates[v.id] || {};
            let isShared = v.asesor1 && v.asesor2;
            let defComTotal = isShared ? 5400 : 10800;
            let defMensualidad = isShared ? 350 : 700;
            return {
                id: v.id, mz: v.manzana, lote: v.lote_num, lote_str: v.lote, adv: v.asesor1, adv2: v.asesor2, 
                com_total: overrides.com_total !== undefined ? Number(overrides.com_total) : (v.comision_asesor !== undefined ? v.comision_asesor : defComTotal),
                comision_total_lote: v.comision_total_lote || 10800,
                mensualidad: overrides.mensualidad !== undefined ? Number(overrides.mensualidad) : (v.mensualidad !== undefined ? v.mensualidad : defMensualidad),
                pagado: payments.filter(p => p.sale_id === v.id && p.adv === u).reduce((sum, p) => sum + Number(p.amount), 0),
                razon: overrides.razon || '',
                obs: overrides.obs || '',
                estatus: v.estatus || 'Validada', date: 'Histórica', type: 'Contado', hist: true,
                project: v.proyecto, proyecto: v.proyecto
            };
        });
        let loc = salesLocal.filter(s => s.adv === u || s.adv2 === u).map(s => {
             if (s.com_total === undefined) {
                 let isShared = s.adv && s.adv2;
                 s.com_total = isShared ? 5400 : 10800;
                 s.mensualidad = isShared ? 350 : 700;
             }
             s.comision_total_lote = s.comision_total_lote || 10800;
             s.pagado = payments.filter(p => p.sale_id === s.id && p.adv === u).reduce((sum, p) => sum + Number(p.amount), 0);
             s.project = s.project || 'Bella Vista Ocozocoautla';
             s.proyecto = s.project;
             return s;
        });
        return [...hist, ...loc].sort((a,b)=>a.date==='Histórica'?1:-1); // local newer first
    }
    
    function getAllSales() {
        let hist = VENTAS_IBR_HISTORICAS.map(v => {
            let overrides = salesUpdates[v.id] || {};
            let isShared = v.asesor1 && v.asesor2;
            let defComTotal = isShared ? 5400 : 10800;
            let defMensualidad = isShared ? 350 : 700;
            return {
                id: v.id, mz: v.manzana, lote: v.lote_num, adv: v.asesor1, adv2: v.asesor2, 
                com_total: overrides.com_total !== undefined ? Number(overrides.com_total) : (v.comision_asesor !== undefined ? v.comision_asesor : defComTotal),
                comision_total_lote: v.comision_total_lote || 10800,
                mensualidad: overrides.mensualidad !== undefined ? Number(overrides.mensualidad) : (v.mensualidad !== undefined ? v.mensualidad : defMensualidad),
                pagado: payments.filter(p => p.sale_id === v.id).reduce((sum, p) => sum + Number(p.amount), 0),
                razon: overrides.razon || '',
                obs: overrides.obs || '',
                estatus: v.estatus || 'Validada',
                project: v.proyecto, proyecto: v.proyecto
            };
        });
        let loc = salesLocal.map(s => {
             if (s.com_total === undefined) {
                 let isShared = s.adv && s.adv2;
                 s.com_total = isShared ? 5400 : 10800;
                 s.mensualidad = isShared ? 350 : 700;
             }
             s.comision_total_lote = s.comision_total_lote || 10800;
             s.pagado = payments.filter(p => p.sale_id === s.id).reduce((sum, p) => sum + Number(p.amount), 0);
             s.project = s.project || 'Bella Vista Ocozocoautla';
             s.proyecto = s.project;
             return s;
        });
        return [...hist, ...loc];
    }

    /* ================= AUTH FUNCTIONS ================= */

    function getEffectivePin(token) {
        let overrides = JSON.parse(localStorage.getItem('ibr_pin_overrides') || '{}');
        return overrides[token] || USUARIOS[token]?.pin || '';
    }

    function resolveUserByToken(token) {
        if (!token) return null;
        // Buscar directo
        if (USUARIOS[token]) return USUARIOS[token];
        // Buscar decodificado (por si viene encoded de localStorage)
        try {
            var decoded = decodeURIComponent(token);
            if (USUARIOS[decoded]) return USUARIOS[decoded];
        } catch(e) {}
        return null;
    }

    function showToast(msg, duration) {
        duration = duration || 2500;
        let toast = document.getElementById('toast');
        toast.querySelector('div').textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(function() { toast.classList.add('hidden'); }, duration);
    }

    function renderLoginPin(token, userData) {
        pendingToken = token;
        loginAttempts = 0;
        var isAdminUser = userData.rol === 'admin';
        var content = document.getElementById('loginContent');
        if(!content) return;

        content.innerHTML = `
<div class="text-center mb-2">
  <p class="text-white font-black text-xl">Bienvenido,</p>
  <p class="text-ibr-red font-black text-2xl mt-1">${userData.nombre.split(' ')[0]}</p>
  <p class="text-gray-500 text-[10px] font-bold mt-1 uppercase tracking-widest">${isAdminUser ? 'Administrador' : 'Asesor'}</p>
</div>
<div style="background:#1a1a1a; border-radius:16px; padding:24px; margin:32px 16px; border:1px solid #8B0000">
  <p style="color:#999;font-size:13px; text-align:center;margin-bottom:16px">Ingresa tu PIN</p>
  <input type="password" id="pinInput" placeholder="••••••" style="width:100%; background:#fff; color:#000; font-size:24px; text-align:center; letter-spacing:8px; padding:16px; border-radius:8px; border:2px solid #8B0000; box-sizing:border-box">
  <button onclick="handlePinSubmit(event)" style="width:100%; background:#8B0000; color:#fff; font-size:16px; font-weight:bold; padding:16px; border-radius:8px; border:none; margin-top:12px; cursor:pointer">ENTRAR →</button>
</div>`;

        setTimeout(function() { var f = document.getElementById('pinInput'); if(f) f.focus(); }, 100);
    }

    function validarPin() {
        var inputPin = document.getElementById('pinInput') ? document.getElementById('pinInput').value.trim() : '';
        var urlParams = new URLSearchParams(window.location.search);
        var token = urlParams.get('token') || localStorage.getItem('ibr_token') || '';

        var usuarios = {
            "Daniel-Vazquez": {nombre:"Daniel Vázquez", rol:"admin", pin:"IBRDAVM1512"},
            "Lupyta-Mendoza": {nombre:"Lupyta Mendoza", rol:"asesor", pin:"2001"},
            "Carmen-Jimenez": {nombre:"Carmen Jiménez", rol:"asesor", pin:"3001"},
            "Luis-Garcia":    {nombre:"Luis García",    rol:"asesor", pin:"4001"}
        };

        var usuario = usuarios[token];

        // Si no hay token o no existe ese usuario, buscar el token por el PIN ingresado
        if (!usuario && inputPin) {
            var foundToken = Object.keys(usuarios).find(function(k) {
                return getEffectivePin(k) === inputPin;
            });
            if (foundToken) {
                token = foundToken;
                usuario = usuarios[token];
            }
        }

        var errEl = document.getElementById('loginError');

        if (!usuario) {
            if(errEl) { errEl.style.display = 'block'; errEl.textContent = 'Link inválido ❌'; }
            return;
        }

        var correctPin = getEffectivePin(token);

        if (inputPin === correctPin) {
            localStorage.setItem('ibr_token', token);
            localStorage.setItem('ibr_session', JSON.stringify({
                token: token,
                nombre: usuario.nombre,
                rol: usuario.rol,
                ts: Date.now()
            }));
            document.getElementById('loginScreen').style.display = 'none';
            applySession(token, usuario, true);
        } else {
            if(errEl) { errEl.style.display = 'block'; errEl.textContent = 'PIN incorrecto ❌'; }
            document.getElementById('pinInput').value = '';
        }
    }

    function handlePinSubmit(e) {
        if(e) e.preventDefault();
        if(!pendingToken) return;

        if(Date.now() < lockoutUntil) {
            document.getElementById('loginLockout').classList.remove('hidden');
            return;
        }

        var userData = USUARIOS[pendingToken];
        var isAdminUser = userData.rol === 'admin';
        var enteredPin = (document.getElementById('pinInput') ? document.getElementById('pinInput').value : '').trim();

        var correctPin = getEffectivePin(pendingToken);

        if(enteredPin === correctPin) {
            loginAttempts = 0;
            document.getElementById('loginError').classList.add('hidden');
            document.getElementById('loginLockout').classList.add('hidden');
            applySession(pendingToken, userData, true);
        } else {
            loginAttempts++;
            if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
            if(!isAdminUser) {
                document.querySelectorAll('.pin-box').forEach(function(b) { b.value = ''; });
                setTimeout(function() { var f = document.querySelector('.pin-box'); if(f) f.focus(); }, 50);
            } else {
                var f2 = document.getElementById('pin-admin'); if(f2) { f2.value = ''; f2.focus(); }
            }
            if(loginAttempts >= MAX_ATTEMPTS) {
                lockoutUntil = Date.now() + LOCKOUT_DURATION;
                loginAttempts = 0;
                document.getElementById('loginError').classList.add('hidden');
                document.getElementById('loginLockout').classList.remove('hidden');
                setTimeout(function() {
                    lockoutUntil = 0;
                    document.getElementById('loginLockout').classList.add('hidden');
                }, LOCKOUT_DURATION);
            } else {
                var el = document.getElementById('loginError');
                el.textContent = 'PIN incorrecto ❌ (intento ' + loginAttempts + '/' + MAX_ATTEMPTS + ')';
                el.classList.remove('hidden');
            }
        }
    }

    function applySession(token, userData, showWelcome) {
        var sess = { token: token, nombre: userData.nombre, rol: userData.rol, timestamp: Date.now() };
        localStorage.setItem('ibr_session', JSON.stringify(sess));
        localStorage.setItem('ibr_user', userData.nombre);
        
        var ultimos = JSON.parse(localStorage.getItem('ibr_ultimo_acceso') || '{}');
        ultimos[token] = Date.now();
        localStorage.setItem('ibr_ultimo_acceso', JSON.stringify(ultimos));
        currentUser = userData.nombre;
        isAdmin = PERMISOS[currentUser] === 'admin';
        document.getElementById('loginScreen').style.display = 'none';
        updateHeader();
        var sel = document.getElementById('userSelector');
        if(sel) sel.value = currentUser;
        if(showWelcome) {
            document.getElementById('wm-name').textContent = currentUser.split(' ')[0];
            document.getElementById('wm-role').textContent = isAdmin ? '👑 Admin' : '💼 Asesor';
            document.getElementById('welcomeModal').classList.remove('hidden');
        } else {
            iniciarApp();
        }
    }

    function dismissWelcome() {
        document.getElementById('welcomeModal') && document.getElementById('welcomeModal').classList.add('hidden');
        iniciarApp();
    }

    function bootApp() {
        const vistaPreview = sessionStorage.getItem('ibr_preview');
        const banner = document.getElementById('previewBanner');
        const header = document.querySelector('header');
        
        const realUser = window.currentUser?.nombre || originalUser;
        const esVerdaderoAdmin = checkIsAdmin(realUser);

        if (vistaPreview && vistaPreview !== 'admin') {
            currentUser = vistaPreview;
            if (window.currentUser) window.currentUser.nombre = vistaPreview;
            isAdmin = checkIsAdmin(currentUser);
            
            if (banner) {
                banner.classList.remove('hidden');
                const nameSpan = document.getElementById('previewUserName');
                if (nameSpan) nameSpan.innerText = currentUser;
            }
            if (header) {
                header.style.top = '36px'; // Height of the banner
            }
            updateHeader();
        } else {
            currentUser = realUser;
            if (window.currentUser) window.currentUser.nombre = realUser;
            isAdmin = checkIsAdmin(currentUser);
            
            if (banner) banner.classList.add('hidden');
            if (header) header.style.top = '0';
            
            updateHeader();
        }

        const switcher = document.getElementById('viewSwitcher');
        if (switcher) {
            switcher.classList.toggle('hidden', !esVerdaderoAdmin);
            switcher.value = (vistaPreview && vistaPreview !== 'admin') ? vistaPreview : 'admin';
        }
        
        populateSelects();
        updateAuth();
        switchTab(isAdmin ? 'dashboard-admin' : 'leads');
        renderProyectos();
        checkBanners();
    }

    function updateHeader() {
        const header = document.querySelector('header');
        if (!header) return;
        
        const nombreAsesor = window.currentUser?.nombre ||
          JSON.parse(localStorage.getItem('ibr_session')||'{}').nombre ||
          currentUser;
        const isCurrentlyAdmin = checkIsAdmin(nombreAsesor);

        if (isCurrentlyAdmin) {
            header.className = "sticky top-0 z-40 bg-gradient-to-r from-black to-[#8B0000] text-white p-3 shadow-md flex justify-between items-center transition-all duration-300";
            header.innerHTML = `
                <div>
                    <div class="flex items-center gap-2">
                        <span class="text-white font-black text-2xl tracking-tighter leading-none">IBR</span>
                        <span class="text-[10px] font-bold leading-tight uppercase tracking-widest text-gray-200">Control<br>de Ventas</span>
                    </div>
                </div>
                <div class="text-right flex items-center gap-2">
                    <select id="viewSwitcher" onchange="changePreviewMode(this.value)" class="bg-black/40 border border-white/20 text-white text-[10px] font-bold px-1.5 py-1 rounded-lg cursor-pointer transition focus:outline-none max-w-[130px] truncate">
                        <option value="admin">👁️ Vista: Admin ▼</option>
                        <option value="Lupyta Mendoza">👤 Lupyta Mendoza</option>
                        <option value="Carmen Jiménez">👤 Carmen Jiménez</option>
                        <option value="Luis García">👤 Luis García</option>
                    </select>
                    <div>
                        <p class="text-white font-black text-[10px] text-right" id="headerUserName">${currentUser}</p>
                        <p class="text-gray-400 text-[8px] uppercase tracking-widest" id="headerUserRole">Admin</p>
                    </div>
                    <button onclick="logout()" title="Cerrar sesión"
                        class="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-20 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg transition whitespace-nowrap">
                        Salir 🚪
                    </button>
                </div>
            `;
            const switcher = document.getElementById('viewSwitcher');
            if (switcher) {
                const vistaPreview = sessionStorage.getItem('ibr_preview');
                switcher.value = (vistaPreview && vistaPreview !== 'admin') ? vistaPreview : 'admin';
            }
        } else {
            header.className = "sticky top-0 z-40 bg-black text-white p-4 shadow-sm flex justify-between items-center";
            header.innerHTML = `
                <div class="flex items-center gap-2 font-black text-xl">
                    <span>IBR</span>
                    <span class="text-gray-500 font-normal">|</span>
                    <span class="text-base font-bold">${nombreAsesor}</span>
                </div>
                <div>
                    <button onclick="logout()" class="text-sm font-bold text-gray-400 hover:text-white transition">
                        Salir
                    </button>
                </div>
            `;
        }
    }

    function logout() {
        if(!confirm('Cerrar sesión ¿Seguro?')) return;
        localStorage.removeItem('ibr_session');
        sessionStorage.removeItem('ibr_preview');
        localStorage.removeItem('ibr_user');
        currentUser = '';
        isAdmin = false;
        pendingToken = null;
        loginAttempts = 0;
        document.getElementById('loginContent').innerHTML =
            '<div class="text-center space-y-4">' +
              '<div class="text-5xl">🔗</div>' +
              '<p class="text-gray-300 text-sm font-bold">Abre tu link personal para ingresar.</p>' +
              '<p class="text-gray-600 text-[10px]">Si no tienes tu link, contáctale a tu administrador.</p>' +
            '</div>';
        document.getElementById('loginError').classList.add('hidden');
        document.getElementById('loginLockout').classList.add('hidden');
        document.getElementById('APP_ADMIN').style.display = 'none';
        document.getElementById('APP_ASESOR').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
    }

    function copyAccessLink(token) {
        var url = window.location.href.split('?')[0] + '?token=' + encodeURIComponent(token);
        navigator.clipboard.writeText(url)
            .then(function() { showToast('✅ Link copiado'); })
            .catch(function() { prompt('Copia este link:', url); });
    }

    const TELEFONOS_IBR = {
        'Daniel-Vazquez':  '9612466204',
        'Lupyta-Mendoza':  '9611171478',
        'Carmen-Jimenez':  '9616101816',
        'Luis-Garcia':     '9611769814'
    };

    function sendAccessWhatsApp(token, tel, nombre) {
        var u = USUARIOS[token];
        var baseUrl = 'https://propiedadesenchiapas.com/ibr-dashboard/';
        var url = baseUrl + '?token=' + token;
        var pin = getEffectivePin(token);
        var phones = JSON.parse(localStorage.getItem('ibr_team_phones') || '{}');
        var phone = phones[token] || TELEFONOS_IBR[token] || tel || '';
        if(!phone) phone = prompt('¿Número de WhatsApp de ' + nombre + '? (10 dígitos)');
        if(!phone) return;
        var msg = encodeURIComponent(
            'Hola ' + nombre + ' 👋\n' +
            'Aquí está tu acceso personal al\n' +
            'Control de Ventas IBR 🏘️\n\n' +
            '🔗 Tu link: ' + url + '\n' +
            '🔑 Tu PIN: ' + pin + '\n\n' +
            'Entra con tu link y guárdalo\nen favoritos.\n' +
            '- Daniel IBR'
        );
        window.open('https://wa.me/52' + phone + '?text=' + msg, '_blank');
    }

    function saveTeamPhone(token, tel) {
        var stored = JSON.parse(localStorage.getItem('ibr_team_phones') || '{}');
        stored[token] = tel;
        localStorage.setItem('ibr_team_phones', JSON.stringify(stored));
    }

    function savePin(e) {
        e.preventDefault();
        var token = document.getElementById('cp-token').value;
        var current = document.getElementById('cp-current').value.trim();
        var nuevo = document.getElementById('cp-new').value.trim();
        var confirm2 = document.getElementById('cp-confirm').value.trim();
        var ud = USUARIOS[token];
        var isAdminUser = ud ? ud.rol === 'admin' : false;
        if(current !== getEffectivePin(token)) return alert('❌ PIN actual incorrecto.');
        if(nuevo !== confirm2) return alert('❌ Los PINs nuevos no coinciden.');
        if(isAdminUser && nuevo.length < 6) return alert('❌ El PIN de Admin debe tener mínimo 6 caracteres.');
        if(!isAdminUser && !/^[0-9]{4}$/.test(nuevo)) return alert('❌ El PIN de asesor debe ser exactamente 4 dígitos.');
        var overrides = JSON.parse(localStorage.getItem('ibr_pin_overrides') || '{}');
        overrides[token] = nuevo;
        localStorage.setItem('ibr_pin_overrides', JSON.stringify(overrides));
        showToast('✅ PIN actualizado correctamente');
        e.target.reset();
    }

    function formatLastAccess(timestamp) {
        if(!timestamp) return 'Nunca';
        var date = new Date(timestamp);
        var today = new Date();
        
        var isToday = date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();
                      
        var isYesterday = false;
        var yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()) {
            isYesterday = true;
        }

        var hours = String(date.getHours()).padStart(2, '0');
        var minutes = String(date.getMinutes()).padStart(2, '0');
        var timeStr = hours + ':' + minutes;

        if (isToday) {
            return 'Hoy';
        } else if (isYesterday) {
            return 'Ayer';
        } else {
            var months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            return date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear();
        }
    }

    let pendingResetToken = '';
    
    window.verComoAsesor = function(nombre) {
        sessionStorage.setItem('ibr_preview', nombre);
        location.reload();
    };

    window.volverAdmin = function() {
        sessionStorage.removeItem('ibr_preview');
        location.reload();
    };

    window.exitPreviewMode = function() {
        sessionStorage.removeItem('ibr_preview');
        location.reload();
    };

    window.changePreviewMode = function(val) {
        if (val === 'admin') {
            sessionStorage.removeItem('ibr_preview');
        } else {
            sessionStorage.setItem('ibr_preview', val);
        }
        location.reload();
    };

    function openResetPinModal(token) {
        var u = USUARIOS[token];
        if(!u) return;
        if(u.rol === 'admin') {
            alert('❌ El PIN de Administrador no se puede restablecer.');
            return;
        }
        pendingResetToken = token;
        document.getElementById('reset-confirm-text').innerText = '¿Resetear PIN de ' + u.nombre + '?\nSe restablecerá a su PIN original.';
        document.getElementById('reset-confirm-btn').onclick = function() {
            confirmResetPin(token);
        };
        openModal('resetPinModal');
    }

    function confirmResetPin(token) {
        var u = USUARIOS[token];
        if(!u) return;
        
        var overrides = JSON.parse(localStorage.getItem('ibr_pin_overrides') || '{}');
        delete overrides[token];
        localStorage.setItem('ibr_pin_overrides', JSON.stringify(overrides));
        
        closeModal('resetPinModal');
        showToast('✅ PIN de ' + u.nombre + ' restablecido a default');
        renderConfig();
        
        sendResetPinWhatsApp(token);
    }

    function sendResetPinWhatsApp(token) {
        var u = USUARIOS[token];
        if(!u) return;
        
        var url = window.location.href.split('?')[0] + '?token=' + encodeURIComponent(token);
        var pinDefault = u.pin;
        
        var msg = encodeURIComponent(
            'Hola ' + u.nombre.split(' ')[0] + ' 👋\n' +
            'Tu acceso IBR fue restablecido:\n' +
            '📧 Correo: ' + u.email + '\n' +
            '🔗 Link: ' + url + '\n' +
            '🔑 PIN: ' + pinDefault + '\n' +
            '- Daniel IBR 🏘️'
        );
        
        var teamPhones = JSON.parse(localStorage.getItem('ibr_team_phones') || '{}');
        var phone = teamPhones[token] || u.tel || '';
        if(!phone) phone = prompt('¿Número de WhatsApp de ' + u.nombre + '? (10 dígitos)');
        if(!phone) return;
        
        window.open('https://wa.me/52' + phone + '?text=' + msg, '_blank');
    }

    function init() {
        var params = new URLSearchParams(window.location.search);
        var urlTokenRaw = params.get('token');
        var tokenToUse = urlTokenRaw
            ? decodeURIComponent(urlTokenRaw)
            : (localStorage.getItem('ibr_token') ? decodeURIComponent(localStorage.getItem('ibr_token')) : null);

        // Guardar token en localStorage para que validarPin() lo encuentre
        if (tokenToUse) {
            localStorage.setItem('ibr_token', tokenToUse);
        }

        // Sesión activa válida → entrar directo
        try {
            var sess = JSON.parse(localStorage.getItem('ibr_session'));
            if (sess && (Date.now() - (sess.ts || sess.timestamp || 0)) < SESSION_DURATION) {
                var ud2 = resolveUserByToken(sess.token);
                if (ud2) { applySession(sess.token, ud2, false); return; }
            }
        } catch(err) {}

        // Mostrar pantalla de login estática
        document.getElementById('loginScreen').style.display = 'flex';

        if (tokenToUse) {
            var userData = resolveUserByToken(tokenToUse);
            if (userData) {
                // Mostrar nombre del asesor en el saludo
                var nombreEl = document.getElementById('loginNombre');
                if (nombreEl) nombreEl.textContent = 'Bienvenido, ' + userData.nombre.split(' ')[0];
            } else {
                // Token inválido
                var errEl = document.getElementById('loginError');
                if (errEl) { errEl.style.display = 'block'; errEl.textContent = 'Link inválido — pide tu link a Daniel Vázquez'; }
            }
        } else {
            // Sin token
            var errEl2 = document.getElementById('loginError');
            if (errEl2) { errEl2.style.display = 'block'; errEl2.textContent = 'Abre tu link personal para ingresar'; }
        }
        
        // Register accordions
        document.querySelectorAll('.accordion-header')
          .forEach(header => {
            header.addEventListener('click', () => {
              const content = header.nextElementSibling;
              if(!content) return;
              const arrow = header.querySelector('.arrow');
              const isOpen = content.style.display !== 'none';
              content.style.display = isOpen ? 'none' : 'block';
              if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
            });
          });
    }


    function changeUser(val) {
        currentUser = val;
        localStorage.setItem('ibr_user', val);
        isAdmin = PERMISOS[currentUser] === 'admin';
        // Reload leads/data that may have been filtered
        leads = normalizeLeads(JSON.parse(localStorage.getItem('ibr_leads') || '[]'));
        salesLocal = JSON.parse(localStorage.getItem('ibr_ventas')) || [];
        updateAuth();
        switchTab(isAdmin ? 'dashboard-admin' : 'leads');
        checkBanners();
    }

    function clearData() {
        if(confirm("ESTO BORRARÁ TODO (Leads, ventas, inversiones). ¿Seguro?")) {
            localStorage.clear(); location.reload();
        }
    }

    // --- PAGOS TAB FUNCTIONS ---
    let hpFilterType = 'Todos';
    function filterHistoryPagos(type) {
        hpFilterType = type;
        if (type === 'Todos') {
            const advEl = document.getElementById('hp-filter-advisor');
            const monthEl = document.getElementById('hp-filter-month');
            const projEl = document.getElementById('hp-filter-project');
            if (advEl) advEl.value = '';
            if (monthEl) monthEl.value = '';
            if (projEl) projEl.value = '';
        }
        renderPagos();
    }
    function filterHistoryPagosByAdvisor(val) {
        renderPagos();
    }
    function filterHistoryPagosByMonth(val) {
        renderPagos();
    }
    function filterHistoryPagosByProject(val) {
        renderPagos();
    }
    
    function renderPagos() {
        let allS = getAllSales();
        let ibrS = allS.filter(s => s.adv !== 'Externo');
        let totalGenIBR = 0;
        ibrS.forEach(s => totalGenIBR += Number(s.com_total || 0));
        let totalPagIBR = 0;
        payments.forEach(p => totalPagIBR += Number(p.amount));
        
        let today = new Date();
        let currentMonthPayments = payments.filter(p => {
            let pd = new Date(p.date + 'T12:00:00');
            return pd.getMonth() === today.getMonth() && pd.getFullYear() === today.getFullYear();
        }).reduce((sum, p) => sum + Number(p.amount), 0);

        document.getElementById('pag-tot-pend').innerText = '$' + (totalGenIBR - totalPagIBR).toLocaleString();
        document.getElementById('pag-tot-pag').innerText = '$' + currentMonthPayments.toLocaleString();

        let filtered = [...payments];
        
        if (hpFilterType === 'Todos') {
            const advVal = document.getElementById('hp-filter-advisor') ? document.getElementById('hp-filter-advisor').value : '';
            if (advVal) {
                filtered = filtered.filter(p => p.adv === advVal);
            }
            
            const monthVal = document.getElementById('hp-filter-month') ? document.getElementById('hp-filter-month').value : '';
            if (monthVal) {
                filtered = filtered.filter(p => {
                    if (!p.date) return false;
                    const month = p.date.split('-')[1]; // YYYY-MM-DD
                    return month === monthVal;
                });
            }
            
            const projVal = document.getElementById('hp-filter-project') ? document.getElementById('hp-filter-project').value : '';
            if (projVal) {
                filtered = filtered.filter(p => p.project === projVal);
            }
        }
        
        const btnTodos = document.getElementById('hp-fbtn-Todos');
        if (btnTodos) {
            const hasActiveDropdownFilter = (document.getElementById('hp-filter-advisor')?.value || 
                                             document.getElementById('hp-filter-month')?.value || 
                                             document.getElementById('hp-filter-project')?.value);
            if (hasActiveDropdownFilter) {
                btnTodos.classList.remove('active');
            } else {
                btnTodos.classList.add('active');
            }
        }

        document.getElementById('fin-pagos-list').innerHTML = filtered.map(p => `
            <tr class="hover:bg-gray-50">
                <td class="p-3 font-medium text-gray-500">${p.date}</td>
                <td class="p-3 font-bold text-gray-800">${p.lote_str || '--'}</td>
                <td class="p-3 font-black text-gray-800">${p.adv.split(' ')[0]}</td>
                <td class="p-3 text-right font-black text-ibr-green">$${Number(p.amount).toLocaleString()}</td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="text-center p-4 text-xs font-bold text-gray-400">Sin pagos registrados</td></tr>';
    }

    function onRpProjectChange() {
        const project = document.getElementById('rp-project').value;
        const advSelect = document.getElementById('rp-advisor');
        const saleSelect = document.getElementById('rp-sale');
        
        document.getElementById('rp-step4').classList.add('hidden');
        document.getElementById('rp-lot-details').classList.add('hidden');
        document.getElementById('rp-summary').classList.add('hidden');
        
        if (!project) {
            advSelect.innerHTML = '<option value="">Primero seleccione proyecto...</option>';
            saleSelect.innerHTML = '<option value="">Primero seleccione asesor...</option>';
            return;
        }
        
        let advisors = [];
        if (project === 'Bella Vista Ocozocoautla') {
            advisors = ['Daniel Vázquez', 'Lupyta Mendoza', 'Carmen Jiménez', 'Luis García'];
        } else if (project === 'Bosques de Chapultepec') {
            advisors = ['Daniel Vázquez'];
        }
        
        let html = '<option value="">Seleccione asesor...</option>';
        advisors.forEach(a => {
            html += `<option value="${a}">${a}</option>`;
        });
        advSelect.innerHTML = html;
        saleSelect.innerHTML = '<option value="">Primero seleccione asesor...</option>';
    }

    function onRpAdvisorChange() {
        const project = document.getElementById('rp-project').value;
        const advisor = document.getElementById('rp-advisor').value;
        const saleSelect = document.getElementById('rp-sale');
        
        document.getElementById('rp-step4').classList.add('hidden');
        document.getElementById('rp-lot-details').classList.add('hidden');
        document.getElementById('rp-summary').classList.add('hidden');
        
        if (!project || !advisor) {
            saleSelect.innerHTML = '<option value="">Primero seleccione asesor...</option>';
            return;
        }
        
        const mySales = getMisVentas(advisor).filter(s => s.project === project);
        
        let html = '<option value="">Seleccione lote...</option>';
        mySales.forEach(s => {
            let lTxt = s.lote_str || `M${s.mz}-L${s.lote}`;
            let advTxt = s.adv2 ? (s.adv2 === advisor ? 'con ' + s.adv : 'con ' + s.adv2) : 'Individual';
            html += `<option value="${s.id}">${lTxt} · ${advTxt}</option>`;
        });
        
        saleSelect.innerHTML = html || '<option value="">Sin ventas en este proyecto</option>';
    }

    function onRpSaleChange() {
        const project = document.getElementById('rp-project').value;
        const advisor = document.getElementById('rp-advisor').value;
        const saleId = document.getElementById('rp-sale').value;
        
        if (!project || !advisor || !saleId) {
            document.getElementById('rp-step4').classList.add('hidden');
            document.getElementById('rp-lot-details').classList.add('hidden');
            document.getElementById('rp-summary').classList.add('hidden');
            return;
        }
        
        const sale = getMisVentas(advisor).find(s => s.id === saleId);
        if (sale) {
            document.getElementById('rp-amount').value = sale.mensualidad;
            
            const paid = payments.filter(p => p.sale_id === sale.id && p.adv === advisor).reduce((sum, p) => sum + Number(p.amount), 0);
            const pend = sale.com_total - paid;
            
            document.getElementById('rp-lot-details').innerHTML = `
                💰 Comisión total: <span class="text-ibr-green">$${sale.com_total.toLocaleString()}</span><br>
                ✅ Ya pagado: <span class="text-ibr-green">$${paid.toLocaleString()}</span><br>
                ⏳ Pendiente: <span class="text-ibr-red">$${pend.toLocaleString()}</span>
            `;
            document.getElementById('rp-lot-details').classList.remove('hidden');
            document.getElementById('rp-step4').classList.remove('hidden');
            
            document.getElementById('rp-date').value = new Date().toISOString().split('T')[0];
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const d = new Date();
            document.getElementById('rp-period').value = `${months[d.getMonth()]} ${d.getFullYear()}`;
            
            updateRpSummary();
        }
    }

    function updateRpSummary() {
        const project = document.getElementById('rp-project').value;
        const advisor = document.getElementById('rp-advisor').value;
        const saleSelect = document.getElementById('rp-sale');
        const saleStr = saleSelect.options[saleSelect.selectedIndex]?.text || '';
        const amount = document.getElementById('rp-amount').value;
        const date = document.getElementById('rp-date').value;
        
        if (project && advisor && saleStr && amount && date) {
            document.getElementById('rp-summary').innerHTML = `
                <strong>Proyecto:</strong> ${project}<br>
                <strong>Asesor:</strong> ${advisor}<br>
                <strong>Lote:</strong> ${saleStr.split(' ·')[0]}<br>
                <strong>Monto:</strong> $${Number(amount).toLocaleString()}<br>
                <strong>Fecha:</strong> ${date}
            `;
            document.getElementById('rp-summary').classList.remove('hidden');
        } else {
            document.getElementById('rp-summary').classList.add('hidden');
        }
    }

    function savePago(e) {
        e.preventDefault();
        if (!esAdmin()) return alert('🔒 Solo el Administrador puede registrar pagos.');

        const project = document.getElementById('rp-project').value;
        const adv = document.getElementById('rp-advisor').value;
        const saleId = document.getElementById('rp-sale').value;
        const saleSel = document.getElementById('rp-sale');
        const loteStr = saleSel.options[saleSel.selectedIndex]?.text.split(' ·')[0] || '';
        
        if (!project || !adv || !saleId) return alert('Selecciona todos los campos requeridos.');
        
        let newIdNum = payments.length > 0 ? Math.max(...payments.map(p => Number(p.id ? p.id.split('-')[1] : 0))) + 1 : 1;
        let newId = 'PAG-' + String(newIdNum).padStart(3, '0');

        payments.push({
            id: newId,
            project: project,
            adv: adv,
            sale_id: saleId,
            lote_str: loteStr,
            amount: document.getElementById('rp-amount').value,
            date: document.getElementById('rp-date').value,
            period: document.getElementById('rp-period').value,
            method: document.getElementById('rp-method').value,
            obs: document.getElementById('rp-obs').value
        });
        localStorage.setItem('ibr_pagos', JSON.stringify(payments));
        closeModal('registroPagoModal');
        alert('✅ Pago registrado (' + newId + ')');
        
        document.getElementById('registroPagoForm').reset();
        document.getElementById('rp-lot-details').classList.add('hidden');
        document.getElementById('rp-summary').classList.add('hidden');
        document.getElementById('rp-step4').classList.add('hidden');
        
        document.getElementById('rp-advisor').innerHTML = '<option value="">Primero seleccione proyecto...</option>';
        document.getElementById('rp-sale').innerHTML = '<option value="">Primero seleccione asesor...</option>';
        
        if (document.getElementById('tab-pagos').classList.contains('active')) renderPagos();
        if (isAdmin) renderDashAdmin();
        renderFinances();
        renderProfile();
    }
function populateSelects() {
        const teamOpts = IBR_USERS.map(u => `<option value="${u.name}">${u.name}</option>`).join('');
        const lfAdv = document.getElementById('lf-advisor');
        if (lfAdv) lfAdv.innerHTML = teamOpts;
        document.getElementById('pf-adv').innerHTML = teamOpts;

        // Populate projects select boxes dynamically
        const proyectos = JSON.parse(localStorage.getItem('ibr_proyectos') || '[]');
        const filterProjOptsHtml = `<option value="">Por proyecto ▼</option>` + proyectos.map(p => `<option value="${p.nombre}">${p.nombre}</option>`).join('');
        
        const filterProj = document.getElementById('filter-project');
        if (filterProj) filterProj.innerHTML = filterProjOptsHtml;
        
        const hpFilterProj = document.getElementById('hp-filter-project');
        if (hpFilterProj) hpFilterProj.innerHTML = filterProjOptsHtml;

        const lfProj = document.getElementById('lf-project');
        if (lfProj) {
            lfProj.innerHTML = '<option value="Bella Vista">Bella Vista</option><option value="Bosques">Bosques</option><option value="Otro">Otro</option>';
        }
        
        const rfProj = document.getElementById('rf-proj');
        if (rfProj) rfProj.innerHTML = modalProjOptsHtml;
        
        const ifProj = document.getElementById('if-proj');
        if (ifProj) ifProj.innerHTML = modalProjOptsHtml;

        const rpProjOptsHtml = `<option value="">Seleccione un proyecto...</option>` + proyectos.map(p => `<option value="${p.nombre}">${p.nombre}</option>`).join('');
        const rpProj = document.getElementById('rp-project');
        if (rpProj) rpProj.innerHTML = rpProjOptsHtml;
    }

    function updateAuth() {
        document.querySelectorAll('.admin-only').forEach(el => el.classList.toggle('hidden', !esAdmin()));
        const nav = document.getElementById('bottomNav');
        if(esAdmin()) {
            nav.innerHTML = `
                <button class="nav-item flex flex-col items-center gap-1 flex-1" onclick="switchTab('dashboard-admin')"><span class="text-2xl">🏠</span><span class="text-[10px] uppercase font-bold tracking-widest mt-1">Resumen</span></button>
                <button class="nav-item flex flex-col items-center gap-1 flex-1" onclick="switchTab('leads')"><span class="text-2xl">👥</span><span class="text-[10px] uppercase font-bold tracking-widest mt-1">Leads</span></button>
                <button class="nav-item flex flex-col items-center gap-1 flex-1" onclick="switchTab('sales')"><span class="text-2xl">💰</span><span class="text-[10px] uppercase font-bold tracking-widest mt-1">Ventas</span></button>
                <button class="nav-item flex flex-col items-center gap-1 flex-1" onclick="switchTab('pagos')"><span class="text-2xl">💳</span><span class="text-[10px] uppercase font-bold tracking-widest mt-1">Pagos</span></button>
                <button class="nav-item flex flex-col items-center gap-1 flex-1" onclick="switchTab('finances')"><span class="text-2xl">📊</span><span class="text-[10px] uppercase font-bold tracking-widest mt-1">Finanzas</span></button>
                <button class="nav-item flex flex-col items-center gap-1 flex-1" onclick="switchTab('projects')"><span class="text-2xl">🏘️</span><span class="text-[10px] uppercase font-bold tracking-widest mt-1">Proyectos</span></button>
            `;
        } else {
            nav.innerHTML = `
                <button class="nav-item flex flex-col items-center gap-1 flex-1" onclick="switchTab('leads')"><span class="text-2xl">👥</span><span class="text-[10px] uppercase font-bold tracking-widest mt-1">Leads</span></button>
                <button class="nav-item flex flex-col items-center gap-1 flex-1" onclick="switchTab('lotes')"><span class="text-2xl">📋</span><span class="text-[10px] uppercase font-bold tracking-widest mt-1">Mis ventas actuales</span></button>
            `;
        }
    }

    
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
        if (targetId === 'leads') {
            loadCitasJSONP();
            if(!citasInterval) citasInterval = setInterval(loadCitasJSONP, 300000);
        } else {
            if(citasInterval) { clearInterval(citasInterval); citasInterval = null; }
        }

            tab.classList.add('active');
        }
        
        document.querySelectorAll('#bottomNav button').forEach(btn => {
            const onclickAttr = btn.getAttribute('onclick') || '';
            if (onclickAttr.includes(`'${tabId}'`) || (tabId === 'lotes' && onclickAttr.includes("'comisiones'"))) {
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
        const headerName = document.getElementById('headerUserName');
        if (headerName) headerName.innerText = effectiveName;
        
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

// ============================================
// LÓGICA DE CITAS BIDIRECCIONALES
// ============================================
let citasData = [];
let citasInterval = null;
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwtAH_zlCJi_FDHTY33Z07OycOnyxNzoKqe53p0RYyhqVsVnYV4vC-cve7azipyhigHAw/exec';

function loadCitasJSONP() {
    console.log('Cargando citas desde:', SCRIPT_URL + '?action=citas_sheet&callback=cbCitas');
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
    console.log('cbCitas llamada con:', data);
    const status = document.getElementById('citas-status');
    if(!data) {
        if(status) status.innerHTML = '<span style="color:#EF4444; font-weight:bold;">Error al cargar citas</span>';
        return;
    }
    
    citasData = Array.isArray(data) ? data : (data.citas || data.datos || []);
    
    citasData = citasData.map(c => {
        // Parsear fecha_hora si viene en un solo campo
        let f = c.fecha || c.date || '';
        let h = c.hora || c.time || '';
        
        if(c.fecha_hora) {
            try {
                let d = new Date(c.fecha_hora);
                if(!isNaN(d.getTime())) {
                    f = d.toISOString().split('T')[0];
                    h = d.toTimeString().split(' ')[0].substring(0,5);
                } else {
                    f = c.fecha_hora.split(' ')[0];
                    h = c.fecha_hora.split(' ')[1] || '';
                }
            } catch(e) {
                f = c.fecha_hora;
            }
        }
        
        return {
            id: c.id || c.idCita || c.id_cita || '',
            fecha: f,
            hora: h,
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

function generarCardCitaHTML(c, isAd, isHistory) {
    let numStr = (c.telefono||'').replace(/\D/g, '');
    let waBtn = '';
    if(numStr.length >= 10) {
        waBtn = `<a href="https://wa.me/${numStr}" target="_blank" style="background:#22C55E; color:#141414; padding:8px 16px; border-radius:8px; font-size:12px; font-weight:bold; text-decoration:none; display:inline-flex; align-items:center; gap:6px; box-shadow:0 2px 4px rgba(0,0,0,0.2);">💬 WhatsApp</a>`;
    }

    let asesorTag = isAd ? `<div style="font-size:10px; color:#B8924A; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; border-bottom:1px solid #333333; padding-bottom:6px; font-weight:bold;">👤 Asesor: ${c.asesor}</div>` : '';
    
    let estatusColor = '#B8924A'; // Programada
    let est = c.estatus || c.estado || 'Programada';
    if(est === 'Realizada') estatusColor = '#22C55E';
    if(est === 'No asistió') estatusColor = '#EF4444';
    if(est === 'Venta' || est === 'Venta Sí') estatusColor = '#3B82F6';
    if(est === 'Cancelada') estatusColor = '#9E9E9E';

    let badge = `<span style="background:${estatusColor}20; color:${estatusColor}; border:1px solid ${estatusColor}; padding:2px 8px; border-radius:12px; font-size:10px; font-weight:bold; text-transform:uppercase;">${est}</span>`;

    let actionBtns = '';
    if(!isAd && est === 'Programada' && !isHistory) {
        actionBtns = `
        <div style="display:flex; gap:8px; margin-top:16px; flex-wrap:wrap; border-top:1px solid #333333; padding-top:12px;">
            <button onclick="actualizarEstatusCita('${c.id}', 'Realizada')" style="background:#22C55E20; border:1px solid #22C55E; color:#22C55E; padding:8px 12px; border-radius:8px; font-size:12px; font-weight:bold; cursor:pointer; flex:1;">✓ Realizada</button>
            <button onclick="actualizarEstatusCita('${c.id}', 'No asistió')" style="background:#EF444420; border:1px solid #EF4444; color:#EF4444; padding:8px 12px; border-radius:8px; font-size:12px; font-weight:bold; cursor:pointer; flex:1;">✕ No asistió</button>
            <button onclick="abrirModalVenta('${c.id}')" style="background:#3B82F620; border:1px solid #3B82F6; color:#3B82F6; padding:8px 12px; border-radius:8px; font-size:12px; font-weight:bold; cursor:pointer; flex:1;">💰 Venta</button>
        </div>
        `;
    }

    let desarrolloTxt = c.desarrollo || c.proyecto || '';
    let nombreTxt = c.nombre || c.prospecto || 'Sin nombre';
    let obsTxt = c.observaciones || c.comentarios || '';

    return `
    <div style="background:#1E1E1E; border:1px solid #333333; padding:20px; border-radius:16px; color:#F7F1E8; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
        ${asesorTag}
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div style="flex:1; padding-right:12px;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                    <h3 style="font-family:'Cormorant Garamond', serif; font-size:22px; font-weight:bold; color:#F7F1E8; line-height:1.2;">${nombreTxt}</h3>
                    ${badge}
                </div>
                ${desarrolloTxt ? `<div style="color:#B8924A; font-size:13px; font-weight:bold; margin-bottom:4px;">🏗️ ${desarrolloTxt}</div>` : ''}
                <div style="color:#9E9E9E; font-size:13px; font-weight:500;">📞 ${c.telefono || 'Sin teléfono'}</div>
            </div>
            <div style="text-align:right; min-width:90px;">
                <div style="color:#B8924A; font-weight:bold; font-size:14px; margin-bottom:4px; font-family:'Inter', sans-serif;">📅 ${c.fecha}</div>
                ${c.hora ? `<div style="color:#9E9E9E; font-size:12px; font-weight:600;">⏰ ${c.hora}</div>` : ''}
            </div>
        </div>
        ${obsTxt ? `<div style="color:#9E9E9E; font-size:12px; font-style:italic; margin-bottom:12px; padding:8px; background:#2A2A2A; border-radius:8px;">${obsTxt}</div>` : ''}
        <div style="display:flex; justify-content:space-between; align-items:center;">
            ${waBtn ? `<div>${waBtn}</div>` : '<div></div>'}
        </div>
        ${actionBtns}
    </div>
    `;
}

function renderCitasUI() {
    const isAd = typeof esAdmin === 'function' ? esAdmin() : false;
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
        html += generarCardCitaHTML(c, isAd, false);
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
window.cbCitas = cbCitas;

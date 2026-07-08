# Apps Script Completo — IBR Export Citas

> [!IMPORTANT]
> **Instrucciones:**
> 1. Abre tu proyecto: https://script.google.com/home/projects/15Zm9kMHDLiykpFqgF1al6lyiH_XwKRVO6SJxy5p5LK9d2Li__0k2vfpA/edit
> 2. **Borra TODO** el código que tengas en `Código.gs`
> 3. **Pega** el código de abajo
> 4. **Guarda** (Ctrl+S)
> 5. Ejecuta `exportarHistoricoVentas` desde el menú desplegable → botón ▶️ Ejecutar
> 6. Ve a **Implementar → Administrar implementaciones → Editar (lápiz) → Nueva versión → Implementar**
> 7. Dime cuántos registros dice el Logger

```javascript
// ============================================
// IBR EXPORT CITAS + HISTÓRICO VENTAS
// Google Apps Script — Versión completa
// ============================================

// IDs de los calendarios del equipo
const CALENDARIOS = {
  'Daniel':  'realstatechiapas@gmail.com',
  'Lupyta':  'gabryelatgz@gmail.com',
  'Carmen':  'jose0208.cj@gmail.com',
  'Luis':    'luisgarciaibr@gmail.com'
};

const ASESOR_NOMBRES = {
  'Daniel':  'Daniel Vázquez',
  'Lupyta':  'Lupyta Mendoza',
  'Carmen':  'Carmen Jiménez',
  'Luis':    'Luis García'
};

// ============================================
// PUNTO DE ENTRADA: doGet
// ============================================
function doGet(e) {
  const action = (e.parameter.action || '').toLowerCase();
  
  // Si piden histórico de ventas
  if (action === 'historico') {
    return doGetHistorico(e);
  }
  
  // Por defecto: exportar citas/leads
  return doGetCitas(e);
}

// ============================================
// CITAS / LEADS (función original)
// ============================================
function doGetCitas(e) {
  const callback = e.parameter.callback || 'callback';
  const desde = e.parameter.desde || '2024-01-01';
  
  try {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date();
    fechaHasta.setMonth(fechaHasta.getMonth() + 3);
    
    const todasCitas = [];
    
    Object.keys(CALENDARIOS).forEach(function(nombre) {
      const calId = CALENDARIOS[nombre];
      try {
        const cal = CalendarApp.getCalendarById(calId);
        if (!cal) return;
        
        const eventos = cal.getEvents(fechaDesde, fechaHasta);
        
        eventos.forEach(function(ev) {
          const titulo = ev.getTitle() || '';
          const desc = ev.getDescription() || '';
          const inicio = ev.getStartTime();
          
          // Extraer teléfono de la descripción
          let telefono = '';
          const telMatch = desc.match(/[\+]?[\d\s\-\(\)]{10,}/);
          if (telMatch) {
            telefono = telMatch[0].replace(/[^\d]/g, '');
            if (telefono.startsWith('52')) telefono = telefono.substring(2);
          }
          
          // Extraer nombre del cliente
          let nombreCliente = '';
          const lineas = desc.split('\n');
          if (lineas.length > 0) {
            const primeraLinea = lineas[0].trim();
            if (primeraLinea && !primeraLinea.match(/^[\+\d\(\)\-\s]+$/)) {
              nombreCliente = primeraLinea;
            }
          }
          if (!nombreCliente) nombreCliente = titulo;
          
          // Generar ID único
          const idBase = ev.getId() || (titulo + inicio.getTime());
          const id = Utilities.base64Encode(idBase).replace(/[=+\/]/g, '').substring(0, 24);
          
          // WhatsApp link
          let whatsapp = '';
          if (telefono) {
            const numWA = telefono.length === 10 ? '52' + telefono : telefono;
            whatsapp = 'https://wa.me/' + numWA;
          }
          
          todasCitas.push({
            id: id,
            titulo: titulo,
            nombre_cliente: nombreCliente,
            fecha: Utilities.formatDate(inicio, 'America/Mexico_City', 'yyyy-MM-dd'),
            hora: Utilities.formatDate(inicio, 'America/Mexico_City', 'HH:mm'),
            asesor: ASESOR_NOMBRES[nombre] || nombre,
            calendario: nombre,
            telefono: telefono,
            whatsapp: whatsapp,
            descripcion: desc.substring(0, 500),
            ubicacion: ev.getLocation() || '',
            estatus: 'Programada',
            resultado: '',
            comentarios: ''
          });
        });
      } catch(calErr) {
        Logger.log('Error calendario ' + nombre + ': ' + calErr);
      }
    });
    
    // Ordenar por fecha desc
    todasCitas.sort(function(a, b) {
      return (b.fecha + b.hora).localeCompare(a.fecha + a.hora);
    });
    
    const resultado = {
      ok: true,
      exportado: new Date().toISOString(),
      total: todasCitas.length,
      citas: todasCitas
    };
    
    const jsonp = callback + '(' + JSON.stringify(resultado) + ')';
    return ContentService
      .createTextOutput(jsonp)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
      
  } catch(err) {
    const error = callback + '(' + JSON.stringify({
      ok: false,
      error: err.toString()
    }) + ')';
    return ContentService
      .createTextOutput(error)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

// ============================================
// HISTÓRICO DE VENTAS (Google Sheet)
// ============================================
function doGetHistorico(e) {
  const cb = e.parameter.callback || 'cb';
  const SS_ID = '1yxRDxTI6SSRlz6pMWAUIeKFylkrs0mecLmBqTfPExp0';
  
  try {
    const hoja = SpreadsheetApp
      .openById(SS_ID)
      .getSheetByName('HISTORICO_VENTAS_2022_2025');
    
    const datos = hoja.getDataRange().getValues();
    const registros = [];
    
    datos.forEach(function(fila) {
      if (!fila[0] || !fila[1]) return;
      registros.push({
        cte: parseInt(String(fila[0]).replace(/\D/g, '') || '0'),
        nombre: String(fila[1] || '').trim(),
        tel: String(fila[2] || '').trim(),
        desarrollo: String(fila[3] || '').trim(),
        asesor: String(fila[4] || '').trim(),
        lotes: fila[5] || 0,
        lote: String(fila[6] || '').trim(),
        plan: String(fila[7] || '').trim(),
        estatus: String(fila[8] || 'Pendiente').trim(),
        comision: parseFloat(
          String(fila[10] || '0').replace(/[$,]/g, '')
        ) || 0
      });
    });
    
    // Ordenar por Cte descendente
    registros.sort(function(a, b) { return b.cte - a.cte; });
    
    return ContentService
      .createTextOutput(
        cb + '(' + JSON.stringify({
          ok: true,
          total: registros.length,
          datos: registros
        }) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
      
  } catch(err) {
    return ContentService
      .createTextOutput(
        cb + '(' + JSON.stringify({
          ok: false,
          error: err.toString()
        }) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

// ============================================
// EXPORTAR HISTÓRICO (ejecutar manual)
// ============================================
function exportarHistoricoVentas() {
  const SS_ID = '1yxRDxTI6SSRlz6pMWAUIeKFylkrs0mecLmBqTfPExp0';
  const hoja = SpreadsheetApp
    .openById(SS_ID)
    .getSheetByName('HISTORICO_VENTAS_2022_2025');
  
  const datos = hoja.getDataRange().getValues();
  const registros = [];
  
  datos.forEach(function(fila, i) {
    if (!fila[0] || !fila[1]) return;
    
    registros.push({
      cte: String(fila[0]).replace('Cte ', '').trim(),
      nombre: String(fila[1] || '').trim(),
      tel: String(fila[2] || '').trim(),
      desarrollo: String(fila[3] || '').trim(),
      asesor: String(fila[4] || '').trim(),
      lotes: fila[5] || 0,
      lote: String(fila[6] || '').trim(),
      plan: String(fila[7] || '').trim(),
      estatus: String(fila[8] || '').trim(),
      col9: String(fila[9] || '').trim(),
      comision: parseFloat(
        String(fila[10] || '0').replace(/[$,]/g, '')
      ) || 0
    });
  });
  
  DriveApp.createFile(
    'ibr-historico-ventas.json',
    JSON.stringify({
      ok: true,
      total: registros.length,
      datos: registros
    }),
    MimeType.PLAIN_TEXT
  );
  
  Logger.log('Exportados: ' + registros.length);
}

// ============================================
// EXPORTAR CITAS A JSON (ejecutar manual)
// ============================================
function exportarCitasJson() {
  const desde = new Date('2024-01-01');
  const hasta = new Date();
  hasta.setMonth(hasta.getMonth() + 3);
  
  const todasCitas = [];
  
  Object.keys(CALENDARIOS).forEach(function(nombre) {
    try {
      const cal = CalendarApp.getCalendarById(CALENDARIOS[nombre]);
      if (!cal) return;
      
      cal.getEvents(desde, hasta).forEach(function(ev) {
        const titulo = ev.getTitle() || '';
        const desc = ev.getDescription() || '';
        const inicio = ev.getStartTime();
        
        let telefono = '';
        const telMatch = desc.match(/[\+]?[\d\s\-\(\)]{10,}/);
        if (telMatch) {
          telefono = telMatch[0].replace(/[^\d]/g, '');
          if (telefono.startsWith('52')) telefono = telefono.substring(2);
        }
        
        let nombreCliente = '';
        const lineas = desc.split('\n');
        if (lineas.length > 0) {
          const pl = lineas[0].trim();
          if (pl && !pl.match(/^[\+\d\(\)\-\s]+$/)) nombreCliente = pl;
        }
        if (!nombreCliente) nombreCliente = titulo;
        
        const idBase = ev.getId() || (titulo + inicio.getTime());
        const id = Utilities.base64Encode(idBase).replace(/[=+\/]/g, '').substring(0, 24);
        
        let whatsapp = '';
        if (telefono) {
          whatsapp = 'https://wa.me/' + (telefono.length === 10 ? '52' + telefono : telefono);
        }
        
        todasCitas.push({
          id: id,
          titulo: titulo,
          nombre_cliente: nombreCliente,
          fecha: Utilities.formatDate(inicio, 'America/Mexico_City', 'yyyy-MM-dd'),
          hora: Utilities.formatDate(inicio, 'America/Mexico_City', 'HH:mm'),
          asesor: ASESOR_NOMBRES[nombre] || nombre,
          calendario: nombre,
          telefono: telefono,
          whatsapp: whatsapp,
          descripcion: desc.substring(0, 500),
          ubicacion: ev.getLocation() || '',
          estatus: 'Programada',
          resultado: '',
          comentarios: ''
        });
      });
    } catch(e) {
      Logger.log('Error: ' + e);
    }
  });
  
  todasCitas.sort(function(a, b) {
    return (b.fecha + b.hora).localeCompare(a.fecha + a.hora);
  });
  
  const json = JSON.stringify({
    exportado: new Date().toISOString(),
    total: todasCitas.length,
    citas: todasCitas
  }, null, 2);
  
  DriveApp.createFile('citas-historico.json', json, MimeType.PLAIN_TEXT);
  Logger.log('Exportadas: ' + todasCitas.length + ' citas');
}

// ============================================
// AUTO-SINCRONIZACIÓN Y TRIGGERS (NUEVO)
// ============================================
function sincronizarCitas() {
  Logger.log("Iniciando sincronización de citas y ventas...");
  exportarCitasJson();
  exportarHistoricoVentas();
  Logger.log("Sincronización completada con éxito.");
}

function crearTriggerSincronizacion() {
  // Elimina triggers anteriores para evitar duplicados
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));
  
  // Crea el nuevo disparador (cada 10 minutos)
  ScriptApp.newTrigger('sincronizarCitas')
    .timeBased()
    .everyMinutes(10)
    .create();
    
  Logger.log('Trigger de sincronización creado. Se ejecutará cada 10 minutos.');
}
// ============================================
// RECEPCIÓN DE DATOS (POST)
// ============================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Si tuvieras actualizarCita, iría aquí:
    // if (action === 'actualizar_cita') return actualizarCita(data);
    
    if (action === 'crear_cita') return crearCitaEnCalendar(data);
    
    return respuesta(false, 'Acción no reconocida');
  } catch(err) {
    return respuesta(false, 'Error procesando solicitud: ' + err.toString());
  }
}

function respuesta(ok, mensaje, extra) {
  const payload = { ok: ok, mensaje: mensaje };
  if (extra) {
    for (let key in extra) {
      payload[key] = extra[key];
    }
  }
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// CREAR CITA EN GOOGLE CALENDAR
// ============================================
function crearCitaEnCalendar(data) {
  try {
    const calendarios = {
      'Daniel Vázquez':  'realstatechiapas@gmail.com',
      'Lupyta Mendoza':  'gabryelatgz@gmail.com',
      'Carmen Jiménez':  'jose0208.cj@gmail.com',
      'Luis García':     'luisgarciaibr@gmail.com'
    };
    const calId = calendarios[data.asesor];
    if (!calId) return respuesta(false, 'Asesor no encontrado');
    const cal = CalendarApp.getCalendarById(calId);
    if (!cal) return respuesta(false, 'Calendario no encontrado');
    const inicio = new Date(data.fecha_hora);
    const fin = new Date(inicio.getTime() + 60 * 60 * 1000);
    const descripcion = (data.prospecto_nombre || '') + '\\n' + (data.prospecto_telefono || '') + '\\n' + (data.observaciones || '');
    const evento = cal.createEvent(data.desarrollo || 'Cita', inicio, fin, {description: descripcion});
    const googleId = evento.getId();
    // También guardar en hoja CITAS
    const SS_ID = '1yxRDxTI6SSRlz6pMWAUIeKFylkrs0mecLmBqTfPExp0'; // Asegurar uso del SS_ID
    const hoja = SpreadsheetApp.openById(SS_ID).getSheetByName('CITAS');
    const ultimo = hoja.getLastRow();
    const idCita = 'CIT-' + String(ultimo).padStart(3,'0');
    hoja.appendRow([idCita, data.fecha_hora, data.prospecto_nombre||'', data.prospecto_telefono||'', data.asesor||'', data.desarrollo||'', data.observaciones||'', 'Programada', '', googleId]);
    return respuesta(true, 'Cita creada', {id: idCita, google_id: googleId});
  } catch(err) {
    return respuesta(false, err.toString());
  }
}
```

## Después de pegar y guardar:

1. **Selecciona** `crearTriggerSincronizacion` en el menú desplegable de funciones
2. **Click** ▶️ Ejecutar
3. La primera vez te pedirá permisos → Acepta todo
4. Listo, el script actualizará los datos en Drive automáticamente sin que tengas que hacerlo a mano.

> [!WARNING]
> **MUY IMPORTANTE:** Si en el futuro necesitas actualizar el JSONP que responde al dashboard, no olvides generar una "Nueva versión" en Implementar.

import { supabase } from '../../../../supabaseClient';

const SOURCE_PROJECT = 'bella-vista-ocozocoautla';

/**
 * Captura un lead potencial cuando hacen click en WhatsApp/CTA.
 * Insert silencioso (no bloquea la navegación).
 */
export async function trackPotentialLead({ section, template, utms }) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        source_project: SOURCE_PROJECT,
        landing_section: section,
        utm_source: utms?.source || null,
        utm_medium: utms?.medium || null,
        utm_campaign: utms?.campaign || null,
        ad_id: utms?.ad_id || null,
        stage: 'potential',
        notes: `WhatsApp click — template: ${template}`,
      });
    return { data, error };
  } catch (e) {
    console.warn('[BV] trackPotentialLead failed:', e);
    return { error: e };
  }
}

/**
 * Crea un lead real cuando completan un formulario.
 */
export async function createLead({ 
  name, phone, email, message, section, utms 
}) {
  try {
    // Validar duplicados por teléfono
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('phone', phone)
      .eq('source_project', SOURCE_PROJECT)
      .maybeSingle();
    
    if (existing) {
      // Update en vez de insert
      return supabase
        .from('leads')
        .update({ 
          name, email, notes: message, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', existing.id);
    }
    
    return supabase.from('leads').insert({
      name,
      phone,
      email,
      notes: message,
      source_project: SOURCE_PROJECT,
      landing_section: section,
      utm_source: utms?.source || null,
      utm_medium: utms?.medium || null,
      utm_campaign: utms?.campaign || null,
      ad_id: utms?.ad_id || null,
      stage: 'new',
    });
  } catch (e) {
    console.warn('[BV] createLead failed:', e);
    return { error: e };
  }
}

/**
 * Actualiza el stage de un lead.
 */
export async function updateLeadStage(leadId, newStage, notes = null) {
  try {
    return supabase
      .from('leads')
      .update({ 
        stage: newStage, 
        updated_at: new Date().toISOString(),
        ...(notes && { notes }) 
      })
      .eq('id', leadId);
  } catch (e) {
    console.warn('[BV] updateLeadStage failed:', e);
    return { error: e };
  }
}

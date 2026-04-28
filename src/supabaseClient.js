import { createClient } from '@supabase/supabase-js';

// Reemplazaremos estos valores con tus credenciales reales de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'TU_URL_DE_SUPABASE';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU_LLAVE_DE_SUPABASE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Logging in as admin...');
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@propiedadesenchiapas.com',
    password: 'Chiapas2026!'
  });

  if (authErr) {
    console.error('Error logging in:', authErr.message);
    return;
  }
  console.log('Login successful.');

  console.log('Querying properties table schema/columns...');
  const { data, error } = await supabase.from('properties').select('*').limit(1);
  if (error) {
    console.error('Error fetching properties:', error);
  } else {
    console.log('Columns in properties table:', Object.keys(data[0] || {}));
  }
}

run();

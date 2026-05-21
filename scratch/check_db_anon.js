import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching one active property using anon key...');
  const { data, error } = await supabase.from('properties').select('*').limit(1);
  if (error) {
    console.error('Error fetching properties:', error);
  } else {
    console.log('Columns in properties table:', data.length > 0 ? Object.keys(data[0]) : 'No properties found');
  }
}

run();

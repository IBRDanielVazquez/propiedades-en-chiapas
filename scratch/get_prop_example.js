import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('properties').select('id, title').eq('active', true).limit(1);
  if (error) {
    console.error('Error fetching property:', error);
  } else {
    console.log('Real property in DB:', data[0]);
  }
}

run();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
        console.error('Error fetching users:', error);
        return;
    }
    console.log('Users in DB:');
    console.log(JSON.stringify(data, null, 2));
}

listUsers();

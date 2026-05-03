import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listUsers() {
    const { data, error } = await supabase.from('users').select('id, name, email');
    if (error) {
        console.error('Error fetching users:', error);
        return;
    }
    console.log('Users in DB:');
    console.table(data);
}

listUsers();

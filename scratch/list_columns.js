import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lfmbhdtrxmtxjwyfzdcz.supabase.co';
const supabaseAnonKey = 'sb_publishable_Ne1rajOeqAJETBoXcIvA6A_l0-NBH1f';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAllColumns() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('--- ALL COLUMNS IN USERS ---');
    console.log(Object.keys(data[0] || {}).join(', '));
  }
}

checkAllColumns();

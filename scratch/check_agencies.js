import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lfmbhdtrxmtxjwyfzdcz.supabase.co';
const supabaseAnonKey = 'sb_publishable_Ne1rajOeqAJETBoXcIvA6A_l0-NBH1f';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAgencies() {
  const { data, error } = await supabase.from('agencies').select('count', { count: 'exact' });
  if (error) {
    console.log('Table agencies does not exist or error:', error.message);
  } else {
    console.log('Table agencies exists. Count:', data);
  }
}

checkAgencies();

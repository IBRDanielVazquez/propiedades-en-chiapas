import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lfmbhdtrxmtxjwyfzdcz.supabase.co';
const supabaseAnonKey = 'sb_publishable_Ne1rajOeqAJETBoXcIvA6A_l0-NBH1f';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listUsers() {
  const { data, error } = await supabase.from('users').select('id, name, email, company, plan');
  if (error) {
    console.error('Error fetching users:', error.message);
  } else {
    console.log('--- Users in Database ---');
    data.forEach(u => console.log(`[${u.id}] ${u.name} (${u.email}) - Agency: ${u.company} - Plan: ${u.plan}`));
  }
}

listUsers();

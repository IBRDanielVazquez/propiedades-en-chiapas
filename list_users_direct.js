const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lfmbhdtrxmtxjwyfzdcz.supabase.co';
const supabaseKey = 'sb_publishable_Ne1rajOeqAJETBoXcIvA6A_l0-NBH1f';
const supabase = createClient(supabaseUrl, supabaseKey);

async function listUsers() {
    const { data, error } = await supabase.from('users').select('id, name, email');
    if (error) {
        console.error('Error fetching users:', error);
        return;
    }
    console.log('Users in DB:');
    console.log(JSON.stringify(data, null, 2));
}

listUsers();

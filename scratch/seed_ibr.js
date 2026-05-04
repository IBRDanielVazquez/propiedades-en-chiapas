import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lfmbhdtrxmtxjwyfzdcz.supabase.co';
const supabaseAnonKey = 'sb_publishable_Ne1rajOeqAJETBoXcIvA6A_l0-NBH1f';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const IBR_TEAM = [
  {
    name: 'Daniel Vázquez',
    email: 'capacitacionparapymes@gmail.com',
    role: 'Team Leader / Admin',
    phone: '9612466204',
    whatsapp: '5219612466204',
    plan: 'admin',
    agency: 'IBR',
    slug: 'daniel-vazquez',
    active: true
  },
  {
    name: 'Carmen Jiménez',
    email: 'carmen@propiedadesenchiapas.com',
    role: 'Asesor Premium',
    phone: '9610000001',
    whatsapp: '5219610000001',
    plan: 'premium',
    agency: 'IBR',
    slug: 'carmen-jimenez',
    active: true
  },
  {
    name: 'Lupyta Mendoza',
    email: 'lupyta@propiedadesenchiapas.com',
    role: 'Asesor Premium',
    phone: '9610000002',
    whatsapp: '5219610000002',
    plan: 'premium',
    agency: 'IBR',
    slug: 'lupyta-mendoza',
    active: true
  },
  {
    name: 'Luis García',
    email: 'luis@propiedadesenchiapas.com',
    role: 'Asesor Premium',
    phone: '9610000003',
    whatsapp: '5219610000003',
    plan: 'premium',
    agency: 'IBR',
    slug: 'luis-garcia',
    active: true
  }
];

async function seedIBR() {
  console.log('Seeding IBR Team...');
  for (const advisor of IBR_TEAM) {
    const { data, error } = await supabase
      .from('users')
      .upsert(advisor, { onConflict: 'email' })
      .select();
    
    if (error) {
      console.error(`Error seeding ${advisor.name}:`, error.message);
    } else {
      console.log(`Successfully seeded/updated ${advisor.name}`);
    }
  }
}

seedIBR();

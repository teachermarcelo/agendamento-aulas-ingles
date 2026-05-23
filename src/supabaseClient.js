// supabaseClient.js
// Para obter SUPABASE_URL e SUPABASE_ANON_KEY:
// 1. Acesse https://supabase.com e faça login.
// 2. Crie ou selecione um projeto.
// 3. Vá em Settings > API.
// 4. Copie a Project URL (SUPABASE_URL) e a anon public key (SUPABASE_ANON_KEY).
// 5. Defina essas variáveis no ambiente (ex: .env.local).

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('As variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

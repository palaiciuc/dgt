import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://pdcndqkjqblsxgejvozh.supabase.co';
const supabaseKey = 'sb_publishable_nUN84hGlylU8HbldSaO64g_mPP4ko5Z';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
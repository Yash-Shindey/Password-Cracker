import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://ykvevrovdvstxmhoxynr.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

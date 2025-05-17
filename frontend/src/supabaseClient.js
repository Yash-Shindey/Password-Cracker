import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://ykvevrovdvstxmhoxynr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrdmV2cm92ZHZzdHhtaG94eW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDYzMzcsImV4cCI6MjA2MzA4MjMzN30.N_dfboIPEaTdNSt1bTVEntqj8HVXOer9VvWA9Y0Wyls';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

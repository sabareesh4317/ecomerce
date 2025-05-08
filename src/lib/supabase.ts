import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// These will need to be provided by the user and stored in .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Note: The actual Database type will be generated once the user provides 
// Supabase connection details and we set up the database schema
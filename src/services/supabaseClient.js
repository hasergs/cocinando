import 'react-native-url-polyfill/auto';
import UniversalStorage from '../utils/UniversalStorage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dyhttvduxwbpxjnvkonk.supabase.co'; // Reemplaza con tu URL de Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5aHR0dmR1eHdicHhqbnZrb25rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTQ0NDYsImV4cCI6MjA2MjczMDQ0Nn0.c1NKenl4unmsvzsU9hoW-XrkgWMs1sGHroNhkNDvcYg'; // Reemplaza con tu anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: UniversalStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 
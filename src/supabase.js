import { createClient } from '@supabase/supabase-js';

// Using the keys from environmental variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hlffrpdsreqmjyzmznmk.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZmZycGRzcmVxbWp5em16bm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNjI5MTksImV4cCI6MjA5MTYzODkxOX0.ZXnWE9LbdQFp0euxGgwyRgr1gbn6bZCXmrFeXNRXOXY';

export const supabase = createClient(supabaseUrl, supabaseKey);

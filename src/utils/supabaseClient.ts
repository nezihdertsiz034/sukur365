import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fbhlufxcidabglgomvgd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiaGx1ZnhjaWRhYmdsZ29tdmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MTM5NjIsImV4cCI6MjA4NTI4OTk2Mn0.Enyjr7Pao3z2P9MkRMn1Mo2SaxMaE-oUZhvrK1oMvns';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

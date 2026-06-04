import { createClient } from '@supabase/supabase-js';

// REPLACE THESE WITH YOUR ACTUAL SUPABASE URL AND KEY
const supabaseUrl = 'https://sivmxwkipttujehcfboy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdm14d2tpcHR0dWplaGNmYm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMDA2NDQsImV4cCI6MjA5NTc3NjY0NH0.z5ejyYy_Pth5YFwENufFCIw7BJVasZ530IF45620Gjs';

export const supabase = createClient(supabaseUrl, supabaseKey);
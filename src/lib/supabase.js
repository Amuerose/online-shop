import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hqputwaqghrbsprtanqo.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxcHV0d2FxZ2hyYnNwcnRhbnFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDgyNDEsImV4cCI6MjA2OTk4NDI0MX0.PDjaUdahzFwsZBCvWjIf97EjXtb84M0qhim5j25i2Ts"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
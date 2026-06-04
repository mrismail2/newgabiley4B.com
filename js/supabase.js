// ============================================================
// Supabase Client — School Plus
// Requires: config.js loaded first, Supabase CDN script loaded first
// CDN: https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
// ============================================================

let _supabaseClient = null;

function initSupabase() {
  if (typeof window.supabase === 'undefined') {
    console.warn('[School Plus] Supabase CDN not loaded. Add the CDN script tag before supabase.js');
    return null;
  }
  if (SUPABASE_URL === 'YOUR_SUPABASE_PROJECT_URL') {
    console.warn('[School Plus] ⚠️  Edit js/config.js and add your Supabase project URL and anon key.');
    return null;
  }
  const { createClient } = window.supabase;
  _supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _supabaseClient;
}

function getSupabase() {
  if (!_supabaseClient) _supabaseClient = initSupabase();
  return _supabaseClient;
}

document.addEventListener('DOMContentLoaded', initSupabase);

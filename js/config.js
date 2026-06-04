// ============================================================
// School Plus — Supabase Configuration
// ============================================================
// Replace the placeholder values below with your own.
// 1. Go to https://supabase.com/dashboard
// 2. Select your project → Settings → API
// 3. Copy "Project URL" and "anon public" key
//
// NEVER commit real keys to version control.
// Add this file to .gitignore and use config.example.js as template.
// NEVER use the service_role key in frontend code.
// ============================================================

const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const APP_CONFIG = {
  appName: 'School Plus',
  version: '1.0.0',
  trialDays: 30,
  plans: {
    basic:    { name: 'Basic',    price: 10, maxStudents: 100 },
    standard: { name: 'Standard', price: 30, maxStudents: 500 },
    premium:  { name: 'Premium',  price: 50, maxStudents: null },
  },
};

# School Plus — Multi-School Management SaaS Platform

School Plus is a professional SaaS platform that allows multiple schools, colleges, universities, academies, and training centers to manage their operations from a single platform — each with complete data isolation.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend & Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Security | Supabase Row Level Security (RLS) |
| Icons | Lucide Icons (CDN) |
| Fonts | Inter (Google Fonts) |
| Hosting | Netlify or Vercel |

## Color Palette

```css
--primary: #021454       /* Main navy */
--primary-light: #213F8E /* Light navy */
--blue: #175DED          /* Action blue */
--purple: #6B28CB        /* Accent purple */
--pink: #C80D97          /* Accent pink */
--orange: #F3851C        /* Accent orange */
--gold: #F7B500          /* Gold highlights */
```

## Folder Structure

```
school-plus/
├── index.html              # Landing page
├── login.html              # Login
├── register.html           # Trial request form
├── dashboard.html          # School Admin dashboard
├── students.html           # Students management
├── payments.html           # Payments management
├── attendance.html         # Attendance tracking
├── exams.html              # Exams & results
├── reports.html            # Reports
├── settings.html           # School settings
├── super-admin.html        # Super Admin dashboard
├── trial-requests.html     # Trial request management
├── schools.html            # Schools management
├── subscriptions.html      # Subscription management
├── platform-reports.html   # Platform analytics
├── css/
│   ├── style.css             # Global styles & CSS variables
│   ├── landing.css           # Landing page styles
│   ├── login.css             # Auth page styles
│   ├── dashboard.css         # Dashboard layout styles
│   ├── super-admin.css       # Super admin styles
│   └── responsive.css        # Mobile responsive styles
├── js/
│   ├── config.js             # Supabase credentials (edit this)
│   ├── supabase.js           # Supabase client init
│   ├── auth.js               # Auth utilities
│   ├── utils.js              # Shared utility functions
│   └── [page].js             # Page-specific JS files
├── components/
│   ├── sidebar.js            # Sidebar component
│   ├── header.js             # Header component
│   ├── statCard.js           # Stat card component
│   ├── table.js              # Data table component
│   ├── modal.js              # Modal component
│   └── toast.js              # Toast notifications
└── database/
    ├── schema.sql            # All table definitions
    ├── policies.sql          # RLS policies
    ├── functions.sql         # PostgreSQL functions & triggers
    └── seed.sql              # Sample data (dev only)
```

## Setup Instructions

### Step 1 — Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New project**
3. Name it `school-plus` and choose a strong database password
4. Wait for the project to initialize

### Step 2 — Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/schema.sql` and run it
3. Copy the contents of `database/policies.sql` and run it
4. Copy the contents of `database/functions.sql` and run it
5. **Optional (dev only):** Run `database/seed.sql` for sample data

### Step 3 — Configure Supabase Credentials

1. In your Supabase dashboard, go to **Settings → API**
2. Copy your **Project URL** and **anon public** key
3. Open `js/config.js` and replace the placeholders:

```js
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIs...';
```

> **Security:** The anon key is safe to use in frontend code. Never put the `service_role` key in frontend code. Add `js/config.js` to `.gitignore` to avoid committing real credentials.

### Step 4 — Open the App

Simply open `index.html` in your browser, or deploy to Netlify/Vercel.

For local development with file:// protocol, all pages work directly since there is no build step.

## Deployment

### Netlify (Drag & Drop)
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Drag the entire project folder to the deploy area
3. Done — your site is live

### Netlify (via Git)
Create a `netlify.toml` in the root:
```toml
[build]
  publish = "."
```

### Vercel
```bash
npx vercel --prod
```

## User Roles

| Role | Access |
|---|---|
| **Super Admin** | Entire platform — all schools, trial requests, subscriptions |
| **School Admin** | Own school only — all modules |
| **Teacher** | Own school — students, attendance, exams |
| **Accountant** | Own school — payments, students, reports |
| **Parent** | Own child only — read-only |

Roles are stored in the `profiles` table. RLS policies enforce isolation at the database level.

## SaaS Flow

1. Visitor fills the **30-day free trial** form on `index.html`
2. Request is saved to `trial_requests` table in Supabase
3. **Super Admin** reviews and approves the request in `trial-requests.html`
4. A school account is created and School Admin receives login credentials
5. School Admin logs in and manages their school
6. After 30 days, status becomes `trial_expired` unless upgraded
7. Super Admin can activate, suspend, or delete school access at any time

## Phase Roadmap

| Phase | Status | Description |
|---|---|---|
| **Phase 1** | ✅ Complete | UI shells, landing page, database schema |
| **Phase 2** | Upcoming | Supabase database setup, RLS, roles, permissions |
| **Phase 3** | Upcoming | Real Supabase Auth, protected pages, session management |
| **Phase 4** | Upcoming | Super Admin approval system, school creation |
| **Phase 5** | Upcoming | Students module — CRUD, PDF/Excel import |
| **Phase 6** | Upcoming | Payments module — fees, receipts, reports |
| **Phase 7** | Upcoming | Attendance module — daily marking, reports |
| **Phase 8** | Upcoming | Exams module — marks, grades, results |
| **Phase 9** | Upcoming | Reports — PDF/Excel export, charts |
| **Phase 10** | Upcoming | Polish, optimization, production deployment |

## Development Notes

- **No build step required** — pure HTML/CSS/JS, open files directly
- **Script load order matters** — follow the order in each HTML file’s `<script>` tags
- **Phase 1 auth guards are soft** — pages are accessible without login for UI review
- **All Supabase calls are TODO stubs** in Phase 1 — real data loads from Phase 2 onwards
- **XSS protection** — all user data is passed through `sanitizeHTML()` before injection

---

*School Plus — Built for schools, secured by Supabase, owned by you.*

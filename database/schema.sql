-- ============================================================
-- School Plus — Complete Database Schema
-- Run this in your Supabase SQL Editor FIRST, before policies.sql
-- All tables use UUID primary keys and created_at timestamps
-- Every school-scoped table has school_id for RLS isolation
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS plans (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,                          -- 'basic' | 'standard' | 'premium'
  price        NUMERIC(10,2) NOT NULL,
  max_students INTEGER,                                -- NULL = unlimited
  features     JSONB DEFAULT '[]',
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SCHOOLS
-- ============================================================
CREATE TABLE IF NOT EXISTS schools (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('school','college','university','academy','training_center')),
  status       TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial','active','trial_expired','suspended','cancelled')),
  plan_id      UUID REFERENCES plans(id),
  trial_start  DATE,
  trial_end    DATE,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address      TEXT,
  logo_url     TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRIAL REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS trial_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name    TEXT NOT NULL,
  school_type    TEXT NOT NULL,
  student_count  TEXT,
  contact_name   TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT,
  plan           TEXT NOT NULL DEFAULT 'standard' CHECK (plan IN ('basic','standard','premium')),
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  notes          TEXT,
  reviewed_by    UUID,                                -- super_admin user id
  reviewed_at    TIMESTAMPTZ,
  school_id      UUID REFERENCES schools(id),         -- filled after approval
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  plan_id      UUID REFERENCES plans(id),
  status       TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('trial','active','past_due','cancelled','expired')),
  start_date   DATE NOT NULL,
  end_date     DATE,
  amount_paid  NUMERIC(10,2) DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROFILES (linked to Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id    UUID REFERENCES schools(id) ON DELETE CASCADE,  -- NULL for super_admin
  role         TEXT NOT NULL CHECK (role IN ('super_admin','school_admin','teacher','accountant','parent')),
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  avatar_url   TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PARENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS parents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id),        -- optional: if parent has login
  full_name    TEXT NOT NULL,
  email        TEXT,
  phone        TEXT,
  address      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TEACHERS
-- ============================================================
CREATE TABLE IF NOT EXISTS teachers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id),
  full_name    TEXT NOT NULL,
  email        TEXT,
  phone        TEXT,
  subjects     TEXT[],
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CLASSES
-- ============================================================
CREATE TABLE IF NOT EXISTS classes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  grade        TEXT,
  teacher_id   UUID REFERENCES teachers(id),
  capacity     INTEGER,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS subjects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  teacher_id   UUID REFERENCES teachers(id),
  class_id     UUID REFERENCES classes(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STUDENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id     UUID REFERENCES classes(id),
  parent_id    UUID REFERENCES parents(id),
  full_name    TEXT NOT NULL,
  date_of_birth DATE,
  gender       TEXT CHECK (gender IN ('male','female','other')),
  admission_no TEXT,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','graduated','withdrawn')),
  address      TEXT,
  photo_url    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount       NUMERIC(10,2) NOT NULL,
  amount_paid  NUMERIC(10,2) DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('paid','unpaid','partial','free','waived')),
  month        TEXT,                                  -- e.g. '2026-01'
  due_date     DATE,
  paid_date    DATE,
  payment_method TEXT,
  receipt_no   TEXT,
  notes        TEXT,
  recorded_by  UUID REFERENCES profiles(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ATTENDANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id     UUID REFERENCES classes(id),
  date         DATE NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('present','absent','late','excused')),
  notes        TEXT,
  marked_by    UUID REFERENCES profiles(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, student_id, date)                -- one record per student per day
);

-- ============================================================
-- EXAMS
-- ============================================================
CREATE TABLE IF NOT EXISTS exams (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  subject_id   UUID REFERENCES subjects(id),
  class_id     UUID REFERENCES classes(id),
  name         TEXT NOT NULL,
  description  TEXT,
  exam_date    DATE,
  max_marks    INTEGER DEFAULT 100,
  pass_marks   INTEGER DEFAULT 40,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EXAM RESULTS
-- ============================================================
CREATE TABLE IF NOT EXISTS exam_results (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id      UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  marks        NUMERIC(6,2),
  grade        TEXT,
  remarks      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  target_role  TEXT,                                 -- NULL = all users in school
  title        TEXT NOT NULL,
  message      TEXT NOT NULL,
  type         TEXT DEFAULT 'info' CHECK (type IN ('info','warning','success','urgent')),
  is_read      BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID REFERENCES schools(id) ON DELETE SET NULL,
  user_id      UUID,
  action       TEXT NOT NULL,                        -- 'INSERT','UPDATE','DELETE'
  table_name   TEXT NOT NULL,
  record_id    UUID,
  old_values   JSONB,
  new_values   JSONB,
  ip_address   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PERMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS permissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL UNIQUE,                 -- e.g. 'students.create'
  description  TEXT,
  module       TEXT,                                 -- e.g. 'students', 'payments'
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROLE PERMISSIONS (default permissions per role)
-- ============================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role          TEXT NOT NULL,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, permission_id)
);

-- ============================================================
-- USER PERMISSIONS (custom permissions per user within a school)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_permissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  granted_by    UUID REFERENCES profiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, permission_id, school_id)
);

-- ============================================================
-- STUDENT IMPORTS (tracks import sessions)
-- ============================================================
CREATE TABLE IF NOT EXISTS student_imports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  imported_by   UUID REFERENCES profiles(id),
  filename      TEXT,
  file_type     TEXT CHECK (file_type IN ('csv','xlsx','pdf')),
  total_rows    INTEGER DEFAULT 0,
  imported_rows INTEGER DEFAULT 0,
  failed_rows   INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','previewing','confirmed','failed','cancelled')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STUDENT IMPORT ROWS (individual row data before confirmation)
-- ============================================================
CREATE TABLE IF NOT EXISTS student_import_rows (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_id         UUID NOT NULL REFERENCES student_imports(id) ON DELETE CASCADE,
  row_number        INTEGER,
  row_data          JSONB,
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending','valid','invalid','duplicate')),
  error_message     TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Default permissions data
INSERT INTO permissions (name, description, module) VALUES
  ('students.view',    'View students',           'students'),
  ('students.create',  'Add new students',        'students'),
  ('students.update',  'Edit student records',    'students'),
  ('students.delete',  'Delete students',         'students'),
  ('payments.view',    'View payments',           'payments'),
  ('payments.create',  'Record payments',         'payments'),
  ('payments.update',  'Edit payment records',    'payments'),
  ('attendance.view',  'View attendance',         'attendance'),
  ('attendance.create','Mark attendance',         'attendance'),
  ('attendance.update','Edit attendance records', 'attendance'),
  ('exams.view',       'View exams and results',  'exams'),
  ('exams.create',     'Create exams',            'exams'),
  ('exams.update',     'Enter exam marks',        'exams'),
  ('reports.view',     'View and generate reports','reports'),
  ('users.manage',     'Manage school users',     'users')
ON CONFLICT (name) DO NOTHING;

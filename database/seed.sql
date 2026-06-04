-- ============================================================
-- School Plus — Sample Seed Data
-- FOR DEVELOPMENT ONLY — DO NOT RUN IN PRODUCTION
-- Run AFTER schema.sql, policies.sql, and functions.sql
-- ============================================================

-- ============================================================
-- PLANS
-- ============================================================
INSERT INTO plans (id, name, price, max_students, features) VALUES
  ('a1b2c3d4-0001-0000-0000-000000000001', 'basic',    10.00, 100,  '["Student registration","Basic payment tracking","Basic attendance","One admin account","Simple reports"]'),
  ('a1b2c3d4-0002-0000-0000-000000000002', 'standard', 30.00, 500,  '["Full student management","Payment tracking","Attendance","Parent records","Multiple user roles","Monthly reports"]'),
  ('a1b2c3d4-0003-0000-0000-000000000003', 'premium',  50.00, NULL, '["Unlimited students","Full platform access","Exam records","Advanced reports","Multiple admins","Priority support"]')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SAMPLE SCHOOLS
-- ============================================================
INSERT INTO schools (id, name, type, status, plan_id, trial_start, trial_end, contact_name, contact_email) VALUES
  (
    'b1c2d3e4-0001-0000-0000-000000000001',
    'Al-Noor Academy',
    'academy',
    'active',
    'a1b2c3d4-0002-0000-0000-000000000002',
    '2026-01-01',
    '2026-01-31',
    'Ahmed Hassan',
    'admin@alnoor.example.com'
  ),
  (
    'b1c2d3e4-0002-0000-0000-000000000002',
    'Horizon College',
    'college',
    'trial',
    'a1b2c3d4-0003-0000-0000-000000000003',
    '2026-05-15',
    '2026-06-14',
    'Fatima Omar',
    'admin@horizon.example.com'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SAMPLE TRIAL REQUESTS
-- ============================================================
INSERT INTO trial_requests (id, school_name, school_type, student_count, contact_name, email, phone, plan, status) VALUES
  (
    'c1d2e3f4-0001-0000-0000-000000000001',
    'Sunrise School',
    'school',
    '100_500',
    'Mohamed Ali',
    'info@sunrise.example.com',
    '+252 61 111 1111',
    'standard',
    'pending'
  ),
  (
    'c1d2e3f4-0002-0000-0000-000000000002',
    'Al-Noor Academy',
    'academy',
    '100_500',
    'Ahmed Hassan',
    'admin@alnoor.example.com',
    '+252 61 222 2222',
    'standard',
    'approved'
  ),
  (
    'c1d2e3f4-0003-0000-0000-000000000003',
    'Test School XYZ',
    'school',
    'under_100',
    'Test User',
    'test@example.com',
    '',
    'basic',
    'rejected'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SAMPLE CLASSES (for Al-Noor Academy)
-- ============================================================
INSERT INTO classes (id, school_id, name, grade) VALUES
  ('d1e2f3a4-0001-0000-0000-000000000001', 'b1c2d3e4-0001-0000-0000-000000000001', 'Grade 6A', 'Grade 6'),
  ('d1e2f3a4-0002-0000-0000-000000000002', 'b1c2d3e4-0001-0000-0000-000000000001', 'Grade 7B', 'Grade 7'),
  ('d1e2f3a4-0003-0000-0000-000000000003', 'b1c2d3e4-0001-0000-0000-000000000001', 'Grade 8C', 'Grade 8')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SAMPLE STUDENTS
-- ============================================================
INSERT INTO students (id, school_id, class_id, full_name, date_of_birth, gender, admission_no, status) VALUES
  ('e1f2a3b4-0001-0000-0000-000000000001', 'b1c2d3e4-0001-0000-0000-000000000001', 'd1e2f3a4-0001-0000-0000-000000000001', 'Ahmed Ali Mohamed',  '2014-03-15', 'male',   'ADM-001', 'active'),
  ('e1f2a3b4-0002-0000-0000-000000000002', 'b1c2d3e4-0001-0000-0000-000000000001', 'd1e2f3a4-0001-0000-0000-000000000001', 'Fatima Hassan Omar', '2013-07-22', 'female', 'ADM-002', 'active'),
  ('e1f2a3b4-0003-0000-0000-000000000003', 'b1c2d3e4-0001-0000-0000-000000000001', 'd1e2f3a4-0002-0000-0000-000000000002', 'Omar Abdullahi Said','2012-11-08', 'male',   'ADM-003', 'active'),
  ('e1f2a3b4-0004-0000-0000-000000000004', 'b1c2d3e4-0001-0000-0000-000000000001', 'd1e2f3a4-0002-0000-0000-000000000002', 'Zahra Ibrahim Warsame','2013-05-30','female','ADM-004', 'active'),
  ('e1f2a3b4-0005-0000-0000-000000000005', 'b1c2d3e4-0001-0000-0000-000000000001', 'd1e2f3a4-0003-0000-0000-000000000003', 'Mustafa Nur Hassan', '2012-01-17', 'male',   'ADM-005', 'active')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SAMPLE PAYMENTS
-- ============================================================
INSERT INTO payments (school_id, student_id, amount, amount_paid, status, month, paid_date) VALUES
  ('b1c2d3e4-0001-0000-0000-000000000001', 'e1f2a3b4-0001-0000-0000-000000000001', 30.00, 30.00, 'paid',   '2026-05', '2026-05-03'),
  ('b1c2d3e4-0001-0000-0000-000000000001', 'e1f2a3b4-0002-0000-0000-000000000002', 30.00, 0.00,  'unpaid', '2026-05', NULL),
  ('b1c2d3e4-0001-0000-0000-000000000001', 'e1f2a3b4-0003-0000-0000-000000000003', 30.00, 15.00, 'partial','2026-05', '2026-05-10'),
  ('b1c2d3e4-0001-0000-0000-000000000001', 'e1f2a3b4-0004-0000-0000-000000000004', 30.00, 30.00, 'paid',   '2026-05', '2026-05-01'),
  ('b1c2d3e4-0001-0000-0000-000000000001', 'e1f2a3b4-0005-0000-0000-000000000005', 30.00, 0.00,  'unpaid', '2026-05', NULL);

-- ============================================================
-- SAMPLE ATTENDANCE
-- ============================================================
INSERT INTO attendance (school_id, student_id, class_id, date, status) VALUES
  ('b1c2d3e4-0001-0000-0000-000000000001', 'e1f2a3b4-0001-0000-0000-000000000001', 'd1e2f3a4-0001-0000-0000-000000000001', '2026-06-04', 'present'),
  ('b1c2d3e4-0001-0000-0000-000000000001', 'e1f2a3b4-0002-0000-0000-000000000002', 'd1e2f3a4-0001-0000-0000-000000000001', '2026-06-04', 'absent'),
  ('b1c2d3e4-0001-0000-0000-000000000001', 'e1f2a3b4-0003-0000-0000-000000000003', 'd1e2f3a4-0002-0000-0000-000000000002', '2026-06-04', 'present'),
  ('b1c2d3e4-0001-0000-0000-000000000001', 'e1f2a3b4-0004-0000-0000-000000000004', 'd1e2f3a4-0002-0000-0000-000000000002', '2026-06-04', 'late'),
  ('b1c2d3e4-0001-0000-0000-000000000001', 'e1f2a3b4-0005-0000-0000-000000000005', 'd1e2f3a4-0003-0000-0000-000000000003', '2026-06-04', 'present')
ON CONFLICT (school_id, student_id, date) DO NOTHING;

-- ============================================================
-- School Plus — Row Level Security Policies
-- Run AFTER schema.sql
-- Enforces: each school sees only its own data
-- ============================================================

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT school_id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin');
$$;

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE schools           ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents           ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE students          ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance        ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams             ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results      ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_imports   ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_import_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions  ENABLE ROW LEVEL SECURITY;
-- plans and permissions are public read
ALTER TABLE plans             ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions       ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PLANS — Public read, super_admin write
-- ============================================================
CREATE POLICY "plans_read_all" ON plans FOR SELECT USING (TRUE);
CREATE POLICY "plans_super_admin" ON plans FOR ALL USING (is_super_admin());

-- ============================================================
-- PERMISSIONS table — Public read
-- ============================================================
CREATE POLICY "permissions_read_all" ON permissions FOR SELECT USING (TRUE);

-- ============================================================
-- SCHOOLS
-- ============================================================
CREATE POLICY "schools_super_admin" ON schools
  FOR ALL USING (is_super_admin());

CREATE POLICY "schools_own_school" ON schools
  FOR SELECT USING (id = get_user_school_id());

-- ============================================================
-- TRIAL REQUESTS
-- ============================================================
-- Anyone can insert a trial request (public form on landing page)
CREATE POLICY "trial_requests_public_insert" ON trial_requests
  FOR INSERT WITH CHECK (TRUE);

-- Only super admin can view/update/delete requests
CREATE POLICY "trial_requests_super_admin" ON trial_requests
  FOR ALL USING (is_super_admin());

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE POLICY "subscriptions_super_admin" ON subscriptions
  FOR ALL USING (is_super_admin());

CREATE POLICY "subscriptions_own_school" ON subscriptions
  FOR SELECT USING (school_id = get_user_school_id());

-- ============================================================
-- PROFILES
-- ============================================================
-- Super admin sees all
CREATE POLICY "profiles_super_admin" ON profiles
  FOR ALL USING (is_super_admin());

-- User can read their own profile
CREATE POLICY "profiles_own" ON profiles
  FOR SELECT USING (user_id = auth.uid());

-- School admin can read all profiles in their school
CREATE POLICY "profiles_school_admin_read" ON profiles
  FOR SELECT USING (
    get_user_role() = 'school_admin'
    AND school_id = get_user_school_id()
  );

-- School admin can insert/update users within their school only
CREATE POLICY "profiles_school_admin_write" ON profiles
  FOR INSERT WITH CHECK (
    get_user_role() = 'school_admin'
    AND school_id = get_user_school_id()
    AND role NOT IN ('super_admin')  -- cannot create super_admin
  );

-- ============================================================
-- PARENTS
-- ============================================================
CREATE POLICY "parents_super_admin" ON parents FOR ALL USING (is_super_admin());
CREATE POLICY "parents_own_school" ON parents FOR ALL
  USING (school_id = get_user_school_id());

-- ============================================================
-- TEACHERS
-- ============================================================
CREATE POLICY "teachers_super_admin" ON teachers FOR ALL USING (is_super_admin());
CREATE POLICY "teachers_own_school" ON teachers FOR ALL
  USING (school_id = get_user_school_id());

-- ============================================================
-- CLASSES
-- ============================================================
CREATE POLICY "classes_super_admin" ON classes FOR ALL USING (is_super_admin());
CREATE POLICY "classes_own_school" ON classes FOR ALL
  USING (school_id = get_user_school_id());

-- ============================================================
-- SUBJECTS
-- ============================================================
CREATE POLICY "subjects_super_admin" ON subjects FOR ALL USING (is_super_admin());
CREATE POLICY "subjects_own_school" ON subjects FOR ALL
  USING (school_id = get_user_school_id());

-- ============================================================
-- STUDENTS
-- ============================================================
CREATE POLICY "students_super_admin" ON students FOR ALL USING (is_super_admin());

-- School admin, teacher, accountant: see all students in their school
CREATE POLICY "students_school_staff" ON students
  FOR ALL USING (
    school_id = get_user_school_id()
    AND get_user_role() IN ('school_admin', 'teacher', 'accountant')
  );

-- Parent: see only their own children
CREATE POLICY "students_parent" ON students
  FOR SELECT USING (
    get_user_role() = 'parent'
    AND parent_id IN (
      SELECT id FROM parents WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE POLICY "payments_super_admin" ON payments FOR ALL USING (is_super_admin());

CREATE POLICY "payments_school_admin_accountant" ON payments
  FOR ALL USING (
    school_id = get_user_school_id()
    AND get_user_role() IN ('school_admin', 'accountant')
  );

-- Parent sees only their child's payments
CREATE POLICY "payments_parent" ON payments
  FOR SELECT USING (
    get_user_role() = 'parent'
    AND student_id IN (
      SELECT s.id FROM students s
      JOIN parents p ON p.id = s.parent_id
      WHERE p.user_id = auth.uid()
    )
  );

-- ============================================================
-- ATTENDANCE
-- ============================================================
CREATE POLICY "attendance_super_admin" ON attendance FOR ALL USING (is_super_admin());

CREATE POLICY "attendance_school_staff" ON attendance
  FOR ALL USING (
    school_id = get_user_school_id()
    AND get_user_role() IN ('school_admin', 'teacher')
  );

CREATE POLICY "attendance_parent" ON attendance
  FOR SELECT USING (
    get_user_role() = 'parent'
    AND student_id IN (
      SELECT s.id FROM students s
      JOIN parents p ON p.id = s.parent_id
      WHERE p.user_id = auth.uid()
    )
  );

-- ============================================================
-- EXAMS
-- ============================================================
CREATE POLICY "exams_super_admin" ON exams FOR ALL USING (is_super_admin());

CREATE POLICY "exams_school_staff" ON exams
  FOR ALL USING (
    school_id = get_user_school_id()
    AND get_user_role() IN ('school_admin', 'teacher')
  );

-- ============================================================
-- EXAM RESULTS
-- ============================================================
CREATE POLICY "exam_results_super_admin" ON exam_results FOR ALL USING (is_super_admin());

CREATE POLICY "exam_results_school_staff" ON exam_results
  FOR ALL USING (
    school_id = get_user_school_id()
    AND get_user_role() IN ('school_admin', 'teacher')
  );

CREATE POLICY "exam_results_parent" ON exam_results
  FOR SELECT USING (
    get_user_role() = 'parent'
    AND student_id IN (
      SELECT s.id FROM students s
      JOIN parents p ON p.id = s.parent_id
      WHERE p.user_id = auth.uid()
    )
  );

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE POLICY "notifications_own_school" ON notifications
  FOR SELECT USING (school_id = get_user_school_id());

CREATE POLICY "notifications_school_admin_write" ON notifications
  FOR ALL USING (
    school_id = get_user_school_id()
    AND get_user_role() = 'school_admin'
  );

CREATE POLICY "notifications_super_admin" ON notifications FOR ALL USING (is_super_admin());

-- ============================================================
-- AUDIT LOGS
-- ============================================================
-- Anyone authenticated can insert (for logging)
CREATE POLICY "audit_logs_insert" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "audit_logs_school_admin" ON audit_logs
  FOR SELECT USING (
    (school_id = get_user_school_id() AND get_user_role() = 'school_admin')
    OR is_super_admin()
  );

-- ============================================================
-- STUDENT IMPORTS
-- ============================================================
CREATE POLICY "student_imports_own_school" ON student_imports
  FOR ALL USING (
    school_id = get_user_school_id()
    AND get_user_role() IN ('school_admin')
  );

CREATE POLICY "student_import_rows_own_school" ON student_import_rows
  FOR ALL USING (
    import_id IN (
      SELECT id FROM student_imports WHERE school_id = get_user_school_id()
    )
  );

-- ============================================================
-- USER PERMISSIONS
-- ============================================================
CREATE POLICY "user_permissions_school_admin" ON user_permissions
  FOR ALL USING (
    school_id = get_user_school_id()
    AND get_user_role() = 'school_admin'
  );

CREATE POLICY "user_permissions_own" ON user_permissions
  FOR SELECT USING (
    user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

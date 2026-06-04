-- ============================================================
-- School Plus — Database Functions & Triggers
-- Run AFTER schema.sql and policies.sql
-- ============================================================

-- ============================================================
-- AUTO-CREATE PROFILE ON NEW AUTH USER
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- A profile row will be created explicitly by the application
  -- This trigger can be extended to set defaults
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- AUTO-UPDATE updated_at TIMESTAMP
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply to tables with updated_at columns
CREATE TRIGGER schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- GET SCHOOL MONTHLY REVENUE
-- Returns total paid amount for a school in a given month
-- Usage: SELECT get_school_monthly_revenue('school-uuid', '2026-01');
-- ============================================================
CREATE OR REPLACE FUNCTION get_school_monthly_revenue(p_school_id UUID, p_month TEXT)
RETURNS NUMERIC
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(amount_paid), 0)
  FROM payments
  WHERE school_id = p_school_id
    AND month = p_month
    AND status IN ('paid', 'partial');
$$;

-- ============================================================
-- CALCULATE ATTENDANCE RATE
-- Returns attendance percentage for a school on a given date
-- Usage: SELECT calculate_attendance_rate('school-uuid', '2026-01-15');
-- ============================================================
CREATE OR REPLACE FUNCTION calculate_attendance_rate(p_school_id UUID, p_date DATE)
RETURNS NUMERIC
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT CASE
    WHEN COUNT(*) = 0 THEN 0
    ELSE ROUND(
      (COUNT(*) FILTER (WHERE status = 'present')::NUMERIC / COUNT(*)::NUMERIC) * 100,
      1
    )
  END
  FROM attendance
  WHERE school_id = p_school_id AND date = p_date;
$$;

-- ============================================================
-- CHECK TRIAL EXPIRY
-- Updates school status to trial_expired where trial has ended
-- Call this via a scheduled job (pg_cron) or on each login
-- ============================================================
CREATE OR REPLACE FUNCTION check_trial_expiry()
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE schools
  SET status = 'trial_expired'
  WHERE status = 'trial'
    AND trial_end < CURRENT_DATE;
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- ============================================================
-- GET PLATFORM STATISTICS (for Super Admin dashboard)
-- Returns aggregated stats across all schools
-- ============================================================
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS TABLE (
  total_schools     BIGINT,
  active_schools    BIGINT,
  trial_schools     BIGINT,
  expired_schools   BIGINT,
  suspended_schools BIGINT,
  total_students    BIGINT
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT
    COUNT(*)                                          AS total_schools,
    COUNT(*) FILTER (WHERE status = 'active')         AS active_schools,
    COUNT(*) FILTER (WHERE status = 'trial')          AS trial_schools,
    COUNT(*) FILTER (WHERE status = 'trial_expired')  AS expired_schools,
    COUNT(*) FILTER (WHERE status = 'suspended')      AS suspended_schools,
    (SELECT COUNT(*) FROM students)                   AS total_students
  FROM schools;
$$;

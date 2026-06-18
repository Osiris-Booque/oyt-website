/*
  # Fix infinite recursion in profiles RLS policies

  The admin policies on the `profiles` table were querying the `profiles`
  table itself to check the user's role, causing infinite recursion.

  1. Changes
    - Create a `public.get_user_role()` SECURITY DEFINER function that
      bypasses RLS to look up the current user's role
    - Drop the old admin policies on `profiles`
    - Recreate admin policies using the new function instead of a
      sub-select on `profiles`

  2. Also fixes policies on other tables that join through profiles
    - courses, course_modules, lessons, enrollments, lesson_progress,
      certificates, live_events, event_registrations all had admin
      policies that queried profiles. These are updated to use
      `get_user_role()` as well, which avoids the recursion when
      the profiles SELECT triggers cascading policy checks.
*/

-- Helper function that bypasses RLS
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ============================================================
-- Fix profiles policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- ============================================================
-- Fix courses policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;

CREATE POLICY "Admins can manage all courses"
  ON courses FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- Fix provider insert policy (also referenced profiles)
DROP POLICY IF EXISTS "Providers can insert own courses" ON courses;

CREATE POLICY "Providers can insert own courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (
    provider_id = auth.uid()
    AND public.get_user_role() IN ('provider', 'admin')
  );

-- ============================================================
-- Fix course_modules policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all modules" ON course_modules;

CREATE POLICY "Admins can manage all modules"
  ON course_modules FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- ============================================================
-- Fix lessons policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all lessons" ON lessons;

CREATE POLICY "Admins can manage all lessons"
  ON lessons FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- ============================================================
-- Fix enrollments policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON enrollments;

CREATE POLICY "Admins can manage all enrollments"
  ON enrollments FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- ============================================================
-- Fix lesson_progress policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all progress" ON lesson_progress;

CREATE POLICY "Admins can manage all progress"
  ON lesson_progress FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- ============================================================
-- Fix certificates policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all certificates" ON certificates;

CREATE POLICY "Admins can manage all certificates"
  ON certificates FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- ============================================================
-- Fix live_events policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all events" ON live_events;

CREATE POLICY "Admins can manage all events"
  ON live_events FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

-- Fix provider insert policy (also referenced profiles)
DROP POLICY IF EXISTS "Providers can insert own events" ON live_events;

CREATE POLICY "Providers can insert own events"
  ON live_events FOR INSERT
  TO authenticated
  WITH CHECK (
    provider_id = auth.uid()
    AND public.get_user_role() IN ('provider', 'admin')
  );

-- ============================================================
-- Fix event_registrations policies
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all registrations" ON event_registrations;

CREATE POLICY "Admins can manage all registrations"
  ON event_registrations FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'admin')
  WITH CHECK (public.get_user_role() = 'admin');

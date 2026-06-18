/*
  # Restructure User Roles and Add Role Application System

  ## Overview
  Replaces the old 3-role system (student/provider/admin) with a 5-tier
  progression: member -> student -> facilitator -> instructor -> guru.

  ## Role Hierarchy
  - **member** (default): Access to yoga, breathwork, therapy courses at
    beginner/intermediate/advanced levels. May attend events.
  - **student**: Unlocked after completing all 9 member courses. Takes
    training courses (expert -> master -> guru levels).
  - **facilitator**: Unlocked after completing guru-level training. Can
    host courses and events.
  - **instructor**: Reserved for course teachers. Assigned by guru only.
  - **guru**: Top-level. Creates courses, events, offerings. Manages
    role promotions.

  ## Changes
  1. Modified Tables
    - `profiles` - Updated role CHECK constraint to new role set
    - `courses` - Updated difficulty_level CHECK to include expert/master/guru;
      added `required_role` column; added `category` value 'training'

  2. New Tables
    - `role_applications` - Tracks role upgrade requests
      - `id` (uuid, PK)
      - `user_id` (uuid, FK to profiles)
      - `requested_role` (text)
      - `status` (pending/approved/rejected)
      - `reviewed_by` (uuid, FK to profiles, nullable)
      - `reviewed_at` (timestamptz, nullable)
      - `note` (text) - applicant message
      - `review_note` (text) - guru feedback
      - `created_at` (timestamptz)

  3. Security
    - RLS enabled on `role_applications`
    - Users can view and create their own applications
    - Gurus can view and update all applications
*/

-- 1. Update profiles role constraint
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('member', 'student', 'facilitator', 'instructor', 'guru'));

-- Migrate existing roles
UPDATE profiles SET role = 'member' WHERE role = 'student';
UPDATE profiles SET role = 'facilitator' WHERE role = 'provider';
UPDATE profiles SET role = 'guru' WHERE role = 'admin';

-- Update default
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'member';

-- 2. Update get_user_role function (already exists, just refreshing)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 3. Update courses difficulty_level constraint
ALTER TABLE courses
  DROP CONSTRAINT IF EXISTS courses_difficulty_level_check;

ALTER TABLE courses
  ADD CONSTRAINT courses_difficulty_level_check
  CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert', 'master', 'guru'));

-- 4. Update courses category constraint
ALTER TABLE courses
  DROP CONSTRAINT IF EXISTS courses_category_check;

ALTER TABLE courses
  ADD CONSTRAINT courses_category_check
  CHECK (category IN ('yoga', 'breathwork', 'therapy', 'training', 'wellness'));

-- 5. Add required_role column to courses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'required_role'
  ) THEN
    ALTER TABLE courses ADD COLUMN required_role text NOT NULL DEFAULT 'member'
      CHECK (required_role IN ('member', 'student', 'facilitator', 'instructor', 'guru'));
  END IF;
END $$;

-- 6. Create role_applications table
CREATE TABLE IF NOT EXISTS role_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requested_role text NOT NULL CHECK (requested_role IN ('student', 'facilitator', 'instructor', 'guru')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  note text NOT NULL DEFAULT '',
  review_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_role_applications_user ON role_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_role_applications_status ON role_applications(status);

ALTER TABLE role_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON role_applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own applications"
  ON role_applications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Gurus can view all applications"
  ON role_applications FOR SELECT
  TO authenticated
  USING (public.get_user_role() = 'guru');

CREATE POLICY "Gurus can update applications"
  ON role_applications FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'guru')
  WITH CHECK (public.get_user_role() = 'guru');

-- 7. Update trigger function for new default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'full_name', ''));
  RETURN new;
END;
$$;

-- 8. Fix provider-related policies to use new role names

-- Courses: providers -> facilitators/instructors/gurus
DROP POLICY IF EXISTS "Providers can read own courses" ON courses;
DROP POLICY IF EXISTS "Providers can insert own courses" ON courses;
DROP POLICY IF EXISTS "Providers can update own courses" ON courses;
DROP POLICY IF EXISTS "Providers can delete own courses" ON courses;

CREATE POLICY "Creators can read own courses"
  ON courses FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Creators can insert own courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (
    provider_id = auth.uid()
    AND public.get_user_role() IN ('facilitator', 'instructor', 'guru')
  );

CREATE POLICY "Creators can update own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid() AND public.get_user_role() IN ('facilitator', 'instructor', 'guru'))
  WITH CHECK (provider_id = auth.uid() AND public.get_user_role() IN ('facilitator', 'instructor', 'guru'));

CREATE POLICY "Creators can delete own courses"
  ON courses FOR DELETE
  TO authenticated
  USING (provider_id = auth.uid() AND public.get_user_role() IN ('facilitator', 'instructor', 'guru'));

-- Course modules: update provider policies
DROP POLICY IF EXISTS "Providers can manage own modules" ON course_modules;

CREATE POLICY "Creators can manage own modules"
  ON course_modules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
      AND courses.provider_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = course_modules.course_id
      AND courses.provider_id = auth.uid()
    )
  );

-- Lessons: update provider policies
DROP POLICY IF EXISTS "Providers can manage own lessons" ON lessons;

CREATE POLICY "Creators can manage own lessons"
  ON lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_modules
      JOIN courses ON courses.id = course_modules.course_id
      WHERE course_modules.id = lessons.module_id
      AND courses.provider_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM course_modules
      JOIN courses ON courses.id = course_modules.course_id
      WHERE course_modules.id = lessons.module_id
      AND courses.provider_id = auth.uid()
    )
  );

-- Enrollments: update provider policy
DROP POLICY IF EXISTS "Providers can view enrollments for own courses" ON enrollments;

CREATE POLICY "Creators can view enrollments for own courses"
  ON enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id
      AND courses.provider_id = auth.uid()
    )
  );

-- Lesson progress: update provider policy
DROP POLICY IF EXISTS "Providers can view progress for own courses" ON lesson_progress;

CREATE POLICY "Creators can view progress for own courses"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = lesson_progress.course_id
      AND courses.provider_id = auth.uid()
    )
  );

-- Certificates: update provider policy
DROP POLICY IF EXISTS "Providers can issue certificates for own courses" ON certificates;

CREATE POLICY "Creators can issue certificates for own courses"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (
    issued_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = certificates.course_id
      AND courses.provider_id = auth.uid()
    )
  );

-- Live events: update provider policies
DROP POLICY IF EXISTS "Providers can read own events" ON live_events;
DROP POLICY IF EXISTS "Providers can insert own events" ON live_events;
DROP POLICY IF EXISTS "Providers can update own events" ON live_events;
DROP POLICY IF EXISTS "Providers can delete own events" ON live_events;

CREATE POLICY "Creators can read own events"
  ON live_events FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Creators can insert own events"
  ON live_events FOR INSERT
  TO authenticated
  WITH CHECK (
    provider_id = auth.uid()
    AND public.get_user_role() IN ('facilitator', 'instructor', 'guru')
  );

CREATE POLICY "Creators can update own events"
  ON live_events FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid() AND public.get_user_role() IN ('facilitator', 'instructor', 'guru'))
  WITH CHECK (provider_id = auth.uid() AND public.get_user_role() IN ('facilitator', 'instructor', 'guru'));

CREATE POLICY "Creators can delete own events"
  ON live_events FOR DELETE
  TO authenticated
  USING (provider_id = auth.uid() AND public.get_user_role() IN ('facilitator', 'instructor', 'guru'));

-- Event registrations: update provider policy
DROP POLICY IF EXISTS "Providers can read registrations for own events" ON event_registrations;

CREATE POLICY "Creators can read registrations for own events"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM live_events
      WHERE live_events.id = event_registrations.event_id
      AND live_events.provider_id = auth.uid()
    )
  );

-- Update admin policies to use 'guru' instead of 'admin'
-- profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Gurus can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (public.get_user_role() = 'guru');

CREATE POLICY "Gurus can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'guru')
  WITH CHECK (public.get_user_role() = 'guru');

-- courses
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;

CREATE POLICY "Gurus can manage all courses"
  ON courses FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'guru')
  WITH CHECK (public.get_user_role() = 'guru');

-- course_modules
DROP POLICY IF EXISTS "Admins can manage all modules" ON course_modules;

CREATE POLICY "Gurus can manage all modules"
  ON course_modules FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'guru')
  WITH CHECK (public.get_user_role() = 'guru');

-- lessons
DROP POLICY IF EXISTS "Admins can manage all lessons" ON lessons;

CREATE POLICY "Gurus can manage all lessons"
  ON lessons FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'guru')
  WITH CHECK (public.get_user_role() = 'guru');

-- enrollments
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON enrollments;

CREATE POLICY "Gurus can manage all enrollments"
  ON enrollments FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'guru')
  WITH CHECK (public.get_user_role() = 'guru');

-- lesson_progress
DROP POLICY IF EXISTS "Admins can manage all progress" ON lesson_progress;

CREATE POLICY "Gurus can manage all progress"
  ON lesson_progress FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'guru')
  WITH CHECK (public.get_user_role() = 'guru');

-- certificates
DROP POLICY IF EXISTS "Admins can manage all certificates" ON certificates;

CREATE POLICY "Gurus can manage all certificates"
  ON certificates FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'guru')
  WITH CHECK (public.get_user_role() = 'guru');

-- live_events
DROP POLICY IF EXISTS "Admins can manage all events" ON live_events;

CREATE POLICY "Gurus can manage all events"
  ON live_events FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'guru')
  WITH CHECK (public.get_user_role() = 'guru');

-- event_registrations
DROP POLICY IF EXISTS "Admins can manage all registrations" ON event_registrations;

CREATE POLICY "Gurus can manage all registrations"
  ON event_registrations FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'guru')
  WITH CHECK (public.get_user_role() = 'guru');

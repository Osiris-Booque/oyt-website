/*
  # Add Admin Role

  ## Summary
  Adds a new 'admin' role to the system, sitting above 'guru' in the hierarchy.
  Admins can manage all programs, users, and content across the platform.

  ## Changes
  1. Updates the `role` column constraint on `profiles` to include 'admin'
  2. Updates all policies that check for elevated roles to include 'admin'
  3. Adds admin-specific RLS policies for full read/write access across key tables

  ## Notes
  - The 'admin' role is the highest privilege level
  - Admins bypass standard ownership checks for programs, enrollments, and profiles
*/

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('member', 'student', 'facilitator', 'instructor', 'guru', 'admin'));

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can read all profiles'
  ) THEN
    CREATE POLICY "Admins can read all profiles"
      ON profiles FOR SELECT
      TO authenticated
      USING (public.get_user_role() = 'admin');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can update all profiles'
  ) THEN
    CREATE POLICY "Admins can update all profiles"
      ON profiles FOR UPDATE
      TO authenticated
      USING (public.get_user_role() = 'admin')
      WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'programs' AND policyname = 'Admins can manage all programs'
  ) THEN
    CREATE POLICY "Admins can manage all programs"
      ON programs FOR ALL
      TO authenticated
      USING (public.get_user_role() = 'admin')
      WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Admins can manage all enrollments'
  ) THEN
    CREATE POLICY "Admins can manage all enrollments"
      ON enrollments FOR ALL
      TO authenticated
      USING (public.get_user_role() = 'admin')
      WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'program_milestones' AND policyname = 'Admins can manage all milestones'
  ) THEN
    CREATE POLICY "Admins can manage all milestones"
      ON program_milestones FOR ALL
      TO authenticated
      USING (public.get_user_role() = 'admin')
      WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'milestone_journal_prompts' AND policyname = 'Admins can manage all prompts'
  ) THEN
    CREATE POLICY "Admins can manage all prompts"
      ON milestone_journal_prompts FOR ALL
      TO authenticated
      USING (public.get_user_role() = 'admin')
      WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'daily_homework_tasks' AND policyname = 'Admins can manage all tasks'
  ) THEN
    CREATE POLICY "Admins can manage all tasks"
      ON daily_homework_tasks FOR ALL
      TO authenticated
      USING (public.get_user_role() = 'admin')
      WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'community_posts' AND policyname = 'Admins can manage all community posts'
  ) THEN
    CREATE POLICY "Admins can manage all community posts"
      ON community_posts FOR ALL
      TO authenticated
      USING (public.get_user_role() = 'admin')
      WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;

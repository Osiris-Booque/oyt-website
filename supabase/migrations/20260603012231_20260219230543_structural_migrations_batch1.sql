/*
  # Structural migrations batch 1
  
  Applies all structural changes needed:
  1. Public read policy on profiles
  2. Preview policies for program content
  3. class_time and class_link columns on milestones
  4. Admin role support + helper function
  5. instructor_id on programs
  6. Instructor messaging helper functions
  7. Admin user management (delete profiles)
  8. roles array on profiles
  9. Simplify to three roles
  10. Instructor enrollment management policies
*/

-- ─── 1. Public read policy on profiles ───────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Authenticated users can read any profile'
  ) THEN
    CREATE POLICY "Authenticated users can read any profile"
      ON profiles FOR SELECT
      TO authenticated
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

-- ─── 2. Preview policies for program content ─────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'program_milestones' AND policyname = 'Authenticated users can preview milestones of published programs'
  ) THEN
    CREATE POLICY "Authenticated users can preview milestones of published programs"
      ON program_milestones FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM programs
          WHERE programs.id = program_milestones.program_id
            AND programs.is_published = true
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'milestone_journal_prompts' AND policyname = 'Authenticated users can preview journal prompts of published programs'
  ) THEN
    CREATE POLICY "Authenticated users can preview journal prompts of published programs"
      ON milestone_journal_prompts FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM program_milestones pm
          JOIN programs p ON p.id = pm.program_id
          WHERE pm.id = milestone_journal_prompts.milestone_id
            AND p.is_published = true
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'daily_homework_tasks' AND policyname = 'Authenticated users can preview homework tasks of published programs'
  ) THEN
    CREATE POLICY "Authenticated users can preview homework tasks of published programs"
      ON daily_homework_tasks FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM programs
          WHERE programs.id = daily_homework_tasks.program_id
            AND programs.is_published = true
        )
      );
  END IF;
END $$;

-- ─── 3. class_time and class_link columns on milestones ───────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_milestones' AND column_name = 'class_time'
  ) THEN
    ALTER TABLE program_milestones ADD COLUMN class_time time;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_milestones' AND column_name = 'class_link'
  ) THEN
    ALTER TABLE program_milestones ADD COLUMN class_link text;
  END IF;
END $$;

-- ─── 4. Admin role + helper function ─────────────────────────────────────────
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
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
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can read all profiles') THEN
    CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT TO authenticated USING (public.get_user_role() = 'admin');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can update all profiles') THEN
    CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE TO authenticated USING (public.get_user_role() = 'admin') WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'programs' AND policyname = 'Admins can manage all programs') THEN
    CREATE POLICY "Admins can manage all programs" ON programs FOR ALL TO authenticated USING (public.get_user_role() = 'admin') WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Admins can manage all enrollments') THEN
    CREATE POLICY "Admins can manage all enrollments" ON enrollments FOR ALL TO authenticated USING (public.get_user_role() = 'admin') WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'program_milestones' AND policyname = 'Admins can manage all milestones') THEN
    CREATE POLICY "Admins can manage all milestones" ON program_milestones FOR ALL TO authenticated USING (public.get_user_role() = 'admin') WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'milestone_journal_prompts' AND policyname = 'Admins can manage all prompts') THEN
    CREATE POLICY "Admins can manage all prompts" ON milestone_journal_prompts FOR ALL TO authenticated USING (public.get_user_role() = 'admin') WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_homework_tasks' AND policyname = 'Admins can manage all tasks') THEN
    CREATE POLICY "Admins can manage all tasks" ON daily_homework_tasks FOR ALL TO authenticated USING (public.get_user_role() = 'admin') WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_posts' AND policyname = 'Admins can manage all community posts') THEN
    CREATE POLICY "Admins can manage all community posts" ON community_posts FOR ALL TO authenticated USING (public.get_user_role() = 'admin') WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;

-- ─── 5. instructor_id on programs ────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'programs' AND column_name = 'instructor_id'
  ) THEN
    ALTER TABLE programs ADD COLUMN instructor_id uuid REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

UPDATE programs SET instructor_id = admin_id WHERE instructor_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_programs_instructor ON programs(instructor_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'programs' AND policyname = 'Instructors can read their assigned programs') THEN
    CREATE POLICY "Instructors can read their assigned programs" ON programs FOR SELECT TO authenticated USING (instructor_id = auth.uid());
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'programs' AND policyname = 'Instructors can update their assigned programs') THEN
    CREATE POLICY "Instructors can update their assigned programs" ON programs FOR UPDATE TO authenticated USING (instructor_id = auth.uid()) WITH CHECK (instructor_id = auth.uid());
  END IF;
END $$;

-- ─── 6. Instructor messaging helper functions ─────────────────────────────────
CREATE OR REPLACE FUNCTION can_instructor_message(instructor_uuid uuid, target_uuid uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF (SELECT role FROM profiles WHERE id = target_uuid) = 'admin' THEN RETURN true; END IF;
  RETURN EXISTS (
    SELECT 1 FROM enrollments e
    JOIN programs p ON p.id = e.program_id
    WHERE p.instructor_id = instructor_uuid AND e.user_id = target_uuid
  );
END;
$$;

CREATE OR REPLACE FUNCTION is_admin_user(user_uuid uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = user_uuid) = 'admin';
END;
$$;

-- ─── 7. Admin can delete profiles ────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can delete profiles') THEN
    CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE TO authenticated USING (public.get_user_role() = 'admin');
  END IF;
END $$;

-- ─── 8. roles array on profiles ──────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'roles'
  ) THEN
    ALTER TABLE profiles ADD COLUMN roles text[] NOT NULL DEFAULT '{}';
  END IF;
END $$;

UPDATE profiles SET roles = ARRAY[role] WHERE roles = '{}' OR roles IS NULL;

-- ─── 9. Simplify to three roles ──────────────────────────────────────────────
UPDATE profiles SET role = CASE role
  WHEN 'student' THEN 'member'
  WHEN 'facilitator' THEN 'member'
  WHEN 'guru' THEN 'admin'
  ELSE role
END WHERE role IN ('student', 'facilitator', 'guru');

UPDATE profiles SET roles = ARRAY(
  SELECT DISTINCT CASE r
    WHEN 'student' THEN 'member'
    WHEN 'facilitator' THEN 'member'
    WHEN 'guru' THEN 'admin'
    ELSE r
  END
  FROM unnest(roles) AS r
  WHERE r IN ('member', 'instructor', 'admin', 'student', 'facilitator', 'guru')
) WHERE roles && ARRAY['student', 'facilitator', 'guru'];

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('member', 'instructor', 'admin'));

-- ─── 10. Instructor enrollment management policies ────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Instructors can insert enrollments for their programs') THEN
    CREATE POLICY "Instructors can insert enrollments for their programs" ON enrollments FOR INSERT TO authenticated
      WITH CHECK (EXISTS (SELECT 1 FROM programs WHERE programs.id = enrollments.program_id AND programs.instructor_id = auth.uid()));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Instructors can delete enrollments for their programs') THEN
    CREATE POLICY "Instructors can delete enrollments for their programs" ON enrollments FOR DELETE TO authenticated
      USING (EXISTS (SELECT 1 FROM programs WHERE programs.id = enrollments.program_id AND programs.instructor_id = auth.uid()));
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Instructors can view enrollments for their programs') THEN
    CREATE POLICY "Instructors can view enrollments for their programs" ON enrollments FOR SELECT TO authenticated
      USING (EXISTS (SELECT 1 FROM programs WHERE programs.id = enrollments.program_id AND programs.instructor_id = auth.uid()));
  END IF;
END $$;

/*
  # Create enrollments, lesson_progress, and certificates tables

  1. New Tables
    - `enrollments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK to profiles)
      - `course_id` (uuid, FK to courses)
      - `enrolled_at` (timestamptz)
      - `status` (text) - active, completed, dropped
      - Unique constraint on (user_id, course_id)

    - `lesson_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK to profiles)
      - `lesson_id` (uuid, FK to lessons)
      - `course_id` (uuid, FK to courses)
      - `completed` (boolean)
      - `completed_at` (timestamptz, nullable)
      - Unique constraint on (user_id, lesson_id)

    - `certificates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, FK to profiles)
      - `course_id` (uuid, FK to courses)
      - `certificate_number` (text, unique)
      - `issued_at` (timestamptz)
      - `issued_by` (uuid, FK to profiles)

  2. Security
    - RLS on all tables
    - Students manage their own enrollments and progress
    - Providers can view enrollments for their courses and issue certificates
    - Admins have full access
*/

CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE (user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own enrollments"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Providers can read enrollments for their courses"
  ON enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = course_id AND courses.provider_id = auth.uid())
  );

CREATE POLICY "Admins can manage all enrollments"
  ON enrollments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Lesson Progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own progress"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Providers can read progress for their courses"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = course_id AND courses.provider_id = auth.uid())
  );

CREATE POLICY "Admins can manage all progress"
  ON lesson_progress FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  issued_by uuid NOT NULL REFERENCES profiles(id)
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Providers can read certificates they issued"
  ON certificates FOR SELECT
  TO authenticated
  USING (issued_by = auth.uid());

CREATE POLICY "Providers can issue certificates for their courses"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = course_id AND courses.provider_id = auth.uid())
  );

CREATE POLICY "Admins can manage all certificates"
  ON certificates FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_course ON lesson_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course ON certificates(course_id);

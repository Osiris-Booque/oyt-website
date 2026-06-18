/*
  # Create courses, course_modules, and lessons tables

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `cover_image_url` (text, nullable)
      - `provider_id` (uuid, FK to profiles)
      - `category` (text) - yoga, breathwork, therapy, wellness
      - `difficulty_level` (text) - beginner, intermediate, advanced
      - `duration_hours` (integer)
      - `is_published` (boolean, default false)
      - `created_at`, `updated_at` (timestamptz)

    - `course_modules`
      - `id` (uuid, primary key)
      - `course_id` (uuid, FK to courses)
      - `title` (text)
      - `description` (text, nullable)
      - `sort_order` (integer)

    - `lessons`
      - `id` (uuid, primary key)
      - `module_id` (uuid, FK to course_modules)
      - `title` (text)
      - `content` (text - markdown/rich text)
      - `video_url` (text, nullable)
      - `duration_minutes` (integer, default 0)
      - `sort_order` (integer)

  2. Security
    - RLS on all three tables
    - Students can read published courses and their modules/lessons
    - Providers can CRUD their own courses/modules/lessons
    - Admins can read and manage all
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  cover_image_url text,
  provider_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'wellness' CHECK (category IN ('yoga', 'breathwork', 'therapy', 'wellness')),
  difficulty_level text NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read published courses"
  ON courses FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Providers can read own courses"
  ON courses FOR SELECT
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Providers can insert own courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (
    provider_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('provider', 'admin')
    )
  );

CREATE POLICY "Providers can update own courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (provider_id = auth.uid())
  WITH CHECK (provider_id = auth.uid());

CREATE POLICY "Providers can delete own courses"
  ON courses FOR DELETE
  TO authenticated
  USING (provider_id = auth.uid());

CREATE POLICY "Admins can manage all courses"
  ON courses FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Course Modules
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read modules of published courses"
  ON course_modules FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = course_id AND (courses.is_published = true OR courses.provider_id = auth.uid()))
  );

CREATE POLICY "Providers can insert modules for own courses"
  ON course_modules FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = course_id AND courses.provider_id = auth.uid())
  );

CREATE POLICY "Providers can update modules for own courses"
  ON course_modules FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM courses WHERE courses.id = course_id AND courses.provider_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM courses WHERE courses.id = course_id AND courses.provider_id = auth.uid()));

CREATE POLICY "Providers can delete modules for own courses"
  ON course_modules FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM courses WHERE courses.id = course_id AND courses.provider_id = auth.uid()));

CREATE POLICY "Admins can manage all modules"
  ON course_modules FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  video_url text,
  duration_minutes integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read lessons of accessible courses"
  ON lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = module_id AND (c.is_published = true OR c.provider_id = auth.uid())
    )
  );

CREATE POLICY "Providers can insert lessons for own courses"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = module_id AND c.provider_id = auth.uid()
    )
  );

CREATE POLICY "Providers can update lessons for own courses"
  ON lessons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = module_id AND c.provider_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = module_id AND c.provider_id = auth.uid()
    )
  );

CREATE POLICY "Providers can delete lessons for own courses"
  ON lessons FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_modules cm
      JOIN courses c ON c.id = cm.course_id
      WHERE cm.id = module_id AND c.provider_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all lessons"
  ON lessons FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS idx_courses_provider ON courses(provider_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_modules_course ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);

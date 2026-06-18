/*
  # Create Program Resources and Assignments

  1. New Tables
    - `program_resources`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to courses)
      - `title` (text)
      - `description` (text)
      - `resource_type` (text) - link, document, video, article
      - `url` (text)
      - `category` (text) - for organizing resources
      - `sort_order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `program_assignments`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key to courses)
      - `title` (text)
      - `description` (text)
      - `instructions` (text)
      - `due_date` (timestamptz, optional)
      - `sort_order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `assignment_submissions`
      - `id` (uuid, primary key)
      - `assignment_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key to profiles)
      - `content` (text) - written response
      - `file_url` (text, optional) - uploaded file
      - `status` (text) - draft, submitted, reviewed, completed
      - `submitted_at` (timestamptz)
      - `reviewed_at` (timestamptz, optional)
      - `feedback` (text, optional)
      - `reviewed_by` (uuid, optional foreign key to profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Members can view resources for programs they're enrolled in
    - Program admins can create/edit resources and assignments
    - Members can only view their own submissions
    - Program admins can view all submissions for their programs
*/

CREATE TABLE IF NOT EXISTS program_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  resource_type text NOT NULL DEFAULT 'link',
  url text,
  category text DEFAULT 'general',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_resource_type CHECK (resource_type IN ('link', 'document', 'video', 'article', 'other'))
);

CREATE TABLE IF NOT EXISTS program_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  instructions text DEFAULT '',
  due_date timestamptz,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES program_assignments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text DEFAULT '',
  file_url text,
  status text DEFAULT 'draft',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  feedback text,
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'submitted', 'reviewed', 'completed')),
  CONSTRAINT unique_user_assignment UNIQUE (assignment_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_program_resources_program ON program_resources(program_id);
CREATE INDEX IF NOT EXISTS idx_program_resources_sort ON program_resources(sort_order);
CREATE INDEX IF NOT EXISTS idx_program_assignments_program ON program_assignments(program_id);
CREATE INDEX IF NOT EXISTS idx_program_assignments_due ON program_assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_user ON assignment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_status ON assignment_submissions(status);

ALTER TABLE program_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled members can view program resources"
  ON program_resources FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = program_resources.program_id
      AND enrollments.user_id = auth.uid()
      AND enrollments.status = 'active'
    )
    OR EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = program_resources.program_id
      AND courses.provider_id = auth.uid()
    )
  );

CREATE POLICY "Program admins can manage resources"
  ON program_resources FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = program_resources.program_id
      AND courses.provider_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = program_resources.program_id
      AND courses.provider_id = auth.uid()
    )
  );

CREATE POLICY "Enrolled members can view program assignments"
  ON program_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = program_assignments.program_id
      AND enrollments.user_id = auth.uid()
      AND enrollments.status = 'active'
    )
    OR EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = program_assignments.program_id
      AND courses.provider_id = auth.uid()
    )
  );

CREATE POLICY "Program admins can manage assignments"
  ON program_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = program_assignments.program_id
      AND courses.provider_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = program_assignments.program_id
      AND courses.provider_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own submissions"
  ON assignment_submissions FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM program_assignments
      JOIN courses ON courses.id = program_assignments.program_id
      WHERE program_assignments.id = assignment_submissions.assignment_id
      AND courses.provider_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own submissions"
  ON assignment_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON assignment_submissions FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM program_assignments
      JOIN courses ON courses.id = program_assignments.program_id
      WHERE program_assignments.id = assignment_submissions.assignment_id
      AND courses.provider_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM program_assignments
      JOIN courses ON courses.id = program_assignments.program_id
      WHERE program_assignments.id = assignment_submissions.assignment_id
      AND courses.provider_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own submissions"
  ON assignment_submissions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

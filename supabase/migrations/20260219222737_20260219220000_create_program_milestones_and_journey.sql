/*
  # Create Program Milestones and Journey Tracking

  ## Overview
  Adds the complete program structure for the 8-week cohort format.

  ## New Tables

  1. `program_milestones` - Represents each of the 4 class dates, each with 2 themes
     - id, program_id, class_number (1-4), theme_number (1-2), title, description, class_date, sort_order

  2. `milestone_journal_prompts` - 3 prompts per theme (24 total)
     - id, milestone_id, prompt_text, sort_order

  3. `daily_homework_tasks` - 7 tasks per day for the days between classes
     - id, program_id, week_number, day_of_week, task_title, task_description, sort_order

  4. `user_journal_responses` - Member responses to journal prompts
     - id, user_id, prompt_id, response_text, created_at, updated_at

  5. `user_task_completions` - Records of completed daily tasks
     - id, user_id, task_id, completed_at

  ## Security
  - RLS enabled on all tables
  - Enrolled users can view milestones, prompts, and tasks
  - Users can only read/write their own responses and completions
*/

-- 1. Program milestones (each class has 2 themes)
CREATE TABLE IF NOT EXISTS program_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  class_number int NOT NULL CHECK (class_number BETWEEN 1 AND 10),
  theme_number int NOT NULL CHECK (theme_number BETWEEN 1 AND 2),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  class_date date,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_program_milestones_program ON program_milestones(program_id);
CREATE INDEX IF NOT EXISTS idx_program_milestones_sort ON program_milestones(program_id, sort_order);

ALTER TABLE program_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users can view milestones"
  ON program_milestones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.program_id = program_milestones.program_id
      AND enrollments.user_id = auth.uid()
      AND enrollments.status = 'active'
    )
  );

-- 2. Journal prompts per milestone
CREATE TABLE IF NOT EXISTS milestone_journal_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id uuid NOT NULL REFERENCES program_milestones(id) ON DELETE CASCADE,
  prompt_text text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_journal_prompts_milestone ON milestone_journal_prompts(milestone_id);

ALTER TABLE milestone_journal_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users can view journal prompts"
  ON milestone_journal_prompts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM program_milestones pm
      JOIN enrollments e ON e.program_id = pm.program_id
      WHERE pm.id = milestone_journal_prompts.milestone_id
      AND e.user_id = auth.uid()
      AND e.status = 'active'
    )
  );

-- 3. Daily homework tasks
CREATE TABLE IF NOT EXISTS daily_homework_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  week_number int NOT NULL CHECK (week_number BETWEEN 1 AND 10),
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  task_title text NOT NULL,
  task_description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_homework_tasks_program ON daily_homework_tasks(program_id);
CREATE INDEX IF NOT EXISTS idx_homework_tasks_week ON daily_homework_tasks(program_id, week_number, day_of_week);

ALTER TABLE daily_homework_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users can view homework tasks"
  ON daily_homework_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.program_id = daily_homework_tasks.program_id
      AND enrollments.user_id = auth.uid()
      AND enrollments.status = 'active'
    )
  );

-- 4. User journal responses
CREATE TABLE IF NOT EXISTS user_journal_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_id uuid NOT NULL REFERENCES milestone_journal_prompts(id) ON DELETE CASCADE,
  response_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, prompt_id)
);

CREATE INDEX IF NOT EXISTS idx_journal_responses_user ON user_journal_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_responses_prompt ON user_journal_responses(prompt_id);

ALTER TABLE user_journal_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal responses"
  ON user_journal_responses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own journal responses"
  ON user_journal_responses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own journal responses"
  ON user_journal_responses FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own journal responses"
  ON user_journal_responses FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 5. User task completions
CREATE TABLE IF NOT EXISTS user_task_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES daily_homework_tasks(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  UNIQUE (user_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_task_completions_user ON user_task_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_task ON user_task_completions(task_id);

ALTER TABLE user_task_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task completions"
  ON user_task_completions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own task completions"
  ON user_task_completions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own task completions"
  ON user_task_completions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

/*
  # Allow authenticated users to preview program content

  ## Problem
  The program detail page shows milestones, journal prompts, and daily homework tasks
  only to enrolled users. This means clicking on a program shows a blank curriculum
  tab for anyone who hasn't enrolled yet, making the page look broken and preventing
  discovery of program content.

  ## Changes

  ### 1. program_milestones
  - Add a new SELECT policy: any authenticated user can read milestones for
    published programs (preview). The existing enrolled-only policy is kept so
    enrolled users still satisfy RLS via either policy.

  ### 2. milestone_journal_prompts
  - Add a new SELECT policy: any authenticated user can read prompts for milestones
    that belong to published programs.

  ### 3. daily_homework_tasks
  - Add a new SELECT policy: any authenticated user can read tasks for published
    programs.

  All three additions use permissive policies, so satisfying either the existing
  enrolled-user policy or the new published-program policy is sufficient for access.
*/

CREATE POLICY "Authenticated users can preview milestones of published programs"
  ON program_milestones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = program_milestones.program_id
        AND programs.is_published = true
    )
  );

CREATE POLICY "Authenticated users can preview journal prompts of published programs"
  ON milestone_journal_prompts
  FOR SELECT
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

CREATE POLICY "Authenticated users can preview homework tasks of published programs"
  ON daily_homework_tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = daily_homework_tasks.program_id
        AND programs.is_published = true
    )
  );

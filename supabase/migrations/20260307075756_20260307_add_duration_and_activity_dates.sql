/*
  # Add duration to milestones and date field to daily activities

  1. Milestone Changes
    - Add `duration_minutes` column to program_milestones for class duration
  
  2. Daily Activity Changes
    - Add `activity_date` column to daily_homework_tasks for specific practice dates
    - Allows preset calculation based on class dates and week/day numbers

  3. Notes
    - duration_minutes defaults to 60 minutes for classes
    - activity_date is nullable to support pre-calculated and manual dates
    - Both columns support the new admin UI functionality
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'program_milestones' AND column_name = 'duration_minutes'
  ) THEN
    ALTER TABLE program_milestones ADD COLUMN duration_minutes INTEGER DEFAULT 60;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_homework_tasks' AND column_name = 'activity_date'
  ) THEN
    ALTER TABLE daily_homework_tasks ADD COLUMN activity_date DATE;
  END IF;
END $$;
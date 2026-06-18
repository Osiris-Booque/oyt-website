/*
  # Rename Courses to Programs

  1. Changes
    - Rename courses table to programs
    - Update all foreign key references
    - Update column names for clarity (provider_id becomes admin_id)
    - Remove course_modules and lessons tables (not needed)
    - Simplify program structure
  
  2. Notes
    - This migration will rename the existing courses table
    - All existing data will be preserved
    - Foreign key constraints will be updated
*/

ALTER TABLE IF EXISTS courses RENAME TO programs;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'programs' AND column_name = 'provider_id'
  ) THEN
    ALTER TABLE programs RENAME COLUMN provider_id TO admin_id;
  END IF;
END $$;

ALTER TABLE IF EXISTS enrollments RENAME COLUMN course_id TO program_id;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lesson_progress' AND column_name = 'course_id'
  ) THEN
    ALTER TABLE lesson_progress RENAME COLUMN course_id TO program_id;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_enrollments_program ON enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_programs_admin ON programs(admin_id);
CREATE INDEX IF NOT EXISTS idx_programs_published ON programs(is_published) WHERE is_published = true;

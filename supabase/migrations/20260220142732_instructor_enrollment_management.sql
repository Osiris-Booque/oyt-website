/*
  # Instructor Enrollment Management

  1. Changes
    - Add INSERT policy so instructors can enroll members in their own programs
    - Add DELETE policy so instructors can unenroll members from their own programs

  2. Security
    - Instructors can only manage enrollments for programs where they are the instructor_id
    - Admins already have full access via existing admin policy
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Instructors can insert enrollments for their programs'
  ) THEN
    CREATE POLICY "Instructors can insert enrollments for their programs"
      ON enrollments FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM programs
          WHERE programs.id = enrollments.program_id
          AND programs.instructor_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Instructors can delete enrollments for their programs'
  ) THEN
    CREATE POLICY "Instructors can delete enrollments for their programs"
      ON enrollments FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM programs
          WHERE programs.id = enrollments.program_id
          AND programs.instructor_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'enrollments' AND policyname = 'Instructors can view enrollments for their programs'
  ) THEN
    CREATE POLICY "Instructors can view enrollments for their programs"
      ON enrollments FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM programs
          WHERE programs.id = enrollments.program_id
          AND programs.instructor_id = auth.uid()
        )
      );
  END IF;
END $$;

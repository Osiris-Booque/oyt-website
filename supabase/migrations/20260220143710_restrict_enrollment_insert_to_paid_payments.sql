/*
  # Restrict enrollment self-insert to paid payments only

  ## Summary
  Removes the open self-insert policy on `enrollments` that allowed any authenticated
  user to enroll themselves in any program without a corresponding payment. Replaces it
  with a policy that requires a `payments` row with `status = 'paid'` for the same
  user + program before an enrollment can be created.

  Admins and instructors bypass this check and can still create enrollments directly
  (e.g., for comped or manual enrollments from the admin panel).

  ## Changes
  - DROP the old "Users can insert own enrollments" policy
  - ADD "Users can self-enroll only after confirmed payment" policy that gates INSERT
    on the existence of a paid payment row

  ## Security
  - Closes the gap that allowed front-end bypasses to create enrollments without payment
  - Admin and instructor insert paths are unchanged (they already have their own policies)
  - The payments table's RLS (created in a previous migration) controls who can write
    payment records, preventing fake payment rows
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'enrollments'
    AND policyname = 'Users can insert own enrollments'
  ) THEN
    DROP POLICY "Users can insert own enrollments" ON enrollments;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'enrollments'
    AND policyname = 'Users can self-enroll only after confirmed payment'
  ) THEN
    CREATE POLICY "Users can self-enroll only after confirmed payment"
      ON enrollments FOR INSERT
      TO authenticated
      WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
          SELECT 1 FROM payments
          WHERE payments.user_id = auth.uid()
          AND payments.program_id = enrollments.program_id
          AND payments.status = 'paid'
        )
      );
  END IF;
END $$;

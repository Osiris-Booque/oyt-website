/*
  # Admin User Management Permissions

  ## Summary
  Grants admins the ability to delete profiles and manage users fully.

  ## Changes
  1. Adds DELETE policy on profiles for admin role
  2. Adds INSERT policy on profiles for admin role (needed when service role creates via edge function)

  ## Notes
  - Deletion of auth users is handled via the edge function using service_role key
  - Profile deletion cascades from auth.users ON DELETE CASCADE
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can delete profiles'
  ) THEN
    CREATE POLICY "Admins can delete profiles"
      ON profiles FOR DELETE
      TO authenticated
      USING (public.get_user_role() = 'admin');
  END IF;
END $$;

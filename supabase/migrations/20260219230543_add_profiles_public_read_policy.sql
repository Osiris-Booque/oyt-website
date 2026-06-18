/*
  # Add public read policy to profiles table

  ## Problem
  The existing RLS policies on profiles only allow users to read their own row.
  This breaks any feature that needs to display another user's name, including:
  - Community post author names
  - Message thread participant names

  ## Changes
  - Add a SELECT policy allowing any authenticated user to read any profile row
  - Names and avatars are not sensitive data and must be readable throughout the app

  ## Security
  - Write access remains restricted to own profile only
  - Only authenticated users can read profiles (not anonymous/public)
*/

CREATE POLICY "Authenticated users can read any profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

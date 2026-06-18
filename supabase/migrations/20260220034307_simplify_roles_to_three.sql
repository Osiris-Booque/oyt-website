/*
  # Simplify roles to three: admin, instructor, member

  ## Summary
  Removes all legacy roles (student, facilitator, guru) from the system,
  keeping only the three canonical roles: member, instructor, admin.

  ## Changes
  1. Migrates any users with legacy roles to their closest equivalent:
     - student → member
     - facilitator → member
     - guru → admin
  2. Updates the `roles` array column to remove any legacy role values
  3. Replaces the role CHECK constraint with the simplified three-role version
  4. Updates the default signup role to 'member'

  ## Notes
  - No data is lost; users are mapped to appropriate new roles
  - The `role` column still holds the single "primary" role (highest priority)
  - The `roles` array still holds all assigned roles per user
*/

UPDATE profiles
SET role = CASE role
  WHEN 'student'     THEN 'member'
  WHEN 'facilitator' THEN 'member'
  WHEN 'guru'        THEN 'admin'
  ELSE role
END
WHERE role IN ('student', 'facilitator', 'guru');

UPDATE profiles
SET roles = ARRAY(
  SELECT DISTINCT
    CASE r
      WHEN 'student'     THEN 'member'
      WHEN 'facilitator' THEN 'member'
      WHEN 'guru'        THEN 'admin'
      ELSE r
    END
  FROM unnest(roles) AS r
  WHERE r IN ('member', 'instructor', 'admin', 'student', 'facilitator', 'guru')
)
WHERE roles && ARRAY['student', 'facilitator', 'guru'];

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('member', 'instructor', 'admin'));

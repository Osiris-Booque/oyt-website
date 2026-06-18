/*
  # Align required_role CHECK constraint with current role system

  1. Changes
    - Drop old `courses_required_role_check` constraint that allowed stale roles (student, facilitator, guru)
    - Add new constraint allowing only the three current roles: member, instructor, admin
    - Update any existing rows with stale role values to 'member'

  2. Notes
    - The role system was simplified to member/instructor/admin in earlier migrations
    - This ensures the programs table stays in sync with the current role system
*/

UPDATE programs
SET required_role = 'member'
WHERE required_role NOT IN ('member', 'instructor', 'admin');

ALTER TABLE programs DROP CONSTRAINT IF EXISTS courses_required_role_check;

ALTER TABLE programs ADD CONSTRAINT programs_required_role_check
  CHECK (required_role = ANY (ARRAY['member'::text, 'instructor'::text, 'admin'::text]));

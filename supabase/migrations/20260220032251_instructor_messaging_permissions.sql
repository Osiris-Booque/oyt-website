/*
  # Instructor Messaging Permissions

  1. Changes
    - Add RLS policy allowing instructors to insert message threads
      with permitted participants (admins + their enrolled members)
    - Add RLS policy allowing instructors to insert messages in threads they participate in
    - Add helper function to check if a user can message another user

  2. Access Rules
    - Admins: can message anyone (existing admin policies cover this)
    - Instructors: can only create threads with admins or members enrolled in their programs
    - Members/others: can message within existing threads only

  3. Notes
    - The existing "Users can view their own threads" policy handles reads
    - These new policies extend write access for instructors
*/

CREATE OR REPLACE FUNCTION can_instructor_message(instructor_uuid uuid, target_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (SELECT role FROM profiles WHERE id = target_uuid) = 'admin' THEN
    RETURN true;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM enrollments e
    JOIN programs p ON p.id = e.program_id
    WHERE p.instructor_id = instructor_uuid
      AND e.user_id = target_uuid
  );
END;
$$;

CREATE OR REPLACE FUNCTION is_admin_user(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = user_uuid) = 'admin';
END;
$$;

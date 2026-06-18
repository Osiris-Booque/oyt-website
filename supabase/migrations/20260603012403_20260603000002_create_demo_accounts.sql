/*
  # Create demo user accounts

  ## Summary
  Creates four demo accounts covering all user roles:
  - Member demo:      member@demo.com       / test1234
  - Instructor demo:  instructor@demo.com   / test1234
  - Admin demo:       admin@demo.com        / test1234
  - Super Admin:      superadmin@osiris.app / MrZigs

  All accounts are email-confirmed and immediately usable.
  UUIDs are fixed so subsequent seed migrations can reference them.
*/

DO $$
DECLARE
  v_member_id     uuid := 'aaaaaaaa-0001-0001-0001-000000000001';
  v_instructor_id uuid := 'aaaaaaaa-0002-0001-0001-000000000001';
  v_admin_id      uuid := 'aaaaaaaa-0003-0001-0001-000000000001';
  v_super_id      uuid := 'aaaaaaaa-0004-0001-0001-000000000001';
BEGIN

  -- ── Auth users ──────────────────────────────────────────────────────────────
  INSERT INTO auth.users (
    id, email, email_confirmed_at,
    encrypted_password,
    raw_user_meta_data,
    created_at, updated_at, aud, role
  ) VALUES
    (
      v_member_id, 'member@demo.com', now(),
      crypt('test1234', gen_salt('bf')),
      '{"first_name":"Alex","last_name":"Rivera"}'::jsonb,
      now(), now(), 'authenticated', 'authenticated'
    ),
    (
      v_instructor_id, 'instructor@demo.com', now(),
      crypt('test1234', gen_salt('bf')),
      '{"first_name":"Sage","last_name":"Rivera"}'::jsonb,
      now(), now(), 'authenticated', 'authenticated'
    ),
    (
      v_admin_id, 'admin@demo.com', now(),
      crypt('test1234', gen_salt('bf')),
      '{"first_name":"Jordan","last_name":"Walsh"}'::jsonb,
      now(), now(), 'authenticated', 'authenticated'
    ),
    (
      v_super_id, 'superadmin@osiris.app', now(),
      crypt('MrZigs', gen_salt('bf')),
      '{"first_name":"Super","last_name":"Admin"}'::jsonb,
      now(), now(), 'authenticated', 'authenticated'
    )
  ON CONFLICT (id) DO NOTHING;

  -- ── Profiles ─────────────────────────────────────────────────────────────────
  INSERT INTO profiles (id, full_name, first_name, last_name, role, roles, bio, headline)
  VALUES
    (
      v_member_id,
      'Alex Rivera',
      'Alex', 'Rivera',
      'member', ARRAY['member'],
      'Wellness seeker exploring yoga, breathwork, and mindfulness as daily medicine.',
      'Member — Flow Into Spring Cohort'
    ),
    (
      v_instructor_id,
      'Sage Rivera',
      'Sage', 'Rivera',
      'instructor', ARRAY['instructor'],
      'Certified yoga therapist and somatic breathwork facilitator with 12+ years guiding transformational wellness programs. Passionate about nervous system healing and integrative movement.',
      'Lead Instructor — Osiris Yoga Therapy'
    ),
    (
      v_admin_id,
      'Jordan Walsh',
      'Jordan', 'Walsh',
      'admin', ARRAY['admin'],
      'Platform administrator and program coordinator at Osiris Yoga Therapy.',
      'Admin — Osiris Yoga Therapy'
    ),
    (
      v_super_id,
      'Super Admin',
      'Super', 'Admin',
      'admin', ARRAY['admin'],
      'Super administrator with full platform access.',
      'Super Admin — Osiris Yoga Therapy'
    )
  ON CONFLICT (id) DO UPDATE SET
    full_name  = EXCLUDED.full_name,
    first_name = EXCLUDED.first_name,
    last_name  = EXCLUDED.last_name,
    role       = EXCLUDED.role,
    roles      = EXCLUDED.roles,
    bio        = EXCLUDED.bio,
    headline   = EXCLUDED.headline;

END $$;

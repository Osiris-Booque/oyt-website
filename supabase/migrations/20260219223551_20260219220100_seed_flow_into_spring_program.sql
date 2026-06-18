/*
  # Seed Flow Into Spring Program

  ## Overview
  Creates the complete "Flow Into Spring" 8-week cohort program with:
  - 1 instructor auth user + profile (Sage Rivera)
  - 8 sample participant auth users + profiles
  - The program record
  - 4 class milestones (every other Sunday starting March 22, 2026)
  - 2 themes per class = 8 theme-milestones total
  - 3 journal prompts per theme = 24 total
  - 7 daily homework tasks per day x 6 days x 4 two-week periods = 168 tasks

  ## Program Schedule
  - Class 1: March 22, 2026
  - Class 2: April 5, 2026
  - Class 3: April 19, 2026
  - Class 4: May 3, 2026
*/

DO $$
DECLARE
  v_cj_id uuid := 'c5c92072-2729-4c28-a7ba-2130670edd2d';
  v_instructor_id uuid := '11111111-0001-0001-0001-000000000001';
  v_u1 uuid := '22222222-0001-0001-0001-000000000001';
  v_u2 uuid := '22222222-0002-0001-0001-000000000001';
  v_u3 uuid := '22222222-0003-0001-0001-000000000001';
  v_u4 uuid := '22222222-0004-0001-0001-000000000001';
  v_u5 uuid := '22222222-0005-0001-0001-000000000001';
  v_u6 uuid := '22222222-0006-0001-0001-000000000001';
  v_u7 uuid := '22222222-0007-0001-0001-000000000001';
  v_u8 uuid := '22222222-0008-0001-0001-000000000001';
  v_program_id uuid;
  v_milestone_id uuid;
BEGIN

  -- =============================================
  -- CREATE AUTH USERS (instructor + 8 participants)
  -- =============================================
  INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role)
  VALUES
    (v_instructor_id, 'sage.rivera@mindfulwellness.app', now(), '{"full_name":"Sage Rivera"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    (v_u1, 'maya.chen@example.com', now(), '{"full_name":"Maya Chen"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    (v_u2, 'jordan.hayes@example.com', now(), '{"full_name":"Jordan Hayes"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    (v_u3, 'priya.sharma@example.com', now(), '{"full_name":"Priya Sharma"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    (v_u4, 'alex.moreno@example.com', now(), '{"full_name":"Alex Moreno"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    (v_u5, 'dana.okafor@example.com', now(), '{"full_name":"Dana Okafor"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    (v_u6, 'sam.nguyen@example.com', now(), '{"full_name":"Sam Nguyen"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    (v_u7, 'riley.brooks@example.com', now(), '{"full_name":"Riley Brooks"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    (v_u8, 'taylor.james@example.com', now(), '{"full_name":"Taylor James"}'::jsonb, now(), now(), 'authenticated', 'authenticated')
  ON CONFLICT (id) DO NOTHING;

  -- =============================================
  -- CREATE PROFILES
  -- =============================================
  INSERT INTO profiles (id, full_name, role, bio)
  VALUES
    (v_instructor_id, 'Sage Rivera', 'instructor', 'Sage Rivera is a certified yoga therapist, somatic breathwork facilitator, and mindfulness coach with over 12 years of experience guiding transformational wellness programs. Sage weaves together movement, breath, and reflective practice to help students reconnect with their innate wisdom and vitality.'),
    (v_u1, 'Maya Chen', 'member', 'Yoga enthusiast and mindfulness practitioner based in Portland. I came to this work after burnout showed me I needed a different way of living.'),
    (v_u2, 'Jordan Hayes', 'member', 'Former athlete learning to listen to my body rather than push through it. Breathwork changed everything for me.'),
    (v_u3, 'Priya Sharma', 'member', 'Therapist by trade, student by heart. Bringing somatic awareness into my personal practice and professional work.'),
    (v_u4, 'Alex Moreno', 'member', 'I found yoga during a difficult season and it quietly became the container for my healing. Grateful to be here.'),
    (v_u5, 'Dana Okafor', 'member', 'Movement teacher and chronic over-thinker on a mission to drop out of my head and into my body. This program found me at the right time.'),
    (v_u6, 'Sam Nguyen', 'member', 'Exploring the intersection of traditional Eastern practices and modern science. Curious, committed, and still learning how to rest.'),
    (v_u7, 'Riley Brooks', 'member', 'Artist and activist who discovered that tending to my own nervous system makes me more effective in the world.'),
    (v_u8, 'Taylor James', 'member', 'New to structured practice, very much not new to the longing for it. Ready to begin.')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    bio = EXCLUDED.bio;

  -- =============================================
  -- CREATE FLOW INTO SPRING PROGRAM
  -- =============================================
  INSERT INTO programs (id, title, slug, description, cover_image_url, admin_id, category, difficulty_level, duration_hours, is_published, required_role)
  VALUES (
    gen_random_uuid(),
    'Flow Into Spring',
    'flow-into-spring',
    'An 8-week transformational cohort program blending yoga, breathwork, and reflective journaling. Meeting every other Sunday, this intimate group experience guides you through seasonal themes of awakening, rooting, flowing, and integrating. Between classes, daily practice tasks keep your momentum alive. All levels welcome.',
    'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800',
    v_cj_id,
    'wellness',
    'beginner',
    16,
    true,
    'member'
  )
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_program_id FROM programs WHERE slug = 'flow-into-spring';

  -- =============================================
  -- ENROLL ALL PARTICIPANTS (CJ + 8 sample users)
  -- =============================================
  INSERT INTO enrollments (user_id, program_id, status)
  VALUES
    (v_cj_id, v_program_id, 'active'),
    (v_u1, v_program_id, 'active'),
    (v_u2, v_program_id, 'active'),
    (v_u3, v_program_id, 'active'),
    (v_u4, v_program_id, 'active'),
    (v_u5, v_program_id, 'active'),
    (v_u6, v_program_id, 'active'),
    (v_u7, v_program_id, 'active'),
    (v_u8, v_program_id, 'active')
  ON CONFLICT DO NOTHING;

  -- =============================================
  -- CLASS 1 — MARCH 22, 2026
  -- =============================================

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order)
  VALUES (gen_random_uuid(), v_program_id, 1, 1,
    'Awakening to Spring Energy',
    'Spring invites us to emerge from the quiet of winter and reconnect with the pulse of new life. In this theme we explore what it means to consciously wake up — to our bodies, our breath, and the season of becoming. Through gentle movement and open-hearted inquiry, we begin to sense what is ready to bloom.',
    '2026-03-22', 1)
  RETURNING id INTO v_milestone_id;

  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'What has been lying dormant in you this winter that feels ready to stir? Describe the first signs of its waking.', 1),
    (v_milestone_id, 'If spring were a message arriving just for you, what would it say? Write it as a letter.', 2),
    (v_milestone_id, 'Where in your body do you feel the most aliveness right now? Where do you feel the most stillness? What does each place want you to know?', 3);

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order)
  VALUES (gen_random_uuid(), v_program_id, 1, 2,
    'Releasing Winter Patterns',
    'Before new growth can fully arrive, we must tend to what we are leaving behind. Winter leaves its mark in our posture, our breath, our habits of thinking. This theme invites honest, compassionate reflection on the patterns that have kept us contracted — and the gentle courage it takes to begin letting them go.',
    '2026-03-22', 2)
  RETURNING id INTO v_milestone_id;

  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'Name one habit, belief, or way of being that served you in winter but no longer serves you now. How does your body feel when you hold onto it?', 1),
    (v_milestone_id, 'What would you need to forgive — in yourself or others — to make more room for spring? What does forgiveness feel like in your body?', 2),
    (v_milestone_id, 'Imagine setting down something heavy you have been carrying. What is it? What do you notice in the moment you put it down?', 3);

  -- =============================================
  -- CLASS 2 — APRIL 5, 2026
  -- =============================================

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order)
  VALUES (gen_random_uuid(), v_program_id, 2, 1,
    'Rooting into Practice',
    'Trees bloom because their roots hold. In this theme we turn our attention downward — to the foundation of our daily practice, the ground of our values, and the steady earth beneath our feet. We explore what it truly means to commit: not through force, but through the quiet power of showing up again and again.',
    '2026-04-05', 3)
  RETURNING id INTO v_milestone_id;

  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'What does it feel like in your body when you are truly grounded? Can you trace a moment from the past two weeks when you felt that way?', 1),
    (v_milestone_id, 'What is your relationship with commitment? Where does it feel expansive, and where does it feel like pressure? What is the difference?', 2),
    (v_milestone_id, 'What value or truth feels most like a root for you right now — something that holds you even when everything else shifts?', 3);

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order)
  VALUES (gen_random_uuid(), v_program_id, 2, 2,
    'Expanding Your Breath',
    'Breath is the bridge between body and mind, between effort and ease. When we expand our breath we expand our capacity — for presence, for feeling, for life itself. This theme dives into the science and poetry of breathing: how small shifts in breath can shift our entire inner landscape.',
    '2026-04-05', 4)
  RETURNING id INTO v_milestone_id;

  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'When did you last notice yourself holding your breath? What was happening? What were you bracing against?', 1),
    (v_milestone_id, 'After this week''s breathwork practice, what emotion or memory surfaced? How did you meet it?', 2),
    (v_milestone_id, 'If your breath could speak, what would it ask of you? What permission is it waiting for?', 3);

  -- =============================================
  -- CLASS 3 — APRIL 19, 2026
  -- =============================================

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order)
  VALUES (gen_random_uuid(), v_program_id, 3, 1,
    'Finding Your Flow',
    'Flow is not something we manufacture — it is something we allow. In this theme we explore the art of moving with life rather than against it: on the mat, in our relationships, and in the current of our days. We practice releasing the grip of control and discovering the intelligence that lives in movement itself.',
    '2026-04-19', 5)
  RETURNING id INTO v_milestone_id;

  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'Describe a time recently when you felt fully in flow — absorbed, effortless, alive. What conditions made that possible?', 1),
    (v_milestone_id, 'Where in your life are you swimming upstream right now? What would it feel like to turn and go with the current instead?', 2),
    (v_milestone_id, 'What does your body need more of to stay in flow? Less of? Be as specific as you can.', 3);

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order)
  VALUES (gen_random_uuid(), v_program_id, 3, 2,
    'Cultivating Presence',
    'Presence is the rarest gift we can offer — to ourselves and to others. In a world that pulls our attention in every direction, learning to be here, fully, is a radical act. This theme draws on somatic awareness, mindful movement, and the practice of simply noticing to help us come home to the only moment that ever truly exists: now.',
    '2026-04-19', 6)
  RETURNING id INTO v_milestone_id;

  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'What most consistently pulls you out of the present moment? Underneath the distraction, what are you avoiding feeling?', 1),
    (v_milestone_id, 'Write about a small ordinary moment from this week that you actually paused to be fully present for. What did you notice?', 2),
    (v_milestone_id, 'What does your fullest, most present self feel like? If that version of you were guiding your days, what would change first?', 3);

  -- =============================================
  -- CLASS 4 — MAY 3, 2026
  -- =============================================

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order)
  VALUES (gen_random_uuid(), v_program_id, 4, 1,
    'Integration and Harvest',
    'Spring''s work is not just to bloom — it is to bear fruit. Integration is the process of weaving what we have learned into the fabric of who we are. In this theme we pause to gather the threads: the insights, the practices, the moments of breakthrough and tenderness. We ask: what have I truly grown into over these eight weeks?',
    '2026-05-03', 7)
  RETURNING id INTO v_milestone_id;

  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'Looking back at your journal entries from the beginning of this program, what surprises you most about how you have changed?', 1),
    (v_milestone_id, 'Name three specific things you learned about yourself — through movement, breath, or reflection — that you want to carry forward.', 2),
    (v_milestone_id, 'What does "integration" mean to you right now? Not as a concept, but as a felt, lived experience in your body and daily life?', 3);

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order)
  VALUES (gen_random_uuid(), v_program_id, 4, 2,
    'Carrying the Practice Forward',
    'Every ending is also a beginning. As we complete our time together, we turn toward the future with intention and tenderness. This theme is about rooting the seeds we have planted so deeply that they continue to grow long after our last Sunday together. We craft our own living practice — not perfect, but ours.',
    '2026-05-03', 8)
  RETURNING id INTO v_milestone_id;

  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'Write a letter to your future self — six months from now. What do you want them to remember about who you became this spring?', 1),
    (v_milestone_id, 'What does your sustainable, nourishing daily practice look like? Describe it in concrete, honest terms — not the ideal, but the real.', 2),
    (v_milestone_id, 'What is the one promise you most want to make to yourself as you step forward from this program? How will you honor it when life gets hard?', 3);

  -- =============================================
  -- DAILY HOMEWORK TASKS — WEEKS 1 & 2 (between Class 1 and Class 2)
  -- =============================================

  -- WEEK 1, Day 1
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 1, 1, 'Morning Body Scan', 'Before getting out of bed, spend 5 minutes scanning your body from feet to crown. Notice areas of tension, warmth, or aliveness without trying to change anything.', 1),
    (v_program_id, 1, 1, 'Sun Salutation x 5', 'Move through 5 slow rounds of Sun Salutation A, synchronizing every movement with your breath. Move as if greeting the season.', 2),
    (v_program_id, 1, 1, 'Awakening Journal Entry', 'Write for 10 minutes on: What one word describes how you are waking up to this season? Let the word become a paragraph.', 3),
    (v_program_id, 1, 1, 'Nadi Shodhana Breath', 'Practice 5 minutes of alternate nostril breathing. Notice the effect on your nervous system and the quality of your thoughts afterward.', 4),
    (v_program_id, 1, 1, 'Nature Observation', 'Step outside for at least 5 minutes and observe one sign of spring — a bud, birdsong, the quality of light. Let it land in your senses without analyzing.', 5),
    (v_program_id, 1, 1, 'Gratitude Triad', 'Name three things you are grateful for today that are directly related to your body and its capacity to move, breathe, and feel.', 6),
    (v_program_id, 1, 1, 'Evening Wind-Down Stretch', 'Spend 10 minutes in a slow, supported forward fold or child''s pose. Let the exhale release the day.', 7);

  -- WEEK 1, Day 2
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 1, 2, 'Breath Awareness Check-In', 'Three times today, pause and take three conscious breaths. Notice where in your body the breath lives — chest, belly, or somewhere else.', 1),
    (v_program_id, 1, 2, 'Hip Opening Sequence', 'Move through a 15-minute hip-focused sequence: low lunge, pigeon, reclined butterfly. These areas hold where we resist change.', 2),
    (v_program_id, 1, 2, 'Release Writing', 'Write for 10 minutes on: What are you still holding from winter that wants to thaw? Be honest and specific.', 3),
    (v_program_id, 1, 2, '4-7-8 Breath Practice', 'Practice the 4-7-8 breath cycle (inhale 4, hold 7, exhale 8) for 4 rounds before a meal. Notice how it affects your presence.', 4),
    (v_program_id, 1, 2, 'Mindful Eating Practice', 'Choose one meal today to eat in silence, without a screen. Notice flavors, textures, and the feeling of nourishment.', 5),
    (v_program_id, 1, 2, 'Affirmation Setting', 'Write one affirmation that speaks directly to what you are releasing. Place it somewhere you will see it tomorrow morning.', 6),
    (v_program_id, 1, 2, 'Legs Up the Wall', 'Spend 10 minutes in Viparita Karani (legs up the wall). This gentle inversion helps reverse the heaviness of the day.', 7);

  -- WEEK 1, Day 3
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 1, 3, 'Morning Mantra Walk', 'Take a 10-minute walk while silently repeating a mantra of your choice with each step. Suggestions: "I am here," "I am open," or "I receive."', 1),
    (v_program_id, 1, 3, 'Heart-Opening Flow', 'Practice a 20-minute backbend-focused sequence: bridge, camel, supported fish. Notice what emotions arise as your chest opens.', 2),
    (v_program_id, 1, 3, 'Midweek Reflection', 'Write for 10 minutes: How is your body feeling three days into the program? Where are you meeting resistance?', 3),
    (v_program_id, 1, 3, 'Box Breathing', 'Set a timer and practice box breathing (4 counts each side) for 5 minutes. Use it as a reset between any two activities today.', 4),
    (v_program_id, 1, 3, 'Digital Rest Period', 'Take a 30-minute break from all screens. Use the time to sit quietly, move, or simply observe your surroundings.', 5),
    (v_program_id, 1, 3, 'Cohort Connection', 'Send a short message to one person in the program cohort — a check-in or something from today''s practice.', 6),
    (v_program_id, 1, 3, 'Yin Hold: Sleeping Swan', 'Hold sleeping swan (pigeon) for 3 minutes each side before bed. Breathe into the sensation without forcing.', 7);

  -- WEEK 1, Day 4
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 1, 4, 'Cold Water Wake-Up', 'Begin your morning by splashing cold water on your face three times. Notice the instant awakening. Let it symbolize your commitment to showing up.', 1),
    (v_program_id, 1, 4, 'Balance Sequence', 'Practice a 20-minute standing sequence focusing on balance: tree, warrior III, half-moon. Notice your relationship with steadiness and wobble.', 2),
    (v_program_id, 1, 4, 'Shadow Writing', 'Write for 10 minutes on: What part of yourself have you been judging most harshly? What would happen if you offered it compassion instead?', 3),
    (v_program_id, 1, 4, 'Wim Hof Round', 'Practice one round of Wim Hof breathing (30 power breaths, retain, recovery breath). Seated only, never near water.', 4),
    (v_program_id, 1, 4, 'Grounding Outdoors', 'If possible, stand or sit barefoot on earth or grass for 5 minutes. Notice the sensation of contact. Breathe into your feet.', 5),
    (v_program_id, 1, 4, 'Values Inventory', 'List your top five values as they stand today. Which one feels most alive this week?', 6),
    (v_program_id, 1, 4, 'Savasana as Practice', 'Lie in Savasana for a full 10 minutes — not as the end of a practice, but as the practice itself. This is an act of trust.', 7);

  -- WEEK 1, Day 5
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 1, 5, 'Kapalabhati Morning', 'Practice 2 minutes of Kapalabhati breath to energize and clear. Follow with 2 minutes of natural breath observation.', 1),
    (v_program_id, 1, 5, 'Continuous Flow', 'Practice a continuous 25-minute vinyasa flow without pausing. Allow the transitions to become part of the practice, not just the poses.', 2),
    (v_program_id, 1, 5, 'End-of-Week Journal', 'Write for 15 minutes: What has this first week revealed about your readiness for change? What surprised you?', 3),
    (v_program_id, 1, 5, 'Coherent Breathing', 'Practice 10 minutes of coherent breathing at 5 breaths per minute (inhale 6, exhale 6). Use a timer.', 4),
    (v_program_id, 1, 5, 'Nourishing Meal', 'Cook or prepare at least one meal today with the intention of nourishing your practice body. Choose foods that feel alive and grounding.', 5),
    (v_program_id, 1, 5, 'Revisit Your Release', 'Return to what you wrote on Day 2 about releasing. Has anything shifted? Add a paragraph of reflection.', 6),
    (v_program_id, 1, 5, 'Rest Without Guilt', 'Schedule at least one hour of genuine rest today — no productivity, no content consumption. Just rest.', 7);

  -- WEEK 1, Day 6
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 1, 6, 'Sky Witness', 'Watch or imagine the morning sky for 5 minutes. Let your breath match its expansiveness.', 1),
    (v_program_id, 1, 6, 'Restorative Practice', 'Practice a full 30-minute restorative sequence: supported bridge, reclined butterfly, legs up the wall. Use props.', 2),
    (v_program_id, 1, 6, 'Pre-Class Intention', 'Write your intention for tomorrow''s class. What do you want to bring? What do you want to receive?', 3),
    (v_program_id, 1, 6, 'Extended Exhale Breath', 'Practice breathing with a 1:2 inhale-to-exhale ratio for 10 minutes. This activates the parasympathetic nervous system.', 4),
    (v_program_id, 1, 6, 'Body Gratitude Practice', 'Speak or write a statement of gratitude to five different parts of your body. Be specific. Thank them for their work this week.', 5),
    (v_program_id, 1, 6, 'Journal Review', 'Read back through everything you wrote this week. Underline or star anything that surprises, moves, or challenges you.', 6),
    (v_program_id, 1, 6, 'Early to Bed', 'Commit to sleeping at least 30 minutes earlier than usual tonight to arrive at tomorrow''s class restored.', 7);

  -- WEEK 2, Day 1
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 2, 1, 'Root Chakra Activation', 'Practice 5 minutes of standing with feet firmly planted, knees slightly bent. Feel the weight drop through your heels into the earth.', 1),
    (v_program_id, 2, 1, 'Grounding Sequence', 'Move through a 20-minute sequence of standing poses focused on stability: mountain, warrior I, warrior II, goddess.', 2),
    (v_program_id, 2, 1, 'Commitment Journal', 'Write for 10 minutes: What does your commitment to this practice look like today — not in ideal conditions but in real ones?', 3),
    (v_program_id, 2, 1, 'Diaphragmatic Breath Check', 'Place one hand on your chest and one on your belly. Breathe for 5 minutes ensuring only the belly hand rises.', 4),
    (v_program_id, 2, 1, 'Hydration Intention', 'Drink 8 glasses of water today with full awareness. With each glass, breathe once and notice the body receiving nourishment.', 5),
    (v_program_id, 2, 1, 'Roots Visualization', 'Spend 10 minutes in meditation visualizing roots growing from the soles of your feet deep into the earth. What do they anchor you to?', 6),
    (v_program_id, 2, 1, 'Dragon Pose Yin', 'Hold dragon pose (low lunge) for 3 minutes each side. Breathe into the hip flexors and notice what releases.', 7);

  -- WEEK 2, Day 2
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 2, 2, 'Three-Part Breath', 'Lie down and practice three-part breath (belly, ribs, chest) for 10 minutes. Notice how much more space exists than you usually access.', 1),
    (v_program_id, 2, 2, 'Core & Breath Flow', 'Practice a 20-minute core-focused sequence: boat, plank variations, navasana. Notice how core engagement affects your breath.', 2),
    (v_program_id, 2, 2, 'Letter to Your Breath', 'Write a letter to your breath. What have you discovered about it this week? What do you want your relationship with it to become?', 3),
    (v_program_id, 2, 2, 'Bhramari (Humming Bee)', 'Practice humming breath for 5 minutes. Feel the vibration in your skull, chest, and throat. Notice how it affects your mood.', 4),
    (v_program_id, 2, 2, 'Compassionate Confrontation', 'Identify one difficult situation you have been avoiding. Write about what breath and presence you would need to meet it.', 5),
    (v_program_id, 2, 2, 'Movement Medicine', 'Put on one song you love and move freely for its duration. No choreography. Let your breath lead your body.', 6),
    (v_program_id, 2, 2, 'Breath Count to Sleep', 'As you fall asleep, count your exhales backward from 50. Notice if you reach 1.', 7);

  -- WEEK 2, Day 3
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 2, 3, 'Morning Shake', 'Spend 3 minutes shaking your entire body — hands, arms, legs, head. A somatic technique for releasing held tension.', 1),
    (v_program_id, 2, 3, 'Spinal Wave Sequence', 'Practice a 20-minute sequence focused on spinal movement: cat/cow, thread the needle, seated twist. The spine is the highway of breath.', 2),
    (v_program_id, 2, 3, 'Midpoint Check-In', 'Write for 10 minutes: You are halfway through the program. What has landed? What are you still waiting for?', 3),
    (v_program_id, 2, 3, 'Sitali Cooling Breath', 'Practice sitali breath (inhale through a curled tongue) for 5 minutes. Notice its cooling, calming effect on the nervous system.', 4),
    (v_program_id, 2, 3, 'Media Detox Day', 'Spend today without news, social media, or entertainment media. Notice what arises in the space.', 5),
    (v_program_id, 2, 3, 'Deep Peer Connection', 'Reach out to one cohort member today for a real conversation — share something meaningful from your practice this week.', 6),
    (v_program_id, 2, 3, 'Restorative Spinal Twist', 'Spend 5 minutes in each side of a supported reclining twist before bed. Let the exhale spiral tension out of your spine.', 7);

  -- WEEK 2, Day 4
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 2, 4, 'Morning Pages', 'Write 3 pages of unfiltered stream-of-consciousness immediately upon waking, before checking any device.', 1),
    (v_program_id, 2, 4, 'Shoulder & Neck Release', 'Practice a 15-minute shoulder and neck release sequence. These areas hold unexpressed words and unfelt grief.', 2),
    (v_program_id, 2, 4, 'Fear Inventory', 'Write about one fear that has shown up during this program. What is it protecting you from? What would happen if you faced it?', 3),
    (v_program_id, 2, 4, 'Breath Retention Practice', 'After a full inhale, hold your breath gently for 5-10 seconds before exhaling. Repeat 10 times. Notice the pause between worlds.', 4),
    (v_program_id, 2, 4, 'Acts of Nourishment', 'Do three acts of genuine self-nourishment today — not productivity, but true care. They can be small.', 5),
    (v_program_id, 2, 4, 'Obstacle Strategy', 'Identify what gets in the way of your daily practice most consistently. Write one concrete strategy for meeting that obstacle.', 6),
    (v_program_id, 2, 4, 'Yoga Nidra', 'Listen to a 20-minute yoga nidra (yogic sleep) recording before bed. This is one of the most deeply restorative practices available.', 7);

  -- WEEK 2, Day 5
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 2, 5, 'Five Senses Wake-Up', 'Upon waking, name one thing you notice for each of your five senses before moving. Let the world arrive slowly.', 1),
    (v_program_id, 2, 5, 'Self-Led Practice', 'Complete a 30-minute self-led practice today using only what you remember from the classes so far. Trust your own body knowledge.', 2),
    (v_program_id, 2, 5, 'Integration Write', 'Write for 15 minutes about how the practices of this week are beginning to integrate into your daily life. What is becoming natural?', 3),
    (v_program_id, 2, 5, 'Toning Practice', 'Hum, sing, or tone for 5 minutes today. Do it alone, with full permission to sound imperfect and free.', 4),
    (v_program_id, 2, 5, 'Body Mapping', 'Draw a simple outline of a human body and mark where you have felt the program most in your physical body this week. Label each area.', 5),
    (v_program_id, 2, 5, 'Gratitude Including Difficulty', 'Write or speak five specific gratitudes for today — at least two must be about something that was hard.', 6),
    (v_program_id, 2, 5, 'Wind-Down Ritual Design', 'Create a simple 15-minute wind-down ritual for tonight that you could realistically repeat every night.', 7);

  -- WEEK 2, Day 6
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 2, 6, 'Pre-Class Breathwork', 'Practice 10 minutes of your favorite breathwork technique from this program in preparation for today''s class.', 1),
    (v_program_id, 2, 6, 'Gentle Arrival Practice', 'Move through a gentle 20-minute full-body sequence to open and arrive in your body before class.', 2),
    (v_program_id, 2, 6, 'Class Intention Writing', 'Write your intention for today''s class. What have you been sitting with this week that you want to bring into the room?', 3),
    (v_program_id, 2, 6, 'Intentional Silence', 'Spend 20 minutes in intentional silence — no speaking, no devices. Just be.', 4),
    (v_program_id, 2, 6, 'Acknowledgment Letter', 'Write a one-paragraph acknowledgment of yourself for showing up consistently these past two weeks. Mean every word.', 5),
    (v_program_id, 2, 6, 'Community Board Check', 'Read and respond to at least one post in the program community board today.', 6),
    (v_program_id, 2, 6, 'Light Meal & Rest', 'Eat lightly before class and honor any rest impulse. Arriving unrushed and nourished is part of the practice.', 7);

  -- WEEK 3, Day 1
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 3, 1, 'Flow State Inventory', 'Before rising, recall a recent moment of flow. What were the conditions? Can you create even one of them today?', 1),
    (v_program_id, 3, 1, 'Unscripted Movement', 'Set a timer for 20 minutes and move with no plan. Follow curiosity and sensation. No sequence, no poses — just movement.', 2),
    (v_program_id, 3, 1, 'Flow vs. Force Journal', 'Write for 10 minutes: Where in your life do you force vs. flow? What does each feel like in your body?', 3),
    (v_program_id, 3, 1, 'Breath Pacing', 'For one hour today, intentionally slow your breath to 6 breaths per minute. Notice how it affects your pace and decisions.', 4),
    (v_program_id, 3, 1, 'Single-Tasking', 'Choose three tasks today to do with complete, single-pointed attention. No switching. Notice the quality of your presence.', 5),
    (v_program_id, 3, 1, 'Upstream Inquiry', 'Identify one area where you are working hard but getting nowhere. Write honestly about why you are swimming upstream there.', 6),
    (v_program_id, 3, 1, 'Progressive Muscle Relaxation', 'Before sleep, tense and release each muscle group from feet to crown. Spend 15 minutes in this practice.', 7);

  -- WEEK 3, Day 2
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 3, 2, 'Presence Bell', 'Set an alarm every 90 minutes today. When it rings, pause for one full minute of complete presence before continuing.', 1),
    (v_program_id, 3, 2, 'Balance & Steadiness Practice', 'Practice 20 minutes of balance-focused yoga: tree, eagle, warrior III. Notice how your breath affects your stability.', 2),
    (v_program_id, 3, 2, 'Distraction Map', 'Write for 10 minutes mapping what pulls you out of presence most reliably. Beneath each distraction, what feeling lies?', 3),
    (v_program_id, 3, 2, 'Breath as Anchor', 'Practice using three conscious breaths as a presence anchor during any difficult conversation or task today.', 4),
    (v_program_id, 3, 2, 'Present-Moment Observation', 'Spend 10 minutes sitting quietly and writing only about what you can directly observe with your senses in this moment.', 5),
    (v_program_id, 3, 2, 'Phone-Free Morning', 'Do not look at your phone until after your morning practice is complete. Notice how this changes the quality of your morning.', 6),
    (v_program_id, 3, 2, 'Presence Sleep Meditation', 'Listen to a body-scan or presence-focused sleep meditation tonight.', 7);

  -- WEEK 3, Day 3
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 3, 3, 'Joy Cataloguing', 'Before practice today, list 10 things that brought you joy this week. Include at least two that are very small.', 1),
    (v_program_id, 3, 3, 'Playful Practice', 'Your yoga practice today should feel playful. Try something you''ve never done. Fall out of a pose. Laugh.', 2),
    (v_program_id, 3, 3, 'Midprogram Reflection', 'Write for 15 minutes: Who were you at the start of this program? Who are you now? What is the distance between them?', 3),
    (v_program_id, 3, 3, 'Sound Bath or Music Meditation', 'Sit with calming music or sounds for 10 minutes. Let the vibration settle your nervous system.', 4),
    (v_program_id, 3, 3, 'Sensory Nature Walk', 'Take a 20-minute walk in nature with no headphones. Be present to the sensory world around you.', 5),
    (v_program_id, 3, 3, 'Letter of Self-Compassion', 'Write a compassionate letter to yourself about a mistake or regret from the past. As if writing to a dear friend.', 6),
    (v_program_id, 3, 3, 'Legs Up the Wall', 'Spend 5 minutes in supported shoulderstand or legs up the wall. Let gravity reverse the day''s heaviness.', 7);

  -- WEEK 3, Day 4
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 3, 4, 'Morning Vow', 'State your practice intention for today aloud before you begin. Let your voice carry the commitment.', 1),
    (v_program_id, 3, 4, 'Upper Body Opening', 'Practice a 20-minute shoulder, chest, and throat-opening sequence. Notice what becomes possible when this space opens.', 2),
    (v_program_id, 3, 4, 'Full Presence Experiment', 'For one conversation today, give complete undivided presence. No planning your response. Just listen. Write about what you noticed.', 3),
    (v_program_id, 3, 4, 'Extended Sitali Breath', 'Practice sitali or sitkari breath for 10 minutes during the hottest or most stressful part of your day.', 4),
    (v_program_id, 3, 4, 'Analog Activity', 'Spend 30 minutes doing something completely analog: drawing, cooking from scratch, handwriting a letter. Be fully in it.', 5),
    (v_program_id, 3, 4, 'Energy Mapping', 'Draw a simple graph of your energy levels throughout yesterday. What patterns do you see? What do they tell you?', 6),
    (v_program_id, 3, 4, 'Hip & Hamstring Yin', 'Hold wide-legged forward fold and double pigeon for 3 minutes each before bed.', 7);

  -- WEEK 3, Day 5
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 3, 5, 'Extended Coherent Breathing', 'Practice 15 minutes of coherent breathing (6-second inhale, 6-second exhale) first thing this morning.', 1),
    (v_program_id, 3, 5, 'Impulse-Led Practice', 'Practice yoga for 25 minutes using only what your body asks for. Begin seated and follow each impulse.', 2),
    (v_program_id, 3, 5, 'Gratitude for Difficulty', 'Write for 10 minutes about something that has been hard in this program and what it has taught you. Find the gift.', 3),
    (v_program_id, 3, 5, 'Extended Nadi Shodhana', 'Practice 10 minutes of alternate nostril breathing. Begin and end with 5 natural breaths of observation.', 4),
    (v_program_id, 3, 5, 'Values Revisit', 'Return to your values list from Week 1. Have any shifted? Which value feels most active in your life right now?', 5),
    (v_program_id, 3, 5, 'Giving Practice', 'Do something kind today purely for another person, without expecting anything back. Notice how it feels in your body.', 6),
    (v_program_id, 3, 5, 'Yoga Nidra with Sankalpa', 'Practice a 25-minute yoga nidra tonight. Set a sankalpa (seed intention) before you begin.', 7);

  -- WEEK 3, Day 6
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 3, 6, 'Anticipatory Journaling', 'Write about what you are looking forward to in today''s class and what you are willing to be surprised by.', 1),
    (v_program_id, 3, 6, 'Slow Morning', 'Give yourself a full hour of unhurried morning before any obligations begin.', 2),
    (v_program_id, 3, 6, 'Week Completion Review', 'Look back at your homework this week. Is there anything you skipped that wants your attention before class today?', 3),
    (v_program_id, 3, 6, 'Favorite Pranayama', 'Practice your personal favorite breathwork technique for 10 minutes. Honor what your body has come to love.', 4),
    (v_program_id, 3, 6, 'Community Gratitude Post', 'Post a brief message of appreciation in the program community for something you have received from this cohort.', 5),
    (v_program_id, 3, 6, 'Warm Body Arrival', 'Move gently for 15 minutes before class. A slow walk, easy stretching, or gentle flow. Arrive with a warm body.', 6),
    (v_program_id, 3, 6, 'Arrive Early', 'Commit to arriving to class 10 minutes early. Use the time to breathe and set an intention.', 7);

  -- WEEK 4, Day 1
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 4, 1, 'Expanding Awareness Practice', 'Begin your morning by consciously expanding your awareness outward in concentric circles: body, room, building, neighborhood, sky.', 1),
    (v_program_id, 4, 1, 'Inversion Sequence', 'Practice a 20-minute sequence building to a supported inversion — headstand prep, shoulder stand, or legs up the wall.', 2),
    (v_program_id, 4, 1, 'Presence Cost Journal', 'Write for 10 minutes: What has been the cost of your habitual absence? What have you missed by not being fully present?', 3),
    (v_program_id, 4, 1, 'Midday Box Breathing', 'Practice box breathing for 10 minutes (6 counts each side) as a midday reset.', 4),
    (v_program_id, 4, 1, 'Device Boundary', 'Establish one concrete device boundary for this week — no phone at meals, or after 9pm. Hold it for seven days.', 5),
    (v_program_id, 4, 1, 'Beginner''s Mind', 'Choose one daily activity to do today as if for the first time. A shower, a meal, a conversation. Notice everything.', 6),
    (v_program_id, 4, 1, 'Candlelight Savasana', 'Practice savasana by candlelight tonight for 15 minutes. Let the soft light and your breath be the only things that exist.', 7);

  -- WEEK 4, Day 2
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 4, 2, 'Throat Chakra Awakening', 'Hum three different notes this morning, feeling the resonance in your chest, throat, and skull. Which note feels most true today?', 1),
    (v_program_id, 4, 2, 'Twist & Detox Flow', 'Practice a 20-minute sequence focused on twists: seated spinal twist, prayer twist, supine twist. Twists wring out what we no longer need.', 2),
    (v_program_id, 4, 2, 'Authenticity Inquiry', 'Write for 10 minutes: Where in your life are you performing rather than being? What would full authenticity require of you?', 3),
    (v_program_id, 4, 2, 'Breath Counting Meditation', 'Practice breath counting meditation: count each exhale from 1 to 10, then restart. Do this for 15 minutes.', 4),
    (v_program_id, 4, 2, 'Creative Expression', 'Express something from your practice this week through a medium that is not writing: drawing, music, movement, cooking.', 5),
    (v_program_id, 4, 2, 'Mirror Practice', 'Look at your own eyes in a mirror for one full minute. No fixing, no judging. Just witnessing. Write about what you noticed.', 6),
    (v_program_id, 4, 2, 'Loving Kindness Before Sleep', 'Practice a 10-minute metta (loving-kindness) meditation before sleep, beginning with yourself then expanding outward.', 7);

  -- WEEK 4, Day 3
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 4, 3, 'Gratitude Walk', 'Take a 15-minute gratitude walk, silently naming something you are grateful for with each step.', 1),
    (v_program_id, 4, 3, 'Deep Core Practice', 'Practice a 20-minute sequence focused on the deep core and pelvic floor: mulabandha engagement, slow boat holds, supported plank.', 2),
    (v_program_id, 4, 3, 'Service Reflection', 'Write for 10 minutes: How has this practice changed the quality of your presence for others? Where do you want to offer more?', 3),
    (v_program_id, 4, 3, 'One-Minute Breath', 'Practice the 1-minute breath: inhale for 20 seconds, hold for 20 seconds, exhale for 20 seconds. Repeat 3 times.', 4),
    (v_program_id, 4, 3, 'Declutter One Space', 'Clear one small physical space today — a drawer, a corner, a shelf. Notice how outer order affects inner ease.', 5),
    (v_program_id, 4, 3, 'Note to Your Teacher', 'Write a brief note of appreciation to Sage or any teacher who has influenced your practice. Send it or keep it.', 6),
    (v_program_id, 4, 3, 'Final Yin Session', 'Hold three yin poses for 4 minutes each tonight. Let the stillness be productive in its own way.', 7);

  -- WEEK 4, Day 4
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 4, 4, 'Dawn Presence Intention', 'Set an intention before dawn (or before your day begins) that is about quality of presence rather than productivity.', 1),
    (v_program_id, 4, 4, 'Power Vinyasa', 'Practice a strong, continuous 30-minute vinyasa. Push into your edge while keeping the breath fluid.', 2),
    (v_program_id, 4, 4, 'Integration Journal', 'Write for 15 minutes about everything this 8-week program has given you so far. Be generous in your accounting.', 3),
    (v_program_id, 4, 4, 'Extended Bhramari', 'Practice bhramari for 10 minutes. Each round, let the hum get longer as your breath capacity expands.', 4),
    (v_program_id, 4, 4, 'Digital Sunset', 'End all screen time 90 minutes before bed today. Use the evening for reflection, reading, or quiet movement.', 5),
    (v_program_id, 4, 4, 'Peak Pose Dedication', 'Choose one pose from this program that has challenged you most. Practice it with full attention. Dedicate the practice to someone.', 6),
    (v_program_id, 4, 4, 'Heart Hand Ritual', 'Before sleep, place your hands on your heart and silently thank your body for everything it has done and endured.', 7);

  -- WEEK 4, Day 5
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 4, 5, 'Open Awareness Meditation', 'Sit for 15 minutes with open awareness — no object of focus, just pure presence to whatever arises and passes.', 1),
    (v_program_id, 4, 5, 'Your Harvest Sequence', 'Create your own 20-minute yoga sequence today using poses and transitions that have meant the most to you in this program.', 2),
    (v_program_id, 4, 5, 'Pre-Final Class Journal', 'Write for 15 minutes: What do you most want to take from this program into the rest of your life?', 3),
    (v_program_id, 4, 5, 'Full Pranayama Session', 'Practice a complete 20-minute pranayama session: kapalabhati, nadi shodhana, bhramari, samavritti. Your full toolkit.', 4),
    (v_program_id, 4, 5, 'Service Offering', 'Do something today in service to someone else with your full, undivided presence. No expectation of acknowledgment.', 5),
    (v_program_id, 4, 5, 'Vision Statement', 'Write a single powerful sentence that captures the person you have grown into over these eight weeks.', 6),
    (v_program_id, 4, 5, 'Savasana as Ceremony', 'Practice savasana for 20 minutes as a ceremony of completion. Play music that moves you. Let this one count.', 7);

  -- WEEK 4, Day 6
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id, 4, 6, 'Final Morning Practice', 'Practice your complete personal morning routine — everything you''ve built over these eight weeks — one final time before class.', 1),
    (v_program_id, 4, 6, 'Seal Your Letter Forward', 'Write your letter to your future self and commit to opening it in six months. Seal it.', 2),
    (v_program_id, 4, 6, 'Closing Class Intention', 'Write your intention for today''s final class. What do you want to feel? What do you want to give to this last gathering?', 3),
    (v_program_id, 4, 6, 'Completion Breath', 'Breathe through the 4-7-8 cycle 8 times as a ritual of completion. With each exhale, release something from this season.', 4),
    (v_program_id, 4, 6, 'Community Closing Post', 'Write a final post in the program community — your reflection, your gratitude, a word for your fellow travelers.', 5),
    (v_program_id, 4, 6, 'Celebration Meal', 'Prepare or choose a meal that feels like a celebration. Eat it slowly, with full attention and joy.', 6),
    (v_program_id, 4, 6, 'Arrive With Your Whole Self', 'Come to class having brought nothing left undone. This last day is for being fully present, not for catching up.', 7);

END $$;

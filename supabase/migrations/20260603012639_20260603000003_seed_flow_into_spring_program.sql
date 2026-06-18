/*
  # Seed Flow Into Spring program data

  ## Overview
  Seeds the complete "Flow Into Spring" 8-week cohort program using the demo
  instructor account (instructor@demo.com) as the program owner. Includes:
  - Program record
  - 8 milestone themes (2 per class × 4 classes)
  - 24 journal prompts (3 per milestone)
  - 168 daily homework tasks (7 per day × 6 days × 4 weeks)
  - Enrollment of member@demo.com + 8 sample participants

  ## Prerequisites
  - Demo accounts migration must have run (instructor id: aaaaaaaa-0002-...)
  - Sample participant auth users created inline here
*/

DO $$
DECLARE
  v_instructor_id uuid := 'aaaaaaaa-0002-0001-0001-000000000001';
  v_member_id     uuid := 'aaaaaaaa-0001-0001-0001-000000000001';
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

  -- ── Sample participant auth users ────────────────────────────────────────────
  INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data, created_at, updated_at, aud, role)
  VALUES
    (v_u1, 'maya.chen@example.com',   now(), '{"first_name":"Maya","last_name":"Chen"}'::jsonb,   now(), now(), 'authenticated', 'authenticated'),
    (v_u2, 'jordan.hayes@example.com',now(), '{"first_name":"Jordan","last_name":"Hayes"}'::jsonb,now(), now(), 'authenticated', 'authenticated'),
    (v_u3, 'priya.sharma@example.com',now(), '{"first_name":"Priya","last_name":"Sharma"}'::jsonb,now(), now(), 'authenticated', 'authenticated'),
    (v_u4, 'alex.moreno@example.com', now(), '{"first_name":"Alex","last_name":"Moreno"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    (v_u5, 'dana.okafor@example.com', now(), '{"first_name":"Dana","last_name":"Okafor"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),
    (v_u6, 'sam.nguyen@example.com',  now(), '{"first_name":"Sam","last_name":"Nguyen"}'::jsonb,  now(), now(), 'authenticated', 'authenticated'),
    (v_u7, 'riley.brooks@example.com',now(), '{"first_name":"Riley","last_name":"Brooks"}'::jsonb,now(), now(), 'authenticated', 'authenticated'),
    (v_u8, 'taylor.james@example.com',now(), '{"first_name":"Taylor","last_name":"James"}'::jsonb,now(), now(), 'authenticated', 'authenticated')
  ON CONFLICT (id) DO NOTHING;

  -- ── Sample participant profiles ───────────────────────────────────────────────
  INSERT INTO profiles (id, full_name, first_name, last_name, role, roles, bio)
  VALUES
    (v_u1, 'Maya Chen',   'Maya',   'Chen',   'member', ARRAY['member'], 'Yoga enthusiast and mindfulness practitioner. Came to this work after burnout showed me I needed a different way of living.'),
    (v_u2, 'Jordan Hayes','Jordan', 'Hayes',  'member', ARRAY['member'], 'Former athlete learning to listen to my body rather than push through it. Breathwork changed everything.'),
    (v_u3, 'Priya Sharma','Priya',  'Sharma', 'member', ARRAY['member'], 'Therapist by trade, student by heart. Bringing somatic awareness into my personal practice and professional work.'),
    (v_u4, 'Alex Moreno', 'Alex',   'Moreno', 'member', ARRAY['member'], 'Found yoga during a difficult season and it became the container for my healing.'),
    (v_u5, 'Dana Okafor', 'Dana',   'Okafor', 'member', ARRAY['member'], 'Movement teacher and chronic over-thinker on a mission to drop into my body.'),
    (v_u6, 'Sam Nguyen',  'Sam',    'Nguyen', 'member', ARRAY['member'], 'Exploring the intersection of Eastern practices and modern science.'),
    (v_u7, 'Riley Brooks','Riley',  'Brooks', 'member', ARRAY['member'], 'Artist and activist who discovered that tending to my nervous system makes me more effective in the world.'),
    (v_u8, 'Taylor James','Taylor', 'James',  'member', ARRAY['member'], 'New to structured practice, very much not new to the longing for it. Ready to begin.')
  ON CONFLICT (id) DO UPDATE SET
    full_name  = EXCLUDED.full_name,
    first_name = EXCLUDED.first_name,
    last_name  = EXCLUDED.last_name,
    role       = EXCLUDED.role,
    roles      = EXCLUDED.roles,
    bio        = EXCLUDED.bio;

  -- ── Program ───────────────────────────────────────────────────────────────────
  INSERT INTO programs (
    title, slug, description, cover_image_url,
    admin_id, instructor_id, category, difficulty_level,
    duration_hours, is_published, required_role
  ) VALUES (
    'Flow Into Spring',
    'flow-into-spring',
    'An 8-week transformational cohort program blending yoga, breathwork, and reflective journaling. Meeting every other Sunday, this intimate group experience guides you through seasonal themes of awakening, rooting, flowing, and integrating. Between classes, daily practice tasks keep your momentum alive. All levels welcome.',
    'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800',
    v_instructor_id, v_instructor_id,
    'wellness', 'beginner', 16, true, 'member'
  ) ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_program_id FROM programs WHERE slug = 'flow-into-spring';

  -- ── Enrollments ───────────────────────────────────────────────────────────────
  INSERT INTO enrollments (user_id, program_id, status) VALUES
    (v_member_id,     v_program_id, 'active'),
    (v_u1, v_program_id, 'active'),
    (v_u2, v_program_id, 'active'),
    (v_u3, v_program_id, 'active'),
    (v_u4, v_program_id, 'active'),
    (v_u5, v_program_id, 'active'),
    (v_u6, v_program_id, 'active'),
    (v_u7, v_program_id, 'active'),
    (v_u8, v_program_id, 'active')
  ON CONFLICT DO NOTHING;

  -- ── Class 1 — March 22, 2026 ─────────────────────────────────────────────────
  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order, duration_minutes)
  VALUES (gen_random_uuid(), v_program_id, 1, 1,
    'Awakening to Spring Energy',
    'Spring invites us to emerge from the quiet of winter and reconnect with the pulse of new life. In this theme we explore what it means to consciously wake up — to our bodies, our breath, and the season of becoming.',
    '2026-03-22', 1, 90)
  RETURNING id INTO v_milestone_id;
  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'What has been lying dormant in you this winter that feels ready to stir? Describe the first signs of its waking.', 1),
    (v_milestone_id, 'If spring were a message arriving just for you, what would it say? Write it as a letter.', 2),
    (v_milestone_id, 'Where in your body do you feel the most aliveness right now? Where do you feel the most stillness?', 3);

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order, duration_minutes)
  VALUES (gen_random_uuid(), v_program_id, 1, 2,
    'Releasing Winter Patterns',
    'Before new growth can fully arrive, we must tend to what we are leaving behind. Winter leaves its mark in our posture, our breath, our habits of thinking.',
    '2026-03-22', 2, 90)
  RETURNING id INTO v_milestone_id;
  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'Name one habit, belief, or way of being that served you in winter but no longer serves you now.', 1),
    (v_milestone_id, 'What would you need to forgive — in yourself or others — to make more room for spring?', 2),
    (v_milestone_id, 'Imagine setting down something heavy you have been carrying. What is it?', 3);

  -- ── Class 2 — April 5, 2026 ──────────────────────────────────────────────────
  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order, duration_minutes)
  VALUES (gen_random_uuid(), v_program_id, 2, 1,
    'Rooting into Practice',
    'Trees bloom because their roots hold. In this theme we turn our attention downward — to the foundation of our daily practice, the ground of our values, and the steady earth beneath our feet.',
    '2026-04-05', 3, 90)
  RETURNING id INTO v_milestone_id;
  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'What does it feel like in your body when you are truly grounded?', 1),
    (v_milestone_id, 'What is your relationship with commitment? Where does it feel expansive, and where does it feel like pressure?', 2),
    (v_milestone_id, 'What value or truth feels most like a root for you right now?', 3);

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order, duration_minutes)
  VALUES (gen_random_uuid(), v_program_id, 2, 2,
    'Expanding Your Breath',
    'Breath is the bridge between body and mind, between effort and ease. When we expand our breath we expand our capacity — for presence, for feeling, for life itself.',
    '2026-04-05', 4, 90)
  RETURNING id INTO v_milestone_id;
  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'When did you last notice yourself holding your breath? What was happening?', 1),
    (v_milestone_id, 'After this week''s breathwork practice, what emotion or memory surfaced? How did you meet it?', 2),
    (v_milestone_id, 'If your breath could speak, what would it ask of you?', 3);

  -- ── Class 3 — April 19, 2026 ─────────────────────────────────────────────────
  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order, duration_minutes)
  VALUES (gen_random_uuid(), v_program_id, 3, 1,
    'Finding Your Flow',
    'Flow is not something we manufacture — it is something we allow. In this theme we explore the art of moving with life rather than against it.',
    '2026-04-19', 5, 90)
  RETURNING id INTO v_milestone_id;
  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'Describe a time recently when you felt fully in flow — absorbed, effortless, alive.', 1),
    (v_milestone_id, 'Where in your life are you swimming upstream right now?', 2),
    (v_milestone_id, 'What does your body need more of to stay in flow? Less of?', 3);

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order, duration_minutes)
  VALUES (gen_random_uuid(), v_program_id, 3, 2,
    'Cultivating Presence',
    'Presence is the rarest gift we can offer — to ourselves and to others. Learning to be here, fully, is a radical act.',
    '2026-04-19', 6, 90)
  RETURNING id INTO v_milestone_id;
  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'What most consistently pulls you out of the present moment?', 1),
    (v_milestone_id, 'Write about a small ordinary moment from this week that you actually paused to be fully present for.', 2),
    (v_milestone_id, 'What does your fullest, most present self feel like?', 3);

  -- ── Class 4 — May 3, 2026 ────────────────────────────────────────────────────
  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order, duration_minutes)
  VALUES (gen_random_uuid(), v_program_id, 4, 1,
    'Integration and Harvest',
    'Spring''s work is not just to bloom — it is to bear fruit. Integration is the process of weaving what we have learned into the fabric of who we are.',
    '2026-05-03', 7, 90)
  RETURNING id INTO v_milestone_id;
  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'Looking back at your journal entries from the beginning of this program, what surprises you most?', 1),
    (v_milestone_id, 'Name three specific things you learned about yourself that you want to carry forward.', 2),
    (v_milestone_id, 'What does "integration" mean to you right now as a felt, lived experience?', 3);

  INSERT INTO program_milestones (id, program_id, class_number, theme_number, title, description, class_date, sort_order, duration_minutes)
  VALUES (gen_random_uuid(), v_program_id, 4, 2,
    'Carrying the Practice Forward',
    'Every ending is also a beginning. As we complete our time together, we turn toward the future with intention and tenderness.',
    '2026-05-03', 8, 90)
  RETURNING id INTO v_milestone_id;
  INSERT INTO milestone_journal_prompts (milestone_id, prompt_text, sort_order) VALUES
    (v_milestone_id, 'Write a letter to your future self — six months from now. What do you want them to remember?', 1),
    (v_milestone_id, 'What does your sustainable, nourishing daily practice look like in concrete, honest terms?', 2),
    (v_milestone_id, 'What is the one promise you most want to make to yourself as you step forward?', 3);

  -- ── Daily homework — Week 1 ───────────────────────────────────────────────────
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id,1,1,'Morning Body Scan','Before getting out of bed, spend 5 minutes scanning your body from feet to crown.',1),
    (v_program_id,1,1,'Sun Salutation x 5','Move through 5 slow rounds of Sun Salutation A, synchronizing every movement with your breath.',2),
    (v_program_id,1,1,'Awakening Journal Entry','Write for 10 minutes: What one word describes how you are waking up to this season?',3),
    (v_program_id,1,1,'Nadi Shodhana Breath','Practice 5 minutes of alternate nostril breathing.',4),
    (v_program_id,1,1,'Nature Observation','Step outside for at least 5 minutes and observe one sign of spring.',5),
    (v_program_id,1,1,'Gratitude Triad','Name three things you are grateful for related to your body and its capacity to move.',6),
    (v_program_id,1,1,'Evening Wind-Down Stretch','Spend 10 minutes in a slow forward fold or child''s pose.',7),
    (v_program_id,1,2,'Breath Awareness Check-In','Three times today, pause and take three conscious breaths.',1),
    (v_program_id,1,2,'Hip Opening Sequence','15-minute hip-focused sequence: low lunge, pigeon, reclined butterfly.',2),
    (v_program_id,1,2,'Release Writing','Write for 10 minutes: What are you still holding from winter that wants to thaw?',3),
    (v_program_id,1,2,'4-7-8 Breath Practice','Practice the 4-7-8 breath cycle for 4 rounds before a meal.',4),
    (v_program_id,1,2,'Mindful Eating Practice','Choose one meal today to eat in silence, without a screen.',5),
    (v_program_id,1,2,'Affirmation Setting','Write one affirmation that speaks to what you are releasing.',6),
    (v_program_id,1,2,'Legs Up the Wall','Spend 10 minutes in Viparita Karani.',7),
    (v_program_id,1,3,'Morning Mantra Walk','10-minute walk while silently repeating a mantra.',1),
    (v_program_id,1,3,'Heart-Opening Flow','20-minute backbend sequence: bridge, camel, supported fish.',2),
    (v_program_id,1,3,'Midweek Reflection','Write for 10 minutes: How is your body feeling three days into the program?',3),
    (v_program_id,1,3,'Box Breathing','Practice box breathing (4 counts each side) for 5 minutes.',4),
    (v_program_id,1,3,'Digital Rest Period','Take a 30-minute break from all screens.',5),
    (v_program_id,1,3,'Cohort Connection','Send a short message to one person in the program cohort.',6),
    (v_program_id,1,3,'Yin Hold: Sleeping Swan','Hold sleeping swan (pigeon) for 3 minutes each side before bed.',7),
    (v_program_id,1,4,'Cold Water Wake-Up','Begin your morning by splashing cold water on your face three times.',1),
    (v_program_id,1,4,'Balance Sequence','20-minute standing sequence: tree, warrior III, half-moon.',2),
    (v_program_id,1,4,'Shadow Writing','Write for 10 minutes: What part of yourself have you been judging most harshly?',3),
    (v_program_id,1,4,'Wim Hof Round','One round of Wim Hof breathing (30 power breaths, retain, recovery). Seated only.',4),
    (v_program_id,1,4,'Grounding Outdoors','Stand or sit barefoot on earth or grass for 5 minutes.',5),
    (v_program_id,1,4,'Values Inventory','List your top five values as they stand today.',6),
    (v_program_id,1,4,'Savasana as Practice','Lie in Savasana for a full 10 minutes as the practice itself.',7),
    (v_program_id,1,5,'Kapalabhati Morning','Practice 2 minutes of Kapalabhati breath to energize and clear.',1),
    (v_program_id,1,5,'Continuous Flow','25-minute vinyasa flow without pausing.',2),
    (v_program_id,1,5,'End-of-Week Journal','Write for 15 minutes: What has this first week revealed?',3),
    (v_program_id,1,5,'Coherent Breathing','10 minutes of coherent breathing at 5 breaths per minute.',4),
    (v_program_id,1,5,'Nourishing Meal','Prepare at least one meal today with the intention of nourishing your practice body.',5),
    (v_program_id,1,5,'Revisit Your Release','Return to what you wrote on Day 2. Has anything shifted?',6),
    (v_program_id,1,5,'Rest Without Guilt','Schedule at least one hour of genuine rest today.',7),
    (v_program_id,1,6,'Sky Witness','Watch the morning sky for 5 minutes. Let your breath match its expansiveness.',1),
    (v_program_id,1,6,'Restorative Practice','Full 30-minute restorative sequence.',2),
    (v_program_id,1,6,'Pre-Class Intention','Write your intention for tomorrow''s class.',3),
    (v_program_id,1,6,'Extended Exhale Breath','1:2 inhale-to-exhale ratio for 10 minutes.',4),
    (v_program_id,1,6,'Body Gratitude Practice','Write a statement of gratitude to five different parts of your body.',5),
    (v_program_id,1,6,'Journal Review','Read back through everything you wrote this week.',6),
    (v_program_id,1,6,'Early to Bed','Commit to sleeping at least 30 minutes earlier than usual tonight.',7);

  -- ── Daily homework — Week 2 ───────────────────────────────────────────────────
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id,2,1,'Root Chakra Activation','5 minutes of standing with feet firmly planted, knees slightly bent.',1),
    (v_program_id,2,1,'Grounding Sequence','20-minute standing poses focused on stability: mountain, warrior I, warrior II.',2),
    (v_program_id,2,1,'Commitment Journal','Write for 10 minutes: What does your commitment to this practice look like today?',3),
    (v_program_id,2,1,'Diaphragmatic Breath Check','5 minutes ensuring only the belly hand rises.',4),
    (v_program_id,2,1,'Hydration Intention','Drink 8 glasses of water today with full awareness.',5),
    (v_program_id,2,1,'Roots Visualization','10 minutes visualizing roots growing from the soles of your feet.',6),
    (v_program_id,2,1,'Dragon Pose Yin','Hold dragon pose for 3 minutes each side.',7),
    (v_program_id,2,2,'Three-Part Breath','Three-part breath for 10 minutes.',1),
    (v_program_id,2,2,'Core & Breath Flow','20-minute core-focused sequence.',2),
    (v_program_id,2,2,'Letter to Your Breath','Write a letter to your breath.',3),
    (v_program_id,2,2,'Bhramari (Humming Bee)','Humming breath for 5 minutes.',4),
    (v_program_id,2,2,'Compassionate Confrontation','Identify one difficult situation you have been avoiding.',5),
    (v_program_id,2,2,'Movement Medicine','Put on one song you love and move freely for its duration.',6),
    (v_program_id,2,2,'Breath Count to Sleep','Count your exhales backward from 50 as you fall asleep.',7),
    (v_program_id,2,3,'Morning Shake','Spend 3 minutes shaking your entire body.',1),
    (v_program_id,2,3,'Spinal Wave Sequence','20-minute sequence: cat/cow, thread the needle, seated twist.',2),
    (v_program_id,2,3,'Midpoint Check-In','Write for 10 minutes: You are halfway through the program.',3),
    (v_program_id,2,3,'Sitali Cooling Breath','Sitali breath for 5 minutes.',4),
    (v_program_id,2,3,'Media Detox Day','Spend today without news, social media, or entertainment.',5),
    (v_program_id,2,3,'Deep Peer Connection','Reach out to one cohort member for a real conversation.',6),
    (v_program_id,2,3,'Restorative Spinal Twist','5 minutes in supported reclining twist each side before bed.',7),
    (v_program_id,2,4,'Morning Pages','Write 3 pages of stream-of-consciousness upon waking.',1),
    (v_program_id,2,4,'Shoulder & Neck Release','15-minute shoulder and neck release sequence.',2),
    (v_program_id,2,4,'Fear Inventory','Write about one fear that has shown up during this program.',3),
    (v_program_id,2,4,'Breath Retention Practice','Full inhale hold 5-10 seconds before exhaling. Repeat 10 times.',4),
    (v_program_id,2,4,'Acts of Nourishment','Three acts of genuine self-nourishment today.',5),
    (v_program_id,2,4,'Obstacle Strategy','Identify what gets in the way of daily practice most consistently.',6),
    (v_program_id,2,4,'Yoga Nidra','20-minute yoga nidra recording before bed.',7),
    (v_program_id,2,5,'Five Senses Wake-Up','Name one thing you notice for each of your five senses before moving.',1),
    (v_program_id,2,5,'Self-Led Practice','30-minute self-led practice.',2),
    (v_program_id,2,5,'Integration Write','Write for 15 minutes about how the practices are beginning to integrate.',3),
    (v_program_id,2,5,'Toning Practice','Hum, sing, or tone for 5 minutes today.',4),
    (v_program_id,2,5,'Body Mapping','Draw a simple body outline and mark where you have felt the program most.',5),
    (v_program_id,2,5,'Gratitude Including Difficulty','Five specific gratitudes — at least two about something hard.',6),
    (v_program_id,2,5,'Wind-Down Ritual Design','Create a simple 15-minute wind-down ritual.',7),
    (v_program_id,2,6,'Pre-Class Breathwork','10 minutes of your favorite breathwork technique.',1),
    (v_program_id,2,6,'Gentle Arrival Practice','Gentle 20-minute full-body sequence before class.',2),
    (v_program_id,2,6,'Class Intention Writing','Write your intention for today''s class.',3),
    (v_program_id,2,6,'Intentional Silence','Spend 20 minutes in intentional silence.',4),
    (v_program_id,2,6,'Acknowledgment Letter','Write a one-paragraph acknowledgment of yourself for showing up.',5),
    (v_program_id,2,6,'Community Board Check','Read and respond to at least one post in the community board.',6),
    (v_program_id,2,6,'Light Meal & Rest','Eat lightly before class and honor any rest impulse.',7);

  -- ── Daily homework — Week 3 ───────────────────────────────────────────────────
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id,3,1,'Flow State Inventory','Recall a recent moment of flow. What were the conditions?',1),
    (v_program_id,3,1,'Unscripted Movement','20 minutes of movement with no plan.',2),
    (v_program_id,3,1,'Flow vs. Force Journal','Write for 10 minutes: Where do you force vs. flow in your life?',3),
    (v_program_id,3,1,'Breath Pacing','For one hour, intentionally slow your breath to 6 breaths per minute.',4),
    (v_program_id,3,1,'Single-Tasking','Three tasks today done with complete, single-pointed attention.',5),
    (v_program_id,3,1,'Upstream Inquiry','Identify one area where you work hard but get nowhere.',6),
    (v_program_id,3,1,'Progressive Muscle Relaxation','Tense and release each muscle group for 15 minutes before sleep.',7),
    (v_program_id,3,2,'Presence Bell','Alarm every 90 minutes; pause for 1 minute of complete presence.',1),
    (v_program_id,3,2,'Balance & Steadiness Practice','20 minutes of balance-focused yoga.',2),
    (v_program_id,3,2,'Distraction Map','Write for 10 minutes mapping what pulls you out of presence.',3),
    (v_program_id,3,2,'Breath as Anchor','Use three conscious breaths as a presence anchor during difficult tasks.',4),
    (v_program_id,3,2,'Present-Moment Observation','10 minutes writing only about what you can directly observe.',5),
    (v_program_id,3,2,'Phone-Free Morning','No phone until after your morning practice is complete.',6),
    (v_program_id,3,2,'Presence Sleep Meditation','Body-scan or presence-focused sleep meditation tonight.',7),
    (v_program_id,3,3,'Joy Cataloguing','List 10 things that brought you joy this week.',1),
    (v_program_id,3,3,'Playful Practice','Your yoga practice today should feel playful.',2),
    (v_program_id,3,3,'Midprogram Reflection','Write for 15 minutes: Who were you at the start? Who are you now?',3),
    (v_program_id,3,3,'Sound Bath or Music Meditation','Sit with calming music or sounds for 10 minutes.',4),
    (v_program_id,3,3,'Sensory Nature Walk','20-minute walk in nature with no headphones.',5),
    (v_program_id,3,3,'Letter of Self-Compassion','Compassionate letter to yourself about a mistake or regret.',6),
    (v_program_id,3,3,'Legs Up the Wall','5 minutes in supported shoulderstand or legs up the wall.',7),
    (v_program_id,3,4,'Morning Vow','State your practice intention for today aloud before beginning.',1),
    (v_program_id,3,4,'Upper Body Opening','20-minute shoulder, chest, and throat-opening sequence.',2),
    (v_program_id,3,4,'Full Presence Experiment','One conversation today with complete undivided presence.',3),
    (v_program_id,3,4,'Extended Sitali Breath','Sitali or sitkari breath for 10 minutes.',4),
    (v_program_id,3,4,'Analog Activity','30 minutes doing something completely analog.',5),
    (v_program_id,3,4,'Energy Mapping','Draw a simple graph of your energy levels throughout yesterday.',6),
    (v_program_id,3,4,'Hip & Hamstring Yin','Wide-legged forward fold and double pigeon for 3 minutes each.',7),
    (v_program_id,3,5,'Extended Coherent Breathing','15 minutes of coherent breathing first thing this morning.',1),
    (v_program_id,3,5,'Impulse-Led Practice','25 minutes of yoga using only what your body asks for.',2),
    (v_program_id,3,5,'Gratitude for Difficulty','Write about something hard in this program and what it has taught you.',3),
    (v_program_id,3,5,'Extended Nadi Shodhana','10 minutes of alternate nostril breathing.',4),
    (v_program_id,3,5,'Values Revisit','Return to your values list from Week 1.',5),
    (v_program_id,3,5,'Giving Practice','Do something kind today purely for another person.',6),
    (v_program_id,3,5,'Yoga Nidra with Sankalpa','25-minute yoga nidra. Set a sankalpa before you begin.',7),
    (v_program_id,3,6,'Anticipatory Journaling','Write about what you are looking forward to in today''s class.',1),
    (v_program_id,3,6,'Slow Morning','A full hour of unhurried morning before any obligations.',2),
    (v_program_id,3,6,'Week Completion Review','Look back at your homework this week.',3),
    (v_program_id,3,6,'Favorite Pranayama','10 minutes of your personal favorite breathwork technique.',4),
    (v_program_id,3,6,'Community Gratitude Post','Post a brief message of appreciation in the program community.',5),
    (v_program_id,3,6,'Warm Body Arrival','Move gently for 15 minutes before class.',6),
    (v_program_id,3,6,'Arrive Early','Arrive to class 10 minutes early to breathe and set an intention.',7);

  -- ── Daily homework — Week 4 ───────────────────────────────────────────────────
  INSERT INTO daily_homework_tasks (program_id, week_number, day_of_week, task_title, task_description, sort_order) VALUES
    (v_program_id,4,1,'Expanding Awareness Practice','Consciously expand your awareness outward in concentric circles.',1),
    (v_program_id,4,1,'Inversion Sequence','20-minute sequence building to a supported inversion.',2),
    (v_program_id,4,1,'Presence Cost Journal','Write for 10 minutes: What has been the cost of your habitual absence?',3),
    (v_program_id,4,1,'Midday Box Breathing','Box breathing for 10 minutes as a midday reset.',4),
    (v_program_id,4,1,'Device Boundary','Establish one concrete device boundary for this week.',5),
    (v_program_id,4,1,'Beginner''s Mind','Choose one daily activity to do today as if for the first time.',6),
    (v_program_id,4,1,'Candlelight Savasana','Savasana by candlelight tonight for 15 minutes.',7),
    (v_program_id,4,2,'Throat Chakra Awakening','Hum three different notes, feeling the resonance in your chest, throat, and skull.',1),
    (v_program_id,4,2,'Twist & Detox Flow','20-minute sequence focused on twists.',2),
    (v_program_id,4,2,'Authenticity Inquiry','Write for 10 minutes: Where are you performing rather than being?',3),
    (v_program_id,4,2,'Breath Counting Meditation','Breath counting meditation for 15 minutes.',4),
    (v_program_id,4,2,'Creative Expression','Express something from your practice through a non-writing medium.',5),
    (v_program_id,4,2,'Mirror Practice','Look at your own eyes in a mirror for one full minute.',6),
    (v_program_id,4,2,'Loving Kindness Before Sleep','10-minute metta meditation before sleep.',7),
    (v_program_id,4,3,'Gratitude Walk','15-minute gratitude walk, naming something grateful with each step.',1),
    (v_program_id,4,3,'Deep Core Practice','20-minute sequence focused on deep core and pelvic floor.',2),
    (v_program_id,4,3,'Service Reflection','How has this practice changed the quality of your presence for others?',3),
    (v_program_id,4,3,'One-Minute Breath','Inhale 20s, hold 20s, exhale 20s. Repeat 3 times.',4),
    (v_program_id,4,3,'Declutter One Space','Clear one small physical space today.',5),
    (v_program_id,4,3,'Note to Your Teacher','Write a brief note of appreciation to any teacher who has influenced your practice.',6),
    (v_program_id,4,3,'Final Yin Session','Three yin poses for 4 minutes each tonight.',7),
    (v_program_id,4,4,'Dawn Presence Intention','Set an intention about quality of presence rather than productivity.',1),
    (v_program_id,4,4,'Power Vinyasa','Strong, continuous 30-minute vinyasa.',2),
    (v_program_id,4,4,'Integration Journal','Write for 15 minutes about everything this 8-week program has given you.',3),
    (v_program_id,4,4,'Extended Bhramari','Bhramari for 10 minutes.',4),
    (v_program_id,4,4,'Digital Sunset','End all screen time 90 minutes before bed.',5),
    (v_program_id,4,4,'Peak Pose Dedication','Choose one challenging pose. Dedicate the practice to someone.',6),
    (v_program_id,4,4,'Heart Hand Ritual','Place your hands on your heart and silently thank your body before sleep.',7),
    (v_program_id,4,5,'Open Awareness Meditation','15 minutes of open awareness — no object of focus.',1),
    (v_program_id,4,5,'Your Harvest Sequence','Create your own 20-minute sequence using poses that meant the most.',2),
    (v_program_id,4,5,'Pre-Final Class Journal','What do you most want to take from this program into the rest of your life?',3),
    (v_program_id,4,5,'Full Pranayama Session','Complete 20-minute pranayama: kapalabhati, nadi shodhana, bhramari, samavritti.',4),
    (v_program_id,4,5,'Service Offering','Do something in service to someone else with your full presence.',5),
    (v_program_id,4,5,'Vision Statement','Write a single powerful sentence capturing the person you have grown into.',6),
    (v_program_id,4,5,'Savasana as Ceremony','20-minute savasana as a ceremony of completion.',7),
    (v_program_id,4,6,'Final Morning Practice','Your complete personal morning routine one final time before class.',1),
    (v_program_id,4,6,'Seal Your Letter Forward','Write your letter to your future self and commit to opening it in six months.',2),
    (v_program_id,4,6,'Closing Class Intention','Write your intention for today''s final class.',3),
    (v_program_id,4,6,'Completion Breath','4-7-8 cycle 8 times as a ritual of completion.',4),
    (v_program_id,4,6,'Community Closing Post','Write a final post in the program community — your reflection and gratitude.',5),
    (v_program_id,4,6,'Celebration Meal','Prepare or choose a meal that feels like a celebration.',6),
    (v_program_id,4,6,'Arrive With Your Whole Self','Come to class having brought nothing left undone.',7);

END $$;

/*
  # Seed community posts and message threads

  ## Overview
  Seeds sample community posts and message threads for the Flow Into Spring program
  using the demo accounts and sample participants.
*/

DO $$
DECLARE
  v_instructor_id uuid := 'aaaaaaaa-0002-0001-0001-000000000001';
  v_member_id     uuid := 'aaaaaaaa-0001-0001-0001-000000000001';
  v_u1 uuid := '22222222-0001-0001-0001-000000000001'; -- Maya Chen
  v_u2 uuid := '22222222-0002-0001-0001-000000000001'; -- Jordan Hayes
  v_u3 uuid := '22222222-0003-0001-0001-000000000001'; -- Priya Sharma
  v_u5 uuid := '22222222-0005-0001-0001-000000000001'; -- Dana Okafor
  v_u6 uuid := '22222222-0006-0001-0001-000000000001'; -- Sam Nguyen
  v_u7 uuid := '22222222-0007-0001-0001-000000000001'; -- Riley Brooks
  v_u8 uuid := '22222222-0008-0001-0001-000000000001'; -- Taylor James
  v_program_id uuid;
  v_thread_id uuid;
BEGIN

  SELECT id INTO v_program_id FROM programs WHERE slug = 'flow-into-spring';

  -- ── Community posts ───────────────────────────────────────────────────────────
  INSERT INTO community_posts (author_id, program_id, title, content, category, is_pinned, created_at) VALUES
    (v_instructor_id, v_program_id,
     'Welcome to Flow Into Spring — A Note from Sage',
     'Dear beautiful humans,

I am so moved by the gathering that is already forming in this cohort. Each of you arrived here for a reason, even if you can''t fully name it yet — and that reason will unfold over our eight weeks together.

A few gentle reminders as we begin: This is a practice, not a performance. There is no right way to show up, only your way. If you miss a homework day, you haven''t failed — you''ve simply found your edge.

The community board is yours. Share what moves you, ask what confuses you, celebrate what surprises you.

Between now and our first class, I invite you to simply notice: What does spring feel like in your body?

With gratitude and warmth, Sage',
     'announcement', true, now() - interval '5 days'),

    (v_u1, v_program_id,
     'First week check-in — anyone else feeling this deeply?',
     'I wasn''t prepared for how emotional the first class would be. During the hip opening sequence on Day 2, I started crying and didn''t really understand why. I''ve heard people talk about emotions releasing through the hips but always thought it was a bit woo. Now I am very much a believer. How is everyone else doing with the first week''s homework?',
     'discussion', false, now() - interval '4 days'),

    (v_u8, v_program_id,
     'Question about the breathwork homework — how long should I hold the retention?',
     'Hi everyone — I''m new to breathwork and the Day 4 homework mentions a Wim Hof round with breath retention. I tried it and wasn''t sure when I was supposed to breathe again. I held for maybe 20 seconds and then got a bit panicky. Is that normal? Any tips for a total beginner?',
     'question', false, now() - interval '3 days'),

    (v_u3, v_program_id,
     'Resource: The science of hip-stored tension',
     'The psoas muscle (released in pigeon and dragon pose) is deeply connected to the fight-or-flight response. When we''ve been in survival mode or chronic stress, this muscle holds on. Opening it gently can access layers of stored emotional experience. This is not metaphor — it''s neuroscience. So if you cried in your hip openers this week, you''re not broken. You''re doing the work exactly right.',
     'resource', false, now() - interval '2 days'),

    (v_u7, v_program_id,
     'The journal prompts are doing something I didn''t expect',
     'I came into this program thinking the movement would be the hard part and the journaling would be secondary. I was so wrong. The prompt "What has been lying dormant in you this winter?" sent me down a rabbit hole for two hours. I ended up writing about a creative project I abandoned three years ago and how I''ve been telling myself it wasn''t good enough. Does anyone else find the prompts are surfacing things from outside the wellness space?',
     'discussion', false, now() - interval '1 day'),

    (v_u2, v_program_id,
     'Accountability check — who is keeping up with the daily homework?',
     'Former athlete here who has been humbled by the restorative practices. I can do the strong flows all day. I struggle to lie in Savasana for 10 minutes without my brain revolting. Confession: I skipped the Savasana practice twice and did an extra flow instead. I know, I know. That is exactly the edge I need to be at. Who wants to be accountability partners?',
     'general', false, now() - interval '12 hours');

  -- ── Message threads ───────────────────────────────────────────────────────────

  -- Thread 1: member <-> instructor
  INSERT INTO message_threads (participant_ids, created_at, updated_at)
  VALUES (ARRAY[v_member_id, v_instructor_id], now() - interval '6 days', now() - interval '1 day')
  RETURNING id INTO v_thread_id;

  INSERT INTO messages (thread_id, sender_id, content, created_at, read_by) VALUES
    (v_thread_id, v_instructor_id,
     'Hi! Just wanted to reach out before we begin. The part about coming to this work after "years of moving through life rather than in it" really resonated with me. I think this spring is going to be meaningful for you. Is there anything you''d like me to know before our first class?',
     now() - interval '6 days', ARRAY[v_member_id, v_instructor_id]),
    (v_thread_id, v_member_id,
     'Thank you so much, Sage. I tend to push myself and then burn out — I''m hoping this program helps me learn to sustain a practice rather than sprint through one. Any tips for someone who struggles with the rest parts?',
     now() - interval '5 days', ARRAY[v_member_id, v_instructor_id]),
    (v_thread_id, v_instructor_id,
     'That''s such honest self-awareness. For you, I''d suggest treating the restorative practices as the most advanced ones. Anyone can push harder. It takes a different kind of strength to be still. When you''re in savasana and your brain wants to flee, try whispering: "This is the practice."',
     now() - interval '4 days', ARRAY[v_member_id, v_instructor_id]),
    (v_thread_id, v_member_id,
     'That reframe is already helping. I wrote it on a sticky note on my mat. First class was incredible — the Awakening theme really landed for me.',
     now() - interval '2 days', ARRAY[v_member_id, v_instructor_id]),
    (v_thread_id, v_instructor_id,
     'I could feel it in the room when that theme landed for you — there was a shift in your whole body. That''s what we''re here for. Keep journaling.',
     now() - interval '1 day', ARRAY[v_member_id, v_instructor_id]);

  -- Thread 2: member <-> Maya Chen
  INSERT INTO message_threads (participant_ids, created_at, updated_at)
  VALUES (ARRAY[v_member_id, v_u1], now() - interval '3 days', now() - interval '18 hours')
  RETURNING id INTO v_thread_id;

  INSERT INTO messages (thread_id, sender_id, content, created_at, read_by) VALUES
    (v_thread_id, v_u1,
     'Hey! I saw you in class and wanted to connect. I ended up crying in pigeon and felt embarrassed until I noticed I wasn''t alone. How are you doing with the week 1 homework?',
     now() - interval '3 days', ARRAY[v_member_id, v_u1]),
    (v_thread_id, v_member_id,
     'The mornings are a whole journey! The hardest part for me is the journaling — I keep wanting to write the right answer instead of the honest one.',
     now() - interval '2 days', ARRAY[v_member_id, v_u1]),
    (v_thread_id, v_u1,
     'Try writing with your non-dominant hand. It feels ridiculous but the filter disappears completely.',
     now() - interval '1 day', ARRAY[v_member_id, v_u1]),
    (v_thread_id, v_member_id,
     'The non-dominant hand trick is wild! Just tried it and wrote something I didn''t even know I felt. Thank you!',
     now() - interval '18 hours', ARRAY[v_member_id, v_u1]);

  -- Thread 3: member <-> Priya Sharma
  INSERT INTO message_threads (participant_ids, created_at, updated_at)
  VALUES (ARRAY[v_member_id, v_u3], now() - interval '2 days', now() - interval '6 hours')
  RETURNING id INTO v_thread_id;

  INSERT INTO messages (thread_id, sender_id, content, created_at, read_by) VALUES
    (v_thread_id, v_member_id,
     'Priya, thank you for sharing that article about the psoas. Do you recommend any books on this topic?',
     now() - interval '2 days', ARRAY[v_member_id, v_u3]),
    (v_thread_id, v_u3,
     'Two books I always recommend: "The Body Keeps the Score" by Bessel van der Kolk and "Waking the Tiger" by Peter Levine. Both will give you a lot of context for why this work does what it does.',
     now() - interval '1 day', ARRAY[v_member_id, v_u3]),
    (v_thread_id, v_member_id,
     'Just ordered both. Also — would you be open to pairing up for the Week 2 accountability practice?',
     now() - interval '18 hours', ARRAY[v_member_id, v_u3]),
    (v_thread_id, v_u3,
     'Absolutely yes. Let''s check in each morning — even just a quick "I did it" in this thread.',
     now() - interval '6 hours', ARRAY[v_member_id, v_u3]);

  -- Thread 4: member <-> Dana Okafor
  INSERT INTO message_threads (participant_ids, created_at, updated_at)
  VALUES (ARRAY[v_member_id, v_u5], now() - interval '4 days', now() - interval '2 days')
  RETURNING id INTO v_thread_id;

  INSERT INTO messages (thread_id, sender_id, content, created_at, read_by) VALUES
    (v_thread_id, v_u5,
     'Quick question — are we supposed to do all 7 daily tasks every single day, or is it a menu?',
     now() - interval '4 days', ARRAY[v_member_id, v_u5]),
    (v_thread_id, v_member_id,
     'I asked Sage and she said the intention is to try all 7 but doing 4 or 5 with full presence is better than rushing through all 7 to check them off.',
     now() - interval '3 days', ARRAY[v_member_id, v_u5]),
    (v_thread_id, v_u5,
     'That is so reassuring! Doing 5 tasks with intention starting today.',
     now() - interval '2 days', ARRAY[v_member_id, v_u5]);

END $$;

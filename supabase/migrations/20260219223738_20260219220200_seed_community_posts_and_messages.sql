/*
  # Seed Community Posts and Messages

  ## Overview
  Seeds sample community posts and message threads for the Flow Into Spring program.
  
  - 6 community posts (announcements, discussions, questions, resources)
  - 6 message threads with conversations between CJ and:
    - Instructor Sage Rivera
    - Several participants
  - Sample messages within each thread

  ## Notes
  - All content is wellness/program-focused
  - Messages simulate realistic back-and-forth conversations
*/

DO $$
DECLARE
  v_cj_id uuid := 'c5c92072-2729-4c28-a7ba-2130670edd2d';
  v_instructor_id uuid := '11111111-0001-0001-0001-000000000001';
  v_u1 uuid := '22222222-0001-0001-0001-000000000001'; -- Maya Chen
  v_u2 uuid := '22222222-0002-0001-0001-000000000001'; -- Jordan Hayes
  v_u3 uuid := '22222222-0003-0001-0001-000000000001'; -- Priya Sharma
  v_u4 uuid := '22222222-0004-0001-0001-000000000001'; -- Alex Moreno
  v_u5 uuid := '22222222-0005-0001-0001-000000000001'; -- Dana Okafor
  v_u6 uuid := '22222222-0006-0001-0001-000000000001'; -- Sam Nguyen
  v_u7 uuid := '22222222-0007-0001-0001-000000000001'; -- Riley Brooks
  v_u8 uuid := '22222222-0008-0001-0001-000000000001'; -- Taylor James
  v_program_id uuid;
  v_post_id uuid;
  v_thread_id uuid;
BEGIN

  SELECT id INTO v_program_id FROM programs WHERE slug = 'flow-into-spring';

  -- =============================================
  -- COMMUNITY POSTS
  -- =============================================

  -- Post 1: Pinned welcome announcement from instructor
  INSERT INTO community_posts (id, author_id, program_id, title, content, category, is_pinned, created_at)
  VALUES (gen_random_uuid(), v_instructor_id, v_program_id,
    'Welcome to Flow Into Spring — A Note from Sage',
    'Dear beautiful humans,

I am so moved by the gathering that is already forming in this cohort. Each of you arrived here for a reason, even if you can''t fully name it yet — and that reason will unfold over our eight weeks together.

A few gentle reminders as we begin:

This is a practice, not a performance. There is no right way to show up, only your way. If you miss a homework day, you haven''t failed — you''ve simply found your edge, and that''s information.

The community board is yours. Share what moves you, ask what confuses you, celebrate what surprises you. The more you put in, the more this space becomes a genuine container for your growth.

Between now and our first class on March 22nd, I invite you to simply notice: What does spring feel like in your body? You don''t need to answer it — just let the question live in you.

With gratitude and warmth,
Sage',
    'announcement', true, now() - interval '5 days');

  -- Post 2: Discussion from Maya Chen
  INSERT INTO community_posts (id, author_id, program_id, title, content, category, is_pinned, created_at)
  VALUES (gen_random_uuid(), v_u1, v_program_id,
    'First week check-in — anyone else feeling this deeply?',
    'I wasn''t prepared for how emotional the first class would be. I came in thinking it was going to be mostly physical practice, but something about the "Releasing Winter Patterns" theme just cracked me open.

During the hip opening sequence on Day 2, I started crying and didn''t really understand why. I''ve heard people talk about emotions releasing through the hips before but always thought it was a bit woo. 

Now I am very much a believer.

How is everyone else doing with the first week''s homework? I''m finding the evening practices easier than the morning ones — I am very much not a morning person but I''m working on it.',
    'discussion', false, now() - interval '4 days');

  -- Post 3: Question from Taylor James
  INSERT INTO community_posts (id, author_id, program_id, title, content, category, is_pinned, created_at)
  VALUES (gen_random_uuid(), v_u8, v_program_id,
    'Question about the breathwork homework — how long should I actually hold the retention?',
    'Hi everyone — I''m new to breathwork (like, very new) and the Day 4 homework mentions a Wim Hof round with breath retention. I tried it and honestly was not sure when I was supposed to breathe again. 

I held for maybe 20 seconds and then got a bit panicky and breathed. Is that normal? Am I holding too long or not long enough?

Also any tips for making this less intimidating for a total beginner?',
    'question', false, now() - interval '3 days');

  -- Post 4: Resource share from Priya Sharma
  INSERT INTO community_posts (id, author_id, program_id, title, content, category, is_pinned, created_at)
  VALUES (gen_random_uuid(), v_u3, v_program_id,
    'Resource: Article on the science of hip-stored tension',
    'As a therapist I get asked about this all the time, and this week''s practice made me want to share something that might give a bit more context to why our bodies respond the way they do.

The psoas muscle (which we release in pigeon pose and dragon) is sometimes called "the muscle of the soul" — it''s deeply connected to the fight-or-flight response and the enteric nervous system. When we''ve been in survival mode, chronic stress, or trauma, this muscle holds on.

Opening it gently (not forcing!) can genuinely access layers of stored emotional experience. This is not metaphor — it''s neuroscience.

So if you cried in your hip openers this week, you''re not broken. You''re actually doing the work exactly right.

Be gentle with yourselves. 🌿',
    'resource', false, now() - interval '2 days');

  -- Post 5: Discussion from Riley Brooks
  INSERT INTO community_posts (id, author_id, program_id, title, content, category, is_pinned, created_at)
  VALUES (gen_random_uuid(), v_u7, v_program_id,
    'The journal prompts are doing something I didn''t expect',
    'I came into this program thinking the movement would be the hard part and the journaling would be kind of... secondary. I was so wrong.

The prompt "What has been lying dormant in you this winter?" sent me down a rabbit hole for two hours. I ended up writing about a creative project I abandoned three years ago and how I''ve been telling myself it wasn''t good enough — but actually I was just scared.

I don''t know if I''ll pick the project back up. But naming it felt significant.

Does anyone else find the prompts are surfacing things from way outside the wellness space? Like life stuff?',
    'discussion', false, now() - interval '1 day');

  -- Post 6: General from Jordan Hayes
  INSERT INTO community_posts (id, author_id, program_id, title, content, category, is_pinned, created_at)
  VALUES (gen_random_uuid(), v_u2, v_program_id,
    'Accountability check — who is keeping up with the daily homework?',
    'Former athlete here who has been humbled by the restorative practices. I can do the strong flows all day. I struggle to lie in Savasana for 10 minutes without my brain revolting.

Confession: I skipped Day 4''s Savasana practice twice this week and just did an extra flow instead. 

I know, I know. That is exactly the edge I need to be at.

Who''s struggling with a particular task and wants to be accountability partners? I need someone to hold me to the restorative stuff.',
    'general', false, now() - interval '12 hours');

  -- =============================================
  -- MESSAGE THREADS & MESSAGES
  -- =============================================

  -- Thread 1: CJ <-> Sage Rivera (instructor)
  INSERT INTO message_threads (id, participant_ids, created_at, updated_at)
  VALUES (gen_random_uuid(), ARRAY[v_cj_id, v_instructor_id], now() - interval '6 days', now() - interval '1 day')
  RETURNING id INTO v_thread_id;

  INSERT INTO messages (thread_id, sender_id, content, created_at, read_by) VALUES
    (v_thread_id, v_instructor_id,
     'Hi! Just wanted to reach out directly before we begin. I''ve looked at everyone''s intake forms and yours really resonated with me. The part about coming to this work after "years of moving through life rather than in it" — I understand that exactly. I think this spring is going to be meaningful for you. Is there anything you''d like me to know before our first class?',
     now() - interval '6 days', ARRAY[v_cj_id, v_instructor_id]),
    (v_thread_id, v_cj_id,
     'Thank you so much, Sage. That means a lot. I guess the main thing I want you to know is that I tend to push myself and then burn out — I''m hoping this program helps me learn to sustain a practice rather than sprint through one. Any tips for someone who struggles with the "rest" parts?',
     now() - interval '5 days', ARRAY[v_cj_id, v_instructor_id]),
    (v_thread_id, v_instructor_id,
     'That''s such honest self-awareness — and it''s already doing the work just naming it. For you, I''d actually suggest treating the restorative practices as the most advanced ones. Anyone can push harder. It takes a different kind of strength to be still. When you''re in savasana and your brain wants to flee, try whispering to yourself: "This is the practice." See you Sunday! 🌿',
     now() - interval '4 days', ARRAY[v_cj_id, v_instructor_id]),
    (v_thread_id, v_cj_id,
     'That reframe is already helping. "This is the practice." I wrote it on a sticky note on my mat. First class was incredible by the way — the Awakening theme really landed for me. I''ve been thinking about that question all week.',
     now() - interval '2 days', ARRAY[v_cj_id, v_instructor_id]),
    (v_thread_id, v_instructor_id,
     'I could feel it in the room when that theme landed for you — there was a shift in your whole body. That''s what we''re here for. Keep journaling. The answers are already in you.',
     now() - interval '1 day', ARRAY[v_cj_id, v_instructor_id]);

  -- Thread 2: CJ <-> Maya Chen
  INSERT INTO message_threads (id, participant_ids, created_at, updated_at)
  VALUES (gen_random_uuid(), ARRAY[v_cj_id, v_u1], now() - interval '3 days', now() - interval '18 hours')
  RETURNING id INTO v_thread_id;

  INSERT INTO messages (thread_id, sender_id, content, created_at, read_by) VALUES
    (v_thread_id, v_u1,
     'Hey! I saw you in class and wanted to connect. Your energy during the hip opening sequence was so powerful. I ended up crying in pigeon and felt a little embarrassed until I noticed I wasn''t alone. Are you doing okay with the week 1 homework? The morning practices are killing me lol',
     now() - interval '3 days', ARRAY[v_cj_id, v_u1]),
    (v_thread_id, v_cj_id,
     'The mornings are a whole journey! I''ve been setting my alarm 20 minutes earlier which felt impossible at first but honestly the body scan before getting up has started to feel really nice. The hardest part for me is the journaling — I keep wanting to write "the right answer" instead of the honest one.',
     now() - interval '2 days', ARRAY[v_cj_id, v_u1]),
    (v_thread_id, v_u1,
     'Oh the "right answer" thing — YES. I did the same until I just started writing with my non-dominant hand and suddenly the filter disappeared completely. Try it. It feels ridiculous but it works. Also your post in the community board about the prompts surfacing unexpected things really resonated with me too.',
     now() - interval '1 day', ARRAY[v_cj_id, v_u1]),
    (v_thread_id, v_cj_id,
     'The non-dominant hand trick is wild! Just tried it for 5 minutes and wrote something I didn''t even know I felt. Thank you for that. Can''t wait to see what next week''s themes bring.',
     now() - interval '18 hours', ARRAY[v_cj_id, v_u1]);

  -- Thread 3: CJ <-> Priya Sharma
  INSERT INTO message_threads (id, participant_ids, created_at, updated_at)
  VALUES (gen_random_uuid(), ARRAY[v_cj_id, v_u3], now() - interval '2 days', now() - interval '6 hours')
  RETURNING id INTO v_thread_id;

  INSERT INTO messages (thread_id, sender_id, content, created_at, read_by) VALUES
    (v_thread_id, v_cj_id,
     'Priya, thank you for sharing that article about the psoas in the community board. As someone who had a really emotional reaction during the hip work, it helped so much to understand the physiology behind it. Do you recommend any books on this topic?',
     now() - interval '2 days', ARRAY[v_cj_id, v_u3]),
    (v_thread_id, v_u3,
     'So glad it was helpful! Two books I always recommend: "The Body Keeps the Score" by Bessel van der Kolk (a bit intense but foundational) and "Waking the Tiger" by Peter Levine (gentler and more somatic-focused). Both will give you a lot of context for why this work does what it does.',
     now() - interval '1 day', ARRAY[v_cj_id, v_u3]),
    (v_thread_id, v_cj_id,
     'Just ordered both. Also — would you be open to pairing up for the Week 2 accountability practice? I''m finding I do better when I know someone else is doing the homework alongside me.',
     now() - interval '18 hours', ARRAY[v_cj_id, v_u3]),
    (v_thread_id, v_u3,
     'Absolutely yes. I''d love that. Let''s check in each morning — even just a quick "I did it" in this thread. Sometimes that''s all the accountability we need. 🙏',
     now() - interval '6 hours', ARRAY[v_cj_id, v_u3]);

  -- Thread 4: CJ <-> Jordan Hayes
  INSERT INTO message_threads (id, participant_ids, created_at, updated_at)
  VALUES (gen_random_uuid(), ARRAY[v_cj_id, v_u2], now() - interval '1 day', now() - interval '4 hours')
  RETURNING id INTO v_thread_id;

  INSERT INTO messages (thread_id, sender_id, content, created_at, read_by) VALUES
    (v_thread_id, v_u2,
     'Hey — I saw your name on the roster and noticed you also listed "consistency without burning out" as a goal. Fellow sprinter here. I love the community board post idea about accountability partners. Want to be mine specifically for the restorative practices? Neither of us can escape savasana.',
     now() - interval '1 day', ARRAY[v_cj_id, v_u2]),
    (v_thread_id, v_cj_id,
     'Ha! Yes, the savasana struggle is real. I literally caught myself making a mental grocery list during it yesterday. Deal — let''s hold each other to the restorative stuff. How about we send a photo of our savasana setup each day as proof? Even if it''s just feet.',
     now() - interval '20 hours', ARRAY[v_cj_id, v_u2]),
    (v_thread_id, v_u2,
     'I love this idea. Feet photos incoming. Also I set a timer today for the full 10 minutes and committed to just... being there even when my brain was screaming. It got better around minute 7. Maybe there''s something to this after all.',
     now() - interval '4 hours', ARRAY[v_cj_id, v_u2]);

  -- Thread 5: CJ <-> Dana Okafor
  INSERT INTO message_threads (id, participant_ids, created_at, updated_at)
  VALUES (gen_random_uuid(), ARRAY[v_cj_id, v_u5], now() - interval '4 days', now() - interval '2 days')
  RETURNING id INTO v_thread_id;

  INSERT INTO messages (thread_id, sender_id, content, created_at, read_by) VALUES
    (v_thread_id, v_u5,
     'Quick question — are we supposed to do all 7 daily tasks every single day, or is it more of a menu we pick from? I want to do it right but some days 7 things feels like a lot on top of work and life.',
     now() - interval '4 days', ARRAY[v_cj_id, v_u5]),
    (v_thread_id, v_cj_id,
     'I had the same question! I asked Sage and she said the intention is to try all 7 but to be kind to yourself — doing 4 or 5 with full presence is better than rushing through all 7 just to check them off. The journal entries are the ones she really recommends not skipping.',
     now() - interval '3 days', ARRAY[v_cj_id, v_u5]),
    (v_thread_id, v_u5,
     'That is so reassuring, thank you! That''s the kind of permission I needed to actually enjoy the process instead of stress-completing it. Doing 5 tasks with intention starting today.',
     now() - interval '2 days', ARRAY[v_cj_id, v_u5]);

  -- Thread 6: CJ <-> Sam Nguyen
  INSERT INTO message_threads (id, participant_ids, created_at, updated_at)
  VALUES (gen_random_uuid(), ARRAY[v_cj_id, v_u6], now() - interval '5 days', now() - interval '3 days')
  RETURNING id INTO v_thread_id;

  INSERT INTO messages (thread_id, sender_id, content, created_at, read_by) VALUES
    (v_thread_id, v_u6,
     'Hi! I noticed from your intro that you''re interested in both the movement and the science side of this work. I''ve been deep in research about polyvagal theory and how it relates to breathwork — have you come across Stephen Porges'' work? Would love to geek out about it if you have.',
     now() - interval '5 days', ARRAY[v_cj_id, v_u6]),
    (v_thread_id, v_cj_id,
     'Yes! I''ve read "The Polyvagal Theory in Therapy" and it completely reframed how I think about nervous system states. The idea that safety is the treatment is so simple and so profound. Are you finding the breathwork practices we''re doing match up with what Porges describes for ventral vagal activation?',
     now() - interval '4 days', ARRAY[v_cj_id, v_u6]),
    (v_thread_id, v_u6,
     'Completely. The coherent breathing and the humming practices especially — the slow breath activates the vagal brake and the humming stimulates the vagus nerve directly through the middle ear. Sage clearly knows her neuroscience even if she teaches through poetry. I love that.',
     now() - interval '3 days', ARRAY[v_cj_id, v_u6]);

END $$;

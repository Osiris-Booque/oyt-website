/*
  # Seed Course and Event Catalog

  ## Overview
  Populates the platform with the full course catalog matching the
  site's offerings. Uses a system-level provider approach where courses
  are created by the first guru-level user or a system placeholder.

  ## Member Courses (9 total, required_role = 'member')
  - Yoga: Beginner, Intermediate, Advanced
  - Breathwork: Beginner, Intermediate, Advanced
  - Therapy: Beginner, Intermediate, Advanced

  ## Training Courses (3 total, required_role = 'student')
  - Expert Level Training
  - Master Level Training
  - Guru Level Training

  ## Sample Events
  - Weekly yoga class
  - Breathwork workshop
  - Wellness webinar

  ## Notes
  - All courses created as published
  - Each course includes 3 modules with 3 lessons each
  - Courses use a placeholder provider_id that should be updated
    to a real guru user once one exists
*/

-- Create a helper function to seed courses
-- We use a DO block so we can use variables
DO $$
DECLARE
  v_provider_id uuid;
  v_course_id uuid;
  v_module_id uuid;
BEGIN
  -- Get first guru user, or first user if none
  SELECT id INTO v_provider_id FROM profiles WHERE role = 'guru' LIMIT 1;
  IF v_provider_id IS NULL THEN
    SELECT id INTO v_provider_id FROM profiles LIMIT 1;
  END IF;

  -- If no users exist yet, skip seeding
  IF v_provider_id IS NULL THEN
    RAISE NOTICE 'No users found. Skipping seed.';
    RETURN;
  END IF;

  -- ========================================
  -- YOGA COURSES (Member)
  -- ========================================

  -- Yoga Beginner
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'yoga-foundations') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Yoga Foundations', 'yoga-foundations',
      'Begin your yoga journey with fundamental postures, alignment principles, and breathing techniques. Perfect for those new to yoga or returning after a break.',
      'yoga', 'beginner', 'member', 8, v_provider_id, true,
      'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Getting Started', 'Introduction to yoga philosophy and basics', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'What is Yoga?', 'An introduction to the history and philosophy of yoga, exploring its origins and how it applies to modern life.', 30, 0),
      (v_module_id, 'Setting Up Your Practice Space', 'Learn how to create a comfortable and safe space for your yoga practice at home or in a studio.', 20, 1),
      (v_module_id, 'Breath Awareness', 'Discover the connection between breath and movement that forms the foundation of all yoga practice.', 25, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Foundation Poses', 'Essential standing and seated postures', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Mountain Pose & Standing Poses', 'Master the foundational standing postures including Tadasana, Warrior I, and Warrior II.', 35, 0),
      (v_module_id, 'Seated Poses & Forward Folds', 'Explore seated postures that build flexibility and calm the nervous system.', 35, 1),
      (v_module_id, 'Sun Salutation A', 'Learn the classic Sun Salutation sequence that connects breath with movement.', 40, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Building Your Practice', 'Developing consistency and body awareness', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Creating a Daily Routine', 'Strategies for building a sustainable daily yoga practice.', 25, 0),
      (v_module_id, 'Listening to Your Body', 'Understanding pain vs. discomfort and how to modify poses safely.', 30, 1),
      (v_module_id, 'Beginner Flow Practice', 'A complete 30-minute flow combining everything learned in this course.', 40, 2);
  END IF;

  -- Yoga Intermediate
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'yoga-deepening-practice') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Yoga: Deepening Your Practice', 'yoga-deepening-practice',
      'Advance your yoga practice with more challenging postures, pranayama techniques, and deeper exploration of yoga philosophy.',
      'yoga', 'intermediate', 'member', 12, v_provider_id, true,
      'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Intermediate Asana', 'Challenging poses and transitions', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Arm Balances Introduction', 'Build strength and confidence for arm balances like Crow and Side Crow.', 40, 0),
      (v_module_id, 'Backbends & Heart Openers', 'Safely explore deeper backbends including Wheel and Camel pose.', 40, 1),
      (v_module_id, 'Inversions Foundation', 'Preparation and practice for headstand and shoulderstand.', 45, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Pranayama & Meditation', 'Advanced breathing and meditation practices', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Ujjayi & Kapalabhati', 'Master two essential pranayama techniques used throughout intermediate practice.', 35, 0),
      (v_module_id, 'Nadi Shodhana', 'Alternate nostril breathing for balancing the nervous system.', 30, 1),
      (v_module_id, 'Guided Meditation Practices', 'Explore different meditation styles to find what works for your mind.', 35, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Flow & Sequencing', 'Building dynamic sequences', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Vinyasa Flow Principles', 'Understanding the art of sequencing movements with breath.', 40, 0),
      (v_module_id, 'Power Flow Practice', 'A challenging 45-minute power vinyasa flow.', 50, 1),
      (v_module_id, 'Restorative Counterbalance', 'Balancing an active practice with deep restorative poses.', 35, 2);
  END IF;

  -- Yoga Advanced
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'yoga-mastery') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Yoga Mastery', 'yoga-mastery',
      'For dedicated practitioners ready to explore advanced asana, deep philosophy, and the subtleties of energy work within yoga.',
      'yoga', 'advanced', 'member', 16, v_provider_id, true,
      'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Advanced Asana', 'Peak poses and complex sequences', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Advanced Arm Balances', 'Flying pigeon, eight-angle pose, and other advanced arm balances.', 50, 0),
      (v_module_id, 'Deep Backbends', 'Scorpion, king pigeon, and drop-back techniques.', 50, 1),
      (v_module_id, 'Full Inversions', 'Freestanding handstand and advanced inversion variations.', 50, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Yoga Philosophy', 'The eight limbs and beyond', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'The Eight Limbs of Yoga', 'Deep dive into Patanjali''s Yoga Sutras and the eight-limbed path.', 45, 0),
      (v_module_id, 'Chakras & Energy Body', 'Understanding the subtle energy system and its role in practice.', 40, 1),
      (v_module_id, 'Yoga as a Way of Life', 'Integrating yogic principles into everyday decisions and relationships.', 35, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Personal Mastery', 'Developing your unique expression', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Developing Your Voice', 'Finding your authentic expression through practice.', 40, 0),
      (v_module_id, 'Advanced Pranayama', 'Kumbhaka, bandhas, and advanced breath retention techniques.', 45, 1),
      (v_module_id, 'Mastery Flow Practice', 'A complete 60-minute advanced flow integrating all skills.', 60, 2);
  END IF;

  -- ========================================
  -- BREATHWORK COURSES (Member)
  -- ========================================

  -- Breathwork Beginner
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'breathwork-essentials') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Breathwork Essentials', 'breathwork-essentials',
      'Discover the transformative power of conscious breathing. Learn foundational techniques to reduce stress, improve focus, and regulate your nervous system.',
      'breathwork', 'beginner', 'member', 6, v_provider_id, true,
      'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'The Science of Breath', 'Understanding how breathing affects your body and mind', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'How Breathing Works', 'The anatomy and physiology of respiration and its connection to the nervous system.', 25, 0),
      (v_module_id, 'Stress & the Breath', 'How breathing patterns change under stress and how to use breath to reset.', 25, 1),
      (v_module_id, 'Diaphragmatic Breathing', 'Master the foundational belly breathing technique for relaxation.', 30, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Core Techniques', 'Essential breathwork practices', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Box Breathing', 'A simple four-count technique used by Navy SEALs for calm under pressure.', 20, 0),
      (v_module_id, '4-7-8 Relaxation Breath', 'Dr. Andrew Weil''s technique for deep relaxation and sleep.', 20, 1),
      (v_module_id, 'Coherent Breathing', 'Breathing at 5 breaths per minute for optimal heart rate variability.', 25, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Daily Practice', 'Integrating breathwork into your routine', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Morning Energizing Routine', 'A 10-minute breathwork routine to start your day with clarity.', 20, 0),
      (v_module_id, 'Evening Wind-Down', 'Calming breath practices for better sleep quality.', 20, 1),
      (v_module_id, 'Breathwork for Anxiety', 'Immediate techniques for managing anxiety in the moment.', 25, 2);
  END IF;

  -- Breathwork Intermediate
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'breathwork-expansion') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Breathwork Expansion', 'breathwork-expansion',
      'Deepen your breathwork practice with intermediate techniques including Wim Hof method basics, holotropic elements, and emotional release breathing.',
      'breathwork', 'intermediate', 'member', 10, v_provider_id, true,
      'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Energizing Techniques', 'Activating breath patterns', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Wim Hof Method Basics', 'Introduction to the Wim Hof breathing technique for energy and resilience.', 35, 0),
      (v_module_id, 'Kapalabhati & Bhastrika', 'Traditional yogic cleansing and energizing breath techniques.', 30, 1),
      (v_module_id, 'Breath of Fire', 'Rapid rhythmic breathing for energy and core activation.', 30, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Emotional Breathwork', 'Using breath for emotional processing', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Connected Breathing', 'Circular breathing patterns for accessing deeper emotional states.', 40, 0),
      (v_module_id, 'Breath & Sound', 'Combining vocalization with breathing for emotional release.', 35, 1),
      (v_module_id, 'Integration Practices', 'How to process and integrate experiences after intense breathwork.', 30, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Applied Breathwork', 'Breathwork for specific goals', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Breathwork for Performance', 'Optimize focus and energy for work and athletic performance.', 30, 0),
      (v_module_id, 'Breathwork for Healing', 'Using breath to support physical recovery and immune function.', 35, 1),
      (v_module_id, 'Extended Breath Session', 'A guided 40-minute intermediate breathwork journey.', 45, 2);
  END IF;

  -- Breathwork Advanced
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'breathwork-mastery') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Breathwork Mastery', 'breathwork-mastery',
      'Master advanced breathwork modalities including extended breath holds, holotropic breathwork, and the integration of breath with meditation and movement.',
      'breathwork', 'advanced', 'member', 14, v_provider_id, true,
      'https://images.pexels.com/photos/3759659/pexels-photo-3759659.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Advanced Techniques', 'Powerful breath modalities', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Holotropic Breathwork', 'Deep, accelerated breathing for expanded states of consciousness.', 50, 0),
      (v_module_id, 'Extended Breath Retention', 'Building capacity for longer breath holds and their benefits.', 45, 1),
      (v_module_id, 'Rebirthing Breathwork', 'Continuous connected breathing for deep release and renewal.', 50, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Breath & Consciousness', 'Exploring altered states', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Breath & Meditation', 'Using breath as a gateway to deep meditative states.', 40, 0),
      (v_module_id, 'Pranayama Mastery', 'Advanced yogic breathing including kumbhaka and bandha integration.', 45, 1),
      (v_module_id, 'Shamanic Breathwork', 'Combining breath with rhythm and intention for journeying.', 50, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Integration & Mastery', 'Bringing it all together', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Safety & Contraindications', 'Understanding when and how to use advanced techniques safely.', 35, 0),
      (v_module_id, 'Personal Practice Design', 'Creating your own advanced breathwork protocol.', 40, 1),
      (v_module_id, 'Mastery Breath Journey', 'A complete 60-minute advanced guided breathwork experience.', 60, 2);
  END IF;

  -- ========================================
  -- THERAPY COURSES (Member)
  -- ========================================

  -- Therapy Beginner
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'therapy-foundations') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Therapeutic Foundations', 'therapy-foundations',
      'An introduction to therapeutic self-care practices including mindfulness-based stress reduction, emotional awareness, and cognitive reframing techniques.',
      'therapy', 'beginner', 'member', 8, v_provider_id, true,
      'https://images.pexels.com/photos/3759656/pexels-photo-3759656.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Understanding Yourself', 'Building self-awareness', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'The Mind-Body Connection', 'How thoughts, emotions, and physical sensations are interconnected.', 30, 0),
      (v_module_id, 'Emotional Literacy', 'Learning to identify, name, and understand your emotions.', 30, 1),
      (v_module_id, 'Mindfulness Basics', 'Introduction to present-moment awareness and non-judgmental observation.', 35, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Practical Tools', 'Everyday therapeutic techniques', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Cognitive Reframing', 'Learn to identify and challenge unhelpful thought patterns.', 35, 0),
      (v_module_id, 'Grounding Techniques', 'Physical and mental grounding exercises for anxiety and overwhelm.', 25, 1),
      (v_module_id, 'Journaling for Healing', 'Structured journaling practices for self-reflection and emotional processing.', 30, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Building Resilience', 'Developing emotional strength', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Setting Healthy Boundaries', 'Understanding and communicating personal boundaries effectively.', 30, 0),
      (v_module_id, 'Self-Compassion Practices', 'Cultivating kindness toward yourself during difficult times.', 30, 1),
      (v_module_id, 'Creating Your Wellness Plan', 'Designing a personalized plan for ongoing mental health maintenance.', 35, 2);
  END IF;

  -- Therapy Intermediate
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'therapy-deepening') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Therapeutic Deepening', 'therapy-deepening',
      'Explore intermediate therapeutic practices including somatic experiencing, inner child work, and mindfulness-based cognitive therapy techniques.',
      'therapy', 'intermediate', 'member', 12, v_provider_id, true,
      'https://images.pexels.com/photos/3807730/pexels-photo-3807730.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Somatic Awareness', 'Body-based healing', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Introduction to Somatic Experiencing', 'Understanding how the body stores and processes trauma.', 40, 0),
      (v_module_id, 'Body Scanning & Release', 'Guided practices for noticing and releasing physical tension.', 35, 1),
      (v_module_id, 'Pendulation & Titration', 'Safely moving between states of activation and calm.', 40, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Inner Work', 'Exploring deeper patterns', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Inner Child Work', 'Connecting with and healing younger parts of yourself.', 40, 0),
      (v_module_id, 'Parts Work (IFS Basics)', 'Introduction to Internal Family Systems for self-understanding.', 40, 1),
      (v_module_id, 'Shadow Integration', 'Exploring and integrating disowned aspects of self.', 35, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Relationships & Communication', 'Healing through connection', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Attachment Styles', 'Understanding how early relationships shape adult patterns.', 35, 0),
      (v_module_id, 'Nonviolent Communication', 'Tools for expressing needs and hearing others with empathy.', 35, 1),
      (v_module_id, 'Repair & Reconnection', 'Healing relationship ruptures and building trust.', 35, 2);
  END IF;

  -- Therapy Advanced
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'therapy-integration') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Therapeutic Integration', 'therapy-integration',
      'Advanced therapeutic practices combining somatic, cognitive, and contemplative approaches for deep healing and personal transformation.',
      'therapy', 'advanced', 'member', 16, v_provider_id, true,
      'https://images.pexels.com/photos/5699475/pexels-photo-5699475.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Trauma-Informed Practice', 'Deep healing work', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Understanding Trauma Responses', 'The neuroscience of trauma and how it manifests in body and mind.', 45, 0),
      (v_module_id, 'EMDR Self-Application Basics', 'Bilateral stimulation techniques for processing difficult memories.', 45, 1),
      (v_module_id, 'Nervous System Regulation', 'Advanced polyvagal exercises for accessing the ventral vagal state.', 50, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Contemplative Practices', 'Merging therapy and spirituality', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Mindfulness-Based Cognitive Therapy', 'Combining mindfulness with cognitive approaches for lasting change.', 45, 0),
      (v_module_id, 'Acceptance & Commitment', 'ACT principles for living a values-driven life.', 40, 1),
      (v_module_id, 'Transpersonal Psychology', 'Exploring meaning, purpose, and spiritual dimensions of healing.', 40, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Personal Transformation', 'Becoming whole', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Post-Traumatic Growth', 'How adversity can become a catalyst for deep personal growth.', 40, 0),
      (v_module_id, 'Authentic Living', 'Aligning your outer life with your inner truth.', 35, 1),
      (v_module_id, 'Integration & Wholeness', 'A comprehensive guided practice bringing together all therapeutic modalities.', 50, 2);
  END IF;

  -- ========================================
  -- TRAINING COURSES (Student role required)
  -- ========================================

  -- Expert Level
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'training-expert') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Expert Practitioner Training', 'training-expert',
      'The first step in your professional journey. Deepen your understanding of yoga, breathwork, and therapy modalities with advanced theory, anatomy, and practice.',
      'training', 'expert', 'student', 40, v_provider_id, true,
      'https://images.pexels.com/photos/7592357/pexels-photo-7592357.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Advanced Anatomy & Physiology', 'The science behind the practice', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Musculoskeletal System Deep Dive', 'Advanced understanding of how the body moves and adapts to practice.', 60, 0),
      (v_module_id, 'Nervous System Mastery', 'The autonomic nervous system and its role in wellness practices.', 60, 1),
      (v_module_id, 'Psychophysiology', 'How mental states influence physical health and vice versa.', 55, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Modality Integration', 'Combining practices effectively', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Cross-Modality Assessment', 'Evaluating clients across yoga, breathwork, and therapeutic frameworks.', 55, 0),
      (v_module_id, 'Integrated Session Design', 'Creating sessions that weave multiple modalities for maximum impact.', 60, 1),
      (v_module_id, 'Case Studies & Analysis', 'Real-world examples of integrated wellness approaches.', 50, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Professional Foundations', 'Building your professional identity', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Ethics & Boundaries', 'Professional ethics, scope of practice, and maintaining boundaries.', 50, 0),
      (v_module_id, 'Client Communication', 'Effective intake, assessment, and ongoing communication with clients.', 45, 1),
      (v_module_id, 'Documentation & Planning', 'Creating treatment plans and maintaining professional records.', 45, 2);
  END IF;

  -- Master Level
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'training-master') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Master Practitioner Training', 'training-master',
      'Elevate your expertise with advanced teaching methodology, group facilitation skills, and the business knowledge needed to lead wellness programs.',
      'training', 'master', 'student', 60, v_provider_id, true,
      'https://images.pexels.com/photos/7592386/pexels-photo-7592386.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Teaching Methodology', 'The art and science of teaching', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Principles of Adult Learning', 'Understanding how adults learn and retain new skills.', 55, 0),
      (v_module_id, 'Demonstration & Cueing', 'How to effectively demonstrate and verbally cue practices.', 60, 1),
      (v_module_id, 'Hands-On Adjustments', 'Safe and effective physical assists and modifications.', 60, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Group Facilitation', 'Leading groups with confidence', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Group Dynamics', 'Understanding and managing the energy of a group.', 50, 0),
      (v_module_id, 'Trauma-Informed Teaching', 'Creating safe spaces and handling emotional responses in group settings.', 55, 1),
      (v_module_id, 'Workshop Design', 'Planning and executing impactful workshops and retreats.', 50, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Business & Leadership', 'The business of wellness', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Building Your Brand', 'Defining your niche and communicating your unique value.', 50, 0),
      (v_module_id, 'Marketing & Client Acquisition', 'Ethical marketing strategies for wellness professionals.', 55, 1),
      (v_module_id, 'Sustainable Business Models', 'Creating a financially sustainable wellness practice.', 50, 2);
  END IF;

  -- Guru Level
  IF NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'training-guru') THEN
    INSERT INTO courses (id, title, slug, description, category, difficulty_level, required_role, duration_hours, provider_id, is_published, cover_image_url)
    VALUES (gen_random_uuid(), 'Guru Certification Program', 'training-guru',
      'The pinnacle of professional development. Master program creation, mentor training, and organizational leadership to become a recognized wellness leader.',
      'training', 'guru', 'student', 80, v_provider_id, true,
      'https://images.pexels.com/photos/8436587/pexels-photo-8436587.jpeg?auto=compress&cs=tinysrgb&w=800')
    RETURNING id INTO v_course_id;

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Program Creation', 'Designing transformative programs', 0) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Curriculum Design', 'Creating comprehensive, outcome-driven wellness programs.', 70, 0),
      (v_module_id, 'Assessment & Certification', 'Designing evaluation frameworks and certification criteria.', 60, 1),
      (v_module_id, 'Quality Assurance', 'Maintaining high standards across programs and practitioners.', 55, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Mentorship & Leadership', 'Developing others', 1) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'The Art of Mentorship', 'How to guide and develop emerging practitioners.', 60, 0),
      (v_module_id, 'Leadership Philosophy', 'Servant leadership and conscious business principles.', 55, 1),
      (v_module_id, 'Building Community', 'Creating thriving practitioner communities and support networks.', 50, 2);

    INSERT INTO course_modules (id, course_id, title, description, sort_order) VALUES
      (gen_random_uuid(), v_course_id, 'Organizational Mastery', 'Leading at scale', 2) RETURNING id INTO v_module_id;
    INSERT INTO lessons (module_id, title, content, duration_minutes, sort_order) VALUES
      (v_module_id, 'Organizational Strategy', 'Strategic planning for wellness organizations and schools.', 60, 0),
      (v_module_id, 'Partnerships & Collaboration', 'Building meaningful partnerships in the wellness ecosystem.', 55, 1),
      (v_module_id, 'Legacy & Vision', 'Defining your long-term vision and creating lasting impact.', 50, 2);
  END IF;

  -- ========================================
  -- SAMPLE EVENTS
  -- ========================================

  IF NOT EXISTS (SELECT 1 FROM live_events WHERE title = 'Weekly Community Yoga Flow') THEN
    INSERT INTO live_events (title, description, event_type, provider_id, start_time, end_time, max_attendees, is_published, cover_image_url)
    VALUES (
      'Weekly Community Yoga Flow',
      'Join our welcoming community yoga class suitable for all levels. This gentle yet invigorating flow will leave you feeling refreshed and connected.',
      'class', v_provider_id,
      now() + interval '3 days',
      now() + interval '3 days' + interval '75 minutes',
      30, true,
      'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=800'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM live_events WHERE title = 'Breathwork & Ice Bath Workshop') THEN
    INSERT INTO live_events (title, description, event_type, provider_id, start_time, end_time, max_attendees, is_published, cover_image_url)
    VALUES (
      'Breathwork & Ice Bath Workshop',
      'Experience the transformative combination of guided breathwork and cold exposure. Learn techniques to build resilience, reduce inflammation, and boost your immune system.',
      'workshop', v_provider_id,
      now() + interval '7 days',
      now() + interval '7 days' + interval '3 hours',
      15, true,
      'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=800'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM live_events WHERE title = 'Mindfulness & Mental Wellness Webinar') THEN
    INSERT INTO live_events (title, description, event_type, provider_id, start_time, end_time, max_attendees, is_published, cover_image_url)
    VALUES (
      'Mindfulness & Mental Wellness Webinar',
      'A free online session exploring practical mindfulness techniques for everyday mental wellness. Includes Q&A with our clinical director Dr. Sarah Chen.',
      'webinar', v_provider_id,
      now() + interval '5 days',
      now() + interval '5 days' + interval '90 minutes',
      100, true,
      'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=800'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM live_events WHERE title = 'New Student Orientation') THEN
    INSERT INTO live_events (title, description, event_type, provider_id, start_time, end_time, max_attendees, is_published, cover_image_url)
    VALUES (
      'New Student Orientation',
      'Welcome session for new training students. Learn about the training path from Expert to Master to Guru, meet your mentors, and connect with fellow students.',
      'class', v_provider_id,
      now() + interval '10 days',
      now() + interval '10 days' + interval '2 hours',
      25, true,
      'https://images.pexels.com/photos/7592357/pexels-photo-7592357.jpeg?auto=compress&cs=tinysrgb&w=800'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM live_events WHERE title = 'Monthly Healing Circle') THEN
    INSERT INTO live_events (title, description, event_type, provider_id, start_time, end_time, max_attendees, is_published, cover_image_url)
    VALUES (
      'Monthly Healing Circle',
      'A safe and supportive group session combining guided meditation, breathwork, and sharing. Open to all members of our community.',
      'workshop', v_provider_id,
      now() + interval '14 days',
      now() + interval '14 days' + interval '2 hours',
      20, true,
      'https://images.pexels.com/photos/5699475/pexels-photo-5699475.jpeg?auto=compress&cs=tinysrgb&w=800'
    );
  END IF;

END $$;

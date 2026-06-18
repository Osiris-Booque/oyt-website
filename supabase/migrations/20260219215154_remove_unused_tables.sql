/*
  # Remove Unused Tables

  1. Tables to Remove
    - live_events (events system not needed)
    - event_registrations (events system not needed)
    - certificates (certificates not needed)
    - role_applications (simplified role system)
    - course_modules (replaced by simpler structure)
    - lessons (replaced by simpler structure)
    - lesson_progress (replaced by assignment submissions)
  
  2. Notes
    - This will permanently delete these tables and their data
    - Foreign key constraints will be automatically dropped
*/

DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS live_events CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS role_applications CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS course_modules CASCADE;

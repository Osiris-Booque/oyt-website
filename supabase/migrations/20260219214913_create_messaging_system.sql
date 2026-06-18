/*
  # Create Messaging System

  1. New Tables
    - `message_threads`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz) - last message timestamp
      - `participant_ids` (uuid[]) - array of user IDs in conversation
    
    - `messages`
      - `id` (uuid, primary key)
      - `thread_id` (uuid, foreign key)
      - `sender_id` (uuid, foreign key to profiles)
      - `content` (text)
      - `created_at` (timestamptz)
      - `read_by` (uuid[]) - array of user IDs who have read the message
  
  2. Security
    - Enable RLS on both tables
    - Users can only view threads they are part of
    - Users can only view messages in their threads
    - Users can send messages in threads they are part of
*/

CREATE TABLE IF NOT EXISTS message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  participant_ids uuid[] NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read_by uuid[] DEFAULT ARRAY[]::uuid[]
);

CREATE INDEX IF NOT EXISTS idx_message_threads_participants ON message_threads USING gin(participant_ids);
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own threads"
  ON message_threads FOR SELECT
  TO authenticated
  USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "Users can create threads"
  ON message_threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = ANY(participant_ids));

CREATE POLICY "Users can update their own threads"
  ON message_threads FOR UPDATE
  TO authenticated
  USING (auth.uid() = ANY(participant_ids))
  WITH CHECK (auth.uid() = ANY(participant_ids));

CREATE POLICY "Users can view messages in their threads"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM message_threads
      WHERE message_threads.id = messages.thread_id
      AND auth.uid() = ANY(message_threads.participant_ids)
    )
  );

CREATE POLICY "Users can send messages in their threads"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM message_threads
      WHERE message_threads.id = messages.thread_id
      AND auth.uid() = ANY(message_threads.participant_ids)
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM message_threads
      WHERE message_threads.id = messages.thread_id
      AND auth.uid() = ANY(message_threads.participant_ids)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM message_threads
      WHERE message_threads.id = messages.thread_id
      AND auth.uid() = ANY(message_threads.participant_ids)
    )
  );

CREATE OR REPLACE FUNCTION update_thread_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE message_threads
  SET updated_at = NEW.created_at
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_timestamp();

-- Run this in Supabase: SQL Editor -> New query -> paste -> Run
CREATE TABLE IF NOT EXISTS clubs (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  description   TEXT,
  category      VARCHAR(60),
  meeting_day   VARCHAR(20),
  contact_email VARCHAR(120),
  member_count  INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS clubs_updated_at ON clubs;
CREATE TRIGGER clubs_updated_at BEFORE UPDATE ON clubs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

INSERT INTO clubs (name, description, category, meeting_day, contact_email, member_count) VALUES
('Coding Club', 'Weekly coding challenges and projects', 'Technology', 'Monday', 'coding@mu.ac.zm', 45),
('Debate Society', 'Public speaking and debate practice', 'Academic', 'Tuesday', 'debate@mu.ac.zm', 30),
('Football Club', 'Campus football training and matches', 'Sports', 'Wednesday', 'football@mu.ac.zm', 60),
('Drama Club', 'Theatre and performing arts', 'Arts', 'Thursday', 'drama@mu.ac.zm', 25),
('Robotics Club', 'Build and program robots', 'Technology', 'Friday', 'robotics@mu.ac.zm', 20),
('Environmental Club', 'Tree planting and clean-up drives', 'Community', 'Saturday', 'green@mu.ac.zm', 35),
('Chess Club', 'Casual and competitive chess', 'Games', 'Monday', 'chess@mu.ac.zm', 18),
('Entrepreneurship Club', 'Startup ideas and mentorship', 'Business', 'Tuesday', 'entre@mu.ac.zm', 40),
('Music Club', 'Choir, band and open mic nights', 'Arts', 'Thursday', 'music@mu.ac.zm', 28),
('Photography Club', 'Photo walks and editing workshops', 'Arts', 'Sunday', 'photo@mu.ac.zm', 22);

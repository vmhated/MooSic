-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  onboarding_status TEXT DEFAULT 'not_started' CHECK (onboarding_status IN ('not_started', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create taste_profiles table
CREATE TABLE taste_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  favorite_artists JSONB DEFAULT '[]',
  favorite_genres JSONB DEFAULT '[]',
  favorite_tracks JSONB DEFAULT '[]',
  favorite_albums JSONB DEFAULT '[]',
  disliked_artists JSONB DEFAULT '[]',
  languages JSONB DEFAULT '[]',
  decades JSONB DEFAULT '[]',
  moods JSONB DEFAULT '[]',
  moments JSONB DEFAULT '[]',
  discovery_style TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create playlists table
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create playlist_tracks table
CREATE TABLE playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  provider_track_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_liked_tracks table
CREATE TABLE user_liked_tracks (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  provider_track_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, provider, provider_track_id)
);

-- Create listening_events table
CREATE TABLE listening_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  provider_track_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  duration_played INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  source TEXT,
  metadata JSONB
);

-- Create listening_sessions table
CREATE TABLE listening_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  track_count INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0,
  metadata JSONB
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE taste_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_liked_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Taste Profiles Policies
CREATE POLICY "Users can view own taste profile" ON taste_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own taste profile" ON taste_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own taste profile" ON taste_profiles FOR UPDATE USING (auth.uid() = id);

-- Playlists Policies
CREATE POLICY "Users can view own playlists" ON playlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own playlists" ON playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own playlists" ON playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own playlists" ON playlists FOR DELETE USING (auth.uid() = user_id);

-- Playlist Tracks Policies
CREATE POLICY "Users can view own playlist tracks" ON playlist_tracks FOR SELECT USING (
  EXISTS (SELECT 1 FROM playlists p WHERE p.id = playlist_tracks.playlist_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can insert own playlist tracks" ON playlist_tracks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM playlists p WHERE p.id = playlist_tracks.playlist_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can update own playlist tracks" ON playlist_tracks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM playlists p WHERE p.id = playlist_tracks.playlist_id AND p.user_id = auth.uid())
);
CREATE POLICY "Users can delete own playlist tracks" ON playlist_tracks FOR DELETE USING (
  EXISTS (SELECT 1 FROM playlists p WHERE p.id = playlist_tracks.playlist_id AND p.user_id = auth.uid())
);

-- Likes Policies
CREATE POLICY "Users can view own likes" ON user_liked_tracks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own likes" ON user_liked_tracks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON user_liked_tracks FOR DELETE USING (auth.uid() = user_id);

-- Listening Events Policies
CREATE POLICY "Users can view own listening events" ON listening_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own listening events" ON listening_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Listening Sessions Policies
CREATE POLICY "Users can view own listening sessions" ON listening_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own listening sessions" ON listening_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listening sessions" ON listening_sessions FOR UPDATE USING (auth.uid() = user_id);

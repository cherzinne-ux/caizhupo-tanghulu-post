CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  post_date DATE NOT NULL,
  daily_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_date, daily_number),
  UNIQUE(post_date, ip_hash)
);

CREATE INDEX IF NOT EXISTS posts_date_idx ON posts(post_date, daily_number);
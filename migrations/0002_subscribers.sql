-- Footer newsletter signups for daleyorganics.com.
CREATE TABLE IF NOT EXISTS subscribers (
  email TEXT PRIMARY KEY,
  source_page TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

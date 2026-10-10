-- Contact-form submissions for daleyorganics.com (same pattern as morningwood-firewood).
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_date TEXT,
  project_size TEXT,
  message TEXT NOT NULL,
  source_page TEXT,
  notified TEXT,            -- JSON: recipients the alert reached
  confirmation_sent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

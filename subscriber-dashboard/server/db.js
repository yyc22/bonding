const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'subscriber-dashboard.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL CHECK (platform IN ('youtube', 'tiktok')),
    external_id TEXT NOT NULL,
    display_name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (platform, external_id)
  );

  CREATE TABLE IF NOT EXISTS snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    captured_at TEXT NOT NULL DEFAULT (datetime('now')),
    subscriber_count INTEGER,
    view_count INTEGER,
    video_count INTEGER,
    likes_count INTEGER
  );

  CREATE INDEX IF NOT EXISTS idx_snapshots_channel_time ON snapshots(channel_id, captured_at);

  CREATE TABLE IF NOT EXISTS tiktok_tokens (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    open_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  );
`);

module.exports = db;

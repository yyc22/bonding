const db = require('../db');
const youtube = require('./youtubeService');
const { upsertChannel } = require('./snapshots');

// Auto-registers known channels on first boot so there's nothing to click
// through in the UI. Only creates the channel row — the scheduler's
// first poll (5s after boot) takes care of recording the initial snapshot.
// Safe to call on every startup: resolving an already-known handle just
// re-upserts the same row, and a failed resolution (e.g. no API key
// configured yet) is logged and skipped rather than crashing the server.
async function seedYoutubeChannels() {
  const handles = (process.env.SEED_YOUTUBE_HANDLES || '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean);

  for (const raw of handles) {
    const handle = raw.startsWith('@') ? raw : `@${raw}`;
    try {
      const stats = await youtube.resolveAndFetchChannel(handle);
      const existed = db.prepare('SELECT 1 FROM channels WHERE platform = ? AND external_id = ?').get('youtube', stats.externalId);
      upsertChannel('youtube', stats.externalId, stats.displayName);
      if (!existed) console.log(`[seed] added YouTube channel ${handle} -> ${stats.displayName}`);
    } catch (err) {
      console.warn(`[seed] could not resolve YouTube handle ${handle}: ${err.message}`);
    }
  }
}

module.exports = { seedYoutubeChannels };

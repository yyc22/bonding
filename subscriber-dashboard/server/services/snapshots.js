const db = require('../db');
const youtube = require('./youtubeService');
const tiktok = require('./tiktokService');

function upsertChannel(platform, externalId, displayName) {
  db.prepare(
    `INSERT INTO channels (platform, external_id, display_name)
     VALUES (?, ?, ?)
     ON CONFLICT(platform, external_id) DO UPDATE SET display_name = excluded.display_name`
  ).run(platform, externalId, displayName);
  return db.prepare('SELECT * FROM channels WHERE platform = ? AND external_id = ?').get(platform, externalId);
}

function recordSnapshot(channelId, stats) {
  db.prepare(
    `INSERT INTO snapshots (channel_id, subscriber_count, view_count, video_count, likes_count)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    channelId,
    stats.subscriberCount ?? stats.followerCount ?? null,
    stats.viewCount ?? null,
    stats.videoCount ?? null,
    stats.likesCount ?? null
  );
}

async function pollChannel(channel) {
  if (channel.platform === 'youtube') {
    const stats = await youtube.fetchChannelStats(channel.external_id);
    recordSnapshot(channel.id, stats);
    return stats;
  }
  if (channel.platform === 'tiktok') {
    const stats = await tiktok.fetchOwnAccountStats();
    recordSnapshot(channel.id, stats);
    return stats;
  }
  throw new Error(`Unknown platform: ${channel.platform}`);
}

async function pollAllChannels() {
  const channels = db.prepare('SELECT * FROM channels').all();
  const results = [];
  for (const channel of channels) {
    try {
      const stats = await pollChannel(channel);
      results.push({ channel, stats, ok: true });
    } catch (err) {
      results.push({ channel, error: err.message, ok: false });
    }
  }
  return results;
}

module.exports = { upsertChannel, recordSnapshot, pollChannel, pollAllChannels };

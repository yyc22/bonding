const express = require('express');
const db = require('../db');
const youtube = require('../services/youtubeService');
const { upsertChannel, recordSnapshot, pollChannel } = require('../services/snapshots');

const router = express.Router();

function latestSnapshot(channelId) {
  return db
    .prepare('SELECT * FROM snapshots WHERE channel_id = ? ORDER BY captured_at DESC LIMIT 1')
    .get(channelId);
}

function snapshotAtOrBefore(channelId, cutoffIso) {
  return db
    .prepare(
      'SELECT * FROM snapshots WHERE channel_id = ? AND captured_at <= ? ORDER BY captured_at DESC LIMIT 1'
    )
    .get(channelId, cutoffIso);
}

router.get('/', (req, res) => {
  const channels = db.prepare('SELECT * FROM channels ORDER BY platform, display_name').all();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const payload = channels.map((channel) => {
    const latest = latestSnapshot(channel.id);
    const weekAgo = snapshotAtOrBefore(channel.id, sevenDaysAgo);
    const currentCount = latest?.subscriber_count ?? null;
    const priorCount = weekAgo?.subscriber_count ?? null;
    return {
      id: channel.id,
      platform: channel.platform,
      externalId: channel.external_id,
      displayName: channel.display_name,
      subscriberCount: currentCount,
      viewCount: latest?.view_count ?? null,
      videoCount: latest?.video_count ?? null,
      capturedAt: latest?.captured_at ?? null,
      weeklyGrowth: currentCount != null && priorCount != null ? currentCount - priorCount : null,
    };
  });

  res.json(payload);
});

router.post('/youtube', async (req, res) => {
  const { channel } = req.body || {};
  if (!channel || !channel.trim()) {
    return res.status(400).json({ error: 'Provide a channel ID or @handle' });
  }
  try {
    const stats = await youtube.resolveAndFetchChannel(channel);
    const row = upsertChannel('youtube', stats.externalId, stats.displayName);
    recordSnapshot(row.id, stats);
    res.status(201).json({ id: row.id, ...stats });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.post('/:id/refresh', async (req, res) => {
  const channel = db.prepare('SELECT * FROM channels WHERE id = ?').get(req.params.id);
  if (!channel) return res.status(404).json({ error: 'Channel not found' });
  try {
    const stats = await pollChannel(channel);
    res.json({ ok: true, stats });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM channels WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

router.get('/:id/history', (req, res) => {
  const days = Math.min(Number(req.query.days) || 30, 365);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const rows = db
    .prepare('SELECT * FROM snapshots WHERE channel_id = ? AND captured_at >= ? ORDER BY captured_at ASC')
    .all(req.params.id, since);
  res.json(
    rows.map((r) => ({
      capturedAt: r.captured_at,
      subscriberCount: r.subscriber_count,
      viewCount: r.view_count,
      videoCount: r.video_count,
      likesCount: r.likes_count,
    }))
  );
});

module.exports = router;

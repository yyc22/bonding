const express = require('express');
const crypto = require('node:crypto');
const tiktok = require('../services/tiktokService');
const { upsertChannel, recordSnapshot } = require('../services/snapshots');

const router = express.Router();

// In-memory CSRF state store; fine for a single-operator local dashboard.
const pendingStates = new Set();

router.get('/tiktok', (req, res) => {
  try {
    const state = crypto.randomBytes(16).toString('hex');
    pendingStates.add(state);
    res.redirect(tiktok.buildAuthorizeUrl(state));
  } catch (err) {
    res.status(500).send(`TikTok is not configured: ${err.message}`);
  }
});

router.get('/tiktok/callback', async (req, res) => {
  const { code, state, error, error_description: errorDescription } = req.query;

  if (error) {
    return res.status(400).send(`TikTok authorization failed: ${errorDescription || error}`);
  }
  if (!state || !pendingStates.has(state)) {
    return res.status(400).send('Invalid or expired OAuth state');
  }
  pendingStates.delete(state);

  try {
    const tokenData = await tiktok.exchangeCodeForToken(code);
    tiktok.saveTokens(tokenData);

    const stats = await tiktok.fetchOwnAccountStats();
    const row = upsertChannel('tiktok', stats.externalId, stats.displayName);
    recordSnapshot(row.id, stats);

    res.redirect('/?connected=tiktok');
  } catch (err) {
    res.status(502).send(`TikTok connection failed: ${err.message}`);
  }
});

router.get('/tiktok/status', (req, res) => {
  res.json({ connected: tiktok.isConnected() });
});

module.exports = router;

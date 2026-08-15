const db = require('../db');

const AUTH_BASE = 'https://www.tiktok.com/v2/auth/authorize/';
const TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';
const USER_INFO_URL = 'https://open.tiktokapis.com/v2/user/info/';

// TikTok's public API only exposes stats for the account that explicitly
// authorizes your app via OAuth (i.e. your own channel) — there is no way
// to pull an arbitrary creator's follower count by handle, unlike YouTube.
const SCOPES = 'user.info.basic,user.info.stats';

function requireConfig() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;
  if (!clientKey || !clientSecret || !redirectUri) {
    throw new Error('TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET and TIKTOK_REDIRECT_URI must be configured');
  }
  return { clientKey, clientSecret, redirectUri };
}

function buildAuthorizeUrl(state) {
  const { clientKey, redirectUri } = requireConfig();
  const params = new URLSearchParams({
    client_key: clientKey,
    scope: SCOPES,
    response_type: 'code',
    redirect_uri: redirectUri,
    state,
  });
  return `${AUTH_BASE}?${params}`;
}

async function exchangeCodeForToken(code) {
  const { clientKey, clientSecret, redirectUri } = requireConfig();
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`TikTok token exchange failed: ${JSON.stringify(data)}`);
  }
  return data; // { access_token, refresh_token, open_id, expires_in, ... }
}

function saveTokens({ access_token, refresh_token, open_id, expires_in }) {
  const expiresAt = Date.now() + expires_in * 1000;
  db.prepare(
    `INSERT INTO tiktok_tokens (id, access_token, refresh_token, open_id, expires_at)
     VALUES (1, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       access_token = excluded.access_token,
       refresh_token = excluded.refresh_token,
       open_id = excluded.open_id,
       expires_at = excluded.expires_at`
  ).run(access_token, refresh_token, open_id, expiresAt);
}

async function getValidAccessToken() {
  const row = db.prepare('SELECT * FROM tiktok_tokens WHERE id = 1').get();
  if (!row) return null;

  if (Date.now() < row.expires_at - 60_000) {
    return row.access_token;
  }

  const { clientKey, clientSecret } = requireConfig();
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: row.refresh_token,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`TikTok token refresh failed: ${JSON.stringify(data)}`);
  }
  saveTokens(data);
  return data.access_token;
}

async function fetchOwnAccountStats() {
  const accessToken = await getValidAccessToken();
  if (!accessToken) throw new Error('No TikTok account connected yet');

  const params = new URLSearchParams({
    fields: 'open_id,display_name,follower_count,likes_count,video_count',
  });
  const res = await fetch(`${USER_INFO_URL}?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok || data.error?.code !== 'ok') {
    throw new Error(`TikTok user info failed: ${JSON.stringify(data)}`);
  }

  const user = data.data.user;
  return {
    externalId: user.open_id,
    displayName: user.display_name,
    followerCount: user.follower_count,
    likesCount: user.likes_count,
    videoCount: user.video_count,
  };
}

function isConnected() {
  return !!db.prepare('SELECT 1 FROM tiktok_tokens WHERE id = 1').get();
}

module.exports = {
  buildAuthorizeUrl,
  exchangeCodeForToken,
  saveTokens,
  fetchOwnAccountStats,
  isConnected,
};

# Subscriber Dashboard

Pulls your YouTube and TikTok channel stats into one place so you can watch
subscriber/follower growth over time, instead of checking two apps
separately.

## What it does

- Polls the YouTube Data API and TikTok API on a schedule (default every 6
  hours) and stores a timestamped snapshot of subscriber/follower count,
  views, videos, and likes in a local SQLite database.
- Serves a dashboard (`http://localhost:3000`) showing current counts,
  7-day growth deltas, and a 30-day history chart per channel.
- Lets you add any **public** YouTube channel by ID or `@handle` — no login
  needed, since channel stats are public data.
- Lets you connect **your own** TikTok account via OAuth — TikTok's API only
  exposes follower stats for the account that explicitly authorizes the app,
  there's no way to look up an arbitrary creator's TikTok stats by handle.

## Requirements

- Node.js 22.5+ (uses the built-in `node:sqlite` module, no native
  dependencies to compile).

## Setup

```bash
cd subscriber-dashboard
npm install
cp .env.example .env
```

### 1. YouTube Data API key (takes 2 minutes)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/), create
   or select a project.
2. **APIs & Services → Library** → enable "YouTube Data API v3".
3. **APIs & Services → Credentials** → **Create credentials → API key**.
4. Paste it into `.env` as `YOUTUBE_API_KEY`.

That's it — no OAuth, since subscriber counts on public channels are public
data.

### 2. TikTok Developer app (takes ~10–15 minutes, optional)

TikTok's API does not offer a simple "look up follower count by username"
endpoint; you must register an app and log in with the account you want to
track.

1. Go to [developers.tiktok.com/apps](https://developers.tiktok.com/apps) and
   create an app.
2. Add the **Login Kit** product, with scopes `user.info.basic` and
   `user.info.stats`. Note: `user.info.stats` (which includes
   `follower_count`) requires your app to pass TikTok's review before it
   works outside of sandbox/test mode — submit for review from the app
   dashboard.
3. Add `http://localhost:3000/auth/tiktok/callback` as a redirect URI (or
   whatever `TIKTOK_REDIRECT_URI` you set for production).
4. Copy the **Client key** and **Client secret** into `.env`.
5. Start the app, click **Connect TikTok** in the dashboard, and log in with
   the account you want to track.

If you skip this section, the app works fine with YouTube-only tracking.

### 3. Run it

```bash
npm start
```

Open `http://localhost:3000`.

## How growth tracking works

Every poll cycle writes a new row to the `snapshots` table rather than
overwriting the previous value, so the dashboard can show a real history —
the "this week" delta compares the latest snapshot to the closest one from
≥7 days ago, and the history chart reads the last 30 days of snapshots.
Growth only becomes visible after the app has been running long enough to
collect more than one data point, so leave it running (or deploy it
somewhere long-lived) rather than running it once and expecting a trend
line immediately.

`POLL_INTERVAL_HOURS` in `.env` controls how often it polls (default 6). A
manual "Refresh" button on each channel card also records a snapshot
on-demand.

## Project layout

```
server/
  index.js              Express app entry point
  db.js                 SQLite schema + connection (node:sqlite)
  services/
    youtubeService.js   YouTube Data API v3 client
    tiktokService.js    TikTok OAuth + user info client
    snapshots.js        Shared "poll a channel, store a snapshot" logic
    scheduler.js         Recurring polling loop
  routes/
    channels.js          REST API: list/add/remove channels, history, refresh
    auth.js               TikTok OAuth redirect + callback
public/
  index.html, app.js, styles.css   Dashboard UI (no build step, no framework)
```

## Notes and limitations

- Data lives in a local SQLite file (`data/subscriber-dashboard.db`). Back it
  up if you care about historical trends — deleting it resets your growth
  history.
- This is built for tracking your own channel(s), running as a single-user
  local/self-hosted tool. It has no multi-user auth of its own; don't expose
  it on the open internet without adding some.
- TikTok tokens are stored unencrypted in the local SQLite file, consistent
  with this being a personal local tool — don't reuse this as-is for a
  multi-tenant or public deployment.

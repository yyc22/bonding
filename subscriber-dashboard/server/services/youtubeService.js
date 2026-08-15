const API_BASE = 'https://www.googleapis.com/youtube/v3';

function apiKey() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error('YOUTUBE_API_KEY is not configured');
  return key;
}

/**
 * Accepts a channel ID (UC...), an @handle, or a legacy /c/ custom URL slug
 * and resolves it to a canonical channel ID + current stats in one call.
 */
async function resolveAndFetchChannel(input) {
  const key = apiKey();
  const trimmed = input.trim();
  const isChannelId = /^UC[\w-]{22}$/.test(trimmed);

  const params = new URLSearchParams({ part: 'snippet,statistics', key });
  if (isChannelId) {
    params.set('id', trimmed);
  } else {
    const handle = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
    params.set('forHandle', handle);
  }

  const res = await fetch(`${API_BASE}/channels?${params}`);
  if (!res.ok) {
    throw new Error(`YouTube API error (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  const item = data.items && data.items[0];
  if (!item) throw new Error(`No YouTube channel found for "${input}"`);

  return {
    externalId: item.id,
    displayName: item.snippet.title,
    subscriberCount: item.statistics.hiddenSubscriberCount ? null : Number(item.statistics.subscriberCount),
    viewCount: Number(item.statistics.viewCount ?? 0),
    videoCount: Number(item.statistics.videoCount ?? 0),
  };
}

async function fetchChannelStats(channelId) {
  const key = apiKey();
  const params = new URLSearchParams({ part: 'snippet,statistics', id: channelId, key });
  const res = await fetch(`${API_BASE}/channels?${params}`);
  if (!res.ok) {
    throw new Error(`YouTube API error (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  const item = data.items && data.items[0];
  if (!item) throw new Error(`YouTube channel ${channelId} not found`);

  return {
    displayName: item.snippet.title,
    subscriberCount: item.statistics.hiddenSubscriberCount ? null : Number(item.statistics.subscriberCount),
    viewCount: Number(item.statistics.viewCount ?? 0),
    videoCount: Number(item.statistics.videoCount ?? 0),
  };
}

module.exports = { resolveAndFetchChannel, fetchChannelStats };

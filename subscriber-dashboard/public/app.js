const grid = document.getElementById('channel-grid');
const toast = document.getElementById('toast');

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.style.display = 'block';
  toast.style.borderColor = isError ? '#ff6b6b' : '#262b36';
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (toast.style.display = 'none'), 4000);
}

function formatCount(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat().format(n);
}

function growthLabel(delta) {
  if (delta == null) return { text: 'No 7-day baseline yet', cls: 'flat' };
  if (delta > 0) return { text: `+${formatCount(delta)} this week`, cls: 'up' };
  if (delta < 0) return { text: `${formatCount(delta)} this week`, cls: 'down' };
  return { text: 'No change this week', cls: 'flat' };
}

async function loadChannels() {
  const res = await fetch('/api/channels');
  const channels = await res.json();

  if (!channels.length) {
    grid.innerHTML = '<p class="empty-state">No channels yet. Add a YouTube channel above or connect TikTok.</p>';
    return;
  }

  grid.innerHTML = '';
  for (const ch of channels) {
    const growth = growthLabel(ch.weeklyGrowth);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-head">
        <span class="badge ${ch.platform}">${ch.platform}</span>
      </div>
      <div class="name">${ch.displayName || ch.externalId}</div>
      <div class="count">${formatCount(ch.subscriberCount)}</div>
      <div class="growth ${growth.cls}">${growth.text}</div>
      <div class="meta">
        ${ch.viewCount != null ? `${formatCount(ch.viewCount)} views · ` : ''}
        ${ch.videoCount != null ? `${formatCount(ch.videoCount)} videos · ` : ''}
        ${ch.capturedAt ? `updated ${new Date(ch.capturedAt + 'Z').toLocaleString()}` : 'never polled'}
      </div>
      <div class="card-actions">
        <button class="secondary" data-action="refresh" data-id="${ch.id}">Refresh</button>
        <button class="secondary" data-action="history" data-id="${ch.id}" data-name="${ch.displayName || ch.externalId}">History</button>
        <button class="secondary" data-action="remove" data-id="${ch.id}">Remove</button>
      </div>
    `;
    grid.appendChild(card);
  }
}

grid.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const { action, id, name } = btn.dataset;

  if (action === 'refresh') {
    btn.disabled = true;
    try {
      await fetch(`/api/channels/${id}/refresh`, { method: 'POST' }).then(assertOk);
      showToast('Refreshed');
      await loadChannels();
    } catch (err) {
      showToast(err.message, true);
    } finally {
      btn.disabled = false;
    }
  }

  if (action === 'remove') {
    if (!confirm('Remove this channel and its history?')) return;
    await fetch(`/api/channels/${id}`, { method: 'DELETE' });
    await loadChannels();
  }

  if (action === 'history') {
    await showHistory(id, name);
  }
});

async function assertOk(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res;
}

document.getElementById('add-youtube-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('youtube-input');
  const value = input.value.trim();
  if (!value) return;

  try {
    await fetch('/api/channels/youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: value }),
    }).then(assertOk);
    input.value = '';
    showToast('Channel added');
    await loadChannels();
  } catch (err) {
    showToast(err.message, true);
  }
});

document.getElementById('connect-tiktok').addEventListener('click', () => {
  window.location.href = '/auth/tiktok';
});

const historyPanel = document.getElementById('history-panel');
const historyTitle = document.getElementById('history-title');
const historyCanvas = document.getElementById('history-chart');

async function showHistory(channelId, name) {
  const res = await fetch(`/api/channels/${channelId}/history?days=30`);
  const points = await res.json();

  historyTitle.textContent = `${name} — last 30 days`;
  historyPanel.style.display = 'block';
  historyPanel.scrollIntoView({ behavior: 'smooth' });
  drawSparkline(points);
}

function drawSparkline(points) {
  const ctx = historyCanvas.getContext('2d');
  const { width, height } = historyCanvas;
  ctx.clearRect(0, 0, width, height);

  const values = points.map((p) => p.subscriberCount).filter((v) => v != null);
  if (values.length < 2) {
    ctx.fillStyle = '#8b91a0';
    ctx.font = '14px sans-serif';
    ctx.fillText('Not enough data points yet — check back after a few polling cycles.', 12, height / 2);
    return;
  }

  const padding = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const usable = points.filter((p) => p.subscriberCount != null);
  const stepX = (width - padding * 2) / (usable.length - 1);

  ctx.strokeStyle = '#5b8cff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  usable.forEach((p, i) => {
    const x = padding + i * stepX;
    const y = height - padding - ((p.subscriberCount - min) / range) * (height - padding * 2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = '#8b91a0';
  ctx.font = '12px sans-serif';
  ctx.fillText(formatCount(min), 4, height - 8);
  ctx.fillText(formatCount(max), 4, 16);
}

loadChannels();

if (new URLSearchParams(window.location.search).get('connected') === 'tiktok') {
  showToast('TikTok connected');
  history.replaceState({}, '', '/');
}

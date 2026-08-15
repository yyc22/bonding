const { pollAllChannels } = require('./snapshots');

let timer = null;

function start() {
  const hours = Number(process.env.POLL_INTERVAL_HOURS || 6);
  const intervalMs = hours * 60 * 60 * 1000;

  const run = async () => {
    const results = await pollAllChannels();
    const timestamp = new Date().toISOString();
    for (const r of results) {
      if (r.ok) {
        console.log(`[scheduler] ${timestamp} ${r.channel.platform}:${r.channel.display_name} -> ok`);
      } else {
        console.error(`[scheduler] ${timestamp} ${r.channel.platform}:${r.channel.display_name} -> ${r.error}`);
      }
    }
  };

  // Run once shortly after boot, then on the configured interval.
  setTimeout(run, 5_000);
  timer = setInterval(run, intervalMs);
  console.log(`[scheduler] polling every ${hours}h`);
}

function stop() {
  if (timer) clearInterval(timer);
}

module.exports = { start, stop };

const path = require('node:path');

try {
  process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch {
  // .env is optional locally (e.g. when vars are injected by the host instead)
}

const express = require('express');
const channelsRouter = require('./routes/channels');
const authRouter = require('./routes/auth');
const scheduler = require('./services/scheduler');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/channels', channelsRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Subscriber dashboard listening on http://localhost:${PORT}`);
  scheduler.start();
});

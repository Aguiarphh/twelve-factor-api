'use strict';

const express = require('express');

const PORT     = process.env.PORT     || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const APP_NAME = process.env.APP_NAME || 'twelve-factor-api';

const app = express();
app.use(express.json());

// Structured JSON log to stdout (Factor XI)
function log(level, message, meta = {}) {
  process.stdout.write(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    app: APP_NAME,
    env: NODE_ENV,
    message,
    ...meta,
  }) + '\n');
}

app.get('/', (_req, res) => {
  log('info', 'Root endpoint accessed');
  res.json({ message: 'Twelve-Factor API is running', docs: '/health' });
});

app.get('/health', (_req, res) => {
  log('info', 'Health check requested', { path: '/health' });
  res.json({
    status: 'ok',
    app: APP_NAME,
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
  });
});

// Port comes from the environment (Factor VII)
const server = app.listen(PORT, () => {
  log('info', 'Server started', { port: PORT });
});

// Graceful shutdown on SIGTERM/SIGINT (Factor IX)
function shutdown(signal) {
  log('info', `${signal} received, shutting down gracefully`);
  server.close(() => {
    log('info', 'Server closed, exiting');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

module.exports = app;

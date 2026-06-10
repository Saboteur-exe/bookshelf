'use strict';

const express = require('express');
const cors = require('cors');
const { init } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.path}`);
  
  next();
});

init();

app.use('/api/auth',   require('./routes/auth'));
app.use('/api/users',  require('./routes/users'));
app.use('/api/books',  require('./routes/books'));
app.use('/api/genres', require('./routes/genres'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.use((_req, res) => res.status(404).json({ message: 'Маршрут не найден' }));

app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`[server] BookShelf API → http://localhost:${PORT}`);
  console.log(`[server] Health check  → http://localhost:${PORT}/api/health`);
});

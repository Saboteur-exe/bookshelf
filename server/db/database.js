'use strict';

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'bookshelf.db');

const db = new Database(DB_PATH);

function init() {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      email       TEXT    NOT NULL UNIQUE,
      password    TEXT    NOT NULL,
      avatar      TEXT    NOT NULL DEFAULT '',
      created_at  TEXT    NOT NULL DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS genres (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL UNIQUE,
      description TEXT    NOT NULL DEFAULT '',
      color       TEXT    NOT NULL DEFAULT '#c8a96e'
    );

    CREATE TABLE IF NOT EXISTS books (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title       TEXT    NOT NULL,
      author      TEXT    NOT NULL,
      genre       TEXT    NOT NULL DEFAULT '',
      year        INTEGER NOT NULL DEFAULT 0,
      pages       INTEGER NOT NULL DEFAULT 0,
      status      TEXT    NOT NULL DEFAULT 'wishlist'
                          CHECK(status IN ('read', 'reading', 'wishlist')),
      rating      INTEGER NOT NULL DEFAULT 0
                          CHECK(rating BETWEEN 0 AND 5),
      description TEXT    NOT NULL DEFAULT '',
      cover       TEXT    NOT NULL DEFAULT '',
      added_at    TEXT    NOT NULL DEFAULT (date('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_books_user   ON books(user_id);
    CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
    CREATE INDEX IF NOT EXISTS idx_books_genre  ON books(genre);
  `);

  console.log('[db] SQLite ready at', DB_PATH);
}

module.exports = { db, init };

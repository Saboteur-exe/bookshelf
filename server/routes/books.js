'use strict';

const express = require('express');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

const VALID_STATUSES = ['read', 'reading', 'wishlist'];

router.get('/', (req, res) => {
    const { status, genre, search } = req.query;

    let query = 'SELECT * FROM books WHERE user_id = ?';
    const params = [req.userId];

    if (status && VALID_STATUSES.includes(status)) {
        query += ' AND status = ?';

        params.push(status);
    }

    if (genre) {
        query += ' AND genre = ?';

        params.push(genre);
    }

    if (search) {
        query += ' AND (title LIKE ? OR author LIKE ?)';

        params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY added_at DESC';

    const books = db.prepare(query).all(...params);

    res.json(books);
});

router.get('/:id', (req, res) => {
    const book = db.prepare(
        'SELECT * FROM books WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId);

    if (!book) return res.status(404).json({ message: 'Книга не найдена' });

    res.json(book);
});

router.post('/', (req, res) => {
    const { title, author, genre, year, pages, status, rating, description, cover } = req.body;

    if (!title || !author)
        return res.status(400).json({ message: 'Название и автор обязательны' });

    if (status && !VALID_STATUSES.includes(status))
        return res.status(400).json({ message: 'Некорректный статус' });

    const today = new Date().toISOString().split('T')[0];

    const result = db.prepare(`
    INSERT INTO books (user_id, title, author, genre, year, pages, status, rating, description, cover, added_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        req.userId,
        title,
        author,
        genre || '',
        year || 0,
        pages || 0,
        status || 'wishlist',
        status === 'read' ? (rating || 0) : 0,
        description || '',
        cover || '',
        today
    );

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(book);
});

router.put('/:id', (req, res) => {
    const existing = db.prepare(
        'SELECT id FROM books WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId);

    if (!existing) return res.status(404).json({ message: 'Книга не найдена' });

    const { title, author, genre, year, pages, status, rating, description, cover } = req.body;

    if (!title || !author)
        return res.status(400).json({ message: 'Название и автор обязательны' });

    if (status && !VALID_STATUSES.includes(status))
        return res.status(400).json({ message: 'Некорректный статус' });

    db.prepare(`
    UPDATE books SET title=?, author=?, genre=?, year=?, pages=?, status=?, rating=?, description=?, cover=?
    WHERE id = ? AND user_id = ?
  `).run(
        title, author, genre || '', year || 0, pages || 0,
        status || 'wishlist',
        status === 'read' ? (rating || 0) : 0,
        description || '', cover || '',
        req.params.id, req.userId
    );

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);

    res.json(book);
});

router.patch('/:id', (req, res) => {
    const existing = db.prepare(
        'SELECT * FROM books WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId);

    if (!existing) return res.status(404).json({ message: 'Книга не найдена' });

    const allowed = ['title', 'author', 'genre', 'year', 'pages', 'status', 'rating', 'description', 'cover'];
    const fields = [];
    const values = [];

    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            if (key === 'status' && !VALID_STATUSES.includes(req.body[key]))
                return res.status(400).json({ message: 'Некорректный статус' });

            fields.push(`${key} = ?`);
            values.push(req.body[key]);
        }
    }

    if (req.body.status && req.body.status !== 'read' && req.body.rating === undefined) {
        fields.push('rating = ?');
        values.push(0);
    }

    if (fields.length === 0) return res.status(400).json({ message: 'Нет полей для обновления' });

    values.push(req.params.id, req.userId);

    db.prepare(`UPDATE books SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);

    res.json(book);
});

router.delete('/:id', (req, res) => {
    const existing = db.prepare(
        'SELECT id FROM books WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId);

    if (!existing) return res.status(404).json({ message: 'Книга не найдена' });

    db.prepare('DELETE FROM books WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
    
    res.status(204).send();
});

module.exports = router;

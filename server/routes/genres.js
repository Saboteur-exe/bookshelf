'use strict';

const express = require('express');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
    const genres = db.prepare('SELECT * FROM genres ORDER BY name ASC').all();

    res.json(genres);
});

router.post('/', (req, res) => {
    const { name, description, color } = req.body;

    if (!name) return res.status(400).json({ message: 'Название обязательно' });

    const existing = db.prepare('SELECT id FROM genres WHERE name = ?').get(name);

    if (existing) return res.status(409).json({ message: 'Жанр уже существует' });

    const result = db.prepare(
        'INSERT INTO genres (name, description, color) VALUES (?, ?, ?)'
    ).run(name, description || '', color || '#c8a96e');

    const genre = db.prepare('SELECT * FROM genres WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(genre);
});

router.put('/:id', (req, res) => {
    const { name, description, color } = req.body;

    if (!name) return res.status(400).json({ message: 'Название обязательно' });

    const existing = db.prepare('SELECT id FROM genres WHERE id = ?').get(req.params.id);

    if (!existing) return res.status(404).json({ message: 'Жанр не найден' });

    db.prepare(
        'UPDATE genres SET name = ?, description = ?, color = ? WHERE id = ?'
    ).run(name, description || '', color || '#c8a96e', req.params.id);

    const genre = db.prepare('SELECT * FROM genres WHERE id = ?').get(req.params.id);

    res.json(genre);
});

router.delete('/:id', (req, res) => {
    const existing = db.prepare('SELECT id FROM genres WHERE id = ?').get(req.params.id);

    if (!existing) return res.status(404).json({ message: 'Жанр не найден' });

    db.prepare('DELETE FROM genres WHERE id = ?').run(req.params.id);
    
    res.status(204).send();
});

module.exports = router;

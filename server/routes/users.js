'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (id !== req.userId) return res.status(403).json({ message: 'Доступ запрещён' });

    const user = db.prepare(
        'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?'
    ).get(id);

    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    res.json(user);
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (id !== req.userId) return res.status(403).json({ message: 'Доступ запрещён' });

    const { name, email, avatar } = req.body;

    if (!name || !email) return res.status(400).json({ message: 'name и email обязательны' });

    db.prepare(
        'UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?'
    ).run(name, email, avatar || '', id);

    const updated = db.prepare(
        'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?'
    ).get(id);

    res.json(updated);
});

router.patch('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (id !== req.userId) return res.status(403).json({ message: 'Доступ запрещён' });

    const allowed = ['name', 'avatar'];
    const fields = [];
    const values = [];

    for (const key of allowed) {
        if (req.body[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(req.body[key]);
        }
    }

    if (req.body.password) {
        if (req.body.password.length < 6)
            return res.status(400).json({ message: 'Пароль должен быть не менее 6 символов' });

        fields.push('password = ?');
        values.push(bcrypt.hashSync(req.body.password, 10));
    }

    if (fields.length === 0) return res.status(400).json({ message: 'Нет полей для обновления' });

    values.push(id);
    
    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    const updated = db.prepare(
        'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?'
    ).get(id);

    res.json(updated);
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (id !== req.userId) return res.status(403).json({ message: 'Доступ запрещён' });

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    res.status(204).send();
});

module.exports = router;

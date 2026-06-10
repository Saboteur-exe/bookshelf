'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db/database');
const { signToken, authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: 'Все поля обязательны' });

    if (password.length < 6)
        return res.status(400).json({ message: 'Пароль должен быть не менее 6 символов' });

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    if (existing)
        return res.status(409).json({ message: 'Email уже используется' });

    const hash = bcrypt.hashSync(password, 10);
    const today = new Date().toISOString().split('T')[0];

    const result = db.prepare(
        'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)'
    ).run(name, email, hash, today);

    const user = db.prepare(
        'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?'
    ).get(result.lastInsertRowid);

    const token = signToken(user.id);

    res.status(201).json({ token, user });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email и пароль обязательны' });

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user || !bcrypt.compareSync(password, user.password))
        return res.status(401).json({ message: 'Неверный email или пароль' });

    const { password: _pw, ...safeUser } = user;
    const token = signToken(user.id);
    
    res.json({ token, user: safeUser });
});

router.get('/me', authMiddleware, (req, res) => {
    const user = db.prepare(
        'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?'
    ).get(req.userId);

    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    res.json(user);
});

module.exports = router;

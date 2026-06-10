'use strict';

const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'bookshelf_secret';

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer '))
        return res.status(401).json({ message: 'Токен не предоставлен' });

    const token = header.slice(7);

    try {
        const payload = jwt.verify(token, SECRET);

        req.userId = payload.userId;
        
        next();
    } catch {
        return res.status(401).json({ message: 'Токен недействителен или истёк' });
    }
};

const signToken = (userId) =>
    jwt.sign({ userId }, SECRET, { expiresIn: '7d' });

module.exports = { authMiddleware, signToken };

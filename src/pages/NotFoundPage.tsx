import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '5rem', marginBottom: '16px' }}>📕</div>
            <h1 style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', fontSize: '4rem', margin: '0 0 8px' }}>404</h1>
            <h2 style={{ color: 'var(--fg3)', margin: '0 0 16px' }}>Страница не найдена</h2>
            <p style={{ color: 'var(--fg4)', maxWidth: '360px', lineHeight: 1.7, marginBottom: '32px' }}>
                Похоже, эта страница пропала, как закладка из книги. Вернитесь на главную.
            </p>
            <Button onClick={() => navigate('/')}>← На главную</Button>
        </div>
    );
};

export default NotFoundPage;

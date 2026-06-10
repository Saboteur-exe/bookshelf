import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../utils/hooks';

const LandingPage: React.FC = () => {
    const isAuthenticated = useAppSelector(s => s.user.isAuthenticated);

    return (
        <div style={{ minHeight: '100vh' }}>
            <section style={{ maxWidth: 960, margin: '0 auto', padding: '100px 32px 60px', textAlign: 'center' }}>
                <div style={{ fontSize: '5rem', marginBottom: '24px', filter: 'drop-shadow(0 0 40px rgba(200,169,110,0.4))' }}>📚</div>
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--accent)', margin: '0 0 16px', lineHeight: 1.2 }}>
                    Ваша личная<br />библиотека
                </h1>
                <p style={{ color: 'var(--fg4)', fontSize: '1.2rem', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
                    Ведите коллекцию прочитанных книг, планируйте чтение и отслеживайте прогресс в одном месте.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {isAuthenticated ? (
                        <Link to='/books' style={{ background: 'var(--accent)', color: 'var(--accent-dark)', padding: '14px 36px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>
                            Открыть библиотеку →
                        </Link>
                    ) : (
                        <>
                            <Link to='/register' style={{ background: 'var(--accent)', color: 'var(--accent-dark)', padding: '14px 36px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>
                                Начать бесплатно
                            </Link>
                            <Link to='/login' style={{ background: 'transparent', color: 'var(--accent)', padding: '14px 36px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', border: '1px solid var(--border)' }}>
                                Войти
                            </Link>
                        </>
                    )}
                </div>
            </section>

            <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 32px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                {[
                    { icon: '📖', title: 'Каталог книг', desc: 'Добавляйте книги, отмечайте статус: читаю, прочитано, хочу прочитать.' },
                    { icon: '⭐', title: 'Рейтинги', desc: 'Оценивайте прочитанные книги и всегда помните что понравилось.' },
                    { icon: '📊', title: 'Статистика', desc: 'Наглядная аналитика: сколько книг прочитано, любимые жанры.' },
                    { icon: '🏷️', title: 'Жанры', desc: 'Организуйте коллекцию по жанрам и находите похожие книги.' },
                ].map(f => (
                    <div key={f.title} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{f.icon}</div>
                        <h3 style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', margin: '0 0 8px' }}>{f.title}</h3>
                        <p style={{ color: 'var(--fg4)', margin: 0, lineHeight: 1.6, fontSize: '0.9rem' }}>{f.desc}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default LandingPage;

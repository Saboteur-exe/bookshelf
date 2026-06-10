import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchBooks } from '../store/slices/booksSlice';

const StatsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const books = useAppSelector(s => s.books.items);

    useEffect(() => {
        if (books.length === 0) dispatch(fetchBooks());
    }, [dispatch, books.length]);

    const readBooks = books.filter(b => b.status === 'read');
    const totalPages = readBooks.reduce((sum, b) => sum + b.pages, 0);
    const ratedBooks = readBooks.filter(b => b.rating > 0);
    const avgRating = ratedBooks.length
        ? (ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length).toFixed(1)
        : '—';

    const genreCounts: Record<string, number> = {};

    books.forEach(b => {
        if (b.genre) genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
    });

    const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const maxCount = topGenres[0]?.[1] || 1;

    const topRated = [...readBooks]
        .filter(b => b.rating > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

    const summary = [
        { icon: '✅', label: 'Прочитано', value: readBooks.length },
        { icon: '📖', label: 'Читаю сейчас', value: books.filter(b => b.status === 'reading').length },
        { icon: '🔖', label: 'В вишлисте', value: books.filter(b => b.status === 'wishlist').length },
        { icon: '📄', label: 'Страниц прочитано', value: totalPages.toLocaleString() },
        { icon: '⭐', label: 'Средняя оценка', value: avgRating },
        { icon: '📚', label: 'Всего книг', value: books.length }
    ];

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
            <h1 style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', marginBottom: '32px' }}>📊 Статистика чтения</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '40px' }}>
                {summary.map(s => (
                    <div key={s.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
                        <div style={{ color: 'var(--accent)', fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Georgia, serif' }}>{s.value}</div>
                        <div style={{ color: 'var(--fg4)', fontSize: '0.82rem', marginTop: '4px' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {topGenres.length > 0 && (
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                        <h3 style={{ color: 'var(--accent)', margin: '0 0 20px', fontFamily: 'Georgia, serif' }}>🏷️ Жанры</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {topGenres.map(([genre, count]) => (
                                <div key={genre}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ color: 'var(--fg2)', fontSize: '0.9rem', fontWeight: 600 }}>{genre}</span>
                                        <span style={{ color: 'var(--fg4)', fontSize: '0.85rem' }}>{count}</span>
                                    </div>
                                    <div style={{ background: 'var(--border)', borderRadius: '4px', height: '7px' }}>
                                        <div style={{
                                            background: 'linear-gradient(90deg, var(--accent), #e8c98e)',
                                            height: '100%',
                                            borderRadius: '4px',
                                            width: `${(count / maxCount) * 100}%`,
                                            transition: 'width 0.6s ease'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {topRated.length > 0 && (
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                        <h3 style={{ color: 'var(--accent)', margin: '0 0 20px', fontFamily: 'Georgia, serif' }}>⭐ Топ оценок</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {topRated.map((book, i) => (
                                <div key={book.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ color: 'var(--fg5)', fontWeight: 700, fontSize: '1.1rem', minWidth: '20px' }}>#{i + 1}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ color: 'var(--fg)', fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                                        <div style={{ color: 'var(--fg4)', fontSize: '0.8rem' }}>{book.author}</div>
                                    </div>
                                    <span style={{ color: 'var(--accent)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                                        {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsPage;

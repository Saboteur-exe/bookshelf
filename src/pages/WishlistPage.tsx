import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchBooks, updateBook, deleteBook } from '../store/slices/booksSlice';
import { Book } from '../types';
import BookCard from '../components/BookCard';

const WishlistPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items } = useAppSelector(s => s.books);

    useEffect(() => {
        if (items.length === 0) dispatch(fetchBooks());
    }, [dispatch, items.length]);

    const wishlist = items.filter(b => b.status === 'wishlist');

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', margin: 0 }}>🔖 Список желаний</h1>
                <p style={{ color: 'var(--fg4)', margin: '4px 0 0', fontSize: '0.9rem' }}>
                    {wishlist.length} книг в очереди на прочтение
                </p>
            </div>

            {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--fg5)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔖</div>
                    <p style={{ fontSize: '1.1rem' }}>Список пуст. Добавляйте книги со статусом «Хочу прочитать»!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '20px' }}>
                    {wishlist.map(book => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onEdit={() => {}}
                            onDelete={id => { if (window.confirm('Удалить из вишлиста?')) dispatch(deleteBook(id)); }}
                            onStatusChange={(id, status: Book['status']) => dispatch(updateBook({ id, data: { status } }))}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;

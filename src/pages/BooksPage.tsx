import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchBooks, addBook, updateBook, deleteBook } from '../store/slices/booksSlice';
import { fetchGenres } from '../store/slices/genresSlice';
import { Book } from '../types';
import BookCard from '../components/BookCard';
import BookForm from '../components/BookForm';
import Button from '../ui/Button';
import Input from '../ui/Input';

const BooksPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items } = useAppSelector(s => s.books);
    const isLoading = useAppSelector(s => s.settings.isLoading);
    const genres = useAppSelector(s => s.genres.items);

    const [showForm, setShowForm] = useState(false);
    const [editBook, setEditBook] = useState<Book | null>(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'reading'>('all');
    const [filterGenre, setFilterGenre] = useState('');

    useEffect(() => {
        dispatch(fetchBooks());
        dispatch(fetchGenres());
    }, [dispatch]);

    const handleAdd = async (data: Omit<Book, 'id' | 'user_id' | 'added_at'>) => {
        await dispatch(addBook(data));

        setShowForm(false);
    };

    const handleEdit = async (data: Omit<Book, 'id' | 'user_id' | 'added_at'>) => {
        if (editBook) await dispatch(updateBook({ id: editBook.id, data }));
        
        setEditBook(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Удалить книгу из библиотеки?')) dispatch(deleteBook(id));
    };

    const handleStatusChange = (id: number, status: Book['status']) => {
        dispatch(updateBook({ id, data: { status } }));
    };

    const visible = items
        .filter(b => b.status !== 'wishlist')
        .filter(b => filterStatus === 'all' || b.status === filterStatus)
        .filter(b => !filterGenre || b.genre === filterGenre)
        .filter(b =>
            !search ||
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', margin: 0 }}>📚 Моя библиотека</h1>
                    <p style={{ color: 'var(--fg4)', margin: '4px 0 0', fontSize: '0.9rem' }}>
                        {items.filter(b => b.status !== 'wishlist').length} книг
                    </p>
                </div>
                <Button onClick={() => setShowForm(true)} title='Добавить новую книгу'>
                    + Добавить книгу
                </Button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: '200px', maxWidth: '320px' }}>
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder='🔍 Название или автор...'
                    />
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                    {(['all', 'reading', 'read'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            title={s === 'all' ? 'Все книги' : s === 'reading' ? 'Читаю сейчас' : 'Прочитанные'}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: '1px solid var(--border)',
                                background: filterStatus === s ? 'var(--accent)' : 'transparent',
                                color: filterStatus === s ? 'var(--accent-dark)' : 'var(--accent)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                transition: 'all 0.15s'
                            }}
                        >
                            {s === 'all' ? 'Все' : s === 'reading' ? '▶ Читаю' : '✓ Прочитано'}
                        </button>
                    ))}
                </div>

                <select
                    value={filterGenre}
                    onChange={e => setFilterGenre(e.target.value)}
                    title='Фильтр по жанру'
                    style={{
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        cursor: 'pointer'
                    }}
                >
                    <option value=''>Все жанры</option>
                    {genres.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                </select>
            </div>

            {visible.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--fg5)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
                    <p style={{ fontSize: '1.1rem' }}>
                        {items.length === 0 ? 'Библиотека пуста. Добавьте первую книгу!' : 'Ничего не найдено по фильтрам.'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '20px' }}>
                    {visible.map(book => (
                        <BookCard
                            key={book.id}
                            book={book}
                            onEdit={b => setEditBook(b)}
                            onDelete={handleDelete}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}

            {(showForm || editBook) && (
                <BookForm
                    initial={editBook}
                    onSubmit={editBook ? handleEdit : handleAdd}
                    onClose={() => { setShowForm(false); setEditBook(null); }}
                    loading={isLoading}
                />
            )}
        </div>
    );
};

export default BooksPage;

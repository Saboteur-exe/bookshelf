import React from 'react';
import { Book } from '../types';
import { statusLabel, statusColor, ratingToStars } from '../utils/formatters';
import Button from '../ui/Button';

interface BookCardProps {
    book: Book;
    onEdit: (book: Book) => void;
    onDelete: (id: number) => void;
    onStatusChange: (id: number, status: Book['status']) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete, onStatusChange }) => {
    return (
        <div
            style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'default'
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-hover)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ color: 'var(--fg)', margin: 0, fontSize: '1rem', fontFamily: 'Georgia, serif' }}>
                        {book.title}
                    </h3>
                    <p style={{ color: 'var(--fg3)', margin: '4px 0 0', fontSize: '0.85rem' }}>{book.author}</p>
                </div>
                <span style={{
                    background: statusColor[book.status] + '30',
                    color: statusColor[book.status],
                    border: `1px solid ${statusColor[book.status]}60`,
                    borderRadius: '20px',
                    padding: '3px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    marginLeft: '8px'
                }}>
                    {statusLabel[book.status]}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--fg5)', fontSize: '0.8rem' }}>📖 {book.genre}</span>
                <span style={{ color: 'var(--fg5)', fontSize: '0.8rem' }}>📅 {book.year}</span>
                <span style={{ color: 'var(--fg5)', fontSize: '0.8rem' }}>📄 {book.pages} стр.</span>
            </div>

            {book.status === 'read' && book.rating > 0 && (
                <div style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>{ratingToStars(book.rating)}</div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                {book.status !== 'read' && (
                    <Button
                        variant='ghost'
                        style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                        onClick={() => onStatusChange(book.id, 'read')}
                        title='Отметить как прочитанное'
                    >
                        ✓ Прочитано
                    </Button>
                )}
                {book.status !== 'reading' && (
                    <Button
                        variant='ghost'
                        style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                        onClick={() => onStatusChange(book.id, 'reading')}
                        title='Читаю сейчас'
                    >
                        ▶ Читаю
                    </Button>
                )}
                <Button
                    variant='secondary'
                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                    onClick={() => onEdit(book)}
                    title='Редактировать книгу'
                >
                    ✎ Изменить
                </Button>
                <Button
                    variant='danger'
                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                    onClick={() => onDelete(book.id)}
                    title='Удалить книгу из библиотеки'
                >
                    🗑 Удалить
                </Button>
            </div>
        </div>
    );
};

export default BookCard;

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchGenres, addGenre, deleteGenre } from '../store/slices/genresSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';

const PRESET_COLORS = ['#c8a96e', '#4169E1', '#6A0DAD', '#8B0000', '#2F4F4F', '#3CB371', '#DC143C', '#DAA520', '#20B2AA', '#8B4513'];

const GenresPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const genres = useAppSelector(s => s.genres.items);
    const books = useAppSelector(s => s.books.items);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [color, setColor] = useState('#c8a96e');

    useEffect(() => { dispatch(fetchGenres()); }, [dispatch]);

    const handleAdd = () => {
        if (!name.trim()) return;

        dispatch(addGenre({ name: name.trim(), description: desc.trim(), color }));
        
        setName('');
        setDesc('');
        setColor('#c8a96e');
    };

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
            <h1 style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', marginBottom: '32px' }}>🏷️ Жанры</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                {genres.map(g => {
                    const count = books.filter(b => b.genre === g.name).length;
                    
                    return (
                        <div key={g.id} style={{
                            background: 'var(--card-bg)',
                            border: `1px solid ${g.color}50`,
                            borderRadius: '10px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: g.color, flexShrink: 0 }} />
                                    <span style={{ color: 'var(--fg)', fontWeight: 700 }}>{g.name}</span>
                                </div>
                                <span style={{ background: `${g.color}25`, color: g.color, borderRadius: '12px', padding: '2px 10px', fontSize: '0.78rem', fontWeight: 600 }}>
                                    {count} кн.
                                </span>
                            </div>
                            {g.description && <p style={{ color: 'var(--fg4)', fontSize: '0.85rem', margin: 0 }}>{g.description}</p>}
                            <Button
                                variant='danger'
                                style={{ fontSize: '0.75rem', padding: '4px 10px', alignSelf: 'flex-end', marginTop: '4px' }}
                                onClick={() => dispatch(deleteGenre(g.id))}
                                title='Удалить жанр'
                            >
                                Удалить
                            </Button>
                        </div>
                    );
                })}
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ color: 'var(--accent)', margin: '0 0 18px', fontFamily: 'Georgia, serif' }}>+ Добавить жанр</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <Input label='Название' value={name} onChange={e => setName(e.target.value)} placeholder='Например: Графический роман' />
                    <Input label='Описание' value={desc} onChange={e => setDesc(e.target.value)} placeholder='Краткое описание жанра' />
                    <div>
                        <label style={{ fontSize: '0.85rem', color: 'var(--fg3)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                            Цвет
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {PRESET_COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    title={c}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        background: c,
                                        border: 'none',
                                        cursor: 'pointer',
                                        outline: color === c ? `3px solid ${c}` : 'none',
                                        outlineOffset: '2px',
                                        transition: 'outline 0.15s'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <Button onClick={handleAdd} style={{ alignSelf: 'flex-start' }}>Добавить</Button>
                </div>
            </div>
        </div>
    );
};

export default GenresPage;

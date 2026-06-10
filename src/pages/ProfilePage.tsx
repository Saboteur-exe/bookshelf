import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { updateProfileThunk, logout } from '../store/slices/userSlice';
import { clearBooks } from '../store/slices/booksSlice';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ProfilePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { currentUser } = useAppSelector(s => s.user);
    const isLoading = useAppSelector(s => s.settings.isLoading);
    const books = useAppSelector(s => s.books.items);

    const [name, setName] = useState(currentUser?.name || '');
    const [password, setPassword] = useState('');
    const [saved, setSaved] = useState(false);

    if (!currentUser) return;

    const readCount = books.filter(b => b.status === 'read').length;
    const readingCount = books.filter(b => b.status === 'reading').length;
    const pagesRead = books.filter(b => b.status === 'read').reduce((s, b) => s + b.pages, 0);

    const handleSave = async () => {
        const data: { name?: string; password?: string } = {};

        if (name !== currentUser.name) data.name = name;

        if (password.length >= 6) data.password = password;

        if (Object.keys(data).length === 0) return;

        const result = await dispatch(updateProfileThunk({ id: currentUser.id, data }));

        if (updateProfileThunk.fulfilled.match(result)) {
            setSaved(true);
            setPassword('');
            setTimeout(() => setSaved(false), 2500);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearBooks());
        navigate('/');
    };

    const stats = [
        { icon: '✅', label: 'Прочитано', value: readCount },
        { icon: '📖', label: 'Читаю', value: readingCount },
        { icon: '📚', label: 'Всего', value: books.length },
        { icon: '📄', label: 'Страниц прочитано', value: pagesRead.toLocaleString() }
    ];

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
            <h1 style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', marginBottom: '32px' }}>👤 Личный кабинет</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '36px' }}>
                {stats.map(s => (
                    <div key={s.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
                        <div style={{ color: 'var(--accent)', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Georgia, serif' }}>{s.value}</div>
                        <div style={{ color: 'var(--fg4)', fontSize: '0.82rem', marginTop: '4px' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h2 style={{ color: 'var(--accent)', margin: 0, fontFamily: 'Georgia, serif' }}>Настройки</h2>

                <Input label='Имя' value={name} onChange={e => setName(e.target.value)} />
                <Input label='Email' value={currentUser.email} disabled style={{ opacity: 0.45 }} />
                <Input
                    label='Новый пароль (оставьте пустым, чтобы не менять)'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Минимум 6 символов'
                />
                <Input
                    label='Дата регистрации'
                    value={currentUser.created_at}
                    disabled
                    style={{ opacity: 0.45 }}
                />

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Button onClick={handleSave} loading={isLoading}>
                        {saved ? '✓ Сохранено!' : 'Сохранить'}
                    </Button>
                    <Button variant='danger' onClick={handleLogout} title='Выйти из аккаунта'>
                        Выйти из аккаунта
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

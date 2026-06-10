import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { logout, toggleTheme } from '../store/slices/userSlice';

const Navbar: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, theme } = useAppSelector(s => s.user);

    const handleLogout = () => {
        dispatch(logout());

        navigate('/');
    };

    const navLink = (to: string, label: string) => (
        <Link
            to={to}
            style={{
                color: location.pathname === to ? 'var(--accent)' : 'var(--fg4)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                transition: 'color 0.2s',
                textTransform: 'uppercase'
            }}
        >
            {label}
        </Link>
    );

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'var(--bg)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border)',
            padding: '0 32px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background 0.25s'
        }}>
            <Link to='/' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>📚</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', fontSize: '1.2rem', fontWeight: 700 }}>
                    BookShelf
                </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {isAuthenticated ? (
                    <>
                        {navLink('/books', 'Библиотека')}
                        {navLink('/wishlist', 'Вишлист')}
                        {navLink('/genres', 'Жанры')}
                        {navLink('/stats', 'Статистика')}
                        {navLink('/profile', 'Профиль')}
                        <button
                            onClick={handleLogout}
                            title='Выйти из аккаунта'
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                color: 'var(--accent)',
                                borderRadius: '6px',
                                padding: '5px 14px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <>
                        {navLink('/login', 'Войти')}
                        {navLink('/register', 'Регистрация')}
                    </>
                )}
                <button
                    onClick={() => dispatch(toggleTheme())}
                    title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

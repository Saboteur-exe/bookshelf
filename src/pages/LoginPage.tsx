import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { loginThunk } from '../store/slices/userSlice';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLoading = useAppSelector(s => s.settings.isLoading);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const result = await dispatch(loginThunk({ email, password }));
        
        if (loginThunk.fulfilled.match(result)) navigate('/books');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <span style={{ fontSize: '3rem' }}>📚</span>
                    <h2 style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', margin: '12px 0 4px', fontSize: '1.8rem' }}>Добро пожаловать</h2>
                    <p style={{ color: 'var(--fg4)', margin: 0 }}>Войдите в свой аккаунт</p>
                </div>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Input label='Email' id='email' type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='you@example.com' />
                    <Input
                        label='Пароль'
                        id='password'
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder='••••••••'
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                    <Button fullWidth loading={isLoading} onClick={handleLogin}>Войти</Button>
                    <p style={{ textAlign: 'center', color: 'var(--fg4)', margin: 0, fontSize: '0.9rem' }}>
                        Нет аккаунта?{' '}
                        <Link to='/register' style={{ color: 'var(--accent)' }}>Зарегистрироваться</Link>
                    </p>
                    <p style={{ textAlign: 'center', color: 'var(--fg5)', margin: 0, fontSize: '0.8rem' }}>
                        Демо: demo@books.com / demo123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

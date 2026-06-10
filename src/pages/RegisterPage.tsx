import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { registerThunk } from '../store/slices/userSlice';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegisterPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLoading = useAppSelector(s => s.settings.isLoading);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password) return;
        
        const result = await dispatch(registerThunk({ name, email, password }));
        
        if (registerThunk.fulfilled.match(result)) navigate('/books');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <span style={{ fontSize: '3rem' }}>📚</span>
                    <h2 style={{ color: 'var(--accent)', fontFamily: 'Georgia, serif', margin: '12px 0 4px', fontSize: '1.8rem' }}>Создать аккаунт</h2>
                    <p style={{ color: 'var(--fg4)', margin: 0 }}>Начните собирать свою библиотеку</p>
                </div>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Input label='Имя' id='name' value={name} onChange={e => setName(e.target.value)} placeholder='Ваше имя' />
                    <Input label='Email' id='email' type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='you@example.com' />
                    <Input label='Пароль' id='password' type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Минимум 6 символов' />
                    <Button fullWidth loading={isLoading} onClick={handleRegister}>Зарегистрироваться</Button>
                    <p style={{ textAlign: 'center', color: 'var(--fg4)', margin: 0, fontSize: '0.9rem' }}>
                        Уже есть аккаунт?{' '}
                        <Link to='/login' style={{ color: 'var(--accent)' }}>Войти</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './utils/hooks';
import CommonWrapper from './components/CommonWrapper';
import AuthWrapper from './components/AuthWrapper';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import WishlistPage from './pages/WishlistPage';
import GenresPage from './pages/GenresPage';
import StatsPage from './pages/StatsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import './styles.css';

const ThemedApp: React.FC = () => {
    const theme = useAppSelector(s => s.user.theme);

    useEffect(() => {
        document.body.classList.toggle('light', theme === 'light');
    }, [theme]);

    return (
        <div style={{ minHeight: '100vh', fontFamily: "'Palatino Linotype', Georgia, serif" }}>
            <Navbar />
            <Routes>
                <Route path='/' element={<LandingPage />} />

                <Route element={<AuthWrapper guestOnly />}>
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register' element={<RegisterPage />} />
                </Route>

                <Route element={<AuthWrapper />}>
                    <Route path='/books' element={<BooksPage />} />
                    <Route path='/wishlist' element={<WishlistPage />} />
                    <Route path='/genres' element={<GenresPage />} />
                    <Route path='/stats' element={<StatsPage />} />
                    <Route path='/profile' element={<ProfilePage />} />
                </Route>

                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <CommonWrapper>
                    <ThemedApp />
                </CommonWrapper>
            </BrowserRouter>
        </Provider>
    );
};

export default App;

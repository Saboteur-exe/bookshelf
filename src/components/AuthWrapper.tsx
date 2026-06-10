import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../utils/hooks';

interface AuthWrapperProps {
    guestOnly?: boolean;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ guestOnly = false }) => {
    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);

    if (guestOnly && isAuthenticated) return <Navigate to='/books' replace />;
    
    if (!guestOnly && !isAuthenticated) return <Navigate to='/login' replace />;

    return <Outlet />;
};

export default AuthWrapper;

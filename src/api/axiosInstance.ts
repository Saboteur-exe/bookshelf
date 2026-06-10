import axios from 'axios';
import { storage } from '../utils/storage';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
    const token = storage.get < string > ('token');

    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
 
    return config;
});

api.interceptors.response.use(
    res => res,
    err => {
        const message =
            err.response?.data?.message ||
            err.message ||
            'Неизвестная ошибка сервера';
        
        return Promise.reject(new Error(message));
    }
);

export default api;

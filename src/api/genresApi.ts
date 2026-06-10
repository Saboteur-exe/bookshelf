import api from './axiosInstance';
import { Genre } from '../types';

export const genresApi = {
    getAll: () => api.get < Genre[] > ('/genres'),
    create: (genre: Omit < Genre, 'id' > ) => api.post < Genre > ('/genres', genre),
    update: (id: number, genre: Omit < Genre, 'id' > ) => api.put < Genre > (`/genres/${id}`, genre),
    delete: (id: number) => api.delete(`/genres/${id}`)
};

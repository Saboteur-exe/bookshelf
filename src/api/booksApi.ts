import api from './axiosInstance';
import { Book } from '../types';

interface BooksQuery {
    status ? : string;
    genre ? : string;
    search ? : string;
}

export const booksApi = {
    getAll: (params ? : BooksQuery) =>
        api.get < Book[] > ('/books', { params }),

    getById: (id: number) =>
        api.get < Book > (`/books/${id}`),

    create: (book: Omit < Book, 'id' | 'user_id' | 'added_at' > ) =>
        api.post < Book > ('/books', book),

    update: (id: number, book: Partial < Book > ) =>
        api.put < Book > (`/books/${id}`, book),

    patch: (id: number, fields: Partial < Book > ) =>
        api.patch < Book > (`/books/${id}`, fields),

    delete: (id: number) =>
        api.delete(`/books/${id}`)
};

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    created_at: string;
}

export type BookStatus = 'read' | 'reading' | 'wishlist';

export interface Book {
    id: number;
    user_id: number;
    title: string;
    author: string;
    genre: string;
    year: number;
    pages: number;
    status: BookStatus;
    rating: number;
    description: string;
    cover: string;
    added_at: string;
}

export interface Genre {
    id: number;
    name: string;
    description: string;
    color: string;
}

import api from './axiosInstance';
import { User } from '../types';

export const usersApi = {
    getById: (id: number) =>
        api.get < User > (`/users/${id}`),

    update: (id: number, data: Partial < User > ) =>
        api.put < User > (`/users/${id}`, data),

    patch: (id: number, fields: Partial < User & { password: string } > ) =>
        api.patch < User > (`/users/${id}`, fields),

    delete: (id: number) =>
        api.delete(`/users/${id}`)
};

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import settingsReducer from './slices/settingsSlice';
import booksReducer from './slices/booksSlice';
import genresReducer from './slices/genresSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        settings: settingsReducer,
        books: booksReducer,
        genres: genresReducer
    }
});

export type RootState = ReturnType < typeof store.getState > ;
export type AppDispatch = typeof store.dispatch;

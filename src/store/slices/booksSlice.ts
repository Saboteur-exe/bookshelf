import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book, BookStatus } from '../../types';
import { booksApi } from '../../api/booksApi';
import { setError, setLoading } from './settingsSlice';

interface BooksState {
    items: Book[];
    currentBook: Book | null;
}

const initialState: BooksState = {
    items: [],
    currentBook: null
};

export const fetchBooks = createAsyncThunk(
    'books/fetchAll',
    async (params: { status ? : string;genre ? : string;search ? : string } | undefined, { dispatch, rejectWithValue }) => {
        dispatch(setLoading({ loading: true, message: 'Загрузка книг...' }));

        try {
            const res = await booksApi.getAll(params);

            dispatch(setLoading({ loading: false }));

            return res.data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ошибка загрузки книг';

            dispatch(setError(message));
            dispatch(setLoading({ loading: false }));

            return rejectWithValue(message);
        }
    }
);

export const addBook = createAsyncThunk(
    'books/add',
    async (book: Omit < Book, 'id' | 'user_id' | 'added_at' > , { dispatch, rejectWithValue }) => {
        dispatch(setLoading({ loading: true, message: 'Добавление книги...' }));

        try {
            const res = await booksApi.create(book);

            dispatch(setLoading({ loading: false }));

            return res.data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ошибка добавления';

            dispatch(setError(message));
            dispatch(setLoading({ loading: false }));

            return rejectWithValue(message);
        }
    }
);

export const updateBook = createAsyncThunk(
    'books/update',
    async ({ id, data }: { id: number;data: Partial < Book > }, { dispatch, rejectWithValue }) => {
        dispatch(setLoading({ loading: true, message: 'Сохранение...' }));

        try {
            const res = await booksApi.patch(id, data);

            dispatch(setLoading({ loading: false }));

            return res.data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ошибка обновления';

            dispatch(setError(message));
            dispatch(setLoading({ loading: false }));

            return rejectWithValue(message);
        }
    }
);

export const deleteBook = createAsyncThunk(
    'books/delete',
    async (id: number, { dispatch, rejectWithValue }) => {
        dispatch(setLoading({ loading: true, message: 'Удаление...' }));

        try {
            await booksApi.delete(id);

            dispatch(setLoading({ loading: false }));

            return id;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ошибка удаления';

            dispatch(setError(message));
            dispatch(setLoading({ loading: false }));

            return rejectWithValue(message);
        }
    }
);

const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setCurrentBook(state, action: PayloadAction < Book | null > ) {
            state.currentBook = action.payload;
        },
        clearBooks(state) {
            state.items = [];
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchBooks.fulfilled, (state, action: PayloadAction < Book[] > ) => {
                state.items = action.payload;
            })
            .addCase(addBook.fulfilled, (state, action: PayloadAction < Book > ) => {
                state.items.unshift(action.payload);
            })
            .addCase(updateBook.fulfilled, (state, action: PayloadAction < Book > ) => {
                const idx = state.items.findIndex(b => b.id === action.payload.id);

                if (idx !== -1) state.items[idx] = action.payload;
                
                if (state.currentBook?.id === action.payload.id) state.currentBook = action.payload;
            })
            .addCase(deleteBook.fulfilled, (state, action: PayloadAction < number > ) => {
                state.items = state.items.filter(b => b.id !== action.payload);
            });
    },
});

export const { setCurrentBook, clearBooks } = booksSlice.actions;
export default booksSlice.reducer;

export const selectByStatus = (items: Book[], status: BookStatus) =>
    items.filter(b => b.status === status);

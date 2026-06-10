import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Genre } from '../../types';
import { genresApi } from '../../api/genresApi';
import { setError, setLoading } from './settingsSlice';

interface GenresState {
    items: Genre[];
}

const initialState: GenresState = { items: [] };

export const fetchGenres = createAsyncThunk(
    'genres/fetchAll',
    async (_, { dispatch, rejectWithValue }) => {
        dispatch(setLoading({ loading: true, message: 'Загрузка жанров...' }));
        
        try {
            const res = await genresApi.getAll();

            dispatch(setLoading({ loading: false }));

            return res.data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ошибка загрузки жанров';

            dispatch(setError(message));
            dispatch(setLoading({ loading: false }));

            return rejectWithValue(message);
        }
    }
);

export const addGenre = createAsyncThunk(
    'genres/add',
    async (genre: Omit < Genre, 'id' > , { dispatch, rejectWithValue }) => {
        dispatch(setLoading({ loading: true, message: 'Добавление жанра...' }));

        try {
            const res = await genresApi.create(genre);

            dispatch(setLoading({ loading: false }));

            return res.data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ошибка добавления жанра';

            dispatch(setError(message));
            dispatch(setLoading({ loading: false }));

            return rejectWithValue(message);
        }
    }
);

export const deleteGenre = createAsyncThunk(
    'genres/delete',
    async (id: number, { dispatch, rejectWithValue }) => {
        dispatch(setLoading({ loading: true, message: 'Удаление жанра...' }));

        try {
            await genresApi.delete(id);

            dispatch(setLoading({ loading: false }));

            return id;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Ошибка удаления жанра';

            dispatch(setError(message));
            dispatch(setLoading({ loading: false }));

            return rejectWithValue(message);
        }
    }
);

const genresSlice = createSlice({
    name: 'genres',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchGenres.fulfilled, (state, action: PayloadAction < Genre[] > ) => {
                state.items = action.payload;
            })
            .addCase(addGenre.fulfilled, (state, action: PayloadAction < Genre > ) => {
                state.items.push(action.payload);
            })
            .addCase(deleteGenre.fulfilled, (state, action: PayloadAction < number > ) => {
                state.items = state.items.filter(g => g.id !== action.payload);
            });
    }
});

export default genresSlice.reducer;

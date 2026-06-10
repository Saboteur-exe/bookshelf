import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { authApi } from '../../api/authApi';
import { usersApi } from '../../api/usersApi';
import { storage } from '../../utils/storage';

interface UserState {
    currentUser: User | null;
    isAuthenticated: boolean;
    theme: 'light' | 'dark';
}

const initialState: UserState = {
    currentUser: storage.get < User > ('user'),
    isAuthenticated: !!storage.get < string > ('token'),
    theme: (storage.get < string > ('theme') as 'light' | 'dark') || 'dark'
};

export const loginThunk = createAsyncThunk(
    'user/login',
    async ({ email, password }: { email: string;password: string }, { rejectWithValue }) => {
        try {
            const res = await authApi.login(email, password);

            return res.data;
        } catch (err: unknown) {
            return rejectWithValue(err instanceof Error ? err.message : 'Ошибка входа');
        }
    }
);

export const registerThunk = createAsyncThunk(
    'user/register',
    async ({ name, email, password }: { name: string;email: string;password: string }, { rejectWithValue }) => {
        try {
            const res = await authApi.register(name, email, password);

            return res.data;
        } catch (err: unknown) {
            return rejectWithValue(err instanceof Error ? err.message : 'Ошибка регистрации');
        }
    }
);

export const updateProfileThunk = createAsyncThunk(
    'user/updateProfile',
    async ({ id, data }: { id: number;data: Partial < User > }, { rejectWithValue }) => {
        try {
            const res = await usersApi.patch(id, data);
            
            return res.data;
        } catch (err: unknown) {
            return rejectWithValue(err instanceof Error ? err.message : 'Ошибка обновления');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            state.currentUser = null;
            state.isAuthenticated = false;
            storage.remove('token');
            storage.remove('user');
        },
        toggleTheme(state) {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            storage.set('theme', state.theme);
        }
    },
    extraReducers: builder => {
        const onAuthSuccess = (state: UserState, action: PayloadAction < { token: string;user: User } > ) => {
            state.currentUser = action.payload.user;
            state.isAuthenticated = true;
            storage.set('token', action.payload.token);
            storage.set('user', action.payload.user);
        };

        builder
            .addCase(loginThunk.fulfilled, onAuthSuccess)
            .addCase(registerThunk.fulfilled, onAuthSuccess)
            .addCase(updateProfileThunk.fulfilled, (state, action: PayloadAction < User > ) => {
                state.currentUser = action.payload;
                storage.set('user', action.payload);
            });
    },
});

export const { logout, toggleTheme } = userSlice.actions;
export default userSlice.reducer;

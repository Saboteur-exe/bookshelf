import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginThunk, registerThunk, updateProfileThunk } from './userSlice';

interface SettingsState {
    isLoading: boolean;
    error: string | null;
    showErrorModal: boolean;
    loadingMessage: string;
}

const initialState: SettingsState = {
    isLoading: false,
    error: null,
    showErrorModal: false,
    loadingMessage: 'Загрузка...'
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction < { loading: boolean;message ? : string } > ) {
            state.isLoading = action.payload.loading;
            state.loadingMessage = action.payload.message || 'Загрузка...';
        },
        setError(state, action: PayloadAction < string | null > ) {
            state.error = action.payload;
            state.showErrorModal = !!action.payload;
        },
        closeErrorModal(state) {
            state.showErrorModal = false;
            state.error = null;
        },
    },
    extraReducers: builder => {
        const pendingReducer = (state: SettingsState) => {
            state.isLoading = true;
            state.error = null;
        };
        const fulfilledReducer = (state: SettingsState) => {
            state.isLoading = false;
        };
        const rejectedReducer = (state: SettingsState, action: PayloadAction < unknown > ) => {
            state.isLoading = false;
            state.error = typeof action.payload === 'string' ? action.payload : 'Произошла ошибка';
            state.showErrorModal = true;
        };

        builder
            .addCase(loginThunk.pending, pendingReducer)
            .addCase(loginThunk.fulfilled, fulfilledReducer)
            .addCase(loginThunk.rejected, rejectedReducer as Parameters < typeof builder.addCase > [1])
            .addCase(registerThunk.pending, pendingReducer)
            .addCase(registerThunk.fulfilled, fulfilledReducer)
            .addCase(registerThunk.rejected, rejectedReducer as Parameters < typeof builder.addCase > [1])
            .addCase(updateProfileThunk.pending, pendingReducer)
            .addCase(updateProfileThunk.fulfilled, fulfilledReducer)
            .addCase(updateProfileThunk.rejected, rejectedReducer as Parameters < typeof builder.addCase > [1]);
    },
});

export const { setLoading, setError, closeErrorModal } = settingsSlice.actions;
export default settingsSlice.reducer;

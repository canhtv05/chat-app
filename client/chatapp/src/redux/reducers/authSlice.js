import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import useLocalStorage from '~/hooks/useLocalStorage';
import { getCurrentUser, signin, signup, updateCurrentUser } from '~/services/auth/authService';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { setStorage, deleteStorage, dataStorage } = useLocalStorage();

export const getMyInfo = createAsyncThunk('/auth/me', async (token, { rejectWithValue }) => {
    const [error, data] = await getCurrentUser(token);

    if (error) {
        return rejectWithValue(error?.response?.data);
    }
    return data;
});

export const signUp = createAsyncThunk('/auth/register', async (request, { rejectWithValue }) => {
    const [error, data] = await signup(request);

    if (error) {
        return rejectWithValue(error?.response?.data);
    }
    return data;
});

export const signIn = createAsyncThunk('/auth/login', async (request, { rejectWithValue }) => {
    const [error, data] = await signin(request);

    if (error) {
        return rejectWithValue(error?.response?.data);
    }
    return data;
});

export const updateMyInfo = createAsyncThunk('/auth/me/update', async (request, { rejectWithValue }) => {
    const token = dataStorage.token;
    const [error, data] = await updateCurrentUser(token, request);

    if (error) {
        return rejectWithValue(error?.response?.data);
    }
    return data;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: {},
        isAuth: false,
        error: null,
        loading: false,
    },
    extraReducers: (builder) => {
        builder
            // get my info
            .addCase(getMyInfo.fulfilled, (state, action) => {
                state.isAuth = true;
                state.error = null;
                state.data = { ...state.data, ...action.payload };
            })
            .addCase(getMyInfo.rejected, (state, action) => {
                state.isAuth = false;
                state.error = action.payload;
                state.data = {};
                deleteStorage('token');
            })
            // register
            .addCase(signUp.pending, (state) => {
                state.loading = true;
            })
            .addCase(signUp.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            // login
            .addCase(signIn.pending, (state) => {
                state.loading = true;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                const token = action.payload?.meta?.tokenInfo?.accessToken;
                if (token) {
                    const dataStorage = {
                        token,
                    };
                    setStorage(dataStorage);
                }
                state.error = null;
                state.loading = false;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            // update current user
            .addCase(updateMyInfo.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateMyInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.data = { ...state.data, ...action.payload };
                state.error = null;
            })
            .addCase(updateMyInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;

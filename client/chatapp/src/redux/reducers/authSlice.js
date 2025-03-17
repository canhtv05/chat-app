import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import useLocalStorage from '~/hooks/useLocalStorage';
import { signin, signup } from '~/services/auth/authService';
import { getCurrentUser } from '~/services/user/userService';

// eslint-disable-next-line react-hooks/rules-of-hooks
const { setDataStorage } = useLocalStorage();

export const getMyInfo = createAsyncThunk('/users/my-info', async (token, { rejectWithValue }) => {
    const [error, data] = await getCurrentUser(token);

    if (error) {
        return rejectWithValue(error);
    }
    return data;
});

export const signUp = createAsyncThunk('/auth/sign-up', async (request, { rejectWithValue }) => {
    const [error, data] = await signup(request);

    if (error) {
        return rejectWithValue(error);
    }
    return data;
});

export const signIn = createAsyncThunk('/auth/sign-in', async (request, { rejectWithValue }) => {
    const [error, data] = await signin(request);

    if (error) {
        return rejectWithValue(error);
    }
    return data;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: {},
        isAuth: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyInfo.fulfilled, (state, action) => {
                state.isAuth = true;
                state.error = null;
                state.data = { ...state.data, ...action.payload };
            })
            .addCase(signUp.fulfilled, (state, action) => {
                const token = action.payload.data.token;
                if (token) {
                    const dataStorage = {
                        token,
                    };
                    setDataStorage(dataStorage);
                }
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                const token = action.payload.data.token;
                if (token) {
                    const dataStorage = {
                        token,
                    };
                    setDataStorage(dataStorage);
                }
                state.error = null;
            })
            .addCase(getMyInfo.rejected, (state, action) => {
                state.isAuth = false;
                state.error = action.payload;
                state.data = {};
            })
            .addCase(signUp.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;

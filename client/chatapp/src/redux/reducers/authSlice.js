import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCurrentUser, signin, signup, updateCurrentUser } from '~/services/auth/authService';
import cookieUtil from '~/utils/cookieUtils';

export const getMyInfo = createAsyncThunk('/auth/me', async (_, { rejectWithValue }) => {
    const [error, data] = await getCurrentUser();

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
    const [error, data] = await updateCurrentUser(request);

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
                cookieUtil.deleteStorage();
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
            .addCase(signIn.fulfilled, (state) => {
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

// export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;

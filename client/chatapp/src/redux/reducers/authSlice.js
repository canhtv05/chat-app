import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: {},
    },
    reducers: {
        setAuth(state, action) {
            state.data = { ...state.data, ...action.payload };
        },
        clearAuth(state) {
            state.data = {};
        },
    },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;

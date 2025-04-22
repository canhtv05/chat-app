import { createSlice } from '@reduxjs/toolkit';

const eventSlice = createSlice({
    name: 'event',
    initialState: {
        loading: false,
    },
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
    },
});

export const { setLoading } = eventSlice.actions;
export default eventSlice.reducer;

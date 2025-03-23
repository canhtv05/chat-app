import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        data: {},
    },
    reducers: {
        setInfoCurrentChat(state, action) {
            state.data = action.payload;
        },
        clearInfoCurrentChat(state) {
            state.data = {};
        },
    },
});

export const { setInfoCurrentChat, clearInfoCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'event',
    initialState: {},
});

export const { setInfoCurrentChat, clearInfoCurrentChat, setIdChatOfUser, setLastMessage, updateLastMessage } =
    chatSlice.actions;
export default chatSlice.reducer;

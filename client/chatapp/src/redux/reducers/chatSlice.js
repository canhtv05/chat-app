import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        data: {},
        idChatOfUser: {},
        lastMessages: {},
        currentChat: false,
    },
    reducers: {
        setInfoCurrentChat(state, action) {
            state.data = action.payload;
        },
        clearInfoCurrentChat(state) {
            state.data = {};
        },
        setIdChatOfUser(state, action) {
            state.idChatOfUser = action.payload;
        },
        setLastMessage(state, action) {
            state.lastMessages = action.payload;
        },
        updateLastMessage(state, action) {
            const { chatId, content, user, timestamp } = action.payload;
            const { id, firstName, lastName } = user;

            const oldState = state.lastMessages;
            const newState = {
                ...oldState,
                [chatId]: {
                    content,
                    user: { id, firstName, lastName },
                    timestamp,
                },
            };

            state.lastMessages = newState;
        },
        setCurrentChat(state, action) {
            state.currentChat = action.payload;
        },
    },
});

export const {
    setInfoCurrentChat,
    clearInfoCurrentChat,
    setIdChatOfUser,
    setLastMessage,
    updateLastMessage,
    setCurrentChat,
} = chatSlice.actions;
export default chatSlice.reducer;

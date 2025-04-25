import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        data: {},
        idChatOfUser: {},
        lastMessages: {},
        currentChat: false,
        chats: [],
        isDisableSearch: false,
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
        addLastMessage(state, action) {
            const data = action.payload;

            if (!data || typeof data !== 'object') return;

            const { chatId, content, createdBy, timestamp } = data;

            if (!chatId || !createdBy) return;

            state.lastMessages[chatId] = {
                content,
                user: {
                    id: createdBy.id,
                    firstName: createdBy.firstName,
                    lastName: createdBy.lastName,
                },
                timestamp,
            };
        },
        setCurrentChat(state, action) {
            state.currentChat = action.payload;
        },
        setChats(state, action) {
            state.chats = action.payload;
        },
        updateChats(state, action) {
            const id = action.payload.id;

            const findChatById = state.chats.find((chat) => chat?.id === id);
            if (findChatById) {
                state.chats = state.chats.filter((chat) => chat?.id !== id);
                state.chats = [findChatById, ...state.chats];
            }
        },
        setDisableSearch(state, action) {
            state.isDisableSearch = action.payload;
        },
    },
});

export const {
    setInfoCurrentChat,
    clearInfoCurrentChat,
    setIdChatOfUser,
    setLastMessage,
    addLastMessage,
    updateLastMessage,
    setCurrentChat,
    setChats,
    setDisableSearch,
    updateChats,
} = chatSlice.actions;
export default chatSlice.reducer;

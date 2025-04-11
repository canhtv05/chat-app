import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/authSlice';
import chatReducer from './reducers/chatSlice';
import themeReducer from './reducers/themeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        theme: themeReducer,
    },
});

export default store;

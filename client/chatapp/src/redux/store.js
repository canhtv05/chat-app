import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/authSlice';
import chatReducer from './reducers/chatSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
    },
});

export default store;

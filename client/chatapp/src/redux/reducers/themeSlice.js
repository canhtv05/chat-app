import { createSlice } from '@reduxjs/toolkit';
import config from '~/configs';

const key = config.storage.key;

const getDataStorage = () => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
};

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        theme: getDataStorage()?.theme || 'dracula',
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            const dataStorage = getDataStorage();
            dataStorage.theme = action.payload;
            const jsonData = JSON.stringify(dataStorage);
            localStorage.setItem(key, jsonData);
            document.documentElement.setAttribute('data-theme', action.payload);
        },
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;

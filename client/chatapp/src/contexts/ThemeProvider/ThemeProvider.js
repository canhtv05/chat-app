import { createContext, useEffect, useState } from 'react';
import useLocalStorage from '~/hooks/useLocalStorage';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const { dataStorage, setStorage } = useLocalStorage();
    const [isDark, setIsDark] = useState(dataStorage.theme === 'dark');

    const setDarkMode = () => {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        setIsDark(true);
    };

    const setLightMode = () => {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        setIsDark(false);
    };

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    useEffect(() => {
        const dataThem = {
            theme: 'light',
        };

        if (isDark) {
            dataThem.theme = 'dark';
            setDarkMode();
        } else {
            dataThem.theme = 'light';
            setLightMode();
        }

        setStorage(dataThem);
    }, [isDark, setStorage]);

    const value = {
        isDark,
        setDarkMode,
        setLightMode,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { ThemeProvider, ThemeContext };

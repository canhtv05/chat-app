import { createContext, useEffect, useState } from 'react';
import useLocalStorage from '~/hooks/useLocalStorage';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const { dataStorage, setStorage } = useLocalStorage();

    const defaultTheme = dataStorage.theme || 'dark';
    const [isDark, setIsDark] = useState(defaultTheme === 'dark');

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
        setIsDark((prev) => !prev);
    };

    useEffect(() => {
        const dataThem = {
            theme: isDark ? 'dark' : 'light',
        };

        if (isDark) {
            setDarkMode();
        } else {
            setLightMode();
        }

        setStorage(dataThem);
    }, [isDark, setStorage]);

    useEffect(() => {
        if (defaultTheme === 'dark') {
            setDarkMode();
        } else {
            setLightMode();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = {
        isDark,
        setDarkMode,
        setLightMode,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { ThemeProvider, ThemeContext };

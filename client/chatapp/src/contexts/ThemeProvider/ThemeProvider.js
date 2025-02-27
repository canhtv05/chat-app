import { createContext, useEffect, useState } from 'react';
import useLocalStorage from '~/hooks/useLocalStorage';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const { dataStorage, setStorage } = useLocalStorage();
    const [isDark, setIsDark] = useState((dataStorage.theme = 'dark'));

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
        if (isDark) {
            setLightMode();
        } else {
            setDarkMode();
        }
    };

    useEffect(() => {
        const theme = isDark ? 'dark' : 'light';
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
        setStorage({ theme });
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

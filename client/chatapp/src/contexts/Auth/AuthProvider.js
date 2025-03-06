import { createContext } from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import GlobalStyles from '~/components/GlobalStyle/GlobalStyles';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const data = { gender: true, dob: '2005-10-17', phone: '20850804', first_name: 'Tran', last_name: 'Duc Bo' };

    return (
        <ThemeProvider>
            <GlobalStyles>
                <AuthContext.Provider value={{ data }}>{children}</AuthContext.Provider>
            </GlobalStyles>
        </ThemeProvider>
    );
}

export { AuthProvider, AuthContext };

import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setAuth } from '~/redux/reducers/authSlice';
import { ThemeProvider } from '../ThemeProvider';
import GlobalStyles from '~/components/GlobalStyle';

const AuthContext = createContext();

function AuthProvider({ children }) {
    // eslint-disable-next-line no-unused-vars
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const data = { gender: true, dob: '2005-10-17', phone: '20850804', first_name: 'Tran', last_name: 'Duc Bo' };
        dispatch(setAuth(data));
    }, [dispatch]);

    return (
        <ThemeProvider>
            <GlobalStyles>
                <AuthContext.Provider value={isLogin}>{children}</AuthContext.Provider>
            </GlobalStyles>
        </ThemeProvider>
    );
}

export { AuthProvider, AuthContext };

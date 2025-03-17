import { ThemeProvider } from '../ThemeProvider';
import GlobalStyles from '~/components/GlobalStyle';

function ContextProvider({ children }) {
    return (
        <ThemeProvider>
            <GlobalStyles>{children}</GlobalStyles>
        </ThemeProvider>
    );
}

export default ContextProvider;

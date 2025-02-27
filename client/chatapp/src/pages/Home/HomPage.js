import { Button } from '@mui/material';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/ThemeProvider/ThemeProvider';

function HomePage() {
    const { toggleTheme } = useContext(ThemeContext);

    return <div>{/* <Button onClick={() => toggleTheme()}>ok</Button> */}</div>;
}

export default HomePage;

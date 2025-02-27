import { Button } from '@mui/joy';
import { useContext } from 'react';

import { ThemeContext } from '~/contexts/ThemeProvider/ThemeProvider';

function Main() {
    const { toggleTheme } = useContext(ThemeContext);

    return (
        <div>
            <Button onClick={() => toggleTheme()}>ok</Button>
        </div>
    );
}

export default Main;

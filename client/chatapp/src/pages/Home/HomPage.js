import { Button } from '@mui/material';
import { useContext } from 'react';
import { ThemeContext } from '~/contexts/ThemeProvider/ThemeProvider';

function HomePage() {
    const { toggleTheme } = useContext(ThemeContext);

    return (
        <div>
            <div className="py-14 bg-cta w-full"></div>
            <div className="flex bg-[#f0f2f5] h-[94vh]">
                <div className="left w-[30%] bg-[#e8c9ec] h-full"></div>
                <div className="right">
                    <Button onClick={() => toggleTheme()}>ok</Button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;

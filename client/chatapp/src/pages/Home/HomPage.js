import { Button } from '@mui/material';
import { useContext } from 'react';
import Modal from '~/components/Modals/Modal';
import Profile from '~/components/Profile/Profile';
import { ThemeContext } from '~/contexts/ThemeProvider/ThemeProvider';

function HomePage() {
    const { toggleTheme } = useContext(ThemeContext);

    return <div className="m-auto">{/* <Profile /> */}</div>;
}

export default HomePage;

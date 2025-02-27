import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './Mybutton.css';

function MyButton({ children, active = false, ...props }) {
    const [isActive, setIsActive] = useState(active);

    useEffect(() => {
        setIsActive(active);
    }, [active]);

    return (
        <div className={isActive ? 'active rounded-xl' : ''}>
            <Button {...props} sx={{ borderRadius: '0.75rem', width: '100%', height: '100%', minHeight: '64px' }}>
                {children}
            </Button>
        </div>
    );
}

MyButton.propTypes = {
    children: PropTypes.node.isRequired,
    active: PropTypes.bool,
};

export default MyButton;

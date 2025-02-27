import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './Mybutton.css';

function MyButton({ children, active = false, minHeight = 64, minWidth = 64, ...props }) {
    const [isActive, setIsActive] = useState(active);

    useEffect(() => {
        setIsActive(active);
    }, [active]);

    return (
        <div className={isActive ? 'active rounded-xl' : ''}>
            <Button {...props} sx={{ borderRadius: '0.75rem', width: '100%', height: '100%', minHeight, minWidth }}>
                {children}
            </Button>
        </div>
    );
}

MyButton.propTypes = {
    children: PropTypes.node.isRequired,
    active: PropTypes.bool,
    minHeight: PropTypes.number,
    minWidth: PropTypes.number,
};

export default MyButton;

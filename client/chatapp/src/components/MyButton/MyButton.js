import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './Mybutton.css';

function MyButton({ className, children, active = false, minHeight = 64, minWidth = 64, isRounded, ...props }) {
    const [isActive, setIsActive] = useState(active);

    useEffect(() => {
        setIsActive(active);
    }, [active]);

    return (
        <div
            className={`${
                isActive ? 'active' : `hover:bg-background transition-all ease-in-out duration-500`
            } rounded-xl ${className}`}
            style={isRounded && { borderRadius: '50%' }}
        >
            <Button
                {...props}
                sx={{
                    borderRadius: `${isRounded ? '50%' : '0.75rem'}`,
                    width: '90%',
                    height: '90%',
                    minHeight,
                    minWidth,
                }}
            >
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
    isRounded: PropTypes.bool,
};

export default MyButton;

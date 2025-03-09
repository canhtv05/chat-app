import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './Mybutton.css';

function MyButton({ className, children, active = false, size = 'md', isRounded, width = 64, height = 64, ...props }) {
    const [isActive, setIsActive] = useState(active);
    const [minWidth, setMinWidth] = useState(width);
    const [minHeight, setMinHeight] = useState(height);

    useEffect(() => {
        if (size === 'sm') {
            setMinHeight(40);
            setMinWidth(40);
        }
    }, [size]);

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
    isRounded: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    size: PropTypes.oneOf(['sm', 'md']),
};

export default MyButton;

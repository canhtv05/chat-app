import { Button } from '@mui/joy';
import { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import PropTypes from 'prop-types';

import './Mybutton.css';

function MyButton({
    className,
    loading = false,
    children,
    active = false,
    size = 'md',
    isRounded,
    width = 64,
    height = 64,
    ...props
}) {
    const [isActive, setIsActive] = useState(active);
    const [minWidth, setMinWidth] = useState(width);
    const [minHeight, setMinHeight] = useState(height);

    const LoadingIcon = () => {
        return <AiOutlineLoading className="animate-spin text-3xl text-base-content" />;
    };

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
            className={`flex justify-center items-center transition-all ease-in-out duration-300 ${
                isActive ? 'bg-base-200' : `hover:bg-base-100`
            } rounded-xl ${className} ${loading ? 'pointer-events-none pl-3' : 'hover:bg-base-100'}`}
            style={isRounded && { borderRadius: '50%' }}
        >
            {loading && <LoadingIcon />}
            <Button
                disabled={loading}
                {...props}
                sx={{
                    borderRadius: `${isRounded ? '50%' : '0.75rem'}`,
                    width: '90%',
                    height: '90%',
                    minHeight,
                    minWidth,
                    opacity: loading && '0.1',
                    background: 'transparent',
                    padding: 0,
                    ':hover': {
                        background: 'oklch(var(--b3))',
                    },
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

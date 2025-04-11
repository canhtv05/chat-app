import { createPortal } from 'react-dom';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/joy';
import MyButton from '../MyButton/MyButton';
import { IoCloseSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function ModalLink({ children, title, outline = false, delay = 200 }) {
    const contentRef = useRef(null);
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const time = setTimeout(() => setIsVisible(true), delay);

        return () => clearTimeout(time);
    }, [delay]);

    const handleClose = useCallback(() => {
        setIsVisible(false);

        const time = setTimeout(() => {
            setIsMounted(false);
            navigate(-1);
        }, delay);

        return () => clearTimeout(time);
    }, [navigate, delay]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (contentRef.current && !contentRef.current.contains(event.target)) {
                handleClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClose]);

    if (!isMounted) return null;

    return createPortal(
        <div
            className={`fixed top-0 left-0 w-full h-full bg-black/40 z-40 transition-opacity duration-${delay} ease-in-out`}
        >
            <div
                ref={contentRef}
                className={`
                    absolute min-w-[450px] min-h-[100px] z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    bg-base-200 rounded
                    ${outline ? 'border-base-300 border-2' : ''} 
                    transition-all duration-${delay} ease-in-out
                    ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
                `}
            >
                <Card sx={{ background: 'var(--color-base-200)', padding: '0' }} orientation="vertical" variant="soft">
                    <div className="relative">
                        <div className="flex justify-between items-center px-4 py-2 font-semibold border-base-300 border-b-2">
                            <span className="text-base-content text-lg">{title}</span>
                            <MyButton isRounded size="sm" onClick={handleClose}>
                                <IoCloseSharp className="text-base-content size-6" />
                            </MyButton>
                        </div>
                        {children}
                    </div>
                </Card>
            </div>
        </div>,
        document.getElementById('root'),
    );
}

ModalLink.propTypes = {
    outline: PropTypes.bool,
    delay: PropTypes.number,
    title: PropTypes.string,
    children: PropTypes.node,
};

export default memo(ModalLink);

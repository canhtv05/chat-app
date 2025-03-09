import { createPortal } from 'react-dom';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/joy';
import MyButton from '../MyButton/MyButton';
import { IoCloseSharp } from 'react-icons/io5';

function Modal({ children, setIsOpen, isOpen, outline = false, title, delay = 200 }) {
    const contentRef = useRef(null);
    const [isVisible, setIsVisible] = useState(isOpen);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            const time = setTimeout(() => setIsVisible(true), delay);

            return () => clearTimeout(time);
        }
    }, [delay, isOpen]);

    const handleClose = useCallback(() => {
        setIsVisible(false);

        const time = setTimeout(() => {
            setIsMounted(false);
            if (setIsOpen) setIsOpen(false);
        }, delay);

        return () => clearTimeout(time);
    }, [setIsOpen, delay]);

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
                    bg-background-secondary rounded
                    ${outline ? 'border-border border-2' : ''} 
                    transition-all duration-${delay} ease-in-out
                    ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
                `}
            >
                <Card
                    sx={{ background: 'rgba(var(--background-secondary))', padding: '0' }}
                    orientation="vertical"
                    variant="soft"
                >
                    <div className="relative">
                        <div className="flex justify-between items-center px-4 py-2 font-semibold border-border border-b-2">
                            <span className="text-text-bold text-lg">{title}</span>
                            <MyButton isRounded size="sm" onClick={handleClose}>
                                <IoCloseSharp className="text-text-bold size-6" />
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

Modal.propTypes = {
    onClose: PropTypes.func,
    outline: PropTypes.bool,
    delay: PropTypes.number,
    title: PropTypes.string,
    children: PropTypes.node,
};

export default memo(Modal);

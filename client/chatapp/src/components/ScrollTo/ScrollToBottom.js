import { useCallback, useEffect, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi2';
import RenderIf from '../RenderIf';

function ScrollToBottom({ children, containerRef }) {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const isNearBottom = container.scrollHeight - container.scrollTop > 1000;
            setShowButton(isNearBottom);
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [containerRef]);

    const handleClick = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [containerRef]);

    return (
        <>
            {children}
            <RenderIf value={showButton}>
                <div className="absolute right-10 bottom-9 h-10 w-10 bg-red scroll-smooth">
                    <button
                        className="bg-base-300 p-2 rounded-full hover:bg-base-100 border border-base-content/50"
                        onClick={handleClick}
                    >
                        <HiChevronDown className="size-6 text-base-content cursor-pointer" />
                    </button>
                </div>
            </RenderIf>
        </>
    );
}

export default ScrollToBottom;

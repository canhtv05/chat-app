import { useCallback, useRef } from 'react';
import { FaAngleRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { IoCheckmark } from 'react-icons/io5';

import Dropdown from './Dropdown';
import useLocalStorage from '~/hooks/useLocalStorage';

const MenuItems = ({ items, depthLevel, path, activePath, setActivePath, location }) => {
    const { dataStorage } = useLocalStorage();
    const navigate = useNavigate();
    const ref = useRef();
    const isOpen = path.every((v, i) => v === activePath[i]);

    const onMouseEnter = () => {
        setActivePath(path);
    };

    const handleClick = useCallback(() => {
        if (items?.onClick) items.onClick();

        if (items?.to) {
            navigate(items.to, { state: { background: location } });
        }

        setActivePath([]);
    }, [items, location, navigate, setActivePath]);

    return (
        <li className="relative w-full" ref={ref} onMouseEnter={onMouseEnter}>
            {items.submenu ? (
                <>
                    <button
                        onClick={handleClick}
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={isOpen ? 'true' : 'false'}
                        className="w-full text-left px-4 py-2 hover:bg-base-100 flex items-center"
                    >
                        <div className="flex items-center w-full">
                            {items?.leftIcon ? (
                                <span>{items.leftIcon}</span>
                            ) : depthLevel > 0 ? (
                                <span className="ml-2"></span>
                            ) : (
                                <span className="ml-10"></span>
                            )}
                            <span className="block w-full">{items.title}</span>
                            <div className="flex-1">{depthLevel > 0 ? <FaAngleRight /> : <FaAngleRight />}</div>
                        </div>
                    </button>
                    <Dropdown
                        submenus={items.submenu}
                        dropdown={isOpen}
                        depthLevel={depthLevel}
                        parentPath={path}
                        activePath={activePath}
                        setActivePath={setActivePath}
                        location={location}
                    />
                </>
            ) : (
                <button
                    onClick={handleClick}
                    className="flex w-full items-end justify-start px-4 py-2 hover:bg-base-100 cursor-pointer"
                >
                    {items?.leftIcon ? (
                        <span>{items.leftIcon}</span>
                    ) : depthLevel > 0 ? (
                        <span className="ml-2"></span>
                    ) : (
                        <span className="ml-10"></span>
                    )}
                    {items.title}
                    {items?.lang && items.lang === (dataStorage?.language || 'en') && (
                        <IoCheckmark className="size-5 flex-1" />
                    )}
                </button>
            )}
            {items?.separate && <div className="h-[1px] w-full bg-neutral/10" />}
        </li>
    );
};

export default MenuItems;

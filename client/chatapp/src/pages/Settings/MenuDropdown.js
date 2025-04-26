import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import MenuItems from '../../components/Dropdown/MenuItems';
import useClickOutside from '~/hooks/useClickOutSide';

const MenuDropdown = ({ item }) => {
    const location = useLocation();
    const [activePath, setActivePath] = useState([]);

    const menuRef = useRef();

    useClickOutside(menuRef, () => {
        setActivePath([]);
    });

    return (
        <nav
            className="absolute -top-[236px] z-50 bg-base-300 rounded-md border border-base-content/10 py-2 min-w-[240px] shadow-xl text-md"
            ref={menuRef}
        >
            <ul className="flex list-none flex-col">
                {item.map((menu, index) => (
                    <MenuItems
                        key={index}
                        items={menu}
                        depthLevel={0}
                        path={[index]}
                        activePath={activePath}
                        setActivePath={setActivePath}
                        location={location}
                    />
                ))}
            </ul>
        </nav>
    );
};

export default MenuDropdown;

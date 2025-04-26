import MenuItems from './MenuItems';

const Dropdown = ({ submenus, dropdown, depthLevel, parentPath, activePath, setActivePath, location }) => {
    depthLevel = depthLevel + 1;

    return (
        <ul
            className={`absolute border border-base-content/10
        ${depthLevel === 1 ? 'left-[238px]' : 'left-0'} 
        ${depthLevel > 1 ? 'left-full top-[-7px]' : ''}
        top-0 bg-base-300 shadow-xl rounded-md min-w-[10rem] py-2 list-none z-[9999] text-sm
        ${dropdown ? 'block' : 'hidden'}
    `}
        >
            {submenus.map((submenu, index) => (
                <MenuItems
                    key={index}
                    items={submenu}
                    depthLevel={depthLevel}
                    path={[...parentPath, index]}
                    activePath={activePath}
                    setActivePath={setActivePath}
                    location={location}
                />
            ))}
        </ul>
    );
};

export default Dropdown;

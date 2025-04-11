import { BsChatText } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { useMemo } from 'react';
import { Avatar } from '@mui/joy';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MyButton from '~/components/MyButton';
import colors from '~/components/AccountItem/colors';

function MenuSidebar() {
    const location = useLocation();
    const { profilePicture, firstName, lastName } = useSelector((state) => state.auth.data.data);

    const background = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * colors.backgrounds.length);
        return colors.backgrounds[randomIndex];
    }, []);

    return (
        <div className="bg-base-100 px-2 h-full pt-9 pb-10 flex flex-col justify-between items-center border-r border-base-300">
            <div className="pb-12">
                <Link className="mt-auto" to={'/profile'} state={{ background: location }}>
                    <MyButton>
                        <Avatar
                            alt={`${firstName || ''} ${lastName || ''}`}
                            src={profilePicture}
                            sx={{ width: 50, height: 50, background: background }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '';
                            }}
                        >
                            <span className="text-white font-semibold text-xl">
                                {firstName?.charAt(0).toUpperCase()}
                            </span>
                        </Avatar>
                    </MyButton>
                </Link>
            </div>
            <MyButton active>
                <BsChatText className="size-8 text-base-content" />
            </MyButton>
            <Link className="mt-auto" to={'/settings'} state={{ background: location }}>
                <MyButton>
                    <IoSettingsOutline className="size-8 text-base-content" />
                </MyButton>
            </Link>
        </div>
    );
}

export default MenuSidebar;

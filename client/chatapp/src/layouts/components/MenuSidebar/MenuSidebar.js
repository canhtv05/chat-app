import { BsChatText } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { Avatar } from '@mui/joy';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';

import MyButton from '~/components/MyButton';
import images from '~/assets/images';
import { Profile } from '~/components/Profile';

function MenuSidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const { profilePicture, firstName, lastName } = useSelector((state) => state.auth.data.data);

    return (
        <div className="bg-base-100 px-2 h-full pt-9 pb-10 flex flex-col justify-between items-center border-r border-base-300">
            <div className="pb-12">
                <MyButton onClick={() => setIsOpen(true)}>
                    <Avatar
                        alt={`${firstName || ''} ${lastName || ''}`}
                        src={profilePicture ?? images.fallbackAvt}
                        sx={{ width: 50, height: 50 }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                        }}
                    >
                        <span className="text-white font-semibold text-xl">{firstName?.charAt(0).toUpperCase()}</span>
                    </Avatar>
                </MyButton>
            </div>
            <MyButton active>
                <BsChatText className="size-8 text-base-content" />
            </MyButton>
            <Link className="mt-auto" to={'/settings'} state={{ background: location }}>
                <MyButton>
                    <IoSettingsOutline className="size-8 text-base-content" />
                </MyButton>
            </Link>
            <Profile isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
}

export default MenuSidebar;

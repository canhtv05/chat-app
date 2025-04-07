import { BsChatText } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { useMemo, useState } from 'react';
import { Avatar } from '@mui/joy';

import { Profile } from '~/components/Profile';
import MyButton from '~/components/MyButton';
import { useSelector } from 'react-redux';
import colors from '~/components/AccountItem/colors';
import useWindowSize from '~/hooks/useWindowSize';

function MenuSidebar({ setShowChatList }) {
    const { profilePicture, firstName, lastName } = useSelector((state) => state.auth.data.data);
    const [isOpen, setIsOpen] = useState(false);
    const { width } = useWindowSize();

    const handleShowInfo = () => {
        setIsOpen(true);
    };

    const background = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * colors.backgrounds.length);
        return colors.backgrounds[randomIndex];
    }, []);

    const handleToggleChatList = () => {
        if (width < 1024) {
            // Chỉ toggle khi width < 1024
            setShowChatList((prev) => {
                console.log('MenuSidebar - Toggling showChatList, prev:', prev, 'new:', !prev);
                return !prev;
            });
        }
    };

    return (
        <div className="bg-background px-2 h-full pt-9 pb-10 flex flex-col justify-between items-center border-r border-border">
            <div className="pb-12">
                <MyButton onClick={handleShowInfo}>
                    <Avatar
                        alt={`${firstName || ''} ${lastName || ''}`}
                        src={profilePicture}
                        sx={{ width: 50, height: 50, background: background }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                        }}
                    >
                        <span className="text-white font-semibold text-xl">{firstName?.charAt(0).toUpperCase()}</span>
                    </Avatar>
                </MyButton>
            </div>
            <MyButton active onClick={handleToggleChatList}>
                <BsChatText className="size-8 text-text-bold" />
            </MyButton>
            <div className="mt-auto">
                <MyButton>
                    <IoSettingsOutline className="size-8 text-text-bold" />
                </MyButton>
            </div>
            <Profile setIsOpen={setIsOpen} isOpen={isOpen} />
        </div>
    );
}

export default MenuSidebar;

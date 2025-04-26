import { BsChatText } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { Avatar } from '@mui/joy';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';

import MenuDropdown from '~/pages/Settings/MenuDropdown';
import MyButton from '~/components/MyButton';
import images from '~/assets/images';
import { Profile } from '~/components/Profile';
import { setDisableSearch } from '~/redux/reducers/chatSlice';
import { MENU_ITEM_SETTINGS } from '~/constants';
import useClickOutside from '~/hooks/useClickOutSide';

function MenuSidebar() {
    const dispatch = useDispatch();
    const [isOpenProfile, setIsOpenProfile] = useState(false);
    const [isOpenSetting, setIsOpenSetting] = useState(false);
    const { profilePicture, firstName, lastName } = useSelector((state) => state.auth.data.data);

    const divRef = useRef();

    useClickOutside(divRef, () => setIsOpenSetting(false));

    const handleOpenProfile = () => {
        setIsOpenProfile(true);
    };

    const handler = {
        handleOpenProfile,
    };

    return (
        <div
            className="bg-base-100 px-2 h-full pt-9 pb-10 flex flex-col justify-between items-center border-r border-base-300"
            ref={divRef}
        >
            <div className="pb-12">
                <MyButton onClick={() => setIsOpenProfile(true)}>
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
            <MyButton active onClick={() => dispatch(setDisableSearch(true))}>
                <BsChatText className="size-8 text-base-content" />
            </MyButton>
            <div className="relative mt-auto">
                <MyButton active={isOpenSetting} onClick={() => setIsOpenSetting((prev) => !prev)}>
                    <IoSettingsOutline className="size-8 text-base-content" />
                </MyButton>
                {isOpenSetting && <MenuDropdown item={MENU_ITEM_SETTINGS(handler)} />}
            </div>
            <Profile isOpen={isOpenProfile} setIsOpen={setIsOpenProfile} />
        </div>
    );
}

export default MenuSidebar;

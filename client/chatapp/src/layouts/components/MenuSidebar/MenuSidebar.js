import { BsChatText } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { useState } from 'react';
import { Avatar } from '@mui/joy';

import { Profile } from '~/components/Profile';
import MyButton from '~/components/MyButton';

function MenuSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const handleShowInfo = () => {
        setIsOpen(true);
    };

    return (
        <div className="bg-background px-2 h-full pt-9 pb-10 flex flex-col justify-between items-center border-r border-border">
            <div className="pb-12">
                <MyButton onClick={handleShowInfo}>
                    <Avatar
                        alt="Remy Sharp"
                        src="https://avatars.githubusercontent.com/u/166397227?u=b890f6ef06b108063dca01ecbd15bcf2e0cf46a1&v=4"
                        sx={{ width: 50, height: 50 }}
                    />
                </MyButton>
            </div>
            <MyButton active>
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

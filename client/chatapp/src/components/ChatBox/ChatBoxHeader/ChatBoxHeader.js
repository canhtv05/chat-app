import { Avatar } from '@mui/joy';
import { CiSearch } from 'react-icons/ci';
import { useSelector } from 'react-redux';

import MyButton from '~/components/MyButton';
import RenderIf from '~/components/RenderIf';

function ChatBoxHeader({ isOnline = false }) {
    const { id: currentUserId } = useSelector((state) => state.auth.data.data);
    const data = useSelector((state) => state.chat.data);
    const user = data?.createdBy?.id ? data?.users.find((user) => user.id !== currentUserId) : data;
    const chat = data?.createdBy?.id ? data : null;

    return (
        <div className="p-5 flex justify-between items-center border-b border-border relative shrink-0 w-full">
            <div className="flex w-full">
                <div className="relative">
                    <Avatar
                        alt="Remy Sharp"
                        src="https://avatars.githubusercontent.com/u/166397227?u=b890f6ef06b108063dca01ecbd15bcf2e0cf46a1&v=4"
                        sx={{ width: 50, height: 50 }}
                    />
                    {isOnline && (
                        <span className="bg-green-500 w-3 h-3 inline-block rounded-full absolute right-1 top-10"></span>
                    )}
                </div>
                <div className="flex justify-between items-center w-full h-full">
                    <div className="ml-4 flex justify-between flex-col">
                        <RenderIf value={!chat?.isGroup}>
                            <span className="text-text-bold font-semibold">{`${user?.firstName || ''} ${
                                user?.lastName || ''
                            }`}</span>
                        </RenderIf>
                        <RenderIf value={chat?.isGroup}>
                            <span className="text-text-bold font-semibold">{chat?.chatName || ''}</span>
                        </RenderIf>
                        <span className="text-text-bold font-thin">4 hours ago //undefined</span>
                    </div>
                    <MyButton size="sm">
                        <CiSearch className="size-7 text-text-bold" />
                    </MyButton>
                </div>
            </div>
        </div>
    );
}

export default ChatBoxHeader;

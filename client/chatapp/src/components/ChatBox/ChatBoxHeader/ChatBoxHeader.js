import { Avatar, Tooltip } from '@mui/joy';
import { CiSearch } from 'react-icons/ci';
import { PiTagSimpleFill } from 'react-icons/pi';
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
                        variant="soft"
                        alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
                        src={user?.profilePicture}
                        sx={{
                            width: 50,
                            height: 50,
                            background: data?.background,
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                        }}
                    >
                        <span className="text-white font-semibold text-xl">
                            <RenderIf value={chat?.isGroup}>{chat?.chatName?.charAt(0).toUpperCase()}</RenderIf>
                            <RenderIf value={!chat?.isGroup}>{user?.firstName?.charAt(0).toUpperCase()}</RenderIf>
                        </span>
                    </Avatar>
                    {isOnline && (
                        <span className="bg-green-500 w-3 h-3 inline-block rounded-full absolute right-1 top-10"></span>
                    )}
                </div>
                <div className="flex mt-1 justify-between items-center w-full h-full">
                    <div className="ml-4 h-full flex justify-between flex-col">
                        <RenderIf value={!chat?.isGroup}>
                            <span className="text-text-bold font-semibold">{`${user?.firstName || ''} ${
                                user?.lastName || ''
                            }`}</span>
                        </RenderIf>
                        <RenderIf value={chat?.isGroup}>
                            <span className="text-text-bold font-semibold">{chat?.chatName || ''}</span>
                        </RenderIf>
                        <Tooltip title={chat?.isGroup ? 'Group chat' : 'Single chat'} arrow placement="top">
                            <PiTagSimpleFill className="mr-2 text-lg" color={chat?.isGroup ? 'orange' : 'green'} />
                        </Tooltip>
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

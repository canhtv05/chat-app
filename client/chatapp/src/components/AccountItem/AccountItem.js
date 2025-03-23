import { Avatar } from '@mui/joy';
import PropTypes from 'prop-types';
import { forwardRef, memo } from 'react';
import RenderIf from '../RenderIf';
import { useSelector } from 'react-redux';
import useTimeAgo from '~/hooks/useTimeAgo';

const AccountItem = forwardRef(({ separator, isOnline, isActive, onClick, data, isSearchAccount = false }, ref) => {
    const { id: currentUserId } = useSelector((state) => state.auth.data.data);
    const user = isSearchAccount ? data : data?.users.find((user) => user.id !== currentUserId);
    const chat = isSearchAccount ? null : data;
    const lastMessage = chat?.lastMessage;

    const timeAgo = useTimeAgo(lastMessage?.timestamp || '');

    return (
        <div ref={ref}>
            <div
                className={`cursor-pointer ${isActive ? 'bg-background-secondary' : 'hover:bg-active'}`}
                onClick={onClick}
            >
                <div className={separator ? 'border-border border-b p-6' : 'p-6'}>
                    <div className="flex">
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
                        <div className={`flex w-full ${isSearchAccount ? 'flex-row items-center' : 'flex-col'}`}>
                            <div className="ml-4 flex justify-between">
                                <span className="text-text-bold font-semibold max-w-[150px] truncate inline-block">
                                    <RenderIf value={chat?.isGroup}>{chat?.chatName}</RenderIf>
                                    <RenderIf value={!chat?.isGroup}>
                                        {user?.firstName} {user?.lastName}
                                    </RenderIf>
                                </span>
                                {!isSearchAccount && <span className="text-text-bold font-thin">{timeAgo}</span>}
                            </div>
                            {!isSearchAccount && (
                                <div className="ml-4 mt-1 flex">
                                    <RenderIf value={lastMessage}>
                                        <span className="text-text-light max-w-[100px] truncate inline-block">
                                            <RenderIf value={currentUserId === lastMessage?.user?.id}>You</RenderIf>
                                            <RenderIf value={currentUserId !== lastMessage?.user?.id}>
                                                {lastMessage?.user?.firstName} {lastMessage?.user?.lastName}
                                            </RenderIf>
                                        </span>
                                        <span className="inline-block text-text-light">:</span>
                                        <span className="ml-2 text-text-light max-w-[145px] truncate inline-block">
                                            {lastMessage?.content}
                                        </span>
                                    </RenderIf>
                                    <RenderIf value={!lastMessage}>
                                        <span className="text-text-light">No messages yet!</span>
                                    </RenderIf>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

AccountItem.propTypes = {
    separator: PropTypes.bool,
    isMe: PropTypes.bool,
    isOnline: PropTypes.bool,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
};

export default memo(AccountItem);

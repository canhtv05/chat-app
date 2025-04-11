import { Avatar, AvatarGroup, Tooltip } from '@mui/joy';
import PropTypes from 'prop-types';
import { forwardRef, memo } from 'react';
import { useSelector } from 'react-redux';
import { PiTagSimpleFill } from 'react-icons/pi';

import RenderIf from '../RenderIf';
import useTimeAgo from '~/hooks/useTimeAgo';
import useKeyValue from '~/hooks/useKeyValue';

const AccountItem = forwardRef(({ separator, isOnline, isActive, onClick, data, isSearchAccount = false }, ref) => {
    const { id: currentUserId } = useSelector((state) => state.auth.data.data);
    const lastMessages = useSelector((state) => state.chat.lastMessages);
    const user = isSearchAccount ? data : data?.users.find((user) => user.id !== currentUserId);
    const chat = isSearchAccount ? null : data;

    const last = useKeyValue(lastMessages, {});
    const lastMessage = last(chat?.id);
    const timeAgo = useTimeAgo(lastMessage?.timestamp || '');

    return (
        <div ref={ref}>
            <div className={`cursor-pointer ${isActive ? 'bg-base-200' : 'hover:bg-active'}`} onClick={onClick}>
                <div className={separator ? 'border-base-300 border-b p-6' : 'p-6'}>
                    <div className="flex">
                        <div className="relative">
                            <AvatarGroup>
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
                                        <RenderIf value={chat?.isGroup}>
                                            {chat?.chatName?.charAt(0).toUpperCase()}
                                        </RenderIf>
                                        <RenderIf value={!chat?.isGroup}>
                                            {user?.firstName?.charAt(0).toUpperCase()}
                                        </RenderIf>
                                    </span>
                                </Avatar>
                            </AvatarGroup>
                            {isOnline && (
                                <span className="bg-green-500 w-3 h-3 inline-block rounded-full absolute right-1 top-10"></span>
                            )}
                        </div>
                        <div className={`flex w-full ${isSearchAccount ? 'flex-row items-center' : 'flex-col'}`}>
                            <div className="ml-4 flex justify-between">
                                <span className="text-base-content font-semibold max-w-[150px] truncate inline-block">
                                    <RenderIf value={chat?.isGroup}>{chat?.chatName}</RenderIf>
                                    <RenderIf value={!chat?.isGroup}>
                                        {user?.firstName} {user?.lastName}
                                    </RenderIf>
                                </span>
                                {!isSearchAccount && <span className="text-base-content font-thin">{timeAgo}</span>}
                            </div>
                            {!isSearchAccount && (
                                <div className="ml-4 mt-1 flex">
                                    <RenderIf value={lastMessage}>
                                        <div className="text-base-content">
                                            <div className="flex justify-start items-center">
                                                <Tooltip
                                                    title={chat?.isGroup ? 'Group chat' : 'Single chat'}
                                                    arrow
                                                    placement="top"
                                                >
                                                    <PiTagSimpleFill
                                                        className="mr-2"
                                                        color={chat?.isGroup ? 'orange' : 'green'}
                                                    />
                                                </Tooltip>
                                                <RenderIf value={currentUserId === lastMessage?.user?.id}>You</RenderIf>
                                                <RenderIf value={currentUserId !== lastMessage?.user?.id}>
                                                    <span className="max-w-[120px] truncate inline-block text-base-content">
                                                        {lastMessage?.user?.firstName} {lastMessage?.user?.lastName}
                                                    </span>
                                                </RenderIf>
                                            </div>
                                        </div>
                                        <span className="inline-block text-base-content">:</span>
                                        <span
                                            className={`ml-2 text-base-content truncate inline-block ${
                                                currentUserId === lastMessage?.user?.id
                                                    ? 'max-w-[150px]'
                                                    : 'max-w-[70px]'
                                            }`}
                                        >
                                            {lastMessage?.content}
                                        </span>
                                    </RenderIf>
                                    <RenderIf value={!lastMessage}>
                                        <span className="text-base-content">No messages yet!</span>
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

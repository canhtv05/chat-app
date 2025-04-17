import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import RenderIf from '../RenderIf';
import icons from '~/assets/icons';
import ChatBoxHeader from './ChatBoxHeader';
import MessageCard from '../MessageCard';
import ChatBoxFooter from './ChatBoxFooter';
import { getAllMessagesFromChat, sendMessage } from '~/services/message/messageService';
import { createSingleChat } from '~/services/chat/chatService';
import useKeyValue from '~/hooks/useKeyValue';
import { updateLastMessage } from '~/redux/reducers/chatSlice';
import socketService from '~/services/socket/socketService';
import LoadingIcon from '../LoadingIcon';
import colors from '../AccountItem/colors';

const getRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * colors.backgrounds.length);
    return colors.backgrounds[randomIndex];
};

function ChatBox() {
    const dispatch = useDispatch();
    const {
        data: {
            id: targetId,
            isSearch,
            idUser,
            firstName: firstNameCurrentChat,
            lastName: lastNameCurrentChat,
            email: emailCurrentChat,
            profilePicture: profilePictureCurrentChat,
        },
        currentChat,
    } = useSelector((state) => state.chat);

    const idChatOfUser = useSelector((state) => state.chat.idChatOfUser);
    const {
        id: currentUserId,
        firstName,
        lastName,
        email,
        profilePicture,
    } = useSelector((state) => state.auth.data.data);

    const lastMessageRef = useRef(null);
    const observer = useRef(null);
    const firstMessageItemRef = useRef(null);
    const containerRef = useRef(null);
    const isInitialFetch = useRef(true);
    const prevPage = useRef(-1);

    const [dataMessage, setDataMessage] = useState([]);
    const [content, setContent] = useState('');
    const [isChatCreated, setIsChatCreated] = useState(false);
    const [chatId, setChatId] = useState('');
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(-1);
    const [hasMore, setHasMore] = useState(true);

    const getIdChatByUserId = useKeyValue(idChatOfUser, null);

    const onMessageReceive = useCallback(
        (payload) => {
            const received = JSON.parse(payload.body);
            if (received?.user?.id !== currentUserId) {
                setDataMessage((prev) => [...prev, received]);
            }
            dispatch(updateLastMessage(received));
        },
        [currentUserId, dispatch],
    );

    useEffect(() => {
        if (!currentChat || !targetId || !socketService.isReady()) return;

        let idChat = isSearch ? getIdChatByUserId(targetId) : targetId;

        socketService.subscribe(`/group/${idChat}`, onMessageReceive);

        return () => {
            socketService.unsubscribe(`/group/${idChat}`);
        };
    }, [currentChat, getIdChatByUserId, isSearch, onMessageReceive, targetId]);

    const fetchMessages = useCallback(
        async (currentPage) => {
            if (!targetId || loading) return;

            let idChat = isSearch ? getIdChatByUserId(targetId) : targetId;
            if (!idChat) {
                setDataMessage([]);
                return;
            }
            setLoading(true);

            const scrollContainer = containerRef.current;
            const scrollHeightBefore = scrollContainer ? scrollContainer.scrollHeight : 0;
            const scrollTopBefore = scrollContainer ? scrollContainer.scrollTop : 0;

            const [error, data] = await getAllMessagesFromChat(idChat, currentPage === -1 ? null : currentPage);
            setLoading(false);

            if (error) {
                console.log('Lỗi khi lấy tin nhắn:', error);
                return;
            }

            if (data) {
                setIsChatCreated(true);
                setChatId(targetId);
                setDataMessage((prev) => (currentPage === -1 ? data.data : [...data.data, ...prev]));
                const currentPageFromApi = data?.meta?.pagination?.currentPage || 1;
                setHasMore(currentPageFromApi > 1);

                if (isInitialFetch.current || prevPage.current !== currentPageFromApi) {
                    setPage(currentPageFromApi);
                    prevPage.current = currentPageFromApi;
                }

                if (!isInitialFetch.current && scrollContainer) {
                    requestAnimationFrame(() => {
                        const scrollHeightAfter = scrollContainer.scrollHeight;
                        scrollContainer.scrollTop = scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
                    });
                }
                isInitialFetch.current = false;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [targetId, isSearch, getIdChatByUserId],
    );

    useEffect(() => {
        if (!targetId) {
            setDataMessage([]);
            setIsChatCreated(false);
            setHasMore(false);
            setLoading(false);
            setPage(-1);
            isInitialFetch.current = true;
            prevPage.current = -1;
            return;
        }
        fetchMessages(-1);
    }, [targetId, fetchMessages]);

    useEffect(() => {
        // ngan call api vo han voi prev page
        if (page === -1 || loading || !hasMore || page === prevPage.current) return;
        fetchMessages(page);
    }, [page, fetchMessages, hasMore, loading]);

    useEffect(() => {
        if (!hasMore || loading || !firstMessageItemRef.current) return;

        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage((prev) => {
                        const nextPage = prev - 1;
                        return nextPage >= 1 ? nextPage : prev;
                    });
                }
            },
            { threshold: 0.1 },
        );

        observer.current.observe(firstMessageItemRef.current);

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [hasMore, loading]);

    useEffect(() => {
        if (lastMessageRef.current && shouldScrollToBottom) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [dataMessage, shouldScrollToBottom]);

    useEffect(() => {
        if (dataMessage.length > 0) {
            setIsChatCreated(true);
        } else {
            setIsChatCreated(false);
        }
    }, [dataMessage]);

    const handleSendMessage = useCallback(async () => {
        if (!content.trim() || !targetId) return;

        let currentChatId = chatId;
        const timestamp = new Date().toISOString();

        const currentUser = {
            id: currentUserId,
            firstName,
            lastName,
            email,
            profilePicture,
        };

        const targetUser = {
            id: targetId,
            firstName: firstNameCurrentChat,
            lastName: lastNameCurrentChat,
            email: emailCurrentChat,
            profilePicture: profilePictureCurrentChat,
        };

        if (!isChatCreated) {
            const [error, result] = await createSingleChat(idUser);
            if (error) {
                console.error('Failed to create chat:', error);
                return;
            }

            currentChatId = result?.data?.id;
            const body = {
                background: getRandomBackground(),
                chatImage: null,
                chatName: null,
                createdBy: currentUser,
                id: currentChatId,
                isGroup: false,
                users: [currentUser, targetUser],
                content,
                timestamp,
                chatId: currentChatId,
            };

            socketService.send('single-chat-created', body);
            setChatId(currentChatId);
            setIsChatCreated(true);
        }

        const localMessage = {
            chatId: currentChatId,
            content,
            user: currentUser,
            timestamp,
        };

        dispatch(updateLastMessage(localMessage));
        setDataMessage((prev) => [...prev, localMessage]);

        if (socketService.isReady()) {
            socketService.send('message', {
                chatId: currentChatId,
                content,
                userId: currentUserId,
                timestamp,
            });
            setContent('');
        }

        setShouldScrollToBottom(true);
        await sendMessage({ chatId: currentChatId, content });
    }, [
        chatId,
        content,
        currentUserId,
        dispatch,
        email,
        emailCurrentChat,
        firstName,
        firstNameCurrentChat,
        idUser,
        isChatCreated,
        lastName,
        lastNameCurrentChat,
        profilePicture,
        profilePictureCurrentChat,
        targetId,
    ]);

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-base-100">
            <RenderIf value={!currentChat}>
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 flex flex-col items-center">
                    <img
                        loading="lazy"
                        className="object-cover w-[80%] h-[80%]"
                        src={icons.meow}
                        alt={Math.random(0, 100)}
                    />
                    <span className="text-base-content font-semibold">It looks a little quiet here...</span>
                    <span className="text-base-content font-semibold">Start a new conversation and let's talk!</span>
                </div>
            </RenderIf>
            <RenderIf value={currentChat}>
                <div className="flex flex-col h-full">
                    <div className="shrink-0">
                        <ChatBoxHeader />
                    </div>
                    <div className="flex-1 overflow-hidden py-3">
                        <div className="px-10 h-full overflow-y-auto scroll-smooth" ref={containerRef}>
                            <RenderIf value={loading}>
                                <div className="mt-4 absolute left-1/2 transform -translate-y-1/2">
                                    <LoadingIcon size={30} />
                                </div>
                            </RenderIf>
                            <div className="space-y-1 flex flex-col mt-2">
                                <RenderIf value={dataMessage.length === 0}>
                                    <p className="p-5 text-base-content font-semibold text-center">
                                        No messages here. Why not send one 😀?
                                    </p>
                                </RenderIf>
                                {dataMessage.map((data, index) => {
                                    const isLast = index === dataMessage.length - 1;
                                    const isFirst = index === 0;

                                    return (
                                        <MessageCard
                                            key={index}
                                            ref={isFirst ? firstMessageItemRef : isLast ? lastMessageRef : null}
                                            isMe={currentUserId === data?.user?.id}
                                            content={data?.content}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 border-base-300 border-t">
                        <ChatBoxFooter content={content} setContent={setContent} onSend={handleSendMessage} />
                    </div>
                </div>
            </RenderIf>
        </div>
    );
}

export default ChatBox;

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import useKeyValue from '~/hooks/useKeyValue';
import { updateLastMessage } from '~/redux/reducers/chatSlice';
import socketService from '~/services/socket/socketService';
import { getAllMessagesFromChat, sendMessage } from '~/services/message/messageService';
import { createSingleChat } from '~/services/chat/chatService';

const getMessageProps = (dataMessage, index, data) => {
    const getTimeDiffInMinutes = (a, b) => (new Date(a) - new Date(b)) / (1000 * 60);
    const isSameUser = (a, b) => a?.user?.id === b?.user?.id;

    const prev = dataMessage[index - 1];
    const next = dataMessage[index + 1];

    const isLast = index === dataMessage.length - 1;
    const isFirst = index === 0;

    let isGroupedWithPrevious = false;
    let isGroupedWithNext = false;

    let isHasIconPrevious = false;
    let isHasIconNext = false;

    if (prev) {
        const timeDiff = getTimeDiffInMinutes(data?.timestamp, prev?.timestamp);
        isGroupedWithPrevious = timeDiff < 5 && isSameUser(data, prev);
        if (prev?.content === 'like') isHasIconPrevious = true;
    }

    if (next) {
        const timeDiff = getTimeDiffInMinutes(next?.timestamp, data?.timestamp);
        isGroupedWithNext = timeDiff < 5 && isSameUser(data, next);
        if (next?.content === 'like') isHasIconNext = true;
    }

    if (isHasIconNext && isHasIconPrevious) {
        isGroupedWithPrevious = false;
        isGroupedWithNext = false;
    }

    if (isHasIconPrevious && isGroupedWithNext) {
        isGroupedWithPrevious = false;
    }

    if ((isHasIconNext && isGroupedWithPrevious) || (isHasIconNext && isGroupedWithNext)) {
        isGroupedWithNext = false;
    }

    if (isHasIconPrevious && isGroupedWithPrevious && !isGroupedWithNext) {
        isGroupedWithNext = false;
        isGroupedWithPrevious = false;
    }

    if (isLast && data?.content === 'like') {
        isGroupedWithNext = false;
        isGroupedWithPrevious = false;
    }

    if (isHasIconNext && isHasIconPrevious) {
        isGroupedWithPrevious = false;
        isGroupedWithNext = false;
    }

    return {
        isFirst,
        isLast,
        isGroupedWithNext,
        isGroupedWithPrevious,
        prev,
        next,
        isHasIconPrevious,
        isHasIconNext,
    };
};

const useChatBoxLogic = ({ containerRef, firstMessageItemRef, lastMessageRef }) => {
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

    const observer = useRef(null);
    const isInitialFetch = useRef(true);
    const prevPage = useRef(-1);

    const [dataMessage, setDataMessage] = useState([]);
    const [isSending, setIsSending] = useState(false);
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
                setShouldScrollToBottom(true);
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
            socketService.unsubscription(`/group/${idChat}`);
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
                toast.error(error?.data?.message);
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
                    setShouldScrollToBottom(false);
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
    }, [targetId, fetchMessages, containerRef]);

    useEffect(() => {
        if (page === -1 || loading || !hasMore || page === prevPage.current) return;
        fetchMessages(page);
    }, [page, fetchMessages, hasMore, loading]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [containerRef]);

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
    }, [hasMore, loading, firstMessageItemRef]);

    useEffect(() => {
        if (lastMessageRef.current && shouldScrollToBottom) {
            requestAnimationFrame(() => {
                lastMessageRef.current.scrollIntoView({ block: 'end' });
            });
        }
    }, [dataMessage, shouldScrollToBottom, lastMessageRef]);

    useEffect(() => {
        if (dataMessage.length > 0) {
            setIsChatCreated(true);
        } else {
            setIsChatCreated(false);
        }
    }, [dataMessage]);

    const handleSendMessage = useCallback(
        async (message) => {
            const contentToSend = message || content.trim();
            if (!contentToSend || !targetId) return;
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
                    toast.error(error?.data?.message);
                    return;
                }

                currentChatId = result?.data?.id;
                const body = {
                    chatImage: null,
                    chatName: null,
                    createdBy: currentUser,
                    id: currentChatId,
                    isGroup: false,
                    users: [currentUser, targetUser],
                    content: contentToSend,
                    timestamp,
                    chatId: currentChatId,
                };

                socketService.send('single-chat-created', body);
                socketService.subscribe(`/group/${currentChatId}`, onMessageReceive);
                setChatId(currentChatId);
                setIsChatCreated(true);
            }

            const localMessage = {
                chatId: currentChatId,
                content: contentToSend,
                user: currentUser,
                timestamp,
            };

            dispatch(updateLastMessage(localMessage));
            setDataMessage((prev) => [...prev, localMessage]);

            if (socketService.isReady()) {
                socketService.send('message', {
                    chatId: currentChatId,
                    content: contentToSend,
                    userId: currentUserId,
                    timestamp,
                });
                setContent('');
            }

            setShouldScrollToBottom(true);
            setIsSending(true);
            await sendMessage({ chatId: currentChatId, content: contentToSend });
            setIsSending(false);
        },
        [
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
            onMessageReceive,
        ],
    );

    useEffect(() => {
        if (containerRef.current) {
            requestAnimationFrame(() => {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            });
        }
    }, [dataMessage, shouldScrollToBottom, containerRef]);

    return {
        handleSendMessage,
        isSending,
        currentChat,
        loading,
        dataMessage,
        currentUserId,
        content,
        setContent,
        getMessageProps,
    };
};

export default useChatBoxLogic;

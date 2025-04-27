import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import useKeyValue from '~/hooks/useKeyValue';
import { setCurrentChat, updateChats, updateLastMessage } from '~/redux/reducers/chatSlice';
import socketService from '~/services/socket/socketService';
import { getAllMessagesFromChat, sendMessage } from '~/services/message/messageService';
import { createSingleChat } from '~/services/chat/chatService';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const getMessageProps = (dataMessage, index, data) => {
    // Helper để tính chênh lệch thời gian (phút)
    const getTimeDiffInMinutes = (a, b) => {
        if (!a || !b) return Infinity;
        return (new Date(a) - new Date(b)) / (1000 * 60);
    };

    // Helper kiểm tra cùng người gửi
    const isSameUser = (a, b) => a?.user?.id && b?.user?.id && a.user.id === b.user.id;

    // Helper kiểm tra tin nhắn có nội dung hợp lệ (không rỗng)
    const isValidMessage = (msg) => {
        return msg && (msg.content?.trim() !== '' || !!msg.imageUrl);
    };

    // Tìm tin nhắn hợp lệ trước và sau
    let prev = null;
    let prevIndex = index - 1;
    while (prevIndex >= 0 && !isValidMessage(dataMessage[prevIndex])) {
        prevIndex--;
    }
    if (prevIndex >= 0) prev = dataMessage[prevIndex];

    let next = null;
    let nextIndex = index + 1;
    while (nextIndex < dataMessage.length && !isValidMessage(dataMessage[nextIndex])) {
        nextIndex++;
    }
    if (nextIndex < dataMessage.length) next = dataMessage[nextIndex];

    // Xác định vị trí tin nhắn
    const isFirst = index === 0;
    const isLast = index === dataMessage.length - 1;

    // Khởi tạo trạng thái nhóm
    let isGroupedWithPrevious = false;
    let isGroupedWithNext = false;

    // Kiểm tra nhóm với tin nhắn trước
    if (prev && data?.timestamp && prev?.timestamp) {
        const timeDiff = getTimeDiffInMinutes(data.timestamp, prev.timestamp);
        isGroupedWithPrevious = timeDiff < 5 && isSameUser(data, prev);
    }

    // Kiểm tra nhóm với tin nhắn sau
    if (next && data?.timestamp && next?.timestamp) {
        const timeDiff = getTimeDiffInMinutes(next.timestamp, data.timestamp);
        isGroupedWithNext = timeDiff < 5 && isSameUser(data, next);
    }

    // Xử lý ngoại lệ cho tin nhắn 'like' hoặc có imageUrl
    const isLike = data?.content === 'like';
    const hasImage = !!data?.imageUrl;
    const prevIsLike = prev?.content === 'like';
    const nextIsLike = next?.content === 'like';
    const prevHasImage = !!prev?.imageUrl;
    const nextHasImage = !!next?.imageUrl;

    // Không nhóm nếu tin nhắn hiện tại là 'like' hoặc có imageUrl
    if (isLike || hasImage) {
        isGroupedWithNext = false;
        // Chỉ nhóm với trước nếu trước không phải imageUrl
        isGroupedWithPrevious = isGroupedWithPrevious && !prevHasImage;
    }

    // Không nhóm nếu tin nhắn hiện tại là văn bản và trước/sau là imageUrl hoặc like
    if (data?.content && !isLike && !hasImage) {
        if (prevHasImage || prevIsLike) {
            isGroupedWithPrevious = false;
        }
        if (nextHasImage || nextIsLike) {
            isGroupedWithNext = false;
        }
    }

    // Không nhóm nếu tin nhắn đứng giữa hai tin nhắn 'like'
    if (prevIsLike && nextIsLike) {
        isGroupedWithPrevious = false;
        isGroupedWithNext = false;
    }

    // Không nhóm nếu tin nhắn cuối là 'like'
    if (isLast && isLike) {
        isGroupedWithPrevious = false;
        isGroupedWithNext = false;
    }

    if (prev && prevIsLike && isLike && next && nextIsLike) {
        const timeDiff = getTimeDiffInMinutes(data.timestamp, prev.timestamp);
        isGroupedWithPrevious = timeDiff < 5 && isSameUser(data, prev);
        const timeDiff2 = getTimeDiffInMinutes(next.timestamp, data.timestamp);
        isGroupedWithNext = timeDiff2 < 5 && isSameUser(data, next);
    }

    return {
        isFirst,
        isLast,
        isGroupedWithPrevious,
        isGroupedWithNext,
        prev,
        next,
    };
};

const useChatBoxLogic = ({ containerRef, firstMessageItemRef, lastMessageRef }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { idChat: idChatParams } = useParams();
    const {
        data: {
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
    const currentIdChat = useRef();

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
            } else {
                setShouldScrollToBottom(false);
            }
            if (!received.imageUrl) received.content = `${t('chatBox.image')}`;
            dispatch(updateLastMessage(received));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentUserId, shouldScrollToBottom, t],
    );

    useEffect(() => {
        if (!currentChat || !idChatParams || !socketService.isReady()) return;

        let idChat = isSearch ? getIdChatByUserId(idChatParams) : idChatParams;

        socketService.subscribe(`/group/${idChat}`, onMessageReceive);

        return () => {
            socketService.unsubscription(`/group/${idChat}`);
        };
    }, [currentChat, getIdChatByUserId, isSearch, onMessageReceive, idChatParams]);

    const fetchMessages = useCallback(
        async (currentPage) => {
            if (!idChatParams || loading) return;

            let idChat = isSearch ? getIdChatByUserId(idChatParams) : idChatParams;
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
                toast.error(error?.response?.data?.message);
                dispatch(setCurrentChat(false));
                navigate(`/chats`, { replace: true });
                return;
            }

            if (data) {
                dispatch(setCurrentChat(true));
                setIsChatCreated(true);
                setChatId(idChatParams);
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
        [idChatParams, isSearch, getIdChatByUserId],
    );

    useEffect(() => {
        if (!idChatParams) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idChatParams, containerRef]);

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
    }, [shouldScrollToBottom, lastMessageRef]);

    useEffect(() => {
        if (dataMessage.length > 0) {
            setIsChatCreated(true);
        } else {
            setIsChatCreated(false);
        }
    }, [dataMessage]);

    const handleSendMessage = useCallback(
        async (message, imageUrl) => {
            const contentToSend = message || content.trim();
            if (!idChatParams) return;

            currentIdChat.current = chatId;

            const timestamp = new Date().toISOString();

            const currentUser = {
                id: currentUserId,
                firstName,
                lastName,
                email,
                profilePicture,
            };

            const targetUser = {
                id: idChatParams,
                firstName: firstNameCurrentChat,
                lastName: lastNameCurrentChat,
                email: emailCurrentChat,
                profilePicture: profilePictureCurrentChat,
            };

            if (!isChatCreated) {
                const [error, result] = await createSingleChat(idUser);
                if (error) {
                    toast.error(error?.response?.data?.message);
                    return;
                }

                currentIdChat.current = result?.data?.id;
                const body = {
                    chatImage: null,
                    chatName: null,
                    createdBy: currentUser,
                    id: currentIdChat.current,
                    isGroup: false,
                    users: [currentUser, targetUser],
                    content: contentToSend,
                    timestamp,
                    chatId: currentIdChat.current,
                };

                socketService.send('single-chat-created', body);
                socketService.subscribe(`/group/${currentIdChat.current}`, onMessageReceive);
                setChatId(currentIdChat.current);
                setIsChatCreated(true);
            }

            const localMessage = {
                chatId: currentIdChat.current,
                content: contentToSend,
                user: currentUser,
                timestamp,
                imageUrl,
            };

            dispatch(updateLastMessage(localMessage));
            setDataMessage((prev) => [...prev, localMessage]);

            if (socketService.isReady()) {
                socketService.send('message', {
                    chatId: currentIdChat.current,
                    content: contentToSend,
                    userId: currentUserId,
                    timestamp,
                });
                setContent('');
            }

            if (!imageUrl && contentToSend) {
                setIsSending(true);
                await sendMessage({ chatId: currentIdChat.current, content: contentToSend });
                setIsSending(false);
            }
            setShouldScrollToBottom(true);
            dispatch(updateChats({ id: currentIdChat.current }));
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
            idChatParams,
            idUser,
            isChatCreated,
            lastName,
            lastNameCurrentChat,
            onMessageReceive,
            profilePicture,
            profilePictureCurrentChat,
        ],
    );

    useEffect(() => {
        if (lastMessageRef.current && shouldScrollToBottom) {
            requestAnimationFrame(() => {
                lastMessageRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
            });
        }
    }, [shouldScrollToBottom, lastMessageRef]);

    return {
        handleSendMessage,
        isSending,
        setIsSending,
        currentChat,
        loading,
        dataMessage,
        currentUserId,
        content,
        setContent,
        getMessageProps,
        currentIdChat,
        setShouldScrollToBottom,
        shouldScrollToBottom,
    };
};

export default useChatBoxLogic;

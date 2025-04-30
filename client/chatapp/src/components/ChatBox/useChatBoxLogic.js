import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import useKeyValue from '~/hooks/useKeyValue';
import {
    removeLastMessageById,
    setCurrentChat,
    setSending,
    updateChats,
    updateLastMessage,
} from '~/redux/reducers/chatSlice';
import socketService from '~/services/socket/socketService';
import { getAllMessagesFromChat, sendMessage } from '~/services/message/messageService';
import { createSingleChat } from '~/services/chat/chatService';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const getMessageProps = (list, index, item) => {
    const getTimeDiffInMinutes = (a, b) => {
        if (!a || !b) return;
        return (new Date(a) - new Date(b)) / (1000 * 60);
    };

    const isSameUser = (a, b) => a?.user?.id && b?.user.id && a.user.id === b.user.id;

    const isValidMessage = (msg) => {
        return msg && (!!msg.content || !!msg.imageUrl);
    };

    const checkGroup = (val1, val2) => {
        const timeDiff = getTimeDiffInMinutes(val1.timestamp, val2.timestamp);
        return timeDiff <= 2 && isSameUser(val1, val2);
    };

    const isFirst = index === 0;
    const isLast = index === list.length - 1;

    let prev = null;
    let next = null;

    let isGroupedWithNext = null;
    let isGroupedWithPrevious = null;

    if (isValidMessage(list[index - 1])) {
        prev = list[index - 1];
        isGroupedWithPrevious = checkGroup(item, prev);
    }

    if (isValidMessage(list[index + 1])) {
        next = list[index + 1];
        isGroupedWithNext = checkGroup(next, item);
    }

    const isLike = item?.content === 'like';
    const hasImage = !!item?.imageUrl;
    const prevHasImage = prev ? prev.imageUrl : null;
    const nextHasImage = next ? next.imageUrl : null;
    const prevIsLike = prev ? prev.content === 'like' : null;
    const nextIsLike = next ? next.content === 'like' : null;

    // khong group voi anh hoac like
    if ((!isLike || !hasImage) && (nextIsLike || nextHasImage)) {
        isGroupedWithPrevious = true;
        isGroupedWithNext = false;
    }

    // khong group next khi item == last
    if (isLast && (hasImage || isLike)) {
        isGroupedWithNext = false;
    }

    if (isLike) {
        if (nextIsLike && checkGroup(next, item)) {
            isGroupedWithNext = true;
        }
    } else {
        if (prevIsLike && checkGroup(item, prev)) {
            isGroupedWithPrevious = false;
        }
    }

    // khong group khi content or like o giua image
    if (!hasImage && prevHasImage && nextHasImage) {
        isGroupedWithNext = false;
        isGroupedWithPrevious = false;
    }

    // group voi sau no la 1 img
    if (hasImage) {
        if (prevHasImage) isGroupedWithPrevious = true;
        if (!nextHasImage || isLike || !checkGroup(next, item)) {
            isGroupedWithPrevious = false;
        }
    }

    if (!isLike && !hasImage) {
        // khong group khi 2 ben la img or like
        if (prevIsLike && nextIsLike) {
            isGroupedWithNext = false;
            isGroupedWithPrevious = false;
        }
        // ko group khi trc no la img or like
        if (prevIsLike || prevHasImage) {
            isGroupedWithPrevious = false;
        }
    }

    // ko group voi truoc khi != user
    if (!isSameUser(item, prev)) {
        isGroupedWithPrevious = false;
    }

    if (prev && !checkGroup(item, prev)) {
        isGroupedWithPrevious = false;
    }

    return {
        prev,
        next,
        isFirst,
        isLast,
        isGroupedWithNext,
        isGroupedWithPrevious,
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
            // if (received.imageUrl) received.content = `${t('chatBox.image')}`;
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
        async (message, imageUrl, chatIdError = null) => {
            dispatch(setSending(true));
            const contentToSend = message;
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
            if (chatIdError) {
                // delete if there is chatId because of error
                dispatch(removeLastMessageById(chatId));
                return;
            } else {
                dispatch(updateLastMessage(localMessage));
            }

            setDataMessage((prev) => [...prev, localMessage]);

            if (contentToSend && !imageUrl) {
                await sendMessage({ chatId: currentIdChat.current, content: contentToSend });

                if (socketService.isReady()) {
                    socketService.send('message', {
                        chatId: currentIdChat.current,
                        content: contentToSend,
                        userId: currentUserId,
                        timestamp,
                    });
                    setContent('');
                }
            }

            setShouldScrollToBottom(true);
            dispatch(updateChats({ id: currentIdChat.current }));
        },
        [
            chatId,
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
        // isSending,
        // setIsSending,
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
        setDataMessage,
    };
};

export default useChatBoxLogic;

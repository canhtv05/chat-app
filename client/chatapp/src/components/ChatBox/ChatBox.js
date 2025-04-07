import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import RenderIf from '../RenderIf';
import icons from '~/assets/icons';
import ChatBoxHeader from './ChatBoxHeader';
import MessageCard from '../MessageCard';
import ChatBoxFooter from './ChatBoxFooter';
import { ChatCardContext } from '~/contexts/ChatCardProvider';
import { getAllMessagesFromChat, sendMessage } from '~/services/message/messageService';
import { createSingleChat } from '~/services/chat/chatService';
import cookieUtil from '~/utils/cookieUtils';
import useKeyValue from '~/hooks/useKeyValue';
import { updateLastMessage } from '~/redux/reducers/chatSlice';

function ChatBox() {
    const dispatch = useDispatch();
    const { currentChat } = useContext(ChatCardContext);
    const { id: targetId, isSearch, idUser } = useSelector((state) => state.chat.data);
    const idChatOfUser = useSelector((state) => state.chat.idChatOfUser);
    const { id: currentUserId, firstName, lastName } = useSelector((state) => state.auth.data.data);

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

    const [stompClient, setStompClient] = useState();
    const [isConnected, setIsConnected] = useState(false);

    const getIdChatByUserId = useKeyValue(idChatOfUser, null);

    const connect = useCallback(() => {
        const sock = new SockJS('http://localhost:1710/api/ws');
        const client = new Client({
            webSocketFactory: () => sock,
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${cookieUtil.getStorage()?.accessToken}`,
            },
            onConnect: () => setIsConnected(true),
            onStompError: () => setIsConnected(false),
            onDisconnect: () => setIsConnected(false),
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
            setStompClient(null);
            setIsConnected(false);
        };
    }, []);

    const onMessageReceive = useCallback(
        (payload) => {
            const received = JSON.parse(payload.body);
            if (received?.user?.id !== currentUserId) {
                setDataMessage((prev) => [...prev, received]);
            }
            // console.log('Received message:', received);
            dispatch(updateLastMessage(received));
        },
        [currentUserId, dispatch],
    );

    useEffect(() => {
        if (!isConnected || !stompClient || !currentChat) return;

        let idChat = isSearch ? getIdChatByUserId(targetId) : targetId;
        if (isConnected && stompClient && currentChat) {
            const subscription = stompClient.subscribe(`/group/${idChat}`, onMessageReceive);
            return () => {
                if (stompClient && stompClient.connected) subscription?.unsubscribe();
            };
        }
    }, [isConnected, currentChat, stompClient, getIdChatByUserId, isSearch, targetId, onMessageReceive]);

    useEffect(() => {
        const cleanup = connect();
        return cleanup;
    }, [connect]);

    const fetchMessages = useCallback(
        async (currentPage) => {
            if (!targetId || loading) return;

            let idChat = isSearch ? getIdChatByUserId(targetId) : targetId;
            if (!idChat) {
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

    const handleSendMessage = useCallback(async () => {
        if (!content.trim() || !targetId) return;

        let currentChatId = chatId;

        if (!isChatCreated) {
            const [error, result] = await createSingleChat(idUser);
            if (error) {
                console.error('Failed to create chat:', error);
                return;
            }
            setIsChatCreated(true);
            currentChatId = result.data.id;
            setChatId(currentChatId);
        }

        const timestamp = new Date().toISOString();

        const localMessage = {
            chatId: currentChatId,
            content: content,
            user: { id: currentUserId, firstName, lastName },
            timestamp,
        };

        // console.log('local: ', localMessage);

        dispatch(updateLastMessage(localMessage));
        setDataMessage((prev) => [...prev, localMessage]);

        if (stompClient && isConnected) {
            stompClient.publish({
                destination: '/app/message',
                body: JSON.stringify({
                    chatId: currentChatId,
                    content: content,
                    userId: currentUserId,
                    timestamp,
                }),
            });
            setContent('');
        }

        const request = { chatId: currentChatId, content };
        setShouldScrollToBottom(true);
        sendMessage(request);
    }, [
        chatId,
        content,
        idUser,
        isChatCreated,
        stompClient,
        targetId,
        currentUserId,
        isConnected,
        dispatch,
        firstName,
        lastName,
    ]);

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-background">
            <RenderIf value={!currentChat}>
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 flex flex-col items-center">
                    <img loading className="object-cover w-[80%] h-[80%]" src={icons.meow} alt={Math.random(0, 100)} />
                    <span className="text-text-bold font-semibold">It looks a little quiet here...</span>
                    <span className="text-text-bold font-semibold">Start a new conversation and let's talk!</span>
                </div>
            </RenderIf>
            <RenderIf value={currentChat}>
                <div className="flex flex-col h-full">
                    <div className="shrink-0">
                        <ChatBoxHeader />
                    </div>
                    <div className="flex-1 overflow-hidden py-3">
                        <div className="px-10 h-full overflow-y-auto scroll-smooth" ref={containerRef}>
                            <div className="space-y-1 flex flex-col mt-2">
                                <RenderIf value={dataMessage.length === 0}>
                                    <p className="p-5 text-text-light font-semibold text-center">
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
                    <div className="shrink-0 border-border border-t">
                        <ChatBoxFooter content={content} setContent={setContent} onSend={handleSendMessage} />
                    </div>
                </div>
            </RenderIf>
        </div>
    );
}

export default ChatBox;

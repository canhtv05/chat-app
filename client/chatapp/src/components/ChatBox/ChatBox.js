import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
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

function ChatBox() {
    const { currentChat } = useContext(ChatCardContext);
    const { id: targetId, isSearch, idUser } = useSelector((state) => state.chat.data);
    const idChatOfUser = useSelector((state) => state.chat.idChatOfUser);
    const { id: currentUserId } = useSelector((state) => state.auth.data.data);

    const lastMessageRef = useRef(null);
    const observer = useRef(null);
    const firstMessageItemRef = useRef(null);
    const isInitialFetch = useRef(true);

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

    const getIdChatByUserId = useCallback((userId) => idChatOfUser[userId] || null, [idChatOfUser]);

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
            if (received?.userId !== currentUserId) {
                setDataMessage((prev) => [...prev, received]);
            }
        },
        [currentUserId],
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
            console.log('Gọi API với idChat:', idChat, 'page:', currentPage);
            setLoading(true);
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
                setHasMore(data?.meta?.pagination?.currentPage > 1);

                if (isInitialFetch.current) {
                    setPage(data?.meta?.pagination?.currentPage || -1);
                    isInitialFetch.current = false;
                }
            }
        },
        [targetId, isSearch, getIdChatByUserId, loading],
    );

    useEffect(() => {
        if (!targetId) {
            setDataMessage([]);
            setIsChatCreated(false);
            setHasMore(false);
            setLoading(false);
            setPage(-1);
            isInitialFetch.current = true;
            return;
        }

        fetchMessages(-1);
    }, [targetId, fetchMessages]);

    useEffect(() => {
        if (page === -1 || loading || !hasMore || isInitialFetch.current) return;
        fetchMessages(page);
    }, [page, fetchMessages, hasMore, loading]);

    useEffect(() => {
        if (!hasMore || loading) return;

        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage((prev) => prev - 1);
            }
        });

        if (firstMessageItemRef.current) {
            observer.current.observe(firstMessageItemRef.current);
        }

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

        const localMessage = {
            chatId: currentChatId,
            content: content,
            user: { id: currentUserId },
        };
        setDataMessage((prev) => [...prev, localMessage]);

        if (stompClient && isConnected) {
            stompClient.publish({
                destination: '/app/message',
                body: JSON.stringify({
                    chatId: currentChatId,
                    content: content,
                    userId: currentUserId,
                }),
            });
            setContent('');
        }

        const request = { chatId: currentChatId, content };
        sendMessage(request);
        setShouldScrollToBottom(true);
    }, [chatId, content, idUser, isChatCreated, stompClient, targetId, currentUserId, isConnected]);

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-background">
            <RenderIf value={!currentChat}>
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 flex flex-col items-center">
                    <img className="object-cover w-[80%] h-[80%]" src={icons.meow} alt={Math.random(0, 100)} />
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
                        <div className="px-10 h-full overflow-y-auto scroll-smooth">
                            <div className="space-y-1 flex flex-col mt-2">
                                <RenderIf value={dataMessage.length === 0}>
                                    <p className="p-5 text-text-light font-semibold text-center">
                                        No messages here. Why not send one 😀?
                                    </p>
                                </RenderIf>
                                {dataMessage.map((data, index) => {
                                    if (index === dataMessage.length - 1) {
                                        return (
                                            <MessageCard
                                                ref={lastMessageRef}
                                                key={index}
                                                isMe={currentUserId === dataMessage[index]?.user?.id}
                                                content={data?.content}
                                            />
                                        );
                                    } else if (index === 0) {
                                        return (
                                            <MessageCard
                                                ref={firstMessageItemRef}
                                                key={index}
                                                isMe={currentUserId === dataMessage[index]?.user?.id}
                                                content={data?.content}
                                            />
                                        );
                                    } else {
                                        return (
                                            <MessageCard
                                                key={index}
                                                isMe={currentUserId === dataMessage[index]?.user?.id}
                                                content={data?.content}
                                            />
                                        );
                                    }
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

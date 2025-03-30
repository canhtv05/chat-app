import { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Client, Stomp } from '@stomp/stompjs';

// import Stomp from 'stompjs';
// import SockJS from 'sockjs-client/dist/sockjs';
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

    const [dataMessage, setDataMessage] = useState([]);
    const [content, setContent] = useState('');
    const [isChatCreated, setIsChatCreated] = useState(false);
    const [chatId, setChatId] = useState(''); // id string

    const [stompClient, setStompClient] = useState();
    const [isConnected, setIsConnected] = useState(false);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    };

    const getIdChatByUserId = useCallback(
        (userId) => {
            return idChatOfUser[userId] || null;
        },
        [idChatOfUser],
    );

    const connect = useCallback(() => {
        const sock = new SockJS('http://localhost:1710/api/ws');
        const client = new Client({
            webSocketFactory: () => sock,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
            connectHeaders: {
                Authorization: `Bearer ${cookieUtil.getStorage()?.accessToken}`,
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
            },
            onConnect: () => {
                console.log('Connected to WebSocket');
                setIsConnected(true);
            },
            onStompError: (error) => {
                console.error('STOMP Error:', error);
                setIsConnected(false);
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setIsConnected(false);
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
            setStompClient(null);
            setIsConnected(false);
        };
    }, []);

    // useEffect(() => {
    //     if (message && stompClient) {
    //         setDataMessage((prev) => [...prev, message]);
    //         stompClient?.send('/app/message', {}, JSON.stringify(message));
    //     }
    // }, [message, stompClient]);

    // useEffect(() => {
    //     setMessage(message);
    // }, [message]);

    const onMessageReceive = useCallback(
        (payload) => {
            const received = JSON.parse(payload.body);

            console.log('receive message: ', received);
            // setDataMessage((prev) => [...prev, received]);
            console.log(received?.userId, currentUserId);
            if (received?.userId !== currentUserId) {
                setDataMessage((prev) => [...prev, received]);
            }
        },
        [currentUserId],
    );

    useEffect(() => {
        if (!isConnected || !stompClient || !currentChat) return;

        let idChat = targetId;
        if (isSearch) {
            idChat = getIdChatByUserId(targetId); // targetId is currently userId
        }

        if (isConnected && stompClient && currentChat) {
            const subscription = stompClient.subscribe(`/group/${idChat}`, onMessageReceive);

            return () => {
                if (stompClient && stompClient.connected) {
                    subscription?.unsubscribe();
                }
            };
        }
    }, [isConnected, currentChat, stompClient, getIdChatByUserId, isSearch, targetId, onMessageReceive]);

    useEffect(() => {
        const cleanup = connect();
        return cleanup;
    }, [connect]);

    // useEffect(() => {
    //     setDataMessage(message.dataMessage);
    // }, [message.dataMessage]);

    useEffect(() => {
        let idChat = targetId;
        if (!targetId) {
            setDataMessage([]);
            setIsChatCreated(false);
            return;
        }

        if (isSearch) {
            idChat = getIdChatByUserId(targetId); // targetId is currently userId
        }

        const fetchApi = async () => {
            const [error, data] = await getAllMessagesFromChat(idChat);
            if (error) {
                setDataMessage([]);
                console.log(error);
                return;
            }
            setIsChatCreated(true);
            setChatId(targetId);
            setDataMessage(data.data);
        };
        fetchApi();
    }, [targetId, isSearch, getIdChatByUserId]);

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

        const messagePayload = {
            chatId: currentChatId,
            content: content,
            userId: currentUserId,
        };

        // Hiển thị tin nhắn ngay lập tức trên giao diện của người gửi
        const localMessage = {
            chatId: currentChatId,
            content: content,
            user: { id: currentUserId },
        };
        setDataMessage((prev) => [...prev, localMessage]);

        // Gửi tin nhắn qua WebSocket
        if (stompClient && isConnected) {
            stompClient.publish({
                destination: '/app/message',
                body: JSON.stringify(messagePayload),
            });
            setContent('');
        } else {
            console.error('WebSocket not connected');
        }
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
                        <div className="px-10 h-full overflow-y-auto">
                            <div className="space-y-1 flex flex-col mt-2">
                                <RenderIf value={dataMessage.length === 0}>
                                    <p className="p-5 text-text-light font-semibold text-center">
                                        No messages here. Why not send one 😀?
                                    </p>
                                </RenderIf>
                                {dataMessage.map((data, index) => (
                                    <MessageCard
                                        key={index}
                                        isMe={currentUserId === dataMessage[index]?.user?.id}
                                        content={data?.content}
                                    />
                                ))}
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

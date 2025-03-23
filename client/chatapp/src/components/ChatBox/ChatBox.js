import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import RenderIf from '../RenderIf';
import icons from '~/assets/icons';
import ChatBoxHeader from './ChatBoxHeader';
import MessageCard from '../MessageCard';
import ChatBoxFooter from './ChatBoxFooter';
import { ChatCardContext } from '~/contexts/ChatCardProvider';
import { getAllMessagesFromChat, sendMessage } from '~/services/message/messageService';
import { createSingleChat } from '~/services/chat/chatService';

function ChatBox() {
    const { currentChat } = useContext(ChatCardContext);
    const { id: targetId, isSearch, idUser } = useSelector((state) => state.chat.data);
    const { id: currentUserId } = useSelector((state) => state.auth.data.data);

    const [dataMessage, setDataMessage] = useState([]);
    const [content, setContent] = useState('');
    const [isChatCreated, setIsChatCreated] = useState(false);
    const [chatId, setChatId] = useState(''); // id string

    useEffect(() => {
        if (!targetId || isSearch) {
            setDataMessage([]);
            setIsChatCreated(false);
            return;
        }
        const fetchApi = async () => {
            const [error, data] = await getAllMessagesFromChat(targetId);
            if (error) {
                setDataMessage([]);
                return;
            }
            setIsChatCreated(true);
            setChatId(targetId);
            setDataMessage(data.data);
        };
        fetchApi();
    }, [targetId, isSearch]);

    useEffect(() => {
        console.log(idUser);
    }, [idUser]);

    const handleSendMessage = async () => {
        if (!content.trim() || !targetId) return;

        let currentChatId = chatId;

        if (!isChatCreated) {
            const [error, result] = await createSingleChat(idUser);
            console.log(result);
            if (error) {
                console.error('Failed to create chat');
                return;
            }
            setIsChatCreated(true);
            currentChatId = result.data.id;
            setChatId(currentChatId);
        }

        const [errorSendMsg, resultSendMsg] = await sendMessage({ chatId: currentChatId, content });
        if (errorSendMsg) {
            console.error('Failed to send message');
            return;
        }

        setDataMessage((prev) => [...prev, resultSendMsg.data]);
        setContent('');
    };

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
                        <ChatBoxHeader isOnline />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="px-10 h-full overflow-y-auto">
                            <div className="space-y-1 flex flex-col mt-2">
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

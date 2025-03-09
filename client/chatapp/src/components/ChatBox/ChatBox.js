import { useContext } from 'react';

import RenderIf from '../RenderIf';
import icons from '~/assets/icons';
import ChatBoxHeader from './ChatBoxHeader';
import MessageCard from '../MessageCard';
import ChatBoxFooter from './ChatBoxFooter';
import { ChatCardContext } from '~/contexts/ChatCardProvider';

function ChatBox() {
    const { currentChat } = useContext(ChatCardContext);

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
                                {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => (
                                    <MessageCard key={index} isMe={index % 2 === 0} content={'eiohfuie'} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 border-border border-t">
                        <ChatBoxFooter />
                    </div>
                </div>
            </RenderIf>
        </div>
    );
}

export default ChatBox;

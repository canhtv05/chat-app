import { Fragment, useRef } from 'react';

import RenderIf from '../RenderIf';
import icons from '~/assets/icons';
import ChatBoxHeader from './ChatBoxHeader';
import ChatBoxFooter from './ChatBoxFooter';
import LoadingIcon from '../LoadingIcon';
import { ScrollToBottom } from '../ScrollTo';
import DateUtils from '~/utils/dateUtils';
import useChatBoxLogic from './useChatBoxLogic';
import { MessageCard } from '../MessageCard';

function ChatBox() {
    const firstMessageItemRef = useRef();
    const lastMessageRef = useRef();
    const containerRef = useRef();
    const {
        content,
        currentChat,
        currentUserId,
        dataMessage,
        handleSendMessage,
        isSending,
        loading,
        setContent,
        getMessageProps,
    } = useChatBoxLogic({ containerRef, firstMessageItemRef, lastMessageRef });

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-base-100">
            <RenderIf value={!currentChat}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
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
                    <div className="flex-1 relative overflow-hidden py-3">
                        <RenderIf value={loading}>
                            <div className="flex justify-center px-5">
                                <LoadingIcon size={30} />
                            </div>
                        </RenderIf>
                        <div className="px-5 h-full overflow-y-auto" ref={containerRef}>
                            <ScrollToBottom containerRef={containerRef}>
                                <div className="flex flex-col mt-2">
                                    <RenderIf value={dataMessage.length === 0}>
                                        <p className="p-5 text-base-content font-semibold text-center">
                                            No messages here. Why not send one 😀?
                                        </p>
                                    </RenderIf>
                                    {dataMessage.map((data, index) => {
                                        const {
                                            isFirst,
                                            isGroupedWithNext,
                                            isGroupedWithPrevious,
                                            isLast,
                                            prev,
                                            isHasIconNext,
                                            isHasIconPrevious,
                                        } = getMessageProps(dataMessage, index, data);

                                        const dateSeparator = DateUtils.getDateSeparator(
                                            data?.timestamp,
                                            prev?.timestamp,
                                        );

                                        return (
                                            <Fragment key={index}>
                                                <RenderIf value={dateSeparator}>
                                                    <div className="flex justify-center w-full sticky top-0">
                                                        <span className="text-sm text-base-content my-2 badge min-w-[100px] badge-neutral">
                                                            {dateSeparator}
                                                        </span>
                                                    </div>
                                                </RenderIf>
                                                <MessageCard
                                                    isHasIconPrevious={isHasIconPrevious}
                                                    isHasIconNext={isHasIconNext}
                                                    isGroupedWithPrevious={isGroupedWithPrevious}
                                                    isGroupedWithNext={isGroupedWithNext}
                                                    isSending={isSending}
                                                    ref={isFirst ? firstMessageItemRef : isLast ? lastMessageRef : null}
                                                    isLast={isLast}
                                                    isMe={currentUserId === data?.user?.id}
                                                    data={{
                                                        content: data?.content,
                                                        timestamp: data?.timestamp,
                                                        prevTimestamp: prev?.timestamp,
                                                    }}
                                                />
                                            </Fragment>
                                        );
                                    })}
                                </div>
                            </ScrollToBottom>
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

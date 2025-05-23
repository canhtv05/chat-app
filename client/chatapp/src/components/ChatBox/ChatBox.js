import { Fragment, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import RenderIf from '../RenderIf';
import ChatBoxHeader from './ChatBoxHeader';
import ChatBoxFooter from './ChatBoxFooter';
import LoadingIcon from '../LoadingIcon';
import { ScrollToBottom } from '../ScrollTo';
import DateUtils from '~/utils/dateUtils';
import useChatBoxLogic from './useChatBoxLogic';
import { MessageCard } from '../MessageCard';

function ChatBox() {
    const { t } = useTranslation();
    const firstMessageItemRef = useRef();
    const lastMessageRef = useRef();
    const containerRef = useRef();

    const { idChat } = useParams();

    const prevPath = useRef(idChat);

    const {
        content,
        currentChat,
        currentUserId,
        dataMessage,
        handleSendMessage,
        loading,

        setContent,
        getMessageProps,
        currentIdChat,
        // isSending,
        // setIsSending,
        setShouldScrollToBottom,
    } = useChatBoxLogic({ containerRef, firstMessageItemRef, lastMessageRef });

    useEffect(() => {
        if (containerRef.current && prevPath.current !== idChat) {
            requestAnimationFrame(() => {
                containerRef.current.scrollTo({
                    top: containerRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            });
        }

        prevPath.current = idChat;
    }, [idChat]);

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-base-100">
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
                                            {t('chatBox.noMessages')}
                                        </p>
                                    </RenderIf>
                                    {dataMessage.map((data, index) => {
                                        const { isFirst, isGroupedWithNext, isGroupedWithPrevious, isLast, prev } =
                                            getMessageProps(dataMessage, index, data);

                                        const dateSeparator = DateUtils.getDateSeparator(
                                            data?.timestamp,
                                            prev?.timestamp,
                                            t,
                                        );

                                        return (
                                            <Fragment key={index}>
                                                <RenderIf value={dateSeparator}>
                                                    <div className="flex justify-center w-full sticky top-0">
                                                        <span className="text-sm text-neutral-content my-2 rounded-xl badge min-w-[100px] badge-neutral">
                                                            {dateSeparator}
                                                        </span>
                                                    </div>
                                                </RenderIf>
                                                <MessageCard
                                                    isGroupedWithPrevious={isGroupedWithPrevious}
                                                    isGroupedWithNext={isGroupedWithNext}
                                                    // isSending={isSending}
                                                    ref={isFirst ? firstMessageItemRef : isLast ? lastMessageRef : null}
                                                    isLast={isLast}
                                                    isMe={currentUserId === data?.user?.id}
                                                    data={{
                                                        content: data?.content,
                                                        timestamp: data?.timestamp,
                                                        prevTimestamp: prev?.timestamp,
                                                        imageUrl: data?.imageUrl,
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
                        <ChatBoxFooter
                            content={content}
                            setContent={setContent}
                            onSend={handleSendMessage}
                            // setIsSending={setIsSending}
                            currentIdChat={currentIdChat}
                            setShouldScrollToBottom={setShouldScrollToBottom}
                        />
                    </div>
                </div>
            </RenderIf>
        </div>
    );
}

export default ChatBox;

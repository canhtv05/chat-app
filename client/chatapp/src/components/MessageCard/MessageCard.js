import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkDone, IoCheckmark } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { AiFillLike } from 'react-icons/ai';

import RenderIf from '../RenderIf';
import DateUtils from '~/utils/dateUtils';
import BadgeItemMessage from './BadgeItemMessage';
import { useSelector } from 'react-redux';
const MessageCard = forwardRef(({ isMe, data, isLast, isGroupedWithPrevious, isGroupedWithNext }, ref) => {
    const { t } = useTranslation();
    const { sending } = useSelector((state) => state.chat);
    let borderRadiusClass = 'rounded-3xl';
    if (isGroupedWithPrevious || isGroupedWithNext) {
        if (isMe) {
            if (isGroupedWithPrevious && isGroupedWithNext) {
                // Tin nhắn ở giữa
                borderRadiusClass = 'rounded-tl-3xl rounded-bl-3xl rounded-tr-lg rounded-br-lg my-[0.5px]';
            } else if (isGroupedWithPrevious) {
                // Tin nhắn cuối nhóm
                borderRadiusClass = 'rounded-tl-3xl rounded-bl-3xl rounded-tr-lg rounded-br-3xl mt-[0.5px]';
            } else if (isGroupedWithNext) {
                // Tin nhắn đầu nhóm
                borderRadiusClass = 'rounded-tl-3xl rounded-bl-3xl rounded-tr-3xl rounded-br-lg mb-[0.5px]';
            }
        } else {
            if (isGroupedWithPrevious && isGroupedWithNext) {
                // Tin nhắn ở giữa
                borderRadiusClass = 'rounded-tr-3xl rounded-br-3xl rounded-tl-lg rounded-bl-lg my-[0.5px]';
            } else if (isGroupedWithPrevious) {
                // Tin nhắn cuối nhóm
                borderRadiusClass = 'rounded-tr-3xl rounded-br-3xl rounded-tl-lg rounded-bl-3xl mt-[0.5px]';
            } else if (isGroupedWithNext) {
                // Tin nhắn đầu nhóm
                borderRadiusClass = 'rounded-tr-3xl rounded-br-3xl rounded-tl-3xl rounded-bl-lg mb-[0.5px]';
            }
        }
    }

    useEffect(() => {
        console.log(sending);
    }, [sending]);

    const currentTimestamp = DateUtils.getHoursAndMinutes(data?.timestamp);
    const isLike = data?.content === 'like';

    return (
        <div ref={ref}>
            <RenderIf value={!!data.content}>
                <div
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full ${
                        isGroupedWithPrevious ? 'mt-0' : 'mt-1'
                    }`}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-[50%]"
                    >
                        <div
                            className={`border-base-300 border break-words text-left ${
                                isMe ? 'bg-primary text-neutral-content' : 'bg-base-200'
                            } ${borderRadiusClass} ${
                                data?.content === 'like'
                                    ? 'bg-transparent border-none p-0 px-0'
                                    : isMe
                                    ? 'bg-primary p-2 px-3'
                                    : 'bg-base-200 p-2 px-3'
                            }`}
                        >
                            <RenderIf value={data.content !== 'like'}>
                                <p>{data.content}</p>
                            </RenderIf>
                            <RenderIf value={data.content === 'like'}>
                                <div className="w-full flex justify-end">
                                    <AiFillLike className="size-16 text-primary" />
                                </div>
                            </RenderIf>
                            <div className="text-xs text-gray-400 mt-1">
                                <RenderIf value={!isGroupedWithNext}>
                                    <RenderIf value={!isLike}>
                                        <BadgeItemMessage isMe={isMe} time={currentTimestamp} />
                                    </RenderIf>
                                    <RenderIf value={isLike && !isLast}>
                                        <BadgeItemMessage isMe={isMe} time={currentTimestamp} badge />
                                    </RenderIf>
                                </RenderIf>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </RenderIf>
            <RenderIf value={!!data.imageUrl}>
                <div className={`flex w-full mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <img
                        className={`object-contain block max-w-[48%] max-h-[300px] rounded-xl`}
                        src={data.imageUrl}
                        alt="img"
                    />
                </div>
                <RenderIf value={!isGroupedWithPrevious && !isLast}>
                    <BadgeItemMessage isMe={isMe} time={currentTimestamp} badge />
                </RenderIf>
            </RenderIf>
            <div className="w-full flex justify-end">
                <RenderIf value={isLast && isMe}>
                    <RenderIf value={sending}>
                        <div className="badge badge-neutral rounded-full mt-1">
                            <IoCheckmark />
                            <span className="ml-1">{t('chatBox.sending')}</span>
                        </div>
                    </RenderIf>
                    <RenderIf value={!sending}>
                        <div className="flex mt-1">
                            <RenderIf value={data.imageUrl || data.content === 'like'}>
                                <div className="badge badge-neutral rounded-full mt-1 mr-2">
                                    <span>{currentTimestamp}</span>
                                </div>
                            </RenderIf>
                            <div className="badge badge-neutral rounded-full mt-1">
                                <IoCheckmarkDone />
                                <span className="ml-1">{t('chatBox.sent')}</span>
                            </div>
                        </div>
                    </RenderIf>
                </RenderIf>
            </div>
            <div className="flex justify-start w-full">
                <RenderIf value={isLast && !isMe}>
                    <RenderIf
                        value={
                            !isGroupedWithPrevious && !isGroupedWithNext && (data.imageUrl || data.content === 'like')
                        }
                    >
                        <div className="badge badge-neutral rounded-full mt-1 mr-2">
                            <span>{currentTimestamp}</span>
                        </div>
                    </RenderIf>
                </RenderIf>
            </div>
            {/* {`${isGroupedWithNext}, ${isGroupedWithPrevious}, ${isLast}, ${isLike}`} */}
        </div>
    );
});

MessageCard.propTypes = {
    isMe: PropTypes.bool,
    content: PropTypes.string,
    isGroupedWithPrevious: PropTypes.bool,
    isGroupedWithNext: PropTypes.bool,
};

export default MessageCard;

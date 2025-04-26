import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkDone, IoCheckmark } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { AiFillLike } from 'react-icons/ai';

import RenderIf from '../RenderIf';
import DateUtils from '~/utils/dateUtils';
import BadgeItemMessage from './BadgeItemMessage';
const MessageCard = forwardRef(
    (
        { isMe, data, isSending, isLast, isGroupedWithPrevious, isGroupedWithNext, isHasIconNext, isHasIconPrevious },
        ref,
    ) => {
        const { t } = useTranslation();
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

        const currentTimestamp = DateUtils.getHoursAndMinutes(data?.timestamp);
        const prevTimestamp = DateUtils.getHoursAndMinutes(data?.prevTimestamp);

        return (
            <>
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
                            ref={ref}
                            className={`p-2 px-3 border-base-300 border break-words text-left ${
                                isMe ? 'bg-primary text-neutral-content' : 'bg-base-200'
                            } ${borderRadiusClass} ${
                                data?.content === 'like'
                                    ? 'bg-transparent border-none p-0 px-0'
                                    : isMe
                                    ? 'bg-primary'
                                    : 'bg-base-200'
                            }`}
                        >
                            <RenderIf value={data?.content !== 'like'}>
                                <p>{data?.content}</p>
                            </RenderIf>
                            <RenderIf value={data?.content === 'like'}>
                                <div ref={ref} className="w-full flex justify-end">
                                    <AiFillLike className="size-16 text-primary" />
                                </div>
                            </RenderIf>
                            <RenderIf value={isGroupedWithPrevious && !isGroupedWithNext && data?.content !== 'like'}>
                                <BadgeItemMessage isMe={isMe} time={currentTimestamp} />
                            </RenderIf>
                            <RenderIf
                                value={
                                    !isGroupedWithNext &&
                                    !isGroupedWithPrevious &&
                                    !isHasIconPrevious &&
                                    data?.content !== 'like' &&
                                    prevTimestamp !== currentTimestamp &&
                                    !isHasIconNext &&
                                    !isLast
                                }
                            >
                                <RenderIf value={!isMe}>
                                    <BadgeItemMessage isMe={isMe} time={currentTimestamp} />
                                </RenderIf>
                            </RenderIf>
                            <RenderIf
                                value={
                                    !isGroupedWithPrevious &&
                                    !isGroupedWithNext &&
                                    !isHasIconNext &&
                                    !isHasIconPrevious &&
                                    prevTimestamp === currentTimestamp
                                }
                            >
                                <RenderIf value={data?.content !== 'like' && !isLast && !isMe}>
                                    <BadgeItemMessage isMe={isMe} time={currentTimestamp} />
                                </RenderIf>
                            </RenderIf>
                            <RenderIf
                                value={
                                    isGroupedWithPrevious &&
                                    isHasIconNext &&
                                    !isGroupedWithNext &&
                                    data?.content === 'like'
                                }
                            >
                                <BadgeItemMessage isMe={isMe} time={currentTimestamp} badge />
                            </RenderIf>
                            <RenderIf
                                value={
                                    prevTimestamp !== currentTimestamp &&
                                    isHasIconPrevious &&
                                    !isHasIconNext &&
                                    !isGroupedWithPrevious &&
                                    !isGroupedWithNext &&
                                    !isLast
                                }
                            >
                                <BadgeItemMessage isMe={isMe} time={currentTimestamp} />
                            </RenderIf>
                            <RenderIf
                                value={
                                    !isGroupedWithPrevious &&
                                    !isGroupedWithNext &&
                                    isHasIconNext &&
                                    prevTimestamp !== currentTimestamp &&
                                    !isHasIconPrevious &&
                                    data?.content !== 'like'
                                }
                            >
                                <BadgeItemMessage isMe={isMe} time={currentTimestamp} />
                            </RenderIf>
                            <RenderIf
                                value={
                                    !isGroupedWithPrevious &&
                                    !isGroupedWithNext &&
                                    isHasIconNext &&
                                    prevTimestamp !== currentTimestamp &&
                                    !isHasIconPrevious &&
                                    data?.content === 'like'
                                }
                            >
                                <BadgeItemMessage isMe={isMe} time={currentTimestamp} badge />
                            </RenderIf>
                            <RenderIf
                                value={
                                    !isGroupedWithPrevious &&
                                    !isGroupedWithNext &&
                                    isHasIconNext &&
                                    prevTimestamp !== currentTimestamp &&
                                    isHasIconPrevious &&
                                    data?.content !== 'like'
                                }
                            >
                                <BadgeItemMessage isMe={isMe} time={currentTimestamp} />
                            </RenderIf>
                            <RenderIf
                                value={
                                    !isGroupedWithPrevious && !isGroupedWithNext && data?.content !== 'like' && isLast
                                }
                            >
                                <BadgeItemMessage isMe={isMe} time={currentTimestamp} />
                            </RenderIf>
                            <RenderIf value={!isGroupedWithPrevious && !isGroupedWithNext}>
                                <RenderIf value={data?.content !== 'like' && !isLast && isMe}>
                                    <BadgeItemMessage isMe={isMe} time={currentTimestamp} />
                                </RenderIf>
                                <RenderIf
                                    value={data?.content === 'like' && isHasIconPrevious && isGroupedWithPrevious}
                                >
                                    <BadgeItemMessage isMe={isMe} time={currentTimestamp} badge />
                                </RenderIf>
                            </RenderIf>
                            <RenderIf
                                value={
                                    !isGroupedWithPrevious && !isGroupedWithNext && data?.content === 'like' && !isMe
                                }
                            >
                                <div className="badge badge-neutral rounded-full mt-1 mr-2">
                                    <span>{currentTimestamp}</span>
                                </div>
                            </RenderIf>
                        </div>
                    </motion.div>
                </div>
                <div className="w-full flex justify-end">
                    <RenderIf value={isLast && isMe}>
                        <RenderIf value={isSending}>
                            <div className="badge badge-neutral rounded-full mt-1">
                                <IoCheckmark />
                                <span className="ml-1">{t('chatBox.sending')}</span>
                            </div>
                        </RenderIf>
                        <RenderIf value={!isSending}>
                            <div className="flex">
                                <RenderIf
                                    value={!isGroupedWithPrevious && !isGroupedWithNext && data?.content === 'like'}
                                >
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
                        <RenderIf value={!isGroupedWithPrevious && !isGroupedWithNext && data?.content === 'like'}>
                            <div className="badge badge-neutral rounded-full mt-1 mr-2">
                                <span>{currentTimestamp}</span>
                            </div>
                        </RenderIf>
                    </RenderIf>
                </div>
            </>
        );
    },
);

MessageCard.propTypes = {
    isMe: PropTypes.bool,
    content: PropTypes.string,
    isGroupedWithPrevious: PropTypes.bool,
    isGroupedWithNext: PropTypes.bool,
};

export default MessageCard;

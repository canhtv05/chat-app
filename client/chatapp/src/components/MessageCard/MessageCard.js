import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkDone, IoCheckmark } from 'react-icons/io5';

import RenderIf from '../RenderIf';
import { AiFillLike } from 'react-icons/ai';

const MessageCard = forwardRef(({ isMe, content, isSending, isLast }, ref) => {
    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }} // Tạo ra một hiệu ứng fade-in từ dưới lên
                animate={{ opacity: 1, y: 0 }} // Khi tin nhắn đã xuất hiện, nó sẽ trở lại vị trí ban đầu
                exit={{ opacity: 0, y: -20 }} // Khi tin nhắn bị loại bỏ, nó sẽ mờ đi và trượt lên
                className="max-w-[50%]"
            >
                <RenderIf value={content !== 'like'}>
                    <div
                        ref={ref}
                        className={`p-2 px-3 rounded-3xl border-base-300 border break-words ${
                            isMe ? 'bg-primary text-neutral-content' : 'bg-base-200'
                        }`}
                    >
                        <p>{content}</p>
                    </div>
                </RenderIf>
                <RenderIf value={content === 'like'}>
                    <div ref={ref}>
                        <AiFillLike className="size-16 text-primary" />
                    </div>
                </RenderIf>
                <div className="w-full flex justify-end">
                    <RenderIf value={isLast && isMe}>
                        <RenderIf value={isSending}>
                            <div className="badge badge-neutral mt-1">
                                <IoCheckmark />
                                <span className="ml-1">sending</span>
                            </div>
                        </RenderIf>
                        <RenderIf value={!isSending}>
                            <div className="badge badge-neutral mt-1">
                                <IoCheckmarkDone />
                                <span className="ml-1">sent</span>
                            </div>
                        </RenderIf>
                    </RenderIf>
                </div>
            </motion.div>
        </div>
    );
});

MessageCard.propTypes = {
    isMe: PropTypes.bool,
    content: PropTypes.string,
};

export default MessageCard;

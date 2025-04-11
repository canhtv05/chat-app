import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const MessageCard = forwardRef(({ isMe, content }, ref) => {
    return (
        <div
            ref={ref}
            className={`p-2 max-w-[50%] px-3 rounded-3xl border-base-300 border break-words ${
                isMe ? 'self-end bg-primary text-neutral-content' : 'self-start bg-base-200'
            }`}
        >
            <p>{content}</p>
        </div>
    );
});

MessageCard.propTypes = {
    isMe: PropTypes.bool,
    content: PropTypes.string,
};

export default MessageCard;

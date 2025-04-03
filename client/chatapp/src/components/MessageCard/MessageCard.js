import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const MessageCard = forwardRef(({ isMe, content }, ref) => {
    return (
        <div
            ref={ref}
            className={`p-2 max-w-[50%] px-3 text-text-light rounded-3xl border-border border break-words ${
                isMe ? 'self-end bg-green-700 text-white' : 'self-start bg-background-secondary'
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

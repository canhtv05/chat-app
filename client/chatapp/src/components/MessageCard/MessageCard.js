import PropTypes from 'prop-types';

function MessageCard({ isMe, content }) {
    return (
        <div
            className={`p-2 max-w-[50%] text-text-light rounded-xl border-border border ${
                isMe ? 'self-end bg-green-700 text-white' : 'self-start bg-background-secondary'
            }`}
        >
            <p>{content}</p>
        </div>
    );
}

MessageCard.propTypes = {
    isMe: PropTypes.bool,
    content: PropTypes.string,
};

export default MessageCard;

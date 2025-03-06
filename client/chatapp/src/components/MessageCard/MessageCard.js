import PropTypes from 'prop-types';

function MessageCard({ isMe, content }) {
    return (
        <div
            className={`p-2 rounded-md max-w-[50%] text-text-light border-border border ${
                isMe ? 'self-start bg-background-secondary' : 'self-end bg-green-700 text-white'
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

function BadgeItemMessage({ isMe, time, badge = false }) {
    return (
        <div className={`flex w-full mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`text-xs ${isMe ? 'text-neutral-content' : 'text-base-content'} mt-2 rounded-full ${
                    badge ? (isMe ? 'badge bg-base-content' : 'badge bg-base-200 border-base-300 border') : ''
                }`}
            >
                <span>{time}</span>
            </div>
        </div>
    );
}

export default BadgeItemMessage;

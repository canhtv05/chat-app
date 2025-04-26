function BadgeItemMessage({ isMe, time, badge = false }) {
    return (
        <div className={`flex w-full mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`text-xs ${isMe ? 'text-neutral-content' : 'text-base-content'} mt-2 rounded-full ${
                    badge && 'badge badge-neutral'
                }`}
            >
                <span>{time}</span>
            </div>
        </div>
    );
}

export default BadgeItemMessage;

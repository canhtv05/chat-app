import { useState, useEffect } from 'react';

const getTimeDifferenceInSeconds = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now - past;
    return Math.floor(diffInMs / 1000);
};

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let result = `${day}/${month}/${year}`;
    if (result.includes('NaN')) result = '';
    return result;
};

const useTimeAgo = (timestamp) => {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        const updateTimeAgo = () => {
            const seconds = getTimeDifferenceInSeconds(timestamp);

            if (seconds < 60) {
                // setTimeAgo(`${seconds}s ago`);
                setTimeAgo('now');
            } else if (seconds < 3600) {
                const minutes = Math.floor(seconds / 60);
                setTimeAgo(`${minutes}m ago`);
            } else if (seconds < 86400) {
                const hours = Math.floor(seconds / 3600);
                setTimeAgo(`${hours}h ago`);
            } else {
                setTimeAgo(formatDate(timestamp));
            }
        };

        updateTimeAgo();

        const interval = setInterval(updateTimeAgo, 1000);

        return () => clearInterval(interval);
    }, [timestamp]);

    return timeAgo;
};

export default useTimeAgo;

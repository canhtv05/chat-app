import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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

    return { day, month, year };
};

const useTimeAgo = (timestamp) => {
    const { t } = useTranslation();
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        const updateTimeAgo = () => {
            const seconds = getTimeDifferenceInSeconds(timestamp);
            const now = new Date();
            const past = new Date(timestamp);

            // Thời gian dưới 1 phút
            if (seconds < 60) {
                setTimeAgo(t('time.now'));
            }
            // Thời gian dưới 1 giờ
            else if (seconds < 3600) {
                const minutes = Math.floor(seconds / 60);
                setTimeAgo(`${minutes} ${t('time.minutesAgo')}`);
            }
            // Thời gian dưới 1 ngày
            else if (seconds < 86400) {
                const hours = Math.floor(seconds / 3600);
                setTimeAgo(`${hours} ${t('time.hoursAgo')}`);
            }
            // Thời gian dưới 3 ngày
            else if (seconds < 86400 * 3) {
                const days = Math.floor(seconds / 86400);
                setTimeAgo(`${days} ${t('time.daysAgo')}`);
            }
            // Thời gian lớn hơn 3 ngày
            else {
                const { day, month, year } = formatDate(timestamp);
                const isNewYear = past.getFullYear() !== now.getFullYear();

                if (isNewYear) {
                    // Nếu lệch năm, hiển thị ngày/tháng/năm
                    setTimeAgo(`${day}/${month}/${year}`);
                } else {
                    // Nếu không lệch năm, chỉ hiển thị ngày/tháng
                    setTimeAgo(`${day}/${month}`);
                }
            }
        };

        updateTimeAgo();

        const interval = setInterval(updateTimeAgo, 1000);

        return () => clearInterval(interval);
    }, [timestamp, t]);

    return timeAgo;
};

export default useTimeAgo;

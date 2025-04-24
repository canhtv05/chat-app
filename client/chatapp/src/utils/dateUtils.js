class DateUtils {
    static getHoursAndMinutes(date) {
        if (!date) return;

        const current = new Date(date);
        const hours = current.getHours().toString().padStart(2, '0');
        const minutes = current.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`;
    }

    static getDateSeparator(currentTimestamp, prevTimestamp) {
        if (!currentTimestamp) return null;
        const currentDate = new Date(currentTimestamp);
        const prevDate = prevTimestamp ? new Date(prevTimestamp) : null;
        const today = new Date();

        const padZero = (num) => (num < 10 ? `0${num}` : num);

        const isSameDay = (date1, date2) => {
            return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
            );
        };

        const getDaysDiff = (date1, date2) => {
            if (!date1 || !date2) return null;
            return Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
        };

        if (prevDate && isSameDay(currentDate, prevDate)) {
            return null;
        }

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const day = padZero(currentDate.getDate());
        const month = padZero(currentDate.getMonth() + 1);

        if (isSameDay(currentDate, today)) {
            return 'Today';
        }

        if (getDaysDiff(today, currentDate) <= 7) {
            return `${daysOfWeek[currentDate.getDay()]}, ${day}/${month}`;
        }

        if (currentDate.getFullYear() === today.getFullYear()) {
            return `${day}/${month}`;
        }

        const year = currentDate.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

export default DateUtils;

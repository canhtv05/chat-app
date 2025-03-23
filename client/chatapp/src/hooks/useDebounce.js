const { useState, useEffect } = require('react');

function useDebounce(value, delay = 1000) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounced(value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [delay, value]);

    return debounced;
}

export default useDebounce;
